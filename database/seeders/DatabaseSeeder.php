<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Role::firstOrCreate(['name' => 'admin']);
        Role::firstOrCreate(['name' => 'affiliate']);
        Role::firstOrCreate(['name' => 'mentor']);
        Role::firstOrCreate(['name' => 'user']);

        $admin = User::factory()->create([
            'name' => 'Admin',
            'email' => 'sekolahpajak15@gmail.com',
            'phone_number' => '081252683108',
            'bio' => 'Admin Sekolah Pajak',
            'password' => bcrypt('niha1504'),
        ]);

        $adminAffiliate = User::factory()->create([
            'name' => 'Sekolah Pajak Affiliate',
            'email' => 'aaffiliatesekolahpajak15@gmail.com',
            'phone_number' => '081252683108',
            'bio' => "Sekolah Pajak's Affiliate",
            'password' => bcrypt('sekolahpajak2025'),
            'affiliate_code' => 'SPJ2025',
            'affiliate_status' => 'Active',
            'commission' => 15,
        ]);

        $admin->assignRole('admin');
        $adminAffiliate->assignRole('affiliate');

        $this->call([
            ToolSeeder::class,
            CategorySeeder::class,
        ]);
    }
}
