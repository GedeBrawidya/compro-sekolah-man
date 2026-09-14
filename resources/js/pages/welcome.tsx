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
    const text = html
        .replace(/<[^>]*>?/gm, ' ')
        .replace(/\s+/g, ' ')
        .trim();
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

interface FacilityItem {
    id: number;
    title: string;
    description: string | null;
    image: string | null;
    order: number;
    is_active: boolean;
}

const DEFAULT_FACILITIES: FacilityItem[] = [
    {
        id: 1,
        title: 'Ruang Kelas Nyaman',
        description:
            'Dilengkapi dengan proyektor, AC/Kipas, dan sirkulasi udara yang baik untuk mendukung fokus belajar siswa dalam suasana kondusif dan berbasis digital.',
        image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1000&auto=format&fit=crop',
        order: 1,
        is_active: true,
    },
    {
        id: 2,
        title: 'Perpustakaan Digital',
        description:
            'Koleksi buku lengkap dengan akses e-library, komputer pencarian katalog, dan ruang baca ber-AC yang tenang dan representatif.',
        image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1000&auto=format&fit=crop',
        order: 2,
        is_active: true,
    },
    {
        id: 3,
        title: 'Laboratorium Sains',
        description:
            'Fasilitas praktikum Fisika, Kimia, dan Biologi berstandar nasional dengan alat peraga dan mikroskop modern untuk eksperimen ilmiah.',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop',
        order: 3,
        is_active: true,
    },
    {
        id: 4,
        title: 'Laboratorium Komputer',
        description:
            'Dilengkapi puluhan PC spesifikasi tinggi, jaringan LAN terintegrasi, dan akses internet fiber optic berkecepatan tinggi untuk CBT dan coding.',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop',
        order: 4,
        is_active: true,
    },
    {
        id: 5,
        title: 'Masjid Utama Sekolah',
        description:
            "Pusat kegiatan ibadah, salat berjamaah, tahfiz Al-Qur'an, dan pembinaan karakter keagamaan siswa dengan area yang luas dan bersih.",
        image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?q=80&w=1000&auto=format&fit=crop',
        order: 5,
        is_active: true,
    },
    {
        id: 6,
        title: 'Lapangan Olahraga',
        description:
            'Area multi-fungsi yang luas untuk basket, futsal, bola voli, badminton, dan pelaksanaan upacara bendera serta kegiatan ekstrakurikuler.',
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop',
        order: 6,
        is_active: true,
    },
    {
        id: 7,
        title: 'UKS & Klinik Sekolah',
        description:
            'Fasilitas kesehatan pertolongan pertama pada kecelakaan (P3K) lengkap dengan tempat tidur istirahat dan didampingi tenaga medis terlatih.',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop',
        order: 7,
        is_active: true,
    },
    {
        id: 8,
        title: 'Kantin Sehat & Bersih',
        description:
            'Menyediakan beragam makanan dan minuman higienis, terjangkau, dan bergizi dengan standar kebersihan lingkungan yang terus dipantau.',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop',
        order: 8,
        is_active: true,
    },
    {
        id: 9,
        title: 'Keamanan 24 Jam & CCTV',
        description:
            'Sistem keamanan terpadu oleh petugas satpam profesional serta pemantauan kamera CCTV di seluruh sudut area vital sekolah.',
        image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=1000&auto=format&fit=crop',
        order: 9,
        is_active: true,
    },
];

