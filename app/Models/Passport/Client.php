<?php

namespace App\Models\Passport;

use App\Models\Application;
use App\Models\User;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Str;
use Laravel\Passport\Client as PassportClient;

class Client extends PassportClient
{
    public function skipsAuthorization(Authenticatable $user, array $scopes): bool
    {
        $applicationCode = Str::upper(trim($this->name));
        $application = Application::query()
            ->where('code', $applicationCode)
            ->where('is_active', true)
            ->first();

        abort_unless($application, 403, __('OAuth client is not linked to an active application.'));
        abort_unless(
            $user instanceof User && $user->hasApplicationAccess($application->code),
            403,
            __('User has no access to this application.'),
        );
        return true;
    }
}
