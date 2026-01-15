<?php

namespace Database\Seeders;

use App\Models\Rank;
use Illuminate\Database\Seeder;

class RankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

    public function run()
    {
        $ranks = [
            'CPNS I/a - Juru Muda',
            'CPNS I/b - Juru Muda Tingkat I',
            'CPNS I/c - Juru',
            'CPNS I/d - Juru Tingkat I',
            'CPNS II/a - Pengatur Muda',
            'CPNS II/b - Pengatur Muda Tingkat I',
            'CPNS II/c - Pengatur Muda',
            'CPNS II/d - Pengatur Muda',
            'CPNS III/a - Penata Muda',
            'CPNS III/b - Penata Muda Tingkat I',
            'I/a - Juru Muda',
            'I/b - Juru Muda Tingkat I',
            'I/c - Juru',
            'I/d - Juru Tingkat I',
            'II/a - Pengatur Muda',
            'II/b - Pengatur Muda Tingkat I',
            'II/c - Pengatur Muda',
            'II/d - Pengatur Muda',
            'III/a - Penata Muda',
            'III/b - Penata Muda Tingkat I',
            'III/c - Penata',
            'III/d - Penata Tingkat I',
            'IV/a - Pembina',
            'IV/b - Pembina Tingkat I',
            'IV/c - Pembina Utama Muda',
            'IV/d - Pembina Utama Madya',
            'IV/e - Pembina Utama',
        ];

        foreach ($ranks as $rank) {
            Rank::updateOrCreate(
                ['name' => $rank],
                ['created_at' => now(), 'updated_at' => now()]
            );
        }
    }
}
