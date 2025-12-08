<?php

namespace App\Http\Controllers\History;

use App\Models\Employee;
use Illuminate\Http\Request;
use App\Traits\ResponseOutput;
use App\Http\Controllers\Controller;
use App\Repositories\App\AppRepository;
use App\Repositories\Employee\EmployeeRepository;
use App\Http\Requests\Master\Employee\LastEducationRequest;
use App\Models\EducationHistory;

class CEducationHistory extends Controller
{
    use ResponseOutput;
    protected $appRepository, $employeeRepository;
    public function __construct(AppRepository $appRepository, EmployeeRepository $employeeRepository)
    {
        $this->appRepository = $appRepository;
        $this->employeeRepository = $employeeRepository;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(LastEducationRequest $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $employee = Employee::whereNip($request->nip)->first();
            $history =  $this->employeeRepository->saveLastEducationHistory($request, $employee);
            $message = $history->wasRecentlyCreated
                ? __('Education History created successfully')
                : __('Education History updated successfully');
            return redirect()->back()->with('success', $message);
        });
    }

    public function destroy(EducationHistory $educationHistory)
    {
        return $this->safeInertiaExecute(function () use ($educationHistory) {
            $this->appRepository->deleteOneModelWithFile($educationHistory, $educationHistory->degree_certificate_file);
            return back()->with('success', __("Education History deleted successfully"));
        });
    }
}
