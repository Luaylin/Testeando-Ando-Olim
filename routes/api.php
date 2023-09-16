<?php

use App\Http\Controllers\CityController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EnterpriseController;
use App\Http\Controllers\CollegeController;
use App\Http\Controllers\CollegeUserController;
use App\Http\Controllers\EnterpriseUserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::resource('cities', CityController::class)
    ->only(['index', 'show']);

Route::resource('enterprise', EnterpriseController::class)
    ->only(['index', 'show']);

Route::resource('colleges', CollegeController::class)
    ->only(['index', 'show']);

Route::resource('users', UserController::class)
    ->only(['store']);

Route::resource('enterprise-user', EnterpriseUserController::class)
    ->only(['store', 'show', 'destroy']);

Route::resource('college-user', CollegeUserController::class)
    ->only(['store', 'show', 'destroy']);

Route::resource('post', PostController::class)
    ->only(['index', 'show']);
