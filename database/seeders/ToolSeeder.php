<?php

namespace Database\Seeders;

use App\Models\Tool;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;

class ToolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tools = [
            [
                'name' => 'DJP Online',
                'slug' => Str::slug('DJP Online'),
                'description' => 'Portal layanan pajak online Direktorat Jenderal Pajak.',
                'icon' => null,
            ],
            [
                'name' => 'Klikpajak',
                'slug' => Str::slug('Klikpajak'),
                'description' => 'Aplikasi pihak ketiga untuk administrasi perpajakan.',
                'icon' => null,
            ],
            [
                'name' => 'OnlinePajak',
                'slug' => Str::slug('OnlinePajak'),
                'description' => 'Aplikasi administrasi dan pelaporan pajak.',
                'icon' => null,
            ],
            [
                'name' => 'e-SPT',
                'slug' => Str::slug('e-SPT'),
                'description' => 'Aplikasi pelaporan SPT elektronik.',
                'icon' => null,
            ],
        ];

        foreach ($tools as $tool) {
            Tool::firstOrCreate(['name' => $tool['name']], $tool);
        }
    }
}
