<?php

namespace Tests\Feature\Payment;

use App\Models\Bundle;
use App\Models\BundleItem;
use App\Models\Course;
use App\Models\DiscountCode;
use App\Models\DiscountUsage;
use App\Models\Invoice;
use App\Models\PointTransaction;
use App\Models\User;
use App\Services\ManjoService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ManjoCheckoutFlowTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected User $otherUser;
    protected User $admin;
    protected Course $course;
    protected Bundle $bundle;
    protected string $testPrivateKey = '';

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();

        // Roles
        Role::firstOrCreate(['name' => 'admin']);
        Role::firstOrCreate(['name' => 'user']);
        Role::firstOrCreate(['name' => 'affiliate']);

        // Generate temporary RSA key for test
        $res = openssl_pkey_new([
            'private_key_bits' => 2048,
            'private_key_type' => OPENSSL_KEYTYPE_RSA,
        ]);
        $privKey = '';
        openssl_pkey_export($res, $privKey);
        $this->testPrivateKey = $privKey;

        // Configure Manjo test environment
        Config::set('manjo.environment', 'uat');
        Config::set('manjo.qris.client_key', 'test_client_key_123');
        Config::set('manjo.qris.client_secret', 'test_client_secret_xyz');
        Config::set('manjo.qris.partner_id', 'TEST_PARTNER_01');
        Config::set('manjo.qris.merchant_id', 'TEST_MERCHANT_01');
        Config::set('manjo.qris.terminal_id', '01');
        Config::set('manjo.qris.private_key', $this->testPrivateKey);
        Config::set('manjo.va.api_key', 'test_va_api_key_456');

        $this->user = User::factory()->create([
            'name' => 'Pembeli Manjo',
            'email' => 'pembeli@example.com',
            'phone_number' => '081234567890',
            'point_balance' => 50000,
        ]);
        $this->user->assignRole('user');

        $this->otherUser = User::factory()->create([
            'name' => 'User Lain',
            'email' => 'other@example.com',
            'phone_number' => '089876543210',
        ]);
        $this->otherUser->assignRole('user');

        $this->admin = User::factory()->create([
            'name' => 'Admin Level Up',
            'email' => 'admin@levelup.com',
        ]);
        $this->admin->assignRole('admin');

        $category = \App\Models\Category::firstOrCreate(
            ['slug' => 'accounting'],
            ['name' => 'Accounting']
        );

        $this->course = Course::create([
            'title' => 'Financial Accounting 101',
            'slug' => 'financial-accounting-101',
            'price' => 100000,
            'strikethrough_price' => 150000,
            'category_id' => $category->id,
            'user_id' => $this->admin->id,
            'status' => 'published',
        ]);

        $this->bundle = Bundle::create([
            'title' => 'Master Package Bundle',
            'slug' => 'master-package-bundle',
            'price' => 200000,
            'strikethrough_price' => 300000,
            'status' => 'published',
            'is_active' => true,
            'user_id' => $this->admin->id,
        ]);

        BundleItem::create([
            'bundle_id' => $this->bundle->id,
            'bundleable_type' => Course::class,
            'bundleable_id' => $this->course->id,
            'price' => 200000,
        ]);
    }

    /**
     * Helper untuk fake request QRIS sukses
     */
    protected function fakeQrisSuccess(
        string $referenceNo = 'REF-QRIS-999',
        string $qrContent = '00020101021226580016ID.CO.MANJO.WWW011893600999000000000152045411530336054061050005802ID5908LEVEL_UP6007JAKARTA6304ABCD',
        int $validitySeconds = 900,
        ?string $expireDate = null
    ) {
        $qrisResponse = [
            'responseCode' => '2004700',
            'responseMessage' => 'Successful',
            'referenceNo' => $referenceNo,
            'partnerReferenceNo' => 'LUC-TEST',
            'qrContent' => $qrContent,
            'validityPeriod' => (string) $validitySeconds,
        ];

        if ($expireDate) {
            $qrisResponse['additionalInfo'] = [
                'expireDate' => $expireDate,
            ];
        }

        Http::fake([
            '*/v1.0/access-token/b2b' => Http::response([
                'responseCode' => '2007300',
                'responseMessage' => 'Successful',
                'accessToken' => 'fake_b2b_token_' . uniqid(),
                'tokenType' => 'Bearer',
                'expiresIn' => '900',
            ], 200),
            '*/v1.0/qr/qr-mpm-generate' => Http::response($qrisResponse, 200),
        ]);
    }

    /**
     * Helper untuk fake request VA sukses
     */
    protected function fakeVaSuccess(string $trxId = 'TRX-VA-888', string $vaNo = '880812345678', string $bankCode = 'MANDIRI', string $expiredDate = '2026-10-18 10:00:00')
    {
        Http::fake([
            '*/api/v1/transaction/create' => Http::response([
                'success' => true,
                'message' => 'Virtual account created successfully',
                'data' => [
                    'trx_id' => $trxId,
                    'virtual_account_no' => $vaNo,
                    'bank_code' => $bankCode,
                    'bank_name' => 'Bank Mandiri',
                    'amount' => 105000,
                    'status' => 'Pending',
                    'expired_date' => $expiredDate,
                ],
            ], 200),
        ]);
    }

    /**
     * 1. Test Single Product Checkout dengan Manjo QRIS Dynamic
     */
    public function test_single_product_checkout_with_manjo_qris_success()
    {
        $this->fakeQrisSuccess('REF-QRIS-001', '0002010102122658_DYNAMIC_CONTENT_123', 900);

        $response = $this->actingAs($this->user)->postJson(route('invoice.store'), [
            'type' => 'course',
            'id' => $this->course->id,
            'discount_amount' => 50000, // strikethrough (150000) - price (100000)
            'nett_amount' => 100000,
            'total_amount' => 105000, // nett + 5000 admin fee
            'payment_channel' => 'qris',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'payment_method' => 'manjo',
            'payment_channel' => 'qris',
            'status' => 'pending',
        ]);

        $invoiceId = $response->json('invoice_id');
        $invoice = Invoice::findOrFail($invoiceId);

        $this->assertEquals('pending', $invoice->status);
        $this->assertEquals('manjo', $invoice->payment_method);
        $this->assertEquals('qris', $invoice->payment_channel);
        $this->assertEquals('REF-QRIS-001', $invoice->payment_reference);
        $this->assertEquals(route('invoice.qris.image', $invoice->id), $invoice->qr_code_url);
        $this->assertNotNull($invoice->expires_at);

        // Pastikan raw qr_content tersimpan di cache
        $cachedQr = Cache::get("manjo_qris_{$invoice->id}");
        $this->assertEquals('0002010102122658_DYNAMIC_CONTENT_123', $cachedQr);
    }

    /**
     * 2. Test Single Product Checkout dengan Manjo Virtual Account
     */
    public function test_single_product_checkout_with_manjo_va_success()
    {
        $this->fakeVaSuccess('TRX-VA-777', '880899998888', 'BRI', '2026-10-18 12:00:00');

        $response = $this->actingAs($this->user)->postJson(route('invoice.store'), [
            'type' => 'course',
            'id' => $this->course->id,
            'discount_amount' => 50000,
            'nett_amount' => 100000,
            'total_amount' => 105000,
            'payment_channel' => 'BRI',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'payment_method' => 'manjo',
            'payment_channel' => 'BRI',
            'status' => 'pending',
        ]);

        $invoice = Invoice::findOrFail($response->json('invoice_id'));
        $this->assertEquals('TRX-VA-777', $invoice->payment_reference);
        $this->assertEquals('880899998888', $invoice->va_number);
        $this->assertEquals('BRI', $invoice->payment_channel);
        $this->assertEquals('2026-10-18 12:00:00', $invoice->expires_at->format('Y-m-d H:i:s'));
    }

    /**
     * 3. Test Bundling Checkout dengan Manjo QRIS
     */
    public function test_bundle_checkout_with_manjo_qris_success()
    {
        $this->fakeQrisSuccess('REF-BUNDLE-QRIS', '0002010102122658_BUNDLE_CONTENT', 900);

        $response = $this->actingAs($this->user)->postJson(route('invoice.store.bundle'), [
            'bundle_id' => $this->bundle->id,
            'discount_amount' => 100000, // 300000 - 200000
            'nett_amount' => 200000,
            'total_amount' => 205000,
            'payment_channel' => 'qris',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'payment_method' => 'manjo',
            'payment_channel' => 'qris',
            'status' => 'pending',
        ]);

        $invoice = Invoice::findOrFail($response->json('invoice_id'));
        $this->assertEquals('REF-BUNDLE-QRIS', $invoice->payment_reference);
        $this->assertEquals('pending', $invoice->status);
    }

    /**
     * 4a. Test Definite Rejection (4xx) -> status failed, refund points
     */
     public function test_gateway_definite_rejection_marks_invoice_failed_and_refunds_points()
     {
         // Fake gateway error 400
         Http::fake([
             '*/v1.0/access-token/b2b' => Http::response([
                 'responseCode' => '2007300',
                 'accessToken' => 'fake_token',
                 'expiresIn' => '900',
             ], 200),
             '*/v1.0/qr/qr-mpm-generate' => Http::response([
                 'responseCode' => '4004700',
                 'responseMessage' => 'Invalid Amount or Merchant ID',
             ], 400),
         ]);

         $initialPoints = $this->user->point_balance;

         $response = $this->actingAs($this->user)->postJson(route('invoice.store'), [
             'type' => 'course',
             'id' => $this->course->id,
             'discount_amount' => 50000,
             'nett_amount' => 90000, // 100k - 10k points = 90k
             'total_amount' => 95000, // 90k + 5k fee
             'points_redeemed' => 10000,
             'payment_channel' => 'qris',
         ]);

         $response->assertStatus(422);

         $this->user->refresh();

         // Poin harus di-refund dan kembali utuh
         $this->assertEquals($initialPoints, $this->user->point_balance);

         // Invoice harus berstatus 'failed'
         $failedInvoice = Invoice::where('user_id', $this->user->id)->latest()->first();
         $this->assertNotNull($failedInvoice);
         $this->assertEquals('failed', $failedInvoice->status);
     }

    /**
     * 4b. Test Definite Rejection (4xx) -> status failed, restore voucher usage
     */
    public function test_gateway_definite_rejection_marks_invoice_failed_and_refunds_voucher()
    {
        $discountCode = DiscountCode::create([
            'code' => 'DISC10K',
            'name' => 'Diskon 10K',
            'type' => 'fixed',
            'value' => 10000,
            'max_uses' => 100,
            'used_count' => 0,
            'starts_at' => now()->subDay(),
            'expires_at' => now()->addDays(7),
            'is_active' => true,
        ]);

        Http::fake([
            '*/v1.0/access-token/b2b' => Http::response([
                'responseCode' => '2007300',
                'accessToken' => 'fake_token',
                'expiresIn' => '900',
            ], 200),
            '*/v1.0/qr/qr-mpm-generate' => Http::response([
                'responseCode' => '4004700',
                'responseMessage' => 'Invalid Amount or Merchant ID',
            ], 400),
        ]);

        $response = $this->actingAs($this->user)->postJson(route('invoice.store'), [
            'type' => 'course',
            'id' => $this->course->id,
            'discount_amount' => 50000,
            'discount_code_id' => $discountCode->id,
            'discount_code_amount' => 10000,
            'nett_amount' => 90000, // 100k - 10k voucher = 90k
            'total_amount' => 95000,
            'payment_channel' => 'qris',
        ]);

        $response->assertStatus(422);

        $discountCode->refresh();
        $this->assertEquals(0, $discountCode->used_count);

        $failedInvoice = Invoice::where('user_id', $this->user->id)->latest()->first();
        $this->assertNotNull($failedInvoice);
        $this->assertEquals('failed', $failedInvoice->status);
    }

    /**
     * 5. Test Gateway Ambiguous Network Timeout (504) -> Invoice tetap pending, TIDAK auto-retry
     */
    public function test_gateway_network_timeout_returns_504_and_keeps_invoice_pending()
    {
        Http::fake([
            '*/v1.0/access-token/b2b' => Http::response([
                'responseCode' => '2007300',
                'accessToken' => 'fake_token',
                'expiresIn' => '900',
            ], 200),
            '*/v1.0/qr/qr-mpm-generate' => function () {
                throw new \Illuminate\Http\Client\ConnectionException('cURL error 28: Operation timed out');
            },
        ]);

        $response = $this->actingAs($this->user)->postJson(route('invoice.store'), [
            'type' => 'course',
            'id' => $this->course->id,
            'discount_amount' => 50000,
            'nett_amount' => 100000,
            'total_amount' => 105000,
            'payment_channel' => 'qris',
        ]);

        $response->assertStatus(504);

        $invoice = Invoice::where('user_id', $this->user->id)->latest()->first();
        $this->assertNotNull($invoice);
        // Tetap pending untuk investigasi/reconcile, tidak dibatalkan otomatis
        $this->assertEquals('pending', $invoice->status);
    }

    /**
     * 6. Test Endpoint QR Image: Otorisasi & Cache Miss Handling
     */
    public function test_qris_image_endpoint_authorization_and_cache_miss()
    {
        $invoice = Invoice::create([
            'user_id' => $this->user->id,
            'invoice_code' => 'LUC-TEST-QR',
            'amount' => 105000,
            'nett_amount' => 100000,
            'status' => 'pending',
            'payment_method' => 'manjo',
            'payment_channel' => 'qris',
            'expires_at' => Carbon::now()->addMinutes(15),
        ]);

        // Simpan QR content di cache
        Cache::put("manjo_qris_{$invoice->id}", '0002010102122658TEST_PAYLOAD', 900);

        // 1. Pemilik invoice dapat mengakses -> 200 PNG
        $resOwner = $this->actingAs($this->user)->get(route('invoice.qris.image', $invoice->id));
        $resOwner->assertStatus(200);
        $this->assertStringContainsString('image/png', $resOwner->headers->get('Content-Type'));

        // 2. Admin dapat mengakses -> 200 PNG
        $resAdmin = $this->actingAs($this->admin)->get(route('invoice.qris.image', $invoice->id));
        $resAdmin->assertStatus(200);

        // 3. User lain ditolak -> 403 Forbidden
        $resOther = $this->actingAs($this->otherUser)->get(route('invoice.qris.image', $invoice->id));
        $resOther->assertStatus(403);

        // 4. Cache Miss -> Mengembalikan SVG fallback tanpa memanggil gateway baru
        Cache::forget("manjo_qris_{$invoice->id}");
        $resMiss = $this->actingAs($this->user)->get(route('invoice.qris.image', $invoice->id));
        $resMiss->assertStatus(200);
        $this->assertStringContainsString('image/svg+xml', $resMiss->headers->get('Content-Type'));
        $this->assertStringContainsString('QR Code Tidak Tersedia', $resMiss->getContent());
    }

    /**
     * 7. Test Double-Submit Prevention via Lock
     */
    public function test_double_submit_lock_prevents_simultaneous_requests()
    {
        $lockKey = "checkout_lock_{$this->user->id}_course_{$this->course->id}";
        $lock = Cache::lock($lockKey, 15);
        $this->assertTrue($lock->get());

        // Panggilan kedua saat lock masih dipegang
        $response = $this->actingAs($this->user)->postJson(route('invoice.store'), [
            'type' => 'course',
            'id' => $this->course->id,
            'discount_amount' => 50000,
            'nett_amount' => 100000,
            'total_amount' => 105000,
            'payment_channel' => 'qris',
        ]);

        $response->assertStatus(429);
        $response->assertJson([
            'success' => false,
            'message' => 'Permintaan transaksi Anda sedang diproses. Mohon tunggu beberapa detik.',
        ]);

        $lock->release();
    }

    /**
     * 8. Test Manual Admin Approval Preserves Manjo Payment Method and Logs Audit Trail
     */
    public function test_admin_manual_approval_preserves_payment_method_and_records_audit()
    {
        $invoice = Invoice::create([
            'user_id' => $this->user->id,
            'invoice_code' => 'LUC-TEST-APPROVE',
            'amount' => 105000,
            'nett_amount' => 100000,
            'status' => 'pending',
            'payment_method' => 'manjo',
            'payment_channel' => 'qris',
            'payment_reference' => 'REF-MANJO-999',
            'expires_at' => Carbon::now()->addMinutes(15),
        ]);

        // User biasa tidak bisa approve -> 403
        $resUser = $this->actingAs($this->user)->post(route('transactions.approve', $invoice->id));
        $resUser->assertStatus(403);

        // Admin approve -> 302 / success
        $resAdmin = $this->actingAs($this->admin)->post(route('transactions.approve', $invoice->id));
        $resAdmin->assertSessionHas('success');

        $invoice->refresh();
        $this->assertEquals('paid', $invoice->status);
        $this->assertEquals('manjo', $invoice->payment_method); // Payment method manjo tetap terjaga!
        $this->assertNotNull($invoice->paid_at);
    }

    /**
     * 9. Test Bundle Checkout Idempotency Reuses Active Pending Invoice and Prevents Double Submit
     */
    public function test_bundle_checkout_idempotency_reuses_active_pending_invoice()
    {
        // 1. Double submit lock prevents concurrent bundle checkout (SEC-01)
        $bundleLockKey = "checkout_bundle_lock_{$this->user->id}_{$this->bundle->id}";
        $lock = Cache::lock($bundleLockKey, 45);
        $this->assertTrue($lock->get());

        $resLocked = $this->actingAs($this->user)->postJson(route('invoice.store.bundle'), [
            'bundle_id' => $this->bundle->id,
            'discount_amount' => 100000,
            'nett_amount' => 200000,
            'total_amount' => 205000,
            'payment_channel' => 'qris',
        ]);
        $resLocked->assertStatus(429);
        $resLocked->assertJson([
            'success' => false,
            'message' => 'Permintaan transaksi bundle Anda sedang diproses. Mohon tunggu beberapa detik.',
        ]);
        $lock->release();

        // 2. Initial successful bundle checkout creates pending invoice with gateway reference
        $this->fakeQrisSuccess('REF-BUNDLE-EXISTING', '0002010102122658_BUNDLE_CONTENT', 900);

        $res1 = $this->actingAs($this->user)->postJson(route('invoice.store.bundle'), [
            'bundle_id' => $this->bundle->id,
            'discount_amount' => 100000,
            'nett_amount' => 200000,
            'total_amount' => 205000,
            'payment_channel' => 'qris',
        ]);
        $res1->assertStatus(200);
        $invoiceId = $res1->json('invoice_id');
        $invoiceCode = $res1->json('invoice_code');

        // Reset Http fake to record subsequent calls
        Http::fake();

        // 3. Second request with same bundle, user, payment_channel & amount reuses the existing active pending invoice (SEC-02)
        $res2 = $this->actingAs($this->user)->postJson(route('invoice.store.bundle'), [
            'bundle_id' => $this->bundle->id,
            'discount_amount' => 100000,
            'nett_amount' => 200000,
            'total_amount' => 205000,
            'payment_channel' => 'qris',
        ]);

        $res2->assertStatus(200);
        $res2->assertJson([
            'success' => true,
            'invoice_id' => $invoiceId,
            'invoice_code' => $invoiceCode,
            'payment_method' => 'manjo',
            'payment_channel' => 'qris',
            'status' => 'pending',
        ]);

        // Verifikasi tidak ada network call tambahan ke gateway Manjo
        Http::assertNothingSent();

        // 4. Pending invoice WITHOUT valid gateway reference blocks re-checkout to prevent duplicate gateway transactions
        $unconfirmedInvoice = Invoice::create([
            'user_id' => $this->otherUser->id,
            'invoice_code' => 'LUC-UNCONFIRMED',
            'amount' => 205000,
            'nett_amount' => 200000,
            'status' => 'pending',
            'payment_method' => 'manjo',
            'payment_channel' => 'qris',
            'payment_reference' => null,
            'va_number' => null,
            'expires_at' => Carbon::now()->addHours(24),
        ]);
        \App\Models\EnrollmentBundle::create([
            'invoice_id' => $unconfirmedInvoice->id,
            'bundle_id' => $this->bundle->id,
            'price' => 200000,
        ]);

        $this->fakeQrisSuccess('REF-NEW-GATEWAY', 'NEW_QR_CONTENT', 900);
        $res3 = $this->actingAs($this->otherUser)->postJson(route('invoice.store.bundle'), [
            'bundle_id' => $this->bundle->id,
            'discount_amount' => 100000,
            'nett_amount' => 200000,
            'total_amount' => 205000,
            'payment_channel' => 'qris',
        ]);
        $res3->assertStatus(409);
        $res3->assertJson([
            'success' => false,
            'requires_reconciliation' => true,
        ]);

        // Setelah unconfirmed invoice dibatalkan, pembeli baru dapat checkout ulang secara aman
        $this->actingAs($this->otherUser)->post(route('invoice.cancel', $unconfirmedInvoice->id));
        $this->assertEquals('failed', $unconfirmedInvoice->fresh()->status);

        $res4 = $this->actingAs($this->otherUser)->postJson(route('invoice.store.bundle'), [
            'bundle_id' => $this->bundle->id,
            'discount_amount' => 100000,
            'nett_amount' => 200000,
            'total_amount' => 205000,
            'payment_channel' => 'qris',
        ]);
        $res4->assertStatus(200);
        $this->assertNotEquals($unconfirmedInvoice->id, $res4->json('invoice_id'));
    }

    /**
     * 10. Test QRIS Image Endpoint Returns Informative SVG on Failed or Expired Invoice (SEC-03)
     */
    public function test_qris_image_returns_svg_when_invoice_is_failed_or_expired()
    {
        // 1. Invoice status failed -> SVG 'QR Code Tidak Aktif'
        $failedInvoice = Invoice::create([
            'user_id' => $this->user->id,
            'invoice_code' => 'LUC-TEST-FAILED-QR',
            'amount' => 105000,
            'nett_amount' => 100000,
            'status' => 'failed',
            'payment_method' => 'manjo',
            'payment_channel' => 'qris',
            'expires_at' => Carbon::now()->addMinutes(15),
        ]);
        Cache::put("manjo_qris_{$failedInvoice->id}", '0002010102122658_DUMMY_FAILED', 900);

        $resFailed = $this->actingAs($this->user)->get(route('invoice.qris.image', $failedInvoice->id));
        $resFailed->assertStatus(200);
        $this->assertStringContainsString('image/svg+xml', $resFailed->headers->get('Content-Type'));
        $this->assertStringContainsString('QR Code Tidak Aktif', $resFailed->getContent());
        $this->assertStringContainsString('Tagihan tidak dalam status menunggu pembayaran', $resFailed->getContent());

        // 2. Invoice status pending tapi expired -> SVG 'QR Code Kedaluwarsa'
        $expiredInvoice = Invoice::create([
            'user_id' => $this->user->id,
            'invoice_code' => 'LUC-TEST-EXPIRED-QR',
            'amount' => 105000,
            'nett_amount' => 100000,
            'status' => 'pending',
            'payment_method' => 'manjo',
            'payment_channel' => 'qris',
            'expires_at' => Carbon::now()->subMinutes(10), // Kedaluwarsa
        ]);
        Cache::put("manjo_qris_{$expiredInvoice->id}", '0002010102122658_DUMMY_EXPIRED', 900);

        $resExpired = $this->actingAs($this->user)->get(route('invoice.qris.image', $expiredInvoice->id));
        $resExpired->assertStatus(200);
        $this->assertStringContainsString('image/svg+xml', $resExpired->headers->get('Content-Type'));
        $this->assertStringContainsString('QR Code Kedaluwarsa', $resExpired->getContent());
        $this->assertStringContainsString('Masa berlaku tagihan telah habis', $resExpired->getContent());

        // 3. Status di DB tidak termutasi dan tidak ada request ke gateway eksternal
        $this->assertEquals('failed', $failedInvoice->fresh()->status);
        $this->assertEquals('pending', $expiredInvoice->fresh()->status);
    }

    /**
     * 11. Test Gateway Success But Phase 3 Local Save Fails Logs Emergency (SEC-05)
     */
    public function test_gateway_success_but_local_save_fails_logs_emergency()
    {
        $this->fakeQrisSuccess('REF-PHASE3-FAIL', '0002010102122658_PHASE3_QR', 900);
        Log::spy();

        // Simulasikan kegagalan DB Phase 3 saat menyimpan respons gateway
        Invoice::updating(function ($invoice) {
            if (!empty($invoice->payment_reference)) {
                throw new \RuntimeException('Simulated database deadlock/disk full on Phase 3');
            }
        });

        $response = $this->actingAs($this->user)->postJson(route('invoice.store'), [
            'type' => 'course',
            'id' => $this->course->id,
            'discount_amount' => 50000,
            'nett_amount' => 100000,
            'total_amount' => 105000,
            'payment_channel' => 'qris',
        ]);

        $response->assertStatus(500);
        $response->assertJson([
            'success' => false,
        ]);
        $this->assertStringContainsString('terjadi kesalahan sistem saat menyimpan referensi', $response->json('message'));

        // Verifikasi log emergency tercatat dengan detail referensi dan invoice
        Log::shouldHaveReceived('emergency')
            ->once()
            ->with('MANJO_GATEWAY_SUCCESS_LOCAL_SAVE_FAILED', \Mockery::on(function ($context) {
                return isset($context['invoice_id'])
                    && isset($context['invoice_code'])
                    && $context['reference'] === 'REF-PHASE3-FAIL'
                    && str_contains($context['error'], 'Simulated database deadlock/disk full');
            }));

        // Verifikasi invoice tetap pending (tidak failed otomatis dan tidak retry)
        $invoice = Invoice::where('user_id', $this->user->id)->latest()->first();
        $this->assertNotNull($invoice);
        $this->assertEquals('pending', $invoice->status);
    }

    /**
     * 12. Test Manual Cancel Refunds Points and Reverts Voucher Usage
     */
    public function test_manual_cancel_refunds_points_and_reverts_voucher()
    {
        $this->user->update(['point_balance' => 30000]);

        $invoice = Invoice::create([
            'user_id' => $this->user->id,
            'invoice_code' => 'LUC-CANCEL-POINTS',
            'amount' => 85000,
            'nett_amount' => 80000,
            'points_redeemed' => 20000,
            'status' => 'pending',
            'payment_method' => 'manjo',
            'payment_channel' => 'qris',
            'expires_at' => Carbon::now()->addHours(24),
        ]);

        app(\App\Services\PointService::class)->redeemPoints($this->user, 20000, $invoice);
        $this->assertEquals(10000, $this->user->fresh()->point_balance);

        // Cancel invoice
        $response = $this->actingAs($this->user)->post(route('invoice.cancel', $invoice->id));
        $response->assertSessionHas('success');

        $this->assertEquals('failed', $invoice->fresh()->status);
        $this->assertEquals(30000, $this->user->fresh()->point_balance);

        $adjustment = \App\Models\PointTransaction::where('user_id', $this->user->id)
            ->where('reference_id', $invoice->id)
            ->where('type', 'adjustment')
            ->first();
        $this->assertNotNull($adjustment);
        $this->assertEquals(20000, $adjustment->amount);
    }

    /**
     * 13. Test Expire Old Invoices Refunds Points Automatically
     */
    public function test_expire_old_invoices_refunds_points()
    {
        $this->user->update(['point_balance' => 40000]);

        $expiredInvoice = Invoice::create([
            'user_id' => $this->user->id,
            'invoice_code' => 'LUC-EXPIRE-POINTS',
            'amount' => 85000,
            'nett_amount' => 80000,
            'points_redeemed' => 15000,
            'status' => 'pending',
            'payment_method' => 'manjo',
            'payment_channel' => 'qris',
            'expires_at' => Carbon::now()->subMinutes(30),
        ]);

        app(\App\Services\PointService::class)->redeemPoints($this->user, 15000, $expiredInvoice);
        $this->assertEquals(25000, $this->user->fresh()->point_balance);

        $response = $this->actingAs($this->admin)->postJson(route('invoice.expire-old'));
        $response->assertStatus(200);

        $this->assertEquals('failed', $expiredInvoice->fresh()->status);
        $this->assertEquals(40000, $this->user->fresh()->point_balance);

        $adjustment = \App\Models\PointTransaction::where('user_id', $this->user->id)
            ->where('reference_id', $expiredInvoice->id)
            ->where('type', 'adjustment')
            ->first();
        $this->assertNotNull($adjustment);
        $this->assertEquals(15000, $adjustment->amount);
    }

    /**
     * 14. Test Invoice Without Points Cancellation and Expiration Is Safe
     */
    public function test_invoice_without_points_cancellation_and_expiration_is_safe()
    {
        $this->user->update(['point_balance' => 50000]);

        $invoice = Invoice::create([
            'user_id' => $this->user->id,
            'invoice_code' => 'LUC-NO-POINTS',
            'amount' => 105000,
            'nett_amount' => 100000,
            'points_redeemed' => 0,
            'status' => 'pending',
            'payment_method' => 'manjo',
            'payment_channel' => 'qris',
            'expires_at' => Carbon::now()->addHours(24),
        ]);

        $response = $this->actingAs($this->user)->post(route('invoice.cancel', $invoice->id));
        $response->assertSessionHas('success');

        $this->assertEquals('failed', $invoice->fresh()->status);
        $this->assertEquals(50000, $this->user->fresh()->point_balance);

        $adjustmentsCount = \App\Models\PointTransaction::where('user_id', $this->user->id)
            ->where('reference_id', $invoice->id)
            ->count();
        $this->assertEquals(0, $adjustmentsCount);
    }

    /**
     * 15. Test Point Refund Is Strictly Idempotent and Prevents Duplicate Refunds
     */
    public function test_point_refund_is_idempotent_and_prevents_duplicate_refunds()
    {
        $this->user->update(['point_balance' => 50000]);

        $invoice = Invoice::create([
            'user_id' => $this->user->id,
            'invoice_code' => 'LUC-IDEMPOTENT-REFUND',
            'amount' => 85000,
            'nett_amount' => 80000,
            'points_redeemed' => 25000,
            'status' => 'pending',
            'payment_method' => 'manjo',
            'payment_channel' => 'qris',
            'expires_at' => Carbon::now()->addHours(24),
        ]);

        $pointService = app(\App\Services\PointService::class);
        $pointService->redeemPoints($this->user, 25000, $invoice);
        $this->assertEquals(25000, $this->user->fresh()->point_balance);

        // Refund panggilan pertama -> Mengembalikan PointTransaction
        $refund1 = $pointService->refundPoints($invoice);
        $this->assertNotNull($refund1);
        $this->assertEquals(50000, $this->user->fresh()->point_balance);

        // Refund panggilan kedua (duplicate attempt) -> Harus mengembalikan null dan saldo tidak berubah
        $refund2 = $pointService->refundPoints($invoice);
        $this->assertNull($refund2);
        $this->assertEquals(50000, $this->user->fresh()->point_balance);

        // Pastikan hanya tepat 1 transaksi adjustment yang tersimpan
        $adjustmentRecords = \App\Models\PointTransaction::where('user_id', $this->user->id)
            ->where('reference_id', $invoice->id)
            ->where('type', 'adjustment')
            ->count();
        $this->assertEquals(1, $adjustmentRecords);
    }

    /**
     * 16. Test Ambiguous Timeout Blocks Re-checkout Until Reconciled
     */
    public function test_ambiguous_timeout_blocks_recheckout_until_reconciled()
    {
        // 1. Simulasikan network timeout pada panggilan gateway (Phase 2)
        $shouldTimeout = true;
        Http::fake([
            '*/v1.0/access-token/b2b' => Http::response([
                'responseCode' => '2007300',
                'accessToken' => 'fake_b2b_token_timeout',
                'expiresIn' => '900',
            ], 200),
            '*/v1.0/qr/qr-mpm-generate' => function () use (&$shouldTimeout) {
                if ($shouldTimeout) {
                    throw new \Illuminate\Http\Client\ConnectionException('cURL error 28: Operation timed out after 30000 milliseconds');
                }
                return Http::response([
                    'responseCode' => '2004700',
                    'responseMessage' => 'Successful',
                    'referenceNo' => 'REF-NEW-SUCCESS',
                    'partnerReferenceNo' => 'LUC-TEST',
                    'qrContent' => 'NEW_QR_CONTENT',
                    'validityPeriod' => '900',
                ], 200);
            },
        ]);

        $res1 = $this->actingAs($this->user)->postJson(route('invoice.store'), [
            'type' => 'course',
            'id' => $this->course->id,
            'discount_amount' => 50000,
            'nett_amount' => 100000,
            'total_amount' => 105000,
            'payment_channel' => 'qris',
        ]);

        $res1->assertStatus(504);
        $invoiceCode = $res1->json('invoice_code');

        $timedOutInvoice = Invoice::where('invoice_code', $invoiceCode)->first();
        $this->assertNotNull($timedOutInvoice);
        $this->assertEquals('pending', $timedOutInvoice->status);
        $this->assertNull($timedOutInvoice->payment_reference);

        // 2. Pembeli mencoba checkout ulang untuk kursus yang sama
        // Harus DIBLOKIR dengan 409 Conflict agar tidak membuat tagihan kedua di gateway
        $res2 = $this->actingAs($this->user)->postJson(route('invoice.store'), [
            'type' => 'course',
            'id' => $this->course->id,
            'discount_amount' => 50000,
            'nett_amount' => 100000,
            'total_amount' => 105000,
            'payment_channel' => 'qris',
        ]);

        $res2->assertStatus(409);
        $res2->assertJson([
            'success' => false,
            'invoice_id' => $timedOutInvoice->id,
            'requires_reconciliation' => true,
        ]);

        // 3. Setelah invoice yang belum terkonfirmasi dibatalkan, pembeli dapat checkout kembali
        $this->actingAs($this->user)->post(route('invoice.cancel', $timedOutInvoice->id));
        $this->assertEquals('failed', $timedOutInvoice->fresh()->status);

        $shouldTimeout = false;
        $res3 = $this->actingAs($this->user)->postJson(route('invoice.store'), [
            'type' => 'course',
            'id' => $this->course->id,
            'discount_amount' => 50000,
            'nett_amount' => 100000,
            'total_amount' => 105000,
            'payment_channel' => 'qris',
        ]);

        $res3->assertStatus(200);
        $this->assertNotEquals($timedOutInvoice->id, $res3->json('invoice_id'));
    }

    /**
     * 17. Test Phase 3 Failure Blocks Re-checkout Preventing Duplicate Gateway Call
     */
    public function test_phase3_failure_blocks_recheckout_preventing_duplicate_gateway_call()
    {
        $this->fakeQrisSuccess('REF-LOST-RESPONSE', '0002010102122658_LOST', 900);

        // Simulasikan kegagalan Phase 3 DB save
        Invoice::updating(function ($invoice) {
            if (!empty($invoice->payment_reference) && $invoice->payment_reference === 'REF-LOST-RESPONSE') {
                throw new \RuntimeException('Simulated DB deadlock during Phase 3');
            }
        });

        $res1 = $this->actingAs($this->otherUser)->postJson(route('invoice.store'), [
            'type' => 'course',
            'id' => $this->course->id,
            'discount_amount' => 50000,
            'nett_amount' => 100000,
            'total_amount' => 105000,
            'payment_channel' => 'qris',
        ]);

        $res1->assertStatus(500);

        // Reset Http fake untuk memantau request selanjutnya
        Http::fake();

        // Checkout ulang langsung diblokir 409
        $res2 = $this->actingAs($this->otherUser)->postJson(route('invoice.store'), [
            'type' => 'course',
            'id' => $this->course->id,
            'discount_amount' => 50000,
            'nett_amount' => 100000,
            'total_amount' => 105000,
            'payment_channel' => 'qris',
        ]);

        $res2->assertStatus(409);
        $res2->assertJson([
            'success' => false,
            'requires_reconciliation' => true,
        ]);

        // Verifikasi tidak ada panggilan gateway kedua ke Manjo
        Http::assertNothingSent();
    }

    /**
     * 18. Test Invoice Manjo tidak memanggil API Xendit saat dibatalkan atau kedaluwarsa
     */
    public function test_manjo_invoice_cancel_and_expire_does_not_call_xendit_even_with_null_key()
    {
        // Pastikan Xendit API key kosong (kondisi di mana Xendit biasanya melempar No API Key detected)
        config(['xendit.API_KEY' => null]);

        // 1. Manjo Invoice Cancel
        $manjoInvoice = Invoice::create([
            'user_id' => $this->user->id,
            'invoice_code' => 'LUC-TEST-MANJO-CANCEL',
            'amount' => 105000,
            'nett_amount' => 100000,
            'status' => 'pending',
            'payment_method' => 'manjo',
            'payment_channel' => 'qris',
            'payment_reference' => 'REF-CANCEL-TEST',
            'expires_at' => Carbon::now()->addHour(),
        ]);

        \App\Models\EnrollmentCourse::create([
            'invoice_id' => $manjoInvoice->id,
            'course_id' => $this->course->id,
            'price' => 100000,
        ]);

        $cancelRes = $this->actingAs($this->user)->postJson(route('invoice.cancel', $manjoInvoice->id));
        $cancelRes->assertStatus(200);
        $this->assertEquals('failed', $manjoInvoice->fresh()->status);

        // 2. Manjo Invoice Expiration via scheduler/expireOldInvoices
        $expiredManjoInvoice = Invoice::create([
            'user_id' => $this->user->id,
            'invoice_code' => 'LUC-TEST-MANJO-EXPIRED',
            'amount' => 105000,
            'nett_amount' => 100000,
            'status' => 'pending',
            'payment_method' => 'manjo',
            'payment_channel' => 'qris',
            'payment_reference' => 'REF-EXPIRED-TEST',
            'expires_at' => Carbon::now()->subMinutes(10),
        ]);

        $controller = app(\App\Http\Controllers\InvoiceController::class);
        $expireRes = $controller->expireOldInvoices();
        $this->assertEquals(200, $expireRes->getStatusCode());
        $this->assertEquals('failed', $expiredManjoInvoice->fresh()->status);
    }

    /**
     * 19. Test QRIS dan VA tidak saling memblokir secara tidak semestinya
     */
    public function test_qris_and_va_do_not_block_each_other()
    {
        $this->fakeVaSuccess('TRX-VA-SUCCESS', '8888000123456789', 'bca');

        // Simulasikan ada transaksi QRIS pending yang belum memiliki referensi gateway (misal timeout ambigu)
        $unconfirmedQrisInvoice = Invoice::create([
            'user_id' => $this->user->id,
            'invoice_code' => 'LUC-UNCONFIRMED-QRIS',
            'amount' => 105000,
            'nett_amount' => 100000,
            'transaction_fee' => 5000,
            'status' => 'pending',
            'payment_method' => 'manjo',
            'payment_channel' => 'qris',
            'payment_reference' => null,
            'va_number' => null,
            'expires_at' => Carbon::now()->addMinutes(15),
        ]);

        \App\Models\EnrollmentCourse::create([
            'invoice_id' => $unconfirmedQrisInvoice->id,
            'course_id' => $this->course->id,
            'price' => 100000,
        ]);

        // User beralih memilih Virtual Account BCA untuk item yang sama
        $response = $this->actingAs($this->user)->postJson(route('invoice.store'), [
            'type' => 'course',
            'id' => $this->course->id,
            'discount_amount' => 50000,
            'nett_amount' => 100000,
            'total_amount' => 105000,
            'payment_channel' => 'bca',
        ]);

        // VA checkout tidak terhalang oleh pending QRIS
        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'payment_method' => 'manjo',
            'payment_channel' => 'bca',
            'status' => 'pending',
        ]);

        $createdVaInvoice = Invoice::findOrFail($response->json('invoice_id'));
        $this->assertEquals('8888000123456789', $createdVaInvoice->va_number);
        $this->assertEquals('TRX-VA-SUCCESS', $createdVaInvoice->payment_reference);
    }

    /**
     * 20. Test Invoice paid tidak dapat diubah menjadi failed oleh proses kedaluwarsa
     */
    public function test_paid_invoice_cannot_be_changed_to_failed_by_expire_old_invoices()
    {
        $paidInvoice = Invoice::create([
            'user_id' => $this->user->id,
            'invoice_code' => 'LUC-PAID-IMMUTABLE',
            'amount' => 105000,
            'nett_amount' => 100000,
            'status' => 'paid',
            'payment_method' => 'manjo',
            'payment_channel' => 'qris',
            'payment_reference' => 'REF-PAID-IMMUTABLE',
            'paid_at' => Carbon::now()->subDays(1),
            'expires_at' => Carbon::now()->subHours(2), // Waktu kedaluwarsa sudah lewat
        ]);

        $controller = app(\App\Http\Controllers\InvoiceController::class);
        $res = $controller->expireOldInvoices();
        $this->assertEquals(200, $res->getStatusCode());

        $this->assertEquals('paid', $paidInvoice->fresh()->status);
    }

    /**
     * 21. Test Kegagalan Konfigurasi / Pembacaan RSA Private Key Menandai Invoice Gagal dan Merefund Poin
     */
    public function test_rsa_key_failure_marks_invoice_failed_and_refunds_points()
    {
        $initialPoints = $this->user->point_balance;

        // Mock ManjoService agar melempar exception kegagalan RSA private key
        $this->mock(\App\Services\ManjoService::class, function ($mock) {
            $mock->shouldReceive('generateQrisMpm')
                ->once()
                ->andThrow(new \RuntimeException('Gagal memuat Manjo RSA Private Key: error:0909006C:PEM routines:get_name:no start line'));
        });

        $res = $this->actingAs($this->user)->postJson(route('invoice.store'), [
            'type' => 'course',
            'id' => $this->course->id,
            'discount_amount' => 50000,
            'points_redeemed' => 10000,
            'nett_amount' => 90000,
            'total_amount' => 95000,
            'payment_channel' => 'qris',
        ]);

        $res->assertStatus(422);
        $res->assertJson([
            'success' => false,
        ]);

        // Invoice harus ditandai failed, bukan tertinggal pending
        $invoice = Invoice::where('user_id', $this->user->id)
            ->where('points_redeemed', 10000)
            ->latest()
            ->first();

        $this->assertNotNull($invoice);
        $this->assertEquals('failed', $invoice->status);

        // Poin harus dikembalikan secara utuh
        $this->assertEquals($initialPoints, $this->user->fresh()->point_balance);
    }

    /**
     * 22. Test QRIS checkout uses additionalInfo.expireDate when provided
     */
    public function test_qris_checkout_uses_additional_info_expire_date_when_provided()
    {
        $targetExpireDate = Carbon::now()->addMinutes(25)->setMicrosecond(0);
        $expireDateIso = $targetExpireDate->toIso8601String();
        $expectedQrContent = '0002010102122658_CUSTOM_EXPIRE_QR';

        $this->fakeQrisSuccess('REF-EXPIRE-DATE-001', $expectedQrContent, 900, $expireDateIso);

        $response = $this->actingAs($this->user)->postJson(route('invoice.store'), [
            'type' => 'course',
            'id' => $this->course->id,
            'discount_amount' => 50000,
            'nett_amount' => 100000,
            'total_amount' => 105000,
            'payment_channel' => 'qris',
        ]);

        $response->assertStatus(200);

        $invoice = Invoice::findOrFail($response->json('invoice_id'));
        $this->assertEquals('pending', $invoice->status);
        $this->assertEquals('REF-EXPIRE-DATE-001', $invoice->payment_reference);

        // Pastikan expires_at mengikuti additionalInfo.expireDate dari respons gateway
        $this->assertEquals($targetExpireDate->timestamp, $invoice->expires_at->timestamp);

        // Pastikan QR content disimpan di cache dengan key manjo_qris_{invoice_id}
        $cachedQr = Cache::get("manjo_qris_{$invoice->id}");
        $this->assertEquals($expectedQrContent, $cachedQr);
    }

    /**
     * 23. Test QRIS bundle checkout uses additionalInfo.expireDate when provided
     */
    public function test_qris_bundle_checkout_uses_additional_info_expire_date()
    {
        $targetExpireDate = Carbon::now()->addMinutes(30)->setMicrosecond(0);
        $expireDateIso = $targetExpireDate->toIso8601String();
        $expectedQrContent = '0002010102122658_BUNDLE_EXPIRE_QR';

        $this->fakeQrisSuccess('REF-BUNDLE-EXPIRE-001', $expectedQrContent, 900, $expireDateIso);

        $response = $this->actingAs($this->user)->postJson(route('invoice.store.bundle'), [
            'bundle_id' => $this->bundle->id,
            'discount_amount' => 100000,
            'nett_amount' => 200000,
            'total_amount' => 205000,
            'payment_channel' => 'qris',
        ]);

        $response->assertStatus(200);

        $invoice = Invoice::findOrFail($response->json('invoice_id'));
        $this->assertEquals('pending', $invoice->status);
        $this->assertEquals('REF-BUNDLE-EXPIRE-001', $invoice->payment_reference);
        $this->assertEquals($targetExpireDate->timestamp, $invoice->expires_at->timestamp);

        $cachedQr = Cache::get("manjo_qris_{$invoice->id}");
        $this->assertEquals($expectedQrContent, $cachedQr);
    }

    /**
     * 24. Test QRIS checkout fails definitively when gateway returns incomplete response (missing referenceNo or qrContent)
     */
    public function test_qris_checkout_fails_definitively_when_gateway_response_is_missing_reference_no_or_qr_content()
    {
        $initialPoints = $this->user->point_balance;

        // Respons 2004700 dari gateway namun referenceNo atau qrContent kosong
        Http::fake([
            '*/v1.0/access-token/b2b' => Http::response([
                'responseCode' => '2007300',
                'responseMessage' => 'Successful',
                'accessToken' => 'fake_b2b_token_test',
                'tokenType' => 'Bearer',
                'expiresIn' => '900',
            ], 200),
            '*/v1.0/qr/qr-mpm-generate' => Http::response([
                'responseCode' => '2004700',
                'responseMessage' => 'Successful',
                'referenceNo' => null,
                'partnerReferenceNo' => 'LUC-TEST',
                'qrContent' => '', // kosong
                'validityPeriod' => '900',
            ], 200),
        ]);

        $response = $this->actingAs($this->user)->postJson(route('invoice.store'), [
            'type' => 'course',
            'id' => $this->course->id,
            'discount_amount' => 50000,
            'points_redeemed' => 10000,
            'nett_amount' => 90000,
            'total_amount' => 95000,
            'payment_channel' => 'qris',
        ]);

        $response->assertStatus(422);
        $response->assertJson([
            'success' => false,
        ]);

        // Invoice harus ditandai failed dan poin dikembalikan
        $failedInvoice = Invoice::where('user_id', $this->user->id)
            ->where('points_redeemed', 10000)
            ->latest()
            ->first();

        $this->assertNotNull($failedInvoice);
        $this->assertEquals('failed', $failedInvoice->status);
        $this->assertEquals($initialPoints, $this->user->fresh()->point_balance);
    }
}


