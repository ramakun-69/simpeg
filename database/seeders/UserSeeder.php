<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Employee;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;


class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::updateOrCreate(['username' => '197001011990011001'], [
            'id'      => (string) Str::uuid(),
            'name'     => 'Administrator',
            'email'    => 'admin@example.com',
            'username' => '197001011990011001',
            'password' => '197001011990011001',
        ]);
        $user->assignRole('Superadmin');
        Employee::create([
            'id'          => (string) Str::uuid(),
            'user_id'     => $user->id,
            'nip'         => '197001011990011001',
            'name'        => $user->name,
            'gender'      => 'Male',
            'born_place'  => 'Jakarta',
            'born_date'   => '1990-01-01',
            'phone'       => '082244812291',
            'address'     => 'Jl. Sudirman No. 123',
            'employee_type' => 'PNS',
            'division'      => 'Irban 1',
        ]);
    }
}
