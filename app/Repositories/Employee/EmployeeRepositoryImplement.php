<?php

namespace App\Repositories\Employee;

use App\Models\User;
use App\Models\Employee;
use App\Models\RankHistory;
use App\Models\PositionHistory;
use App\Models\TrainingHistory;
use App\Models\EducationHistory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Repositories\App\AppRepository;
use LaravelEasyRepository\Implementations\Eloquent;

class EmployeeRepositoryImplement extends Eloquent implements EmployeeRepository
{

    /**
     * Model class to be used in this repository for the common methods inside Eloquent
     * Don't remove or change $this->model variable name
     * @property Model|mixed $model;
     */
    protected $appRepository;

    public function __construct(AppRepository $appRepository)
    {
        $this->appRepository = $appRepository;
    }

    public function employeeStore($request)
    {
        DB::transaction(function () use ($request) {
            // 1. Save Employee
            $employee =  $this->saveEmployee($request);
            // 2. Save Position History
            $this->savePositionHistory($request, $employee);
            // 3. Save Rank History
            $this->saveRankHistory($request, $employee);
            // Save Last Education History
            $this->saveLastEducationHistory($request, $employee);
            return true;
        });
    }


    private function saveEmployee($request)
    {
        $userData = [
            'name' => $request->name,
            'email' => $request->email,
            'username' => $request->nip,
            'password' => $request->nip,
        ];
        $user =  $this->appRepository->updateOrCreateOneModel(new User, ['id' => $request->user_id], $userData);
        $employeeData = [
            'nip' => $request->nip,
            'name' => $request->name,
            'user_id' => $user->id,
            'position_id' => $request->position_id,
            'rank_id' => $request->rank_id,
            'grade_id' => $request->grade_id,
            'gender' => $request->gender,
            'born_place' => $request->born_place,
            'born_date' => $request->born_date,
            'phone' => $request->phone,
            'address' => $request->address,
            'employee_type' => $request->employee_type,
            'division' => $request->division
        ];
        $employee =  $this->appRepository->updateOrCreateOneModel(new Employee, ['id' => $request->id], $employeeData);
        return $employee;
    }
    public function savePositionHistory($request, $employee)
    {
        $model = new PositionHistory;
        return $this->appRepository->updateOrCreateOneModelWithFile(
            $model,
            ['id' => $request->position_history_id],
            [
                'employee_id' => $employee->id,
                'position_id' => $request->position_id,
                'appointment_date' => $request->position_appointment_date,
                'position_sk_number' => $request->position_sk_number,
                'position_sk_date' => $request->position_sk_date,
                'is_last' => $request->is_last ? $request->is_last : "Yes",
            ],
            'position_sk_file',
            'SK/Position'
        );
    }
    public function saveRankHistory($request, $employee)
    {
        $model = new RankHistory;
        return $this->appRepository->updateOrCreateOneModelWithFile(
            $model,
            ['id' => $request->rank_history_id],
            [
                'employee_id' => $employee->id,
                'rank_id' => $request->rank_id,
                'grade_id' => $request->grade_id,
                'appointment_date' => $request->rank_appointment_date,
                'rank_sk_number' => $request->rank_sk_number,
                'rank_sk_date' => $request->rank_sk_date,
                'is_last' => $request->is_last ? $request->is_last : "Yes",
            ],
            'rank_sk_file',
            'SK/Rank'
        );
    }
    public function saveLastEducationHistory($request, $employee)
    {
        $model = new EducationHistory;
        return $this->appRepository->updateOrCreateOneModelWithFile(
            $model,
            ['id' => $request->education_history_id],
            [
                'employee_id' => $employee->id,
                'university_name' => $request->university_name,
                'study_program' => $request->study_program,
                'education_program' => $request->education_program,
                'honorific_title' => $request->honorific_title,
                'post_nominal_letters' => $request->post_nominal_letters,
                'degree_certificate_date' => $request->degree_certificate_date,
                'degree_certificate_number' => $request->degree_certificate_number,
                'degree_certificate_number' => $request->degree_certificate_number,
            ],
            'degree_certificate_file',
            'SK/Degree-Certificate'
        );
    }
    public function saveTrainingHistory($request, $employee)
    {
        $model = new TrainingHistory;
        return $this->appRepository->updateOrCreateOneModelWithFile(
            $model,
            ['id' => $request->training_history_id],
            [
                'employee_id' => $employee->id,
                'training_name' => $request->training_name,
                'issuing_institution' => $request->issuing_institution,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'training_hours' => $request->training_hours,
                'certificate_date' => $request->certificate_date,
                'certificate_number' => $request->certificate_number,
            ],
            'training_certificate_file',
            'SK/Training-Certificate'
        );
    }
}
