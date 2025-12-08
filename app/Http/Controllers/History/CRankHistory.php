<?php

namespace App\Http\Controllers\History;

use App\Models\Employee;
use Illuminate\Http\Request;
use App\Traits\ResponseOutput;
use App\Http\Controllers\Controller;
use App\Repositories\App\AppRepository;
use App\Repositories\Employee\EmployeeRepository;
use App\Http\Requests\Master\Employee\RankDataRequest;
use App\Models\RankHistory;

class CRankHistory extends Controller
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
    public function store(RankDataRequest $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $isLast = $request->is_last;
            $employee = Employee::whereNip($request->nip)->first();
            $history =  $this->employeeRepository->saveRankHistory($request, $employee);
            if ($isLast == "Yes") {
                $employee->rankHistories()
                    ->where('id', '!=', $history->id)
                    ->update(['is_last' => 'No']);
                $history->update(['is_last' => 'Yes']);
                $employee->update(['rank_id' => $request->rank_id, 'grade_id' => $request->grade_id]);
            }
            $message = $history->wasRecentlyCreated
                ? __('Rank History created successfully')
                : __('Rank History updated successfully');
            return redirect()->back()->with('success', $message);
        });
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RankHistory $rankHistory)
    {
        return $this->safeInertiaExecute(function () use ($rankHistory) {
            if ($rankHistory->is_last == "Yes") {
                return back()->with('error', __("Last Rank Can't Be Deleted"));
            }
            $this->appRepository->deleteOneModelWithFile($rankHistory, $rankHistory->rank_sk_file);
            return back()->with('success', __("Rank History deleted successfully"));
        });
    }
}
