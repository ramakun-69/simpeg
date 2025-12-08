<?php

use App\Http\Controllers\CTrash;
use App\Http\Controllers\Master\CEmployee;
use App\Http\Controllers\Master\CPosition;
use Illuminate\Support\Facades\Route;

Route::prefix('datatable/trash')->name('datatable.trash.')->middleware(['auth'])
    ->controller(CTrash::class)->group(fn() => [
        Route::get('/employees', 'employees')->name('employees'),
        Route::get('/positions', 'positions')->name('positions'),
    ]);

Route::prefix('trash')->name('trash.')->middleware(['auth'])
    ->group(fn() => [
        Route::get('/employess', [CEmployee::class, 'trash'])->name('employees'),
        Route::get('/positions', [CPosition::class, 'trash'])->name('positions'),
    ]);
