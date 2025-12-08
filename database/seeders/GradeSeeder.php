<?php

namespace Database\Seeders;

use App\Models\Grade;
use Illuminate\Database\Seeder;

class GradeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $grades = [
            'CPNS I/a',
            'CPNS I/b',
            'CPNS I/c',
            'CPNS I/d',
            'CPNS II/a',
            'CPNS II/b',
            'CPNS II/c',
            'CPNS II/d',
            'CPNS III/a',
            'CPNS III/b',
            'I/a',
            'I/b',
            'I/c',
            'I/d',
            'II/a',
            'II/b',
            'II/c',
            'II/d',
            'III/a',
            'III/b',
            'III/c',
            'III/d',
            'IV/a',
            'IV/b',
            'IV/c',
            'IV/d',
            'IV/e'
        ];

        foreach ($grades as $grade) {
            Grade::updateOrCreate(
                ['name' => $grade],
                ['created_at' => now(), 'updated_at' => now()]
            );
        }
    }
}
