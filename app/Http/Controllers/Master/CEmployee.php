<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Http\Requests\Master\Employee\ApplicationAccessRequest;
use App\Http\Requests\Master\Employee\ChangePhotoRequest;
use App\Http\Requests\Master\Employee\EmployeeDataRequest;
use App\Http\Requests\Master\Employee\LastEducationRequest;
use App\Http\Requests\Master\Employee\PositionDataRequest;
use App\Http\Requests\Master\Employee\RankDataRequest;
use App\Http\Requests\Master\Employee\StatusChangeRequest;
use App\Models\Application;
use App\Models\ApplicationAccess;
use App\Models\Employee;
use App\Models\Position;
use App\Models\Rank;
use App\Models\User;
use App\Repositories\App\AppRepository;
use App\Repositories\Employee\EmployeeRepository;
use App\Traits\ResponseOutput;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CEmployee extends Controller
{
    use ResponseOutput, ValidatesRequests;
    protected $employeeRepository, $appRepository;
    public function __construct(EmployeeRepository $employeeRepository, AppRepository $appRepository)
    {
        $this->employeeRepository = $employeeRepository;
        $this->appRepository = $appRepository;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $positions = Position::cursor();
        $ranks = Rank::cursor();
        return inertia('Master/Employee', compact('positions', 'ranks'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    // STORE SECTION

    public function storeEmployeeData(EmployeeDataRequest $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $request->validated();
            return back()->with('success', 'Step one saved');
        });
    }

    public function storePositionData(PositionDataRequest $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $request->validated();
            return back()->with('success', 'Step two saved');
        });
    }
    public function storeRankData(RankDataRequest $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $request->validated();
            return back()->with('success', 'Step three saved');
        });
    }
    public function storeLastEducationData(LastEducationRequest $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $request->validated();
            return back()->with('success', 'Step four saved');
        });
    }
    public function store(Request $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {

            // VALIDASI ULANG SEMUA STEP
            $this->validate($request, (new EmployeeDataRequest)->rules());
            // $this->validate($request, (new PositionDataRequest)->rules());
            // $this->validate($request, (new RankDataRequest)->rules());
            // $this->validate($request, (new LastEducationRequest)->rules());

            // SIMPAN SEMUA DATA
            $this->employeeRepository->employeeStore($request);

            return back()->with('success', __("Employee Added Successfully"));
        });
    }

    /**
     * Display the specified resource.
     */

    public function show(string $id)
    {
        //
    }

    public function applicationAccess(User $user)
    {
        $applications = Application::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'code', 'name']);

        $accesses = $user->applicationAccesses()
            ->whereIn('application_id', $applications->pluck('id'))
            ->get(['application_id', 'is_admin'])
            ->map(fn (ApplicationAccess $access) => [
                'application_id' => $access->application_id,
                'is_admin' => (bool) $access->is_admin,
            ])
            ->values();

        return response()->json([
            'user' => $user->only(['id', 'name', 'email']),
            'applications' => $applications,
            'accesses' => $accesses,
        ]);
    }

    public function updateApplicationAccess(ApplicationAccessRequest $request, User $user)
    {
        return $this->safeExecute(function() use($request, $user){
            $data = $request->validated();
            $accesses = collect($data['accesses'] ?? [])->unique('application_id');
            $applicationIds = Application::query()
                ->where('is_active', true)
                ->whereIn('id', $accesses->pluck('application_id'))
                ->pluck('id');

            DB::transaction(function () use ($user, $applicationIds, $accesses) {
                $user->applicationAccesses()->whereNotIn('application_id', $applicationIds)->delete();

                foreach ($accesses as $access) {
                    if (! $applicationIds->contains($access['application_id'])) continue;
                    $user->applicationAccesses()->updateOrCreate(
                        ['application_id' => $access['application_id']],
                        ['is_admin' => (bool) ($access['is_admin'] ?? false)],
                    );
                }
            });
            return response()->json(['message' => __('Application access updated successfully')]);
        });
     
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Employee $employee)
    {
        $positions = Position::cursor();
        $ranks = Rank::cursor();

        $employee->load('position', 'rank', 'user.roles');
        return inertia('Profile/Index', compact('employee', 'ranks', 'positions'));
    }

    public function changePhoto(ChangePhotoRequest $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $data = $request->validated();
            $user = User::find($data['user_id']);
            $this->appRepository->updateOneModelWithFile($user, [], 'photo', 'images/user');
            return back()->with('success', __("Photo Changed Successfully"));
        });
    }
    public function changeStatus(StatusChangeRequest $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $data = $request->validated();
            $employee = Employee::where('nip', $data['nip'])->update([
                'status' => $data['status'],
                'status_reason' => isset($data['status_reason']) ? $data['status_reason'] : null,
            ]);
            $message = $data['status'] == "Active" ? __("Employee Has Been Sucessfully Activated") : __("Employee Has Been Sucessfully Deactivated");
            return back()->with('success', $message);
        });
    }
    public function changeRole(Request $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {

            $employee = Employee::with('user')->where('nip', $request->nip)->first();
            $user = $employee->user;
            if ($request->role === 'Employee') {
                $user->syncRoles([]);
            }
            if ($request->role === 'Administrator') {
                $user->syncRoles(['Administrator']);
            }
            $message = __("Role Has Been Changed");
            return back()->with('success', $message);
        });
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(EmployeeDataRequest $request, Employee $employee)
    {
        return $this->safeInertiaExecute(function () use ($request, $employee) {
            $data = $request->validated();
            $user = $employee->user;

            // Update password jika ada
            if (!empty($data['password'])) {
                $user->password = bcrypt($data['password']);
            }

            // Fields milik User
            $userFields = ['email'];
            foreach ($userFields as $field) {
                if (isset($data[$field])) {
                    $user->$field = $data[$field];
                    unset($data[$field]);
                }
            }
            $user->save();
            unset($data['password_confirmation'], $data['password']);
            $this->appRepository->updateOneModel($employee, $data);

            return back()->with('success', __("Data Updated Successfully"));
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Employee $employee)
    {
        return $this->safeInertiaExecute(function () use ($employee) {
            if ($employee->user_id == Auth::id()) {
                return back()->with('error', __("Deleting your own account is not allowed"));
            }
            $this->employeeRepository->deleteEmployee($employee);
            return back()->with('success', __("Employee Deleted Successfully"));
        });
    }
}
