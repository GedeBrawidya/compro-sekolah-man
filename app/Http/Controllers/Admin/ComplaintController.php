<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LandingPageSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ComplaintController extends Controller
{
    public function index()
    {
        $defaultLegalisirLink = 'https://docs.google.com/forms/d/e/1FAIpQLSeQFirrXnNpCuZEPGK4SOIWuBrs4c3sEPJLEoZB9l0LRWbTqw/formResponse';
        $legalisirLink = LandingPageSetting::get('legalization_link', $defaultLegalisirLink);
        $complaintLink = LandingPageSetting::get('complaint_link', $legalisirLink);

        return Inertia::render('admin/complaints/index', [
            'complaint_link' => $complaintLink,
        ]);
    }

    public function updateLink(Request $request)
    {
        $request->validate([
            'complaint_link' => 'nullable|string|max:500',
        ]);

        LandingPageSetting::set('complaint_link', $request->complaint_link);

        return redirect()->back()->with('success', 'Link Form Pengaduan berhasil diperbarui!');
    }
}
