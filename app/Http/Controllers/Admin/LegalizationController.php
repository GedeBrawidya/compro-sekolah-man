<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LegalizationRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LegalizationController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $status = $request->query('status');

        $requests = LegalizationRequest::when($search, function ($query, $search) {
                $query->where('alumni_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('document_type', 'like', "%{$search}%");
            })
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/legalization/index', [
            'requests' => $requests,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    public function updateStatus(Request $request, LegalizationRequest $legalization)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,approved,rejected',
            'notes' => 'nullable|string',
        ]);

        $legalization->update([
            'status' => $request->status,
            'notes' => $request->notes,
        ]);

        return redirect()->back()->with('success', 'Status permohonan legalisir berhasil diperbarui!');
    }

    public function destroy(LegalizationRequest $legalization)
    {
        $legalization->delete();

        return redirect()->back()->with('success', 'Permohonan legalisir berhasil dihapus!');
    }
}
