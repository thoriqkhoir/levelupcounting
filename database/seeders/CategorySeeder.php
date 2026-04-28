<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tools = [
            [
                'name' => 'Pajak Penghasilan',
                'slug' => Str::slug('Pajak Penghasilan'),
            ],
            [
                'name' => 'Pajak Pertambahan Nilai',
                'slug' => Str::slug('Pajak Pertambahan Nilai'),
            ],
            [
                'name' => 'Pajak Daerah',
                'slug' => Str::slug('Pajak Daerah'),
            ],
            [
                'name' => 'Akuntansi Keuangan',
                'slug' => Str::slug('Akuntansi Keuangan'),
            ],
            [
                'name' => 'Akuntansi Manajemen',
                'slug' => Str::slug('Akuntansi Manajemen'),
            ],
            [
                'name' => 'Perpajakan Internasional',
                'slug' => Str::slug('Perpajakan Internasional'),
            ],
            [
                'name' => 'Audit & Assurance',
                'slug' => Str::slug('Audit & Assurance'),
            ],
            [
                'name' => 'Perencanaan Pajak',
                'slug' => Str::slug('Perencanaan Pajak'),
            ],
        ];

        foreach ($tools as $tool) {
            Category::firstOrCreate(['name' => $tool['name']], $tool);
        }
    }
}
