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
            'email' => 'levelupacc4@gmail.com',
            'phone_number' => '087754764475',
            'bio' => 'Admin Level Up Accounting',
            'password' => bcrypt('levelup2025'),
        ]);

        $adminAffiliate = User::factory()->create([
            'name' => 'Level Up Accounting Affiliate',
            'email' => 'aaffiliatelevelupacc4@gmail.com',
            'phone_number' => '087754764475',
            'bio' => "Level Up Accounting's Affiliate",
            'password' => bcrypt('levelup2025'),
            'affiliate_code' => 'LUC2025',
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
