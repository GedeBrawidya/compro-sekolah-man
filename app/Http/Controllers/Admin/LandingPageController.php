<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\LandingPageSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LandingPageController extends Controller
{
    public function index()
    {
        $banners = Banner::orderBy('order')->get()->map(function ($b) {
            return [
                'id'          => $b->id,
                'title'       => $b->title,
                'subtitle'    => $b->subtitle,
                'image'       => $b->image ? Storage::url($b->image) : null,
                'button_text' => $b->button_text,
                'button_link' => $b->button_link,
                'order'       => $b->order,
                'is_active'   => $b->is_active,
            ];
        });

        $settings = LandingPageSetting::getAllAsArray();

        // Resolve image URLs for settings that store paths
        foreach (['school_logo', 'principal_photo', 'principal_media_photo', 'footer_banner_bg'] as $key) {
            if (!empty($settings[$key])) {
                $settings[$key . '_url'] = Storage::url($settings[$key]);
            }
        }

        return Inertia::render('admin/landing-page/index', [
            'banners'  => $banners,
            'settings' => $settings,
            'flash'    => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    /* ─── Banners ─────────────────────────────────────────── */

    public function storeBanner(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'subtitle'    => 'nullable|string|max:500',
            'image'       => 'nullable|image|max:3072',
            'button_text' => 'nullable|string|max:100',
            'button_link' => 'nullable|string|max:500',
            'is_active'   => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('banners', 'public');
        }

        $data['order'] = Banner::max('order') + 1;

        Banner::create($data);

        return back()->with('success', 'Banner berhasil ditambahkan.');
    }

    public function updateBanner(Request $request, Banner $banner)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'subtitle'    => 'nullable|string|max:500',
            'image'       => 'nullable|image|max:3072',
            'button_text' => 'nullable|string|max:100',
            'button_link' => 'nullable|string|max:500',
            'is_active'   => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($banner->image) {
                Storage::disk('public')->delete($banner->image);
            }
            $data['image'] = $request->file('image')->store('banners', 'public');
        }

        $banner->update($data);

        return back()->with('success', 'Banner berhasil diperbarui.');
    }

    public function destroyBanner(Banner $banner)
    {
        if ($banner->image) {
            Storage::disk('public')->delete($banner->image);
        }
        $banner->delete();

        return back()->with('success', 'Banner berhasil dihapus.');
    }

    public function reorderBanners(Request $request)
    {
        $request->validate([
            'order'   => 'required|array',
            'order.*' => 'integer|exists:banners,id',
        ]);

        foreach ($request->order as $index => $id) {
            Banner::where('id', $id)->update(['order' => $index]);
        }

        return back()->with('success', 'Urutan banner disimpan.');
    }

    /* ─── Settings ─────────────────────────────────────────── */

    public function updateSettings(Request $request)
    {
        $request->validate([
            'school_name'        => 'nullable|string|max:255',
            'school_tagline'     => 'nullable|string|max:500',
            'school_address'     => 'nullable|string|max:500',
            'school_phone'       => 'nullable|string|max:50',
            'school_email'       => 'nullable|email|max:255',
            'school_website'     => 'nullable|string|max:255',
            'school_description' => 'nullable|string',
            'school_logo'        => 'nullable|image|max:2048',
            'school_npsn'        => 'nullable|string|max:20',
            'school_status'      => 'nullable|string|max:50',
            'total_students'     => 'nullable|string|max:50',
            'total_teachers'     => 'nullable|string|max:50',
            'total_classrooms'   => 'nullable|string|max:50',
            'accreditation'      => 'nullable|string|max:50',

            'principal_name'       => 'nullable|string|max:255',
            'principal_title'      => 'nullable|string|max:255',
            'principal_bio'        => 'nullable|string',
            'principal_photo'      => 'nullable|image|max:2048',
            'principal_video_url'  => 'nullable|string|max:500',
            'principal_media_type' => 'nullable|string|in:video,photo',
            'principal_media_photo'=> 'nullable|image|max:3072',

            'vision'  => 'nullable|string',
            'mission' => 'nullable|string',

            'footer_copyright' => 'nullable|string|max:255',
            'footer_address'   => 'nullable|string|max:500',
            'footer_phone'     => 'nullable|string|max:50',
            'footer_email'     => 'nullable|email|max:255',
            'footer_facebook'  => 'nullable|string|max:500',
            'footer_instagram' => 'nullable|string|max:500',
            'footer_youtube'   => 'nullable|string|max:500',
            'footer_banner_title' => 'nullable|string|max:255',
            'footer_banner_subtitle' => 'nullable|string|max:500',
            'footer_banner_bg' => 'nullable|image|max:3072',
        ]);

        $imageFields = ['school_logo', 'principal_photo', 'principal_media_photo', 'footer_banner_bg'];
        $allData = $request->except($imageFields);

        foreach ($imageFields as $field) {
            if ($request->hasFile($field)) {
                $old = LandingPageSetting::get($field);
                if ($old) {
                    Storage::disk('public')->delete($old);
                }
                $allData[$field] = $request->file($field)->store(
                    str_replace('_', '-', $field) . 's',
                    'public'
                );
            }
        }

        foreach ($allData as $key => $value) {
            LandingPageSetting::set($key, $value);
        }

        return back()->with('success', 'Pengaturan landing page berhasil disimpan.');
    }
}
