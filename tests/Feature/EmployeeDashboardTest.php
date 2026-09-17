<?php

use App\Models\Employee;
use App\Models\EmployeeAssigment;
use App\Models\Position;
use App\Models\User;
use App\Services\Employee\EmployeeService;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    // Use the original schema: later grade-removal migrations contain MySQL-only SQL.
    DB::purge('sqlite');
    config(['database.default' => 'sqlite', 'database.connections.sqlite.database' => ':memory:']);
    $paths = array_values(array_filter(glob(database_path('migrations/*.php')), fn ($file) => basename($file) < '2026'));
    $this->artisan('migrate', ['--path' => $paths, '--realpath' => true])->assertSuccessful();
    $this->travelTo(now()->setDate(2026, 9, 18)->startOfDay());
    $this->withoutVite();
    $this->user = User::create([
        'name' => 'Own Employee', 'username' => '199001012010011001',
        'email' => 'own@example.test', 'password' => 'password',
    ]);
    $this->employee = Employee::create([
        'user_id' => $this->user->id, 'nip' => $this->user->username,
        'name' => $this->user->name, 'gender' => 'Male', 'born_place' => 'Medan',
        'born_date' => '1990-01-01', 'phone' => '081234567890', 'address' => 'Medan',
        'employee_type' => 'PNS', 'division' => 'Irban 1', 'status' => 'Active',
    ]);
});

it('only returns the signed in employee and their assignment data', function () {
    $otherUser = User::create(['name' => 'Other Employee', 'username' => 'other', 'email' => 'other@example.test', 'password' => 'password']);
    $otherEmployee = $this->employee->replicate();
    $otherEmployee->fill(['user_id' => $otherUser->id, 'nip' => '199001012010011002', 'name' => 'Other Employee'])->save();
    $position = Position::create(['name' => 'Inspector']);
    foreach ([$this->employee, $otherEmployee] as $employee) {
        EmployeeAssigment::create([
            'employee_id' => $employee->id, 'position_id' => $position->id,
            'type' => 'PLT', 'letter_number' => $employee->nip, 'letter_date' => '2026-09-01',
            'start_date' => '2026-09-01', 'end_date' => '2026-09-18',
        ]);
    }

    $this->actingAs($this->user)->get(route('dashboard', ['employee_id' => $otherEmployee->id]))
        ->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard/Index')->where('employee.id', $this->employee->id)
            ->has('assignments', 1)->where('assignments.0.letter_number', $this->employee->nip)
            ->where('summary.active_assignments', 1)->where('summary.service_years', 16)
            ->missing('employees')->missing('divisionCounts'));
});

it('distinguishes completed upcoming and undated assignments', function () {
    $position = Position::create(['name' => 'Inspector']);
    foreach ([['2026-01-01', '2026-09-17'], ['2026-09-19', null], [null, null]] as [$start, $end]) {
        EmployeeAssigment::create([
            'employee_id' => $this->employee->id, 'position_id' => $position->id,
            'type' => 'PLH', 'letter_number' => 'SK', 'letter_date' => '2026-09-01',
            'start_date' => $start, 'end_date' => $end,
        ]);
    }
    $data = app(EmployeeService::class)->getDashboard($this->user);
    expect($data['summary']['active_assignments'])->toBe(0)
        ->and($data['assignments']->pluck('status')->all())->toEqualCanonicalizing(['Completed', 'Upcoming', 'Not Scheduled']);
});

it('keeps the administrator dashboard', function () {
    $this->user->assignRole(Role::create(['name' => 'Administrator', 'guard_name' => 'web']));
    $this->actingAs($this->user)->get(route('dashboard'))->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('Index')->has('employees', 1)->has('divisionCounts'));
});

it('handles users without an employee record', function () {
    $this->employee->delete();
    $this->actingAs($this->user)->get(route('dashboard'))->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('Dashboard/Index')->where('employee', null)->has('assignments', 0));
});

it('allows employees to change language and redirects them to the dashboard', function () {
    $this->actingAs($this->user)->post(route('set-language'), ['locale' => 'id-ID'])->assertOk()->assertSessionHas('locale', 'id');
    $this->get(route('login'))->assertRedirect(route('dashboard'));
});

it('redirects employee login to the dashboard', function () {
    $this->post(route('authenticate'), ['username' => $this->user->username, 'password' => 'password', 'gRecaptcha' => 'test'])
        ->assertRedirect(route('dashboard'));
});

it('requires authentication for the dashboard', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});
