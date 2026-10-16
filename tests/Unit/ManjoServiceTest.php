<?php

namespace Tests\Unit;

use App\Services\ManjoService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ManjoServiceTest extends TestCase
{
    protected string $rsaPrivateKeyPem;
    protected string $rsaPublicKeyPem;

    protected function setUp(): void
    {
        parent::setUp();

        Cache::flush();

        // Generate temporary RSA 2048-bit key pair in-memory for testing
        $keyPair = openssl_pkey_new([
            'private_key_bits' => 2048,
            'private_key_type' => OPENSSL_KEYTYPE_RSA,
        ]);

        openssl_pkey_export($keyPair, $privateKey);
        $keyDetails = openssl_pkey_get_details($keyPair);
        $publicKey = $keyDetails['key'];

        $this->rsaPrivateKeyPem = $privateKey;
        $this->rsaPublicKeyPem = $publicKey;

        // Configure test environment with dummy credentials
        Config::set('manjo.environment', 'uat');
        Config::set('manjo.qris.base_url', 'https://snap-uat.manjo.co.id/api');
        Config::set('manjo.qris.client_key', 'TEST_CLIENT_KEY_123');
        Config::set('manjo.qris.client_secret', 'TEST_CLIENT_SECRET_456');
        Config::set('manjo.qris.partner_id', 'TEST_PARTNER_01');
        Config::set('manjo.qris.merchant_id', 'TEST_MERCHANT_01');
        Config::set('manjo.qris.private_key', $this->rsaPrivateKeyPem);
        Config::set('manjo.qris.signature_encoding', 'hex');

        Config::set('manjo.va.base_url', 'https://uat-api-dashboard.manjo.co.id');
        Config::set('manjo.va.api_key', 'TEST_VA_API_KEY_789');
    }

    public function test_it_generates_valid_asymmetric_rsa_signature_hex_and_base64()
    {
        $service = new ManjoService();
        $stringToSign = 'TEST_CLIENT_KEY_123|2026-03-15T10:00:00+07:00';

        // 1. Test Hex encoding (default per Manjo documentation)
        $signatureHex = $service->generateAsymmetricSignature($stringToSign, 'hex');
        $this->assertEquals(512, strlen($signatureHex), '2048-bit RSA signature in hex must be exactly 512 characters');
        $this->assertTrue(ctype_xdigit($signatureHex), 'Signature must be valid hex');

        // Verify hex signature with public key
        $binarySignature = hex2bin($signatureHex);
        $verifyHex = openssl_verify($stringToSign, $binarySignature, $this->rsaPublicKeyPem, OPENSSL_ALGO_SHA256);
        $this->assertEquals(1, $verifyHex, 'RSA signature in hex must be verifiable');

        // 2. Test Base64 encoding
        $signatureBase64 = $service->generateAsymmetricSignature($stringToSign, 'base64');
        $binaryBase64 = base64_decode($signatureBase64);
        $verifyBase64 = openssl_verify($stringToSign, $binaryBase64, $this->rsaPublicKeyPem, OPENSSL_ALGO_SHA256);
        $this->assertEquals(1, $verifyBase64, 'RSA signature in base64 must be verifiable');

        // 3. Test verification helper
        $this->assertTrue($service->verifyAsymmetricSignature($stringToSign, $signatureHex, $this->rsaPublicKeyPem, 'hex'));
        $this->assertTrue($service->verifyAsymmetricSignature($stringToSign, $signatureBase64, $this->rsaPublicKeyPem, 'base64'));
        $this->assertFalse($service->verifyAsymmetricSignature('TAMPERED_STRING', $signatureHex, $this->rsaPublicKeyPem, 'hex'));
    }

    public function test_it_generates_and_verifies_symmetric_hmac_sha512_signature()
    {
        $service = new ManjoService();

        $httpMethod = 'POST';
        $endpointUrl = '/v1.0/qr/qr-mpm-generate';
        $accessToken = 'MOCK_BEARER_TOKEN';
        $body = ['partnerReferenceNo' => 'LUC-001', 'amount' => ['value' => '10000.00']];
        $bodyJson = json_encode($body);
        $timestamp = '2026-03-15T10:00:00+07:00';

        $signature = $service->generateSymmetricSignature($httpMethod, $endpointUrl, $accessToken, $bodyJson, $timestamp);

        // Expected formula verification
        $minified = json_encode($body, JSON_UNESCAPED_SLASHES);
        $bodyHash = strtolower(hash('sha256', $minified));
        $expectedStringToSign = "POST:{$endpointUrl}:{$accessToken}:{$bodyHash}:{$timestamp}";
        $expectedSignature = hash_hmac('sha512', $expectedStringToSign, 'TEST_CLIENT_SECRET_456');

        $this->assertEquals($expectedSignature, $signature);
        $this->assertTrue($service->verifySymmetricSignature($signature, $httpMethod, $endpointUrl, $accessToken, $bodyJson, $timestamp));
        $this->assertFalse($service->verifySymmetricSignature('invalid_signature', $httpMethod, $endpointUrl, $accessToken, $bodyJson, $timestamp));
    }

    public function test_it_fetches_and_caches_qris_b2b_access_token()
    {
        $expectedToken = 'MOCK_TOKEN_XYZ_123456';

        Http::fake([
            '*/v1.0/access-token/b2b' => Http::response([
                'responseCode' => '2007300',
                'responseMessage' => 'Successful',
                'tokenType' => 'Bearer',
                'accessToken' => $expectedToken,
                'expiresIn' => '900',
            ], 200),
        ]);

        $service = new ManjoService();

        // Call 1: Should call HTTP endpoint
        $token1 = $service->getQrisAccessToken();
        $this->assertEquals($expectedToken, $token1);
        Http::assertSentCount(1);

        // Call 2: Should retrieve from cache without HTTP request
        $token2 = $service->getQrisAccessToken();
        $this->assertEquals($expectedToken, $token2);
        Http::assertSentCount(1);

        // Call 3 with forceRefresh: Should make HTTP call
        $token3 = $service->getQrisAccessToken(true);
        $this->assertEquals($expectedToken, $token3);
        Http::assertSentCount(2);
    }

    public function test_it_generates_qris_mpm_successfully()
    {
        $mockQrContent = '00020101021226620015ID.CO.MANJO.WWW...';

        Http::fake([
            '*/v1.0/access-token/b2b' => Http::response([
                'responseCode' => '2007300',
                'responseMessage' => 'Successful',
                'tokenType' => 'Bearer',
                'accessToken' => 'MOCK_ACCESS_TOKEN_ABC',
                'expiresIn' => '900',
            ], 200),
            '*/v1.0/qr/qr-mpm-generate' => Http::response([
                'responseCode' => '2004700',
                'responseMessage' => 'Successful',
                'referenceNo' => 'REF-MANJO-999',
                'partnerReferenceNo' => 'LUC-260315-0001',
                'qrContent' => $mockQrContent,
                'qrUrl' => '-',
                'qrImage' => '-',
                'merchantName' => 'LevelUp Counting',
                'additionalInfo' => [
                    'paymentId' => '99',
                    'amount' => '150000.00',
                ],
            ], 200),
        ]);

        $service = new ManjoService();

        $result = $service->generateQrisMpm([
            'partnerReferenceNo' => 'LUC-260315-0001',
            'amount' => 150000,
            'productDescription' => 'Pembelian Kursus Akuntansi',
        ]);

        $this->assertTrue($result['success']);
        $this->assertEquals('REF-MANJO-999', $result['reference_no']);
        $this->assertEquals('LUC-260315-0001', $result['partner_reference_no']);
        $this->assertEquals($mockQrContent, $result['qr_content']);
        $this->assertNull($result['qr_url']); // '-' converted to null

        Http::assertSent(function ($request) {
            if (str_contains($request->url(), 'qr-mpm-generate')) {
                return $request->hasHeader('Authorization') &&
                       $request->hasHeader('X-SIGNATURE') &&
                       $request->hasHeader('X-PARTNER-ID') &&
                       $request->hasHeader('CHANNEL-ID', '05') &&
                       $request['partnerReferenceNo'] === 'LUC-260315-0001' &&
                       $request['amount']['value'] === '150000.00';
            }
            return true;
        });
    }

    public function test_it_creates_virtual_account_transaction_successfully()
    {
        Http::fake([
            '*/api/v1/transaction/create' => Http::response([
                'success' => true,
                'message' => 'Transaction created successfully',
                'data' => [
                    'amount' => 250000,
                    'bank_code' => 'BMRI',
                    'bank_name' => 'Bank Mandiri',
                    'callback_url' => 'https://example.com/api/callback/manjo/va',
                    'currency' => 'IDR',
                    'customer_name' => 'Budi Santoso',
                    'email' => 'budi@example.com',
                    'expired_date' => '2026-06-24T14:24:01+07:00',
                    'method' => 'VirtualAccount',
                    'phone' => '08123456789',
                    'status' => 'Pending',
                    'trx_id' => 'TRX-VA-MANDIRI-123',
                    'type' => 'DYNAMIC',
                    'virtual_account_no' => '7001400002025150',
                ],
                'timestamp' => '2026-06-23T14:24:31+07:00',
            ], 200),
        ]);

        $service = new ManjoService();

        $result = $service->createVirtualAccount([
            'amount' => 250000,
            'customerName' => 'Budi Santoso',
            'customerEmail' => 'budi@example.com',
            'customerPhone' => '08123456789',
            'bankCode' => 'BMRI',
        ]);

        $this->assertTrue($result['success']);
        $this->assertEquals('TRX-VA-MANDIRI-123', $result['trx_id']);
        $this->assertEquals('7001400002025150', $result['virtual_account_no']);
        $this->assertEquals('BMRI', $result['bank_code']);
        $this->assertEquals('Bank Mandiri', $result['bank_name']);
        $this->assertEquals('Pending', $result['status']);

        Http::assertSent(function ($request) {
            return str_contains($request->url(), 'transaction/create') &&
                   $request->hasHeader('X-API-KEY', 'TEST_VA_API_KEY_789') &&
                   $request['method'] === 1 &&
                   $request['additional_info']['type'] === 1 &&
                   $request['additional_info']['bank_code'] === 'BMRI';
        });
    }

    public function test_it_retrieves_va_bank_list_successfully()
    {
        Http::fake([
            '*/api/v1/va/bank-list' => Http::response([
                'success' => true,
                'message' => 'Bank list retrieved successfully',
                'data' => [
                    ['bank_code' => 'BMRI', 'bank_name' => 'Bank Mandiri', 'va_type' => ['DYNAMIC', 'STATIC']],
                    ['bank_code' => 'BRIN', 'bank_name' => 'Bank BRI', 'va_type' => ['DYNAMIC', 'STATIC']],
                ],
            ], 200),
        ]);

        $service = new ManjoService();
        $banks = $service->getVaBankList();

        $this->assertCount(2, $banks);
        $this->assertEquals('BMRI', $banks[0]['bank_code']);
        $this->assertEquals('BRIN', $banks[1]['bank_code']);
    }

    public function test_it_sanitizes_sensitive_data_in_logs()
    {
        $service = new ManjoService();

        $input = [
            'Authorization' => 'Bearer SENSITIVE_TOKEN_123',
            'X-API-KEY' => 'SENSITIVE_API_KEY_456',
            'X-SIGNATURE' => 'SENSITIVE_SIGNATURE_789',
            'customer_name' => 'Budi',
            'client_secret' => 'SUPER_SECRET',
            'nested' => [
                'accessToken' => 'NESTED_TOKEN',
                'public_data' => 'PUBLIC',
            ],
        ];

        $sanitized = $service->sanitizeData($input);

        $this->assertEquals('[REDACTED]', $sanitized['Authorization']);
        $this->assertEquals('[REDACTED]', $sanitized['X-API-KEY']);
        $this->assertEquals('[REDACTED]', $sanitized['X-SIGNATURE']);
        $this->assertEquals('[REDACTED]', $sanitized['client_secret']);
        $this->assertEquals('Budi', $sanitized['customer_name']);
        $this->assertEquals('[REDACTED]', $sanitized['nested']['accessToken']);
        $this->assertEquals('PUBLIC', $sanitized['nested']['public_data']);
    }

    public function test_it_handles_api_errors_properly()
    {
        Http::fake([
            '*/v1.0/access-token/b2b' => Http::response([
                'responseCode' => '4017300',
                'responseMessage' => 'Unauthorized: Invalid Signature',
            ], 401),
        ]);

        $service = new ManjoService();

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('4017300');
        $service->getQrisAccessToken();
    }
}
