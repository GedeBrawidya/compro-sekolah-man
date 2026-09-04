<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Complaint;
use App\Models\DormitoryPost;
use App\Models\LegalizationRequest;
use App\Models\News;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $stats = [
            'total_news' => News::count(),
            'total_books' => Book::count(),
            'available_books' => Book::where('status', 'available')->count(),
            'total_dormitory_posts' => DormitoryPost::count(),
            'pending_complaints' => Complaint::where('status', 'pending')->count(),
            'pending_legalizations' => LegalizationRequest::where('status', 'pending')->count(),
            'total_users' => User::count(),
        ];

        $recentComplaints = Complaint::latest()->take(5)->get();
        $recentLegalizations = LegalizationRequest::latest()->take(5)->get();
        $recentNews = News::with('author:id,name')->latest()->take(5)->get();

        return Inertia::render('admin/dashboard/index', [
            'stats' => $stats,
            'recentComplaints' => $recentComplaints,
            'recentLegalizations' => $recentLegalizations,
            'recentNews' => $recentNews,
            'userRole' => $user->role,
        ]);
    }
}
