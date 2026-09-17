<?php

namespace App\Services\Employee;

use App\Models\User;
use LaravelEasyRepository\BaseService;

interface EmployeeService extends BaseService{

    public function assignApplication(array $data,User $user): void;
    public function getDashboard(User $user): array;
}
