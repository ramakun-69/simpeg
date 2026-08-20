<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        /*
         * Administrator
         */
        $admin = User::updateOrCreate(
            ['username' => '197001011990011001'],
            [
                'name' => 'Administrator',
                'email' => 'admin@example.com',
                'password' => Hash::make('197001011990011001'),
            ]
        );

        $admin->syncRoles(['Superadmin']);

        Employee::updateOrCreate(
            ['user_id' => $admin->id],
            [
                'nip' => '197001011990011001',
                'name' => $admin->name,
                'gender' => 'Male',
                'born_place' => 'Jakarta',
                'born_date' => '1990-01-01',
                'phone' => '082244812291',
                'address' => 'Jl. Sudirman No. 123',
                'employee_type' => 'PNS',
                'division' => 'Sekretariat',
            ]
        );

        /*
         * Sekretaris
         */
        $sekretaris = User::updateOrCreate(
            ['username' => '197501011995011002'],
            [
                'name' => 'Budi Santoso',
                'email' => 'budi.sekretaris@example.com',
                'password' => Hash::make('197501011995011002'),
            ]
        );

        $sekretaris->syncRoles(['Employee']);

        Employee::updateOrCreate(
            ['user_id' => $sekretaris->id],
            [
                'nip' => '197501011995011002',
                'name' => $sekretaris->name,
                'gender' => 'Male',
                'born_place' => 'Surabaya',
                'born_date' => '1975-01-01',
                'phone' => '081234567002',
                'address' => 'Jl. Diponegoro No. 10',
                'employee_type' => 'PNS',
                'division' => 'Sekretariat',
            ]
        );

        /*
         * Irban 1
         */
        $irban1 = User::updateOrCreate(
            ['username' => '197803151998031003'],
            [
                'name' => 'Candra Wijaya',
                'email' => 'candra.irban1@example.com',
                'password' => Hash::make('197803151998031003'),
            ]
        );

        $irban1->syncRoles(['Employee']);

        Employee::updateOrCreate(
            ['user_id' => $irban1->id],
            [
                'nip' => '197803151998031003',
                'name' => $irban1->name,
                'gender' => 'Male',
                'born_place' => 'Malang',
                'born_date' => '1978-03-15',
                'phone' => '081234567003',
                'address' => 'Jl. Ijen No. 25',
                'employee_type' => 'PNS',
                'division' => 'Irban 1',
            ]
        );

        /*
         * Irban 2
         */
        $irban2 = User::updateOrCreate(
            ['username' => '198205201002011004'],
            [
                'name' => 'Dedi Kurniawan',
                'email' => 'dedi.irban2@example.com',
                'password' => Hash::make('198205201002011004'),
            ]
        );

        $irban2->syncRoles(['Employee']);

        Employee::updateOrCreate(
            ['user_id' => $irban2->id],
            [
                'nip' => '198205201002011004',
                'name' => $irban2->name,
                'gender' => 'Male',
                'born_place' => 'Sidoarjo',
                'born_date' => '1982-05-20',
                'phone' => '081234567004',
                'address' => 'Jl. Ahmad Yani No. 40',
                'employee_type' => 'PNS',
                'division' => 'Irban 2',
            ]
        );

        /*
         * Irban 3
         */
        $irban3 = User::updateOrCreate(
            ['username' => '198407102005012005'],
            [
                'name' => 'Eko Prasetyo',
                'email' => 'eko.irban3@example.com',
                'password' => Hash::make('198407102005012005'),
            ]
        );

        $irban3->syncRoles(['Employee']);

        Employee::updateOrCreate(
            ['user_id' => $irban3->id],
            [
                'nip' => '198407102005012005',
                'name' => $irban3->name,
                'gender' => 'Male',
                'born_place' => 'Kediri',
                'born_date' => '1984-07-10',
                'phone' => '081234567005',
                'address' => 'Jl. Veteran No. 18',
                'employee_type' => 'PNS',
                'division' => 'Irban 3',
            ]
        );

        /*
         * Irban 4
         */
        $irban4 = User::updateOrCreate(
            ['username' => '198609122010041006'],
            [
                'name' => 'Fajar Hidayat',
                'email' => 'fajar.irban4@example.com',
                'password' => Hash::make('198609122010041006'),
            ]
        );

        $irban4->syncRoles(['Employee']);

        Employee::updateOrCreate(
            ['user_id' => $irban4->id],
            [
                'nip' => '198609122010041006',
                'name' => $irban4->name,
                'gender' => 'Male',
                'born_place' => 'Jember',
                'born_date' => '1986-09-12',
                'phone' => '081234567006',
                'address' => 'Jl. Kartini No. 5',
                'employee_type' => 'PNS',
                'division' => 'Irban 4',
            ]
        );

        /*
         * Irban 5
         */
        $irban5 = User::updateOrCreate(
            ['username' => '198801152012051007'],
            [
                'name' => 'Gilang Pratama',
                'email' => 'gilang.irban5@example.com',
                'password' => Hash::make('198801152012051007'),
            ]
        );

        $irban5->syncRoles(['Employee']);

        Employee::updateOrCreate(
            ['user_id' => $irban5->id],
            [
                'nip' => '198801152012051007',
                'name' => $irban5->name,
                'gender' => 'Male',
                'born_place' => 'Madiun',
                'born_date' => '1988-01-15',
                'phone' => '081234567007',
                'address' => 'Jl. Pahlawan No. 12',
                'employee_type' => 'PNS',
                'division' => 'Irban 5',
            ]
        );

        /*
         * Inspektur
         */
        $inspektur = User::updateOrCreate(
            ['username' => '196805121990031008'],
            [
                'name' => 'Hendra Wijaya',
                'email' => 'hendra.inspektur@example.com',
                'password' => Hash::make('196805121990031008'),
            ]
        );

        $inspektur->syncRoles(['Employee']);

        Employee::updateOrCreate(
            ['user_id' => $inspektur->id],
            [
                'nip' => '196805121990031008',
                'name' => $inspektur->name,
                'gender' => 'Male',
                'born_place' => 'Jember',
                'born_date' => '1968-05-12',
                'phone' => '081234567008',
                'address' => 'Jl. Kartini No. 5',
                'employee_type' => 'PNS',
                'division' => 'Sekretariat',
            ]
        );
    }
}
