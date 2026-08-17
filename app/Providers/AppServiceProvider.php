<?php

namespace App\Providers;

use App\Models\Passport\Client;
use Illuminate\Support\ServiceProvider;
use Laravel\Passport\Passport;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Passport::useClientModel(Client::class);

        // Passport resolves this contract before deciding whether consent can
        // be skipped. WBS auto-approves, so this fallback is never displayed.
        Passport::authorizationView(fn (array $parameters) => response()->noContent());
    }
}
