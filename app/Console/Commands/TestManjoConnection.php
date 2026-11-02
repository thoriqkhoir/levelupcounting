<?php

namespace App\Console\Commands;

use App\Services\ManjoService;
use Illuminate\Console\Command;

class TestManjoConnection extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'manjo:test-connection 
                            {--ping-qris : Uji koneksi dan autentikasi token B2B ke server UAT Manjo}
                            {--ping-va : Uji koneksi dan API Key VA dengan memanggil daftar bank di UAT Manjo}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Periksa status konfigurasi dan uji autentikasi UAT Manjo Payment Gateway (Read-Only)';

    /**
     * Execute the console command.
     */
    public function handle(ManjoService $manjoService): int
    {
        $this->info('=== DIAGNOSTIK KONFIGURASI MANJO PAYMENT GATEWAY ===');

        $status = $manjoService->checkConfigStatus();

        $this->line("Environment: <comment>{$status['environment']}</comment>");
        $this->newLine();

        $this->info('[QRIS Dynamic (SNAP BI)]');
        $this->line("Base URL: {$status['qris']['base_url']}");
        $this->line("Client Key (Client ID) Terisi: " . ($status['qris']['client_key_set'] ? '<info>YA</info>' : '<error>TIDAK</error>'));
        $this->line("Client Secret Terisi: " . ($status['qris']['client_secret_set'] ? '<info>YA</info>' : '<error>TIDAK</error>'));
        $this->line("Partner ID Terisi: " . ($status['qris']['partner_id_set'] ? '<info>YA</info>' : '<error>TIDAK</error>'));
        $this->line("Merchant ID Terisi: " . ($status['qris']['merchant_id_set'] ? '<info>YA</info>' : '<error>TIDAK</error>'));
        $this->line("Signature Encoding: <comment>{$status['qris']['signature_encoding']}</comment>");
        $this->line("RSA Private Key Terbaca: " . ($status['qris']['private_key_loaded'] ? '<info>YA (Valid RSA)</info>' : '<error>GAGAL: ' . ($status['qris']['private_key_error'] ?? 'Belum diset') . '</error>'));

        $this->newLine();
        $this->info('[Virtual Account (Dashboard API)]');
        $this->line("Base URL: {$status['va']['base_url']}");
        $this->line("API Key Terisi: " . ($status['va']['api_key_set'] ? '<info>YA</info>' : '<error>TIDAK</error>'));
        $this->line("Callback URL Terisi: " . ($status['va']['callback_url_set'] ? '<info>YA</info>' : '<comment>OPSIONAL (Belum diset)</comment>'));

        $this->newLine();

        // Uji Ping QRIS B2B Token jika flag diberikan
        if ($this->option('ping-qris')) {
            $this->info('Menguji Autentikasi QRIS B2B Access Token ke server UAT Manjo...');
            try {
                $token = $manjoService->getQrisAccessToken(true);
                $maskedToken = substr($token, 0, 10) . '...' . substr($token, -10);
                $this->info("✓ Berhasil terautentikasi! Access Token diperoleh: {$maskedToken}");
            } catch (\Throwable $e) {
                $this->error("✗ Gagal terautentikasi ke QRIS B2B: " . $e->getMessage());
            }
            $this->newLine();
        }

        // Uji Ping VA Bank List jika flag diberikan
        if ($this->option('ping-va')) {
            $this->info('Menguji Autentikasi Virtual Account (Bank List) ke server UAT Manjo...');
            try {
                $banks = $manjoService->getVaBankList(true);
                $count = count($banks);
                $this->info("✓ Berhasil terautentikasi! Diperoleh {$count} bank pendukung.");
                foreach ($banks as $bank) {
                    $code = $bank['bank_code'] ?? '-';
                    $name = $bank['bank_name'] ?? '-';
                    $types = implode(', ', $bank['va_type'] ?? []);
                    $this->line("  - [{$code}] {$name} ({$types})");
                }
            } catch (\Throwable $e) {
                $this->error("✗ Gagal terautentikasi ke VA API: " . $e->getMessage());
            }
            $this->newLine();
        }

        if (!$this->option('ping-qris') && !$this->option('ping-va')) {
            $this->comment('Catatan: Gunakan opsi --ping-qris atau --ping-va untuk menguji koneksi langsung ke server UAT tanpa membuat transaksi berbayar.');
        }

        return Command::SUCCESS;
    }
}