interface Props {
    banners: BannerItem[];
    settings: Record<string, string>;
    news: NewsItem[];
    galleries: GalleryItem[];
    books: BookItem[];
    bookCategories: string[];
    dormitory: DormitoryItem[];
    milestones: MilestoneItem[];
    facilities?: FacilityItem[];
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
    facilities = [],
    stats = {
        total_news: 0,
        total_books: 0,
        total_galleries: 0,
        total_dormitory: 0,
    },
}: Props) {
    const { auth, flash } = usePage<{
        auth: { user: any };
        flash: { success?: string; error?: string };
    }>().props;

    const [activeTab, setActiveTab] = useState<
        | 'home'
        | 'profile'
        | 'vision'
        | 'news'
        | 'gallery'
        | 'books'
        | 'dormitory'
        | 'legalization'
        | 'complaints'
    >('home');
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
    const [selectedGallery, setSelectedGallery] = useState<GalleryItem | null>(
        null,
    );
    const [selectedFacility, setSelectedFacility] =
        useState<FacilityItem | null>(null);
    const [bookSearch, setBookSearch] = useState('');
    const [bookCategory, setBookCategory] = useState<string>('all');
    const [bookAvailability, setBookAvailability] = useState<string>('all');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isPlayingInlineVideo, setIsPlayingInlineVideo] = useState(false);
    const [profileSubTab, setProfileSubTab] = useState<
        'vision' | 'profile' | 'history' | 'target' | 'facilities' | 'motto'
    >('vision');
    const [galleryCategory, setGalleryCategory] = useState<string>('all');
    const [newsPage, setNewsPage] = useState(1);
    const [galleryPage, setGalleryPage] = useState(1);
    const [bookPage, setBookPage] = useState(1);
    const [dormPage, setDormPage] = useState(1);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterSuccess, setNewsletterSuccess] = useState(false);
    const [bannerTouchStart, setBannerTouchStart] = useState<number | null>(
        null,
    );
    const [galleryTouchStart, setGalleryTouchStart] = useState<number | null>(
        null,
    );
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

    const handleTabClick = (
        tabId:
            | 'home'
            | 'profile'
            | 'vision'
            | 'news'
            | 'gallery'
            | 'books'
            | 'dormitory'
            | 'legalization'
            | 'complaints',
    ) => {
        if (tabId === 'books') {
            window.open('/?tab=books', '_blank');
            return;
        }
        if (tabId === 'legalization') {
            const defaultLink =
                'https://docs.google.com/forms/d/e/1FAIpQLSeQFirrXnNpCuZEPGK4SOIWuBrs4c3sEPJLEoZB9l0LRWbTqw/formResponse';
            window.open(settings.legalization_link || defaultLink, '_blank');
            return;
        }
        if (tabId === 'complaints') {
            const defaultLink =
                'https://docs.google.com/forms/d/e/1FAIpQLSeQFirrXnNpCuZEPGK4SOIWuBrs4c3sEPJLEoZB9l0LRWbTqw/formResponse';
            window.open(
                settings.complaint_link ||
                    settings.legalization_link ||
                    defaultLink,
                '_blank',
            );
            return;
        }
        setActiveTab(tabId);
        setIsMobileMenuOpen(false);

        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        if (document.documentElement)
            document.documentElement.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth',
            });
        if (document.body)
            document.body.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

        requestAnimationFrame(() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        });
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');
        if (
            tabParam &&
            [
                'home',
                'profile',
                'vision',
                'news',
                'gallery',
                'books',
                'dormitory',
                'legalization',
                'complaints',
            ].includes(tabParam)
        ) {
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
            setCurrentBannerIndex(
                (prev) =>
                    (prev - 1 + (banners.length || 1)) % (banners.length || 1),
            );
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
            setActiveGalleryIndex(
                (prev) => (prev + 1) % (galleries.length || 1),
            );
        } else if (diff < -40) {
            setActiveGalleryIndex(
                (prev) =>
                    (prev - 1 + (galleries.length || 1)) %
                    (galleries.length || 1),
            );
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
            const currentScrollY = window.scrollY;
            if (currentScrollY > 100) {
                setIsScrolled(true);
            } else if (currentScrollY < 40) {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
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
        const matchCategory =
            bookCategory === 'all' || b.category === bookCategory;
        const matchAvailability =
            bookAvailability === 'all' ||
            (bookAvailability === 'available' &&
                (b.available_copies ?? 0) > 0) ||
            (bookAvailability === 'borrowed' &&
                (b.available_copies ?? 0) === 0);
        return matchSearch && matchCategory && matchAvailability;
    });

    const filteredGalleries =
        galleryCategory === 'all'
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
    const paginatedNews = news.slice(
        (newsPage - 1) * NEWS_PER_PAGE,
        newsPage * NEWS_PER_PAGE,
    );

    const totalGalleryPages = Math.ceil(
        filteredGalleries.length / GALLERY_PER_PAGE,
    );
    const paginatedGalleries = filteredGalleries.slice(
        (galleryPage - 1) * GALLERY_PER_PAGE,
        galleryPage * GALLERY_PER_PAGE,
    );

    const totalBookPages = Math.ceil(filteredBooks.length / BOOK_PER_PAGE);
    const paginatedBooks = filteredBooks.slice(
        (bookPage - 1) * BOOK_PER_PAGE,
        bookPage * BOOK_PER_PAGE,
    );

    const totalDormPages = Math.ceil(dormitory.length / DORM_PER_PAGE);
    const paginatedDorm = dormitory.slice(
        (dormPage - 1) * DORM_PER_PAGE,
        dormPage * DORM_PER_PAGE,
    );

    const renderPaginationControls = (
        currentPage: number,
        totalPages: number,
        onPageChange: (page: number) => void,
    ) => {
        if (totalPages <= 1) return null;
        return (
            <div className="flex items-center justify-center gap-2 pt-8 pb-4">
                <button
                    disabled={currentPage === 1}
                    onClick={() => {
                        onPageChange(currentPage - 1);
                    }}
                    className={`flex cursor-pointer items-center gap-1 rounded-xl p-2.5 text-xs font-bold transition-all ${
                        currentPage === 1
                            ? 'cursor-not-allowed bg-slate-100 text-slate-400 opacity-40'
                            : 'border border-[#c8dac5] bg-white text-[#142921] shadow-2xs hover:bg-[#265243] hover:text-white'
                    }`}
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Sebelumnya</span>
                </button>

                <div className="flex items-center gap-1.5 px-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (p) => (
                            <button
                                key={p}
                                onClick={() => {
                                    onPageChange(p);
                                }}
                                className={`h-9 w-9 cursor-pointer rounded-xl text-xs font-black transition-all ${
                                    currentPage === p
                                        ? 'scale-105 bg-[#265243] text-white shadow-md'
                                        : 'border border-[#c8dac5] bg-white text-[#142921] hover:bg-[#eef5eb]'
                                }`}
                            >
                                {p}
                            </button>
                        ),
                    )}
                </div>

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => {
                        onPageChange(currentPage + 1);
                    }}
                    className={`flex cursor-pointer items-center gap-1 rounded-xl p-2.5 text-xs font-bold transition-all ${
                        currentPage === totalPages
                            ? 'cursor-not-allowed bg-slate-100 text-slate-400 opacity-40'
                            : 'border border-[#c8dac5] bg-white text-[#142921] shadow-2xs hover:bg-[#265243] hover:text-white'
                    }`}
                >
                    <span className="hidden sm:inline">Selanjutnya</span>
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        );
    };

    const logoUrl = settings.school_logo_url || null;
    const rawSchoolName = settings.school_name || 'MAN TANJUNGPINANG';
    const schoolName =
        rawSchoolName.trim().toUpperCase() === 'MAN'
            ? 'MAN TANJUNGPINANG'
            : rawSchoolName;
    const schoolTagline =
        settings.school_tagline ||
        'Mewujudkan Generasi Cerdas, Berkarakter, dan Berdaya Saing Global';
    const schoolDesc =
        settings.school_description ||
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
                    const cleanDesc = line.replace(
                        /^(?:\d+[.\)]\s*|-\s*)/,
                        '',
                    );
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
                <meta
                    name="description"
                    content={`Portal Resmi ${schoolName} - ${schoolTagline}`}
                />
                {logoUrl && <link rel="icon" href={logoUrl} />}
                {logoUrl && <link rel="shortcut icon" href={logoUrl} />}
                {logoUrl && <link rel="apple-touch-icon" href={logoUrl} />}
            </Head>

            <div className="flex min-h-screen flex-col justify-between bg-[#f8faf7] font-sans text-[#142921] antialiased selection:bg-[#265243] selection:text-white">
                {/* ── 1. DYNAMIC NAVBAR (ULTRA-SMOOTH MORPHING WITH SAFE TOP SPACING) ── */}
                <div
                    style={{
                        transition:
                            'padding 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                        willChange: 'padding',
                    }}
                    className={`pointer-events-none sticky top-0 z-50 flex w-full justify-center ${
                        isScrolled ? 'px-3 pt-2 sm:px-6 sm:pt-3' : 'px-0 pt-0'
                    }`}
                >
                    <header
                        style={{
                            transition:
                                'max-width 0.6s cubic-bezier(0.22, 1, 0.36, 1), ' +
                                'border-radius 0.6s cubic-bezier(0.22, 1, 0.36, 1), ' +
                                'padding 0.6s cubic-bezier(0.22, 1, 0.36, 1), ' +
                                'background-color 0.6s cubic-bezier(0.22, 1, 0.36, 1), ' +
                                'border-color 0.6s cubic-bezier(0.22, 1, 0.36, 1), ' +
                                'box-shadow 0.6s cubic-bezier(0.22, 1, 0.36, 1), ' +
                                'backdrop-filter 0.6s cubic-bezier(0.22, 1, 0.36, 1), ' +
                                'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                            willChange:
                                'max-width, border-radius, padding, box-shadow, background-color, transform',
                        }}
                        className={`pointer-events-auto flex w-full items-center justify-between border backdrop-blur-xl ${
                            isMobileMenuOpen
                                ? 'max-w-7xl rounded-2xl border-[#c8dac5] bg-white/98 px-4 py-3 shadow-xl sm:px-8'
                                : isScrolled
                                  ? 'max-w-7xl rounded-2xl border-[#c8dac5] bg-white/90 px-4 py-2.5 shadow-lg shadow-[#142921]/5 sm:rounded-full sm:px-6 sm:py-3'
                                  : 'max-w-full rounded-none border-b border-[#e2ebd9] bg-white px-4 py-3.5 shadow-none sm:px-8 sm:py-4'
                        }`}
                    >
                        <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between">
                            {/* Brand Logo & Name */}
                            <div
                                className={`mr-4 flex shrink-0 origin-left cursor-pointer items-center gap-3 lg:mr-8 ${
                                    isScrolled ? 'scale-[0.97]' : 'scale-100'
                                }`}
                                style={{
                                    transition:
                                        'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                                }}
                                onClick={() => handleTabClick('home')}
                            >
                                {settings.school_logo_url ? (
                                    <img
                                        src={settings.school_logo_url}
                                        alt="Logo"
                                        className="h-10 w-10 object-contain"
                                    />
                                ) : (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#265243] text-lg font-black text-white shadow-sm">
                                        S
                                    </div>
                                )}
                                <div>
                                    <h1 className="text-xs leading-tight font-extrabold tracking-tight text-[#142921] sm:text-sm">
                                        {schoolName}
                                    </h1>
                                    <p className="text-[9px] font-bold text-[#527365] sm:text-[10px]">
                                        Portal Resmi Sekolah
                                    </p>
                                </div>
                            </div>

                            {/* Nav Links (Desktop) */}
                            <nav className="hidden items-center gap-1 lg:flex xl:gap-2">
                                <button
                                    onClick={() => handleTabClick('home')}
                                    style={
                                        activeTab === 'home'
                                            ? {
                                                  backgroundColor: '#265243',
                                                  color: '#ffffff',
                                              }
                                            : { color: '#142921' }
                                    }
                                    className={`rounded-full px-3.5 py-2 text-xs font-extrabold whitespace-nowrap transition-all duration-300 ${
                                        activeTab === 'home'
                                            ? 'scale-[1.02] shadow-xs'
                                            : 'hover:bg-[#e2ebd9]'
                                    }`}
                                >
                                    Beranda
                                </button>

                                {/* Profil Dropdown */}
                                <div
                                    className="relative"
                                    onMouseEnter={() =>
                                        setIsProfileDropdownOpen(true)
                                    }
                                    onMouseLeave={() =>
                                        setIsProfileDropdownOpen(false)
                                    }
                                >
                                    <button
                                        onClick={() =>
                                            setIsProfileDropdownOpen(
                                                (prev) => !prev,
                                            )
                                        }
                                        style={
                                            activeTab === 'profile' ||
                                            activeTab === 'vision'
                                                ? {
                                                      backgroundColor:
                                                          '#265243',
                                                      color: '#ffffff',
                                                  }
                                                : { color: '#142921' }
                                        }
                                        className={`flex cursor-pointer items-center gap-1 rounded-full px-3.5 py-2 text-xs font-extrabold whitespace-nowrap transition-all duration-300 ${
                                            activeTab === 'profile' ||
                                            activeTab === 'vision'
                                                ? 'scale-[1.02] shadow-xs'
                                                : 'hover:bg-[#e2ebd9]'
                                        }`}
                                    >
                                        <span>Profil</span>
                                        <ChevronDown
                                            className={`h-3.5 w-3.5 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    {isProfileDropdownOpen && (
                                        <div className="animate-in fade-in slide-in-from-top-2 absolute top-full left-0 z-50 w-52 pt-2 duration-200">
                                            <div className="space-y-1 rounded-2xl border border-[#c8dac5] bg-white p-2 shadow-xl">
                                                <button
                                                    onClick={() => {
                                                        handleTabClick(
                                                            'profile',
                                                        );
                                                        setProfileSubTab(
                                                            'profile',
                                                        );
                                                        setIsProfileDropdownOpen(
                                                            false,
                                                        );
                                                    }}
                                                    className={`flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-xs font-extrabold transition-all ${
                                                        activeTab ===
                                                            'profile' &&
                                                        profileSubTab ===
                                                            'profile'
                                                            ? 'bg-[#265243] text-white shadow-xs'
                                                            : 'text-[#142921] hover:bg-[#f4f8f3]'
                                                    }`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${activeTab === 'profile' && profileSubTab === 'profile' ? 'bg-white' : 'bg-[#265243]'}`}
                                                    ></span>
                                                    <span>Profil Sekolah</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleTabClick(
                                                            'profile',
                                                        );
                                                        setProfileSubTab(
                                                            'vision',
                                                        );
                                                        setIsProfileDropdownOpen(
                                                            false,
                                                        );
                                                    }}
                                                    className={`flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-xs font-extrabold transition-all ${
                                                        activeTab ===
                                                            'profile' &&
                                                        profileSubTab ===
                                                            'vision'
                                                            ? 'bg-[#265243] text-white shadow-xs'
                                                            : 'text-[#142921] hover:bg-[#f4f8f3]'
                                                    }`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${activeTab === 'profile' && profileSubTab === 'vision' ? 'bg-white' : 'bg-[#265243]'}`}
                                                    ></span>
                                                    <span>Visi &amp; Misi</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleTabClick(
                                                            'profile',
                                                        );
                                                        setProfileSubTab(
                                                            'history',
                                                        );
                                                        setIsProfileDropdownOpen(
                                                            false,
                                                        );
                                                    }}
                                                    className={`flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-xs font-extrabold transition-all ${
                                                        activeTab ===
                                                            'profile' &&
                                                        profileSubTab ===
                                                            'history'
                                                            ? 'bg-[#265243] text-white shadow-xs'
                                                            : 'text-[#142921] hover:bg-[#f4f8f3]'
                                                    }`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${activeTab === 'profile' && profileSubTab === 'history' ? 'bg-white' : 'bg-[#265243]'}`}
                                                    ></span>
                                                    <span>Sejarah Singkat</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleTabClick(
                                                            'profile',
                                                        );
                                                        setProfileSubTab(
                                                            'facilities',
                                                        );
                                                        setIsProfileDropdownOpen(
                                                            false,
                                                        );
                                                    }}
                                                    className={`flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-xs font-extrabold transition-all ${
                                                        activeTab ===
                                                            'profile' &&
                                                        profileSubTab ===
                                                            'facilities'
                                                            ? 'bg-[#265243] text-white shadow-xs'
                                                            : 'text-[#142921] hover:bg-[#f4f8f3]'
                                                    }`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${activeTab === 'profile' && profileSubTab === 'facilities' ? 'bg-white' : 'bg-[#265243]'}`}
                                                    ></span>
                                                    <span>
                                                        Sarana & Prasarana
                                                    </span>
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
                                    {
                                        id: 'legalization',
                                        label: 'E-Legalisir',
                                    },
                                    { id: 'complaints', label: 'Pengaduan' },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() =>
                                            handleTabClick(tab.id as any)
                                        }
                                        style={
                                            activeTab === tab.id
                                                ? {
                                                      backgroundColor:
                                                          '#265243',
                                                      color: '#ffffff',
                                                  }
                                                : { color: '#142921' }
                                        }
                                        className={`rounded-full px-3.5 py-2 text-xs font-extrabold whitespace-nowrap transition-all duration-300 ${
                                            activeTab === tab.id
                                                ? 'scale-[1.02] shadow-xs'
                                                : 'hover:bg-[#e2ebd9]'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>

                            {/* Admin Login Button (Desktop) */}
                            <div className="hidden shrink-0 items-center gap-2 lg:flex">
                                {auth?.user ? (
                                    <Link
                                        href="/admin/dashboard"
                                        style={{
                                            backgroundColor: '#265243',
                                            color: '#ffffff',
                                        }}
                                        className="inline-flex items-center gap-2 rounded-full px-4.5 py-2 text-xs font-extrabold shadow-sm transition-all hover:scale-105 hover:bg-[#1a3d31]"
                                    >
                                        <Building2 className="h-3.5 w-3.5 text-white" />{' '}
                                        Admin
                                    </Link>
                                ) : (
                                    <Link
                                        href="/login"
                                        style={{
                                            backgroundColor: '#265243',
                                            color: '#ffffff',
                                        }}
                                        className="inline-flex items-center gap-2 rounded-full px-4.5 py-2 text-xs font-extrabold shadow-sm transition-all hover:scale-105 hover:bg-[#1a3d31]"
                                    >
                                        <LogIn className="h-3.5 w-3.5 text-white" />{' '}
                                        Login
                                    </Link>
                                )}
                            </div>

                            {/* Mobile Hamburger Garis 3 Button (Pojok Kanan Header) */}
                            <button
                                onClick={() =>
                                    setIsMobileMenuOpen((prev) => !prev)
                                }
                                aria-label="Toggle Navigation Menu"
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c8dac5] text-[#142921] shadow-md transition-all lg:hidden ${
                                    isMobileMenuOpen
                                        ? 'bg-white text-[#265243] ring-2 ring-[#265243]/20 hover:bg-[#265243] hover:text-white'
                                        : 'bg-[#f4f8f3] hover:bg-[#265243] hover:text-white'
                                }`}
                            >
                                {isMobileMenuOpen ? (
                                    <X className="h-5 w-5" />
                                ) : (
                                    <Menu className="h-5 w-5" />
                                )}
                            </button>

                            {/* Mobile Listdown Dropdown Menu Panel */}
                            {isMobileMenuOpen && (
                                <div className="animate-in fade-in slide-in-from-top-3 absolute top-full right-0 left-0 z-50 mt-2 space-y-2 rounded-3xl border border-[#c8dac5] bg-white/98 p-4 shadow-2xl backdrop-blur-xl duration-300 lg:hidden">
                                    <div className="space-y-1">
                                        {/* Beranda */}
                                        <button
                                            onClick={() =>
                                                handleTabClick('home')
                                            }
                                            className={`w-full rounded-2xl px-4 py-2.5 text-left text-xs font-black transition-all ${
                                                activeTab === 'home'
                                                    ? 'bg-[#265243] text-white shadow-xs'
                                                    : 'text-[#142921] hover:bg-[#f4f8f3]'
                                            }`}
                                        >
                                            Beranda
                                        </button>

                                        {/* Profil Accordion Dropdown */}
                                        <div className="space-y-1">
                                            <button
                                                onClick={() =>
                                                    setIsMobileProfileOpen(
                                                        (prev) => !prev,
                                                    )
                                                }
                                                className={`flex w-full cursor-pointer items-center justify-between rounded-2xl px-4 py-2.5 text-left text-xs font-black transition-all ${
                                                    activeTab === 'profile' ||
                                                    activeTab === 'vision'
                                                        ? 'bg-[#265243] text-white shadow-xs'
                                                        : 'text-[#142921] hover:bg-[#f4f8f3]'
                                                }`}
                                            >
                                                <span>Profil Sekolah</span>
                                                <ChevronDown
                                                    className={`h-4 w-4 transition-transform duration-200 ${isMobileProfileOpen ? 'rotate-180 text-[#265243]' : activeTab === 'profile' || activeTab === 'vision' ? 'text-white' : 'text-[#265243]'}`}
                                                />
                                            </button>

                                            {isMobileProfileOpen && (
                                                <div className="animate-in fade-in space-y-1.5 py-1 pl-4 duration-200">
                                                    <button
                                                        onClick={() => {
                                                            handleTabClick(
                                                                'profile',
                                                            );
                                                            setProfileSubTab(
                                                                'profile',
                                                            );
                                                            setIsMobileMenuOpen(
                                                                false,
                                                            );
                                                        }}
                                                        className={`flex w-full items-center gap-2.5 rounded-xl px-4 py-2 text-left text-xs font-extrabold transition-all ${
                                                            activeTab ===
                                                                'profile' &&
                                                            profileSubTab ===
                                                                'profile'
                                                                ? 'bg-[#265243] text-white shadow-2xs'
                                                                : 'border border-[#c8dac5]/50 bg-[#f4f8f3] text-[#142921] hover:bg-[#e2ebd9]'
                                                        }`}
                                                    >
                                                        <span
                                                            className={`h-2 w-2 shrink-0 rounded-full ${activeTab === 'profile' && profileSubTab === 'profile' ? 'bg-white' : 'bg-[#265243]'}`}
                                                        ></span>
                                                        <span>
                                                            Profil Sekolah
                                                        </span>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleTabClick(
                                                                'profile',
                                                            );
                                                            setProfileSubTab(
                                                                'vision',
                                                            );
                                                            setIsMobileMenuOpen(
                                                                false,
                                                            );
                                                        }}
                                                        className={`flex w-full items-center gap-2.5 rounded-xl px-4 py-2 text-left text-xs font-extrabold transition-all ${
                                                            activeTab ===
                                                                'profile' &&
                                                            profileSubTab ===
                                                                'vision'
                                                                ? 'bg-[#265243] text-white shadow-2xs'
                                                                : 'border border-[#c8dac5]/50 bg-[#f4f8f3] text-[#142921] hover:bg-[#e2ebd9]'
                                                        }`}
                                                    >
                                                        <span
                                                            className={`h-2 w-2 shrink-0 rounded-full ${activeTab === 'profile' && profileSubTab === 'vision' ? 'bg-white' : 'bg-[#265243]'}`}
                                                        ></span>
                                                        <span>
                                                            Visi &amp; Misi
                                                        </span>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleTabClick(
                                                                'profile',
                                                            );
                                                            setProfileSubTab(
                                                                'history',
                                                            );
                                                            setIsMobileMenuOpen(
                                                                false,
                                                            );
                                                        }}
                                                        className={`flex w-full items-center gap-2.5 rounded-xl px-4 py-2 text-left text-xs font-extrabold transition-all ${
                                                            activeTab ===
                                                                'profile' &&
                                                            profileSubTab ===
                                                                'history'
                                                                ? 'bg-[#265243] text-white shadow-2xs'
                                                                : 'border border-[#c8dac5]/50 bg-[#f4f8f3] text-[#142921] hover:bg-[#e2ebd9]'
                                                        }`}
                                                    >
                                                        <span
                                                            className={`h-2 w-2 shrink-0 rounded-full ${activeTab === 'profile' && profileSubTab === 'history' ? 'bg-white' : 'bg-[#265243]'}`}
                                                        ></span>
                                                        <span>
                                                            Sejarah Singkat
                                                        </span>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleTabClick(
                                                                'profile',
                                                            );
                                                            setProfileSubTab(
                                                                'facilities',
                                                            );
                                                            setIsMobileMenuOpen(
                                                                false,
                                                            );
                                                        }}
                                                        className={`flex w-full items-center gap-2.5 rounded-xl px-4 py-2 text-left text-xs font-extrabold transition-all ${
                                                            activeTab ===
                                                                'profile' &&
                                                            profileSubTab ===
                                                                'facilities'
                                                                ? 'bg-[#265243] text-white shadow-2xs'
                                                                : 'border border-[#c8dac5]/50 bg-[#f4f8f3] text-[#142921] hover:bg-[#e2ebd9]'
                                                        }`}
                                                    >
                                                        <span
                                                            className={`h-2 w-2 shrink-0 rounded-full ${activeTab === 'profile' && profileSubTab === 'facilities' ? 'bg-white' : 'bg-[#265243]'}`}
                                                        ></span>
                                                        <span>
                                                            Sarana & Prasarana
                                                        </span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Menu Items Without Dropdown (NO ChevronRight) */}
                                        {[
                                            {
                                                id: 'news',
                                                label: 'Berita & Pengumuman',
                                            },
                                            {
                                                id: 'gallery',
                                                label: 'Galeri Dokumentasi',
                                            },
                                            {
                                                id: 'books',
                                                label: 'Perpustakaan Digital',
                                            },
                                            {
                                                id: 'dormitory',
                                                label: 'Informasi Asrama',
                                            },
                                            {
                                                id: 'legalization',
                                                label: 'Permohonan Legalisir',
                                            },
                                            {
                                                id: 'complaints',
                                                label: 'Kotak Pengaduan',
                                            },
                                        ].map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() =>
                                                    handleTabClick(
                                                        tab.id as any,
                                                    )
                                                }
                                                className={`w-full rounded-2xl px-4 py-2.5 text-left text-xs font-black transition-all ${
                                                    activeTab === tab.id
                                                        ? 'bg-[#265243] text-white shadow-xs'
                                                        : 'text-[#142921] hover:bg-[#f4f8f3]'
                                                }`}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="border-t border-[#c8dac5] pt-2">
                                        {auth?.user ? (
                                            <Link
                                                href="/admin/dashboard"
                                                onClick={() =>
                                                    setIsMobileMenuOpen(false)
                                                }
                                                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#265243] px-4 py-2.5 text-xs font-black text-white shadow-sm transition-all hover:bg-[#1a3d31]"
                                            >
                                                <Building2 className="h-4 w-4 text-white" />{' '}
                                                Dashboard Admin
                                            </Link>
                                        ) : (
                                            <Link
                                                href="/login"
                                                onClick={() =>
                                                    setIsMobileMenuOpen(false)
                                                }
                                                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#265243] px-4 py-2.5 text-xs font-black text-white shadow-sm transition-all hover:bg-[#1a3d31]"
                                            >
                                                <LogIn className="h-4 w-4 text-white" />{' '}
                                                Login Admin
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
                    <div className="mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between rounded-2xl bg-[#265243] p-4 text-xs font-bold text-white shadow-lg">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                                <span>{flash.success}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── 2. HERO BANNER SLIDER (ROUNDED CARD WITH WATERMARK TYPOGRAPHY - MATCHING IMAGE 1 REFERENCE) ── */}
                {activeTab === 'home' && (
                    <div className="relative z-30 mx-auto mt-4 w-full max-w-[98%] px-2 sm:mt-6 sm:px-4 xl:max-w-[96%]">
                        <div
                            onTouchStart={handleBannerTouchStart}
                            onTouchEnd={handleBannerTouchEnd}
                            className="relative flex min-h-[620px] flex-col justify-between overflow-hidden rounded-[2rem] border border-emerald-900/30 bg-[#142921] p-6 text-white shadow-2xl sm:min-h-[720px] sm:rounded-[2.5rem] sm:p-12 lg:min-h-[800px] lg:p-14"
                        >
                            {/* Background Images */}
                            {banners.length > 0 ? (
                                banners.map((b, idx) => (
                                    <div
                                        key={b.id}
                                        className={`absolute inset-0 transition-opacity duration-700 ${
                                            idx === currentBannerIndex
                                                ? 'z-0 opacity-100'
                                                : 'z-0 opacity-0'
                                        }`}
                                    >
                                        {b.image ? (
                                            <img
                                                src={b.image}
                                                alt={b.title}
                                                className="h-full w-full object-cover opacity-50"
                                            />
                                        ) : (
                                            <div className="h-full w-full bg-[#142921] opacity-40" />
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="absolute inset-0 z-0 bg-[#142921] opacity-40" />
                            )}

                            {/* Solid Dark Overlay */}
                            <div className="absolute inset-0 z-10 bg-black/60" />

                            {/* GIANT BACKGROUND WATERMARK TYPOGRAPHY (EXACT MATCH IMAGE 1 - "OXFORD" STYLE) */}
                            <div
                                className={`pointer-events-none absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center overflow-hidden transition-opacity duration-1000 select-none ${showWatermark ? 'opacity-100' : 'opacity-0'}`}
                            >
                                <span className="text-[7rem] leading-none font-black tracking-widest whitespace-nowrap text-white/10 uppercase sm:text-[13rem] lg:text-[17rem]">
                                    {banners[currentBannerIndex]?.title
                                        ? banners[
                                              currentBannerIndex
                                          ].title.split(' ')[0]
                                        : 'PRESTASI'}
                                </span>
                            </div>

                            {/* Top Row inside Banner Card: Small Tag */}
                            <div className="relative z-20 flex items-center justify-between">
                                <span className="rounded-full bg-[#0d2a20] px-4 py-1.5 text-xs font-extrabold tracking-wider text-white uppercase shadow-xs">
                                    TAHUN AJARAN {new Date().getFullYear()} -{' '}
                                    {new Date().getFullYear() + 1}
                                </span>
                                <span className="hidden text-xs font-bold tracking-widest text-white/70 uppercase sm:inline-block">
                                    {schoolName}
                                </span>
                            </div>

                            {/* Bottom Row inside Banner Card: Left Info & Right Round Arrow Navigation (< and >) */}
                            <div className="relative z-20 flex flex-col justify-between gap-8 pt-20 sm:flex-row sm:items-end sm:pt-32">
                                {/* Left Info & Subtitle */}
                                <div className="max-w-3xl space-y-4">
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-xs font-black tracking-wider text-emerald-400 sm:text-sm">
                                            0{currentBannerIndex + 1} / 0
                                            {banners.length || 1}
                                        </span>
                                        <span className="h-0.5 w-10 bg-emerald-400/60" />
                                    </div>
                                    <h2 className="text-3xl leading-tight font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                                        {banners[currentBannerIndex]?.title ||
                                            schoolName}
                                    </h2>
                                    <p className="line-clamp-3 max-w-2xl text-xs leading-relaxed font-medium text-emerald-100/90 sm:text-base">
                                        {banners[currentBannerIndex]
                                            ?.subtitle || schoolTagline}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-3 pt-3">
                                        <button
                                            onClick={() =>
                                                handleTabClick('news')
                                            }
                                            className="rounded-full bg-white px-6 py-3 text-xs font-black text-[#265243] shadow-lg transition-all hover:bg-emerald-50 sm:text-sm"
                                        >
                                            Baca Berita Terbaru
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleTabClick('legalization')
                                            }
                                            className="rounded-full border border-white/30 bg-white/20 px-6 py-3 text-xs font-black text-white backdrop-blur-md transition-all hover:bg-white/30 sm:text-sm"
                                        >
                                            Layanan E-Legalisir
                                        </button>
                                    </div>
                                </div>

                                {/* Right Round Arrow Slider Buttons (< and >) */}
                                {banners.length > 1 && (
                                    <div className="hidden shrink-0 items-center gap-2.5 self-end sm:flex sm:self-auto">
                                        <button
                                            onClick={() =>
                                                setCurrentBannerIndex(
                                                    (prev) =>
                                                        (prev -
                                                            1 +
                                                            banners.length) %
                                                        banners.length,
                                                )
                                            }
                                            aria-label="Previous Banner"
                                            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#142921] shadow-lg transition-all hover:scale-105 hover:bg-[#265243] hover:text-white active:scale-95"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                setCurrentBannerIndex(
                                                    (prev) =>
                                                        (prev + 1) %
                                                        banners.length,
                                                )
                                            }
                                            aria-label="Next Banner"
                                            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#142921] shadow-lg transition-all hover:scale-105 hover:bg-[#265243] hover:text-white active:scale-95"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── 3. SECTION: KOTAK PINTASAN CEPAT (WHITE WRAPPER WITH FULL EDGE-TO-EDGE HOVER FILL) ── */}
                {activeTab === 'home' && (
                    <div className="relative z-30 mx-auto mt-4 w-full max-w-[98%] px-2 sm:mt-5 sm:px-4 xl:max-w-[96%]">
                        <div className="overflow-hidden rounded-3xl border border-[#c8dac5] bg-white shadow-sm">
                            <div className="grid grid-cols-2 divide-x divide-y divide-[#c8dac5]/50 lg:grid-cols-4 lg:divide-y-0">
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
                                        onClick={() =>
                                            handleTabClick(st.tab as any)
                                        }
                                        className="group flex cursor-pointer items-center justify-between gap-2.5 bg-transparent p-3.5 text-[#142921] transition-all duration-300 hover:bg-[#265243] hover:text-white sm:p-4.5"
                                    >
                                        <div className="flex min-w-0 items-center gap-2.5">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#c8dac5] bg-[#f4f8f3] text-[#265243] shadow-xs transition-all group-hover:scale-105 group-hover:border-transparent group-hover:bg-white/20 group-hover:text-white sm:h-9 sm:w-9">
                                                <st.icon className="h-4 w-4" />
                                            </div>
                                            <h4 className="truncate text-xs font-black text-[#142921] transition-colors group-hover:text-white sm:text-sm">
                                                {st.title}
                                            </h4>
                                        </div>

                                        <span className="hidden shrink-0 rounded-full border border-[#c8dac5] bg-[#f4f8f3] px-2.5 py-1 text-[10px] font-black text-[#265243] transition-all group-hover:border-transparent group-hover:bg-white/20 group-hover:text-emerald-100 sm:inline-block sm:text-[11px]">
                                            {st.count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── MAIN CONTENT CONTAINER ───────────────────────────────────────── */}
                <main className="mx-auto w-full max-w-7xl flex-1 space-y-12 px-4 pt-6 pb-16 sm:space-y-18 sm:px-6 sm:pt-8 lg:px-8">
                    {/* ========================================================================= */}
                    {/* TAB 1: BERANDA / HOME                                                     */}
                    {/* ========================================================================= */}
                    {activeTab === 'home' && (
                        <div className="space-y-12 sm:space-y-18 lg:space-y-20">
                            {/* SECTION: SAMBUTAN KEPALA SEKOLAH (EXTENDED CARD WIDTH HORIZONTALLY & VERTICALLY FOR DESKTOP) */}
                            <section className="space-y-10 pb-4 sm:space-y-14 lg:pb-8">
                                <div className="relative -mx-6 mt-6 pt-16 sm:-mx-12 sm:mt-10 sm:pt-28 lg:-mx-20 lg:pt-32">
                                    <div className="relative flex min-h-[580px] flex-col justify-between space-y-16 rounded-[2.5rem] bg-[#064e3b] p-8 text-white shadow-2xl sm:space-y-20 sm:rounded-[3.5rem] sm:p-14 lg:min-h-[680px] lg:p-20">
                                        {/* MAIN GRID: KATA SAMBUTAN (LEFT 7 COLS) & FOTO RECTANGLE SUPER ROUNDED (RIGHT 5 COLS) */}
                                        <div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
                                            {/* KOLOM KIRI: KATA SAMBUTAN (SOLID CLEAN TYPOGRAPHY) */}
                                            <div className="relative space-y-8 lg:col-span-7">
                                                {/* Low-opacity decorative quotation mark */}
                                                <div className="pointer-events-none absolute -top-10 -left-6 z-0 text-[11rem] leading-none font-black text-[#10b981]/15 select-none">
                                                    “
                                                </div>

                                                <div className="relative z-10 space-y-2">
                                                    <h3 className="font-sans text-2xl leading-tight font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                                                        Selamat Datang di{' '}
                                                        {schoolName}
                                                    </h3>
                                                </div>

                                                {/* Editorial Paragraphs */}
                                                <div className="relative z-10 max-w-3xl space-y-4 text-xs leading-relaxed font-normal text-slate-100 sm:text-sm lg:text-base">
                                                    {settings.principal_bio ? (
                                                        <div className="space-y-3 font-medium whitespace-pre-line">
                                                            {
                                                                settings.principal_bio
                                                            }
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <p className="text-sm font-bold text-white italic sm:text-base lg:text-lg">
                                                                Assalamu'alaikum
                                                                Warahmatullahi
                                                                Wabarakatuh,
                                                            </p>
                                                            <p>
                                                                Selamat datang
                                                                di portal resmi{' '}
                                                                {settings.school_name ||
                                                                    'MAN Tanjungpinang'}
                                                                . Sebagai
                                                                lembaga
                                                                pendidikan
                                                                unggulan, kami
                                                                berkomitmen
                                                                menyelenggarakan
                                                                pembelajaran
                                                                bermutu tinggi
                                                                yang melahirkan
                                                                generasi cerdas,
                                                                berkarakter
                                                                Pancasila, serta
                                                                tangguh
                                                                menghadapi
                                                                tantangan
                                                                global.
                                                            </p>
                                                            <p className="pt-1 font-bold text-white italic">
                                                                Wassalamu'alaikum
                                                                Warahmatullahi
                                                                Wabarakatuh.
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* KOLOM KANAN: FOTO RECTANGLE SUPER ROUNDED (FLOAT NAME & TITLE TO BOTTOM-LEFT OF PHOTO) */}
                                            <div className="relative z-20 mt-4 flex items-center justify-center pt-4 sm:-mt-36 lg:col-span-5 lg:-mt-52 lg:justify-end lg:pt-0">
                                                {/* Super Rounded Container with Soft Yellow Tone (#fef08a) */}
                                                <div className="relative z-10 flex h-[380px] w-72 shrink-0 items-center justify-center overflow-hidden rounded-[6rem] bg-[#fef08a] shadow-2xl sm:h-[440px] sm:w-88 lg:h-[500px] lg:w-[400px]">
                                                    {settings.principal_photo_url ? (
                                                        <img
                                                            src={
                                                                settings.principal_photo_url
                                                            }
                                                            alt="Foto Kepala Sekolah"
                                                            className="h-full w-full rounded-[6rem] object-cover object-top"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full flex-col items-center justify-center bg-[#fef08a] p-8 text-center text-[#022c22]">
                                                            <User className="mb-2 h-24 w-24 text-[#064e3b]" />
                                                            <span className="text-xs font-bold text-[#064e3b]">
                                                                Foto Kepala
                                                                Sekolah
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Floating Overlay Card (Principal Name & Title - Floated at bottom-left of photo) */}
                                                <div className="absolute -bottom-4 -left-2 z-30 max-w-[220px] transform space-y-1.5 rounded-2xl border border-white/15 bg-[#0b2b22] p-4 shadow-2xl transition-all hover:scale-105 sm:-bottom-6 sm:left-2 sm:max-w-[250px] sm:p-5 lg:-bottom-8 lg:-left-8">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#10b981]/40 bg-[#059669]/40 text-[#10b981]">
                                                            <GraduationCap className="h-4 w-4" />
                                                        </div>
                                                        <span className="text-[10px] font-bold tracking-wider text-[#10b981] uppercase sm:text-xs">
                                                            {settings.principal_title ||
                                                                'Kepala Sekolah'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-sans text-sm leading-snug font-extrabold text-white sm:text-base">
                                                            {settings.principal_name ||
                                                                'Ulfah Ismiati, S.Pd, M.M'}
                                                        </h4>
                                                    </div>
                                                    <p className="border-t border-white/10 pt-1 text-[10px] leading-snug font-medium text-slate-300 sm:text-xs">
                                                        Membangun Generasi
                                                        Pendidikan Berkualitas
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* SECTION STATISTIK BAWAH (CLEAN WITHOUT DIVIDER LINE) */}
                                        <div className="relative z-10 border-t border-white/10 pt-8 sm:pt-14">
                                            <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
                                                {/* Item 1 */}
                                                <div className="flex flex-col items-start space-y-1">
                                                    <h4 className="font-sans text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                                                        <AnimatedCounter
                                                            value={
                                                                settings.total_students ||
                                                                '850+'
                                                            }
                                                        />
                                                    </h4>
                                                    <p className="text-xs font-bold tracking-wider text-[#93c5fd]/75 uppercase sm:text-sm">
                                                        SISWA AKTIF
                                                    </p>
                                                </div>

                                                {/* Item 2 */}
                                                <div className="flex flex-col items-start space-y-1">
                                                    <h4 className="font-sans text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                                                        <AnimatedCounter
                                                            value={
                                                                settings.total_teachers ||
                                                                '54+'
                                                            }
                                                        />
                                                    </h4>
                                                    <p className="text-xs font-bold tracking-wider text-[#93c5fd]/75 uppercase sm:text-sm">
                                                        GURU & STAF
                                                    </p>
                                                </div>

                                                {/* Item 3 */}
                                                <div className="flex flex-col items-start space-y-1">
                                                    <h4 className="font-sans text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                                                        <AnimatedCounter
                                                            value={
                                                                settings.total_classrooms ||
                                                                '24'
                                                            }
                                                        />
                                                    </h4>
                                                    <p className="text-xs font-bold tracking-wider text-[#93c5fd]/75 uppercase sm:text-sm">
                                                        RUANG KELAS
                                                    </p>
                                                </div>

                                                {/* Item 4 */}
                                                <div className="flex flex-col items-start space-y-1">
                                                    <h4 className="font-sans text-3xl font-extrabold tracking-tight text-orange-400 sm:text-5xl">
                                                        <AnimatedCounter
                                                            value={
                                                                settings.accreditation ||
                                                                'A (Unggul)'
                                                            }
                                                        />
                                                    </h4>
                                                    <p className="text-xs font-bold tracking-wider text-[#93c5fd]/75 uppercase sm:text-sm">
                                                        AKREDITASI
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* SECTION: GALERI DOKUMENTASI */}
                            <section className="mt-8 space-y-10 pt-3 pb-6 sm:mt-12 sm:pt-5 lg:pb-12">
                                {/* CENTERED TITLE & SUBTITLE ABOVE GALERI (AS REQUESTED) */}
                                <div className="mx-auto max-w-2xl space-y-2 text-center">
                                    <p className="text-xs font-extrabold tracking-widest text-[#527365] uppercase italic sm:text-sm">
                                        Dokumentasi Unggulan
                                    </p>
                                    <h3 className="font-sans text-3xl leading-tight font-black tracking-tight text-[#142921] sm:text-5xl">
                                        Fasilitas & Layanan Pendidikan
                                        Terlengkap
                                    </h3>
                                </div>

                                {featuredGalleries.length > 0 ? (
                                    <div className="space-y-6 px-3 sm:-mx-12 sm:px-0 lg:-mx-20">
                                        {/* HERO SHOWCASE CARD WITH GIANT WATERMARK TYPOGRAPHY */}
                                        <div
                                            onClick={() =>
                                                setSelectedGallery(
                                                    featuredGalleries[
                                                        activeGalleryIndex %
                                                            (featuredGalleries.length ||
                                                                1)
                                                    ],
                                                )
                                            }
                                            onTouchStart={
                                                handleGalleryTouchStart
                                            }
                                            onTouchEnd={handleGalleryTouchEnd}
                                            className="group relative flex min-h-[420px] cursor-pointer flex-col justify-between overflow-hidden rounded-[2.5rem] bg-[#142921] p-6 text-white shadow-xl sm:min-h-[540px] sm:p-10 lg:min-h-[620px] lg:p-12"
                                        >
                                            {/* Active Gallery Image */}
                                            {featuredGalleries[
                                                activeGalleryIndex %
                                                    (featuredGalleries.length ||
                                                        1)
                                            ]?.display_image ? (
                                                <img
                                                    src={
                                                        featuredGalleries[
                                                            activeGalleryIndex %
                                                                (featuredGalleries.length ||
                                                                    1)
                                                        ].display_image!
                                                    }
                                                    alt={
                                                        featuredGalleries[
                                                            activeGalleryIndex %
                                                                (featuredGalleries.length ||
                                                                    1)
                                                        ].title
                                                    }
                                                    className="absolute inset-0 h-full w-full object-cover opacity-100 transition-transform duration-700 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-[#142921]" />
                                            )}

                                            {/* Solid Overlay for Text Legibility */}
                                            <div className="absolute inset-0 z-10 bg-black/50" />

                                            {/* Top Row inside Showcase Card: Clean Pill Badges */}
                                            <div className="relative z-20 flex items-center justify-between">
                                                <span className="rounded-full bg-[#265243] px-4 py-1.5 text-xs font-black tracking-wider text-white uppercase shadow-md">
                                                    DOKUMENTASI VISUAL
                                                </span>
                                                <span className="rounded-full border border-emerald-700/50 bg-[#142921] px-3.5 py-1 text-[11px] font-extrabold tracking-wider text-emerald-100 uppercase">
                                                    {featuredGalleries[
                                                        activeGalleryIndex %
                                                            (featuredGalleries.length ||
                                                                1)
                                                    ]?.category || 'FASILITAS'}
                                                </span>
                                            </div>

                                            {/* Bottom Row inside Showcase Card */}
                                            <div className="relative z-20 space-y-4 pt-20">
                                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                                                    <div className="max-w-2xl space-y-2">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-3xl font-black tracking-tighter text-white/90 sm:text-4xl">
                                                                0
                                                                {(activeGalleryIndex %
                                                                    (featuredGalleries.length ||
                                                                        1)) +
                                                                    1}
                                                                <span className="text-xl text-emerald-400/80">
                                                                    /0
                                                                    {
                                                                        featuredGalleries.length
                                                                    }
                                                                </span>
                                                            </span>
                                                            <span className="rounded-full bg-[#265243] px-3 py-1 text-xs font-extrabold text-emerald-100 uppercase shadow-xs">
                                                                {featuredGalleries[
                                                                    activeGalleryIndex %
                                                                        (featuredGalleries.length ||
                                                                            1)
                                                                ]?.type ===
                                                                'youtube'
                                                                    ? 'Video'
                                                                    : 'Foto'}
                                                            </span>
                                                        </div>
                                                        <h5 className="text-xl font-black text-white transition-colors group-hover:text-emerald-300 sm:text-3xl">
                                                            {
                                                                featuredGalleries[
                                                                    activeGalleryIndex %
                                                                        (featuredGalleries.length ||
                                                                            1)
                                                                ]?.title
                                                            }
                                                        </h5>
                                                        {featuredGalleries[
                                                            activeGalleryIndex %
                                                                (featuredGalleries.length ||
                                                                    1)
                                                        ]?.description && (
                                                            <p className="line-clamp-2 text-xs leading-relaxed font-medium text-slate-200 sm:text-sm">
                                                                {
                                                                    featuredGalleries[
                                                                        activeGalleryIndex %
                                                                            (featuredGalleries.length ||
                                                                                1)
                                                                    ]
                                                                        .description
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="hidden shrink-0 items-center gap-2 sm:flex">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveGalleryIndex(
                                                                    (prev) =>
                                                                        (prev -
                                                                            1 +
                                                                            featuredGalleries.length) %
                                                                        featuredGalleries.length,
                                                                );
                                                            }}
                                                            aria-label="Previous Gallery Item"
                                                            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white shadow-md backdrop-blur-md transition-all hover:bg-white hover:text-black"
                                                        >
                                                            <ChevronLeft className="h-6 w-6" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveGalleryIndex(
                                                                    (prev) =>
                                                                        (prev +
                                                                            1) %
                                                                        featuredGalleries.length,
                                                                );
                                                            }}
                                                            aria-label="Next Gallery Item"
                                                            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white shadow-md backdrop-blur-md transition-all hover:bg-white hover:text-black"
                                                        >
                                                            <ChevronRight className="h-6 w-6" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Slide Progress Indicator Dots / Lines under photo */}
                                        {featuredGalleries.length > 1 && (
                                            <div className="flex items-center justify-center gap-2 pt-2 pb-1">
                                                {featuredGalleries.map(
                                                    (_, idx) => {
                                                        const isActive =
                                                            idx ===
                                                            activeGalleryIndex %
                                                                featuredGalleries.length;
                                                        return (
                                                            <button
                                                                key={idx}
                                                                onClick={() =>
                                                                    setActiveGalleryIndex(
                                                                        idx,
                                                                    )
                                                                }
                                                                aria-label={`Go to slide ${idx + 1}`}
                                                                className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                                                                    isActive
                                                                        ? 'w-8 bg-[#265243] shadow-xs'
                                                                        : 'w-2 bg-[#c8dac5] hover:bg-[#527365]'
                                                                }`}
                                                            />
                                                        );
                                                    },
                                                )}
                                            </div>
                                        )}

                                        {/* Mobile "Lihat Semua Galeri" Button (Rendered directly under slide indicators) */}
                                        <div className="flex justify-center pt-1 sm:hidden">
                                            <button
                                                onClick={() =>
                                                    handleTabClick('gallery')
                                                }
                                                className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full border border-[#c8dac5] bg-[#f4f8f3] px-6 py-3 text-center text-xs font-extrabold text-[#265243] shadow-xs transition-all hover:bg-[#265243] hover:text-white"
                                            >
                                                <span>Lihat Semua Galeri</span>
                                            </button>
                                        </div>

                                        {/* Interactive Thumbnail Carousel (Hidden on Mobile, Visible on Desktop) */}
                                        <div className="hidden grid-cols-3 gap-4 pt-2 sm:grid lg:grid-cols-6">
                                            {featuredGalleries.map(
                                                (item, idx) => (
                                                    <div
                                                        key={item.id}
                                                        onClick={() =>
                                                            setActiveGalleryIndex(
                                                                idx,
                                                            )
                                                        }
                                                        className={`group relative h-28 cursor-pointer overflow-hidden rounded-2xl border transition-all lg:h-32 ${
                                                            idx ===
                                                            activeGalleryIndex %
                                                                (featuredGalleries.length ||
                                                                    1)
                                                                ? 'scale-[1.02] border-[#265243] shadow-lg ring-4 ring-[#265243]'
                                                                : 'border-[#c8dac5] opacity-80 hover:border-[#265243] hover:opacity-100'
                                                        }`}
                                                    >
                                                        {item.display_image ? (
                                                            <img
                                                                src={
                                                                    item.display_image
                                                                }
                                                                alt={item.title}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-[#f4f8f3] text-[#265243]">
                                                                <ImageIcon className="h-6 w-6" />
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-x-0 bottom-0 flex items-end bg-black/70 p-2">
                                                            <p className="truncate text-[11px] font-bold text-white">
                                                                {item.title}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ),
                                            )}

                                            {/* 6th Slot Desktop Button */}
                                            <div className="col-span-1 flex h-28 items-center justify-center lg:h-32">
                                                <button
                                                    onClick={() =>
                                                        handleTabClick(
                                                            'gallery',
                                                        )
                                                    }
                                                    className="group inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#c8dac5] bg-[#f4f8f3] px-5 py-3 text-xs font-extrabold whitespace-nowrap text-[#265243] shadow-xs transition-all hover:bg-[#265243] hover:text-white"
                                                >
                                                    <span>
                                                        Lihat Semua Galeri
                                                    </span>
                                                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-2xl border border-[#c8dac5] bg-white p-12 text-center">
                                        <ImageIcon className="mx-auto mb-3 h-12 w-12 text-[#265243]" />
                                        <p className="text-sm font-bold text-[#142921]">
                                            Belum ada foto atau video dalam
                                            galeri.
                                        </p>
                                    </div>
                                )}
                            </section>

                            {/* SECTION: BERITA TERBARU (SHOW 6 ITEMS) */}
                            <section className="mt-6 space-y-8 px-3 pt-2 sm:-mx-12 sm:mt-10 sm:px-0 sm:pt-4 lg:-mx-20">
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold tracking-widest text-[#527365] uppercase">
                                            Informasi & Pengumuman
                                        </p>
                                        <h3 className="font-sans text-3xl leading-tight font-black tracking-tight text-[#142921] sm:text-5xl">
                                            Kabar & Prestasi Terbaru Sekolah
                                        </h3>
                                    </div>
                                    {/* Desktop Only: Top-Right Button */}
                                    <button
                                        onClick={() => handleTabClick('news')}
                                        className="group hidden shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-[#c8dac5] bg-[#f4f8f3] px-5 py-2 text-xs font-extrabold text-[#265243] shadow-xs transition-all hover:bg-[#265243] hover:text-white sm:inline-flex"
                                    >
                                        <span>Lihat Semua Berita</span>
                                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                    </button>
                                </div>

                                {news.length === 0 ? (
                                    <div className="rounded-2xl border border-[#c8dac5] bg-white p-12 text-center">
                                        <Newspaper className="mx-auto mb-3 h-12 w-12 text-[#265243]" />
                                        <p className="text-sm font-bold text-[#142921]">
                                            Belum ada artikel berita yang
                                            dipublikasikan.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                            {news
                                                .slice(0, 6)
                                                .map((item, idx) => (
                                                    <Link
                                                        key={item.id}
                                                        href={`/news/${item.slug}`}
                                                        className="group relative flex flex-col justify-between overflow-hidden rounded-[2.25rem] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                                                    >
                                                        {/* Top Badge */}
                                                        <div className="absolute top-4 left-4 z-10">
                                                            <span className="rounded-md bg-[#f59e0b] px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-white uppercase shadow-md sm:text-[11px]">
                                                                {idx === 0
                                                                    ? 'BARU'
                                                                    : 'BERITA'}
                                                            </span>
                                                        </div>

                                                        {/* Mentok Image Container */}
                                                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                                                            {item.thumbnail ? (
                                                                <img
                                                                    src={
                                                                        item.thumbnail
                                                                    }
                                                                    alt={
                                                                        item.title
                                                                    }
                                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                                />
                                                            ) : (
                                                                <div className="flex h-full w-full items-center justify-center bg-[#e8efe5] text-[#265243]">
                                                                    <ImageIcon className="h-10 w-10" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Content Body */}
                                                        <div className="flex flex-1 flex-col justify-between space-y-4 p-5 sm:p-6">
                                                            <div>
                                                                {/* Centered Title */}
                                                                <h4 className="mb-2 line-clamp-2 px-1 text-center font-sans text-base leading-snug font-extrabold text-[#142921] transition-colors group-hover:text-[#265243] sm:text-lg">
                                                                    {item.title}
                                                                </h4>

                                                                {/* Centered Views Count */}
                                                                <div className="my-1.5 flex items-center justify-center gap-1.5 text-xs font-extrabold text-[#527365]">
                                                                    <Eye className="h-3.5 w-3.5 text-[#265243]" />
                                                                    <span>
                                                                        {item.views_count ||
                                                                            0}{' '}
                                                                        Dilihat
                                                                    </span>
                                                                </div>

                                                                {/* Centered Metadata */}
                                                                <p className="flex items-center justify-center gap-1.5 text-center text-[11px] font-bold text-[#527365] sm:text-xs">
                                                                    <Calendar className="h-3.5 w-3.5 text-[#265243]" />
                                                                    <span>
                                                                        {item.published_at ||
                                                                            'Terbaru'}
                                                                    </span>
                                                                    <span>
                                                                        •
                                                                    </span>
                                                                    <User className="h-3.5 w-3.5 text-[#265243]" />
                                                                    <span>
                                                                        {
                                                                            item.author
                                                                        }
                                                                    </span>
                                                                </p>
                                                            </div>

                                                            {/* Bottom Action Button */}
                                                            <div className="pt-2">
                                                                <span className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full border border-[#c8dac5] bg-white px-4 py-2.5 text-xs font-black text-[#265243] shadow-2xs transition-all group-hover:bg-[#265243] group-hover:text-white">
                                                                    <span>
                                                                        Baca
                                                                        Selengkapnya
                                                                    </span>
                                                                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                        </div>

                                        {/* Mobile Only: Bottom "Lihat Semua Berita" Button */}
                                        <div className="flex justify-center pt-2 sm:hidden">
                                            <button
                                                onClick={() =>
                                                    handleTabClick('news')
                                                }
                                                className="group inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-[#c8dac5] bg-[#f4f8f3] px-6 py-3 text-xs font-extrabold text-[#265243] shadow-xs transition-all hover:bg-[#265243] hover:text-white"
                                            >
                                                <span>Lihat Semua Berita</span>
                                                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
                        <div className="animate-in fade-in relative space-y-8 px-3 duration-300 sm:-mx-12 sm:px-0 lg:-mx-20">
                            {/* VIDEO PROFIL HEADER */}
                            {/* VIDEO PROFIL HEADER (NO BORDER) */}
                            {(settings.principal_media_type ?? 'video') ===
                            'photo' ? (
                                <div className="relative flex aspect-video max-h-[500px] w-full items-center justify-center overflow-hidden rounded-3xl bg-slate-900 shadow-xl sm:rounded-[2.5rem]">
                                    <img
                                        src={
                                            settings.principal_media_photo_url ||
                                            settings.principal_photo_url ||
                                            '/images/school-banner.jpg'
                                        }
                                        alt="Foto Media Profil Sekolah"
                                        className="absolute inset-0 h-full w-full object-cover opacity-85"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                '/images/school-banner.jpg';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/40" />
                                    <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center gap-3 p-6 text-center text-white sm:p-10">
                                        <span className="rounded-full bg-[#265243] px-4 py-1.5 text-xs font-black tracking-wider text-white uppercase shadow-md">
                                            PROFIL SEKOLAH
                                        </span>
                                        <h2 className="text-2xl font-black tracking-tight text-white drop-shadow-md sm:text-5xl lg:text-6xl">
                                            {schoolName}
                                        </h2>
                                        <div className="mt-1 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-[#142921] px-4 py-1.5 text-xs font-bold text-emerald-300 shadow-sm">
                                            <span>PROFIL SEKOLAH</span>
                                            <span>•</span>
                                            <span className="font-extrabold text-white">
                                                {profileSubTab === 'vision'
                                                    ? 'Visi & Misi'
                                                    : profileSubTab ===
                                                        'profile'
                                                      ? 'Profil Sekolah'
                                                      : profileSubTab ===
                                                          'facilities'
                                                        ? 'Sarana & Prasarana'
                                                        : 'Sejarah Singkat'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : isPlayingInlineVideo ? (
                                <div className="relative flex aspect-video max-h-[500px] w-full items-center justify-center overflow-hidden rounded-3xl bg-slate-900 shadow-xl sm:rounded-[2.5rem]">
                                    <iframe
                                        src={`${getYouTubeEmbedUrl(settings.principal_video_url || 'https://youtu.be/swh2GC1XqyE?si=zDzgUxvpB2XObqte')}?autoplay=1&rel=0`}
                                        title="Video Profil Sekolah"
                                        className="h-full w-full rounded-3xl border-0 sm:rounded-[2.5rem]"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                    <button
                                        onClick={() =>
                                            setIsPlayingInlineVideo(false)
                                        }
                                        className="absolute top-4 right-4 z-10 flex cursor-pointer items-center gap-1.5 rounded-full border border-white/20 bg-black/70 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md transition-all hover:bg-black"
                                    >
                                        <X className="h-4 w-4" />
                                        <span>Tutup Video</span>
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() =>
                                        setIsPlayingInlineVideo(true)
                                    }
                                    className="group relative flex aspect-video max-h-[500px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-3xl bg-slate-900 shadow-xl sm:rounded-[2.5rem]"
                                >
                                    {/* Background Image Cover */}
                                    <img
                                        src={getYouTubeThumbnail(
                                            settings.principal_video_url,
                                        )}
                                        alt="Cover Video Profil Sekolah"
                                        className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                `https://img.youtube.com/vi/${getYouTubeId(settings.principal_video_url)}/hqdefault.jpg`;
                                        }}
                                    />

                                    {/* Dark Gradient Overlay */}
                                    <div className="absolute inset-0 bg-black/50 transition-colors group-hover:bg-black/40" />

                                    {/* Center Play Button & Text Content Overlay */}
                                    <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center gap-3 p-6 text-center text-white sm:p-10">
                                        <div className="my-1 flex h-16 w-16 items-center justify-center rounded-full bg-[#064e3b] text-white shadow-2xl transition-all group-hover:scale-110 group-hover:bg-[#047857] sm:h-20 sm:w-20">
                                            <Play className="h-8 w-8 translate-x-0.5 fill-white text-white sm:h-10 sm:w-10" />
                                        </div>

                                        <span className="rounded-full bg-[#265243] px-4 py-1.5 text-xs font-black tracking-wider text-white uppercase shadow-md">
                                            PUTAR VIDEO PROFIL SEKOLAH
                                        </span>

                                        <h2 className="text-2xl font-black tracking-tight text-white drop-shadow-md sm:text-5xl lg:text-6xl">
                                            {schoolName
                                                .toUpperCase()
                                                .includes('TANJUNG')
                                                ? schoolName.replace(
                                                      /TANJUNG\s+PINANG/gi,
                                                      'TANJUNGPINANG',
                                                  )
                                                : `${schoolName} TANJUNGPINANG`}
                                        </h2>
                                    </div>
                                </div>
                            )}

                            {/* PINTASAN NAVIGASI PROFIL (SOLID WHITE DEFAULT -> SOLID GREEN ON SELECT - COMPLETELY BORDERLESS) */}
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-6">
                                {[
                                    { id: 'profile', label: 'Profil Sekolah' },
                                    { id: 'vision', label: 'Visi & Misi' },
                                    { id: 'history', label: 'Sejarah Singkat' },
                                    {
                                        id: 'facilities',
                                        label: 'Sarana & Prasarana',
                                    },
                                ].map((sub) => {
                                    const isActive = profileSubTab === sub.id;
                                    return (
                                        <button
                                            key={sub.id}
                                            onClick={() => {
                                                setProfileSubTab(sub.id as any);
                                                if (sub.id === 'vision')
                                                    setActiveTab('vision');
                                                else setActiveTab('profile');
                                            }}
                                            className={`relative flex cursor-pointer items-center justify-center rounded-2xl border-0 border-none p-3 text-center text-xs font-extrabold shadow-md transition-all duration-300 outline-none sm:rounded-3xl sm:p-6 sm:text-base ${
                                                isActive
                                                    ? '-translate-y-1 scale-[1.02] bg-[#265243] text-white shadow-xl sm:-translate-y-2'
                                                    : 'bg-white text-[#142921] hover:-translate-y-1 hover:bg-slate-50 hover:shadow-xl'
                                            }`}
                                        >
                                            <span className="tracking-wide">
                                                {sub.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* SUBTAB CONTENT CONTAINER (TRANSPARENT BACKGROUND) */}
                            <div className="min-h-[350px] space-y-8 bg-transparent">
                                {/* SUB-TAB 1: PROFIL SEKOLAH */}
                                {profileSubTab === 'profile' && (
                                    <div className="animate-in fade-in space-y-8 duration-300">
                                        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
                                            {/* LEFT COLUMN: SCHOOL LOGO */}
                                            <div className="relative space-y-4 lg:col-span-5">
                                                {/* Main Image Container */}
                                                <div className="relative z-10 mx-auto max-w-md lg:max-w-none">
                                                    <div className="group relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-3xl bg-[#142921] p-8 shadow-xl">
                                                        {logoUrl ? (
                                                            <img
                                                                src={logoUrl}
                                                                alt={`Logo ${schoolName}`}
                                                                className="relative z-10 max-h-48 object-contain drop-shadow-2xl filter transition-transform duration-500 group-hover:scale-105 sm:max-h-56"
                                                            />
                                                        ) : (
                                                            <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-xl">
                                                                <Building2 className="h-14 w-14 text-emerald-300" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* RIGHT COLUMN: EDITORIAL PROFILE TEXT */}
                                            <div className="space-y-6 lg:col-span-7">
                                                <div className="space-y-2 border-b border-[#e2ebd9] pb-3">
                                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                                        <span className="rounded-full bg-[#f59e0b] px-3.5 py-1 text-[10px] font-black tracking-widest text-white uppercase shadow-xs sm:text-[11px]">
                                                            PROFIL SEKOLAH
                                                        </span>
                                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">
                                                            <Award className="h-4 w-4 text-emerald-700" />{' '}
                                                            Akreditasi{' '}
                                                            {settings.accreditation ||
                                                                'A (Unggul)'}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-sans text-2xl leading-tight font-black tracking-tight text-[#142921] sm:text-4xl">
                                                        Profil &amp; Identitas
                                                        Sekolah
                                                    </h3>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                                    <span className="rounded-full bg-[#265243] px-3 py-1 text-xs font-extrabold text-white shadow-xs">
                                                        Status:{' '}
                                                        {settings.school_status ||
                                                            'Negeri'}
                                                    </span>
                                                    <span className="rounded-full border border-[#b8ceb0] bg-[#f4f8f3] px-3 py-1 text-xs font-extrabold text-[#142921]">
                                                        NPSN:{' '}
                                                        {settings.school_npsn ||
                                                            '12345678'}
                                                    </span>
                                                </div>

                                                {/* Editorial Paragraphs */}
                                                <div className="space-y-4 text-xs leading-relaxed font-medium text-[#2e5445] sm:text-sm">
                                                    <p className="text-sm leading-snug font-bold text-[#142921] sm:text-base">
                                                        {schoolName} adalah
                                                        institusi pendidikan
                                                        menengah tingkat atas
                                                        terkemuka yang
                                                        berdedikasi tinggi dalam
                                                        membentuk generasi
                                                        unggul, berakhlak mulia,
                                                        dan berdaya saing
                                                        global.
                                                    </p>
                                                    <p>
                                                        {schoolDesc ||
                                                            'Sekolah ini menyelenggarakan pendidikan terpadu yang memadukan kurikulum nasional modern dengan pembinaan karakter kebangsaan dan keagamaan. Berdiri dengan sarana dan prasarana terlengkap, sekolah senantiasa menciptakan ekosistem belajar yang kondusif, inovatif, dan berwawasan lingkungan.'}
                                                    </p>
                                                    <p>
                                                        Melalui berbagai program
                                                        unggulan akademik,
                                                        ekstrakurikuler,
                                                        pembinaan tahfidz, serta
                                                        digitalisasi
                                                        perpustakaan dan portal
                                                        e-legalisir alumni, kami
                                                        berkomitmen mencetak
                                                        lulusan berkepribadian
                                                        mandiri yang siap
                                                        melanjutkan ke perguruan
                                                        tinggi terbaik nasional
                                                        maupun internasional.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* SUB-TAB 2: VISI & MISI */}
                                {profileSubTab === 'vision' && (
                                    <div className="animate-in fade-in space-y-8 duration-300">
                                        <div className="space-y-2 border-b border-[#e2ebd9] pb-3">
                                            <h3 className="text-2xl font-black tracking-tight text-[#142921] sm:text-3xl">
                                                Visi &amp; Misi Sekolah
                                            </h3>
                                            <div className="h-1 w-16 rounded-full bg-[#f59e0b]" />
                                        </div>

                                        {/* VISI CARD (PURE SOLID COLOR WITHOUT GRADIENT OR BLUR) */}
                                        <div className="group relative overflow-hidden rounded-3xl border border-emerald-900/50 bg-[#142921] p-6 text-white shadow-xl sm:p-8">
                                            <div className="relative z-10 space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <span className="rounded-md bg-white/10 px-2.5 py-0.5 text-[10px] font-black tracking-widest text-[#f59e0b] uppercase sm:text-xs">
                                                            VISI SEKOLAH
                                                        </span>
                                                        <h4 className="mt-1 text-lg font-extrabold text-white sm:text-xl">
                                                            {schoolName}
                                                        </h4>
                                                    </div>
                                                </div>

                                                <div className="pt-2">
                                                    <p className="text-base leading-relaxed font-bold tracking-wide text-emerald-50 italic sm:text-xl">
                                                        "
                                                        {settings.vision ||
                                                            settings.visi ||
                                                            'TERWUJUDNYA MADRASAH ALIYAH NEGERI TANJUNGPINANG YANG BERKUALITAS, AGAMIS, UNGGUL DAN BERWAWASAN LINGKUNGAN'}
                                                        "
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* MISI CARDS GRID */}
                                        <div className="space-y-6 pt-2">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <div>
                                                    <h4 className="text-lg font-black text-[#142921] sm:text-xl">
                                                        MISI SEKOLAH
                                                    </h4>
                                                    <p className="text-xs font-medium text-[#527365]">
                                                        {missionItems.length}{' '}
                                                        Pilar Utama Pelaksanaan
                                                        Pendidikan
                                                    </p>
                                                </div>
                                                <span className="rounded-full border border-[#c8dac5] bg-[#f4f8f3] px-3 py-1 text-xs font-black text-[#265243]">
                                                    {missionItems.length} Poin
                                                    Misi Utama
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                {missionItems.map(
                                                    (item, idx) => {
                                                        const isFullWidth =
                                                            idx ===
                                                                missionItems.length -
                                                                    1 &&
                                                            missionItems.length %
                                                                2 !==
                                                                0;
                                                        return (
                                                            <div
                                                                key={idx}
                                                                className={`group relative flex min-h-[90px] items-center justify-between gap-4 rounded-2xl border border-[#c8dac5] bg-white p-5 shadow-xs transition-all duration-300 hover:border-[#265243] hover:shadow-md sm:p-6 ${isFullWidth ? 'md:col-span-2' : ''}`}
                                                            >
                                                                {/* Misi Text Content (Centered Layout) */}
                                                                <div className="flex flex-1 items-center">
                                                                    <p className="w-full text-left text-sm leading-relaxed font-extrabold text-[#142921] sm:text-base">
                                                                        {
                                                                            item.desc
                                                                        }
                                                                    </p>
                                                                </div>

                                                                {/* Number Badge (Vertically Centered on Right Side) */}
                                                                <div className="flex shrink-0 items-center justify-center self-stretch border-l border-[#e2ebd9] pl-4">
                                                                    <span className="font-mono text-2xl font-black tracking-tighter text-[#c8dac5] transition-colors group-hover:text-[#265243] sm:text-3xl">
                                                                        {
                                                                            item.num
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* SUB-TAB 3: SEJARAH SINGKAT */}
                                {profileSubTab === 'history' && (
                                    <div className="animate-in fade-in space-y-8 duration-300">
                                        <div className="space-y-2 border-b border-[#e2ebd9] pb-3">
                                            <h3 className="text-2xl font-black tracking-tight text-[#142921] sm:text-3xl">
                                                Sejarah Singkat Sekolah
                                            </h3>
                                            <div className="h-1 w-16 rounded-full bg-[#f59e0b]" />
                                        </div>

                                        {milestones.length === 0 ? (
                                            /* Fallback static text jika belum ada milestone */
                                            <div className="prose prose-sm space-y-4 leading-relaxed font-medium text-[#2e5445]">
                                                <p>
                                                    {schoolName} didirikan
                                                    sebagai institusi pendidikan
                                                    menengah tingkat atas yang
                                                    berdedikasi melayani
                                                    masyarakat. Berdiri di
                                                    lokasi strategis, sekolah
                                                    ini telah melahirkan ribuan
                                                    alumni yang sukses di
                                                    berbagai bidang akademis,
                                                    pemerintahan, industri, dan
                                                    kewirausahaan.
                                                </p>
                                                <p>
                                                    Seiring perjalanan waktu,
                                                    sekolah terus melakukan
                                                    transformasi digital dan
                                                    modernisasi kurikulum untuk
                                                    menjawab tantangan
                                                    perkembangan sains,
                                                    teknologi, dan globalisasi,
                                                    tanpa mengesampingkan
                                                    nilai-nilai karakter
                                                    berbudaya bangsa.
                                                </p>
                                            </div>
                                        ) : (
                                            /* DYNAMIC MILESTONE TIMELINE */
                                            <div className="relative">
                                                {/* Vertical center line */}
                                                <div className="absolute top-0 bottom-0 left-1/2 hidden w-0.5 -translate-x-1/2 bg-[#265243] sm:block" />

                                                <div className="space-y-8 sm:space-y-0">
                                                    {milestones.map(
                                                        (milestone, idx) => {
                                                            const isLeft =
                                                                idx % 2 === 0;
                                                            return (
                                                                <div
                                                                    key={
                                                                        milestone.id
                                                                    }
                                                                    className={`relative flex flex-col items-start gap-4 sm:mb-12 sm:flex-row sm:items-center sm:gap-0 ${isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
                                                                >
                                                                    {/* Card */}
                                                                    <div
                                                                        className={`w-full sm:w-[calc(50%-2.5rem)] ${isLeft ? 'sm:pr-6' : 'sm:pl-6'}`}
                                                                    >
                                                                        <div className="group rounded-2xl border border-[#c8dac5] bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md">
                                                                            <div className="flex items-start gap-3">
                                                                                <div className="shrink-0 rounded-lg bg-[#142921] px-3 py-1.5 text-xs font-black text-white shadow-sm transition-colors group-hover:bg-[#265243]">
                                                                                    {
                                                                                        milestone.year
                                                                                    }
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-sm leading-snug font-extrabold text-[#142921]">
                                                                                        {
                                                                                            milestone.title
                                                                                        }
                                                                                    </p>
                                                                                    {milestone.description && (
                                                                                        <p className="mt-1 text-xs leading-relaxed font-medium text-[#527365]">
                                                                                            {
                                                                                                milestone.description
                                                                                            }
                                                                                        </p>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Center dot (desktop only) */}
                                                                    <div className="absolute left-1/2 z-10 hidden -translate-x-1/2 sm:flex">
                                                                        <div className="h-5 w-5 rounded-full border-4 border-white bg-[#f59e0b] shadow-md" />
                                                                    </div>

                                                                    {/* Spacer for opposite side */}
                                                                    <div className="hidden w-[calc(50%-2.5rem)] sm:block" />
                                                                </div>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* SUB-TAB 4: SARANA & PRASARANA */}
                                {profileSubTab === 'facilities' && (
                                    <div className="animate-in fade-in space-y-8 duration-300">
                                        <div className="space-y-2 border-b border-[#e2ebd9] pb-3 text-center">
                                            <h3 className="text-2xl font-black tracking-tight text-[#142921] sm:text-3xl">
                                                Sarana &amp; Prasarana
                                            </h3>
                                            <div className="mx-auto h-1 w-16 rounded-full bg-[#f59e0b]" />
                                        </div>

                                        <div className="mx-auto mb-8 max-w-3xl space-y-4 text-center leading-relaxed font-medium text-[#2e5445]">
                                            <p>
                                                Untuk mendukung proses belajar
                                                mengajar yang optimal,{' '}
                                                {schoolName} menyediakan
                                                berbagai fasilitas unggulan yang
                                                modern, lengkap, dan
                                                terintegrasi. Lingkungan sekolah
                                                dirancang untuk memfasilitasi
                                                pengembangan potensi siswa di
                                                bidang akademik maupun
                                                non-akademik.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                            {(facilities &&
                                            facilities.length > 0
                                                ? facilities
                                                : DEFAULT_FACILITIES
                                            ).map((fac) => (
                                                <div
                                                    key={fac.id}
                                                    onClick={() =>
                                                        setSelectedFacility(fac)
                                                    }
                                                    className="group relative flex h-72 cursor-pointer flex-col justify-end overflow-hidden rounded-2xl border border-[#2d5645]/40 bg-[#142921] shadow-lg transition-all duration-500 hover:-translate-y-1.5 hover:border-[#f59e0b]/60 hover:shadow-2xl sm:h-80"
                                                >
                                                    {/* Image background */}
                                                    {fac.image ? (
                                                        <img
                                                            src={fac.image}
                                                            alt={fac.title}
                                                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-[#1b382d]">
                                                            <Building2 className="h-16 w-16 text-[#3a6956]" />
                                                        </div>
                                                    )}

                                                    {/* Gradient opacity overlay */}
                                                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#091510] via-[#091510]/70 to-transparent" />

                                                    {/* Content - Bottom Centered */}
                                                    <div className="relative z-20 w-full space-y-2 p-6 text-center">
                                                        <span className="inline-block rounded-full border border-[#427a66]/60 bg-[#265243]/80 px-3 py-1 text-[11px] font-bold tracking-wider text-[#f59e0b] uppercase shadow-sm backdrop-blur-md">
                                                            Fasilitas Sekolah
                                                        </span>
                                                        <h4 className="text-xl leading-tight font-black text-white drop-shadow-md transition-colors group-hover:text-[#f59e0b]">
                                                            {fac.title}
                                                        </h4>
                                                        <div className="flex items-center justify-center gap-1.5 pt-1 text-xs font-semibold text-emerald-300/90 transition-colors group-hover:text-white">
                                                            <span>
                                                                Klik untuk
                                                                detail
                                                            </span>
                                                            <span className="text-base transition-transform group-hover:translate-x-1">
                                                                →
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Facility Detail Modal */}
                                        {selectedFacility && (
                                            <div
                                                className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md duration-200"
                                                onClick={() =>
                                                    setSelectedFacility(null)
                                                }
                                            >
                                                <div
                                                    className="animate-in zoom-in-95 relative w-full max-w-2xl overflow-hidden rounded-3xl border border-emerald-800/80 bg-[#142921] text-white shadow-2xl duration-200"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    {/* Close button */}
                                                    <button
                                                        onClick={() =>
                                                            setSelectedFacility(
                                                                null,
                                                            )
                                                        }
                                                        className="absolute top-4 right-4 z-20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition-all hover:bg-black"
                                                    >
                                                        <X className="h-5 w-5" />
                                                    </button>

                                                    {/* Image header */}
                                                    <div className="relative h-64 w-full bg-[#0b1712] sm:h-80">
                                                        {selectedFacility.image ? (
                                                            <img
                                                                src={
                                                                    selectedFacility.image
                                                                }
                                                                alt={
                                                                    selectedFacility.title
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-[#18342a]">
                                                                <Building2 className="h-20 w-20 text-[#3a6956]" />
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-[#142921] via-transparent to-black/40" />
                                                    </div>

                                                    {/* Modal Body */}
                                                    <div className="space-y-4 p-6 sm:p-8">
                                                        <div className="flex items-center gap-2">
                                                            <span className="rounded-full bg-[#f59e0b] px-3 py-1 text-xs font-black tracking-wider text-white uppercase shadow-sm">
                                                                Fasilitas
                                                                Sekolah
                                                            </span>
                                                        </div>
                                                        <h3 className="text-2xl leading-tight font-black text-white sm:text-3xl">
                                                            {
                                                                selectedFacility.title
                                                            }
                                                        </h3>
                                                        <p className="text-sm leading-relaxed font-normal text-emerald-100/90 sm:text-base">
                                                            {selectedFacility.description ||
                                                                'Fasilitas unggulan sekolah yang dirancang untuk kenyamanan dan keunggulan belajar mengajar.'}
                                                        </p>
                                                        <div className="flex justify-end border-t border-emerald-800/60 pt-4">
                                                            <button
                                                                onClick={() =>
                                                                    setSelectedFacility(
                                                                        null,
                                                                    )
                                                                }
                                                                className="cursor-pointer rounded-xl bg-[#f59e0b] px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#d98206]"
                                                            >
                                                                Tutup Detail
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* MOTTO SEKOLAH QUOTE BANNER (SOLID GOLD BADGE + CLEAN FONT) */}
                            <div className="relative space-y-4 overflow-hidden rounded-3xl border border-emerald-900/40 bg-[#142921] p-8 text-center text-white shadow-xl sm:p-12">
                                <div className="flex justify-center">
                                    <span className="inline-block rounded-full bg-[#f59e0b] px-4 py-1.5 text-xs font-black tracking-widest text-white uppercase shadow-md">
                                        MOTTO SEKOLAH
                                    </span>
                                </div>
                                <blockquote className="mx-auto max-w-4xl text-2xl leading-relaxed font-extrabold text-white italic drop-shadow-md sm:text-4xl">
                                    "
                                    {schoolTagline ||
                                        'Unggul Dalam Prestasi, Berkarakter, dan Berwawasan Lingkungan'}
                                    "
                                </blockquote>
                                <div className="mx-auto my-2 h-1 w-16 rounded-full bg-[#f59e0b]" />
                                <p className="text-xs font-bold tracking-widest text-emerald-300 uppercase sm:text-sm">
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
                            <div className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-[2.5rem] border border-emerald-900/30 bg-[#142921] p-8 text-white shadow-xl sm:p-12 md:flex-row">
                                <div className="relative z-10 max-w-2xl space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="rounded-full bg-[#f59e0b] px-3.5 py-1 text-[10px] font-black tracking-widest text-white uppercase shadow-xs sm:text-[11px]">
                                            Portal Publikasi
                                        </span>
                                    </div>
                                    <h3 className="font-sans text-3xl leading-tight font-black tracking-tight text-white drop-shadow-md sm:text-5xl lg:text-6xl">
                                        Daftar Artikel & Pengumuman Sekolah
                                    </h3>
                                    <p className="text-xs leading-relaxed font-medium text-emerald-100/90 sm:text-sm">
                                        Dapatkan berita resmi, liputan kegiatan,
                                        pengumuman sekolah, serta pencapaian
                                        prestasi terbaru dari civitas akademika.
                                    </p>
                                </div>
                            </div>

                            {news.length === 0 ? (
                                <div
                                    style={{
                                        backgroundColor: '#ffffff',
                                        borderColor: '#c8dac5',
                                    }}
                                    className="rounded-2xl border p-12 text-center"
                                >
                                    <Newspaper className="mx-auto mb-3 h-12 w-12 text-[#265243]" />
                                    <p className="text-sm font-bold text-[#142921]">
                                        Belum ada artikel berita yang
                                        dipublikasikan.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {paginatedNews.map((item, idx) => (
                                            <Link
                                                key={item.id}
                                                href={`/news/${item.slug}`}
                                                className="group relative flex flex-col justify-between overflow-hidden rounded-[2.25rem] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                                            >
                                                {/* Top Badge */}
                                                <div className="absolute top-4 left-4 z-10">
                                                    <span className="rounded-md bg-[#f59e0b] px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-white uppercase shadow-md sm:text-[11px]">
                                                        {(newsPage - 1) *
                                                            NEWS_PER_PAGE +
                                                            idx ===
                                                        0
                                                            ? 'BARU'
                                                            : 'BERITA'}
                                                    </span>
                                                </div>

                                                {/* Mentok Image Container */}
                                                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                                                    {item.thumbnail ? (
                                                        <img
                                                            src={item.thumbnail}
                                                            alt={item.title}
                                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center bg-[#e8efe5] text-[#265243]">
                                                            <ImageIcon className="h-10 w-10" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content Body */}
                                                <div className="flex flex-1 flex-col justify-between space-y-4 p-5 sm:p-6">
                                                    <div>
                                                        {/* Centered Title */}
                                                        <h4 className="mb-2 line-clamp-2 px-1 text-center font-sans text-base leading-snug font-extrabold text-[#142921] transition-colors group-hover:text-[#265243] sm:text-lg">
                                                            {item.title}
                                                        </h4>

                                                        {/* Centered Views Count */}
                                                        <div className="my-1.5 flex items-center justify-center gap-1.5 text-xs font-extrabold text-[#527365]">
                                                            <Eye className="h-3.5 w-3.5 text-[#265243]" />
                                                            <span>
                                                                {item.views_count ||
                                                                    0}{' '}
                                                                Dilihat
                                                            </span>
                                                        </div>

                                                        {/* Centered Metadata */}
                                                        <p className="flex items-center justify-center gap-1.5 text-center text-[11px] font-bold text-[#527365] sm:text-xs">
                                                            <Calendar className="h-3.5 w-3.5 text-[#265243]" />
                                                            <span>
                                                                {item.published_at ||
                                                                    'Terbaru'}
                                                            </span>
                                                            <span>•</span>
                                                            <User className="h-3.5 w-3.5 text-[#265243]" />
                                                            <span>
                                                                {item.author}
                                                            </span>
                                                        </p>
                                                    </div>

                                                    {/* Bottom Action Button */}
                                                    <div className="pt-2">
                                                        <span className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full border border-[#c8dac5] bg-white px-4 py-2.5 text-xs font-black text-[#265243] shadow-2xs transition-all group-hover:bg-[#265243] group-hover:text-white">
                                                            <span>
                                                                Baca
                                                                Selengkapnya
                                                            </span>
                                                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    {renderPaginationControls(
                                        newsPage,
                                        totalNewsPages,
                                        setNewsPage,
                                    )}
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
                            <div className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-[2.5rem] border border-emerald-900/30 bg-[#142921] p-8 text-white shadow-xl sm:p-12 md:flex-row">
                                <div className="relative z-10 max-w-2xl space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="rounded-full bg-[#f59e0b] px-3.5 py-1 text-[10px] font-black tracking-widest text-white uppercase shadow-xs sm:text-[11px]">
                                            Media Dokumentasi
                                        </span>
                                    </div>
                                    <h3 className="font-sans text-3xl leading-tight font-black tracking-tight text-white drop-shadow-md sm:text-5xl lg:text-6xl">
                                        Galeri Foto & Video Dokumentasi
                                    </h3>
                                    <p className="text-xs leading-relaxed font-medium text-emerald-100/90 sm:text-sm">
                                        Kumpulan dokumentasi momen penting,
                                        fasilitas pendidikan, serta kegiatan
                                        belajar mengajar sekolah.
                                    </p>
                                </div>

                                <div className="relative z-10 flex shrink-0 flex-wrap items-center gap-2">
                                    {[
                                        { id: 'all', label: 'Semua' },
                                        { id: 'photo', label: 'Foto' },
                                        {
                                            id: 'youtube',
                                            label: 'Video YouTube',
                                        },
                                    ].map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => {
                                                setGalleryCategory(cat.id);
                                                setGalleryPage(1);
                                            }}
                                            className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-extrabold transition-all ${
                                                galleryCategory === cat.id
                                                    ? 'border-white bg-white text-[#142921] shadow-md'
                                                    : 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                                            }`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {filteredGalleries.length === 0 ? (
                                <div
                                    style={{
                                        backgroundColor: '#ffffff',
                                        borderColor: '#c8dac5',
                                    }}
                                    className="rounded-2xl border p-12 text-center"
                                >
                                    <ImageIcon className="mx-auto mb-3 h-12 w-12 text-[#265243]" />
                                    <p className="text-sm font-bold text-[#142921]">
                                        Belum ada foto atau video dalam galeri.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                                        {paginatedGalleries.map((item) => (
                                            <div
                                                key={item.id}
                                                onClick={() =>
                                                    setSelectedGallery(item)
                                                }
                                                style={{
                                                    backgroundColor: '#ffffff',
                                                    borderColor: '#c8dac5',
                                                }}
                                                className="group relative cursor-pointer overflow-hidden rounded-2xl border shadow-sm transition-all hover:border-[#265243]"
                                            >
                                                {item.display_image ? (
                                                    <img
                                                        src={item.display_image}
                                                        alt={item.title}
                                                        className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex h-48 w-full items-center justify-center bg-[#dce8d7] text-[#265243]">
                                                        <ImageIcon className="h-10 w-10" />
                                                    </div>
                                                )}

                                                {item.type === 'youtube' && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white transition-all group-hover:bg-black/20">
                                                        <PlayCircle className="h-12 w-12 fill-white text-rose-500" />
                                                    </div>
                                                )}

                                                <div className="absolute inset-x-0 bottom-0 bg-black/75 p-3 text-white">
                                                    <span className="rounded bg-[#265243] px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                                                        {item.category}
                                                    </span>
                                                    <p className="mt-1 truncate text-xs font-bold">
                                                        {item.title}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {renderPaginationControls(
                                        galleryPage,
                                        totalGalleryPages,
                                        setGalleryPage,
                                    )}
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
                            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold tracking-widest text-[#527365] uppercase">
                                        Katalog Digital
                                    </p>
                                    <h3 className="text-2xl font-black tracking-tight text-[#142921] sm:text-4xl">
                                        Katalog Perpustakaan Digital
                                    </h3>
                                </div>

                                <div className="flex w-full items-center gap-3 md:w-auto">
                                    {/* Search input */}
                                    <div className="relative flex-1 md:w-72">
                                        <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#265243]" />
                                        <input
                                            type="text"
                                            placeholder="Cari judul buku, penulis..."
                                            value={bookSearch}
                                            onChange={(e) =>
                                                setBookSearch(e.target.value)
                                            }
                                            className="w-full rounded-xl border border-[#c8dac5] bg-white py-2.5 pr-4 pl-10 text-xs font-bold text-[#142921] placeholder-[#527365] shadow-xs transition-all focus:border-[#265243]/40 focus:ring-2 focus:ring-[#265243]/20 focus:outline-none"
                                        />
                                        {bookSearch && (
                                            <button
                                                onClick={() =>
                                                    setBookSearch('')
                                                }
                                                className="absolute top-1/2 right-3 -translate-y-1/2 text-[#527365] hover:text-[#142921]"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Filter Button */}
                                    <button
                                        onClick={() =>
                                            setIsFilterModalOpen(true)
                                        }
                                        className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold whitespace-nowrap shadow-xs transition-all ${
                                            bookCategory !== 'all' ||
                                            bookAvailability !== 'all'
                                                ? 'border-[#265243] bg-[#265243] text-white hover:bg-[#1a3a30]'
                                                : 'border-[#c8dac5] bg-white text-[#142921] hover:border-[#265243]/50 hover:bg-[#f8faf7]'
                                        }`}
                                    >
                                        <Filter className="h-4 w-4" />
                                        <span>Filter</span>
                                        {(bookCategory !== 'all' ||
                                            bookAvailability !== 'all') && (
                                            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Active Filter Summary Bar if active */}
                            {(bookSearch ||
                                bookCategory !== 'all' ||
                                bookAvailability !== 'all') && (
                                <div className="flex items-center justify-between rounded-xl border border-[#c8dac5] bg-white px-4 py-2 text-xs">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-bold text-[#527365]">
                                            Filter aktif:
                                        </span>
                                        {bookCategory !== 'all' && (
                                            <span className="inline-flex items-center gap-1 rounded-md bg-[#eef5eb] px-2.5 py-0.5 text-[11px] font-bold text-[#265243]">
                                                Kategori: {bookCategory}
                                                <button
                                                    onClick={() =>
                                                        setBookCategory('all')
                                                    }
                                                    className="hover:text-rose-600"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        )}
                                        {bookAvailability !== 'all' && (
                                            <span className="inline-flex items-center gap-1 rounded-md bg-[#eef5eb] px-2.5 py-0.5 text-[11px] font-bold text-[#265243]">
                                                Status:{' '}
                                                {bookAvailability ===
                                                'available'
                                                    ? 'Tersedia'
                                                    : 'Tidak Tersedia'}
                                                <button
                                                    onClick={() =>
                                                        setBookAvailability(
                                                            'all',
                                                        )
                                                    }
                                                    className="hover:text-rose-600"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        )}
                                        {bookSearch && (
                                            <span className="inline-flex items-center gap-1 rounded-md bg-[#eef5eb] px-2.5 py-0.5 text-[11px] font-bold text-[#265243]">
                                                Cari: "{bookSearch}"
                                                <button
                                                    onClick={() =>
                                                        setBookSearch('')
                                                    }
                                                    className="hover:text-rose-600"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => {
                                            setBookSearch('');
                                            setBookCategory('all');
                                            setBookAvailability('all');
                                        }}
                                        className="ml-2 text-[11px] font-extrabold whitespace-nowrap text-rose-500 hover:text-rose-700"
                                    >
                                        Reset Semua
                                    </button>
                                </div>
                            )}

                            {/* Filter Modal Popup */}
                            {isFilterModalOpen && (
                                <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs duration-200">
                                    <div className="animate-in zoom-in-95 w-full max-w-md space-y-5 overflow-hidden rounded-2xl border border-[#c8dac5] bg-white p-6 shadow-2xl duration-200">
                                        {/* Modal Header */}
                                        <div className="flex items-center justify-between border-b border-[#e2ebd9] pb-3">
                                            <div className="flex items-center gap-2 text-[#142921]">
                                                <Filter className="h-5 w-5 text-[#265243]" />
                                                <h4 className="text-base font-extrabold">
                                                    Filter Katalog Buku
                                                </h4>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    setIsFilterModalOpen(false)
                                                }
                                                className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>

                                        {/* Modal Body */}
                                        <div className="space-y-5">
                                            {/* Availability Filter */}
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold tracking-wider text-[#527365] uppercase">
                                                    Status Ketersediaan
                                                </label>
                                                <div className="flex flex-wrap gap-2">
                                                    {[
                                                        {
                                                            id: 'all',
                                                            label: 'Semua Buku',
                                                            count: books.length,
                                                        },
                                                        {
                                                            id: 'available',
                                                            label: 'Tersedia',
                                                            count: books.filter(
                                                                (b) =>
                                                                    (b.available_copies ??
                                                                        0) > 0,
                                                            ).length,
                                                        },
                                                        {
                                                            id: 'borrowed',
                                                            label: 'Tidak Tersedia',
                                                            count: books.filter(
                                                                (b) =>
                                                                    (b.available_copies ??
                                                                        0) ===
                                                                    0,
                                                            ).length,
                                                        },
                                                    ].map((opt) => (
                                                        <button
                                                            key={opt.id}
                                                            onClick={() =>
                                                                setBookAvailability(
                                                                    opt.id,
                                                                )
                                                            }
                                                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-extrabold transition-all ${
                                                                bookAvailability ===
                                                                opt.id
                                                                    ? 'border-[#265243] bg-[#265243] text-white shadow-sm'
                                                                    : 'border-[#c8dac5] bg-[#f8faf7] text-[#142921] hover:border-[#265243]/50 hover:bg-[#eef5eb]'
                                                            }`}
                                                        >
                                                            {opt.label}
                                                            <span
                                                                className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${
                                                                    bookAvailability ===
                                                                    opt.id
                                                                        ? 'bg-white/20 text-white'
                                                                        : 'bg-[#c8dac5]/60 text-[#265243]'
                                                                }`}
                                                            >
                                                                {opt.count}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Category Filter */}
                                            {bookCategories.length > 0 && (
                                                <div className="space-y-2">
                                                    <label className="block text-xs font-bold tracking-wider text-[#527365] uppercase">
                                                        Kategori Buku
                                                    </label>
                                                    <div className="flex max-h-48 flex-wrap gap-2 overflow-y-auto pr-1">
                                                        <button
                                                            onClick={() =>
                                                                setBookCategory(
                                                                    'all',
                                                                )
                                                            }
                                                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-extrabold transition-all ${
                                                                bookCategory ===
                                                                'all'
                                                                    ? 'border-[#265243] bg-[#265243] text-white shadow-sm'
                                                                    : 'border-[#c8dac5] bg-[#f8faf7] text-[#142921] hover:border-[#265243]/50 hover:bg-[#eef5eb]'
                                                            }`}
                                                        >
                                                            Semua Kategori
                                                        </button>
                                                        {bookCategories.map(
                                                            (cat) => {
                                                                const catCount =
                                                                    books.filter(
                                                                        (b) =>
                                                                            b.category ===
                                                                            cat,
                                                                    ).length;
                                                                return (
                                                                    <button
                                                                        key={
                                                                            cat
                                                                        }
                                                                        onClick={() =>
                                                                            setBookCategory(
                                                                                cat,
                                                                            )
                                                                        }
                                                                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-extrabold transition-all ${
                                                                            bookCategory ===
                                                                            cat
                                                                                ? 'border-[#265243] bg-[#265243] text-white shadow-sm'
                                                                                : 'border-[#c8dac5] bg-[#f8faf7] text-[#142921] hover:border-[#265243]/50 hover:bg-[#eef5eb]'
                                                                        }`}
                                                                    >
                                                                        {cat}
                                                                        <span
                                                                            className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${
                                                                                bookCategory ===
                                                                                cat
                                                                                    ? 'bg-white/20 text-white'
                                                                                    : 'bg-[#c8dac5]/60 text-[#265243]'
                                                                            }`}
                                                                        >
                                                                            {
                                                                                catCount
                                                                            }
                                                                        </span>
                                                                    </button>
                                                                );
                                                            },
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Modal Footer */}
                                        <div className="flex items-center justify-between border-t border-[#e2ebd9] pt-3">
                                            <button
                                                onClick={() => {
                                                    setBookCategory('all');
                                                    setBookAvailability('all');
                                                }}
                                                className="text-xs font-bold text-rose-500 transition-colors hover:text-rose-700"
                                            >
                                                Reset Filter
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setIsFilterModalOpen(false)
                                                }
                                                className="rounded-xl bg-[#265243] px-5 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#1a3a30]"
                                            >
                                                Terapkan
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {filteredBooks.length === 0 ? (
                                <div
                                    style={{
                                        backgroundColor: '#ffffff',
                                        borderColor: '#c8dac5',
                                    }}
                                    className="rounded-2xl border p-12 text-center"
                                >
                                    <BookOpen className="mx-auto mb-3 h-12 w-12 text-[#265243]" />
                                    <p className="text-sm font-bold text-[#142921]">
                                        Tidak ada buku yang sesuai dengan
                                        pencarian Anda.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                        {paginatedBooks.map((book) => (
                                            <div
                                                key={book.id}
                                                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#c8dac5] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:rounded-3xl"
                                            >
                                                {/* Category Badge Overlay - Top Left */}
                                                <div className="absolute top-3 left-3 z-10">
                                                    <span className="rounded-md bg-[#265243] px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-white uppercase shadow-md sm:text-[11px]">
                                                        {book.category}
                                                    </span>
                                                </div>

                                                {/* Book Cover Image Container - Full to Left, Right, & Top */}
                                                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f4f8f3]">
                                                    {book.cover_image ? (
                                                        <img
                                                            src={
                                                                book.cover_image
                                                            }
                                                            alt={book.title}
                                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full flex-col items-center justify-center bg-[#e8efe5] p-4 text-center text-[#265243]">
                                                            <Library className="mb-2 h-12 w-12 text-[#265243]/70" />
                                                            <span className="text-xs font-black text-[#265243]/80">
                                                                Sampul Buku
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content Body */}
                                                <div className="flex flex-1 flex-col justify-between space-y-3 p-4 sm:p-5">
                                                    <div>
                                                        {/* Book Title */}
                                                        <h4 className="mb-1.5 line-clamp-2 font-sans text-sm leading-snug font-extrabold text-[#142921] transition-colors group-hover:text-[#265243] sm:text-base">
                                                            {book.title}
                                                        </h4>

                                                        {/* Book Author */}
                                                        <p className="line-clamp-1 text-xs leading-relaxed font-semibold text-[#527365]">
                                                            Penulis:{' '}
                                                            <span className="font-bold text-[#142921]">
                                                                {book.author}
                                                            </span>
                                                        </p>
                                                    </div>

                                                    {/* Footer Stock & Status */}
                                                    <div className="flex items-center justify-between border-t border-[#eef4eb] pt-3">
                                                        <span className="text-xs font-extrabold text-[#265243]">
                                                            Stok:{' '}
                                                            <span className="font-black text-[#142921]">
                                                                {
                                                                    book.available_copies
                                                                }
                                                            </span>{' '}
                                                            /{' '}
                                                            {book.total_copies}
                                                        </span>
                                                        <span
                                                            className={`rounded-md px-2.5 py-1 text-[10px] font-extrabold tracking-wider uppercase sm:text-[11px] ${
                                                                book.available_copies >
                                                                0
                                                                    ? 'border border-emerald-200 bg-emerald-100 text-emerald-800'
                                                                    : 'border border-rose-200 bg-rose-100 text-rose-800'
                                                            }`}
                                                        >
                                                            {book.available_copies >
                                                            0
                                                                ? 'Tersedia'
                                                                : 'Tidak Tersedia'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {renderPaginationControls(
                                        bookPage,
                                        totalBookPages,
                                        setBookPage,
                                    )}
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
                            <div className="relative grid min-h-[340px] grid-cols-1 items-stretch overflow-hidden rounded-[2.5rem] border border-emerald-900/30 bg-[#142921] text-white shadow-xl lg:grid-cols-12">
                                {/* LEFT COLUMN: FOTO PENGURUS ASRAMA (FULL TO TOP, BOTTOM, & LEFT) */}
                                <div className="group relative min-h-[280px] overflow-hidden lg:col-span-4 lg:min-h-full">
                                    <img
                                        src={
                                            settings.dormitory_pengasuh_photo_url ||
                                            'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80'
                                        }
                                        alt={
                                            settings.dormitory_pengasuh_name ||
                                            'Pengasuh Asrama MAN'
                                        }
                                        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 flex flex-col justify-end bg-black/60 p-5 text-white sm:p-6">
                                        <span className="mb-1.5 inline-block self-start rounded-full border border-amber-400/20 bg-black/50 px-3 py-1 text-[10px] font-black tracking-wider text-amber-300 uppercase backdrop-blur-xs sm:text-[11px]">
                                            Pengasuh &amp; Pengurus Asrama
                                        </span>
                                        <h4 className="text-base leading-snug font-black text-white drop-shadow-md sm:text-lg">
                                            {settings.dormitory_pengasuh_name ||
                                                'Ustadz & Ustadzah Pengasuh'}
                                        </h4>
                                        <p className="text-xs font-medium text-emerald-200">
                                            {settings.dormitory_pengasuh_title ||
                                                'Tim Pembina Karakter & Tahfidz MAN'}
                                        </p>
                                    </div>
                                </div>

                                {/* RIGHT COLUMN: PENJELASAN ASRAMA & PINTASAN KONTAK/SOSMED */}
                                <div className="flex flex-col justify-between space-y-6 p-6 sm:p-10 lg:col-span-8">
                                    <div className="space-y-3">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="rounded-full bg-[#f59e0b] px-3.5 py-1 text-[10px] font-black tracking-widest text-white uppercase shadow-xs sm:text-[11px]">
                                                Ma'had &amp; Asrama Modern
                                            </span>
                                        </div>
                                        <h3 className="font-sans text-2xl leading-tight font-black tracking-tight text-white sm:text-4xl">
                                            {settings.dormitory_title ||
                                                'Lingkungan Hunian Islami, Disiplin, & Berprestasi'}
                                        </h3>
                                        <p className="text-xs leading-relaxed font-medium text-emerald-100/90 sm:text-sm">
                                            {settings.dormitory_description ||
                                                "Asrama Ma'had MAN dirancang untuk membentuk karakter santri yang mandiri, berilmu, dan berakhlaqul karimah. Dilengkapi dengan program Tahfidzul Qur'an, kajian kitab kuning, bimbingan akademik intensif, serta pembiasaan kedisiplinan hidup sehari-hari di bawah pengawasan pengasuh berpengalaman."}
                                        </p>
                                    </div>

                                    {/* PINTASAN KONTAK & SOSMED */}
                                    <div className="border-t border-emerald-800/40 pt-3">
                                        <p className="mb-2.5 text-[11px] font-bold tracking-wider text-amber-300 uppercase">
                                            Pintasan Kontak &amp; Media Sosial
                                            Pengurus:
                                        </p>
                                        <div className="flex flex-wrap items-center gap-2.5">
                                            {/* WA Pengurus Putra */}
                                            <a
                                                href={
                                                    settings.dormitory_wa_putra ||
                                                    'https://wa.me/6281234567890'
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                                className="group inline-flex items-center gap-2 rounded-xl bg-emerald-600/30 px-4 py-2.5 text-xs font-bold text-white shadow-xs backdrop-blur-xs transition-all hover:bg-emerald-600"
                                            >
                                                <svg
                                                    className="h-4 w-4 fill-emerald-400 transition-colors group-hover:fill-white"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                                </svg>
                                                <span>WA Pengurus Putra</span>
                                            </a>

                                            {/* WA Pengurus Putri */}
                                            <a
                                                href={
                                                    settings.dormitory_wa_putri ||
                                                    'https://wa.me/6281234567891'
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                                className="group inline-flex items-center gap-2 rounded-xl bg-emerald-600/30 px-4 py-2.5 text-xs font-bold text-white shadow-xs backdrop-blur-xs transition-all hover:bg-emerald-600"
                                            >
                                                <svg
                                                    className="h-4 w-4 fill-emerald-400 transition-colors group-hover:fill-white"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                                </svg>
                                                <span>WA Pengurus Putri</span>
                                            </a>

                                            {/* Instagram Asrama */}
                                            <a
                                                href={
                                                    settings.dormitory_instagram ||
                                                    'https://instagram.com'
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                                className="group inline-flex items-center gap-2 rounded-xl bg-[#f59e0b]/20 px-4 py-2.5 text-xs font-bold text-white shadow-xs backdrop-blur-xs transition-all hover:bg-[#f59e0b]"
                                            >
                                                <svg
                                                    className="h-4 w-4 fill-amber-300 transition-colors group-hover:fill-white"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                                </svg>
                                                <span>Instagram Asrama</span>
                                            </a>

                                            {/* TikTok Asrama */}
                                            <a
                                                href={
                                                    settings.dormitory_tiktok ||
                                                    'https://tiktok.com'
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                                className="group inline-flex items-center gap-2 rounded-xl bg-[#265243]/50 px-4 py-2.5 text-xs font-bold text-white shadow-xs backdrop-blur-xs transition-all hover:bg-[#265243]"
                                            >
                                                <svg
                                                    className="h-4 w-4 fill-emerald-300 transition-colors group-hover:fill-white"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v7.02c0 2.87-1.34 5.61-3.66 7.15-2.32 1.54-5.32 1.77-7.85.6-2.54-1.17-4.32-3.65-4.63-6.42-.31-2.77.86-5.55 3.06-7.19 1.83-1.37 4.23-1.85 6.43-1.28v4.03c-1.15-.38-2.45-.25-3.48.35-1.03.6-1.67 1.69-1.69 2.89-.02 1.2.6 2.31 1.62 2.94 1.02.63 2.33.59 3.32-.09.99-.68 1.48-1.85 1.48-3.04V.02z" />
                                                </svg>
                                                <span>TikTok Asrama</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1 pb-2">
                                <p className="text-xs font-bold tracking-widest text-[#527365] uppercase">
                                    Informasi &amp; Kegiatan Terbaru
                                </p>
                                <h3 className="text-2xl font-black tracking-tight text-[#142921] sm:text-3xl">
                                    Berita &amp; Publikasi Asrama
                                </h3>
                            </div>

                            {dormitory.length === 0 ? (
                                <div
                                    style={{
                                        backgroundColor: '#ffffff',
                                        borderColor: '#c8dac5',
                                    }}
                                    className="rounded-2xl border p-12 text-center"
                                >
                                    <Building2 className="mx-auto mb-3 h-12 w-12 text-[#265243]" />
                                    <p className="text-sm font-bold text-[#142921]">
                                        Belum ada informasi kegiatan asrama.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {paginatedDorm.map((post) => (
                                            <div
                                                key={post.id}
                                                className="group relative flex flex-col justify-between overflow-hidden rounded-[2.25rem] border border-[#c8dac5] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                                            >
                                                {/* Top Badge */}
                                                <div className="absolute top-4 left-4 z-10">
                                                    <span className="rounded-md bg-[#f59e0b] px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-white uppercase shadow-md sm:text-[11px]">
                                                        ASRAMA
                                                    </span>
                                                </div>

                                                {/* Mentok Image Container */}
                                                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                                                    {post.media ? (
                                                        <img
                                                            src={post.media}
                                                            alt={post.title}
                                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center bg-[#e8efe5] text-[#265243]">
                                                            <ImageIcon className="h-10 w-10" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content Body */}
                                                <div className="flex flex-1 flex-col justify-between space-y-4 p-5 sm:p-6">
                                                    <div>
                                                        {/* Centered Title */}
                                                        <h4 className="mb-2 line-clamp-2 px-1 text-center font-sans text-base leading-snug font-extrabold text-[#142921] transition-colors group-hover:text-[#265243] sm:text-lg">
                                                            {post.title}
                                                        </h4>

                                                        {/* Centered Content Excerpt */}
                                                        <p className="mb-3 line-clamp-3 text-center text-xs leading-relaxed font-semibold text-[#2e5445]">
                                                            {getExcerpt(
                                                                post.content,
                                                                120,
                                                            )}
                                                        </p>

                                                        {/* Centered Metadata */}
                                                        <p className="flex items-center justify-center gap-1.5 text-center text-[11px] font-bold text-[#527365] sm:text-xs">
                                                            <Calendar className="h-3.5 w-3.5 text-[#265243]" />
                                                            <span>
                                                                {
                                                                    post.created_at
                                                                }
                                                            </span>
                                                            <span>•</span>
                                                            <User className="h-3.5 w-3.5 text-[#265243]" />
                                                            <span>
                                                                {post.author}
                                                            </span>
                                                        </p>
                                                    </div>

                                                    {/* Bottom Action Button */}
                                                    <div className="pt-2">
                                                        <span className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full border border-[#c8dac5] bg-white px-4 py-2.5 text-xs font-black text-[#265243] shadow-2xs transition-all group-hover:bg-[#265243] group-hover:text-white">
                                                            <span>
                                                                Lihat Detail
                                                                Asrama
                                                            </span>
                                                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {renderPaginationControls(
                                        dormPage,
                                        totalDormPages,
                                        setDormPage,
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB 6: E-LEGALISIR ALUMNI (LEGALIZATION) - REMOVED, NOW OPENS EXTERNAL URL */}
                    {/* ========================================================================= */}

                    {/* ========================================================================= */}
                    {/* TAB 7: PENGADUAN MASYARAKAT (COMPLAINTS)                                  */}
                    {/* ========================================================================= */}
                    {activeTab === 'complaints' && (
                        <div className="mx-auto max-w-3xl space-y-6">
                            <div
                                style={{
                                    backgroundColor: '#ffffff',
                                    borderColor: '#c8dac5',
                                }}
                                className="space-y-6 rounded-3xl border p-6 shadow-md sm:p-8"
                            >
                                <div className="flex items-center gap-3 border-l-4 border-[#265243] pl-3">
                                    <div>
                                        <h3 className="text-xl font-black text-[#142921]">
                                            Layanan Pengaduan & Aspirasi
                                            Masyarakat
                                        </h3>
                                        <p className="mt-1 text-xs font-semibold text-[#527365]">
                                            Sampaikan masukan, saran, atau
                                            pengaduan secara langsung kepada
                                            pengelola sekolah.
                                        </p>
                                    </div>
                                </div>

                                <form
                                    onSubmit={handleComplaintSubmit}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1 block text-xs font-extrabold tracking-wider text-[#265243] uppercase">
                                                Nama Lengkap{' '}
                                                <span className="text-rose-600">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Nama pengirim..."
                                                value={complaintForm.data.name}
                                                onChange={(e) =>
                                                    complaintForm.setData(
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                                style={{
                                                    backgroundColor: '#ffffff',
                                                    borderColor: '#265243',
                                                    color: '#142921',
                                                }}
                                                className="w-full rounded-xl border-2 px-4 py-3 text-xs font-bold shadow-xs focus:ring-2 focus:ring-[#265243]/20 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-xs font-extrabold tracking-wider text-[#265243] uppercase">
                                                Email{' '}
                                                <span className="text-rose-600">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                placeholder="email@domain.com"
                                                value={complaintForm.data.email}
                                                onChange={(e) =>
                                                    complaintForm.setData(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                                style={{
                                                    backgroundColor: '#ffffff',
                                                    borderColor: '#265243',
                                                    color: '#142921',
                                                }}
                                                className="w-full rounded-xl border-2 px-4 py-3 text-xs font-bold shadow-xs focus:ring-2 focus:ring-[#265243]/20 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1 block text-xs font-extrabold tracking-wider text-[#265243] uppercase">
                                                No. Telefon / WhatsApp
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="0812xxxxxxxx"
                                                value={complaintForm.data.phone}
                                                onChange={(e) =>
                                                    complaintForm.setData(
                                                        'phone',
                                                        e.target.value,
                                                    )
                                                }
                                                style={{
                                                    backgroundColor: '#ffffff',
                                                    borderColor: '#265243',
                                                    color: '#142921',
                                                }}
                                                className="w-full rounded-xl border-2 px-4 py-3 text-xs font-bold shadow-xs focus:ring-2 focus:ring-[#265243]/20 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-xs font-extrabold tracking-wider text-[#265243] uppercase">
                                                Subjek Pengaduan{' '}
                                                <span className="text-rose-600">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Topik / judul pengaduan..."
                                                value={
                                                    complaintForm.data.subject
                                                }
                                                onChange={(e) =>
                                                    complaintForm.setData(
                                                        'subject',
                                                        e.target.value,
                                                    )
                                                }
                                                style={{
                                                    backgroundColor: '#ffffff',
                                                    borderColor: '#265243',
                                                    color: '#142921',
                                                }}
                                                className="w-full rounded-xl border-2 px-4 py-3 text-xs font-bold shadow-xs focus:ring-2 focus:ring-[#265243]/20 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-extrabold tracking-wider text-[#265243] uppercase">
                                            Isi Masukan & Pesan Pengaduan{' '}
                                            <span className="text-rose-600">
                                                *
                                            </span>
                                        </label>
                                        <textarea
                                            rows={5}
                                            required
                                            placeholder="Tuliskan laporan pengaduan, masukan, atau saran secara detail..."
                                            value={complaintForm.data.message}
                                            onChange={(e) =>
                                                complaintForm.setData(
                                                    'message',
                                                    e.target.value,
                                                )
                                            }
                                            style={{
                                                backgroundColor: '#ffffff',
                                                borderColor: '#265243',
                                                color: '#142921',
                                            }}
                                            className="w-full rounded-xl border-2 px-4 py-3 text-xs font-semibold shadow-xs focus:ring-2 focus:ring-[#265243]/20 focus:outline-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={complaintForm.processing}
                                        style={{
                                            backgroundColor: '#265243',
                                            color: '#ffffff',
                                        }}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-extrabold shadow-md transition-all hover:bg-[#1a3d31] disabled:opacity-50"
                                    >
                                        <Send className="h-4 w-4 text-white" />{' '}
                                        Kirim Pengaduan Sekarang
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </main>

                {/* ── MODAL READ ARTICLE NEWS DETAIL ───────────────────────────────── */}
                {selectedNews && (
                    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs duration-150">
                        <div
                            style={{
                                backgroundColor: '#ffffff',
                                borderColor: '#b8ceb0',
                            }}
                            className="flex max-h-[85vh] w-full max-w-2xl flex-col justify-between overflow-hidden rounded-3xl border shadow-2xl"
                        >
                            <div className="flex items-center justify-between border-b border-[#eef4eb] bg-[#f8faf7] p-6">
                                <div className="flex items-center gap-2 border-l-4 border-[#265243] pl-3">
                                    <h3 className="line-clamp-1 text-base font-extrabold text-[#142921]">
                                        {selectedNews.title}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setSelectedNews(null)}
                                    className="rounded-full p-1.5 text-[#265243] hover:bg-[#eaf2e7]"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-4 overflow-y-auto p-6">
                                {selectedNews.thumbnail && (
                                    <img
                                        src={selectedNews.thumbnail}
                                        alt={selectedNews.title}
                                        className="h-64 w-full rounded-2xl border border-[#b8ceb0] object-cover"
                                    />
                                )}
                                <div className="flex items-center gap-3 text-xs font-bold text-[#527365]">
                                    <span>
                                        Tanggal:{' '}
                                        {selectedNews.published_at || 'Baru'}
                                    </span>
                                    <span>•</span>
                                    <span>Penulis: {selectedNews.author}</span>
                                </div>
                                <div
                                    className="prose max-w-none space-y-3 text-xs leading-relaxed font-medium text-[#142921]"
                                    dangerouslySetInnerHTML={{
                                        __html: selectedNews.content,
                                    }}
                                />
                            </div>

                            <div className="border-t border-[#eef4eb] bg-[#f8faf7] p-4 text-right">
                                <button
                                    onClick={() => setSelectedNews(null)}
                                    style={{
                                        backgroundColor: '#265243',
                                        color: '#ffffff',
                                    }}
                                    className="rounded-xl px-6 py-2.5 text-xs font-extrabold hover:bg-[#1f4337]"
                                >
                                    Tutup Artikel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── MODAL LIGHTBOX GALLERY DETAIL ───────────────────────────────── */}
                {selectedGallery && (
                    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md duration-150">
                        <div className="w-full max-w-3xl space-y-4">
                            <div className="flex items-center justify-between text-white">
                                <div>
                                    <span className="rounded bg-[#265243] px-2.5 py-1 text-xs font-bold uppercase">
                                        {selectedGallery.category}
                                    </span>
                                    <h3 className="mt-1 text-base font-extrabold">
                                        {selectedGallery.title}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setSelectedGallery(null)}
                                    className="rounded-full bg-white/20 p-2 text-white hover:bg-white/40"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="flex items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-black shadow-2xl">
                                {selectedGallery.type === 'youtube' &&
                                selectedGallery.youtube_id ? (
                                    <div className="aspect-video w-full">
                                        <iframe
                                            src={`https://www.youtube-nocookie.com/embed/${selectedGallery.youtube_id}?autoplay=1`}
                                            title={selectedGallery.title}
                                            className="h-full w-full border-0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                ) : selectedGallery.display_image ? (
                                    <img
                                        src={selectedGallery.display_image}
                                        alt={selectedGallery.title}
                                        className="max-h-[70vh] w-full object-contain"
                                    />
                                ) : null}
                            </div>

                            {selectedGallery.description && (
                                <p className="text-center text-xs font-medium text-slate-300">
                                    {selectedGallery.description}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* ── 4. FLOATING BANNER BOX WITH FULL BACKGROUND IMAGE & CLEAN ELEGANT TYPOGRAPHY (MAN TANJUNGPINANG) ── */}
                {activeTab !== 'books' && (
                    <div className="relative z-30 mx-auto mt-16 -mb-20 w-full max-w-6xl px-4 sm:-mb-24">
                        <div className="relative flex min-h-[280px] flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border border-emerald-900/40 bg-[#142921] p-10 text-center text-white shadow-2xl sm:min-h-[340px] sm:p-16">
                            {/* Background Image (Full Box) */}
                            {settings.footer_banner_bg_url ? (
                                <img
                                    src={settings.footer_banner_bg_url}
                                    alt="Footer Banner Background"
                                    className="absolute inset-0 z-0 h-full w-full object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 z-0 bg-[#142921]" />
                            )}

                            {/* Dark Overlay for Text Readability */}
                            <div className="absolute inset-0 z-10 bg-black/60" />

                            {/* Centered Pure Typography Content */}
                            <div className="relative z-20 mx-auto flex max-w-3xl flex-col items-center space-y-4 text-center">
                                {/* PROMINENT CENTERED TITLE (MAN TANJUNGPINANG - MAN TOP, TANJUNGPINANG BOTTOM) */}
                                {(() => {
                                    const rawTitle =
                                        settings.footer_banner_title ||
                                        'MAN TANJUNGPINANG';
                                    const cleanTitle = rawTitle.replace(
                                        /TANJUNG\s+PINANG/gi,
                                        'TANJUNGPINANG',
                                    );
                                    if (
                                        cleanTitle
                                            .toUpperCase()
                                            .startsWith('MAN ')
                                    ) {
                                        const subTitle = cleanTitle
                                            .substring(4)
                                            .trim();
                                        return (
                                            <h3 className="flex flex-col items-center gap-1 text-center text-4xl leading-none font-black tracking-wider text-white uppercase drop-shadow-lg sm:text-6xl lg:text-7xl">
                                                <span>MAN</span>
                                                <span>{subTitle}</span>
                                            </h3>
                                        );
                                    }
                                    if (
                                        cleanTitle.toUpperCase() ===
                                        'MAN TANJUNGPINANG'
                                    ) {
                                        return (
                                            <h3 className="flex flex-col items-center gap-1 text-center text-4xl leading-none font-black tracking-wider text-white uppercase drop-shadow-lg sm:text-6xl lg:text-7xl">
                                                <span>MAN</span>
                                                <span>TANJUNGPINANG</span>
                                            </h3>
                                        );
                                    }
                                    return (
                                        <h3 className="flex flex-col items-center text-center text-4xl leading-tight font-black tracking-wider text-white uppercase drop-shadow-lg sm:text-6xl lg:text-7xl">
                                            {cleanTitle
                                                .split('\n')
                                                .map((line, idx) => (
                                                    <span key={idx}>
                                                        {line}
                                                    </span>
                                                ))}
                                        </h3>
                                    );
                                })()}

                                {/* Clean Subtitle Text */}
                                <p className="max-w-2xl text-center font-sans text-xs leading-relaxed font-medium tracking-wide text-emerald-100/90 sm:text-base">
                                    {settings.footer_banner_subtitle ||
                                        'Mewujudkan Generasi Cerdas, Berkarakter, dan Berdaya Saing Global'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── FOOTER CONTAINER (CALM SOFT PALETTE & CLEAN WHITE TYPOGRAPHY) ── */}
                <footer
                    className={`mt-auto border-t border-[#265243] bg-[#142921] pb-8 text-white shadow-2xl ${activeTab === 'books' ? 'pt-12 sm:pt-16' : 'pt-32 sm:pt-36'}`}
                >
                    <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
                            {/* Col 1 & 2: Brand Identity & Social Icons */}
                            <div className="space-y-4 lg:col-span-2">
                                <div
                                    className="flex cursor-pointer items-center gap-3"
                                    onClick={() => setActiveTab('home')}
                                >
                                    {settings.school_logo_url ? (
                                        <img
                                            src={settings.school_logo_url}
                                            alt="Logo"
                                            className="h-11 w-11 object-contain"
                                        />
                                    ) : (
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl font-black text-[#142921] shadow-sm">
                                            S
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-base font-black tracking-tight text-white">
                                            {schoolName}
                                        </h3>
                                        <p className="text-[11px] font-bold text-[#b5d6c6]">
                                            Portal Resmi Sekolah
                                        </p>
                                    </div>
                                </div>
                                <p className="max-w-sm text-xs leading-relaxed font-medium text-[#eaf2ee]">
                                    {schoolTagline}
                                </p>

                                {/* Social Media Icons Row (Connected to Admin CMS Settings) */}
                                <div className="flex items-center gap-2 pt-2">
                                    <a
                                        href={settings.footer_facebook || '#'}
                                        target={
                                            settings.footer_facebook
                                                ? '_blank'
                                                : '_self'
                                        }
                                        rel="noopener noreferrer"
                                        title="Facebook"
                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-xs transition-all duration-300 hover:scale-110 hover:bg-white hover:text-[#142921]"
                                    >
                                        <svg
                                            className="h-4 w-4 fill-current"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    </a>
                                    <a
                                        href={settings.footer_instagram || '#'}
                                        target={
                                            settings.footer_instagram
                                                ? '_blank'
                                                : '_self'
                                        }
                                        rel="noopener noreferrer"
                                        title="Instagram"
                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-xs transition-all duration-300 hover:scale-110 hover:bg-white hover:text-[#142921]"
                                    >
                                        <svg
                                            className="h-4 w-4 fill-current"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    </a>
                                    <a
                                        href={settings.footer_youtube || '#'}
                                        target={
                                            settings.footer_youtube
                                                ? '_blank'
                                                : '_self'
                                        }
                                        rel="noopener noreferrer"
                                        title="YouTube"
                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-xs transition-all duration-300 hover:scale-110 hover:bg-white hover:text-[#142921]"
                                    >
                                        <svg
                                            className="h-4 w-4 fill-current"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                        </svg>
                                    </a>
                                    <a
                                        href={`mailto:${settings.footer_email || settings.school_email || 'info@sekolah.sch.id'}`}
                                        title="Email"
                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-xs transition-all duration-300 hover:scale-110 hover:bg-white hover:text-[#142921]"
                                    >
                                        <Mail className="h-4 w-4" />
                                    </a>
                                    <a
                                        href={`tel:${settings.footer_phone || settings.school_phone || '(021) 12345678'}`}
                                        title="Telepon"
                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-xs transition-all duration-300 hover:scale-110 hover:bg-white hover:text-[#142921]"
                                    >
                                        <Phone className="h-4 w-4" />
                                    </a>
                                </div>
                            </div>

                            {/* Col 3: Profil Sekolah */}
                            <div className="space-y-3">
                                <h4 className="border-b border-[#265243] pb-2 text-xs font-black tracking-wider text-[#b5d6c6] uppercase">
                                    Profil Sekolah
                                </h4>
                                <ul className="space-y-2.5 text-xs font-medium">
                                    {[
                                        { id: 'home', label: 'Beranda Utama' },
                                        {
                                            id: 'news',
                                            label: 'Berita & Pengumuman',
                                        },
                                        {
                                            id: 'gallery',
                                            label: 'Galeri Dokumentasi',
                                        },
                                        {
                                            id: 'books',
                                            label: 'Perpustakaan Digital',
                                        },
                                        {
                                            id: 'dormitory',
                                            label: 'Informasi Asrama',
                                        },
                                    ].map((item) => (
                                        <li key={item.id}>
                                            <button
                                                onClick={() =>
                                                    setActiveTab(item.id as any)
                                                }
                                                className="group flex items-center gap-1.5 text-left text-[#eaf2ee] transition-all hover:translate-x-1 hover:text-white"
                                            >
                                                <ChevronRight className="h-3.5 w-3.5 text-[#9dc3b2] transition-transform group-hover:translate-x-0.5" />
                                                <span>{item.label}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Col 4: Layanan Digital */}
                            <div className="space-y-3">
                                <h4 className="border-b border-[#265243] pb-2 text-xs font-black tracking-wider text-[#b5d6c6] uppercase">
                                    Layanan Digital
                                </h4>
                                <ul className="space-y-2.5 text-xs font-medium">
                                    {[
                                        {
                                            id: 'legalization',
                                            label: 'Permohonan E-Legalisir',
                                        },
                                        {
                                            id: 'complaints',
                                            label: 'Kotak Pengaduan Digital',
                                        },
                                    ].map((item) => (
                                        <li key={item.id}>
                                            <button
                                                onClick={() =>
                                                    setActiveTab(item.id as any)
                                                }
                                                className="group flex items-center gap-1.5 text-left text-[#eaf2ee] transition-all hover:translate-x-1 hover:text-white"
                                            >
                                                <ChevronRight className="h-3.5 w-3.5 text-[#9dc3b2] transition-transform group-hover:translate-x-0.5" />
                                                <span>{item.label}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <div className="pt-2">
                                    <p className="text-[11px] font-extrabold text-[#b5d6c6]">
                                        Jam Layanan:
                                    </p>
                                    <p className="mt-0.5 text-xs font-medium text-[#eaf2ee]">
                                        Senin - Jumat: 07.30 - 16.00 WIB
                                    </p>
                                </div>
                            </div>

                            {/* Col 5: Hubungi Kami */}
                            <div className="space-y-3">
                                <h4 className="border-b border-[#265243] pb-2 text-xs font-black tracking-wider text-[#b5d6c6] uppercase">
                                    Hubungi Kami
                                </h4>
                                <div className="space-y-2.5 text-xs font-medium text-[#eaf2ee]">
                                    <p className="flex items-start gap-2.5">
                                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#9dc3b2]" />
                                        <span>
                                            {settings.school_address ||
                                                'Jl. Pendidikan No. 1, Kota Sekolah'}
                                        </span>
                                    </p>
                                    <p className="flex items-center gap-2.5">
                                        <Phone className="h-4 w-4 shrink-0 text-[#9dc3b2]" />
                                        <span>
                                            {settings.school_phone ||
                                                '(021) 12345678'}
                                        </span>
                                    </p>
                                    <p className="flex items-center gap-2.5">
                                        <Mail className="h-4 w-4 shrink-0 text-[#9dc3b2]" />
                                        <span>
                                            {settings.school_email ||
                                                'info@sekolah.sch.id'}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Copyright Bar */}
                        <div className="border-t border-[#265243] pt-6 text-center text-xs font-medium text-white/70 sm:text-left">
                            <p>
                                {settings.footer_copyright ||
                                    `© Copyright ${new Date().getFullYear()} ${schoolName}. All rights reserved.`}
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
