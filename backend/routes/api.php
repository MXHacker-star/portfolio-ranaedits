<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\TestimonialController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('portfolio', PortfolioController::class);
Route::apiResource('testimonials', TestimonialController::class);
Route::post('contact', [ContactController::class, 'store']);
