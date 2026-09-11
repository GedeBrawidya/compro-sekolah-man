<?php

use App\Http\Controllers\Admin\BookCategoryController;
use App\Http\Controllers\Admin\BookController;
use App\Http\Controllers\Admin\ComplaintController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DormitoryController;
use App\Http\Controllers\Admin\FacilityController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\Admin\LandingPageController;
use App\Http\Controllers\Admin\LegalizationController;
use App\Http\Controllers\Admin\MilestoneController;
use App\Http\Controllers\Admin\NewsController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\PublicController;

Route::get('/', [PublicController::class, 'index'])->name('home');
Route::get('/news/{slug}', [PublicController::class, 'showNews'])->name('public.news.show');
Route::get('/berita/{slug}', [PublicController::class, 'showNews']);
Route::post('/legalization', [PublicController::class, 'storeLegalization'])->name('public.legalization.store');
Route::post('/complaints', [PublicController::class, 'storeComplaint'])->name('public.complaints.store');

Route::middleware(['auth', 'verified'])->group(function () {
    // Redirect /dashboard to /admin/dashboard
    Route::get('/dashboard', fn () => redirect()->route('admin.dashboard'))->name('dashboard');

    // Admin Group
    Route::prefix('admin')->name('admin.')->group(function () {
        // Main Dashboard Overview (accessible by all roles)
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Modul Berita & Galeri (Humas / Admin)
        Route::middleware(['role:admin'])->group(function () {
            Route::resource('news', NewsController::class)->except(['show']);
            Route::resource('gallery', GalleryController::class)->except(['create', 'edit', 'show']);
            Route::patch('gallery/{gallery}/toggle-status', [GalleryController::class, 'toggleStatus'])->name('gallery.toggle-status');

            Route::resource('complaints', ComplaintController::class)->only(['index', 'destroy']);
            Route::put('complaints/{complaint}/status', [ComplaintController::class, 'updateStatus'])->name('complaints.update-status');

            Route::resource('legalization', LegalizationController::class)->only(['index', 'destroy']);
            Route::put('legalization/{legalization}/status', [LegalizationController::class, 'updateStatus'])->name('legalization.update-status');

            // Landing Page CMS
            Route::get('landing-page', [LandingPageController::class, 'index'])->name('landing-page.index');
            Route::post('landing-page/settings', [LandingPageController::class, 'updateSettings'])->name('landing-page.settings');
            Route::post('landing-page/banners', [LandingPageController::class, 'storeBanner'])->name('landing-page.banners.store');
            Route::match(['post', 'put'], 'landing-page/banners/{banner}', [LandingPageController::class, 'updateBanner'])->name('landing-page.banners.update');
            Route::delete('landing-page/banners/{banner}', [LandingPageController::class, 'destroyBanner'])->name('landing-page.banners.destroy');
            Route::post('landing-page/banners/reorder', [LandingPageController::class, 'reorderBanners'])->name('landing-page.banners.reorder');
            // Milestones (Sejarah Singkat)
            Route::post('landing-page/milestones', [MilestoneController::class, 'store'])->name('landing-page.milestones.store');
            Route::match(['post', 'put'], 'landing-page/milestones/{milestone}', [MilestoneController::class, 'update'])->name('landing-page.milestones.update');
            Route::delete('landing-page/milestones/{milestone}', [MilestoneController::class, 'destroy'])->name('landing-page.milestones.destroy');
            Route::post('landing-page/milestones/reorder', [MilestoneController::class, 'reorder'])->name('landing-page.milestones.reorder');
            // Facilities (Sarana & Prasarana)
            Route::post('landing-page/facilities', [FacilityController::class, 'store'])->name('landing-page.facilities.store');
            Route::match(['post', 'put'], 'landing-page/facilities/{facility}', [FacilityController::class, 'update'])->name('landing-page.facilities.update');
            Route::delete('landing-page/facilities/{facility}', [FacilityController::class, 'destroy'])->name('landing-page.facilities.destroy');
            Route::post('landing-page/facilities/reorder', [FacilityController::class, 'reorder'])->name('landing-page.facilities.reorder');
        });

        // Modul Profil Asrama (Pengurus Asrama / Admin)
        Route::middleware(['role:pengurus_asrama,admin'])->group(function () {
            Route::post('dormitory/settings', [DormitoryController::class, 'updateSettings'])->name('dormitory.settings.update');
            Route::resource('dormitory', DormitoryController::class)->except(['create', 'edit', 'show']);
        });

        // Modul Perpustakaan Digital (Pustakawan / Admin)
        Route::middleware(['role:pustakawan,admin'])->group(function () {
            Route::get('books/categories', fn () => redirect()->route('book-categories.index'));
            Route::resource('books', BookController::class)->except(['create', 'edit']);
            Route::post('books/{book}/copies', [BookController::class, 'storeCopy'])->name('books.copies.store');
            Route::put('books/{book}/copies/{copy}', [BookController::class, 'updateCopy'])->name('books.copies.update');
            Route::post('books/{book}/copies/{copy}/toggle', [BookController::class, 'toggleCopyStatus'])->name('books.copies.toggle');
            Route::delete('books/{book}/copies/{copy}', [BookController::class, 'destroyCopy'])->name('books.copies.destroy');
            // Book Category Management
            Route::get('book-categories', [BookCategoryController::class, 'index'])->name('book-categories.index');
            Route::post('book-categories', [BookCategoryController::class, 'store'])->name('book-categories.store');
            Route::delete('book-categories/{bookCategory}', [BookCategoryController::class, 'destroy'])->name('book-categories.destroy');
        });

        // Modul User Management (Super Admin & Admin)
        Route::middleware(['role:super_admin,admin'])->group(function () {
            Route::resource('users', UserController::class)->except(['create', 'edit', 'show']);
        });
    });
});

require __DIR__.'/settings.php';
