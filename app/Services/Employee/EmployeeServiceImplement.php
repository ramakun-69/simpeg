<?php

namespace App\Services\Employee;

use App\Models\User;
use App\Repositories\Application\ApplicationRepository;
use Illuminate\Support\Facades\DB;
use LaravelEasyRepository\ServiceApi;
class EmployeeServiceImplement extends ServiceApi implements EmployeeService
{

  public function __construct(
    protected ApplicationRepository $applicationRepository
  ) {}

  public function assignApplication(array $data, User $user): void
  {
    $accesses = $data['accesses'] ?? [];
    $applicationIds = array_unique(array_column($accesses, 'application_id'));

    DB::transaction(function () use ($user, $applicationIds, $accesses) {
      if (empty($applicationIds)) {
        $user->applicationAccesses()->delete();
        return;
      }
      $user->applicationAccesses()
        ->whereNotIn('application_id', $applicationIds)
        ->delete();

      foreach ($accesses as $access) {
        $user->applicationAccesses()->updateOrCreate(
          [
            'application_id' => $access['application_id'],
          ],
          [
            'is_admin' => (bool) ($access['is_admin'] ?? false),
          ],
        );
      }
    });
  }
}
