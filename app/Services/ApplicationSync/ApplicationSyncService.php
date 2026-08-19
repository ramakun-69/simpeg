<?php

namespace App\Services\ApplicationSync;

use App\Models\Application;
use App\Models\User;
use LaravelEasyRepository\BaseService;

interface ApplicationSyncService extends BaseService{

    public function sync(User $user,Application $application,bool $hasAccess,bool $isAdmin);
}
