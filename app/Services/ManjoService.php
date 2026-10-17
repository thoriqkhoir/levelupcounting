<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ManjoService
{
    protected string $environment;
    protected int $timeout;

    // QRIS B2B SNAP BI Configs
    protected string $qrisBaseUrl;
    protected ?string $qrisClientKey;
    protected ?string $qrisClientSecret;
    protected ?string $qrisPartnerId;
    protected ?string $qrisMerchantId;
    protected ?string $qrisTerminalId;
    protected ?string $qrisStoreId;
    protected string $qrisChannelId;
    protected ?string $qrisPrivateKey;
    protected ?string $qrisPrivateKeyPath;
    protected string $qrisPrivateKeyPassphrase;
    protected ?string $qrisPublicKey;
    protected ?string $qrisPublicKeyPath;
    protected string $qrisSignatureEncoding;
    protected int $qrisTokenCacheTtl;
    protected string $qrisValidityPeriod;

    // Virtual Account Dashboard API Configs
    protected string $vaBaseUrl;
    protected ?string $vaApiKey;
    protected ?string $vaCallbackUrl;
    protected int $vaExpiryMinutes;

    public function __construct()
    {
        $this->environment = config('manjo.environment', 'uat');
        $this->timeout = (int) config('manjo.timeout', 30);

        // QRIS
        $this->qrisBaseUrl = rtrim((string) config('manjo.qris.base_url', 'https://snap-uat.manjo.co.id/api'), '/');
        $this->qrisClientKey = config('manjo.qris.client_key');
        $this->qrisClientSecret = config('manjo.qris.client_secret');
        $this->qrisPartnerId = config('manjo.qris.partner_id');
        $this->qrisMerchantId = config('manjo.qris.merchant_id');
        $this->qrisTerminalId = config('manjo.qris.terminal_id', '01');
        $this->qrisStoreId = config('manjo.qris.store_id');
        $this->qrisChannelId = (string) config('manjo.qris.channel_id', '05');
        $this->qrisPrivateKey = config('manjo.qris.private_key');
        $this->qrisPrivateKeyPath = config('manjo.qris.private_key_path');
        $this->qrisPrivateKeyPassphrase = (string) config('manjo.qris.private_key_passphrase', '');
        $this->qrisPublicKey = config('manjo.qris.public_key');
        $this->qrisPublicKeyPath = config('manjo.qris.public_key_path');
        $this->qrisSignatureEncoding = (string) config('manjo.qris.signature_encoding', 'hex');
        $this->qrisTokenCacheTtl = (int) config('manjo.qris.token_cache_ttl', 840);
        $this->qrisValidityPeriod = (string) config('manjo.qris.validity_period', '900');

        // VA
        $this->vaBaseUrl = rtrim((string) config('manjo.va.base_url', 'https://uat-api-dashboard.manjo.co.id'), '/');
        $this->vaApiKey = config('manjo.va.api_key');
        $this->vaCallbackUrl = config('manjo.va.callback_url');
        $this->vaExpiryMinutes = (int) config('manjo.va.expiry_minutes', 1440);
    }

    /*
    |--------------------------------------------------------------------------
    | MANJO QRIS DYNAMIC (SNAP BI STANDARDS)
    |--------------------------------------------------------------------------
    */

    /**
     * Memperoleh OAuth 2.0 B2B Access Token dari Manjo SNAP API.
     * Token disimpan di Cache sesuai masa berlaku (expiresIn).
     *
     * @param bool $forceRefresh Paksa request token baru tanpa membaca cache
     * @return string
     * @throws \Exception
     */
    public function getQrisAccessToken(bool $forceRefresh = false): string
    {
        $cacheKey = 'manjo_qris_b2b_access_token_' . md5($this->qrisClientKey ?? 'default');

        if (!$forceRefresh && Cache::has($cacheKey)) {
            $cachedToken = Cache::get($cacheKey);
            if (!empty($cachedToken)) {
                return (string) $cachedToken;
            }
        }

        if (empty($this->qrisClientKey)) {
            throw new \InvalidArgumentException('Manjo QRIS client_key belum dikonfigurasi.');
        }

        $timestamp = now()->toIso8601String();
        $stringToSign = $this->qrisClientKey . '|' . $timestamp;
        $signature = $this->generateAsymmetricSignature($stringToSign);

        $endpointUrl = $this->qrisBaseUrl . '/v1.0/access-token/b2b';
        $headers = [
            'Content-Type' => 'application/json',
            'X-CLIENT-KEY' => $this->qrisClientKey,
            'X-TIMESTAMP' => $timestamp,
            'X-SIGNATURE' => $signature,
        ];

        $payload = [
            'grantType' => 'client_credentials',
        ];

        $startTime = microtime(true);

        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders($headers)
                ->post($endpointUrl, $payload);

            $duration = microtime(true) - $startTime;
            $this->logApiCall('QRIS_B2B_TOKEN', 'POST', $endpointUrl, $headers, $payload, $response->status(), $response->json(), $duration);

            if ($response->failed()) {
                $responseCode = $response->json('responseCode') ?? (string) $response->status();
                $responseMessage = $response->json('responseMessage') ?? $response->body();
                throw new \RuntimeException("Gagal memperoleh Manjo QRIS Access Token [{$responseCode}]: {$responseMessage}");
            }

            $tokenData = $response->json();
            $accessToken = $tokenData['accessToken'] ?? null;
            $expiresIn = (int) ($tokenData['expiresIn'] ?? 900);

            if (empty($accessToken)) {
                throw new \UnexpectedValueException('Respons Manjo tidak memuat accessToken yang valid.');
            }

            // Cache token (kurangi 60 detik dari batas kedaluwarsa untuk toleransi waktu)
            $ttlSeconds = max(60, min($expiresIn - 60, $this->qrisTokenCacheTtl));
            Cache::put($cacheKey, $accessToken, now()->addSeconds($ttlSeconds));

            return (string) $accessToken;
        } catch (\Exception $e) {
            if (!($e instanceof \RuntimeException) && !($e instanceof \UnexpectedValueException)) {
                $this->logException('QRIS_B2B_TOKEN', 'POST', $endpointUrl, $e);
            }
            throw $e;
        }
    }

    /**
     * Membuat transaksi QRIS MPM (Merchant Presented Mode) Dynamic.
     *
     * @param array $params [
     *     'partnerReferenceNo' => string (unik dari merchant / kode invoice),
     *     'amount' => float|int|string,
     *     'productDescription' => string (opsional),
     *     'merchantId' => string (opsional, default config),
     *     'storeId' => string (opsional),
     *     'terminalId' => string (opsional),
     *     'validityPeriod' => string (opsional),
     *     'additionalInfo' => array (opsional)
     * ]
     * @return array [
     *     'success' => bool,
     *     'reference_no' => string,
     *     'partner_reference_no' => string,
     *     'qr_content' => string,
     *     'qr_url' => ?string,
     *     'qr_image' => ?string,
     *     'raw_response' => array
     * ]
     * @throws \Exception
     */
    public function generateQrisMpm(array $params): array
    {
        $accessToken = $this->getQrisAccessToken();

        $amountFormatted = number_format((float) ($params['amount'] ?? 0), 2, '.', '');
        if ((float) $amountFormatted <= 0) {
            throw new \InvalidArgumentException('Nominal transaksi QRIS harus lebih besar dari 0.');
        }

        $partnerReferenceNo = (string) ($params['partnerReferenceNo'] ?? '');
        if (empty($partnerReferenceNo)) {
            throw new \InvalidArgumentException('partnerReferenceNo wajib diisi.');
        }

        $merchantId = (string) ($params['merchantId'] ?? $this->qrisMerchantId);
        if (empty($merchantId)) {
            throw new \InvalidArgumentException('Manjo merchantId belum dikonfigurasi.');
        }

        $endpointUrl = $this->qrisBaseUrl . '/v1.0/qr/qr-mpm-generate';
        $endpointPath = parse_url($endpointUrl, PHP_URL_PATH) ?: '/v1.0/qr/qr-mpm-generate';
        $timestamp = now()->toIso8601String();
        $externalId = Str::substr(preg_replace('/[^A-Za-z0-9]/', '', (string) ($params['externalId'] ?? (string) Str::uuid())), 0, 36);

        $body = [
            'partnerReferenceNo' => $partnerReferenceNo,
            'amount' => [
                'value' => $amountFormatted,
                'currency' => 'IDR',
            ],
            'merchantId' => $merchantId,
            'subMerchantId' => (string) ($params['subMerchantId'] ?? ''),
            'storeId' => (string) ($params['storeId'] ?? $this->qrisStoreId ?? ''),
            'terminalId' => (string) ($params['terminalId'] ?? $this->qrisTerminalId),
            'validityPeriod' => (string) ($params['validityPeriod'] ?? $this->qrisValidityPeriod),
            'additionalInfo' => array_merge([
                'paymentId' => '99',
                'dynamicAmount' => 'N',
                'prodDesc' => Str::substr((string) ($params['productDescription'] ?? 'Pembayaran'), 0, 100),
            ], $params['additionalInfo'] ?? []),
        ];

        // Format minified JSON untuk payload signature
        $minifiedJson = json_encode($body, JSON_UNESCAPED_SLASHES);
        $signature = $this->generateSymmetricSignature('POST', $endpointPath, $accessToken, $minifiedJson, $timestamp);

        $headers = [
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $accessToken,
            'X-TIMESTAMP' => $timestamp,
            'X-PARTNER-ID' => (string) ($this->qrisPartnerId ?? $merchantId),
            'X-EXTERNAL-ID' => $externalId,
            'CHANNEL-ID' => $this->qrisChannelId,
            'X-IP-ADDRESS' => config('manjo.qris.ip_address') ?: (request()->ip() ?: '127.0.0.1'),
            'X-SIGNATURE' => $signature,
        ];

        if (!empty($params['origin'])) {
            $headers['ORIGIN'] = (string) $params['origin'];
        }

        $startTime = microtime(true);

        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders($headers)
                ->post($endpointUrl, $body);

            $duration = microtime(true) - $startTime;
            $this->logApiCall('QRIS_MPM_GENERATE', 'POST', $endpointUrl, $headers, $body, $response->status(), $response->json(), $duration);

            $resJson = $response->json() ?? [];
            $responseCode = $resJson['responseCode'] ?? null;

            if ($response->failed() || $responseCode !== '2004700') {
                $msg = $resJson['responseMessage'] ?? $response->body();
                throw new \RuntimeException("Gagal generate Manjo QRIS MPM [{$responseCode}]: {$msg}");
            }

            return [
                'success' => true,
                'reference_no' => $resJson['referenceNo'] ?? null,
                'partner_reference_no' => $resJson['partnerReferenceNo'] ?? $partnerReferenceNo,
                'qr_content' => $resJson['qrContent'] ?? null,
                'qr_url' => (!empty($resJson['qrUrl']) && $resJson['qrUrl'] !== '-') ? $resJson['qrUrl'] : null,
                'qr_image' => (!empty($resJson['qrImage']) && $resJson['qrImage'] !== '-') ? $resJson['qrImage'] : null,
                'redirect_url' => (!empty($resJson['redirectUrl']) && $resJson['redirectUrl'] !== '-') ? $resJson['redirectUrl'] : null,
                'merchant_name' => $resJson['merchantName'] ?? null,
                'additional_info' => $resJson['additionalInfo'] ?? [],
                'raw_response' => $resJson,
            ];
        } catch (\Exception $e) {
            if (!($e instanceof \RuntimeException)) {
                $this->logException('QRIS_MPM_GENERATE', 'POST', $endpointUrl, $e);
            }
            throw $e;
        }
    }

    /*
    |--------------------------------------------------------------------------
    | MANJO VIRTUAL ACCOUNT (DASHBOARD API)
    |--------------------------------------------------------------------------
    */

    /**
     * Mengambil daftar bank pendukung Virtual Account dari Manjo Dashboard API.
     *
     * @param bool $refreshCache Paksa refresh cache
     * @return array
     * @throws \Exception
     */
    public function getVaBankList(bool $refreshCache = false): array
    {
        $cacheKey = 'manjo_va_bank_list';

        if (!$refreshCache && Cache::has($cacheKey)) {
            return (array) Cache::get($cacheKey);
        }

        if (empty($this->vaApiKey)) {
            throw new \InvalidArgumentException('Manjo VA api_key belum dikonfigurasi.');
        }

        $endpointUrl = $this->vaBaseUrl . '/api/v1/va/bank-list';
        $headers = [
            'X-API-KEY' => $this->vaApiKey,
            'Content-Type' => 'application/json',
        ];

        $startTime = microtime(true);

        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders($headers)
                ->get($endpointUrl);

            $duration = microtime(true) - $startTime;
            $this->logApiCall('VA_BANK_LIST', 'GET', $endpointUrl, $headers, [], $response->status(), $response->json(), $duration);

            if ($response->failed() || !($response->json('success') ?? false)) {
                $msg = $response->json('message') ?? $response->body();
                throw new \RuntimeException("Gagal mengambil daftar bank VA Manjo: {$msg}");
            }

            $bankData = $response->json('data') ?? [];
            Cache::put($cacheKey, $bankData, now()->addHours(6));

            return $bankData;
        } catch (\Exception $e) {
            if (!($e instanceof \RuntimeException)) {
                $this->logException('VA_BANK_LIST', 'GET', $endpointUrl, $e);
            }
            throw $e;
        }
    }

    /**
     * Membuat transaksi Virtual Account (Dynamic) melalui Manjo Dashboard API.
     *
     * @param array $params [
     *     'amount' => int|float,
     *     'customerName' => string,
     *     'bankCode' => string (e.g. 'BMRI', 'BRIN', 'BNIA', 'BBBA', 'BSYI'),
     *     'customerEmail' => ?string,
     *     'customerPhone' => ?string,
     *     'expiredDate' => ?string (ISO-8601 / RFC3339 format),
     *     'callbackUrl' => ?string
     * ]
     * @return array [
     *     'success' => bool,
     *     'trx_id' => string,
     *     'virtual_account_no' => string,
     *     'bank_code' => string,
     *     'bank_name' => ?string,
     *     'amount' => int,
     *     'status' => string,
     *     'expired_date' => string,
     *     'raw_response' => array
     * ]
     * @throws \Exception
     */
    public function createVirtualAccount(array $params): array
    {
        if (empty($this->vaApiKey)) {
            throw new \InvalidArgumentException('Manjo VA api_key belum dikonfigurasi.');
        }

        $amount = (int) ($params['amount'] ?? 0);
        if ($amount <= 0) {
            throw new \InvalidArgumentException('Nominal transaksi VA harus lebih besar dari 0.');
        }

        $bankCode = strtoupper(trim((string) ($params['bankCode'] ?? '')));
        if (empty($bankCode)) {
            throw new \InvalidArgumentException('bank_code VA wajib diisi.');
        }

        $customerName = trim((string) ($params['customerName'] ?? ''));
        if (empty($customerName)) {
            throw new \InvalidArgumentException('customer_name VA wajib diisi.');
        }

        $expiredDate = $params['expiredDate'] ?? now()->addMinutes($this->vaExpiryMinutes)->toIso8601String();
        $callbackUrl = $params['callbackUrl'] ?? $this->vaCallbackUrl;

        $endpointUrl = $this->vaBaseUrl . '/api/v1/transaction/create';
        $headers = [
            'X-API-KEY' => $this->vaApiKey,
            'Content-Type' => 'application/json',
        ];

        $payload = [
            'method' => 1, // 1 = Virtual Account
            'amount' => $amount,
            'additional_info' => [
                'type' => 1, // 1 = DYNAMIC
                'customer_name' => $customerName,
                'account_email' => (string) ($params['customerEmail'] ?? ''),
                'account_phone' => (string) ($params['customerPhone'] ?? ''),
                'custom_number' => null,
                'currency' => 'IDR',
                'bank_code' => $bankCode,
                'expired_date' => $expiredDate,
                'callback_url' => $callbackUrl,
            ],
        ];

        $startTime = microtime(true);

        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders($headers)
                ->post($endpointUrl, $payload);

            $duration = microtime(true) - $startTime;
            $this->logApiCall('VA_TRANSACTION_CREATE', 'POST', $endpointUrl, $headers, $payload, $response->status(), $response->json(), $duration);

            $resJson = $response->json() ?? [];

            if ($response->failed() || !($resJson['success'] ?? false)) {
                $msg = $resJson['message'] ?? $response->body();
                throw new \RuntimeException("Gagal membuat transaksi Virtual Account Manjo: {$msg}");
            }

            $data = $resJson['data'] ?? [];

            return [
                'success' => true,
                'trx_id' => $data['trx_id'] ?? null,
                'virtual_account_no' => $data['virtual_account_no'] ?? null,
                'bank_code' => $data['bank_code'] ?? $bankCode,
                'bank_name' => $data['bank_name'] ?? null,
                'amount' => (int) ($data['amount'] ?? $amount),
                'status' => $data['status'] ?? 'Pending',
                'expired_date' => $data['expired_date'] ?? $expiredDate,
                'raw_response' => $resJson,
            ];
        } catch (\Exception $e) {
            if (!($e instanceof \RuntimeException)) {
                $this->logException('VA_TRANSACTION_CREATE', 'POST', $endpointUrl, $e);
            }
            throw $e;
        }
    }

    /*
    |--------------------------------------------------------------------------
    | HELPER METODE SIGNATURE & KRIPTOGRAFI
    |--------------------------------------------------------------------------
    */

    /**
     * Menghasilkan signature asimetris SHA256withRSA untuk SNAP BI B2B Access Token.
     *
     * @param string $stringToSign Format: client_ID + "|" + X-TIMESTAMP
     * @param string|null $encoding 'hex' atau 'base64' (default dari config)
     * @return string
     * @throws \RuntimeException
     */
    public function generateAsymmetricSignature(string $stringToSign, ?string $encoding = null): string
    {
        $privateKeyResource = $this->getPrivateKeyResource();

        $binarySignature = '';
        $success = openssl_sign($stringToSign, $binarySignature, $privateKeyResource, OPENSSL_ALGO_SHA256);

        if (!$success) {
            $err = openssl_error_string();
            throw new \RuntimeException("Gagal menghasilkan RSA signature: {$err}");
        }

        $chosenEncoding = $encoding ?: $this->qrisSignatureEncoding;

        if ($chosenEncoding === 'base64') {
            return base64_encode($binarySignature);
        }

        return bin2hex($binarySignature);
    }

    /**
     * Memverifikasi signature asimetris SHA256withRSA.
     *
     * @param string $data
     * @param string $signature
     * @param string $publicKeyPem
     * @param string|null $encoding
     * @return bool
     */
    public function verifyAsymmetricSignature(string $data, string $signature, string $publicKeyPem, ?string $encoding = null): bool
    {
        $publicKey = openssl_pkey_get_public($publicKeyPem);
        if (!$publicKey) {
            return false;
        }

        $chosenEncoding = $encoding ?: $this->qrisSignatureEncoding;
        $binarySignature = $chosenEncoding === 'base64' ? base64_decode($signature) : hex2bin($signature);

        if ($binarySignature === false) {
            return false;
        }

        return openssl_verify($data, $binarySignature, $publicKey, OPENSSL_ALGO_SHA256) === 1;
    }

    /**
     * Menghasilkan signature simetris HMAC-SHA512 untuk SNAP BI QR MPM Generate & Callback.
     *
     * Formula:
     * stringToSign = HTTPMethod + ":" + EndpointUrl + ":" + AccessToken + ":" + Lowercase(HexEncode(SHA256(minify(RequestBody)))) + ":" + TimeStamp
     * signature = HMAC_SHA512(clientSecret, stringToSign)
     *
     * @param string $httpMethod POST, GET, dll.
     * @param string $endpointUrl Path URL (misal: /v1.0/qr/qr-mpm-generate)
     * @param string $accessToken Token akses B2B tanpa kata 'Bearer '
     * @param string $bodyJson Payload JSON request/callback
     * @param string $timestamp Format ISO-8601 (yyyy-MM-ddTHH:mm:ssTZD)
     * @return string Signature dalam format lowercase hex string
     */
    public function generateSymmetricSignature(
        string $httpMethod,
        string $endpointUrl,
        string $accessToken,
        string $bodyJson,
        string $timestamp
    ): string {
        if (empty($this->qrisClientSecret)) {
            throw new \InvalidArgumentException('Manjo QRIS client_secret belum dikonfigurasi.');
        }

        // Minify JSON payload jika belum minified
        $decoded = json_decode($bodyJson, true);
        $minifiedBody = is_array($decoded) ? json_encode($decoded, JSON_UNESCAPED_SLASHES) : trim($bodyJson);

        $bodyHash = strtolower(hash('sha256', $minifiedBody));
        $cleanToken = Str::replaceFirst('Bearer ', '', $accessToken);

        $stringToSign = strtoupper($httpMethod) . ':' . $endpointUrl . ':' . $cleanToken . ':' . $bodyHash . ':' . $timestamp;

        return hash_hmac('sha512', $stringToSign, $this->qrisClientSecret);
    }

    /**
     * Memverifikasi signature simetris HMAC-SHA512 pada callback QRIS.
     *
     * @param string $incomingSignature
     * @param string $httpMethod
     * @param string $endpointUrl
     * @param string $accessToken
     * @param string $bodyJson
     * @param string $timestamp
     * @return bool
     */
    public function verifySymmetricSignature(
        string $incomingSignature,
        string $httpMethod,
        string $endpointUrl,
        string $accessToken,
        string $bodyJson,
        string $timestamp
    ): bool {
        $expectedSignature = $this->generateSymmetricSignature($httpMethod, $endpointUrl, $accessToken, $bodyJson, $timestamp);
        return hash_equals($expectedSignature, strtolower(trim($incomingSignature)));
    }

    /**
     * Mengambil OpenSSL Private Key resource.
     *
     * @return \OpenSSLAsymmetricKey|resource
     * @throws \RuntimeException
     */
    protected function getPrivateKeyResource()
    {
        $keyContent = $this->qrisPrivateKey;

        if (empty($keyContent) && !empty($this->qrisPrivateKeyPath)) {
            $path = Str::startsWith($this->qrisPrivateKeyPath, '/')
                ? $this->qrisPrivateKeyPath
                : base_path($this->qrisPrivateKeyPath);

            if (!file_exists($path)) {
                throw new \RuntimeException("File Manjo RSA Private Key tidak ditemukan pada path: {$path}");
            }

            $keyContent = file_get_contents($path);
        }

        if (empty($keyContent)) {
            throw new \RuntimeException('Manjo RSA Private Key belum diatur (MANJO_QRIS_PRIVATE_KEY atau MANJO_QRIS_PRIVATE_KEY_PATH).');
        }

        $privateKey = openssl_pkey_get_private($keyContent, $this->qrisPrivateKeyPassphrase);
        if (!$privateKey) {
            $err = openssl_error_string();
            throw new \RuntimeException("Gagal memuat Manjo RSA Private Key: {$err}");
        }

        return $privateKey;
    }

    /*
    |--------------------------------------------------------------------------
    | LOGGING & AUDIT TRAIL AMAN (REDAKSI RAHASIA)
    |--------------------------------------------------------------------------
    */

    /**
     * Mencatat request dan respons API ke log Laravel tanpa membocorkan kredensial.
     */
    protected function logApiCall(
        string $channel,
        string $method,
        string $url,
        array $headers,
        array $body,
        ?int $statusCode,
        $responseBody,
        float $duration
    ): void {
        $sanitizedHeaders = $this->sanitizeData($headers);
        $sanitizedBody = $this->sanitizeData($body);
        $sanitizedResponse = is_array($responseBody) ? $this->sanitizeData($responseBody) : $responseBody;

        Log::info("Manjo API [{$channel}] {$method} {$url}", [
            'status' => $statusCode,
            'duration_ms' => round($duration * 1000, 2),
            'headers' => $sanitizedHeaders,
            'payload' => $sanitizedBody,
            'response' => $sanitizedResponse,
        ]);
    }

    /**
     * Mencatat exception komunikasi API.
     */
    protected function logException(string $channel, string $method, string $url, \Throwable $e): void
    {
        Log::error("Manjo API Exception [{$channel}] {$method} {$url}: " . $e->getMessage(), [
            'file' => $e->getFile(),
            'line' => $e->getLine(),
        ]);
    }

    /**
     * Menyensor field sensitif dari array data sebelum dimasukkan ke log.
     *
     * @param array $data
     * @return array
     */
    public function sanitizeData(array $data): array
    {
        $sensitiveKeys = [
            'authorization',
            'x-api-key',
            'x-signature',
            'client_secret',
            'private_key',
            'accesstoken',
            'token',
            'secret',
            'password',
        ];

        $sanitized = [];
        foreach ($data as $key => $value) {
            $lowerKey = strtolower((string) $key);
            $isSensitive = false;
            foreach ($sensitiveKeys as $pattern) {
                if (str_contains($lowerKey, $pattern)) {
                    $isSensitive = true;
                    break;
                }
            }

            if ($isSensitive) {
                $sanitized[$key] = '[REDACTED]';
            } elseif (is_array($value)) {
                $sanitized[$key] = $this->sanitizeData($value);
            } else {
                $sanitized[$key] = $value;
            }
        }

        return $sanitized;
    }

    /*
    |--------------------------------------------------------------------------
    | PENGUJIAN KONEKSI & DIAGNOSTIK UAT (AMAN / READ-ONLY)
    |--------------------------------------------------------------------------
    */

    /**
     * Memeriksa kesiapan konfigurasi tanpa melakukan transaksi berbayar.
     *
     * @return array
     */
    public function checkConfigStatus(): array
    {
        $privateKeyValid = false;
        $privateKeyError = null;

        try {
            $this->getPrivateKeyResource();
            $privateKeyValid = true;
        } catch (\Throwable $e) {
            $privateKeyError = $e->getMessage();
        }

        return [
            'environment' => $this->environment,
            'qris' => [
                'base_url' => $this->qrisBaseUrl,
                'client_key_set' => !empty($this->qrisClientKey),
                'client_secret_set' => !empty($this->qrisClientSecret),
                'partner_id_set' => !empty($this->qrisPartnerId),
                'merchant_id_set' => !empty($this->qrisMerchantId),
                'private_key_loaded' => $privateKeyValid,
                'private_key_error' => $privateKeyError,
                'signature_encoding' => $this->qrisSignatureEncoding,
            ],
            'va' => [
                'base_url' => $this->vaBaseUrl,
                'api_key_set' => !empty($this->vaApiKey),
                'callback_url_set' => !empty($this->vaCallbackUrl),
            ],
        ];
    }
}
