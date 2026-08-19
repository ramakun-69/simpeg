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
                'base_url' => env('WBS_BASE_URL'),
            ],
            [
                'code' => 'LHP',
                'name' => 'Manajemen LHP',
                'base_url' => env('LHP_BASE_URL'),
            ],
            [
                'code' => 'MONITORING_TINDAK_LANJUT',
                'name' => 'Monitoring Tindak Lanjut',
                'base_url' => env('MONITORING_TINDAK_LANJUT_BASE_URL'),
            ],
            [
                'code' => 'KDPPD',
                'name' => 'KDPPD',
                'base_url' => env('KDPPD_BASE_URL')
            ],
            [
                'code' => 'MANAJEMEN_SURAT',
                'name' => 'Manajemen Surat',
                'base_url' => env('MANAJEMEN_SURAT_BASE_URL')
            ],
            [
                'code' => 'WEBSITE',
                'name' => 'Website Inspektorat',
                'base_url' => env('WEBSITE_BASE_URL')
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
                    'base_url' => $application['base_url']
                ],
            );
        }
    }
}
