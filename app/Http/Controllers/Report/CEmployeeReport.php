<?php

namespace App\Http\Controllers\Report;

use App\Models\Rank;
use App\Models\Grade;
use App\Models\Employee;
use App\Models\Position;
use Illuminate\Http\Request;
use App\Traits\ResponseOutput;
use App\Exports\EmployeeReport;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;


class CEmployeeReport extends Controller
{
    use ResponseOutput;
    public function index()
    {
        $positions = Position::cursor();
        $ranks = Rank::cursor();
        $grades = Grade::cursor();
        return inertia('Report/EmployeeReport', compact('ranks', 'grades', 'positions'));
    }
    public function store(Request $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $data = Employee::with(['position', 'rank'])
                ->when(
                    $request->identity,
                    fn($q) =>
                    $q->where(
                        fn($q2) =>
                        $q2->where('name', 'like', "%{$request->identity}%")
                            ->orWhere('nip', 'like', "%{$request->identity}%")
                    )
                )
                ->when(
                    $request->position_id,
                    fn($q) =>
                    $q->where('position_id', $request->position_id)
                )
                ->when(
                    $request->rank_id,
                    fn($q) =>
                    $q->where('rank_id', $request->rank_id)
                )
                ->when(
                    $request->gender,
                    fn($q) =>
                    $q->where('gender', $request->gender)
                )
                ->when(
                    $request->division,
                    fn($q) =>
                    $q->where('division', $request->division)
                )
                ->get();
        
            $export = Excel::download(new EmployeeReport($data), __("Employee Report") . '.xlsx');
            return $export;
        });
    }
}
