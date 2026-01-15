<?php

namespace App\Http\Controllers\Report;

use App\Models\Employee;
use Illuminate\Http\Request;
use App\Traits\ResponseOutput;
use App\Exports\TrainingReport;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;

class CTrainingReport extends Controller
{
    use ResponseOutput;
    public function index()
    {

        return inertia('Report/TrainingReport');
    }
    public function store(Request $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {

            $data = Employee::query()
                ->when(
                    $request->identity,
                    fn($q, $v) =>
                    $q->where(
                        fn($q2) =>
                        $q2->where('name', 'like', "%{$v}%")
                            ->orWhere('nip', 'like', "%{$v}%")
                    )
                )
                ->when(
                    $request->issuing_institution || $request->training_name,
                    fn($q) =>
                    $q->whereHas(
                        'trainingHistories',
                        fn($q2) =>
                        $q2->when(
                            $request->issuing_institution,
                            fn($q3, $v) =>
                            $q3->where('issuing_institution', 'like', "%{$v}%")
                        )
                            ->when(
                                $request->training_name,
                                fn($q3, $v) =>
                                $q3->where('training_name', 'like', "%{$v}%")
                            )
                    )
                        ->with([
                            'trainingHistories' => fn($q2) =>
                            $q2->select('id', 'employee_id', 'issuing_institution', 'training_name')
                                ->when(
                                    $request->issuing_institution,
                                    fn($q3, $v) =>
                                    $q3->where('issuing_institution', 'like', "%{$v}%")
                                )
                                ->when(
                                    $request->training_name,
                                    fn($q3, $v) =>
                                    $q3->where('training_name', 'like', "%{$v}%")
                                )
                        ])
                )
                ->when(
                    ! $request->issuing_institution && ! $request->training_name,
                    fn($q) =>
                    $q->with('trainingHistories:id,employee_id,issuing_institution,training_name')
                )
                ->get();
            
            return Excel::download(new TrainingReport($data), __('Training Report') . '.xlsx');
        });
    }
}
