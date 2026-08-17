<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EmployeeListResource;
use App\Repositories\Employee\EmployeeRepository;
use App\Traits\ResponseOutput;
use Illuminate\Http\Request;

class CEmployee extends Controller
{
    use ResponseOutput;
    public function __construct(
        protected EmployeeRepository $employeeRepository
    ) {}
    public function list()
    {
        return $this->safeExecute(function () {
            return EmployeeListResource::collection(
                $this->employeeRepository->getEmployeeList()
            );
        });
    }
}
