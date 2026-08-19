<?php

namespace App\Services\ApplicationSync;

use App\Models\Application;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use LaravelEasyRepository\ServiceApi;
use RuntimeException;


class ApplicationSyncServiceImplement extends ServiceApi implements ApplicationSyncService
{


  public function sync(User $user, Application $application, bool $hasAccess, bool $isAdmin)
  {
    $url = rtrim($application->base_url, '/')
      . '/api/application-access/sync';

    $response = Http::acceptJson()
      ->timeout(15)
      ->post($url, [
        'simpeg_user_id' => $user->id,
        'application_code' => $application->code,
        'has_access' => $hasAccess,
        'is_admin' => $isAdmin,
      ]);

    if ($response->failed()) {
      throw new RuntimeException(__('Failed to sync application :name.', ['name' => $application->name]));
    
    }
  }
}
