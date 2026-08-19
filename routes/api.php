<?php

use App\Http\Controllers\Api\CEmployee;
use App\Http\Controllers\Api\CUser;
use Illuminate\Support\Facades\Route;


Route::middleware(['auth:api'])->group(function () {
    Route::get('/user', [CUser::class,'me']);
});
Route::middleware(['client'])->group(function () {
    Route::get('/employee-list', [CEmployee::class, 'list']);
    Route::post('employee/{user}/assign-application-access',[CEmployee::class,'assignApplication']);
});