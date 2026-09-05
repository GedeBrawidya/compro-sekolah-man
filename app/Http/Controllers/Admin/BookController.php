<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\BookCategory;
use App\Models\BookCopy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $status = $request->query('status');

        $books = Book::withCount(['copies', 'copies as borrowed_copies_count' => function ($q) {
                $q->where('status', 'borrowed');
            }])
            ->when($search, function ($query, $search) {
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

        $stats = [
            'total_copies'     => BookCopy::count(),
            'available_copies' => BookCopy::where('status', 'available')->count(),
            'borrowed_copies'  => BookCopy::where('status', 'borrowed')->count(),
        ];

        $bookCategories = BookCategory::orderBy('name')->pluck('name');

        return Inertia::render('admin/books/index', [
            'books'          => $books,
            'stats'          => $stats,
            'filters'        => [
                'search' => $search,
                'status' => $status,
            ],
            'bookCategories' => $bookCategories,
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function show(Request $request, Book $book)
    {
        // Ensure physical copies exist if total_stock > 0 but copies table is missing records
        $currentCopiesCount = $book->copies()->count();
        if ($currentCopiesCount < $book->total_stock) {
            $needed = $book->total_stock - $currentCopiesCount;
            for ($i = 1; $i <= $needed; $i++) {
                $copyNum = str_pad($currentCopiesCount + $i, 3, '0', STR_PAD_LEFT);
                BookCopy::create([
                    'book_id'   => $book->id,
                    'copy_code' => "BK-{$book->id}-{$copyNum}",
                    'status'    => 'available',
                ]);
            }
            $book->refresh();
        }

        $search = $request->query('search');
        $status = $request->query('status');

        $copies = $book->copies()
            ->when($search, function ($q, $search) {
                $q->where('copy_code', 'like', "%{$search}%")
                  ->orWhere('borrower_name', 'like', "%{$search}%");
            })
            ->when($status, function ($q, $status) {
                $q->where('status', $status);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('admin/books/show', [
            'book' => [
                'id'              => $book->id,
                'title'           => $book->title,
                'author'          => $book->author,
                'category'        => $book->category,
                'isbn'            => $book->isbn,
                'total_stock'     => $book->total_stock,
                'available_stock' => $book->available_stock,
                'borrowed_count'  => $book->copies()->where('status', 'borrowed')->count(),
                'status'          => $book->status,
                'cover_image'     => $book->cover_image,
                'description'     => $book->description,
                'created_at'      => $book->created_at->format('d M Y'),
                'copies'          => $copies->map(function ($copy) {
                    return [
                        'id'            => $copy->id,
                        'copy_code'     => $copy->copy_code,
                        'borrower_name' => $copy->borrower_name,
                        'borrowed_at'   => $copy->borrowed_at ? $copy->borrowed_at->format('Y-m-d') : null,
                        'due_date'      => $copy->due_date ? $copy->due_date->format('Y-m-d') : null,
                        'status'        => $copy->status,
                        'notes'         => $copy->notes,
                    ];
                }),
            ],
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'author'      => 'required|string|max:255',
            'category'    => 'required|string|max:100',
            'isbn'        => 'nullable|string|max:50',
            'total_stock' => 'required|integer|min:1|max:100',
            'cover_image' => 'nullable|file|max:2048|mimes:jpg,jpeg,png,webp',
            'description' => 'nullable|string',
        ], [
            'cover_image.max' => 'Ukuran file maksimal adalah 2MB.',
        ]);

        $coverPath = null;
        if ($request->hasFile('cover_image')) {
            $coverPath = $request->file('cover_image')->store('book-covers', 'public');
        }

        $totalStock = (int) $request->total_stock;

        $book = Book::create([
            'title'           => $request->title,
            'author'          => $request->author,
            'category'        => $request->category,
            'isbn'            => $request->isbn,
            'total_stock'     => $totalStock,
            'available_stock' => $totalStock,
            'status'          => 'available',
            'cover_image'     => $coverPath ? Storage::url($coverPath) : null,
            'description'     => $request->description,
        ]);

        // Auto-generate physical copy records based on total_stock
        for ($i = 1; $i <= $totalStock; $i++) {
            $copyNum = str_pad($i, 3, '0', STR_PAD_LEFT);
            BookCopy::create([
                'book_id'   => $book->id,
                'copy_code' => "BK-{$book->id}-{$copyNum}",
                'status'    => 'available',
            ]);
        }

        return redirect()->back()->with('success', 'Buku dan eksemplar stok berhasil ditambahkan!');
    }

    public function update(Request $request, Book $book)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'author'      => 'required|string|max:255',
            'category'    => 'required|string|max:100',
            'isbn'        => 'nullable|string|max:50',
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
            'title'       => $request->title,
            'author'      => $request->author,
            'category'    => $request->category,
            'isbn'        => $request->isbn,
            'description' => $request->description,
        ]);

        return redirect()->back()->with('success', 'Data buku berhasil diperbarui!');
    }

    public function destroy(Book $book)
    {
        if ($book->cover_image && !str_starts_with($book->cover_image, 'http')) {
            $oldPath = str_replace('/storage/', '', $book->cover_image);
            Storage::disk('public')->delete($oldPath);
        }

        $book->delete();

        return redirect()->route('admin.books.index')->with('success', 'Buku berhasil dihapus!');
    }

    /* ─── Book Copies / Loan Management ───────────────────────── */

    public function storeCopy(Request $request, Book $book)
    {
        $request->validate([
            'copy_code' => 'required|string|max:50',
            'notes'     => 'nullable|string|max:255',
        ]);

        BookCopy::create([
            'book_id'   => $book->id,
            'copy_code' => $request->copy_code,
            'notes'     => $request->notes,
            'status'    => 'available',
        ]);

        return back()->with('success', 'Eksemplar stok buku berhasil ditambahkan!');
    }

    public function updateCopy(Request $request, Book $book, BookCopy $copy)
    {
        $request->validate([
            'copy_code'     => 'required|string|max:50',
            'status'        => 'required|in:available,borrowed',
            'borrower_name' => 'nullable|required_if:status,borrowed|string|max:255',
            'borrowed_at'   => 'nullable|date',
            'due_date'      => 'nullable|date',
            'notes'         => 'nullable|string|max:255',
        ], [
            'borrower_name.required_if' => 'Nama peminjam wajib diisi jika status buku Dipinjam.',
        ]);

        $copy->update([
            'copy_code'     => $request->copy_code,
            'status'        => $request->status,
            'borrower_name' => $request->status === 'borrowed' ? $request->borrower_name : null,
            'borrowed_at'   => $request->status === 'borrowed' ? ($request->borrowed_at ?: now()) : null,
            'due_date'      => $request->status === 'borrowed' ? $request->due_date : null,
            'notes'         => $request->notes,
        ]);

        return back()->with('success', 'Status eksemplar & peminjaman berhasil diperbarui!');
    }

    public function toggleCopyStatus(Request $request, Book $book, BookCopy $copy)
    {
        $newStatus = $copy->status === 'available' ? 'borrowed' : 'available';

        if ($newStatus === 'borrowed') {
            $request->validate([
                'borrower_name' => 'required|string|max:255',
            ], [
                'borrower_name.required' => 'Masukkan nama peminjam terlebih dahulu.',
            ]);
        }

        $copy->update([
            'status'        => $newStatus,
            'borrower_name' => $newStatus === 'borrowed' ? $request->borrower_name : null,
            'borrowed_at'   => $newStatus === 'borrowed' ? now() : null,
            'due_date'      => $newStatus === 'borrowed' ? ($request->due_date ?: null) : null,
        ]);

        $msg = $newStatus === 'borrowed' ? 'Buku dicatat DIPINJAM. Stok tersedia berkurang!' : 'Buku DIKEMBALIKAN. Stok tersedia bertambah!';
        return back()->with('success', $msg);
    }

    public function destroyCopy(Book $book, BookCopy $copy)
    {
        $copy->delete();

        return back()->with('success', 'Eksemplar buku dihapus.');
    }
}
