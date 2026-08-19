<?php

namespace App\Jobs;

use App\Models\Application;
use App\Models\User;
use App\Services\ApplicationSync\ApplicationSyncService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SyncApplicationAccess implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;


    public int $tries = 5;

    public function __construct(
        public string $userId
    ) {}

    /**
     * Create a new job instance.
     */
    

    /**
     * Execute the job.
     */
    public function handle(ApplicationSyncService $syncService): void {
        $user = User::with('applicationAccesses')
            ->findOrFail($this->userId);

        $applications = Application::query()
            ->where('is_active', true)
            ->get();

        foreach ($applications as $application) {
            $access = $user->applicationAccesses
                ->firstWhere('application_id', $application->id);

            $syncService->sync(
                user: $user,
                application: $application,
                hasAccess: $access !== null,
                isAdmin: (bool) ($access?->is_admin ?? false),
            );
        }
    }
}
