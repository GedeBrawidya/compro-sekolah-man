<?php

use App\Http\Controllers\Admin\BookController;
use App\Http\Controllers\Admin\ComplaintController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DormitoryController;
use App\Http\Controllers\Admin\LegalizationController;
use App\Http\Controllers\Admin\NewsController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Redirect /dashboard to /admin/dashboard
    Route::get('/dashboard', fn () => redirect()->route('admin.dashboard'))->name('dashboard');

    // Admin Group
    Route::prefix('admin')->name('admin.')->group(function () {
        // Main Dashboard Overview (accessible by all roles)
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Modul Berita & Galeri (Humas / Admin)
        Route::middleware(['role:admin'])->group(function () {
            Route::resource('news', NewsController::class)->except(['create', 'edit', 'show']);
            Route::resource('complaints', ComplaintController::class)->only(['index', 'destroy']);
            Route::put('complaints/{complaint}/status', [ComplaintController::class, 'updateStatus'])->name('complaints.update-status');
            
            Route::resource('legalization', LegalizationController::class)->only(['index', 'destroy']);
            Route::put('legalization/{legalization}/status', [LegalizationController::class, 'updateStatus'])->name('legalization.update-status');
        });

        // Modul Profil Asrama (Pengurus Asrama)
        Route::middleware(['role:pengurus_asrama'])->group(function () {
            Route::resource('dormitory', DormitoryController::class)->except(['create', 'edit', 'show']);
        });

        // Modul Perpustakaan Digital (Pustakawan)
        Route::middleware(['role:pustakawan'])->group(function () {
            Route::resource('books', BookController::class)->except(['create', 'edit', 'show']);
            Route::patch('books/{book}/toggle-status', [BookController::class, 'toggleStatus'])->name('books.toggle-status');
        });

        // Modul User Management (Super Admin)
        Route::middleware(['role:super_admin'])->group(function () {
            Route::resource('users', UserController::class)->except(['create', 'edit', 'show']);
        });
    });
});

require __DIR__.'/settings.php';
