<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class NewsController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');

        $news = News::with('author:id,name')
            ->when($search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/news/index', [
            'news' => $news,
            'filters' => ['search' => $search],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'thumbnail' => 'nullable|file|max:2048|mimes:jpg,jpeg,png,webp',
            'status' => 'required|in:draft,published',
        ], [
            'thumbnail.max' => 'Ukuran file maksimal adalah 2MB.',
        ]);

        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('news-thumbnails', 'public');
        }

        News::create([
            'title' => $request->title,
            'content' => $request->content,
            'thumbnail' => $thumbnailPath ? Storage::url($thumbnailPath) : null,
            'status' => $request->status,
            'published_at' => $request->status === 'published' ? now() : null,
            'author_id' => $request->user()->id,
        ]);

        return redirect()->back()->with('success', 'Berita berhasil dipublikasikan!');
    }

    public function update(Request $request, News $news)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'thumbnail' => 'nullable|file|max:2048|mimes:jpg,jpeg,png,webp',
            'status' => 'required|in:draft,published',
        ], [
            'thumbnail.max' => 'Ukuran file maksimal adalah 2MB.',
        ]);

        if ($request->hasFile('thumbnail')) {
            if ($news->thumbnail && !str_starts_with($news->thumbnail, 'http')) {
                $oldPath = str_replace('/storage/', '', $news->thumbnail);
                Storage::disk('public')->delete($oldPath);
            }
            $thumbnailPath = $request->file('thumbnail')->store('news-thumbnails', 'public');
            $news->thumbnail = Storage::url($thumbnailPath);
        }

        $news->update([
            'title' => $request->title,
            'content' => $request->content,
            'status' => $request->status,
            'published_at' => $request->status === 'published' && !$news->published_at ? now() : $news->published_at,
        ]);

        return redirect()->back()->with('success', 'Berita berhasil diperbarui!');
    }

    public function destroy(News $news)
    {
        if ($news->thumbnail && !str_starts_with($news->thumbnail, 'http')) {
            $oldPath = str_replace('/storage/', '', $news->thumbnail);
            Storage::disk('public')->delete($oldPath);
        }

        $news->delete();

        return redirect()->back()->with('success', 'Berita berhasil dihapus!');
    }
}
