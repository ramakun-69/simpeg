<?php

namespace App\Repositories\Application;

use LaravelEasyRepository\Repository;

interface ApplicationRepository extends Repository{

    public function getApplicationByIds(array $ids);
    public function getApplicationByCodes(array $codes);
}
