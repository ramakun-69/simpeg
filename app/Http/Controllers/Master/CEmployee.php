<?php

namespace App\Http\Controllers\Master;

use App\Models\Rank;
use App\Models\User;
use App\Models\Grade;
use App\Models\Employee;
use App\Models\Position;
use Illuminate\Http\Request;
use App\Traits\ResponseOutput;
use App\Http\Controllers\Controller;
use App\Repositories\App\AppRepository;
use App\Repositories\Employee\EmployeeRepository;
use App\Http\Requests\Master\Employee\RankDataRequest;
use Illuminate\Foundation\Validation\ValidatesRequests;
use App\Http\Requests\Master\Employee\ChangePhotoRequest;
use App\Http\Requests\Master\Employee\EmployeeDataRequest;
use App\Http\Requests\Master\Employee\PositionDataRequest;
use App\Http\Requests\Master\Employee\LastEducationRequest;

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
        $grades = Grade::cursor();
        return inertia('Master/Employee', compact('positions', 'ranks', 'grades'));
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
            $this->validate($request, (new PositionDataRequest)->rules());
            $this->validate($request, (new RankDataRequest)->rules());
            $this->validate($request, (new LastEducationRequest)->rules());

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

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Employee $employee)
    {
        $positions = Position::cursor();
        $ranks = Rank::cursor();
        $grades = Grade::cursor();
        $employee->load('position', 'rank', 'grade', 'user');
        return inertia('Profile/Index', compact('employee', 'ranks', 'grades', 'positions'));
    }

    public function changePhoto(ChangePhotoRequest $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $data = $request->validated();
            $user = User::find($data['user_id']);
            $this->appRepository->updateOneModelWithFile($user, [], 'photo', 'images/user');
            return back()->with('success',__("Photo Changed Successfully"));
        });
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Employee $employee)
    {
        return $this->safeInertiaExecute(function () use ($employee) {
            $model = Employee::where('id', $employee->id);
            $this->appRepository->forceDeleteOneModel($model);
            return back()->with('success', __("Employee Deleted Successfully"));
        });
    }
}
