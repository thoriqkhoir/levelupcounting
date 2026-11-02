<?php

namespace Tests\Feature\Payment;

use App\Events\TransactionPaid;
use App\Models\AffiliateEarning;
use App\Models\Bundle;
use App\Models\BundleItem;
use App\Models\Category;
use App\Models\Certificate;
use App\Models\CertificateParticipant;
use App\Models\Course;
use App\Models\DiscountCode;
use App\Models\DiscountUsage;
use App\Models\Invoice;
use App\Models\PointTransaction;
use App\Models\User;
use App\Services\ManjoService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Mail;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ManjoCallbackTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected User $affiliate;
    protected User $admin;
    protected Course $course;
    protected Certificate $certificate;
    protected ManjoService $manjoService;

    protected string $clientSecret = 'test_qris_secret_999';
    protected string $partnerId = 'TEST_PARTNER_999';

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();

        Role::firstOrCreate(['name' => 'admin']);
        Role::firstOrCreate(['name' => 'user']);
        Role::firstOrCreate(['name' => 'affiliate']);

        Config::set('manjo.environment', 'uat');
        Config::set('manjo.qris.client_key', 'test_qris_client_key');
        Config::set('manjo.qris.client_secret', $this->clientSecret);
        Config::set('manjo.qris.partner_id', $this->partnerId);
        Config::set('manjo.qris.merchant_id', $this->partnerId);
        Config::set('manjo.qris.callback_url', 'http://localhost/api/callback/manjo/qris');
        Config::set('manjo.va.api_key', 'test_va_api_key');
        Config::set('manjo.va.callback_url', 'http://localhost/api/callback/manjo/va');

        $this->manjoService = app(ManjoService::class);

        $this->admin = User::factory()->create([
            'name' => 'Admin Level Up',
            'email' => 'admin@levelup.com',
        ]);
        $this->admin->assignRole('admin');

        $this->affiliate = User::factory()->create([
            'name' => 'Affiliate Partner',
            'email' => 'affiliate@levelup.com',
            'affiliate_status' => 'Active',
            'commission' => 10,
        ]);
        $this->affiliate->assignRole('affiliate');

        $this->user = User::factory()->create([
            'name' => 'Student Level Up',
            'email' => 'student@example.com',
            'phone_number' => '081234567890',
            'point_balance' => 20000,
        ]);
        $this->user->assignRole('user');

        $category = Category::firstOrCreate(
            ['slug' => 'accounting'],
            ['name' => 'Accounting']
        );

        $this->course = Course::create([
            'title' => 'Advanced Financial Accounting',
            'slug' => 'advanced-financial-accounting',
            'price' => 100000,
            'strikethrough_price' => 150000,
            'category_id' => $category->id,
            'user_id' => $this->admin->id,
            'status' => 'published',
        ]);

        $design = \App\Models\CertificateDesign::create([
            'name' => 'Default Certificate Design',
        ]);

        $sign = \App\Models\CertificateSign::create([
            'name' => 'Default Signer',
            'position' => 'Director',
        ]);

        $this->certificate = Certificate::create([
            'course_id' => $this->course->id,
            'title' => 'Certificate in Advanced Accounting',
            'certificate_number' => 'CERT-' . strtoupper(bin2hex(random_bytes(4))),
            'design_id' => $design->id,
            'sign_id' => $sign->id,
        ]);
    }

    /**
     * Helper to create a standard pending invoice
     */
    protected function createPendingInvoice(array $overrides = []): Invoice
    {
        $uniqueCode = 'INV-TEST-' . strtoupper(bin2hex(random_bytes(4)));

        $invoice = Invoice::create(array_merge([
            'invoice_code' => $uniqueCode,
            'user_id' => $this->user->id,
            'amount' => 100000,
            'nett_amount' => 100000,
            'points_redeemed' => 0,
            'status' => 'pending',
            'payment_method' => 'manjo',
            'payment_channel' => 'qris',
            'payment_reference' => 'REF-' . $uniqueCode,
            'expires_at' => Carbon::now()->addMinutes(15),
            'referred_by_user_id' => $this->affiliate->id,
        ], $overrides));

        $invoice->courseItems()->create([
            'course_id' => $this->course->id,
            'price' => 100000,
        ]);

        return $invoice;
    }

    /**
     * Helper to build signed QRIS notification request
     */
    protected function postQrisNotification(array $payload, array $headerOverrides = [], ?string $endpointUrl = '/api/callback/manjo/qris')
    {
        $bodyJson = json_encode($payload, JSON_UNESCAPED_SLASHES);
        $minifiedBody = json_encode(json_decode($bodyJson, true), JSON_UNESCAPED_SLASHES);
        $bodyHash = strtolower(hash('sha256', $minifiedBody));
        $timestamp = now()->toIso8601String();
        $token = 'dummy_access_token_123';

        $stringToSign = "POST:{$endpointUrl}:{$token}:{$bodyHash}:{$timestamp}";
        $signature = hash_hmac('sha512', $stringToSign, $this->clientSecret);

        $headers = array_merge([
            'Content-Type' => 'application/json',
            'Authorization' => "Bearer {$token}",
            'X-TIMESTAMP' => $timestamp,
            'X-SIGNATURE' => $signature,
            'X-PARTNER-ID' => $this->partnerId,
            'X-EXTERNAL-ID' => 'ext-' . bin2hex(random_bytes(6)),
            'CHANNEL-ID' => '05',
        ], $headerOverrides);

        return $this->postJson($endpointUrl, $payload, $headers);
    }

    /*
    |--------------------------------------------------------------------------
    | 1. QRIS NOTIFICATION TESTS
    |--------------------------------------------------------------------------
    */

    public function test_valid_qris_success_status_00_settles_invoice_and_creates_enrollments(): void
    {
        Event::fake([TransactionPaid::class]);
        Mail::fake();

        $invoice = $this->createPendingInvoice([
            'amount' => 100000,
            'payment_reference' => 'REF-MANJO-QRIS-001',
        ]);

        $payload = [
            'originalReferenceNo' => 'REF-MANJO-QRIS-001',
            'originalPartnerReferenceNo' => $invoice->invoice_code,
            'latestTransactionStatus' => '00',
            'transactionStatusDesc' => 'SUCCESS',
            'customerNumber' => '9360082112345678919',
            'amount' => [
                'value' => '100000.00',
                'currency' => 'IDR',
            ],
            'additionalInfo' => [
                'trxTime' => now()->format('YmdHis'),
                'issuerName' => 'BCA',
            ],
        ];

        $response = $this->postQrisNotification($payload);

        $response->assertStatus(200)
            ->assertJson([
                'responseCode' => '2005200',
                'responseMessage' => 'Successful',
            ]);

        $fresh = $invoice->fresh();
        $this->assertEquals('paid', $fresh->status);
        $this->assertNotNull($fresh->paid_at);

        // Course item marked completed
        $courseItem = $fresh->courseItems->first();
        $this->assertNotNull($courseItem->completed_at);

        // Participant added to certificate
        $this->assertDatabaseHas('certificate_participants', [
            'certificate_id' => $this->certificate->id,
            'user_id' => $this->user->id,
        ]);

        // Affiliate commission recorded
        $this->assertDatabaseHas('affiliate_earnings', [
            'affiliate_user_id' => $this->affiliate->id,
            'invoice_id' => $invoice->id,
            'amount' => 10000, // 10% of 100,000
        ]);

        Event::assertDispatched(TransactionPaid::class);
    }

    public function test_valid_qris_paid_status_03_settles_invoice(): void
    {
        $invoice = $this->createPendingInvoice(['amount' => 75000]);

        $payload = [
            'originalReferenceNo' => $invoice->payment_reference,
            'originalPartnerReferenceNo' => $invoice->invoice_code,
            'latestTransactionStatus' => '03', // 03 = Paid
            'amount' => [
                'value' => '75000.00',
                'currency' => 'IDR',
            ],
        ];

        $response = $this->postQrisNotification($payload);

        $response->assertStatus(200)
            ->assertJson(['responseCode' => '2005200']);

        $this->assertEquals('paid', $invoice->fresh()->status);
    }

    public function test_qris_notification_with_invalid_signature_returns_401(): void
    {
        $invoice = $this->createPendingInvoice();

        $payload = [
            'originalReferenceNo' => $invoice->payment_reference,
            'originalPartnerReferenceNo' => $invoice->invoice_code,
            'latestTransactionStatus' => '00',
            'amount' => [
                'value' => '100000.00',
                'currency' => 'IDR',
            ],
        ];

        $response = $this->postQrisNotification($payload, [
            'X-SIGNATURE' => 'invalid_forged_hex_signature_abcdef123456',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'responseCode' => '4015200',
            ]);

        $this->assertEquals('pending', $invoice->fresh()->status);
    }

    public function test_qris_notification_missing_mandatory_headers_returns_400(): void
    {
        $invoice = $this->createPendingInvoice();
        $payload = [
            'originalReferenceNo' => $invoice->payment_reference,
            'originalPartnerReferenceNo' => $invoice->invoice_code,
            'latestTransactionStatus' => '00',
            'amount' => ['value' => '100000.00', 'currency' => 'IDR'],
        ];

        // Missing Authorization
        $resNoAuth = $this->postQrisNotification($payload, ['Authorization' => '']);
        $resNoAuth->assertStatus(400)
            ->assertJson(['responseCode' => '4005202']);

        // Missing X-TIMESTAMP
        $resNoTs = $this->postQrisNotification($payload, ['X-TIMESTAMP' => '']);
        $resNoTs->assertStatus(400)
            ->assertJson(['responseCode' => '4005202']);

        // Missing CHANNEL-ID
        $resNoChan = $this->postQrisNotification($payload, ['CHANNEL-ID' => '']);
        $resNoChan->assertStatus(400)
            ->assertJson(['responseCode' => '4005202']);
    }

    public function test_qris_notification_wrong_amount_or_currency_or_reference(): void
    {
        $invoice = $this->createPendingInvoice(['amount' => 50000]);

        // 1. Transaction Not Found
        $payloadUnknown = [
            'originalReferenceNo' => 'NON_EXISTENT_REF',
            'originalPartnerReferenceNo' => 'INV-DOES-NOT-EXIST',
            'latestTransactionStatus' => '00',
            'amount' => ['value' => '50000.00', 'currency' => 'IDR'],
        ];
        $resUnknown = $this->postQrisNotification($payloadUnknown);
        $resUnknown->assertStatus(404)
            ->assertJson([
                'responseCode' => '4045201',
                'responseMessage' => 'Transaction Not Found',
            ]);

        // 2. Amount Mismatch (50,000 expected vs 99,000 sent)
        $payloadWrongAmount = [
            'originalReferenceNo' => $invoice->payment_reference,
            'originalPartnerReferenceNo' => $invoice->invoice_code,
            'latestTransactionStatus' => '00',
            'amount' => ['value' => '99000.00', 'currency' => 'IDR'],
        ];
        $resWrongAmount = $this->postQrisNotification($payloadWrongAmount);
        $resWrongAmount->assertStatus(400)
            ->assertJson(['responseCode' => '4005201']);
        $this->assertEquals('pending', $invoice->fresh()->status);

        // 3. Currency not IDR
        $payloadWrongCurrency = [
            'originalReferenceNo' => $invoice->payment_reference,
            'originalPartnerReferenceNo' => $invoice->invoice_code,
            'latestTransactionStatus' => '00',
            'amount' => ['value' => '50000.00', 'currency' => 'USD'],
        ];
        $resWrongCurrency = $this->postQrisNotification($payloadWrongCurrency);
        $resWrongCurrency->assertStatus(400)
            ->assertJson(['responseCode' => '4005201']);
    }

    public function test_qris_notification_pending_failed_cancelled_and_refunded_statuses(): void
    {
        // 1. Pending (04) -> status remains pending
        $invPending = $this->createPendingInvoice();
        $resPending = $this->postQrisNotification([
            'originalReferenceNo' => $invPending->payment_reference,
            'originalPartnerReferenceNo' => $invPending->invoice_code,
            'latestTransactionStatus' => '04',
            'amount' => ['value' => '100000.00', 'currency' => 'IDR'],
        ]);
        $resPending->assertStatus(200)->assertJson(['responseCode' => '2005200']);
        $this->assertEquals('pending', $invPending->fresh()->status);

        // 2. Failed (01) -> status becomes failed
        $invFailed = $this->createPendingInvoice();
        $resFailed = $this->postQrisNotification([
            'originalReferenceNo' => $invFailed->payment_reference,
            'originalPartnerReferenceNo' => $invFailed->invoice_code,
            'latestTransactionStatus' => '01',
            'amount' => ['value' => '100000.00', 'currency' => 'IDR'],
        ]);
        $resFailed->assertStatus(200)->assertJson(['responseCode' => '2005200']);
        $this->assertEquals('failed', $invFailed->fresh()->status);

        // 3. Cancelled (06) -> status becomes failed
        $invCancelled = $this->createPendingInvoice();
        $resCancelled = $this->postQrisNotification([
            'originalReferenceNo' => $invCancelled->payment_reference,
            'originalPartnerReferenceNo' => $invCancelled->invoice_code,
            'latestTransactionStatus' => '06',
            'amount' => ['value' => '100000.00', 'currency' => 'IDR'],
        ]);
        $resCancelled->assertStatus(200)->assertJson(['responseCode' => '2005200']);
        $this->assertEquals('failed', $invCancelled->fresh()->status);

        // 4. Refunded (05) -> status becomes failed
        $invRefunded = $this->createPendingInvoice();
        $resRefunded = $this->postQrisNotification([
            'originalReferenceNo' => $invRefunded->payment_reference,
            'originalPartnerReferenceNo' => $invRefunded->invoice_code,
            'latestTransactionStatus' => '05',
            'amount' => ['value' => '100000.00', 'currency' => 'IDR'],
        ]);
        $resRefunded->assertStatus(200)->assertJson(['responseCode' => '2005200']);
        $this->assertEquals('failed', $invRefunded->fresh()->status);
    }

    public function test_qris_notification_fallback_to_transaction_status_when_latest_status_missing(): void
    {
        $invoice = $this->createPendingInvoice(['amount' => 50000]);

        // Manjo doc parameter table uses `transactionStatus` instead of `latestTransactionStatus`
        $payload = [
            'originalReferenceNo' => $invoice->payment_reference,
            'originalPartnerReferenceNo' => $invoice->invoice_code,
            'transactionStatus' => '00', // fallback field
            'amount' => ['value' => '50000.00', 'currency' => 'IDR'],
        ];

        $response = $this->postQrisNotification($payload);

        $response->assertStatus(200)
            ->assertJson(['responseCode' => '2005200']);

        $this->assertEquals('paid', $invoice->fresh()->status);
    }

    /*
    |--------------------------------------------------------------------------
    | 2. VIRTUAL ACCOUNT (VA) CALLBACK TESTS
    |--------------------------------------------------------------------------
    */

    public function test_valid_va_completed_callback_settles_invoice(): void
    {
        Event::fake([TransactionPaid::class]);

        $invoice = $this->createPendingInvoice([
            'amount' => 125000,
            'payment_channel' => 'BMRI',
            'payment_reference' => 'TRX-VA-MANDIRI-777',
            'va_number' => '7001400002025151',
        ]);

        $payload = [
            'trx_id' => 'TRX-VA-MANDIRI-777',
            'paid_at' => '2026-06-23T14:29:06+07:00',
            'amount' => '125000.00',
            'method' => 1,
            'status' => 5, // 5 = Completed
            'issuer_name' => 'BMRI',
            'customer_name' => 'Student Level Up',
            'method_payload' => [
                'bank_code' => 'BMRI',
                'virtual_account_no' => '7001400002025151',
            ],
        ];

        $response = $this->postJson('/api/callback/manjo/va', $payload);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Callback processed successfully',
            ]);

        $this->assertEquals('paid', $invoice->fresh()->status);
        $this->assertEquals('BMRI', $invoice->fresh()->payment_channel);
        Event::assertDispatched(TransactionPaid::class);
    }

    public function test_invalid_va_transaction_amount_bank_code_and_va_number(): void
    {
        $invoice = $this->createPendingInvoice([
            'amount' => 80000,
            'payment_channel' => 'BRIN',
            'payment_reference' => 'TRX-VA-BRIN-888',
            'va_number' => '8888000123456789',
        ]);

        // 1. Invoice Not Found
        $resNotFound = $this->postJson('/api/callback/manjo/va', [
            'trx_id' => 'UNKNOWN_TRX_999',
            'status' => 5,
            'amount' => '80000.00',
        ]);
        $resNotFound->assertStatus(404)->assertJson(['success' => false]);

        // 2. Amount Mismatch
        $resWrongAmount = $this->postJson('/api/callback/manjo/va', [
            'trx_id' => 'TRX-VA-BRIN-888',
            'status' => 5,
            'amount' => '95000.00',
            'method_payload' => [
                'bank_code' => 'BRIN',
                'virtual_account_no' => '8888000123456789',
            ],
        ]);
        $resWrongAmount->assertStatus(422)
            ->assertJson(['success' => false, 'message' => 'Amount mismatch with stored invoice']);

        // 3. Bank Code Mismatch
        $resWrongBank = $this->postJson('/api/callback/manjo/va', [
            'trx_id' => 'TRX-VA-BRIN-888',
            'status' => 5,
            'amount' => '80000.00',
            'method_payload' => [
                'bank_code' => 'BMRI', // Expected BRIN
                'virtual_account_no' => '8888000123456789',
            ],
        ]);
        $resWrongBank->assertStatus(422)
            ->assertJson(['success' => false, 'message' => 'Bank code mismatch with stored invoice']);

        // 4. VA Number Mismatch
        $resWrongVa = $this->postJson('/api/callback/manjo/va', [
            'trx_id' => 'TRX-VA-BRIN-888',
            'status' => 5,
            'amount' => '80000.00',
            'method_payload' => [
                'bank_code' => 'BRIN',
                'virtual_account_no' => '9999999999999999', // Expected 8888000123456789
            ],
        ]);
        $resWrongVa->assertStatus(422)
            ->assertJson(['success' => false, 'message' => 'Virtual account number mismatch with stored invoice']);
    }

    public function test_va_callback_statuses_pending_rejected_cancelled_expired_obscure(): void
    {
        // Status 0: Pending -> stays pending
        $inv0 = $this->createPendingInvoice(['payment_reference' => 'TRX-VA-0']);
        $this->postJson('/api/callback/manjo/va', [
            'trx_id' => 'TRX-VA-0',
            'status' => 0,
            'amount' => '100000.00',
        ])->assertStatus(200);
        $this->assertEquals('pending', $inv0->fresh()->status);

        // Status 1: Reject -> marked failed
        $inv1 = $this->createPendingInvoice(['payment_reference' => 'TRX-VA-1']);
        $this->postJson('/api/callback/manjo/va', [
            'trx_id' => 'TRX-VA-1',
            'status' => 1,
            'amount' => '100000.00',
        ])->assertStatus(200);
        $this->assertEquals('failed', $inv1->fresh()->status);

        // Status 2: Cancel -> marked failed
        $inv2 = $this->createPendingInvoice(['payment_reference' => 'TRX-VA-2']);
        $this->postJson('/api/callback/manjo/va', [
            'trx_id' => 'TRX-VA-2',
            'status' => 2,
            'amount' => '100000.00',
        ])->assertStatus(200);
        $this->assertEquals('failed', $inv2->fresh()->status);

        // Status 3: Expired -> marked failed
        $inv3 = $this->createPendingInvoice(['payment_reference' => 'TRX-VA-3']);
        $this->postJson('/api/callback/manjo/va', [
            'trx_id' => 'TRX-VA-3',
            'status' => 3,
            'amount' => '100000.00',
        ])->assertStatus(200);
        $this->assertEquals('failed', $inv3->fresh()->status);

        // Status 4: Obscure -> stays pending (not marked paid, not marked failed)
        $inv4 = $this->createPendingInvoice(['payment_reference' => 'TRX-VA-4']);
        $this->postJson('/api/callback/manjo/va', [
            'trx_id' => 'TRX-VA-4',
            'status' => 4,
            'amount' => '100000.00',
        ])->assertStatus(200);
        $this->assertEquals('pending', $inv4->fresh()->status);
    }

    public function test_va_callback_ip_allowlisting(): void
    {
        $invoice = $this->createPendingInvoice(['payment_reference' => 'TRX-VA-IP-TEST']);

        // Set whitelist to specific IPs and CIDR
        Config::set('manjo.va.ip_whitelist', '103.120.10.5, 192.168.1.0/24');
        $this->manjoService = app(ManjoService::class);

        // 1. Rejected IP
        $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.1'])
            ->postJson('/api/callback/manjo/va', [
                'trx_id' => 'TRX-VA-IP-TEST',
                'status' => 5,
                'amount' => '100000.00',
            ])->assertStatus(403);

        // 2. Allowed exact IP
        $this->withServerVariables(['REMOTE_ADDR' => '103.120.10.5'])
            ->postJson('/api/callback/manjo/va', [
                'trx_id' => 'TRX-VA-IP-TEST',
                'status' => 5,
                'amount' => '100000.00',
            ])->assertStatus(200);

        // 3. Allowed CIDR subnet IP
        $invSubnet = $this->createPendingInvoice(['payment_reference' => 'TRX-VA-IP-SUBNET']);
        $this->withServerVariables(['REMOTE_ADDR' => '192.168.1.42'])
            ->postJson('/api/callback/manjo/va', [
                'trx_id' => 'TRX-VA-IP-SUBNET',
                'status' => 5,
                'amount' => '100000.00',
            ])->assertStatus(200);
    }

    /*
    |--------------------------------------------------------------------------
    | 3. IDEMPOTENCY, SECURITY & EDGE CASE TESTS
    |--------------------------------------------------------------------------
    */

    public function test_duplicate_callbacks_idempotency_prevents_duplicate_processing(): void
    {
        $invoice = $this->createPendingInvoice([
            'amount' => 100000,
            'payment_reference' => 'REF-IDEMPOTENT-001',
        ]);

        $payload = [
            'originalReferenceNo' => 'REF-IDEMPOTENT-001',
            'originalPartnerReferenceNo' => $invoice->invoice_code,
            'latestTransactionStatus' => '00',
            'amount' => ['value' => '100000.00', 'currency' => 'IDR'],
        ];

        // First callback
        $res1 = $this->postQrisNotification($payload);
        $res1->assertStatus(200);
        $this->assertEquals('paid', $invoice->fresh()->status);
        $this->assertCount(1, AffiliateEarning::where('invoice_id', $invoice->id)->get());

        // Second duplicate callback (attempt 2)
        $res2 = $this->postQrisNotification($payload);
        $res2->assertStatus(200);

        // Third duplicate callback (attempt 3)
        $res3 = $this->postQrisNotification($payload);
        $res3->assertStatus(200);

        // Verify still exactly 1 affiliate earning record
        $this->assertCount(1, AffiliateEarning::where('invoice_id', $invoice->id)->get());
    }

    public function test_unknown_status_returns_error_and_does_not_mark_paid(): void
    {
        // QRIS with unknown status
        $invQris = $this->createPendingInvoice();
        $resQris = $this->postQrisNotification([
            'originalReferenceNo' => $invQris->payment_reference,
            'originalPartnerReferenceNo' => $invQris->invoice_code,
            'latestTransactionStatus' => '99', // Unknown status
            'amount' => ['value' => '100000.00', 'currency' => 'IDR'],
        ]);
        $resQris->assertStatus(400)->assertJson(['responseCode' => '4005201']);
        $this->assertEquals('pending', $invQris->fresh()->status);

        // VA with unknown status
        $invVa = $this->createPendingInvoice(['payment_reference' => 'TRX-VA-UNKNOWN']);
        $resVa = $this->postJson('/api/callback/manjo/va', [
            'trx_id' => 'TRX-VA-UNKNOWN',
            'status' => 99,
            'amount' => '100000.00',
        ]);
        $resVa->assertStatus(400)->assertJson(['success' => false]);
        $this->assertEquals('pending', $invVa->fresh()->status);
    }

    public function test_already_completed_invoice_cannot_be_reopened_or_downgraded(): void
    {
        // 1. Completed QRIS invoice cannot be failed by cancelled/failed callback
        $invQris = $this->createPendingInvoice(['amount' => 100000]);
        $invQris->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        $resQris = $this->postQrisNotification([
            'originalReferenceNo' => $invQris->payment_reference,
            'originalPartnerReferenceNo' => $invQris->invoice_code,
            'latestTransactionStatus' => '06', // Cancelled
            'amount' => ['value' => '100000.00', 'currency' => 'IDR'],
        ]);
        $resQris->assertStatus(200);
        $this->assertEquals('paid', $invQris->fresh()->status);

        // 2. Completed VA invoice cannot be downgraded by reject/expired callback
        $invVa = $this->createPendingInvoice([
            'amount' => 100000,
            'payment_reference' => 'TRX-VA-ALREADY-PAID',
        ]);
        $invVa->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        $resVa = $this->postJson('/api/callback/manjo/va', [
            'trx_id' => 'TRX-VA-ALREADY-PAID',
            'status' => 3, // Expired
            'amount' => '100000.00',
        ]);
        $resVa->assertStatus(200);
        $this->assertEquals('paid', $invVa->fresh()->status);
    }

    public function test_qris_failure_refunds_points_and_reverts_voucher(): void
    {
        // Setup discount code
        $discountCode = DiscountCode::create([
            'name' => 'Discount 20K',
            'code' => 'DISC20K',
            'type' => 'fixed',
            'value' => 20000,
            'minimum_amount' => 50000,
            'used_count' => 1,
            'is_active' => true,
            'starts_at' => now()->subDay(),
            'expires_at' => now()->addDays(7),
        ]);

        $invoice = $this->createPendingInvoice([
            'amount' => 70000,
            'points_redeemed' => 10000,
            'payment_reference' => 'REF-FAILED-POINTS',
        ]);

        DiscountUsage::create([
            'user_id' => $this->user->id,
            'invoice_id' => $invoice->id,
            'discount_code_id' => $discountCode->id,
            'discount_amount' => 20000,
        ]);

        // Record point deduction
        PointTransaction::create([
            'user_id' => $this->user->id,
            'type' => 'redeem',
            'source' => 'checkout',
            'amount' => -10000,
            'description' => "Penggunaan poin invoice {$invoice->invoice_code}",
            'reference_type' => Invoice::class,
            'reference_id' => $invoice->id,
        ]);

        $this->postQrisNotification([
            'originalReferenceNo' => $invoice->payment_reference,
            'originalPartnerReferenceNo' => $invoice->invoice_code,
            'latestTransactionStatus' => '01', // Failed
            'amount' => ['value' => '70000.00', 'currency' => 'IDR'],
        ])->assertStatus(200);

        $this->assertEquals('failed', $invoice->fresh()->status);

        // Voucher usage deleted & used_count decremented
        $this->assertDatabaseMissing('discount_usages', ['invoice_id' => $invoice->id]);
        $this->assertEquals(0, $discountCode->fresh()->used_count);

        // Point refund transaction created
        $this->assertDatabaseHas('point_transactions', [
            'user_id' => $this->user->id,
            'type' => 'adjustment',
            'amount' => 10000,
            'reference_type' => Invoice::class,
            'reference_id' => $invoice->id,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | 4. XENDIT AND MIDTRANS REGRESSION TESTS
    |--------------------------------------------------------------------------
    */

    public function test_xendit_callback_regression_settles_invoice(): void
    {
        Config::set('xendit.CALLBACK_TOKEN', 'test_xendit_token_123');

        $invoice = $this->createPendingInvoice([
            'payment_method' => 'xendit',
        ]);

        $payload = [
            'id' => 'xendit_inv_123',
            'external_id' => $invoice->invoice_code,
            'status' => 'PAID',
            'payment_method' => 'QR_CODE',
            'payment_channel' => 'QRIS',
        ];

        $response = $this->postJson('/api/xendit/callback', $payload, [
            'x-callback-token' => 'test_xendit_token_123',
        ]);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Success']);

        $this->assertEquals('paid', $invoice->fresh()->status);
    }

    public function test_midtrans_callback_regression_settles_invoice(): void
    {
        $serverKey = 'SB-Mid-server-TESTKEY123';
        Config::set('midtrans.server_key', $serverKey);

        $invoice = $this->createPendingInvoice([
            'payment_method' => 'midtrans',
            'amount' => 100000,
        ]);

        $signature = hash('sha512', $invoice->invoice_code . '200' . '100000.00' . $serverKey);

        $payload = [
            'order_id' => $invoice->invoice_code,
            'status_code' => '200',
            'gross_amount' => '100000.00',
            'signature_key' => $signature,
            'transaction_status' => 'settlement',
            'payment_type' => 'bank_transfer',
            'transaction_id' => 'midtrans-trx-999',
        ];

        $response = $this->postJson('/api/callback/midtrans', $payload);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertEquals('paid', $invoice->fresh()->status);
    }

    /*
    |--------------------------------------------------------------------------
    | ASPI SNAP ROOT ENDPOINT (/v1.0/qr/qr-mpm-notify) TESTS
    |--------------------------------------------------------------------------
    */

    public function test_aspi_qris_notify_root_endpoint_settles_invoice_with_snap_response(): void
    {
        Event::fake([TransactionPaid::class]);
        Mail::fake();

        $invoice = $this->createPendingInvoice([
            'amount' => 150000,
            'payment_reference' => 'REF-ASPI-QRIS-001',
        ]);

        $payload = [
            'originalReferenceNo' => 'REF-ASPI-QRIS-001',
            'originalPartnerReferenceNo' => $invoice->invoice_code,
            'latestTransactionStatus' => '00',
            'transactionStatusDesc' => 'SUCCESS',
            'customerNumber' => '9360082112345678919',
            'amount' => [
                'value' => '150000.00',
                'currency' => 'IDR',
            ],
            'additionalInfo' => [
                'trxTime' => now()->format('YmdHis'),
                'issuerName' => 'BCA',
            ],
        ];

        // Memanggil endpoint ASPI root persis tanpa prefix /api
        $response = $this->postQrisNotification($payload, [], '/v1.0/qr/qr-mpm-notify');

        $response->assertStatus(200)
            ->assertJson([
                'responseCode' => '2005200',
                'responseMessage' => 'Successful',
            ]);

        $this->assertEquals('paid', $invoice->fresh()->status);
    }

    public function test_aspi_qris_notify_root_endpoint_invalid_payloads_do_not_settle(): void
    {
        Event::fake([TransactionPaid::class]);

        $invoice = $this->createPendingInvoice([
            'amount' => 100000,
            'payment_reference' => 'REF-ASPI-QRIS-002',
        ]);

        // 1. Missing originalPartnerReferenceNo & originalReferenceNo
        $payloadMissingRef = [
            'latestTransactionStatus' => '00',
            'amount' => [
                'value' => '100000.00',
                'currency' => 'IDR',
            ],
        ];
        $resMissing = $this->postQrisNotification($payloadMissingRef, [], '/v1.0/qr/qr-mpm-notify');
        $resMissing->assertStatus(400)
            ->assertJson([
                'responseCode' => '4005202',
                'responseMessage' => 'Invalid Mandatory Field originalPartnerReferenceNo',
            ]);

        // 2. Transaction Not Found
        $payloadNotFound = [
            'originalPartnerReferenceNo' => 'INV-NONEXISTENT-999',
            'latestTransactionStatus' => '00',
            'amount' => [
                'value' => '100000.00',
                'currency' => 'IDR',
            ],
        ];
        $resNotFound = $this->postQrisNotification($payloadNotFound, [], '/v1.0/qr/qr-mpm-notify');
        $resNotFound->assertStatus(404)
            ->assertJson([
                'responseCode' => '4045201',
                'responseMessage' => 'Transaction Not Found',
            ]);

        // 3. Invalid signature
        $payloadValid = [
            'originalPartnerReferenceNo' => $invoice->invoice_code,
            'latestTransactionStatus' => '00',
            'amount' => [
                'value' => '100000.00',
                'currency' => 'IDR',
            ],
        ];
        $resBadSig = $this->postQrisNotification($payloadValid, ['X-SIGNATURE' => 'invalid_signature_hex'], '/v1.0/qr/qr-mpm-notify');
        $resBadSig->assertStatus(401)
            ->assertJson([
                'responseCode' => '4015200',
            ]);

        // Invoice harus tetap pending (tidak tersettle)
        $this->assertEquals('pending', $invoice->fresh()->status);
    }

    public function test_legacy_manjo_routes_still_work_properly(): void
    {
        Event::fake([TransactionPaid::class]);
        Mail::fake();

        // Tes legacy /api/callback/manjo/qris
        $invoice1 = $this->createPendingInvoice([
            'amount' => 50000,
            'payment_reference' => 'REF-LEGACY-01',
        ]);
        $payload1 = [
            'originalReferenceNo' => 'REF-LEGACY-01',
            'originalPartnerReferenceNo' => $invoice1->invoice_code,
            'latestTransactionStatus' => '00',
            'amount' => [
                'value' => '50000.00',
                'currency' => 'IDR',
            ],
        ];
        $res1 = $this->postQrisNotification($payload1, [], '/api/callback/manjo/qris');
        $res1->assertStatus(200)->assertJson(['responseCode' => '2005200']);
        $this->assertEquals('paid', $invoice1->fresh()->status);

        // Tes legacy /api/v1.0/qr/qr-mpm-notify
        $invoice2 = $this->createPendingInvoice([
            'amount' => 75000,
            'payment_reference' => 'REF-LEGACY-02',
        ]);
        $payload2 = [
            'originalReferenceNo' => 'REF-LEGACY-02',
            'originalPartnerReferenceNo' => $invoice2->invoice_code,
            'latestTransactionStatus' => '00',
            'amount' => [
                'value' => '75000.00',
                'currency' => 'IDR',
            ],
        ];
        $res2 = $this->postQrisNotification($payload2, [], '/api/v1.0/qr/qr-mpm-notify');
        $res2->assertStatus(200)->assertJson(['responseCode' => '2005200']);
        $this->assertEquals('paid', $invoice2->fresh()->status);
    }
}
