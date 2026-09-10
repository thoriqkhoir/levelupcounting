<?php

namespace App\Http\Controllers\User\Profile;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index()
    {
        $userId = Auth::id();
        $myTransactions = Invoice::with([
            'courseItems.course',
            'bootcampItems.bootcamp',
            'webinarItems.webinar',
            'bundleEnrollments.bundle.bundleItems.bundleable',
            'certificationProgramItems.certificationProgram',
            'discountUsage.discountCode',
            'installmentTerms',
        ])
            ->where('user_id', $userId)
            ->whereNull('parent_invoice_id')
            ->orderBy('created_at', 'desc')
            ->get();

        $myTransactions->transform(function ($invoice) {
            if ($invoice->is_installment) {
                $lastPaidTerm = $invoice->installmentTerms->where('status', 'paid')->sortByDesc('paid_at')->first();
                if ($lastPaidTerm) {
                    $invoice->paid_at = $invoice->paid_at ?? $lastPaidTerm->paid_at;
                    $invoice->payment_channel = $invoice->payment_channel ?? $lastPaidTerm->payment_channel;
                    $invoice->payment_method = $invoice->payment_method ?? ($lastPaidTerm->payment_method ?? 'Cicilan');
                }
            }
            return $invoice;
        });

        return Inertia::render('user/profile/transaction/index', ['myTransactions' => $myTransactions]);
    }

    public function show($id)
    {
        $userId = Auth::id();
        $invoice = Invoice::with([
            'courseItems.course',
            'bootcampItems.bootcamp',
            'webinarItems.webinar',
            'bundleEnrollments.bundle.bundleItems.bundleable',
            'certificationProgramItems.certificationProgram',
            'discountUsage.discountCode',
            'installmentTerms',
            'parentInvoice.installmentTerms',
        ])
            ->where('user_id', $userId)
            ->findOrFail($id);

        if ($invoice->is_installment) {
            $lastPaidTerm = $invoice->installmentTerms->where('status', 'paid')->sortByDesc('paid_at')->first();
            if ($lastPaidTerm) {
                $invoice->paid_at = $invoice->paid_at ?? $lastPaidTerm->paid_at;
                $invoice->payment_channel = $invoice->payment_channel ?? $lastPaidTerm->payment_channel;
                $invoice->payment_method = $invoice->payment_method ?? ($lastPaidTerm->payment_method ?? 'Cicilan');
            }
        }

        // Tambahkan is_overdue ke setiap termin cicilan
        $invoice->installmentTerms->transform(function ($term) {
            $term->is_overdue = $term->installment_due_date
                && $term->status !== 'paid'
                && Carbon::now('Asia/Jakarta')->gt(Carbon::parse($term->installment_due_date)->endOfDay());
            return $term;
        });

        return Inertia::render('user/profile/transaction/show', ['invoice' => $invoice]);
    }
}
