<?php

namespace App\Services\Employee;

use App\Models\User;
use App\Repositories\Application\ApplicationRepository;
use App\Repositories\Employee\EmployeeRepository;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use LaravelEasyRepository\ServiceApi;
class EmployeeServiceImplement extends ServiceApi implements EmployeeService
{

  public function __construct(
    protected ApplicationRepository $applicationRepository,
    protected EmployeeRepository $employeeRepository
  ) {}

  public function getDashboard(User $user): array
  {
    $employee = $this->employeeRepository->getDashboardEmployee($user);
    $assignments = $employee?->assignments ?? collect();
    $today = now()->toDateString();
    $assignments = $assignments->map(function ($assignment) use ($today) {
      $status = !$assignment->start_date ? 'Not Scheduled'
        : ($assignment->start_date > $today ? 'Upcoming'
          : ($assignment->end_date && $assignment->end_date < $today ? 'Completed' : 'Active'));

      return [
        'id' => $assignment->id,
        'name' => $assignment->letter_subject ?: $assignment->position?->name,
        'type' => $assignment->type,
        'letter_number' => $assignment->letter_number,
        'letter_date' => $assignment->letter_date,
        'status' => $status,
      ];
    })->values();

    $documents = collect();
    foreach ([
      ['positionHistories', 'position_sk_file', 'sk_file_url', 'position_sk_date', 'Position Decree'],
      ['rankHistories', 'rank_sk_file', 'sk_file_url', 'rank_sk_date', 'Rank Decree'],
      ['trainingHistories', 'training_certificate_file', 'training_certificate_file_url', 'certificate_date', 'Training Certificate'],
      ['assignments', 'letter_document', 'letter_document_url', 'letter_date', 'Assignment Letter'],
    ] as [$relation, $file, $url, $date, $label]) {
      foreach ($employee?->$relation ?? [] as $history) {
        if ($history->$file && $history->$url) {
          $documents->push([
            'id' => $relation . '-' . $history->id,
            'name' => basename($history->$file),
            'type' => $label,
            'url' => $history->$url,
            'date' => $history->$date,
          ]);
        }
      }
    }

    // Masa kerja perkiraan dari tahun/bulan pengangkatan pada NIP PNS.
    $serviceDate = null;
    if ($employee?->employee_type === 'PNS' && preg_match('/^\d{8}((?:19|20)\d{2})(0[1-9]|1[0-2])\d{4}$/', $employee->nip, $matches)) {
      $date = Carbon::create((int) $matches[1], (int) $matches[2], 1)->startOfDay();
      $serviceDate = $date->lte(now()) ? $date : null;
    }

    return [
      'employee' => $employee,
      'assignments' => $assignments,
      'documents' => $documents->sortByDesc('date')->take(3)->values(),
      'summary' => [
        'service_years' => $serviceDate ? (int) $serviceDate->diffInYears(now()) : null,
        'total_assignments' => $assignments->count(),
        'active_assignments' => $assignments->where('status', 'Active')->count(),
        'total_trainings' => $employee?->trainingHistories->count() ?? 0,
        'certified_trainings' => $employee?->trainingHistories->filter(fn ($training) => filled($training->training_certificate_file))->count() ?? 0,
      ],
    ];
  }

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
