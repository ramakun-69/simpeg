<?php

namespace App\Http\Controllers\History;

use App\Models\Employee;
use Illuminate\Http\Request;
use App\Traits\ResponseOutput;
use App\Http\Controllers\Controller;
use App\Repositories\App\AppRepository;
use App\Repositories\Employee\EmployeeRepository;
use App\Http\Requests\Master\Employee\TrainingDataRequest;
use App\Models\TrainingHistory;

class CTrainingHistory extends Controller
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
    public function store(TrainingDataRequest $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $employee = Employee::whereNip($request->nip)->first();
            $history =  $this->employeeRepository->saveTrainingHistory($request, $employee);
            $message = $history->wasRecentlyCreated
                ? __('Training History created successfully')
                : __('Training History updated successfully');
            return redirect()->back()->with('success', $message);
        });
    }
    public function destroy(TrainingHistory $trainingHistory)
    {
        return $this->safeInertiaExecute(function () use ($trainingHistory) {
            $this->appRepository->deleteOneModelWithFile($trainingHistory, $trainingHistory->training_certificate_file);
            return back()->with('success', __("Training History deleted successfully"));
        });
    }
}
