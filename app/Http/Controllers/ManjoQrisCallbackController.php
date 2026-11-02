<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Services\ManjoService;
use App\Services\PaymentSettlementService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ManjoQrisCallbackController extends Controller
{
    protected ManjoService $manjoService;
    protected PaymentSettlementService $settlementService;

    public function __construct(ManjoService $manjoService, PaymentSettlementService $settlementService)
    {
        $this->manjoService = $manjoService;
        $this->settlementService = $settlementService;
    }

    /**
     * Dedicated POST endpoint untuk menerima notifikasi pembayaran QRIS Manjo (SNAP BI Standard).
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function handle(Request $request): JsonResponse
    {
        // 1. Audit trail yang aman: catat notifikasi masuk dengan menyensor token & secret
        Log::info('Manjo QRIS Notification received', [
            'headers' => $this->manjoService->sanitizeData($request->headers->all()),
            'payload' => $this->manjoService->sanitizeData($request->all()),
        ]);

        // 2. Verifikasi Header Wajib & Signature HMAC-SHA512 secara timing-safe
        try {
            $verification = $this->manjoService->verifyQrisNotification($request);
        } catch (\Throwable $e) {
            Log::error('Manjo QRIS Notification signature verification error', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'responseCode' => '4015200',
                'responseMessage' => 'Unauthorized. Signature verification error.',
            ], 401);
        }

        if (!$verification['valid']) {
            $errorType = $verification['error_type'] ?? 'signature';
            $field = $verification['field'] ?? 'X-SIGNATURE';
            $msg = $verification['message'] ?? 'Unauthorized request.';

            Log::warning('Manjo QRIS Notification validation failed', [
                'error_type' => $errorType,
                'field' => $field,
                'message' => $msg,
            ]);

            if ($errorType === 'mandatory_header') {
                return response()->json([
                    'responseCode' => '4005202',
                    'responseMessage' => "Invalid Mandatory Field {$field}",
                ], 400);
            }

            if ($errorType === 'unauthorized') {
                return response()->json([
                    'responseCode' => '4015200',
                    'responseMessage' => "Unauthorized. {$msg}",
                ], 401);
            }

            return response()->json([
                'responseCode' => '4015200',
                'responseMessage' => "Unauthorized. {$msg}",
            ], 401);
        }

        // 3. Validasi Request Body JSON
        $payload = $request->json()->all();
        if (empty($payload) || !is_array($payload)) {
            Log::warning('Manjo QRIS Notification: Empty or invalid JSON payload format');
            return response()->json([
                'responseCode' => '4005201',
                'responseMessage' => 'Invalid Field Format requestBody',
            ], 400);
        }

        // 4. Ekstraksi Nomor Referensi Transaksi
        $partnerRef = $payload['originalPartnerReferenceNo'] ?? null;
        $providerRef = $payload['originalReferenceNo'] ?? null;

        if (empty($partnerRef) && empty($providerRef)) {
            Log::warning('Manjo QRIS Notification: Missing reference numbers in payload');
            return response()->json([
                'responseCode' => '4005202',
                'responseMessage' => 'Invalid Mandatory Field originalPartnerReferenceNo',
            ], 400);
        }

        // 5. Cari Invoice di Database
        /** @var Invoice|null $invoice */
        $invoice = null;

        if (!empty($partnerRef)) {
            $invoice = Invoice::where('invoice_code', $partnerRef)
                ->orWhere('payment_reference', $partnerRef)
                ->first();
        }

        if (!$invoice && !empty($providerRef)) {
            $invoice = Invoice::where('payment_reference', $providerRef)->first();
        }

        if (!$invoice) {
            Log::warning('Manjo QRIS Notification: Invoice not found', [
                'originalPartnerReferenceNo' => $partnerRef,
                'originalReferenceNo' => $providerRef,
            ]);

            return response()->json([
                'responseCode' => '4045201',
                'responseMessage' => 'Transaction Not Found',
            ], 404);
        }

        // 6. Validasi Mata Uang & Nominal
        $amountData = $payload['amount'] ?? [];
        if (!is_array($amountData)) {
            return response()->json([
                'responseCode' => '4005201',
                'responseMessage' => 'Invalid Field Format amount',
            ], 400);
        }

        $currency = $amountData['currency'] ?? 'IDR';
        if (strtoupper((string) $currency) !== 'IDR') {
            Log::warning('Manjo QRIS Notification: Unsupported currency', [
                'invoice_code' => $invoice->invoice_code,
                'currency' => $currency,
            ]);

            return response()->json([
                'responseCode' => '4005201',
                'responseMessage' => 'Invalid Field Format currency',
            ], 400);
        }

        if (!isset($amountData['value'])) {
            return response()->json([
                'responseCode' => '4005202',
                'responseMessage' => 'Invalid Mandatory Field amount.value',
            ], 400);
        }

        $incomingAmount = (float) $amountData['value'];
        $invoiceAmount = (float) $invoice->amount;

        if (abs($incomingAmount - $invoiceAmount) > 0.01) {
            Log::warning('Manjo QRIS Notification: Amount mismatch', [
                'invoice_code' => $invoice->invoice_code,
                'expected_amount' => $invoiceAmount,
                'incoming_amount' => $incomingAmount,
            ]);

            return response()->json([
                'responseCode' => '4005201',
                'responseMessage' => 'Invalid Field Format amount.value',
            ], 400);
        }

        // 7. Resolusi Status: Utamakan latestTransactionStatus sesuai konfirmasi Manjo
        $hasLatest = array_key_exists('latestTransactionStatus', $payload);
        $hasTxStatus = array_key_exists('transactionStatus', $payload);

        if (!$hasLatest && $hasTxStatus) {
            Log::notice('Manjo QRIS Notification: Payload uses transactionStatus instead of latestTransactionStatus', [
                'invoice_code' => $invoice->invoice_code,
                'transactionStatus' => $payload['transactionStatus'],
            ]);
            $status = (string) $payload['transactionStatus'];
        } elseif ($hasLatest) {
            $status = (string) $payload['latestTransactionStatus'];
        } else {
            Log::warning('Manjo QRIS Notification: Neither latestTransactionStatus nor transactionStatus found in payload', [
                'invoice_code' => $invoice->invoice_code,
            ]);

            return response()->json([
                'responseCode' => '4005202',
                'responseMessage' => 'Invalid Mandatory Field latestTransactionStatus',
            ], 400);
        }

        // 8. Pemetaan Status Sesuai Kontrak Manjo:
        // 00 = Success, 03 = Paid
        // 04 = Pending
        // 05 = Refunded
        // 06 = Cancelled
        // 01 = Failed
        // 02 = Not Found
        switch ($status) {
            case '00': // Success
            case '03': // Paid
                if ($invoice->status === 'paid') {
                    Log::info('Manjo QRIS Notification: Invoice already paid (idempotent)', [
                        'invoice_code' => $invoice->invoice_code,
                        'reference' => $providerRef ?: $partnerRef,
                    ]);
                } else {
                    $this->settlementService->settle($invoice, [
                        'paid_at' => Carbon::now('Asia/Jakarta'),
                        'payment_method' => 'manjo',
                        'payment_channel' => 'qris',
                        'payment_reference' => $providerRef ?: $partnerRef,
                        'amount' => $incomingAmount,
                        'currency' => 'IDR',
                    ]);
                }

                return response()->json([
                    'responseCode' => '2005200',
                    'responseMessage' => 'Successful',
                ], 200);

            case '04': // Pending
                Log::info('Manjo QRIS Notification: Transaction pending', [
                    'invoice_code' => $invoice->invoice_code,
                    'status' => $status,
                ]);

                return response()->json([
                    'responseCode' => '2005200',
                    'responseMessage' => 'Successful',
                ], 200);

            case '01': // Failed
            case '05': // Refunded
            case '06': // Cancelled
                if ($invoice->status === 'paid') {
                    Log::warning('Manjo QRIS Notification: Received non-success status for already paid invoice. Downgrade prevented.', [
                        'invoice_code' => $invoice->invoice_code,
                        'status' => $status,
                    ]);
                } else {
                    $statusNames = [
                        '01' => 'failed',
                        '05' => 'refunded',
                        '06' => 'cancelled',
                    ];
                    $reason = 'Manjo QRIS payment ' . ($statusNames[$status] ?? 'unsuccessful');
                    $this->settlementService->fail($invoice, $reason, $status);
                }

                return response()->json([
                    'responseCode' => '2005200',
                    'responseMessage' => 'Successful',
                ], 200);

            case '02': // Not Found
                Log::warning('Manjo QRIS Notification: Transaction reported as Not Found (02) by provider', [
                    'invoice_code' => $invoice->invoice_code,
                ]);

                return response()->json([
                    'responseCode' => '2005200',
                    'responseMessage' => 'Successful',
                ], 200);

            default:
                Log::warning('Manjo QRIS Notification: Unrecognized latestTransactionStatus received', [
                    'invoice_code' => $invoice->invoice_code,
                    'status' => $status,
                ]);

                return response()->json([
                    'responseCode' => '4005201',
                    'responseMessage' => 'Invalid Field Format latestTransactionStatus',
                ], 400);
        }
    }
}
