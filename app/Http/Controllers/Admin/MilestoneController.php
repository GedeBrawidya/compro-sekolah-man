<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SchoolMilestone;
use Illuminate\Http\Request;

class MilestoneController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'year'        => 'required|integer|min:1900|max:2100',
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'order'       => 'nullable|integer',
        ]);

        SchoolMilestone::create($data);

        return back()->with('success', 'Milestone berhasil ditambahkan.');
    }

    public function update(Request $request, SchoolMilestone $milestone)
    {
        $data = $request->validate([
            'year'        => 'required|integer|min:1900|max:2100',
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'order'       => 'nullable|integer',
        ]);

        $milestone->update($data);

        return back()->with('success', 'Milestone berhasil diperbarui.');
    }

    public function destroy(SchoolMilestone $milestone)
    {
        $milestone->delete();

        return back()->with('success', 'Milestone berhasil dihapus.');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'order'   => 'required|array',
            'order.*' => 'integer|exists:school_milestones,id',
        ]);

        foreach ($request->order as $index => $id) {
            SchoolMilestone::where('id', $id)->update(['order' => $index]);
        }

        return back()->with('success', 'Urutan milestone disimpan.');
    }
}
