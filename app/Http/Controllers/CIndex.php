<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Employee;
use Illuminate\Http\Request;
use App\Traits\ResponseOutput;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class CIndex extends Controller
{
    use ResponseOutput;
    public function index()
    {
        $employees = Employee::with('grade')->get();

        // Rekap per divisi
        $divisionCounts = $employees->groupBy('division')->map(fn($group) => $group->count());

        // Rekap per gender
        $genderCounts = $employees->groupBy('gender')->map(fn($group) => $group->count());

        // Rekap per grade / golongan
        $gradeCounts = $employees->groupBy(fn($emp) => $emp->grade?->name ?? 'N/A')
            ->map(fn($group) => $group->count());

        return inertia('Index', [
            'divisionCounts' => $divisionCounts,
            'genderCounts' => $genderCounts,
            'gradeCounts' => $gradeCounts,
            'users' => User::get(),
        ]);
    }

    public function setLanguage(Request $request)
    {
        return $this->safeExecute(function () use ($request) {
            $lang = $request->input('locale');
            $lang = strtolower(substr($lang, 0, 2));
            Session::put('locale', $lang);
            return $this->responseSuccess([
                'message' => __('Language changed successfully')
            ]);
        });
    }
}
