<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $status = $request->query('status');

        $books = Book::when($search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('author', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%")
                    ->orWhere('isbn', 'like', "%{$search}%");
            })
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/books/index', [
            'books' => $books,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'isbn' => 'nullable|string|max:50',
            'status' => 'required|in:available,borrowed',
            'cover_image' => 'nullable|file|max:2048|mimes:jpg,jpeg,png,webp',
            'description' => 'nullable|string',
        ], [
            'cover_image.max' => 'Ukuran file maksimal adalah 2MB.',
        ]);

        $coverPath = null;
        if ($request->hasFile('cover_image')) {
            $coverPath = $request->file('cover_image')->store('book-covers', 'public');
        }

        Book::create([
            'title' => $request->title,
            'author' => $request->author,
            'category' => $request->category,
            'isbn' => $request->isbn,
            'status' => $request->status,
            'cover_image' => $coverPath ? Storage::url($coverPath) : null,
            'description' => $request->description,
        ]);

        return redirect()->back()->with('success', 'Buku berhasil ditambahkan!');
    }

    public function update(Request $request, Book $book)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'isbn' => 'nullable|string|max:50',
            'status' => 'required|in:available,borrowed',
            'cover_image' => 'nullable|file|max:2048|mimes:jpg,jpeg,png,webp',
            'description' => 'nullable|string',
        ], [
            'cover_image.max' => 'Ukuran file maksimal adalah 2MB.',
        ]);

        if ($request->hasFile('cover_image')) {
            if ($book->cover_image && !str_starts_with($book->cover_image, 'http')) {
                $oldPath = str_replace('/storage/', '', $book->cover_image);
                Storage::disk('public')->delete($oldPath);
            }
            $coverPath = $request->file('cover_image')->store('book-covers', 'public');
            $book->cover_image = Storage::url($coverPath);
        }

        $book->update([
            'title' => $request->title,
            'author' => $request->author,
            'category' => $request->category,
            'isbn' => $request->isbn,
            'status' => $request->status,
            'description' => $request->description,
        ]);

        return redirect()->back()->with('success', 'Data buku berhasil diperbarui!');
    }

    public function toggleStatus(Book $book)
    {
        $newStatus = $book->status === 'available' ? 'borrowed' : 'available';
        $book->update(['status' => $newStatus]);

        $statusText = $newStatus === 'available' ? 'Tersedia' : 'Dipinjam';
        return redirect()->back()->with('success', "Status buku diubah menjadi {$statusText}!");
    }

    public function destroy(Book $book)
    {
        if ($book->cover_image && !str_starts_with($book->cover_image, 'http')) {
            $oldPath = str_replace('/storage/', '', $book->cover_image);
            Storage::disk('public')->delete($oldPath);
        }

        $book->delete();

        return redirect()->back()->with('success', 'Buku berhasil dihapus!');
    }
}
