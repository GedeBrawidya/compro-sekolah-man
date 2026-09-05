<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\Book;
use App\Models\BookCategory;
use App\Models\Complaint;
use App\Models\DormitoryPost;
use App\Models\Gallery;
use App\Models\LandingPageSetting;
use App\Models\LegalizationRequest;
use App\Models\News;
use App\Models\SchoolMilestone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PublicController extends Controller
{
    public function index(Request $request)
    {
        // 1. Banners
        $banners = Banner::where('is_active', true)
            ->orderBy('order')
            ->get()
            ->map(function ($b) {
                return [
                    'id'          => $b->id,
                    'title'       => $b->title,
                    'subtitle'    => $b->subtitle,
                    'image'       => $b->image ? Storage::url($b->image) : null,
                    'button_text' => $b->button_text,
                    'button_link' => $b->button_link,
                ];
            });

        // 2. Settings
        $settings = LandingPageSetting::getAllAsArray();
        foreach (['school_logo', 'principal_photo', 'principal_media_photo', 'footer_banner_bg', 'dormitory_pengasuh_photo'] as $key) {
            if (!empty($settings[$key])) {
                $settings[$key . '_url'] = Storage::url($settings[$key]);
            }
        }

        // 3. News (Published only)
        $news = News::with('author:id,name')
            ->where('status', 'published')
            ->latest('published_at')
            ->get()
            ->map(function ($item) {
                return [
                    'id'           => $item->id,
                    'title'        => $item->title,
                    'slug'         => $item->slug,
                    'content'      => $item->content,
                    'thumbnail'    => $item->thumbnail,
                    'published_at' => $item->published_at ? $item->published_at->format('d M Y') : null,
                    'author'       => $item->author ? $item->author->name : 'Humas Sekolah',
                    'views_count'  => $item->views_count ?? 0,
                ];
            });

        // 4. Galleries (Active only - newest first)
        $galleries = Gallery::where('is_active', true)
            ->latest()
            ->get()
            ->map(function ($g) {
                return [
                    'id'            => $g->id,
                    'title'         => $g->title,
                    'type'          => $g->type,
                    'display_image' => $g->display_image,
                    'youtube_url'   => $g->youtube_url,
                    'youtube_id'    => $g->youtube_id,
                    'category'      => $g->category,
                    'description'   => $g->description,
                ];
            });

        // 5. Books (all for filtering & pagination on client)
        $books = Book::withCount(['copies', 'copies as available_copies_count' => function ($q) {
                $q->where('status', 'available');
            }])
            ->latest()
            ->get()
            ->map(function ($b) {
                return [
                    'id'               => $b->id,
                    'title'            => $b->title,
                    'author'           => $b->author,
                    'category'         => $b->category,
                    'isbn'             => $b->isbn,
                    'cover_image'      => $b->cover_image,
                    'description'      => $b->description,
                    'status'           => $b->status,
                    'available_copies' => $b->available_copies_count,
                    'total_copies'     => $b->copies_count,
                ];
            });

        // Book categories from the managed list
        $bookCategories = BookCategory::orderBy('name')->pluck('name')->values();

        // 6. Dormitory Posts
        $dormitory = DormitoryPost::with('author:id,name')
            ->latest()
            ->get()
            ->map(function ($d) {
                return [
                    'id'         => $d->id,
                    'title'      => $d->title,
                    'content'    => $d->content,
                    'media'      => $d->media,
                    'author'     => $d->author ? $d->author->name : 'Pengurus Asrama',
                    'created_at' => $d->created_at->format('d M Y'),
                ];
            });

        // 7. Overall Stats
        $stats = [
            'total_news'      => News::where('status', 'published')->count(),
            'total_books'     => Book::count(),
            'total_galleries' => Gallery::where('is_active', true)->count(),
            'total_dormitory' => DormitoryPost::count(),
        ];

        // 8. Milestones (Sejarah Singkat)
        $milestones = SchoolMilestone::orderBy('order')->orderBy('year')->get()->map(function ($m) {
            return [
                'id'          => $m->id,
                'year'        => $m->year,
                'title'       => $m->title,
                'description' => $m->description,
                'order'       => $m->order,
            ];
        });

        return Inertia::render('welcome', [
            'banners'         => $banners,
            'settings'        => $settings,
            'news'            => $news,
            'galleries'       => $galleries,
            'books'           => $books,
            'bookCategories'  => $bookCategories,
            'dormitory'       => $dormitory,
            'milestones'      => $milestones,
            'stats'           => $stats,
            'flash'           => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    public function showNews(string $slug)
    {
        $newsItem = News::with('author:id,name')
            ->where('status', 'published')
            ->where(function ($q) use ($slug) {
                $q->where('slug', $slug)->orWhere('id', $slug);
            })
            ->firstOrFail();

        $newsItem->increment('views_count');

        // Recent news excluding current article
        $recentNews = News::with('author:id,name')
            ->where('status', 'published')
            ->where('id', '!=', $newsItem->id)
            ->latest('published_at')
            ->take(4)
            ->get()
            ->map(function ($item) {
                return [
                    'id'           => $item->id,
                    'title'        => $item->title,
                    'slug'         => $item->slug,
                    'content'      => $item->content,
                    'thumbnail'    => $item->thumbnail,
                    'published_at' => $item->published_at ? $item->published_at->format('d M Y') : $item->created_at->format('d M Y'),
                    'author'       => $item->author ? $item->author->name : 'Humas Sekolah',
                    'views_count'  => $item->views_count ?? 0,
                ];
            });

        // Settings
        $settings = LandingPageSetting::getAllAsArray();
        foreach (['school_logo', 'principal_photo', 'footer_banner_bg'] as $key) {
            if (!empty($settings[$key])) {
                $settings[$key . '_url'] = Storage::url($settings[$key]);
            }
        }

        return Inertia::render('news/show', [
            'news' => [
                'id'           => $newsItem->id,
                'title'        => $newsItem->title,
                'slug'         => $newsItem->slug,
                'content'      => $newsItem->content,
                'thumbnail'    => $newsItem->thumbnail,
                'published_at' => $newsItem->published_at ? $newsItem->published_at->format('d M Y • H:i') : $newsItem->created_at->format('d M Y • H:i'),
                'author'       => $newsItem->author ? $newsItem->author->name : 'Humas MAN Tanjungpinang',
                'views_count'  => $newsItem->views_count,
            ],
            'recentNews' => $recentNews,
            'settings'   => $settings,
        ]);
    }

    public function storeLegalization(Request $request)
    {
        $request->validate([
            'alumni_name'     => 'required|string|max:255',
            'email'           => 'required|email|max:255',
            'phone'           => 'required|string|max:50',
            'graduation_year' => 'required|string|max:10',
            'document_type'   => 'required|string|max:255',
            'copies'          => 'required|integer|min:1|max:20',
            'notes'           => 'nullable|string|max:1000',
        ]);

        LegalizationRequest::create([
            'alumni_name'     => $request->alumni_name,
            'email'           => $request->email,
            'phone'           => $request->phone,
            'graduation_year' => $request->graduation_year,
            'document_type'   => $request->document_type,
            'copies'          => $request->copies,
            'notes'           => $request->notes,
            'status'          => 'pending',
        ]);

        return back()->with('success', 'Permohonan e-legalisir berhasil dikirim! Silakan tunggu konfirmasi dari pihak sekolah.');
    }

    public function storeComplaint(Request $request)
    {
        $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|max:255',
            'phone'   => 'nullable|string|max:50',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:3000',
        ]);

        Complaint::create([
            'name'    => $request->name,
            'email'   => $request->email,
            'phone'   => $request->phone,
            'subject' => $request->subject,
            'message' => $request->message,
            'status'  => 'pending',
        ]);

        return back()->with('success', 'Pengaduan Anda berhasil dikirim! Terima kasih atas masukan & masukan Anda.');
    }
}
