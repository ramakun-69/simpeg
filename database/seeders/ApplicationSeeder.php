<?php

namespace Database\Seeders;

use App\Models\Application;
use Illuminate\Database\Seeder;

class ApplicationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $applications = [
            [
                'code' => 'WBS',
                'name' => 'Whistleblowing System',
            ],
            [
                'code' => 'LHP',
                'name' => 'Manajemen LHP',
            ],
            [
                'code' => 'MONITORING_TINDAK_LANJUT',
                'name' => 'Monitoring Tindak Lanjut',
            ],
            [
                'code' => 'KDPPD',
                'name' => 'KDPPD',
            ],
            [
                'code' => 'MANAJEMEN_SURAT',
                'name' => 'Manajemen Surat',
            ],
            [
                'code' => 'WEBSITE',
                'name' => 'Website Inspektorat',
            ],
        ];

        foreach ($applications as $application) {
            Application::updateOrCreate(
                [
                    'code' => $application['code'],
                ],
                [
                    'name' => $application['name'],
                    'is_active' => true,
                ],
            );
        }
    }
}
