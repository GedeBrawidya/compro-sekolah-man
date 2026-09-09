import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    Award,
    BookOpen,
    Building2,
    Calendar,
    CheckCircle2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Compass,
    Eye,
    FileCheck,
    Filter,
    Globe,
    GraduationCap,
    Image as ImageIcon,
    Info,
    Library,
    LogIn,
    Mail,
    MapPin,
    Menu,
    MessageSquare,
    Newspaper,
    Phone,
    Play,
    PlayCircle,
    Search,
    Send,
    Share2,
    ShieldCheck,
    Sparkles,
    Star,
    Target,
    User,
    Users,
    X,
} from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';

const getExcerpt = (html?: string, maxLength = 130) => {
    if (!html) return '';
    const text = html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
};

const getYouTubeId = (url?: string) => {
    if (!url) return 'swh2GC1XqyE';
    let videoId = '';
    if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('youtube.com/watch')) {
        const parts = url.split('v=');
        if (parts[1]) {
            videoId = parts[1].split('&')[0];
        }
    } else if (url.includes('youtube.com/embed/')) {
        videoId = url.split('youtube.com/embed/')[1]?.split('?')[0] || '';
    }
    return videoId || 'swh2GC1XqyE';
};

const getYouTubeThumbnail = (url?: string) => {
    const id = getYouTubeId(url);
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
};

const getYouTubeEmbedUrl = (url?: string) => {
    const id = getYouTubeId(url);
    return `https://www.youtube.com/embed/${id}`;
};

