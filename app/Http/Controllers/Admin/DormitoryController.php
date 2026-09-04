<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DormitoryPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DormitoryController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');

        $posts = DormitoryPost::with('author:id,name')
            ->when($search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/dormitory/index', [
            'posts' => $posts,
            'filters' => ['search' => $search],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'media' => 'nullable|file|max:2048|mimes:jpg,jpeg,png,webp,mp4',
        ], [
            'media.max' => 'Ukuran file maksimal adalah 2MB.',
        ]);

        $mediaPath = null;
        if ($request->hasFile('media')) {
            $mediaPath = $request->file('media')->store('dormitory-media', 'public');
        }

        DormitoryPost::create([
            'title' => $request->title,
            'content' => $request->content,
            'media' => $mediaPath ? Storage::url($mediaPath) : null,
            'author_id' => $request->user()->id,
        ]);

        return redirect()->back()->with('success', 'Konten asrama berhasil ditambahkan!');
    }

    public function update(Request $request, DormitoryPost $dormitory)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'media' => 'nullable|file|max:2048|mimes:jpg,jpeg,png,webp,mp4',
        ], [
            'media.max' => 'Ukuran file maksimal adalah 2MB.',
        ]);

        if ($request->hasFile('media')) {
            if ($dormitory->media && !str_starts_with($dormitory->media, 'http')) {
                $oldPath = str_replace('/storage/', '', $dormitory->media);
                Storage::disk('public')->delete($oldPath);
            }
            $mediaPath = $request->file('media')->store('dormitory-media', 'public');
            $dormitory->media = Storage::url($mediaPath);
        }

        $dormitory->update([
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return redirect()->back()->with('success', 'Konten asrama berhasil diperbarui!');
    }

    public function destroy(DormitoryPost $dormitory)
    {
        if ($dormitory->media && !str_starts_with($dormitory->media, 'http')) {
            $oldPath = str_replace('/storage/', '', $dormitory->media);
            Storage::disk('public')->delete($oldPath);
        }

        $dormitory->delete();

        return redirect()->back()->with('success', 'Konten asrama berhasil dihapus!');
    }
}
