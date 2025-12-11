<?php

namespace App\Http\Controllers\Auth;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Traits\ResponseOutput;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Auth\LoginRequest;

class CLogin extends Controller
{
    use ResponseOutput;
    public function index()
    {

        return Inertia::render('Auth/Login');
    }

    public function authenticate(LoginRequest $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $credentials = [
                filter_var($request->username, FILTER_VALIDATE_EMAIL) ? 'email' : 'username' => $request->username,
                'password' => $request->password,
            ];

            if (!Auth::attempt($credentials, $request->boolean('remember'))) {
                return back()->withErrors(['username' => __('auth.failed')])->withInput();
            }

            $user = Auth::user();
            $employee = $user->employee;

            if (!$employee || $employee->status !== 'Active') {
                Auth::logout();
                return back()->withErrors(['username' => __('Your account has been disabled. Please contact the admin')]);
            }

            $target = $user->hasAnyRole(['Administrator', 'Superadmin'])
                ? route('dashboard')
                : route('profile.index');

            return redirect()->intended($target)->with('success', __('Login successful'));
        });
    }

    public function logout(Request $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return redirect()->route('login')->with('success', __('Logged out successfully'));
        });
    }
}
