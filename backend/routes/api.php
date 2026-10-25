<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\MemberController;
use App\Http\Controllers\Api\V1\TaskController;
use Illuminate\Support\Facades\Route;

// Laravel adds "/api" automatically, so these URLs start with /api/v1
Route::prefix('v1')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register'])->middleware('throttle:10,1');
        Route::post('login', [AuthController::class, 'login'])->middleware('throttle:login');
    });

    // auth:sanctum = the request must have a valid token, or the answer is 401.
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('auth/me', [AuthController::class, 'me']);

        // Admin AND member. The scope and the policy limit what each one sees.
        Route::get('tasks', [TaskController::class, 'index']);
        Route::get('tasks/{id}', [TaskController::class, 'show'])->whereNumber('id');
        Route::patch('tasks/{id}/status', [TaskController::class, 'updateStatus'])->whereNumber('id');

        // role:admin = only admins. A member gets 403.
        Route::middleware('role:admin')->group(function () {
            Route::get('dashboard', DashboardController::class);

            Route::get('members', [MemberController::class, 'index']);
            Route::post('members', [MemberController::class, 'store']);
            Route::get('members/{id}', [MemberController::class, 'show'])->whereNumber('id');
            Route::put('members/{id}', [MemberController::class, 'update'])->whereNumber('id');
            Route::delete('members/{id}', [MemberController::class, 'destroy'])->whereNumber('id');

            Route::post('tasks', [TaskController::class, 'store']);
            Route::put('tasks/{id}', [TaskController::class, 'update'])->whereNumber('id');
            Route::delete('tasks/{id}', [TaskController::class, 'destroy'])->whereNumber('id');
        });
    });
});
