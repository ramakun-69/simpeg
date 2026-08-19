<?php

namespace App\Repositories\Application;

use LaravelEasyRepository\Implementations\Eloquent;
use App\Models\Application;
use Override;

class ApplicationRepositoryImplement extends Eloquent implements ApplicationRepository
{


    public function getApplicationByIds(array $ids)
    {
        $applications = Application::query()
            ->where('is_active', true)
            ->whereIn('id', $ids)
            ->get();
        return $applications;
    }
    
    public function getApplicationByCodes(array $codes)
    {
        return Application::query()
            ->where('is_active', true)
            ->whereIn('code', $codes)
            ->get(['id', 'code']);
    }
}
