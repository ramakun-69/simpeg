<?php

namespace App\Repositories\Employee;

use LaravelEasyRepository\Repository;

interface EmployeeRepository extends Repository
{

   public function employeeStore($request);
   public function savePositionHistory($request, $employee);
   public function saveRankHistory($request, $employee);
   public function saveLastEducationHistory($request, $employee);
   public function saveTrainingHistory($request, $employee);
}
