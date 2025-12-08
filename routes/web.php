<?php

use App\Http\Controllers\CIndex;
use App\Http\Controllers\CProfile;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Master\CEmployee;
use App\Http\Controllers\Master\CPosition;
use App\Http\Controllers\History\CRankHistory;
use App\Http\Controllers\History\CPositionHistory;
use App\Http\Controllers\History\CTrainingHistory;
use App\Http\Controllers\History\CEducationHistory;

Route::middleware(['auth'])->group(function () {
    Route::middleware('role:Superadmin|Administrator')->group(function () {
        Route::get('/dashboard', [CIndex::class, 'index'])->name('dashboard');
        Route::post('/set-language', [CIndex::class, 'setLanguage'])->name('set-language');
    });

    // Master Data
    Route::prefix('master-data')->name('master-data.')->group(function () {
        Route::post('restore/employees', [CEmployee::class, 'restore'])->name('employees.restore');
        Route::delete('delete/employees', [CEmployee::class, 'delete'])->name('employees.delete');
        Route::post('employees/store/employee-data', [CEmployee::class, 'storeEmployeeData'])->name('employees.store.employee-data');
        Route::post('employees/store/position-data', [CEmployee::class, 'storePositionData'])->name('employees.store.position-data');
        Route::post('employees/store/rank-data', [CEmployee::class, 'storeRankData'])->name('employees.store.rank-data');
        Route::post('employees/store/last-education-data', [CEmployee::class, 'storeLastEducationData'])->name('employees.store.last-education-data');
        Route::post('employees/change-photo', [CEmployee::class, 'changePhoto'])
            ->name('employees.change-photo');

        Route::resource('employees', CEmployee::class)->middleware('role:Superadmin|Administrator');


        // Jabatan
        Route::post('restore/positions', [CPosition::class, 'restore'])->name('positions.restore');
        Route::delete('delete/positions', [CPosition::class, 'delete'])->name('positions.delete');
        Route::resource('positions', CPosition::class);
    });

    Route::resource('position-history', CPositionHistory::class);
    Route::resource('rank-history', CRankHistory::class);
    Route::resource('education-history', CEducationHistory::class);
    Route::resource('training-history', CTrainingHistory::class);
    Route::resource('profile', CProfile::class);
});
