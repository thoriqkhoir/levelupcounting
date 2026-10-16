<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Manjo Environment
    |--------------------------------------------------------------------------
    |
    | Supported values: 'uat', 'production'
    |
    */
    'environment' => env('MANJO_ENV', 'uat'),

    /*
    |--------------------------------------------------------------------------
    | HTTP Request Timeout
    |--------------------------------------------------------------------------
    |
    | Timeout in seconds for outgoing HTTP requests to Manjo API.
    |
    */
    'timeout' => (int) env('MANJO_TIMEOUT', 30),

    /*
    |--------------------------------------------------------------------------
    | Manjo QRIS Dynamic Configuration (SNAP BI Standard)
    |--------------------------------------------------------------------------
    |
    | Configuration for generating QRIS MPM Dynamic via SNAP BI B2B API.
    | Base URL UAT: https://snap-uat.manjo.co.id/api
    |
    */
    'qris' => [
        'base_url' => env('MANJO_QRIS_BASE_URL', 'https://snap-uat.manjo.co.id/api'),
        'client_key' => env('MANJO_QRIS_CLIENT_KEY'),
        'client_secret' => env('MANJO_QRIS_CLIENT_SECRET'),
        'partner_id' => env('MANJO_QRIS_PARTNER_ID'),
        'merchant_id' => env('MANJO_QRIS_MERCHANT_ID'),
        'terminal_id' => env('MANJO_QRIS_TERMINAL_ID', '01'),
        'store_id' => env('MANJO_QRIS_STORE_ID'),
        'channel_id' => env('MANJO_QRIS_CHANNEL_ID', '05'),

        // Path ke file RSA Private Key merchant (.key / .pem)
        'private_key_path' => env('MANJO_QRIS_PRIVATE_KEY_PATH'),
        // Atau string isi RSA Private Key jika disimpan langsung di env
        'private_key' => env('MANJO_QRIS_PRIVATE_KEY'),
        'private_key_passphrase' => env('MANJO_QRIS_PRIVATE_KEY_PASSPHRASE', ''),

        // Public key Manjo (jika digunakan untuk verifikasi callback asimetris)
        'public_key_path' => env('MANJO_QRIS_PUBLIC_KEY_PATH'),
        'public_key' => env('MANJO_QRIS_PUBLIC_KEY'),

        // Format signature B2B: 'hex' (default sesuai contoh dokumentasi Manjo) atau 'base64'
        'signature_encoding' => env('MANJO_QRIS_SIGNATURE_ENCODING', 'hex'),

        // Durasi cache token akses dalam detik (default 840s = 14 menit, batas token 900s)
        'token_cache_ttl' => (int) env('MANJO_QRIS_TOKEN_CACHE_TTL', 840),

        // Default masa berlaku QRIS dalam detik (contoh: 900 = 15 menit)
        'validity_period' => env('MANJO_QRIS_VALIDITY_PERIOD', '900'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Manjo Virtual Account Configuration (Dashboard API)
    |--------------------------------------------------------------------------
    |
    | Configuration for creating Virtual Account via Manjo Dashboard API.
    | Base URL UAT: https://uat-api-dashboard.manjo.co.id
    |
    */
    'va' => [
        'base_url' => env('MANJO_VA_BASE_URL', 'https://uat-api-dashboard.manjo.co.id'),
        'api_key' => env('MANJO_VA_API_KEY'),
        'callback_url' => env('MANJO_VA_CALLBACK_URL'),
        // Masa berlaku default transaksi VA dalam menit (contoh: 1440 = 24 jam)
        'expiry_minutes' => (int) env('MANJO_VA_EXPIRY_MINUTES', 1440),
    ],
];
