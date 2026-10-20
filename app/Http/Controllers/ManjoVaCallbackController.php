<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Services\ManjoService;
use App\Services\PaymentSettlementService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ManjoVaCallbackController extends Controller
{
    protected ManjoService $manjoService;
    protected PaymentSettlementService $settlementService;

    public function __construct(ManjoService $manjoService, PaymentSettlementService $settlementService)
    {
        $this->manjoService = $manjoService;
        $this->settlementService = $settlementService;
    }

    /**
     * Dedicated POST endpoint untuk callback Virtual Account Manjo (Dashboard API).
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function handle(Request $request): JsonResponse
    {
        // 1. IP Allowlist Validation
        $clientIp = $request->ip() ?: '127.0.0.1';
        if (!$this->manjoService->isVaIpAllowed($clientIp)) {
            Log::warning('Manjo VA Callback: Rejected unauthorized source IP', [
                'ip' => $clientIp,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Unauthorized source IP address',
            ], 403);
        }

        // 2. Audit Trail yang Aman (Sanitasi Data)
        Log::info('Manjo VA Callback received', [
            'ip' => $clientIp,
            'payload' => $this->manjoService->sanitizeData($request->all()),
        ]);

        // 3. Validasi Keberadaan Field Utama
        $trxId = trim((string) $request->input('trx_id', ''));
        if (empty($trxId)) {
            return response()->json([
                'success' => false,
                'message' => 'Field trx_id wajib diisi',
            ], 400);
        }

        if (!$request->has('status') || $request->input('status') === null) {
            return response()->json([
                'success' => false,
                'message' => 'Field status wajib diisi',
            ], 400);
        }

        $status = (int) $request->input('status');

        // 4. Pencarian Invoice Terkait
        /** @var Invoice|null $invoice */
        $invoice = Invoice::where('payment_reference', $trxId)->first();
        if (!$invoice) {
            $invoice = Invoice::where('invoice_code', $trxId)->first();
        }

        if (!$invoice) {
            Log::warning('Manjo VA Callback: Invoice tidak ditemukan untuk trx_id', [
                'trx_id' => $trxId,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Invoice not found',
            ], 404);
        }

        // 5. Validasi Nominal Pembayaran
        if ($request->filled('amount')) {
            $incomingAmount = (float) $request->input('amount');
            $invoiceAmount = (float) $invoice->amount;

            if (abs($incomingAmount - $invoiceAmount) > 0.01) {
                Log::warning('Manjo VA Callback: Nominal pembayaran tidak sesuai', [
                    'invoice_code' => $invoice->invoice_code,
                    'expected' => $invoiceAmount,
                    'received' => $incomingAmount,
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Amount mismatch with stored invoice',
                ], 422);
            }
        }

        // 6. Validasi Bank Code dan Nomor Virtual Account
        $payloadBankCode = strtoupper(trim((string) $request->input(
            'method_payload.bank_code',
            $request->input('issuer_name', '')
        )));
        $payloadVaNumber = trim((string) $request->input('method_payload.virtual_account_no', ''));

        if (!empty($invoice->payment_channel) && !empty($payloadBankCode)) {
            if (strtoupper($invoice->payment_channel) !== $payloadBankCode) {
                Log::warning('Manjo VA Callback: Bank code tidak sesuai', [
                    'invoice_code' => $invoice->invoice_code,
                    'expected' => strtoupper($invoice->payment_channel),
                    'received' => $payloadBankCode,
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Bank code mismatch with stored invoice',
                ], 422);
            }
        }

        if (!empty($invoice->va_number) && !empty($payloadVaNumber)) {
            if ($invoice->va_number !== $payloadVaNumber) {
                Log::warning('Manjo VA Callback: Virtual Account number tidak sesuai', [
                    'invoice_code' => $invoice->invoice_code,
                    'expected' => $invoice->va_number,
                    'received' => $payloadVaNumber,
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Virtual account number mismatch with stored invoice',
                ], 422);
            }
        }

        // 7. Penanganan Status Transaksi (0=Pending, 1=Reject, 2=Cancel, 3=Expired, 4=Obscure, 5=Completed)
        switch ($status) {
            case 5: // Completed
                if ($invoice->status === 'paid') {
                    Log::info('Manjo VA Callback: Invoice already paid (idempotent)', [
                        'invoice_code' => $invoice->invoice_code,
                        'trx_id' => $trxId,
                    ]);
                } else {
                    $paidAt = $request->filled('paid_at')
                        ? Carbon::parse($request->input('paid_at'))
                        : Carbon::now('Asia/Jakarta');

                    $this->settlementService->settle($invoice, [
                        'paid_at' => $paidAt,
                        'payment_method' => 'manjo',
                        'payment_channel' => $payloadBankCode ?: $invoice->payment_channel,
                        'payment_reference' => $trxId,
                        'va_number' => $payloadVaNumber ?: $invoice->va_number,
                        'amount' => $request->filled('amount') ? (float) $request->input('amount') : null,
                        'currency' => 'IDR',
                    ]);
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Callback processed successfully',
                ], 200);

            case 0: // Pending
                Log::info('Manjo VA Callback: Payment pending', [
                    'invoice_code' => $invoice->invoice_code,
                    'trx_id' => $trxId,
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Payment pending acknowledged',
                ], 200);

            case 1: // Reject
            case 2: // Cancel
            case 3: // Expired
                if ($invoice->status === 'paid') {
                    Log::warning('Manjo VA Callback: Received fail/cancel/expire status for already paid invoice. Downgrade prevented.', [
                        'invoice_code' => $invoice->invoice_code,
                        'status' => $status,
                    ]);

                    return response()->json([
                        'success' => true,
                        'message' => 'Invoice already paid, cannot be reopened or downgraded',
                    ], 200);
                }

                $statusNames = [
                    1 => 'rejected',
                    2 => 'cancelled',
                    3 => 'expired',
                ];
                $reason = 'Manjo VA payment ' . ($statusNames[$status] ?? 'failed');
                $this->settlementService->fail($invoice, $reason, (string) $status);

                return response()->json([
                    'success' => true,
                    'message' => 'Invoice marked as failed',
                ], 200);

            case 4: // Obscure
                Log::warning('Manjo VA Callback: Obscure status (4) received', [
                    'invoice_code' => $invoice->invoice_code,
                    'trx_id' => $trxId,
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Obscure status acknowledged',
                ], 200);

            default:
                Log::warning('Manjo VA Callback: Unrecognized status received', [
                    'invoice_code' => $invoice->invoice_code,
                    'trx_id' => $trxId,
                    'status' => $status,
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Unrecognized payment status',
                ], 400);
        }
    }
}
