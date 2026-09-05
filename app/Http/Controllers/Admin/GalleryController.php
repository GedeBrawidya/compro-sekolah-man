<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class GalleryController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->query('type');
        $search = $request->query('search');

        $items = Gallery::query()
            ->when($type, fn ($q) => $q->where('type', $type))
            ->when($search, fn ($q) => $q->where('title', 'like', "%{$search}%")->orWhere('category', 'like', "%{$search}%"))
            ->orderBy('order')
            ->latest()
            ->paginate(12)
            ->withQueryString();

        // Transform display image
        $items->getCollection()->transform(function ($item) {
            return [
                'id'            => $item->id,
                'title'         => $item->title,
                'type'          => $item->type,
                'image_path'    => $item->image_path ? Storage::url($item->image_path) : null,
                'youtube_url'   => $item->youtube_url,
                'youtube_id'    => $item->youtube_id,
                'display_image' => $item->display_image,
                'description'   => $item->description,
                'category'      => $item->category,
                'is_active'     => $item->is_active,
                'created_at'    => $item->created_at->format('d M Y'),
            ];
        });

        return Inertia::render('admin/gallery/index', [
            'galleries' => $items,
            'filters'   => ['type' => $type, 'search' => $search],
            'flash'     => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'type'        => 'required|in:photo,youtube',
            'image'       => 'required_if:type,photo|nullable|image|max:5120',
            'youtube_url' => 'required_if:type,youtube|nullable|url',
            'category'    => 'nullable|string|max:100',
            'description' => 'nullable|string|max:1000',
        ], [
            'image.required_if'       => 'Foto wajib diunggah untuk tipe galeri Foto.',
            'youtube_url.required_if' => 'Link URL YouTube wajib diisi untuk tipe galeri YouTube Video.',
            'image.max'               => 'Ukuran foto maksimal adalah 5MB.',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('gallery', 'public');
        }

        $youtubeId = null;
        if ($request->type === 'youtube' && $request->youtube_url) {
            $youtubeId = Gallery::extractYoutubeId($request->youtube_url);
        }

        Gallery::create([
            'title'       => $request->title,
            'type'        => $request->type,
            'image_path'  => $imagePath,
            'youtube_url' => $request->youtube_url,
            'youtube_id'  => $youtubeId,
            'category'    => $request->category ?: 'Umum',
            'description' => $request->description,
            'is_active'   => true,
            'order'       => Gallery::max('order') + 1,
        ]);

        return back()->with('success', 'Item galeri berhasil ditambahkan!');
    }

    public function update(Request $request, Gallery $gallery)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'type'        => 'required|in:photo,youtube',
            'image'       => 'nullable|image|max:5120',
            'youtube_url' => 'nullable|url',
            'category'    => 'nullable|string|max:100',
            'description' => 'nullable|string|max:1000',
        ]);

        $imagePath = $gallery->image_path;

        if ($request->hasFile('image')) {
            if ($imagePath) {
                Storage::disk('public')->delete($imagePath);
            }
            $imagePath = $request->file('image')->store('gallery', 'public');
        }

        $youtubeId = $gallery->youtube_id;
        if ($request->type === 'youtube' && $request->youtube_url) {
            $youtubeId = Gallery::extractYoutubeId($request->youtube_url);
        }

        $gallery->update([
            'title'       => $request->title,
            'type'        => $request->type,
            'image_path'  => $imagePath,
            'youtube_url' => $request->youtube_url,
            'youtube_id'  => $youtubeId,
            'category'    => $request->category ?: 'Umum',
            'description' => $request->description,
        ]);

        return back()->with('success', 'Item galeri berhasil diperbarui!');
    }

    public function destroy(Gallery $gallery)
    {
        if ($gallery->image_path) {
            Storage::disk('public')->delete($gallery->image_path);
        }

        $gallery->delete();

        return back()->with('success', 'Item galeri berhasil dihapus!');
    }

    public function toggleStatus(Gallery $gallery)
    {
        $gallery->update(['is_active' => !$gallery->is_active]);

        return back()->with('success', 'Status galeri berhasil diubah.');
    }
}
