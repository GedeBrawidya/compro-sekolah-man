<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BookCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookCategoryController extends Controller
{
    public function index()
    {
        $categories = BookCategory::orderBy('name')->get();

        return Inertia::render('admin/books/categories', [
            'categories' => $categories,
            'flash'      => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100|unique:book_categories,name',
        ], [
            'name.unique' => 'Kategori dengan nama tersebut sudah ada.',
        ]);

        BookCategory::create(['name' => trim($request->name)]);

        return back()->with('success', 'Kategori "' . $request->name . '" berhasil ditambahkan!');
    }

    public function destroy(BookCategory $bookCategory)
    {
        $bookCategory->delete();

        return back()->with('success', 'Kategori berhasil dihapus.');
    }
}
