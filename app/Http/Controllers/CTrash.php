<?php

namespace App\Http\Controllers;

use App\Models\Position;
use Illuminate\Http\Request;

class CTrash extends Controller
{
    public function positions(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $data = Position::query()
            ->onlyTrashed()
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
}
