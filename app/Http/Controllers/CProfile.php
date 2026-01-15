<?php

namespace App\Http\Controllers;

use App\Models\Rank;
use App\Models\Grade;
use App\Models\Position;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CProfile extends Controller
{
    public function index()
    {
        $employee = Auth::user()->employee;
        $positions = Position::cursor();
        $ranks = Rank::cursor();
        $employee->load('position', 'rank', 'user');
        return inertia('Profile/Index', compact('employee', 'ranks', 'positions'));
    }
}
