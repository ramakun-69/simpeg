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
            'Juru Muda',
            'Juru Muda Tingkat I',
            'Juru',
            'Juru Tingkat I',
            'Pengatur Muda',
            'Pengatur Muda Tingkat I',
            'Penata Muda',
            'Penata Muda Tingkat I',
            'Penata',
            'Penata Tingkat I',
            'Pembina',
            'Pembina Tingkat I',
            'Pembina Utama Muda',
            'Pembina Utama Madya',
            'Pembina Utama',
        ];

        foreach ($ranks as $rank) {
            Rank::updateOrCreate(
                ['name' => $rank],
                ['created_at' => now(), 'updated_at' => now()]
            );
        }
    }
}
