<?php

namespace App\Models\Passport;

use App\Models\Application;
use App\Models\User;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Auth;
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

        if (!$application) {
            $this->logoutAndRedirect(__('You do not have access to this application.'));
        }
      
        return true;
    }
    private function logoutAndRedirect(string $message): never
    {
        Auth::guard('web')->logout();

        request()->session()->invalidate();
        request()->session()->regenerateToken();

        throw new HttpResponseException(redirect()->route('login')->with('error', $message)
        );
    }
}
