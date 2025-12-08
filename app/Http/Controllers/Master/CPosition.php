<?php

namespace App\Http\Controllers\Master;

use Illuminate\Http\Request;
use App\Traits\ResponseOutput;
use App\Http\Controllers\Controller;
use App\Http\Requests\Master\PositionRequest;
use App\Models\Position;
use App\Repositories\App\AppRepository;

class CPosition extends Controller
{
    use ResponseOutput;
    protected $appRepository;
    public function __construct(AppRepository $appRepository)
    {
        $this->appRepository = $appRepository;
    }
    public function index()
    {

        return inertia('Master/Position');
    }


    public function store(PositionRequest $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $data = $request->validated();
            $position =  $this->appRepository->updateOrCreateOneModel(new Position(), ['id' => $data['id']], [
                'name' => $data['position_name'],
            ]);
            $message = $position->wasRecentlyCreated
                ? __('Position created successfully')
                : __('Position updated successfully');
            return redirect()->back()->with('success', $message);
        });
    }

    public function destroy(Position $position)
    {
        return $this->safeInertiaExecute(function () use ($position) {
            $this->appRepository->deleteOneModel($position);
            return redirect()->back()->with('success', __('Position deleted successfully'));
        });
    }

    public function trash()
    {
        return inertia('Trash/Position');
    }

    public function restore(Request $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $ids = $request->input('ids', []);
            $model = Position::onlyTrashed()->whereIn('id', $ids);
            $this->appRepository->restore($model);
            return redirect()->back()->with('success', __('Data restored successfully'));
        });
    }

    public function delete(Request $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $ids = $request->input('ids', []);
            $model = Position::onlyTrashed()->whereIn('id', $ids);
            $this->appRepository->forceDeleteOneModel($model);
            return redirect()->back()->with('success', __('Data deleted successfully'));
        });
    }
}
