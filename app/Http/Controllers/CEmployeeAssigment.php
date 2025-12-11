<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeAssigmentRequest;
use App\Models\Employee;
use App\Models\EmployeeAssigment;
use App\Models\Position;
use Illuminate\Http\Request;
use App\Traits\ResponseOutput;
use App\Repositories\App\AppRepository;

class CEmployeeAssigment extends Controller
{
    use ResponseOutput;
    protected $appRepository;
    public function __construct(AppRepository $appRepository)
    {
        $this->appRepository = $appRepository;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $employees = Employee::select('id', 'name', 'position_id')->with('position:id,name')->get();
        $positions = Position::select('id', 'name')->get();
        return inertia('Employee-Assigment/Index', compact('positions', 'employees'));
    }

    public function store(EmployeeAssigmentRequest $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $data = $request->validated();
            $result =  $this->appRepository->updateOrCreateOneModelWithFile(new EmployeeAssigment(), ['id' => $data['id']], $data, 'letter_document', 'Letters/Employee-Assigment');
            $message = $result->wasRecentlyCreated
                ? __('Employee Assigned successfully')
                : __('Data updated successfully');
            return redirect()->back()->with('success', $message);
        });
    }

    public function destroy(EmployeeAssigment $employeeAssigment)
    {
        return $this->safeInertiaExecute(function () use ($employeeAssigment) {
            $this->appRepository->deleteOneModelWithFile($employeeAssigment, $employeeAssigment->document_letter);
            return back()->with('success', __('Data deleted successfully'));
        });
    }
}
