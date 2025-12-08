<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Position;
use Illuminate\Http\Request;

class CDatatable extends Controller
{
    public function positions(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $data = Position::query()
            ->when($request->has('search'), function ($query) use ($request) {
                $search = $request->get('search');
                $query->whereLike('name', "%{$search}%");
            })
            ->paginate($perPage);

        return response()->json([
            'data' => $data->items(),
            'total' => $data->total(),
            'current_page' => $data->currentPage(),
            'per_page' => $data->perPage(),
        ]);
    }
    public function employees(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $data = Employee::select('id', 'user_id', 'rank_id', 'position_id', 'nip', 'name', 'gender', 'division')
            ->with([
                'user:id,email,photo',
                'position:id,name',
                'rank:id,name',
            ])
            ->when($request->filled('search'), function ($q) use ($request) {
                $s = "%{$request->search}%";
                $q->where(
                    fn($q) =>
                    $q->where('name', 'like', $s)
                        ->orWhere('nip', 'like', $s)
                        ->orWhere('division', 'like', $s)
                );
            })
            ->paginate($perPage)
            ->through(fn($e) => $e->makeHidden(['last_position', 'last_rank', 'last_education']));
        return response()->json([
            'data' => $data->items(),
            'total' => $data->total(),
            'current_page' => $data->currentPage(),
            'per_page' => $data->perPage(),
        ]);
    }
    public function positionHistory($nip, Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $search  = $request->get('search');

        $employee = Employee::where('nip', $nip)->firstOrFail();

        $data = $employee->positionHistories()
            ->with(['position:id,name'])
            ->when($search, function ($q) use ($search) {
                $s = "%{$search}%";

                $q->whereAny([
                    'position_appointment_date',
                    'position_sk_date',
                ], 'like', $s)
                    ->orWhereHas(
                        'position',
                        fn($p) =>
                        $p->where('name', 'like', $s)
                    );
            })
            ->paginate($perPage);

        return response()->json([
            'data'         => $data->items(),
            'total'        => $data->total(),
            'current_page' => $data->currentPage(),
            'per_page'     => $data->perPage(),
        ]);
    }

    public function rankHistory($nip, Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $search  = $request->get('search');

        $employee = Employee::where('nip', $nip)->firstOrFail();

        $data = $employee->rankHistories()
            ->with(['rank:id,name', 'grade:id,name'])
            ->when($search, function ($q) use ($search) {
                $s = "%{$search}%";

                $q->whereAny([
                    'rank_appointment_date',
                    'rank_sk_date',
                ], 'like', $s)
                    ->orWhereHas(
                        'grade',
                        fn($p) =>
                        $p->where('name', 'like', $s)
                    )
                    ->orWhereHas(
                        'rank',
                        fn($p) =>
                        $p->where('name', 'like', $s)
                    );
            })
            ->paginate($perPage);

        return response()->json([
            'data'         => $data->items(),
            'total'        => $data->total(),
            'current_page' => $data->currentPage(),
            'per_page'     => $data->perPage(),
        ]);
    }
    public function educationHistory($nip, Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $search  = $request->get('search');

        $employee = Employee::where('nip', $nip)->firstOrFail();

        $data = $employee->educationHistories()
            ->when($search, function ($q) use ($search) {
                $s = "%{$search}%";
                $q->whereAny([
                    'university_name',
                    'study_program',
                    'education_program',
                ], 'like', $s);
            })
            ->paginate($perPage);

        return response()->json([
            'data'         => $data->items(),
            'total'        => $data->total(),
            'current_page' => $data->currentPage(),
            'per_page'     => $data->perPage(),
        ]);
    }
    public function trainingHistory($nip, Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $search  = $request->get('search');

        $employee = Employee::where('nip', $nip)->firstOrFail();

        $data = $employee->trainingHistories()
            ->when($search, function ($q) use ($search) {
                $s = "%{$search}%";
                $q->whereAny([
                    'training_name',
                    'issuing_institution',
                ], 'like', $s);
            })
            ->paginate($perPage);

        return response()->json([
            'data'         => $data->items(),
            'total'        => $data->total(),
            'current_page' => $data->currentPage(),
            'per_page'     => $data->perPage(),
        ]);
    }
}
