<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class GenerateReferralCodes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'referral:generate-codes';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate referral codes LUC-XXXXXX for existing users';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $users = User::whereNull('referral_code')->get();

        if ($users->isEmpty()) {
            $this->info('Semua user sudah memiliki referral code.');
            return;
        }

        $this->info("Generating referral codes untuk {$users->count()} user...");

        foreach ($users as $user) {
            do {
                $code = 'LUC-' . strtoupper(Str::random(6));
            } while (User::where('referral_code', $code)->exists());

            $user->update(['referral_code' => $code]);
        }

        $this->info('Selesai! Seluruh user telah memiliki referral code.');
    }
}
