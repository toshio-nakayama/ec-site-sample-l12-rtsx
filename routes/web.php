<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ZipcodeController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    // Route::get('/products', [ProductController::class, 'index'])->name('products.index'); // ADD
});

Route::get('/products', [ProductController::class, 'index'])->name('products.index'); // ADD
Route::post('/products/add/{id}', [ProductController::class, 'addToCart'])->name('products.add'); // ADD
Route::post('/products/plus/{id}', [ProductController::class, 'addCartPlus'])->name('products.plus'); // ADD
Route::post('/products/minus/{id}', [ProductController::class, 'cartMinus'])->name('products.minus'); // ADD
Route::post('/products/removes/{id}', [ProductController::class, 'removeCart'])->name('products.remove'); // ADD

Route::get('/checkout/step1', [ProductController::class, 'step1'])->name('checkout.step1'); // ADD
Route::post('/checkout/confirm', [ProductController::class, 'confirm']); // ADD
Route::get('/checkout/cash-on-delivery', [ProductController::class, 'cashOnDelivery']); // ADD
Route::post('/checkout/order-done', [ProductController::class, 'orderDone'])->name('checkout.order_done'); // ADD

Route::get('/api/zipcode/search', [ZipcodeController::class, 'search']); // ADD

require __DIR__ . '/auth.php';
