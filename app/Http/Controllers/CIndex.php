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
        // Ambil semua employee sekali saja
        $employees = Employee::with(['grade', 'position'])->get();

        // === Rekap Berdasarkan Division ===
        $divisionCounts = $employees
            ->groupBy(fn($emp) => $emp->division ?: 'N/A')
            ->map->count();

        // === Rekap Berdasarkan Gender ===
        $genderCounts = $employees
            ->groupBy(fn($emp) => $emp->gender ?: 'N/A')
            ->map->count();

        // === Rekap Berdasarkan Grade / Golongan ===
        $gradeCounts = $employees
            ->groupBy(fn($emp) => $emp->grade?->name ?? 'N/A')
            ->map->count();

        // === Jumlah Auditor ===
        $auditorCount = $employees->filter(
            fn($emp) => str_contains(strtoupper($emp->position?->name), 'AUDITOR')
        )->count();

        // === Jumlah PPUPD ===
        $ppupdCount = $employees->filter(
            fn($emp) => str_contains(strtoupper($emp->position?->name), 'PPUPD')
                || str_contains(strtoupper($emp->position?->name), 'P2UPD')
        )->count();

        return inertia('Index', [
            'divisionCounts' => $divisionCounts,
            'genderCounts'   => $genderCounts,
            'gradeCounts'    => $gradeCounts,
            'employees'          => $employees,
            'auditorCount'   => $auditorCount,
            'ppupdCount'     => $ppupdCount,
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
