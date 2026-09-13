<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LandingPageSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LegalizationController extends Controller
{
    public function index()
    {
        $defaultLink = 'https://docs.google.com/forms/d/e/1FAIpQLSeQFirrXnNpCuZEPGK4SOIWuBrs4c3sEPJLEoZB9l0LRWbTqw/formResponse';
        $legalizationLink = LandingPageSetting::get('legalization_link', $defaultLink);

        return Inertia::render('admin/legalization/index', [
            'legalization_link' => $legalizationLink,
        ]);
    }

    public function updateLink(Request $request)
    {
        $request->validate([
            'legalization_link' => 'nullable|string|max:500',
        ]);

        LandingPageSetting::set('legalization_link', $request->legalization_link);

        return redirect()->back()->with('success', 'Link E-Legalisir berhasil diperbarui!');
    }
}
