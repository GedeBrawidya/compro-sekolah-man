<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\DormitoryPost;
use App\Models\Facility;
use App\Models\Gallery;
use App\Models\LandingPageSetting;
use App\Models\News;
use App\Models\User;
use App\Models\WebsiteVisit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $defaultFormLink = 'https://docs.google.com/forms/d/e/1FAIpQLSeQFirrXnNpCuZEPGK4SOIWuBrs4c3sEPJLEoZB9l0LRWbTqw/formResponse';
        $legalizationLink = LandingPageSetting::get('legalization_link', $defaultFormLink);
        $complaintLink = LandingPageSetting::get('complaint_link', $legalizationLink);

        $stats = [
            'total_news' => News::count(),
            'total_books' => Book::count(),
            'available_books' => Book::where('status', 'available')->count(),
            'total_dormitory_posts' => DormitoryPost::count(),
            'total_facilities' => Facility::count(),
            'total_galleries' => Gallery::count(),
            'total_users' => User::count(),
            'legalization_link' => $legalizationLink,
            'complaint_link' => $complaintLink,
        ];

        $recentDormitoryPosts = DormitoryPost::latest()->take(5)->get();
        $recentNews = News::with('author:id,name')->latest()->take(5)->get();

        // Fetch dynamic 7-day visitor trend data from database
        $visitorStats = [];
        for ($i = 6; $i >= 0; $i--) {
            $dateObj = now()->subDays($i);
            $dateString = $dateObj->toDateString();
            $dayName = $dateObj->locale('id')->isoFormat('D MMM');

            $visit = WebsiteVisit::where('date', $dateString)->first();
            $realCount = $visit ? (int) $visit->views_count : 0;

            $visitorStats[] = [
                'day' => $dayName,
                'visitors' => $realCount,
            ];
        }

        return Inertia::render('admin/dashboard/index', [
            'stats' => $stats,
            'visitorStats' => $visitorStats,
            'recentDormitoryPosts' => $recentDormitoryPosts,
            'recentNews' => $recentNews,
            'userRole' => $user->role,
        ]);
    }
}
