<?php

namespace App\Http\Controllers\History;

use App\Http\Controllers\Controller;
use App\Http\Requests\Master\Employee\PositionDataRequest;
use App\Models\Employee;
use App\Models\PositionHistory;
use App\Repositories\App\AppRepository;
use App\Repositories\Employee\EmployeeRepository;
use App\Traits\ResponseOutput;
use Illuminate\Http\Request;

class CPositionHistory extends Controller
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
    public function store(PositionDataRequest $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $isLast = $request->is_last;
            $employee = Employee::whereNip($request->nip)->first();
            $history =  $this->employeeRepository->savePositionHistory($request, $employee);
            if ($isLast == "Yes") {
                $employee->positionHistories()
                    ->where('id', '!=', $history->id)
                    ->update(['is_last' => 'No']);
                $history->update(['is_last' => 'Yes']);
                $employee->update(['position_id' => $request->position_id]);
            }
            $message = $history->wasRecentlyCreated
                ? __('Position History created successfully')
                : __('Position History updated successfully');
            return redirect()->back()->with('success', $message);
        });
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PositionHistory $positionHistory)
    {
        return $this->safeInertiaExecute(function () use ($positionHistory) {
            if ($positionHistory->is_last == "Yes") {
                return back()->with('error', __("Last Position Can't Be Deleted"));
            }
            $this->appRepository->deleteOneModelWithFile($positionHistory, $positionHistory->position_sk_file);
            return back()->with('success', __("Position History deleted successfully"));
        });
    }
}
