<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Master\Employee\ApplicationAccessRequest;
use App\Http\Resources\EmployeeListResource;
use App\Models\User;
use App\Repositories\Application\ApplicationRepository;
use App\Repositories\Employee\EmployeeRepository;
use App\Services\Employee\EmployeeService;
use App\Traits\ResponseOutput;


class CEmployee extends Controller
{
    use ResponseOutput;
    public function __construct(
        protected EmployeeRepository $employeeRepository,
        protected ApplicationRepository $applicationRepository,
        protected EmployeeService $employeeService
    ) {}
    public function list()
    {
        return $this->safeExecute(function () {
            $employees = $this->employeeRepository->getEmployeeList();
            return EmployeeListResource::collection($employees);
          
        });
    }

    public function assignApplication(ApplicationAccessRequest $request,  User $user)
    {
        return $this->safeExecute(function () use ($request,$user) {
            $data = $request->validated();
            $accesses = collect($data['accesses'] ?? []);
            $codes = $accesses->pluck('application_code')
                ->filter()
                ->map(fn($code) => strtoupper(trim($code)))
                ->unique()
                ->values()
                ->all();

            $applications = $this->applicationRepository
                ->getApplicationByCodes($codes)
                ->keyBy('code');

            $data['accesses'] = $accesses
                ->map(function (array $access) use ($applications) {
                    $code = strtoupper(trim($access['application_code']));
                    $application = $applications->get($code);

                    abort_unless(
                        $application,
                        422,
                        __('Application is not available.')
                    );

                    return [
                        'application_id' => $application->id,
                        'is_admin' => (bool) ($access['is_admin'] ?? false),
                    ];
                })
                ->values()
                ->all();

            $this->employeeService->assignApplication($data, $user);
            return response()->json(['message' => __('Application access updated successfully')]);
        }); 
    }
}
