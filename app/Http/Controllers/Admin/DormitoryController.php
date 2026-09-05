<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DormitoryPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

use App\Models\LandingPageSetting;

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

        $settings = LandingPageSetting::getAllAsArray();
        if (!empty($settings['dormitory_pengasuh_photo'])) {
            $settings['dormitory_pengasuh_photo_url'] = Storage::url($settings['dormitory_pengasuh_photo']);
        }

        return Inertia::render('admin/dormitory/index', [
            'posts' => $posts,
            'settings' => $settings,
            'filters' => ['search' => $search],
        ]);
    }

    public function updateSettings(Request $request)
    {
        $request->validate([
            'dormitory_pengasuh_name'  => 'nullable|string|max:255',
            'dormitory_pengasuh_title' => 'nullable|string|max:255',
            'dormitory_title'          => 'nullable|string|max:255',
            'dormitory_description'    => 'nullable|string',
            'dormitory_wa_putra'       => 'nullable|string|max:500',
            'dormitory_wa_putri'       => 'nullable|string|max:500',
            'dormitory_instagram'      => 'nullable|string|max:500',
            'dormitory_tiktok'         => 'nullable|string|max:500',
            'dormitory_pengasuh_photo' => 'nullable|image|max:3072',
        ]);

        $allData = $request->except(['dormitory_pengasuh_photo']);

        if ($request->hasFile('dormitory_pengasuh_photo')) {
            $old = LandingPageSetting::get('dormitory_pengasuh_photo');
            if ($old) {
                Storage::disk('public')->delete($old);
            }
            $allData['dormitory_pengasuh_photo'] = $request->file('dormitory_pengasuh_photo')->store(
                'dormitory-pengasuh',
                'public'
            );
        }

        foreach ($allData as $key => $value) {
            LandingPageSetting::set($key, $value);
        }

        return back()->with('success', 'Pengaturan profil asrama & pengurus berhasil disimpan.');
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