const AnimatedCounter = ({ value }: { value: string | number }) => {
    const [count, setCount] = useState(0);
    const strVal = String(value);
    const numericStr = strVal.replace(/[^0-9]/g, '');
    const targetNum = parseInt(numericStr, 10);
    const hasPlus = strVal.includes('+');
    const isNumeric = !isNaN(targetNum) && numericStr.length > 0;

    useEffect(() => {
        if (!isNumeric) return;
        let start = 0;
        const duration = 1600;
        const steps = 40;
        const stepTime = duration / steps;
        const increment = targetNum / steps;

        const timer = setInterval(() => {
            start += increment;
            if (start >= targetNum) {
                setCount(targetNum);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, [targetNum, isNumeric]);

    if (!isNumeric) {
        return <span>{strVal}</span>;
    }

    return (
        <span>
            {count.toLocaleString('id-ID')}
            {hasPlus ? '+' : ''}
        </span>
    );
};


interface BannerItem {
    id: number;
    title: string;
    subtitle: string | null;
    image: string | null;
    button_text: string | null;
    button_link: string | null;
}

interface NewsItem {
    id: number;
    title: string;
    slug: string;
    content: string;
    thumbnail: string | null;
    published_at: string | null;
    author: string;
    views_count?: number;
}

interface GalleryItem {
    id: number;
    title: string;
    type: 'photo' | 'youtube';
    display_image: string | null;
    youtube_url: string | null;
    youtube_id: string | null;
    category: string | null;
    description: string | null;
}

interface BookItem {
    id: number;
    title: string;
    author: string;
    category: string;
    isbn: string | null;
    cover_image: string | null;
    description: string | null;
    status: string;
    available_copies: number;
    total_copies: number;
}

interface DormitoryItem {
    id: number;
    title: string;
    content: string;
    media: string | null;
    author: string;
    created_at: string;
}

interface MilestoneItem {
    id: number;
    year: number;
    title: string;
    description: string | null;
    order: number;
}

interface Props {
    banners: BannerItem[];
    settings: Record<string, string>;
    news: NewsItem[];
    galleries: GalleryItem[];
    books: BookItem[];
    bookCategories: string[];
    dormitory: DormitoryItem[];
    milestones: MilestoneItem[];
    stats: {
        total_news: number;
        total_books: number;
        total_galleries: number;
        total_dormitory: number;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Welcome({
    banners = [],
    settings = {},
    news = [],
    galleries = [],
    books = [],
    bookCategories = [],
    dormitory = [],
    milestones = [],
    stats = { total_news: 0, total_books: 0, total_galleries: 0, total_dormitory: 0 },
}: Props) {
    const { auth, flash } = usePage<{
        auth: { user: any };
        flash: { success?: string; error?: string };
    }>().props;

    const [activeTab, setActiveTab] = useState<'home' | 'profile' | 'vision' | 'news' | 'gallery' | 'books' | 'dormitory' | 'legalization' | 'complaints'>('home');
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
    const [selectedGallery, setSelectedGallery] = useState<GalleryItem | null>(null);
    const [bookSearch, setBookSearch] = useState('');
    const [bookCategory, setBookCategory] = useState<string>('all');
    const [bookAvailability, setBookAvailability] = useState<string>('all');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isPlayingInlineVideo, setIsPlayingInlineVideo] = useState(false);
    const [profileSubTab, setProfileSubTab] = useState<'vision' | 'profile' | 'history' | 'target' | 'facilities' | 'motto'>('vision');
    const [galleryCategory, setGalleryCategory] = useState<string>('all');
    const [newsPage, setNewsPage] = useState(1);
    const [galleryPage, setGalleryPage] = useState(1);
    const [bookPage, setBookPage] = useState(1);
    const [dormPage, setDormPage] = useState(1);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterSuccess, setNewsletterSuccess] = useState(false);
    const [bannerTouchStart, setBannerTouchStart] = useState<number | null>(null);
    const [galleryTouchStart, setGalleryTouchStart] = useState<number | null>(null);
    const [showWatermark, setShowWatermark] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowWatermark(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        setBookPage(1);
    }, [bookSearch, bookCategory, bookAvailability]);

    const handleTabClick = (tabId: 'home' | 'profile' | 'vision' | 'news' | 'gallery' | 'books' | 'dormitory' | 'legalization' | 'complaints') => {
        if (tabId === 'books') {
            window.open('/?tab=books', '_blank');
            return;
        }
        setActiveTab(tabId);
        setIsMobileMenuOpen(false);

        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        if (document.documentElement) document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        if (document.body) document.body.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

        requestAnimationFrame(() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        });
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');
        if (tabParam && ['home', 'profile', 'vision', 'news', 'gallery', 'books', 'dormitory', 'legalization', 'complaints'].includes(tabParam)) {
            setActiveTab(tabParam as any);
        }
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, [activeTab]);

    const handleBannerTouchStart = (e: React.TouchEvent) => {
        setBannerTouchStart(e.touches[0].clientX);
    };

    const handleBannerTouchEnd = (e: React.TouchEvent) => {
        if (bannerTouchStart === null) return;
        const touchEnd = e.changedTouches[0].clientX;
        const diff = bannerTouchStart - touchEnd;
        if (diff > 40) {
            setCurrentBannerIndex((prev) => (prev + 1) % (banners.length || 1));
        } else if (diff < -40) {
            setCurrentBannerIndex((prev) => (prev - 1 + (banners.length || 1)) % (banners.length || 1));
        }
        setBannerTouchStart(null);
    };

    const handleGalleryTouchStart = (e: React.TouchEvent) => {
        setGalleryTouchStart(e.touches[0].clientX);
    };

    const handleGalleryTouchEnd = (e: React.TouchEvent) => {
        if (galleryTouchStart === null) return;
        const touchEnd = e.changedTouches[0].clientX;
        const diff = galleryTouchStart - touchEnd;
        if (diff > 40) {
            setActiveGalleryIndex((prev) => (prev + 1) % (galleries.length || 1));
        } else if (diff < -40) {
            setActiveGalleryIndex((prev) => (prev - 1 + (galleries.length || 1)) % (galleries.length || 1));
        }
        setGalleryTouchStart(null);
    };

    const handleNewsletterSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!newsletterEmail) return;
        setNewsletterSuccess(true);
        setNewsletterEmail('');
        setTimeout(() => setNewsletterSuccess(false), 5000);
    };

    // Scroll listener for dynamic navbar transformation
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 40) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Auto-advance banner carousel every 6s if banners exist
    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [banners.length]);

    // Auto-advance gallery showcase every 7s if galleries exist
    useEffect(() => {
        if (galleries.length <= 1) return;
        const timer = setInterval(() => {
            setActiveGalleryIndex((prev) => (prev + 1) % galleries.length);
        }, 7000);
        return () => clearInterval(timer);
    }, [galleries.length]);

    // Forms
    const legalizationForm = useForm({
        alumni_name: '',
        email: '',
        phone: '',
        graduation_year: new Date().getFullYear().toString(),
        document_type: 'Ijazah & Transkrip Nilai',
        copies: 3,
        notes: '',
    });

    const complaintForm = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const handleLegalizationSubmit = (e: FormEvent) => {
        e.preventDefault();
        legalizationForm.post('/legalization', {
            onSuccess: () => legalizationForm.reset(),
        });
    };

    const handleComplaintSubmit = (e: FormEvent) => {
        e.preventDefault();
        complaintForm.post('/complaints', {
            onSuccess: () => complaintForm.reset(),
        });
    };

    const filteredBooks = books.filter((b) => {
        const matchSearch =
            b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
            b.author.toLowerCase().includes(bookSearch.toLowerCase()) ||
            b.category.toLowerCase().includes(bookSearch.toLowerCase());
        const matchCategory = bookCategory === 'all' || b.category === bookCategory;
        const matchAvailability =
            bookAvailability === 'all' ||
            (bookAvailability === 'available' && (b.available_copies ?? 0) > 0) ||
            (bookAvailability === 'borrowed' && (b.available_copies ?? 0) === 0);
        return matchSearch && matchCategory && matchAvailability;
    });

    const filteredGalleries = galleryCategory === 'all'
        ? galleries
        : galleryCategory === 'photo'
        ? galleries.filter((g) => g.type === 'photo')
        : galleries.filter((g) => g.type === 'youtube');

    const featuredGalleries = galleries.slice(0, 5);

    const NEWS_PER_PAGE = 6;
    const GALLERY_PER_PAGE = 12;
    const BOOK_PER_PAGE = 8;
    const DORM_PER_PAGE = 6;

    const totalNewsPages = Math.ceil(news.length / NEWS_PER_PAGE);
    const paginatedNews = news.slice((newsPage - 1) * NEWS_PER_PAGE, newsPage * NEWS_PER_PAGE);

    const totalGalleryPages = Math.ceil(filteredGalleries.length / GALLERY_PER_PAGE);
    const paginatedGalleries = filteredGalleries.slice((galleryPage - 1) * GALLERY_PER_PAGE, galleryPage * GALLERY_PER_PAGE);

    const totalBookPages = Math.ceil(filteredBooks.length / BOOK_PER_PAGE);
    const paginatedBooks = filteredBooks.slice((bookPage - 1) * BOOK_PER_PAGE, bookPage * BOOK_PER_PAGE);

    const totalDormPages = Math.ceil(dormitory.length / DORM_PER_PAGE);
    const paginatedDorm = dormitory.slice((dormPage - 1) * DORM_PER_PAGE, dormPage * DORM_PER_PAGE);

    const renderPaginationControls = (
        currentPage: number,
        totalPages: number,
        onPageChange: (page: number) => void
    ) => {
        if (totalPages <= 1) return null;
        return (
            <div className="flex items-center justify-center gap-2 pt-8 pb-4">
                <button
                    disabled={currentPage === 1}
                    onClick={() => {
                        onPageChange(currentPage - 1);
                    }}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        currentPage === 1
                            ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
                            : 'bg-white text-[#142921] border border-[#c8dac5] hover:bg-[#265243] hover:text-white shadow-2xs'
                    }`}
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Sebelumnya</span>
                </button>

                <div className="flex items-center gap-1.5 px-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => {
                                onPageChange(p);
                            }}
                            className={`w-9 h-9 rounded-xl text-xs font-black transition-all cursor-pointer ${
                                currentPage === p
                                    ? 'bg-[#265243] text-white shadow-md scale-105'
                                    : 'bg-white text-[#142921] border border-[#c8dac5] hover:bg-[#eef5eb]'
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => {
                        onPageChange(currentPage + 1);
                    }}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        currentPage === totalPages
                            ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
                            : 'bg-white text-[#142921] border border-[#c8dac5] hover:bg-[#265243] hover:text-white shadow-2xs'
                    }`}
                >
                    <span className="hidden sm:inline">Selanjutnya</span>
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        );
    };

    const logoUrl = settings.school_logo_url || null;
    const rawSchoolName = settings.school_name || 'MAN TANJUNGPINANG';
    const schoolName = rawSchoolName.trim().toUpperCase() === 'MAN' ? 'MAN TANJUNGPINANG' : rawSchoolName;
    const schoolTagline = settings.school_tagline || 'Mewujudkan Generasi Cerdas, Berkarakter, dan Berdaya Saing Global';
    const schoolDesc = settings.school_description ||
        'MAN TANJUNGPINANG merupakan lembaga pendidikan unggulan yang berdedikasi tinggi dalam mencetak lulusan berprestasi akademik, berakhlak mulia, serta menguasai keterampilan sains dan teknologi.';

    const missionItems = useMemo(() => {
        const rawMission = settings.mission || settings.misi;
        if (rawMission && rawMission.trim()) {
            const lines = rawMission
                .split('\n')
                .map((l) => l.trim())
                .filter((l) => l.length > 0);

            if (lines.length > 0) {
                return lines.map((line, idx) => {
                    const cleanDesc = line.replace(/^(?:\d+[\.\)]\s*|\-\s*)/, '');
                    return {
                        num: String(idx + 1).padStart(2, '0'),
                        desc: cleanDesc,
                    };
                });
            }
        }
        return [
            {
                num: '01',
                desc: 'Meningkatkan Keimanan dan Ketaqwaan terhadap Tuhan Yang Maha Esa.',
            },
            {
                num: '02',
                desc: 'Meningkatkan Wawasan kebangsaan dan cinta tanah air.',
            },
            {
                num: '03',
                desc: 'Meningkatkan karakter kemandirian, kerja keras, dan kepemimpinan.',
            },
            {
                num: '04',
                desc: 'Memperkaya Kurikulum Berwawasan Lingkungan dengan Budaya Karakter Bangsa berbasis Kearifan Lokal.',
            },
            {
                num: '05',
                desc: 'Mengembangkan kultur sekolah yang disiplin, agamis, dan menerapkan budaya 5S (Senyum, Sapa, Salam, Sopan, Santun).',
            },
        ];
    }, [settings.mission, settings.misi]);

    return (
        <>
            <Head title="MAN TANJUNGPINANG - Portal Sekolah">
                <meta name="description" content={`Portal Resmi ${schoolName} - ${schoolTagline}`} />
                {logoUrl && <link rel="icon" href={logoUrl} />}
                {logoUrl && <link rel="shortcut icon" href={logoUrl} />}
                {logoUrl && <link rel="apple-touch-icon" href={logoUrl} />}
            </Head>

            <div className="min-h-screen flex flex-col justify-between bg-[#f8faf7] text-[#142921] font-sans antialiased selection:bg-[#265243] selection:text-white">

                {/* ── 1. DYNAMIC NAVBAR (ULTRA-SMOOTH MORPHING) ── */}
                <div className="sticky top-0 z-50 w-full flex justify-center pointer-events-none transition-all duration-500 ease-in-out">
                    <header
                        className={`pointer-events-auto transition-all duration-500 ease-in-out flex items-center justify-between ${
                            isMobileMenuOpen
                                ? 'w-full max-w-full bg-transparent border-none shadow-none px-4 sm:px-8 py-3.5'
                                : isScrolled
                                ? 'mt-3 w-[calc(100%-2rem)] max-w-7xl bg-white/95 backdrop-blur-xl rounded-full shadow-2xl border border-[#c8dac5] px-6 py-2.5'
                                : 'w-full max-w-full bg-white/95 backdrop-blur-md border-b border-[#c8dac5] shadow-xs px-4 sm:px-8 py-3.5'
                        }`}
                    >
                        <div className="max-w-7xl mx-auto w-full flex items-center justify-between relative">
                            {/* Brand Logo & Name */}
                            <div className="flex items-center gap-3 cursor-pointer shrink-0 mr-4 lg:mr-8" onClick={() => handleTabClick('home')}>
                                {settings.school_logo_url ? (
                                    <img src={settings.school_logo_url} alt="Logo" className="w-10 h-10 object-contain" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-[#265243] text-white flex items-center justify-center font-black text-lg shadow-sm">
                                        S
                                    </div>
                                )}
                                <div>
                                    <h1 className="text-xs sm:text-sm font-extrabold text-[#142921] leading-tight tracking-tight">
                                        {schoolName}
                                    </h1>
                                    <p className="text-[9px] sm:text-[10px] font-bold text-[#527365]">
                                        Portal Resmi Sekolah
                                    </p>
                                </div>
                            </div>

                            {/* Nav Links (Desktop) */}
                            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
                                <button
                                    onClick={() => handleTabClick('home')}
                                    style={activeTab === 'home' ? { backgroundColor: '#265243', color: '#ffffff' } : { color: '#142921' }}
                                    className={`px-3.5 py-2 text-xs font-extrabold rounded-full transition-all duration-300 whitespace-nowrap ${
                                        activeTab === 'home' ? 'shadow-xs scale-[1.02]' : 'hover:bg-[#e2ebd9]'
                                    }`}
                                >
                                    Beranda
                                </button>

                                {/* Profil Dropdown */}
                                <div className="relative" onMouseEnter={() => setIsProfileDropdownOpen(true)} onMouseLeave={() => setIsProfileDropdownOpen(false)}>
                                    <button
                                        onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
                                        style={
                                            activeTab === 'profile' || activeTab === 'vision'
                                                ? { backgroundColor: '#265243', color: '#ffffff' }
                                                : { color: '#142921' }
                                        }
                                        className={`px-3.5 py-2 text-xs font-extrabold rounded-full transition-all duration-300 flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                                            activeTab === 'profile' || activeTab === 'vision' ? 'shadow-xs scale-[1.02]' : 'hover:bg-[#e2ebd9]'
                                        }`}
                                    >
                                        <span>Profil</span>
                                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isProfileDropdownOpen && (
                                        <div className="absolute left-0 top-full pt-2 w-48 z-50">
                                            <div className="bg-white border border-[#c8dac5] rounded-2xl p-2 shadow-xl space-y-1">
                                                <button
                                                    onClick={() => { handleTabClick('profile'); setProfileSubTab('profile'); setIsProfileDropdownOpen(false); }}
                                                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                                        activeTab === 'profile' && profileSubTab === 'profile' ? 'bg-[#265243] text-white' : 'text-[#142921] hover:bg-[#f4f8f3]'
                                                    }`}
                                                >
                                                    Profil Sekolah
                                                </button>
                                                <button
                                                    onClick={() => { handleTabClick('profile'); setProfileSubTab('vision'); setIsProfileDropdownOpen(false); }}
                                                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                                        activeTab === 'profile' && profileSubTab === 'vision' ? 'bg-[#265243] text-white' : 'text-[#142921] hover:bg-[#f4f8f3]'
                                                    }`}
                                                >
                                                    Visi & Misi
                                                </button>
                                                <button
                                                    onClick={() => { handleTabClick('profile'); setProfileSubTab('history'); setIsProfileDropdownOpen(false); }}
                                                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                                        activeTab === 'profile' && profileSubTab === 'history' ? 'bg-[#265243] text-white' : 'text-[#142921] hover:bg-[#f4f8f3]'
                                                    }`}
                                                >
                                                    Sejarah Singkat
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {[
                                    { id: 'news', label: 'Berita Terbaru' },
                                    { id: 'gallery', label: 'Galeri' },
                                    { id: 'books', label: 'Perpustakaan' },
                                    { id: 'dormitory', label: 'Asrama' },
                                    { id: 'legalization', label: 'E-Legalisir' },
                                    { id: 'complaints', label: 'Pengaduan' },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabClick(tab.id as any)}
                                        style={
                                            activeTab === tab.id
                                                ? { backgroundColor: '#265243', color: '#ffffff' }
                                                : { color: '#142921' }
                                        }
                                        className={`px-3.5 py-2 text-xs font-extrabold rounded-full transition-all duration-300 whitespace-nowrap ${
                                            activeTab === tab.id ? 'shadow-xs scale-[1.02]' : 'hover:bg-[#e2ebd9]'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>

                            {/* Admin Login Button (Desktop) */}
                            <div className="hidden lg:flex items-center gap-2 shrink-0">
                                {auth?.user ? (
                                    <Link
                                        href="/admin/dashboard"
                                        style={{ backgroundColor: '#265243', color: '#ffffff' }}
                                        className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full text-xs font-extrabold shadow-sm hover:bg-[#1a3d31] hover:scale-105 transition-all"
                                    >
                                        <Building2 className="w-3.5 h-3.5 text-white" /> Admin
                                    </Link>
                                ) : (
                                    <Link
                                        href="/login"
                                        style={{ backgroundColor: '#265243', color: '#ffffff' }}
                                        className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full text-xs font-extrabold shadow-sm hover:bg-[#1a3d31] hover:scale-105 transition-all"
                                    >
                                        <LogIn className="w-3.5 h-3.5 text-white" /> Login
                                    </Link>
                                )}
                            </div>

                            {/* Mobile Hamburger Garis 3 Button (Pojok Kanan Header) */}
                            <button
                                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                                aria-label="Toggle Navigation Menu"
                                className={`lg:hidden w-10 h-10 rounded-full text-[#142921] border border-[#c8dac5] flex items-center justify-center transition-all shadow-md shrink-0 ${
                                    isMobileMenuOpen
                                        ? 'bg-white text-[#265243] hover:bg-[#265243] hover:text-white ring-2 ring-[#265243]/20'
                                        : 'bg-[#f4f8f3] hover:bg-[#265243] hover:text-white'
                                }`}
                            >
                                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>

                            {/* Mobile Listdown Dropdown Menu Panel */}
                            {isMobileMenuOpen && (
                                <div className="lg:hidden absolute left-0 right-0 top-full mt-2 bg-white/98 backdrop-blur-xl border border-[#c8dac5] rounded-3xl p-4 shadow-2xl space-y-2 z-50 animate-in fade-in slide-in-from-top-3 duration-300">
                                    <div className="space-y-1">
                                        {[
                                            { id: 'home', label: 'Beranda Principal' },
                                            { id: 'profile', label: 'Profil Sekolah' },
                                            { id: 'vision', label: 'Visi & Misi' },
                                            { id: 'news', label: 'Berita & Pengumuman' },
                                            { id: 'gallery', label: 'Galeri Dokumentasi' },
                                            { id: 'books', label: 'Perpustakaan Digital' },
                                            { id: 'dormitory', label: 'Informasi Asrama' },
                                            { id: 'legalization', label: 'Permohonan Legalisir' },
                                            { id: 'complaints', label: 'Kotak Pengaduan' },
                                        ].map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() => handleTabClick(tab.id as any)}
                                                className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center justify-between ${
                                                    activeTab === tab.id
                                                        ? 'bg-[#265243] text-white shadow-xs'
                                                        : 'text-[#142921] hover:bg-[#f4f8f3]'
                                                }`}
                                            >
                                                <span>{tab.label}</span>
                                                <ChevronRight className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-[#265243]'}`} />
                                            </button>
                                        ))}
                                    </div>

                                    <div className="pt-2 border-t border-[#c8dac5]">
                                        {auth?.user ? (
                                            <Link
                                                href="/admin/dashboard"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#265243] text-white text-xs font-black shadow-sm hover:bg-[#1a3d31] transition-all"
                                            >
                                                <Building2 className="w-4 h-4 text-white" /> Dashboard Admin
                                            </Link>
                                        ) : (
                                            <Link
                                                href="/login"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#265243] text-white text-xs font-black shadow-sm hover:bg-[#1a3d31] transition-all"
                                            >
                                                <LogIn className="w-4 h-4 text-white" /> Login Admin
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </header>
                </div>

                {/* ── FLASH NOTIFICATION ───────────────────────────────────────────── */}
                {flash?.success && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                        <div className="p-4 rounded-2xl bg-[#265243] text-white text-xs font-bold flex items-center justify-between shadow-lg">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                                <span>{flash.success}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── 2. HERO BANNER SLIDER (ROUNDED CARD WITH WATERMARK TYPOGRAPHY - MATCHING IMAGE 1 REFERENCE) ── */}
                {activeTab === 'home' && (
                    <div className="w-full max-w-[98%] xl:max-w-[96%] mx-auto px-2 sm:px-4 mt-4 sm:mt-6 relative z-30">
                        <div
                            onTouchStart={handleBannerTouchStart}
                            onTouchEnd={handleBannerTouchEnd}
                            className="relative rounded-[2rem] sm:rounded-[2.5rem] bg-[#142921] text-white overflow-hidden shadow-2xl min-h-[620px] sm:min-h-[720px] lg:min-h-[800px] border border-emerald-900/30 flex flex-col justify-between p-6 sm:p-12 lg:p-14"
                        >
                            {/* Background Images */}
                            {banners.length > 0 ? (
                                banners.map((b, idx) => (
                                    <div
                                        key={b.id}
                                        className={`absolute inset-0 transition-opacity duration-700 ${
                                            idx === currentBannerIndex ? 'opacity-100 z-0' : 'opacity-0 z-0'
                                        }`}
                                    >
                                        {b.image ? (
                                            <img
                                                src={b.image}
                                                alt={b.title}
                                                className="w-full h-full object-cover opacity-50"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-[#1a3d31] to-[#265243] opacity-40" />
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-[#1a3d31] to-[#265243] opacity-40 z-0" />
                            )}

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 z-10" />

                            {/* GIANT BACKGROUND WATERMARK TYPOGRAPHY (EXACT MATCH IMAGE 1 - "OXFORD" STYLE) */}
                            <div className={`absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none select-none overflow-hidden z-10 transition-opacity duration-1000 ${showWatermark ? 'opacity-100' : 'opacity-0'}`}>
                                <span className="text-[7rem] sm:text-[13rem] lg:text-[17rem] font-black text-white/10 tracking-widest uppercase whitespace-nowrap leading-none">
                                    {banners[currentBannerIndex]?.title ? banners[currentBannerIndex].title.split(' ')[0] : 'PRESTASI'}
                                </span>
                            </div>

                            {/* Top Row inside Banner Card: Small Tag */}
                            <div className="relative z-20 flex items-center justify-between">
                                <span className="px-4 py-1.5 rounded-full bg-[#0d2a20] text-white text-xs font-extrabold tracking-wider uppercase shadow-xs">
                                    TAHUN AJARAN {new Date().getFullYear()} - {new Date().getFullYear() + 1}
                                </span>
                                <span className="text-xs font-bold text-white/70 uppercase tracking-widest hidden sm:inline-block">
                                    {schoolName}
                                </span>
                            </div>

                            {/* Bottom Row inside Banner Card: Left Info & Right Round Arrow Navigation (< and >) */}
                            <div className="relative z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-8 pt-20 sm:pt-32">
                                {/* Left Info & Subtitle */}
                                <div className="max-w-3xl space-y-4">
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-emerald-400 text-xs sm:text-sm font-black tracking-wider">
                                            0{currentBannerIndex + 1} / 0{banners.length || 1}
                                        </span>
                                        <span className="w-10 h-0.5 bg-emerald-400/60" />
                                    </div>
                                    <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                                        {banners[currentBannerIndex]?.title || schoolName}
                                    </h2>
                                    <p className="text-xs sm:text-base text-emerald-100/90 font-medium leading-relaxed line-clamp-3 max-w-2xl">
                                        {banners[currentBannerIndex]?.subtitle || schoolTagline}
                                    </p>
                                    <div className="pt-3 flex flex-wrap items-center gap-3">
                                        <button
                                            onClick={() => handleTabClick('news')}
                                            className="px-6 py-3 rounded-full bg-white text-[#265243] font-black text-xs sm:text-sm hover:bg-emerald-50 transition-all shadow-lg"
                                        >
                                            Baca Berita Terbaru
                                        </button>
                                        <button
                                            onClick={() => handleTabClick('legalization')}
                                            className="px-6 py-3 rounded-full bg-white/20 backdrop-blur-md text-white font-black text-xs sm:text-sm hover:bg-white/30 border border-white/30 transition-all"
                                        >
                                            Layanan E-Legalisir
                                        </button>
                                    </div>
                                </div>

                                {/* Right Round Arrow Slider Buttons (< and >) */}
                                {banners.length > 1 && (
                                    <div className="hidden sm:flex items-center gap-2.5 self-end sm:self-auto shrink-0">
                                        <button
                                            onClick={() => setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length)}
                                            aria-label="Previous Banner"
                                            className="w-11 h-11 rounded-full bg-white/95 text-[#142921] flex items-center justify-center hover:bg-[#265243] hover:text-white transition-all shadow-lg hover:scale-105 active:scale-95"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setCurrentBannerIndex((prev) => (prev + 1) % banners.length)}
                                            aria-label="Next Banner"
                                            className="w-11 h-11 rounded-full bg-white/95 text-[#142921] flex items-center justify-center hover:bg-[#265243] hover:text-white transition-all shadow-lg hover:scale-105 active:scale-95"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── 3. SECTION: KOTAK PINTASAN CEPAT (WHITE WRAPPER WITH FULL EDGE-TO-EDGE HOVER FILL) ── */}
                {activeTab === 'home' && (
                    <div className="w-full max-w-[98%] xl:max-w-[96%] mx-auto px-2 sm:px-4 mt-4 sm:mt-5 relative z-30">
                        <div className="bg-white border border-[#c8dac5] rounded-3xl shadow-sm overflow-hidden">
                            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[#c8dac5]/50">
                                {[
                                    {
                                        title: 'Layanan E-Legalisir',
                                        count: 'Portal Online',
                                        icon: ShieldCheck,
                                        tab: 'legalization',
                                    },
                                    {
                                        title: 'Galeri Dokumentasi',
                                        count: `${stats.total_galleries} Media`,
                                        icon: ImageIcon,
                                        tab: 'gallery',
                                    },
                                    {
                                        title: 'Perpustakaan Digital',
                                        count: `${stats.total_books} Buku`,
                                        icon: BookOpen,
                                        tab: 'books',
                                    },
                                    {
                                        title: 'Berita Sekolah',
                                        count: `${stats.total_news} Informasi`,
                                        icon: Newspaper,
                                        tab: 'news',
                                    },
                                ].map((st, i) => (
                                    <div
                                        key={i}
                                        onClick={() => handleTabClick(st.tab as any)}
                                        className="p-3.5 sm:p-4.5 bg-transparent hover:bg-[#265243] text-[#142921] hover:text-white transition-all duration-300 cursor-pointer flex items-center justify-between gap-2.5 group"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#f4f8f3] group-hover:bg-white/20 text-[#265243] group-hover:text-white border border-[#c8dac5] group-hover:border-transparent flex items-center justify-center shadow-xs group-hover:scale-105 transition-all shrink-0">
                                                <st.icon className="w-4 h-4" />
                                            </div>
                                            <h4 className="text-xs sm:text-sm font-black text-[#142921] group-hover:text-white transition-colors truncate">
                                                {st.title}
                                            </h4>
                                        </div>

                                        <span className="hidden sm:inline-block text-[10px] sm:text-[11px] font-black px-2.5 py-1 rounded-full bg-[#f4f8f3] group-hover:bg-white/20 text-[#265243] group-hover:text-emerald-100 border border-[#c8dac5] group-hover:border-transparent transition-all shrink-0">
                                            {st.count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── MAIN CONTENT CONTAINER ───────────────────────────────────────── */}
                <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-16 space-y-12 sm:space-y-18 w-full">

                    {/* ========================================================================= */}
                    {/* TAB 1: BERANDA / HOME                                                     */}
                    {/* ========================================================================= */}
                    {activeTab === 'home' && (
                        <div className="space-y-12 sm:space-y-18 lg:space-y-20">
                            {/* SECTION: SAMBUTAN KEPALA SEKOLAH (EXTENDED CARD WIDTH HORIZONTALLY & VERTICALLY FOR DESKTOP) */}
                            <section className="space-y-10 sm:space-y-14 pb-4 lg:pb-8">
                                <div className="mt-6 sm:mt-10 pt-16 sm:pt-28 lg:pt-32 relative -mx-6 sm:-mx-12 lg:-mx-20">
                                    <div className="relative rounded-[2.5rem] sm:rounded-[3.5rem] bg-[#064e3b] text-white shadow-2xl p-8 sm:p-14 lg:p-20 space-y-16 sm:space-y-20 min-h-[580px] lg:min-h-[680px] flex flex-col justify-between">
                                        
                                        {/* MAIN GRID: KATA SAMBUTAN (LEFT 7 COLS) & FOTO RECTANGLE SUPER ROUNDED (RIGHT 5 COLS) */}
                                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                                            
                                            {/* KOLOM KIRI: KATA SAMBUTAN (SOLID CLEAN TYPOGRAPHY) */}
                                            <div className="lg:col-span-7 space-y-8 relative">
                                                {/* Low-opacity decorative quotation mark */}
                                                <div className="absolute -top-10 -left-6 text-[11rem] font-black text-[#10b981]/15 select-none pointer-events-none leading-none z-0">
                                                    “
                                                </div>

                                                <div className="space-y-2 relative z-10">
                                                    <h3 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white font-sans tracking-tight leading-tight">
                                                        Selamat Datang di {schoolName}
                                                    </h3>
                                                </div>

                                                {/* Editorial Paragraphs */}
                                                <div className="space-y-4 text-xs sm:text-sm lg:text-base font-normal text-slate-100 leading-relaxed relative z-10 max-w-3xl">
                                                    {settings.principal_bio ? (
                                                        <div className="whitespace-pre-line space-y-3 font-medium">
                                                            {settings.principal_bio}
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <p className="italic font-bold text-white text-sm sm:text-base lg:text-lg">
                                                                Assalamu'alaikum Warahmatullahi Wabarakatuh,
                                                            </p>
                                                            <p>
                                                                Selamat datang di portal resmi {settings.school_name || 'MAN Tanjungpinang'}. Sebagai lembaga pendidikan unggulan, kami berkomitmen menyelenggarakan pembelajaran bermutu tinggi yang melahirkan generasi cerdas, berkarakter Pancasila, serta tangguh menghadapi tantangan global.
                                                            </p>
                                                            <p className="italic font-bold text-white pt-1">
                                                                Wassalamu'alaikum Warahmatullahi Wabarakatuh.
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* KOLOM KANAN: FOTO RECTANGLE SUPER ROUNDED (FLOAT NAME & TITLE TO BOTTOM-LEFT OF PHOTO) */}
                                            <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end mt-4 sm:-mt-36 lg:-mt-52 pt-4 lg:pt-0 z-20">
                                                {/* Super Rounded Container with Soft Yellow Tone (#fef08a) */}
                                                <div className="relative z-10 w-72 h-[380px] sm:w-88 sm:h-[440px] lg:w-[400px] lg:h-[500px] rounded-[6rem] bg-[#fef08a] shadow-2xl overflow-hidden flex items-center justify-center shrink-0">
                                                    {settings.principal_photo_url ? (
                                                        <img
                                                            src={settings.principal_photo_url}
                                                            alt="Foto Kepala Sekolah"
                                                            className="w-full h-full object-cover object-top rounded-[6rem]"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-[#fef08a] flex flex-col items-center justify-center text-[#022c22] p-8 text-center">
                                                            <User className="w-24 h-24 text-[#064e3b] mb-2" />
                                                            <span className="text-xs font-bold text-[#064e3b]">Foto Kepala Sekolah</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Floating Overlay Card (Principal Name & Title - Floated at bottom-left of photo) */}
                                                <div className="absolute -bottom-4 sm:-bottom-6 lg:-bottom-8 -left-2 sm:left-2 lg:-left-8 z-30 bg-[#0b2b22] border border-white/15 p-4 sm:p-5 rounded-2xl shadow-2xl max-w-[220px] sm:max-w-[250px] space-y-1.5 transform hover:scale-105 transition-all">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-xl bg-[#059669]/40 border border-[#10b981]/40 flex items-center justify-center text-[#10b981] shrink-0">
                                                            <GraduationCap className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-[10px] sm:text-xs font-bold text-[#10b981] uppercase tracking-wider">
                                                            {settings.principal_title || 'Kepala Sekolah'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm sm:text-base font-extrabold text-white font-sans leading-snug">
                                                            {settings.principal_name || 'Ulfah Ismiati, S.Pd, M.M'}
                                                        </h4>
                                                    </div>
                                                    <p className="text-[10px] sm:text-xs text-slate-300 font-medium leading-snug pt-1 border-t border-white/10">
                                                        Membangun Generasi Pendidikan Berkualitas
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* SECTION STATISTIK BAWAH (CLEAN WITHOUT DIVIDER LINE) */}
                                        <div className="relative z-10 pt-8 sm:pt-14 border-t border-white/10">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                                                {/* Item 1 */}
                                                <div className="flex flex-col items-start space-y-1">
                                                    <h4 className="text-3xl sm:text-5xl font-extrabold font-sans text-white tracking-tight">
                                                        <AnimatedCounter value={settings.total_students || '850+'} />
                                                    </h4>
                                                    <p className="text-xs sm:text-sm font-bold tracking-wider text-[#93c5fd]/75 uppercase">
                                                        SISWA AKTIF
                                                    </p>
                                                </div>

                                                {/* Item 2 */}
                                                <div className="flex flex-col items-start space-y-1">
                                                    <h4 className="text-3xl sm:text-5xl font-extrabold font-sans text-white tracking-tight">
                                                        <AnimatedCounter value={settings.total_teachers || '54+'} />
                                                    </h4>
                                                    <p className="text-xs sm:text-sm font-bold tracking-wider text-[#93c5fd]/75 uppercase">
                                                        GURU & STAF
                                                    </p>
                                                </div>

                                                {/* Item 3 */}
                                                <div className="flex flex-col items-start space-y-1">
                                                    <h4 className="text-3xl sm:text-5xl font-extrabold font-sans text-white tracking-tight">
                                                        <AnimatedCounter value={settings.total_classrooms || '24'} />
                                                    </h4>
                                                    <p className="text-xs sm:text-sm font-bold tracking-wider text-[#93c5fd]/75 uppercase">
                                                        RUANG KELAS
                                                    </p>
                                                </div>

                                                {/* Item 4 */}
                                                <div className="flex flex-col items-start space-y-1">
                                                    <h4 className="text-3xl sm:text-5xl font-extrabold font-sans text-orange-400 tracking-tight">
                                                        <AnimatedCounter value={settings.accreditation || 'A (Unggul)'} />
                                                    </h4>
                                                    <p className="text-xs sm:text-sm font-bold tracking-wider text-[#93c5fd]/75 uppercase">
                                                        AKREDITASI
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* SECTION: GALERI DOKUMENTASI */}
                            <section className="space-y-10 pb-6 lg:pb-12 mt-8 sm:mt-12 pt-3 sm:pt-5">
                                {/* CENTERED TITLE & SUBTITLE ABOVE GALERI (AS REQUESTED) */}
                                <div className="text-center space-y-2 max-w-2xl mx-auto">
                                    <p className="text-xs sm:text-sm font-extrabold text-[#527365] uppercase tracking-widest italic">
                                        Dokumentasi Unggulan
                                    </p>
                                    <h3 className="text-3xl sm:text-5xl font-black text-[#142921] tracking-tight leading-tight font-sans">
                                        Fasilitas & Layanan Pendidikan Terlengkap
                                    </h3>
                                </div>

                                {featuredGalleries.length > 0 ? (
                                    <div className="space-y-6 px-3 sm:px-0 sm:-mx-12 lg:-mx-20">
                                        {/* HERO SHOWCASE CARD WITH GIANT WATERMARK TYPOGRAPHY */}
                                        <div
                                            onClick={() => setSelectedGallery(featuredGalleries[activeGalleryIndex % (featuredGalleries.length || 1)])}
                                            onTouchStart={handleGalleryTouchStart}
                                            onTouchEnd={handleGalleryTouchEnd}
                                            className="relative rounded-[2.5rem] bg-[#142921] text-white overflow-hidden shadow-xl min-h-[420px] sm:min-h-[540px] lg:min-h-[620px] cursor-pointer group flex flex-col justify-between p-6 sm:p-10 lg:p-12"
                                        >
                                            {/* Active Gallery Image */}
                                            {featuredGalleries[activeGalleryIndex % (featuredGalleries.length || 1)]?.display_image ? (
                                                <img
                                                    src={featuredGalleries[activeGalleryIndex % (featuredGalleries.length || 1)].display_image!}
                                                    alt={featuredGalleries[activeGalleryIndex % (featuredGalleries.length || 1)].title}
                                                    className="absolute inset-0 w-full h-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-[#1a3d31] to-[#265243]" />
                                            )}

                                            {/* Subtle Gradient Overlay for Text Legibility */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/20 z-10" />

                                            {/* Top Row inside Showcase Card: Clean Pill Badges */}
                                            <div className="relative z-20 flex items-center justify-between">
                                                <span className="px-4 py-1.5 rounded-full bg-[#265243] text-white text-xs font-black uppercase tracking-wider shadow-md">
                                                    DOKUMENTASI VISUAL
                                                </span>
                                                <span className="px-3.5 py-1 rounded-full bg-[#142921] text-emerald-100 text-[11px] font-extrabold uppercase tracking-wider border border-emerald-700/50">
                                                    {featuredGalleries[activeGalleryIndex % (featuredGalleries.length || 1)]?.category || 'FASILITAS'}
                                                </span>
                                            </div>

                                            {/* Bottom Row inside Showcase Card */}
                                            <div className="relative z-20 pt-20 space-y-4">
                                                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                                                    <div className="space-y-2 max-w-2xl">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-3xl sm:text-4xl font-black text-white/90 tracking-tighter">
                                                                0{(activeGalleryIndex % (featuredGalleries.length || 1)) + 1}<span className="text-emerald-400/80 text-xl">/0{featuredGalleries.length}</span>
                                                            </span>
                                                            <span className="px-3 py-1 rounded-full bg-[#265243] text-emerald-100 text-xs font-extrabold uppercase shadow-xs">
                                                                {featuredGalleries[activeGalleryIndex % (featuredGalleries.length || 1)]?.type === 'youtube' ? 'Video' : 'Foto'}
                                                            </span>
                                                        </div>
                                                        <h5 className="text-xl sm:text-3xl font-black text-white group-hover:text-emerald-300 transition-colors">
                                                            {featuredGalleries[activeGalleryIndex % (featuredGalleries.length || 1)]?.title}
                                                        </h5>
                                                        {featuredGalleries[activeGalleryIndex % (featuredGalleries.length || 1)]?.description && (
                                                            <p className="text-xs sm:text-sm text-slate-200 font-medium line-clamp-2 leading-relaxed">
                                                                {featuredGalleries[activeGalleryIndex % (featuredGalleries.length || 1)].description}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="hidden sm:flex items-center gap-2 shrink-0">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveGalleryIndex((prev) => (prev - 1 + featuredGalleries.length) % featuredGalleries.length);
                                                            }}
                                                            aria-label="Previous Gallery Item"
                                                            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center backdrop-blur-md transition-all border border-white/30 shadow-md"
                                                        >
                                                            <ChevronLeft className="w-6 h-6" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveGalleryIndex((prev) => (prev + 1) % featuredGalleries.length);
                                                            }}
                                                            aria-label="Next Gallery Item"
                                                            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center backdrop-blur-md transition-all border border-white/30 shadow-md"
                                                        >
                                                            <ChevronRight className="w-6 h-6" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Slide Progress Indicator Dots / Lines under photo */}
                                        {featuredGalleries.length > 1 && (
                                            <div className="flex items-center justify-center gap-2 pt-2 pb-1">
                                                {featuredGalleries.map((_, idx) => {
                                                    const isActive = idx === (activeGalleryIndex % featuredGalleries.length);
                                                    return (
                                                        <button
                                                            key={idx}
                                                            onClick={() => setActiveGalleryIndex(idx)}
                                                            aria-label={`Go to slide ${idx + 1}`}
                                                            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                                                                isActive
                                                                    ? 'w-8 bg-[#265243] shadow-xs'
                                                                    : 'w-2 bg-[#c8dac5] hover:bg-[#527365]'
                                                            }`}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Mobile "Lihat Semua Galeri" Button (Rendered directly under slide indicators) */}
                                        <div className="sm:hidden flex justify-center pt-1">
                                            <button
                                                onClick={() => handleTabClick('gallery')}
                                                className="inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-full bg-[#f4f8f3] hover:bg-[#265243] text-[#265243] hover:text-white text-xs font-extrabold border border-[#c8dac5] transition-all shadow-xs cursor-pointer w-full text-center"
                                            >
                                                <span>Lihat Semua Galeri</span>
                                            </button>
                                        </div>

                                        {/* Interactive Thumbnail Carousel (Hidden on Mobile, Visible on Desktop) */}
                                        <div className="hidden sm:grid grid-cols-3 lg:grid-cols-6 gap-4 pt-2">
                                            {featuredGalleries.map((item, idx) => (
                                                <div
                                                    key={item.id}
                                                    onClick={() => setActiveGalleryIndex(idx)}
                                                    className={`relative rounded-2xl overflow-hidden border cursor-pointer transition-all h-28 lg:h-32 group ${
                                                        idx === (activeGalleryIndex % (featuredGalleries.length || 1))
                                                            ? 'ring-4 ring-[#265243] border-[#265243] scale-[1.02] shadow-lg'
                                                            : 'border-[#c8dac5] hover:border-[#265243] opacity-80 hover:opacity-100'
                                                    }`}
                                                >
                                                    {item.display_image ? (
                                                        <img src={item.display_image} alt={item.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-[#f4f8f3] flex items-center justify-center text-[#265243]">
                                                            <ImageIcon className="w-6 h-6" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-2.5 flex items-end">
                                                        <p className="text-[11px] font-bold text-white truncate">{item.title}</p>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* 6th Slot Desktop Button */}
                                            <div className="col-span-1 h-28 lg:h-32 flex items-center justify-center">
                                                <button
                                                    onClick={() => handleTabClick('gallery')}
                                                    className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full bg-[#f4f8f3] hover:bg-[#265243] text-[#265243] hover:text-white text-xs font-extrabold border border-[#c8dac5] transition-all shadow-xs group whitespace-nowrap cursor-pointer"
                                                >
                                                    <span>Lihat Semua Galeri</span>
                                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-12 text-center rounded-2xl border border-[#c8dac5] bg-white">
                                        <ImageIcon className="w-12 h-12 text-[#265243] mx-auto mb-3" />
                                        <p className="text-sm font-bold text-[#142921]">Belum ada foto atau video dalam galeri.</p>
                                    </div>
                                )}
                            </section>

                            {/* SECTION: BERITA TERBARU (SHOW 6 ITEMS) */}
                            <section className="space-y-8 px-3 sm:px-0 sm:-mx-12 lg:-mx-20 mt-6 sm:mt-10 pt-2 sm:pt-4">
                                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-[#527365] uppercase tracking-widest">
                                            Informasi & Pengumuman
                                        </p>
                                        <h3 className="text-3xl sm:text-5xl font-black text-[#142921] tracking-tight leading-tight font-sans">
                                            Kabar & Prestasi Terbaru Sekolah
                                        </h3>
                                    </div>
                                    {/* Desktop Only: Top-Right Button */}
                                    <button
                                        onClick={() => handleTabClick('news')}
                                        className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#f4f8f3] hover:bg-[#265243] text-[#265243] hover:text-white text-xs font-extrabold border border-[#c8dac5] transition-all shadow-xs group shrink-0 cursor-pointer"
                                    >
                                        <span>Lihat Semua Berita</span>
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                </div>

                                {news.length === 0 ? (
                                    <div className="p-12 text-center rounded-2xl border border-[#c8dac5] bg-white">
                                        <Newspaper className="w-12 h-12 text-[#265243] mx-auto mb-3" />
                                        <p className="text-sm font-bold text-[#142921]">Belum ada artikel berita yang dipublikasikan.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {news.slice(0, 6).map((item, idx) => (
                                                <Link
                                                    key={item.id}
                                                    href={`/news/${item.slug}`}
                                                    className="relative bg-white rounded-[2.25rem] overflow-hidden flex flex-col justify-between group transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1"
                                                >
                                                    {/* Top Badge */}
                                                    <div className="absolute top-4 left-4 z-10">
                                                        <span className="bg-[#f59e0b] text-white text-[10px] sm:text-[11px] font-extrabold px-2.5 py-1 rounded-md shadow-md uppercase tracking-wider">
                                                            {idx === 0 ? 'BARU' : 'BERITA'}
                                                        </span>
                                                    </div>

                                                    {/* Mentok Image Container */}
                                                    <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100">
                                                        {item.thumbnail ? (
                                                            <img
                                                                src={item.thumbnail}
                                                                alt={item.title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-[#e8efe5] flex items-center justify-center text-[#265243]">
                                                                <ImageIcon className="w-10 h-10" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Content Body */}
                                                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                                                        <div>
                                                            {/* Centered Title */}
                                                            <h4 className="text-center font-extrabold text-[#142921] text-base sm:text-lg leading-snug group-hover:text-[#265243] transition-colors line-clamp-2 mb-2 font-sans px-1">
                                                                {item.title}
                                                            </h4>

                                                            {/* Centered Views Count */}
                                                            <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-[#527365] my-1.5">
                                                                <Eye className="w-3.5 h-3.5 text-[#265243]" />
                                                                <span>{item.views_count || 0} Dilihat</span>
                                                            </div>

                                                            {/* Centered Metadata */}
                                                            <p className="text-center text-[11px] sm:text-xs font-bold text-[#527365] flex items-center justify-center gap-1.5">
                                                                <Calendar className="w-3.5 h-3.5 text-[#265243]" />
                                                                <span>{item.published_at || 'Terbaru'}</span>
                                                                <span>•</span>
                                                                <User className="w-3.5 h-3.5 text-[#265243]" />
                                                                <span>{item.author}</span>
                                                            </p>
                                                        </div>

                                                        {/* Bottom Action Button */}
                                                        <div className="pt-2">
                                                            <span className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-full bg-white text-[#265243] group-hover:bg-[#265243] group-hover:text-white border border-[#c8dac5] text-xs font-black transition-all shadow-2xs cursor-pointer">
                                                                <span>Baca Selengkapnya</span>
                                                                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>

                                        {/* Mobile Only: Bottom "Lihat Semua Berita" Button */}
                                        <div className="sm:hidden flex justify-center pt-2">
                                            <button
                                                onClick={() => handleTabClick('news')}
                                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#f4f8f3] hover:bg-[#265243] text-[#265243] hover:text-white text-xs font-extrabold border border-[#c8dac5] transition-all shadow-xs group cursor-pointer w-full"
                                            >
                                                <span>Lihat Semua Berita</span>
                                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </section>

                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB: PROFIL SEKOLAH & VISI MISI (HEADER VIDEO BANNER - REF IMAGE 2)        */}
                    {/* ========================================================================= */}
                    {(activeTab === 'profile' || activeTab === 'vision') && (
                        <div className="relative -mx-6 sm:-mx-12 lg:-mx-20 space-y-8 animate-in fade-in duration-300">
                            {/* VIDEO PROFIL HEADER */}
                            {/* VIDEO PROFIL HEADER (NO BORDER) */}
                            {(settings.principal_media_type ?? 'video') === 'photo' ? (
                                <div className="relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-xl w-full aspect-video max-h-[500px] flex items-center justify-center">
                                    <img
                                        src={settings.principal_media_photo_url || settings.principal_photo_url || '/images/school-banner.jpg'}
                                        alt="Foto Media Profil Sekolah"
                                        className="absolute inset-0 w-full h-full object-cover opacity-85"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/images/school-banner.jpg';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/40" />
                                    <div className="relative z-10 flex flex-col items-center justify-center gap-3 text-white text-center p-6 sm:p-10 max-w-3xl mx-auto">
                                        <span className="px-4 py-1.5 rounded-full bg-[#265243] text-white text-xs font-black uppercase tracking-wider shadow-md">
                                            PROFIL SEKOLAH
                                        </span>
                                        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-md">
                                            {schoolName}
                                        </h2>
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#142921] text-emerald-300 text-xs font-bold border border-emerald-500/30 mt-1 shadow-sm">
                                            <span>PROFIL SEKOLAH</span>
                                            <span>•</span>
                                            <span className="text-white font-extrabold">
                                                {profileSubTab === 'vision' ? 'Visi & Misi' : profileSubTab === 'profile' ? 'Profil Sekolah' : 'Sejarah Singkat'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : isPlayingInlineVideo ? (
                                <div className="relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-xl w-full aspect-video max-h-[500px] flex items-center justify-center">
                                    <iframe
                                        src={`${getYouTubeEmbedUrl(settings.principal_video_url || 'https://youtu.be/swh2GC1XqyE?si=zDzgUxvpB2XObqte')}?autoplay=1&rel=0`}
                                        title="Video Profil Sekolah"
                                        className="w-full h-full border-0 rounded-3xl sm:rounded-[2.5rem]"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                    <button
                                        onClick={() => setIsPlayingInlineVideo(false)}
                                        className="absolute top-4 right-4 z-10 px-3.5 py-1.5 rounded-full bg-black/70 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg"
                                    >
                                        <X className="w-4 h-4" />
                                        <span>Tutup Video</span>
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => setIsPlayingInlineVideo(true)}
                                    className="relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden bg-slate-900 group cursor-pointer shadow-xl w-full aspect-video max-h-[500px] flex items-center justify-center"
                                >
                                    {/* Background Image Cover */}
                                    <img
                                        src={getYouTubeThumbnail(settings.principal_video_url)}
                                        alt="Cover Video Profil Sekolah"
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${getYouTubeId(settings.principal_video_url)}/hqdefault.jpg`;
                                        }}
                                    />

                                    {/* Dark Gradient Overlay */}
                                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />

                                    {/* Center Play Button & Text Content Overlay */}
                                    <div className="relative z-10 flex flex-col items-center justify-center gap-3 text-white text-center p-6 sm:p-10 max-w-3xl mx-auto">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#064e3b] text-white flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-[#047857] transition-all my-1">
                                            <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white text-white translate-x-0.5" />
                                        </div>

                                        <span className="px-4 py-1.5 rounded-full bg-[#265243] text-white text-xs font-black uppercase tracking-wider shadow-md">
                                            PUTAR VIDEO PROFIL SEKOLAH
                                        </span>

                                        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-md">
                                            {schoolName.toUpperCase().includes('TANJUNG') ? schoolName.replace(/TANJUNG\s+PINANG/gi, 'TANJUNGPINANG') : `${schoolName} TANJUNGPINANG`}
                                        </h2>
                                    </div>
                                </div>
                            )}

                            {/* PINTASAN NAVIGASI PROFIL (SOLID WHITE DEFAULT -> SOLID GREEN ON SELECT - COMPLETELY BORDERLESS) */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                                {[
                                    { id: 'profile', label: 'Profil Sekolah' },
                                    { id: 'vision', label: 'Visi & Misi' },
                                    { id: 'history', label: 'Sejarah Singkat' },
                                ].map((sub) => {
                                    const isActive = profileSubTab === sub.id;
                                    return (
                                        <button
                                            key={sub.id}
                                            onClick={() => {
                                                setProfileSubTab(sub.id as any);
                                                if (sub.id === 'vision') setActiveTab('vision');
                                                else setActiveTab('profile');
                                            }}
                                            className={`relative p-5 sm:p-6 rounded-3xl text-sm sm:text-base font-extrabold transition-all duration-300 flex items-center justify-center cursor-pointer shadow-md border-0 border-none outline-none ${
                                                isActive
                                                    ? 'bg-[#265243] text-white -translate-y-2 scale-[1.02] shadow-xl'
                                                    : 'bg-white text-[#142921] hover:bg-slate-50 hover:shadow-xl hover:-translate-y-1'
                                            }`}
                                        >
                                            <span className="tracking-wide">{sub.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* SUBTAB CONTENT CONTAINER (TRANSPARENT BACKGROUND) */}
                            <div className="bg-transparent space-y-8 min-h-[350px]">
                                {/* SUB-TAB 1: PROFIL SEKOLAH */}
                                {profileSubTab === 'profile' && (
                                    <div className="space-y-8 animate-in fade-in duration-300">
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                                            
                                            {/* LEFT COLUMN: SCHOOL LOGO */}
                                            <div className="lg:col-span-5 relative space-y-4">
                                                {/* Main Image Container */}
                                                <div className="relative z-10 mx-auto max-w-md lg:max-w-none">
                                                    <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-[#142921] via-[#1b382d] to-[#265243] shadow-xl flex items-center justify-center p-8 group">
                                                        {/* Decorative background glow */}
                                                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent opacity-60" />
                                                        
                                                        {logoUrl ? (
                                                            <img
                                                                src={logoUrl}
                                                                alt={`Logo ${schoolName}`}
                                                                className="relative z-10 max-h-48 sm:max-h-56 object-contain filter drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                        ) : (
                                                            <div className="relative z-10 w-28 h-28 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-xl">
                                                                <Building2 className="w-14 h-14 text-emerald-300" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* RIGHT COLUMN: EDITORIAL PROFILE TEXT */}
                                            <div className="lg:col-span-7 space-y-6">
                                                <div className="space-y-2 pb-3 border-b border-[#e2ebd9]">
                                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                                        <span className="px-3.5 py-1 rounded-full bg-[#f59e0b] text-white text-[10px] sm:text-[11px] font-black tracking-widest uppercase shadow-xs">
                                                            PROFIL SEKOLAH
                                                        </span>
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-200">
                                                            <Award className="w-4 h-4 text-emerald-700" /> Akreditasi {settings.accreditation || 'A (Unggul)'}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-2xl sm:text-4xl font-black text-[#142921] tracking-tight leading-tight font-sans">
                                                        Profil &amp; Identitas Sekolah
                                                    </h3>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                                    <span className="px-3 py-1 rounded-full bg-[#265243] text-white text-xs font-extrabold shadow-xs">Status: {settings.school_status || 'Negeri'}</span>
                                                    <span className="px-3 py-1 rounded-full bg-[#f4f8f3] border border-[#b8ceb0] text-[#142921] text-xs font-extrabold">NPSN: {settings.school_npsn || '12345678'}</span>
                                                </div>

                                                {/* Editorial Paragraphs */}
                                                <div className="space-y-4 text-xs sm:text-sm text-[#2e5445] leading-relaxed font-medium">
                                                    <p className="text-sm sm:text-base font-bold text-[#142921] leading-snug">
                                                        {schoolName} adalah institusi pendidikan menengah tingkat atas terkemuka yang berdedikasi tinggi dalam membentuk generasi unggul, berakhlak mulia, dan berdaya saing global.
                                                    </p>
                                                    <p>
                                                        {schoolDesc || 'Sekolah ini menyelenggarakan pendidikan terpadu yang memadukan kurikulum nasional modern dengan pembinaan karakter kebangsaan dan keagamaan. Berdiri dengan sarana dan prasarana terlengkap, sekolah senantiasa menciptakan ekosistem belajar yang kondusif, inovatif, dan berwawasan lingkungan.'}
                                                    </p>
                                                    <p>
                                                        Melalui berbagai program unggulan akademik, ekstrakurikuler, pembinaan tahfidz, serta digitalisasi perpustakaan dan portal e-legalisir alumni, kami berkomitmen mencetak lulusan berkepribadian mandiri yang siap melanjutkan ke perguruan tinggi terbaik nasional maupun internasional.
                                                    </p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                )}

                                {/* SUB-TAB 2: VISI & MISI */}
                                {profileSubTab === 'vision' && (
                                    <div className="space-y-8 animate-in fade-in duration-300">
                                        <div className="space-y-2 pb-3 border-b border-[#e2ebd9]">
                                            <h3 className="text-2xl sm:text-3xl font-black text-[#142921] tracking-tight">
                                                Visi &amp; Misi Sekolah
                                            </h3>
                                            <div className="w-16 h-1 bg-[#f59e0b] rounded-full" />
                                        </div>

                                        {/* VISI CARD */}
                                        <div className="relative bg-[#142921] text-white rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden border border-emerald-900/50 group">
                                            {/* Background glowing shapes */}
                                            <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#f59e0b]/10 rounded-full blur-2xl group-hover:bg-[#f59e0b]/20 transition-all duration-500" />
                                            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl" />

                                            <div className="relative z-10 space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-[#f59e0b] text-[10px] sm:text-xs font-black tracking-widest uppercase">
                                                            VISI SEKOLAH
                                                        </span>
                                                        <h4 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                                                            {schoolName}
                                                        </h4>
                                                    </div>
                                                </div>

                                                <div className="pt-2">
                                                    <p className="text-base sm:text-xl font-bold italic text-emerald-50 leading-relaxed tracking-wide">
                                                        "{settings.vision || settings.visi || 'TERWUJUDNYA MADRASAH ALIYAH NEGERI TANJUNGPINANG YANG BERKUALITAS, AGAMIS, UNGGUL DAN BERWAWASAN LINGKUNGAN'}"
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* MISI CARDS GRID */}
                                        <div className="space-y-6 pt-2">
                                            <div className="flex items-center justify-between flex-wrap gap-2">
                                                <div>
                                                    <h4 className="text-lg sm:text-xl font-black text-[#142921]">
                                                        MISI SEKOLAH
                                                    </h4>
                                                    <p className="text-xs text-[#527365] font-medium">{missionItems.length} Pilar Utama Pelaksanaan Pendidikan</p>
                                                </div>
                                                <span className="px-3 py-1 rounded-full bg-[#f4f8f3] border border-[#c8dac5] text-[#265243] text-xs font-black">
                                                    {missionItems.length} Poin Misi Utama
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {missionItems.map((item, idx) => {
                                                    const isFullWidth = idx === missionItems.length - 1 && missionItems.length % 2 !== 0;
                                                    return (
                                                        <div
                                                            key={idx}
                                                            className={`group relative bg-white border border-[#c8dac5] hover:border-[#265243] rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-between gap-4 min-h-[90px] ${isFullWidth ? 'md:col-span-2' : ''}`}
                                                        >
                                                            {/* Misi Text Content (Centered Layout) */}
                                                            <div className="flex-1 flex items-center">
                                                                <p className="text-sm sm:text-base text-[#142921] font-extrabold leading-relaxed text-center sm:text-left w-full">
                                                                    {item.desc}
                                                                </p>
                                                            </div>

                                                            {/* Number Badge (Vertically Centered on Right Side) */}
                                                            <div className="shrink-0 flex items-center justify-center pl-4 border-l border-[#e2ebd9] self-stretch">
                                                                <span className="text-2xl sm:text-3xl font-black text-[#c8dac5] group-hover:text-[#265243] transition-colors font-mono tracking-tighter">
                                                                    {item.num}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* SUB-TAB 3: SEJARAH SINGKAT */}
                                {profileSubTab === 'history' && (
                                    <div className="space-y-8 animate-in fade-in duration-300">
                                        <div className="space-y-2 pb-3 border-b border-[#e2ebd9]">
                                            <h3 className="text-2xl sm:text-3xl font-black text-[#142921] tracking-tight">
                                                Sejarah Singkat Sekolah
                                            </h3>
                                            <div className="w-16 h-1 bg-[#f59e0b] rounded-full" />
                                        </div>

                                        {milestones.length === 0 ? (
                                            /* Fallback static text jika belum ada milestone */
                                            <div className="prose prose-sm text-[#2e5445] space-y-4 leading-relaxed font-medium">
                                                <p>
                                                    {schoolName} didirikan sebagai institusi pendidikan menengah tingkat atas yang berdedikasi melayani masyarakat. Berdiri di lokasi strategis, sekolah ini telah melahirkan ribuan alumni yang sukses di berbagai bidang akademis, pemerintahan, industri, dan kewirausahaan.
                                                </p>
                                                <p>
                                                    Seiring perjalanan waktu, sekolah terus melakukan transformasi digital dan modernisasi kurikulum untuk menjawab tantangan perkembangan sains, teknologi, dan globalisasi, tanpa mengesampingkan nilai-nilai karakter berbudaya bangsa.
                                                </p>
                                            </div>
                                        ) : (
                                            /* DYNAMIC MILESTONE TIMELINE */
                                            <div className="relative">
                                                {/* Vertical center line */}
                                                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#142921] via-[#265243] to-[#9db588] -translate-x-1/2 hidden sm:block" />

                                                <div className="space-y-8 sm:space-y-0">
                                                    {milestones.map((milestone, idx) => {
                                                        const isLeft = idx % 2 === 0;
                                                        return (
                                                            <div
                                                                key={milestone.id}
                                                                className={`relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0 sm:mb-12 ${isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
                                                            >
                                                                {/* Card */}
                                                                <div className={`w-full sm:w-[calc(50%-2.5rem)] ${isLeft ? 'sm:pr-6' : 'sm:pl-6'}`}>
                                                                    <div className="bg-white border border-[#c8dac5] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
                                                                        <div className="flex items-start gap-3">
                                                                            <div className="bg-[#142921] text-white text-xs font-black px-3 py-1.5 rounded-lg shrink-0 shadow-sm group-hover:bg-[#265243] transition-colors">
                                                                                {milestone.year}
                                                                            </div>
                                                                            <div>
                                                                                <p className="font-extrabold text-[#142921] text-sm leading-snug">{milestone.title}</p>
                                                                                {milestone.description && (
                                                                                    <p className="text-xs text-[#527365] font-medium mt-1 leading-relaxed">{milestone.description}</p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Center dot (desktop only) */}
                                                                <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 z-10">
                                                                    <div className="w-5 h-5 rounded-full bg-[#f59e0b] border-4 border-white shadow-md" />
                                                                </div>

                                                                {/* Spacer for opposite side */}
                                                                <div className="hidden sm:block w-[calc(50%-2.5rem)]" />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* MOTTO SEKOLAH QUOTE BANNER (SOLID GOLD BADGE + CLEAN FONT) */}
                            <div className="relative rounded-3xl bg-[#142921] border border-emerald-900/40 p-8 sm:p-12 text-center overflow-hidden shadow-xl text-white space-y-4">
                                <div className="flex justify-center">
                                    <span className="px-4 py-1.5 rounded-full bg-[#f59e0b] text-white text-xs font-black uppercase tracking-widest shadow-md inline-block">
                                        MOTTO SEKOLAH
                                    </span>
                                </div>
                                <blockquote className="max-w-4xl mx-auto text-2xl sm:text-4xl font-extrabold text-white leading-relaxed italic drop-shadow-md">
                                    "{schoolTagline || 'Unggul Dalam Prestasi, Berkarakter, dan Berwawasan Lingkungan'}"
                                </blockquote>
                                <div className="w-16 h-1 bg-[#f59e0b] mx-auto rounded-full my-2" />
                                <p className="text-xs sm:text-sm font-bold text-emerald-300 uppercase tracking-widest">
                                    — {schoolName} —
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB 2: BERITA TERBARU (FULL PAGE)                                          */}
                    {/* ========================================================================= */}
                    {activeTab === 'news' && (
                        <div className="space-y-6">
                            {/* HERO HEADER BANNER CARD FOR NEWS */}
                            <div className="relative rounded-[2.5rem] bg-[#142921] text-white p-8 sm:p-12 overflow-hidden shadow-xl border border-emerald-900/30 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="space-y-2 relative z-10 max-w-2xl">
                                    <div className="flex items-center gap-2">
                                        <span className="px-3.5 py-1 rounded-full bg-[#f59e0b] text-white text-[10px] sm:text-[11px] font-black tracking-widest uppercase shadow-xs">
                                            Portal Publikasi
                                        </span>
                                    </div>
                                    <h3 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight font-sans drop-shadow-md">
                                        Daftar Artikel & Pengumuman Sekolah
                                    </h3>
                                    <p className="text-xs sm:text-sm text-emerald-100/90 font-medium leading-relaxed">
                                        Dapatkan berita resmi, liputan kegiatan, pengumuman sekolah, serta pencapaian prestasi terbaru dari civitas akademika.
                                    </p>
                                </div>
                            </div>

                            {news.length === 0 ? (
                                <div style={{ backgroundColor: '#ffffff', borderColor: '#c8dac5' }} className="p-12 text-center rounded-2xl border">
                                    <Newspaper className="w-12 h-12 text-[#265243] mx-auto mb-3" />
                                    <p className="text-sm font-bold text-[#142921]">Belum ada artikel berita yang dipublikasikan.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {paginatedNews.map((item, idx) => (
                                            <Link
                                                key={item.id}
                                                href={`/news/${item.slug}`}
                                                className="relative bg-white rounded-[2.25rem] overflow-hidden flex flex-col justify-between group transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1"
                                            >
                                                {/* Top Badge */}
                                                <div className="absolute top-4 left-4 z-10">
                                                    <span className="bg-[#f59e0b] text-white text-[10px] sm:text-[11px] font-extrabold px-2.5 py-1 rounded-md shadow-md uppercase tracking-wider">
                                                        {(newsPage - 1) * NEWS_PER_PAGE + idx === 0 ? 'BARU' : 'BERITA'}
                                                    </span>
                                                </div>

                                                {/* Mentok Image Container */}
                                                <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100">
                                                    {item.thumbnail ? (
                                                        <img
                                                            src={item.thumbnail}
                                                            alt={item.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-[#e8efe5] flex items-center justify-center text-[#265243]">
                                                            <ImageIcon className="w-10 h-10" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content Body */}
                                                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                                                    <div>
                                                        {/* Centered Title */}
                                                        <h4 className="text-center font-extrabold text-[#142921] text-base sm:text-lg leading-snug group-hover:text-[#265243] transition-colors line-clamp-2 mb-2 font-sans px-1">
                                                            {item.title}
                                                        </h4>

                                                        {/* Centered Views Count */}
                                                        <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-[#527365] my-1.5">
                                                            <Eye className="w-3.5 h-3.5 text-[#265243]" />
                                                            <span>{item.views_count || 0} Dilihat</span>
                                                        </div>

                                                        {/* Centered Metadata */}
                                                        <p className="text-center text-[11px] sm:text-xs font-bold text-[#527365] flex items-center justify-center gap-1.5">
                                                            <Calendar className="w-3.5 h-3.5 text-[#265243]" />
                                                            <span>{item.published_at || 'Terbaru'}</span>
                                                            <span>•</span>
                                                            <User className="w-3.5 h-3.5 text-[#265243]" />
                                                            <span>{item.author}</span>
                                                        </p>
                                                    </div>

                                                    {/* Bottom Action Button */}
                                                    <div className="pt-2">
                                                        <span className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-full bg-white text-[#265243] group-hover:bg-[#265243] group-hover:text-white border border-[#c8dac5] text-xs font-black transition-all shadow-2xs cursor-pointer">
                                                            <span>Baca Selengkapnya</span>
                                                            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    {renderPaginationControls(newsPage, totalNewsPages, setNewsPage)}
                                </>
                            )}
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB 3: GALERI (FULL PAGE)                                                 */}
                    {/* ========================================================================= */}
                    {activeTab === 'gallery' && (
                        <div className="space-y-6">
                            {/* HERO HEADER BANNER CARD FOR GALLERY */}
                            <div className="relative rounded-[2.5rem] bg-[#142921] text-white p-8 sm:p-12 overflow-hidden shadow-xl border border-emerald-900/30 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="space-y-2 relative z-10 max-w-2xl">
                                    <div className="flex items-center gap-2">
                                        <span className="px-3.5 py-1 rounded-full bg-[#f59e0b] text-white text-[10px] sm:text-[11px] font-black tracking-widest uppercase shadow-xs">
                                            Media Dokumentasi
                                        </span>
                                    </div>
                                    <h3 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight font-sans drop-shadow-md">
                                        Galeri Foto & Video Dokumentasi
                                    </h3>
                                    <p className="text-xs sm:text-sm text-emerald-100/90 font-medium leading-relaxed">
                                        Kumpulan dokumentasi momen penting, fasilitas pendidikan, serta kegiatan belajar mengajar sekolah.
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 flex-wrap relative z-10 shrink-0">
                                    {[
                                        { id: 'all', label: 'Semua' },
                                        { id: 'photo', label: 'Foto' },
                                        { id: 'youtube', label: 'Video YouTube' },
                                    ].map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => {
                                                setGalleryCategory(cat.id);
                                                setGalleryPage(1);
                                            }}
                                            className={`px-4 py-2 text-xs font-extrabold rounded-full border transition-all cursor-pointer ${
                                                galleryCategory === cat.id
                                                    ? 'bg-white text-[#142921] border-white shadow-md'
                                                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                                            }`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {filteredGalleries.length === 0 ? (
                                <div style={{ backgroundColor: '#ffffff', borderColor: '#c8dac5' }} className="p-12 text-center rounded-2xl border">
                                    <ImageIcon className="w-12 h-12 text-[#265243] mx-auto mb-3" />
                                    <p className="text-sm font-bold text-[#142921]">Belum ada foto atau video dalam galeri.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {paginatedGalleries.map((item) => (
                                            <div
                                                key={item.id}
                                                onClick={() => setSelectedGallery(item)}
                                                style={{ backgroundColor: '#ffffff', borderColor: '#c8dac5' }}
                                                className="group relative rounded-2xl border overflow-hidden shadow-sm cursor-pointer hover:border-[#265243] transition-all"
                                            >
                                                {item.display_image ? (
                                                    <img src={item.display_image} alt={item.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                                                ) : (
                                                    <div className="w-full h-48 bg-[#dce8d7] flex items-center justify-center text-[#265243]">
                                                        <ImageIcon className="w-10 h-10" />
                                                    </div>
                                                )}

                                                {item.type === 'youtube' && (
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white group-hover:bg-black/20 transition-all">
                                                        <PlayCircle className="w-12 h-12 text-rose-500 fill-white" />
                                                    </div>
                                                )}

                                                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white">
                                                    <span className="px-2 py-0.5 rounded bg-[#265243] text-[10px] font-bold uppercase tracking-wider">
                                                        {item.category}
                                                    </span>
                                                    <p className="text-xs font-bold truncate mt-1">{item.title}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {renderPaginationControls(galleryPage, totalGalleryPages, setGalleryPage)}
                                </>
                            )}
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB 4: PERPUSTAKAAN DIGITAL                                               */}
                    {/* ========================================================================= */}
                    {activeTab === 'books' && (
                        <div className="space-y-6">
                            {/* Header & Controls */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-[#527365] uppercase tracking-widest">Katalog Digital</p>
                                    <h3 className="text-2xl sm:text-4xl font-black text-[#142921] tracking-tight">
                                        Katalog Perpustakaan Digital
                                    </h3>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    {/* Search input */}
                                    <div className="relative flex-1 md:w-72">
                                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#265243]" />
                                        <input
                                            type="text"
                                            placeholder="Cari judul buku, penulis..."
                                            value={bookSearch}
                                            onChange={(e) => setBookSearch(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 text-xs font-bold rounded-xl bg-white border border-[#c8dac5] text-[#142921] placeholder-[#527365] shadow-xs focus:ring-2 focus:ring-[#265243]/20 focus:outline-none focus:border-[#265243]/40 transition-all"
                                        />
                                        {bookSearch && (
                                            <button
                                                onClick={() => setBookSearch('')}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#527365] hover:text-[#142921]"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Filter Button */}
                                    <button
                                        onClick={() => setIsFilterModalOpen(true)}
                                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                                            bookCategory !== 'all' || bookAvailability !== 'all'
                                                ? 'bg-[#265243] text-white border-[#265243] hover:bg-[#1a3a30]'
                                                : 'bg-white text-[#142921] border-[#c8dac5] hover:border-[#265243]/50 hover:bg-[#f8faf7]'
                                        }`}
                                    >
                                        <Filter className="w-4 h-4" />
                                        <span>Filter</span>
                                        {(bookCategory !== 'all' || bookAvailability !== 'all') && (
                                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Active Filter Summary Bar if active */}
                            {(bookSearch || bookCategory !== 'all' || bookAvailability !== 'all') && (
                                <div className="flex items-center justify-between bg-white border border-[#c8dac5] rounded-xl px-4 py-2 text-xs">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-bold text-[#527365]">Filter aktif:</span>
                                        {bookCategory !== 'all' && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#eef5eb] text-[#265243] font-bold text-[11px]">
                                                Kategori: {bookCategory}
                                                <button onClick={() => setBookCategory('all')} className="hover:text-rose-600"><X className="w-3 h-3" /></button>
                                            </span>
                                        )}
                                        {bookAvailability !== 'all' && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#eef5eb] text-[#265243] font-bold text-[11px]">
                                                Status: {bookAvailability === 'available' ? 'Tersedia' : 'Dipinjam'}
                                                <button onClick={() => setBookAvailability('all')} className="hover:text-rose-600"><X className="w-3 h-3" /></button>
                                            </span>
                                        )}
                                        {bookSearch && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#eef5eb] text-[#265243] font-bold text-[11px]">
                                                Cari: "{bookSearch}"
                                                <button onClick={() => setBookSearch('')} className="hover:text-rose-600"><X className="w-3 h-3" /></button>
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => { setBookSearch(''); setBookCategory('all'); setBookAvailability('all'); }}
                                        className="text-[11px] font-extrabold text-rose-500 hover:text-rose-700 ml-2 whitespace-nowrap"
                                    >
                                        Reset Semua
                                    </button>
                                </div>
                            )}

                            {/* Filter Modal Popup */}
                            {isFilterModalOpen && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
                                    <div className="bg-white rounded-2xl border border-[#c8dac5] shadow-2xl max-w-md w-full overflow-hidden space-y-5 p-6 animate-in zoom-in-95 duration-200">
                                        {/* Modal Header */}
                                        <div className="flex items-center justify-between pb-3 border-b border-[#e2ebd9]">
                                            <div className="flex items-center gap-2 text-[#142921]">
                                                <Filter className="w-5 h-5 text-[#265243]" />
                                                <h4 className="font-extrabold text-base">Filter Katalog Buku</h4>
                                            </div>
                                            <button
                                                onClick={() => setIsFilterModalOpen(false)}
                                                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>

                                        {/* Modal Body */}
                                        <div className="space-y-5">
                                            {/* Availability Filter */}
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-[#527365] uppercase tracking-wider block">Status Ketersediaan</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {[
                                                        { id: 'all', label: 'Semua Buku', count: books.length },
                                                        { id: 'available', label: 'Tersedia', count: books.filter(b => (b.available_copies ?? 0) > 0).length },
                                                        { id: 'borrowed', label: 'Dipinjam', count: books.filter(b => (b.available_copies ?? 0) === 0).length },
                                                    ].map((opt) => (
                                                        <button
                                                            key={opt.id}
                                                            onClick={() => setBookAvailability(opt.id)}
                                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold border transition-all ${
                                                                bookAvailability === opt.id
                                                                    ? 'bg-[#265243] text-white border-[#265243] shadow-sm'
                                                                    : 'bg-[#f8faf7] text-[#142921] border-[#c8dac5] hover:border-[#265243]/50 hover:bg-[#eef5eb]'
                                                            }`}
                                                        >
                                                            {opt.label}
                                                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                                                                bookAvailability === opt.id ? 'bg-white/20 text-white' : 'bg-[#c8dac5]/60 text-[#265243]'
                                                            }`}>{opt.count}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Category Filter */}
                                            {bookCategories.length > 0 && (
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-[#527365] uppercase tracking-wider block">Kategori Buku</label>
                                                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                                                        <button
                                                            onClick={() => setBookCategory('all')}
                                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold border transition-all ${
                                                                bookCategory === 'all'
                                                                    ? 'bg-[#265243] text-white border-[#265243] shadow-sm'
                                                                    : 'bg-[#f8faf7] text-[#142921] border-[#c8dac5] hover:border-[#265243]/50 hover:bg-[#eef5eb]'
                                                            }`}
                                                        >
                                                            Semua Kategori
                                                        </button>
                                                        {bookCategories.map((cat) => {
                                                            const catCount = books.filter(b => b.category === cat).length;
                                                            return (
                                                                <button
                                                                    key={cat}
                                                                    onClick={() => setBookCategory(cat)}
                                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold border transition-all ${
                                                                        bookCategory === cat
                                                                            ? 'bg-[#265243] text-white border-[#265243] shadow-sm'
                                                                            : 'bg-[#f8faf7] text-[#142921] border-[#c8dac5] hover:border-[#265243]/50 hover:bg-[#eef5eb]'
                                                                    }`}
                                                                >
                                                                    {cat}
                                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                                                                        bookCategory === cat ? 'bg-white/20 text-white' : 'bg-[#c8dac5]/60 text-[#265243]'
                                                                    }`}>{catCount}</span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Modal Footer */}
                                        <div className="flex items-center justify-between pt-3 border-t border-[#e2ebd9]">
                                            <button
                                                onClick={() => { setBookCategory('all'); setBookAvailability('all'); }}
                                                className="text-xs font-bold text-rose-500 hover:text-rose-700 transition-colors"
                                            >
                                                Reset Filter
                                            </button>
                                            <button
                                                onClick={() => setIsFilterModalOpen(false)}
                                                className="px-5 py-2 rounded-xl bg-[#265243] text-white text-xs font-bold hover:bg-[#1a3a30] transition-colors shadow-xs"
                                            >
                                                Terapkan
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {filteredBooks.length === 0 ? (
                                <div style={{ backgroundColor: '#ffffff', borderColor: '#c8dac5' }} className="p-12 text-center rounded-2xl border">
                                    <BookOpen className="w-12 h-12 text-[#265243] mx-auto mb-3" />
                                    <p className="text-sm font-bold text-[#142921]">Tidak ada buku yang sesuai dengan pencarian Anda.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {paginatedBooks.map((book) => (
                                            <div
                                                key={book.id}
                                                className="relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between group transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 border border-[#c8dac5]"
                                            >
                                                {/* Category Badge Overlay - Top Left */}
                                                <div className="absolute top-3 left-3 z-10">
                                                    <span className="px-2.5 py-1 rounded-md bg-[#265243] text-white text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider shadow-md">
                                                        {book.category}
                                                    </span>
                                                </div>

                                                {/* Book Cover Image Container - Full to Left, Right, & Top */}
                                                <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#f4f8f3]">
                                                    {book.cover_image ? (
                                                        <img
                                                            src={book.cover_image}
                                                            alt={book.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-[#e8efe5] flex flex-col items-center justify-center text-[#265243] p-4 text-center">
                                                            <Library className="w-12 h-12 mb-2 text-[#265243]/70" />
                                                            <span className="text-xs font-black text-[#265243]/80">Sampul Buku</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content Body */}
                                                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                                                    <div>
                                                        {/* Book Title */}
                                                        <h4 className="font-extrabold text-[#142921] text-sm sm:text-base leading-snug group-hover:text-[#265243] transition-colors line-clamp-2 mb-1.5 font-sans">
                                                            {book.title}
                                                        </h4>

                                                        {/* Book Author */}
                                                        <p className="text-xs font-semibold text-[#527365] leading-relaxed line-clamp-1">
                                                            Penulis: <span className="text-[#142921] font-bold">{book.author}</span>
                                                        </p>
                                                    </div>

                                                    {/* Footer Stock & Status */}
                                                    <div className="pt-3 border-t border-[#eef4eb] flex items-center justify-between">
                                                        <span className="text-xs font-extrabold text-[#265243]">
                                                            Stok: <span className="font-black text-[#142921]">{book.available_copies}</span> / {book.total_copies}
                                                        </span>
                                                        <span className={`px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider ${
                                                            book.available_copies > 0 ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'
                                                        }`}>
                                                            {book.available_copies > 0 ? 'Tersedia' : 'Dipinjam'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {renderPaginationControls(bookPage, totalBookPages, setBookPage)}
                                </>
                            )}
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB 5: INFORMASI ASRAMA                                                   */}
                    {/* ========================================================================= */}
                    {activeTab === 'dormitory' && (
                        <div className="space-y-8 sm:space-y-12">
                            {/* HERO HEADER BANNER CARD FOR DORMITORY (SOLID COLOR & FULL PHOTO TO TOP/BOTTOM/LEFT) */}
                            <div className="relative rounded-[2.5rem] bg-[#142921] text-white overflow-hidden shadow-xl border border-emerald-900/30 grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[340px]">
                                
                                {/* LEFT COLUMN: FOTO PENGURUS ASRAMA (FULL TO TOP, BOTTOM, & LEFT) */}
                                <div className="lg:col-span-4 relative min-h-[280px] lg:min-h-full overflow-hidden group">
                                    <img 
                                        src={settings.dormitory_pengasuh_photo_url || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80"} 
                                        alt={settings.dormitory_pengasuh_name || "Pengasuh Asrama MAN"} 
                                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 absolute inset-0"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5 sm:p-6 text-white">
                                        <span className="inline-block self-start text-[10px] sm:text-[11px] font-black text-amber-300 uppercase tracking-wider bg-black/50 backdrop-blur-xs py-1 px-3 rounded-full border border-amber-400/20 mb-1.5">
                                            Pengasuh &amp; Pengurus Asrama
                                        </span>
                                        <h4 className="text-base sm:text-lg font-black text-white leading-snug drop-shadow-md">
                                            {settings.dormitory_pengasuh_name || 'Ustadz & Ustadzah Pengasuh'}
                                        </h4>
                                        <p className="text-xs text-emerald-200 font-medium">
                                            {settings.dormitory_pengasuh_title || 'Tim Pembina Karakter & Tahfidz MAN'}
                                        </p>
                                    </div>
                                </div>

                                {/* RIGHT COLUMN: PENJELASAN ASRAMA & PINTASAN KONTAK/SOSMED */}
                                <div className="lg:col-span-8 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="px-3.5 py-1 rounded-full bg-[#f59e0b] text-white text-[10px] sm:text-[11px] font-black tracking-widest uppercase shadow-xs">
                                                Ma'had &amp; Asrama Modern
                                            </span>
                                        </div>
                                        <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight font-sans">
                                            {settings.dormitory_title || 'Lingkungan Hunian Islami, Disiplin, & Berprestasi'}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-emerald-100/90 font-medium leading-relaxed">
                                            {settings.dormitory_description || "Asrama Ma'had MAN dirancang untuk membentuk karakter santri yang mandiri, berilmu, dan berakhlaqul karimah. Dilengkapi dengan program Tahfidzul Qur'an, kajian kitab kuning, bimbingan akademik intensif, serta pembiasaan kedisiplinan hidup sehari-hari di bawah pengawasan pengasuh berpengalaman."}
                                        </p>
                                    </div>

                                    {/* PINTASAN KONTAK & SOSMED */}
                                    <div className="pt-3 border-t border-emerald-800/40">
                                        <p className="text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-2.5">
                                            Pintasan Kontak &amp; Media Sosial Pengurus:
                                        </p>
                                        <div className="flex flex-wrap items-center gap-2.5">
                                            {/* WA Pengurus Putra */}
                                            <a
                                                href={settings.dormitory_wa_putra || "https://wa.me/6281234567890"}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-xs backdrop-blur-xs group"
                                            >
                                                <svg className="w-4 h-4 fill-emerald-400 group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                                </svg>
                                                <span>WA Pengurus Putra</span>
                                            </a>

                                            {/* WA Pengurus Putri */}
                                            <a
                                                href={settings.dormitory_wa_putri || "https://wa.me/6281234567891"}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-xs backdrop-blur-xs group"
                                            >
                                                <svg className="w-4 h-4 fill-emerald-400 group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                                </svg>
                                                <span>WA Pengurus Putri</span>
                                            </a>

                                            {/* Instagram Asrama */}
                                            <a
                                                href={settings.dormitory_instagram || "https://instagram.com"}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#f59e0b]/20 hover:bg-[#f59e0b] text-white text-xs font-bold transition-all shadow-xs backdrop-blur-xs group"
                                            >
                                                <svg className="w-4 h-4 fill-amber-300 group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                                </svg>
                                                <span>Instagram Asrama</span>
                                            </a>

                                            {/* TikTok Asrama */}
                                            <a
                                                href={settings.dormitory_tiktok || "https://tiktok.com"}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#265243]/50 hover:bg-[#265243] text-white text-xs font-bold transition-all shadow-xs backdrop-blur-xs group"
                                            >
                                                <svg className="w-4 h-4 fill-emerald-300 group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                                                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v7.02c0 2.87-1.34 5.61-3.66 7.15-2.32 1.54-5.32 1.77-7.85.6-2.54-1.17-4.32-3.65-4.63-6.42-.31-2.77.86-5.55 3.06-7.19 1.83-1.37 4.23-1.85 6.43-1.28v4.03c-1.15-.38-2.45-.25-3.48.35-1.03.6-1.67 1.69-1.69 2.89-.02 1.2.6 2.31 1.62 2.94 1.02.63 2.33.59 3.32-.09.99-.68 1.48-1.85 1.48-3.04V.02z"/>
                                                </svg>
                                                <span>TikTok Asrama</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="space-y-1 pb-2">
                                <p className="text-xs font-bold text-[#527365] uppercase tracking-widest">
                                    Informasi &amp; Kegiatan Terbaru
                                </p>
                                <h3 className="text-2xl sm:text-3xl font-black text-[#142921] tracking-tight">
                                    Berita &amp; Publikasi Asrama
                                </h3>
                            </div>

                            {dormitory.length === 0 ? (
                                <div style={{ backgroundColor: '#ffffff', borderColor: '#c8dac5' }} className="p-12 text-center rounded-2xl border">
                                    <Building2 className="w-12 h-12 text-[#265243] mx-auto mb-3" />
                                    <p className="text-sm font-bold text-[#142921]">Belum ada informasi kegiatan asrama.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {paginatedDorm.map((post) => (
                                            <div
                                                key={post.id}
                                                className="relative bg-white rounded-[2.25rem] overflow-hidden flex flex-col justify-between group transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 border border-[#c8dac5]"
                                            >
                                                {/* Top Badge */}
                                                <div className="absolute top-4 left-4 z-10">
                                                    <span className="bg-[#f59e0b] text-white text-[10px] sm:text-[11px] font-extrabold px-2.5 py-1 rounded-md shadow-md uppercase tracking-wider">
                                                        ASRAMA
                                                    </span>
                                                </div>

                                                {/* Mentok Image Container */}
                                                <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100">
                                                    {post.media ? (
                                                        <img
                                                            src={post.media}
                                                            alt={post.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-[#e8efe5] flex items-center justify-center text-[#265243]">
                                                            <ImageIcon className="w-10 h-10" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content Body */}
                                                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                                                    <div>
                                                        {/* Centered Title */}
                                                        <h4 className="text-center font-extrabold text-[#142921] text-base sm:text-lg leading-snug group-hover:text-[#265243] transition-colors line-clamp-2 mb-2 font-sans px-1">
                                                            {post.title}
                                                        </h4>

                                                        {/* Centered Content Excerpt */}
                                                        <p className="text-center text-xs font-semibold text-[#2e5445] leading-relaxed line-clamp-3 mb-3">
                                                            {getExcerpt(post.content, 120)}
                                                        </p>

                                                        {/* Centered Metadata */}
                                                        <p className="text-center text-[11px] sm:text-xs font-bold text-[#527365] flex items-center justify-center gap-1.5">
                                                            <Calendar className="w-3.5 h-3.5 text-[#265243]" />
                                                            <span>{post.created_at}</span>
                                                            <span>•</span>
                                                            <User className="w-3.5 h-3.5 text-[#265243]" />
                                                            <span>{post.author}</span>
                                                        </p>
                                                    </div>

                                                    {/* Bottom Action Button */}
                                                    <div className="pt-2">
                                                        <span className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-full bg-white text-[#265243] group-hover:bg-[#265243] group-hover:text-white border border-[#c8dac5] text-xs font-black transition-all shadow-2xs cursor-pointer">
                                                            <span>Lihat Detail Asrama</span>
                                                            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {renderPaginationControls(dormPage, totalDormPages, setDormPage)}
                                </>
                            )}
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB 6: E-LEGALISIR ALUMNI (LEGALIZATION)                                  */}
                    {/* ========================================================================= */}
                    {activeTab === 'legalization' && (
                        <div className="max-w-3xl mx-auto space-y-6">
                            <div style={{ backgroundColor: '#ffffff', borderColor: '#c8dac5' }} className="p-6 sm:p-8 rounded-3xl border shadow-md space-y-6">
                                <div className="flex items-center gap-3 border-l-4 border-[#265243] pl-3">
                                    <div>
                                        <h3 className="text-xl font-black text-[#142921]">
                                            Form Permohonan E-Legalisir Alumni
                                        </h3>
                                        <p className="text-xs font-semibold text-[#527365] mt-1">
                                            Layanan legalisasi ijazah dan transkrip nilai secara online untuk alumni sekolah.
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={handleLegalizationSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#265243] mb-1">
                                                Nama Lengkap Alumni <span className="text-rose-600">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Nama lengkap sesuai ijazah..."
                                                value={legalizationForm.data.alumni_name}
                                                onChange={(e) => legalizationForm.setData('alumni_name', e.target.value)}
                                                style={{ backgroundColor: '#ffffff', borderColor: '#265243', color: '#142921' }}
                                                className="w-full px-4 py-3 text-xs font-bold rounded-xl border-2 shadow-xs focus:ring-2 focus:ring-[#265243]/20 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#265243] mb-1">
                                                Email Aktif <span className="text-rose-600">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                placeholder="email@domain.com"
                                                value={legalizationForm.data.email}
                                                onChange={(e) => legalizationForm.setData('email', e.target.value)}
                                                style={{ backgroundColor: '#ffffff', borderColor: '#265243', color: '#142921' }}
                                                className="w-full px-4 py-3 text-xs font-bold rounded-xl border-2 shadow-xs focus:ring-2 focus:ring-[#265243]/20 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#265243] mb-1">
                                                No. WhatsApp / HP <span className="text-rose-600">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="0812xxxxxxxx"
                                                value={legalizationForm.data.phone}
                                                onChange={(e) => legalizationForm.setData('phone', e.target.value)}
                                                style={{ backgroundColor: '#ffffff', borderColor: '#265243', color: '#142921' }}
                                                className="w-full px-4 py-3 text-xs font-bold rounded-xl border-2 shadow-xs focus:ring-2 focus:ring-[#265243]/20 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#265243] mb-1">
                                                Tahun Kelulusan <span className="text-rose-600">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Contoh: 2023"
                                                value={legalizationForm.data.graduation_year}
                                                onChange={(e) => legalizationForm.setData('graduation_year', e.target.value)}
                                                style={{ backgroundColor: '#ffffff', borderColor: '#265243', color: '#142921' }}
                                                className="w-full px-4 py-3 text-xs font-bold rounded-xl border-2 shadow-xs focus:ring-2 focus:ring-[#265243]/20 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#265243] mb-1">
                                                Jenis Dokumen <span className="text-rose-600">*</span>
                                            </label>
                                            <select
                                                value={legalizationForm.data.document_type}
                                                onChange={(e) => legalizationForm.setData('document_type', e.target.value)}
                                                style={{ backgroundColor: '#ffffff', borderColor: '#265243', color: '#142921' }}
                                                className="w-full px-4 py-3 text-xs font-bold rounded-xl border-2 shadow-xs focus:ring-2 focus:ring-[#265243]/20 focus:outline-none"
                                            >
                                                <option value="Ijazah & Transkrip Nilai">Ijazah & Transkrip Nilai</option>
                                                <option value="Ijazah SMA">Ijazah SMA Sah</option>
                                                <option value="Transkrip Nilai">Transkrip Nilai Sah</option>
                                                <option value="Sertifikat Akreditasi">Sertifikat Akreditasi</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#265243] mb-1">
                                                Jumlah Rangkap <span className="text-rose-600">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                min={1}
                                                max={20}
                                                required
                                                value={legalizationForm.data.copies}
                                                onChange={(e) => legalizationForm.setData('copies', parseInt(e.target.value) || 1)}
                                                style={{ backgroundColor: '#ffffff', borderColor: '#265243', color: '#142921' }}
                                                className="w-full px-4 py-3 text-xs font-bold rounded-xl border-2 shadow-xs focus:ring-2 focus:ring-[#265243]/20 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-extrabold uppercase tracking-wider text-[#265243] mb-1">
                                            Catatan / Kepentingan Legalisir
                                        </label>
                                        <textarea
                                            rows={3}
                                            placeholder="Tuliskan catatan permohonan atau universitas/perusahaan tujuan..."
                                            value={legalizationForm.data.notes}
                                            onChange={(e) => legalizationForm.setData('notes', e.target.value)}
                                            style={{ backgroundColor: '#ffffff', borderColor: '#265243', color: '#142921' }}
                                            className="w-full px-4 py-3 text-xs font-semibold rounded-xl border-2 shadow-xs focus:ring-2 focus:ring-[#265243]/20 focus:outline-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={legalizationForm.processing}
                                        style={{ backgroundColor: '#265243', color: '#ffffff' }}
                                        className="w-full py-3.5 rounded-xl font-extrabold text-xs shadow-md hover:bg-[#1a3d31] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <FileCheck className="w-4 h-4 text-white" /> Kirim Permohonan Legalisir
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB 7: PENGADUAN MASYARAKAT (COMPLAINTS)                                  */}
                    {/* ========================================================================= */}
                    {activeTab === 'complaints' && (
                        <div className="max-w-3xl mx-auto space-y-6">
                            <div style={{ backgroundColor: '#ffffff', borderColor: '#c8dac5' }} className="p-6 sm:p-8 rounded-3xl border shadow-md space-y-6">
                                <div className="flex items-center gap-3 border-l-4 border-[#265243] pl-3">
                                    <div>
                                        <h3 className="text-xl font-black text-[#142921]">
                                            Layanan Pengaduan & Aspirasi Masyarakat
                                        </h3>
                                        <p className="text-xs font-semibold text-[#527365] mt-1">
                                            Sampaikan masukan, saran, atau pengaduan secara langsung kepada pengelola sekolah.
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={handleComplaintSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#265243] mb-1">
                                                Nama Lengkap <span className="text-rose-600">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Nama pengirim..."
                                                value={complaintForm.data.name}
                                                onChange={(e) => complaintForm.setData('name', e.target.value)}
                                                style={{ backgroundColor: '#ffffff', borderColor: '#265243', color: '#142921' }}
                                                className="w-full px-4 py-3 text-xs font-bold rounded-xl border-2 shadow-xs focus:ring-2 focus:ring-[#265243]/20 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#265243] mb-1">
                                                Email <span className="text-rose-600">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                placeholder="email@domain.com"
                                                value={complaintForm.data.email}
                                                onChange={(e) => complaintForm.setData('email', e.target.value)}
                                                style={{ backgroundColor: '#ffffff', borderColor: '#265243', color: '#142921' }}
                                                className="w-full px-4 py-3 text-xs font-bold rounded-xl border-2 shadow-xs focus:ring-2 focus:ring-[#265243]/20 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#265243] mb-1">
                                                No. Telefon / WhatsApp
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="0812xxxxxxxx"
                                                value={complaintForm.data.phone}
                                                onChange={(e) => complaintForm.setData('phone', e.target.value)}
                                                style={{ backgroundColor: '#ffffff', borderColor: '#265243', color: '#142921' }}
                                                className="w-full px-4 py-3 text-xs font-bold rounded-xl border-2 shadow-xs focus:ring-2 focus:ring-[#265243]/20 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-extrabold uppercase tracking-wider text-[#265243] mb-1">
                                                Subjek Pengaduan <span className="text-rose-600">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Topik / judul pengaduan..."
                                                value={complaintForm.data.subject}
                                                onChange={(e) => complaintForm.setData('subject', e.target.value)}
                                                style={{ backgroundColor: '#ffffff', borderColor: '#265243', color: '#142921' }}
                                                className="w-full px-4 py-3 text-xs font-bold rounded-xl border-2 shadow-xs focus:ring-2 focus:ring-[#265243]/20 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-extrabold uppercase tracking-wider text-[#265243] mb-1">
                                            Isi Masukan & Pesan Pengaduan <span className="text-rose-600">*</span>
                                        </label>
                                        <textarea
                                            rows={5}
                                            required
                                            placeholder="Tuliskan laporan pengaduan, masukan, atau saran secara detail..."
                                            value={complaintForm.data.message}
                                            onChange={(e) => complaintForm.setData('message', e.target.value)}
                                            style={{ backgroundColor: '#ffffff', borderColor: '#265243', color: '#142921' }}
                                            className="w-full px-4 py-3 text-xs font-semibold rounded-xl border-2 shadow-xs focus:ring-2 focus:ring-[#265243]/20 focus:outline-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={complaintForm.processing}
                                        style={{ backgroundColor: '#265243', color: '#ffffff' }}
                                        className="w-full py-3.5 rounded-xl font-extrabold text-xs shadow-md hover:bg-[#1a3d31] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <Send className="w-4 h-4 text-white" /> Kirim Pengaduan Sekarang
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </main>



                {/* ── MODAL READ ARTICLE NEWS DETAIL ───────────────────────────────── */}
                {selectedNews && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
                        <div
                            style={{ backgroundColor: '#ffffff', borderColor: '#b8ceb0' }}
                            className="w-full max-w-2xl rounded-3xl shadow-2xl border overflow-hidden max-h-[85vh] flex flex-col justify-between"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-[#eef4eb] bg-[#f8faf7]">
                                <div className="flex items-center gap-2 border-l-4 border-[#265243] pl-3">
                                    <h3 className="text-base font-extrabold text-[#142921] line-clamp-1">
                                        {selectedNews.title}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setSelectedNews(null)}
                                    className="p-1.5 rounded-full text-[#265243] hover:bg-[#eaf2e7]"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto space-y-4">
                                {selectedNews.thumbnail && (
                                    <img src={selectedNews.thumbnail} alt={selectedNews.title} className="w-full h-64 object-cover rounded-2xl border border-[#b8ceb0]" />
                                )}
                                <div className="flex items-center gap-3 text-xs font-bold text-[#527365]">
                                    <span>Tanggal: {selectedNews.published_at || 'Baru'}</span>
                                    <span>•</span>
                                    <span>Penulis: {selectedNews.author}</span>
                                </div>
                                <div
                                    className="text-xs text-[#142921] font-medium leading-relaxed space-y-3 prose max-w-none"
                                    dangerouslySetInnerHTML={{ __html: selectedNews.content }}
                                />
                            </div>

                            <div className="p-4 border-t border-[#eef4eb] bg-[#f8faf7] text-right">
                                <button
                                    onClick={() => setSelectedNews(null)}
                                    style={{ backgroundColor: '#265243', color: '#ffffff' }}
                                    className="px-6 py-2.5 rounded-xl font-extrabold text-xs hover:bg-[#1f4337]"
                                >
                                    Tutup Artikel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── MODAL LIGHTBOX GALLERY DETAIL ───────────────────────────────── */}
                {selectedGallery && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
                        <div className="w-full max-w-3xl space-y-4">
                            <div className="flex items-center justify-between text-white">
                                <div>
                                    <span className="px-2.5 py-1 rounded bg-[#265243] text-xs font-bold uppercase">
                                        {selectedGallery.category}
                                    </span>
                                    <h3 className="text-base font-extrabold mt-1">{selectedGallery.title}</h3>
                                </div>
                                <button onClick={() => setSelectedGallery(null)} className="p-2 rounded-full bg-white/20 text-white hover:bg-white/40">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="rounded-2xl overflow-hidden bg-black border border-white/20 shadow-2xl flex items-center justify-center">
                                {selectedGallery.type === 'youtube' && selectedGallery.youtube_id ? (
                                    <div className="aspect-video w-full">
                                        <iframe
                                            src={`https://www.youtube-nocookie.com/embed/${selectedGallery.youtube_id}?autoplay=1`}
                                            title={selectedGallery.title}
                                            className="w-full h-full border-0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                ) : selectedGallery.display_image ? (
                                    <img src={selectedGallery.display_image} alt={selectedGallery.title} className="w-full max-h-[70vh] object-contain" />
                                ) : null}
                            </div>

                            {selectedGallery.description && (
                                <p className="text-xs text-slate-300 font-medium text-center">{selectedGallery.description}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* ── 4. FLOATING BANNER BOX WITH FULL BACKGROUND IMAGE & CLEAN ELEGANT TYPOGRAPHY (MAN TANJUNGPINANG) ── */}
                {activeTab !== 'books' && (
                    <div className="relative z-30 max-w-6xl mx-auto px-4 w-full -mb-20 sm:-mb-24 mt-16">
                        <div className="relative rounded-[2.5rem] bg-[#142921] text-white border border-emerald-900/40 shadow-2xl overflow-hidden flex flex-col items-center justify-center text-center p-10 sm:p-16 min-h-[280px] sm:min-h-[340px]">
                            
                            {/* Background Image (Full Box) */}
                            {settings.footer_banner_bg_url ? (
                                <img
                                    src={settings.footer_banner_bg_url}
                                    alt="Footer Banner Background"
                                    className="absolute inset-0 w-full h-full object-cover z-0"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-[#142921] z-0" />
                            )}

                            {/* Dark Overlay for Text Readability */}
                            <div className="absolute inset-0 bg-black/60 z-10" />

                            {/* Centered Pure Typography Content */}
                            <div className="relative z-20 space-y-4 max-w-3xl mx-auto flex flex-col items-center text-center">
                                {/* PROMINENT CENTERED TITLE (MAN TANJUNGPINANG - MAN TOP, TANJUNGPINANG BOTTOM) */}
                                {(() => {
                                    const rawTitle = settings.footer_banner_title || 'MAN TANJUNGPINANG';
                                    const cleanTitle = rawTitle.replace(/TANJUNG\s+PINANG/gi, 'TANJUNGPINANG');
                                    if (cleanTitle.toUpperCase().startsWith('MAN ')) {
                                        const subTitle = cleanTitle.substring(4).trim();
                                        return (
                                            <h3 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-none tracking-wider uppercase drop-shadow-lg text-center flex flex-col items-center gap-1">
                                                <span>MAN</span>
                                                <span>{subTitle}</span>
                                            </h3>
                                        );
                                    }
                                    if (cleanTitle.toUpperCase() === 'MAN TANJUNGPINANG') {
                                        return (
                                            <h3 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-none tracking-wider uppercase drop-shadow-lg text-center flex flex-col items-center gap-1">
                                                <span>MAN</span>
                                                <span>TANJUNGPINANG</span>
                                            </h3>
                                        );
                                    }
                                    return (
                                        <h3 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-tight tracking-wider uppercase drop-shadow-lg text-center flex flex-col items-center">
                                            {cleanTitle.split('\n').map((line, idx) => (
                                                <span key={idx}>{line}</span>
                                            ))}
                                        </h3>
                                    );
                                })()}

                                {/* Clean Subtitle Text */}
                                <p className="text-xs sm:text-base text-emerald-100/90 font-medium leading-relaxed max-w-2xl text-center tracking-wide font-sans">
                                    {settings.footer_banner_subtitle || 'Mewujudkan Generasi Cerdas, Berkarakter, dan Berdaya Saing Global'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── FOOTER CONTAINER (CALM SOFT PALETTE & CLEAN WHITE TYPOGRAPHY) ── */}
                <footer className={`bg-[#142921] text-white border-t border-[#265243] pb-8 mt-auto shadow-2xl ${activeTab === 'books' ? 'pt-12 sm:pt-16' : 'pt-32 sm:pt-36'}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

                            {/* Col 1 & 2: Brand Identity & Social Icons */}
                            <div className="space-y-4 lg:col-span-2">
                                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
                                    {settings.school_logo_url ? (
                                        <img src={settings.school_logo_url} alt="Logo" className="w-11 h-11 object-contain" />
                                    ) : (
                                        <div className="w-11 h-11 rounded-2xl bg-white text-[#142921] flex items-center justify-center font-black text-xl shadow-sm">
                                            S
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-base font-black text-white tracking-tight">{schoolName}</h3>
                                        <p className="text-[11px] font-bold text-[#b5d6c6]">Portal Resmi Sekolah</p>
                                    </div>
                                </div>
                                <p className="text-xs text-[#eaf2ee] font-medium leading-relaxed max-w-sm">
                                    {schoolTagline}
                                </p>

                                {/* Social Media Icons Row (Connected to Admin CMS Settings) */}
                                <div className="pt-2 flex items-center gap-2">
                                    <a
                                        href={settings.footer_facebook || '#'}
                                        target={settings.footer_facebook ? '_blank' : '_self'}
                                        rel="noopener noreferrer"
                                        title="Facebook"
                                        className="w-9 h-9 rounded-full bg-white/10 text-white border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#142921] hover:scale-110 transition-all duration-300 shadow-xs"
                                    >
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    </a>
                                    <a
                                        href={settings.footer_instagram || '#'}
                                        target={settings.footer_instagram ? '_blank' : '_self'}
                                        rel="noopener noreferrer"
                                        title="Instagram"
                                        className="w-9 h-9 rounded-full bg-white/10 text-white border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#142921] hover:scale-110 transition-all duration-300 shadow-xs"
                                    >
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    </a>
                                    <a
                                        href={settings.footer_youtube || '#'}
                                        target={settings.footer_youtube ? '_blank' : '_self'}
                                        rel="noopener noreferrer"
                                        title="YouTube"
                                        className="w-9 h-9 rounded-full bg-white/10 text-white border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#142921] hover:scale-110 transition-all duration-300 shadow-xs"
                                    >
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                        </svg>
                                    </a>
                                    <a
                                        href={`mailto:${settings.footer_email || settings.school_email || 'info@sekolah.sch.id'}`}
                                        title="Email"
                                        className="w-9 h-9 rounded-full bg-white/10 text-white border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#142921] hover:scale-110 transition-all duration-300 shadow-xs"
                                    >
                                        <Mail className="w-4 h-4" />
                                    </a>
                                    <a
                                        href={`tel:${settings.footer_phone || settings.school_phone || '(021) 12345678'}`}
                                        title="Telepon"
                                        className="w-9 h-9 rounded-full bg-white/10 text-white border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#142921] hover:scale-110 transition-all duration-300 shadow-xs"
                                    >
                                        <Phone className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>

                            {/* Col 3: Profil Sekolah */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-black uppercase tracking-wider text-[#b5d6c6] border-b border-[#265243] pb-2">
                                    Profil Sekolah
                                </h4>
                                <ul className="space-y-2.5 text-xs font-medium">
                                    {[
                                        { id: 'home', label: 'Beranda Utama' },
                                        { id: 'news', label: 'Berita & Pengumuman' },
                                        { id: 'gallery', label: 'Galeri Dokumentasi' },
                                        { id: 'books', label: 'Perpustakaan Digital' },
                                        { id: 'dormitory', label: 'Informasi Asrama' },
                                    ].map((item) => (
                                        <li key={item.id}>
                                            <button
                                                onClick={() => setActiveTab(item.id as any)}
                                                className="text-[#eaf2ee] hover:text-white hover:translate-x-1 transition-all flex items-center gap-1.5 group text-left"
                                            >
                                                <ChevronRight className="w-3.5 h-3.5 text-[#9dc3b2] group-hover:translate-x-0.5 transition-transform" />
                                                <span>{item.label}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Col 4: Layanan Digital */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-black uppercase tracking-wider text-[#b5d6c6] border-b border-[#265243] pb-2">
                                    Layanan Digital
                                </h4>
                                <ul className="space-y-2.5 text-xs font-medium">
                                    {[
                                        { id: 'legalization', label: 'Permohonan E-Legalisir' },
                                        { id: 'complaints', label: 'Kotak Pengaduan Digital' },
                                    ].map((item) => (
                                        <li key={item.id}>
                                            <button
                                                onClick={() => setActiveTab(item.id as any)}
                                                className="text-[#eaf2ee] hover:text-white hover:translate-x-1 transition-all flex items-center gap-1.5 group text-left"
                                            >
                                                <ChevronRight className="w-3.5 h-3.5 text-[#9dc3b2] group-hover:translate-x-0.5 transition-transform" />
                                                <span>{item.label}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <div className="pt-2">
                                    <p className="text-[11px] font-extrabold text-[#b5d6c6]">Jam Layanan:</p>
                                    <p className="text-xs text-[#eaf2ee] font-medium mt-0.5">Senin - Jumat: 07.30 - 16.00 WIB</p>
                                </div>
                            </div>

                            {/* Col 5: Hubungi Kami */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-black uppercase tracking-wider text-[#b5d6c6] border-b border-[#265243] pb-2">
                                    Hubungi Kami
                                </h4>
                                <div className="space-y-2.5 text-xs font-medium text-[#eaf2ee]">
                                    <p className="flex items-start gap-2.5">
                                        <MapPin className="w-4 h-4 text-[#9dc3b2] shrink-0 mt-0.5" />
                                        <span>{settings.school_address || 'Jl. Pendidikan No. 1, Kota Sekolah'}</span>
                                    </p>
                                    <p className="flex items-center gap-2.5">
                                        <Phone className="w-4 h-4 text-[#9dc3b2] shrink-0" />
                                        <span>{settings.school_phone || '(021) 12345678'}</span>
                                    </p>
                                    <p className="flex items-center gap-2.5">
                                        <Mail className="w-4 h-4 text-[#9dc3b2] shrink-0" />
                                        <span>{settings.school_email || 'info@sekolah.sch.id'}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Copyright Bar */}
                        <div className="pt-6 border-t border-[#265243] text-center sm:text-left text-xs text-white/70 font-medium">
                            <p>{settings.footer_copyright || `© Copyright ${new Date().getFullYear()} ${schoolName}. All rights reserved.`}</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
