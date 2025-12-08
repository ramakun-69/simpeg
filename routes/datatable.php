<?php

use App\Http\Controllers\CDatatable;
use Illuminate\Support\Facades\Route;

Route::prefix('datatable')->name('datatable.')->middleware(['auth'])
    ->controller(CDatatable::class)->group(fn() => [
        Route::get('/employees', 'employees')->name('employees'),
        Route::get('/employee/position-history/{nip}', 'positionHistory')->name('position-history'),
        Route::get('/employee/rank-history/{nip}', 'rankHistory')->name('rank-history'),
        Route::get('/employee/education-history/{nip}', 'educationHistory')->name('education-history'),
        Route::get('/employee/training-history/{nip}', 'trainingHistory')->name('training-history'),
        Route::get('/positions', 'positions')->name('positions'),
    ]);
