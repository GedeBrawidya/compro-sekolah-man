import { Link } from '@inertiajs/react';
import {
    BookOpen,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Eye,
    GraduationCap,
    Image as ImageIcon,
    Newspaper,
    ShieldCheck,
    User,
} from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';
import {
    BannerItem,
    GalleryItem,
    NewsItem,
    TabType,
    WelcomeStats,
} from './types';

interface HomeTabProps {
    banners: BannerItem[];
    settings: Record<string, string>;
    news: NewsItem[];
    galleries: GalleryItem[];
    featuredGalleries: GalleryItem[];
    stats: WelcomeStats;
    currentBannerIndex: number;
    activeGalleryIndex: number;
    showWatermark: boolean;
    setCurrentBannerIndex: React.Dispatch<React.SetStateAction<number>>;
    setActiveGalleryIndex: React.Dispatch<React.SetStateAction<number>>;
    setSelectedGallery: (item: GalleryItem | null) => void;
    handleBannerTouchStart: (e: React.TouchEvent) => void;
    handleBannerTouchEnd: (e: React.TouchEvent) => void;
    handleGalleryTouchStart: (e: React.TouchEvent) => void;
    handleGalleryTouchEnd: (e: React.TouchEvent) => void;
    handleTabClick: (tabId: TabType) => void;
}

export function HomeTab({
    banners,
    settings,
    news,
    galleries,
    featuredGalleries,
    stats,
    currentBannerIndex,
    activeGalleryIndex,
    showWatermark,
    setCurrentBannerIndex,
    setActiveGalleryIndex,
    setSelectedGallery,
    handleBannerTouchStart,
    handleBannerTouchEnd,
    handleGalleryTouchStart,
    handleGalleryTouchEnd,
    handleTabClick,
}: HomeTabProps) {
    const rawSchoolName = settings.school_name || 'MAN TANJUNGPINANG';
    const schoolName =
        rawSchoolName.trim().toUpperCase() === 'MAN'
            ? 'MAN TANJUNGPINANG'
            : rawSchoolName;
    const schoolTagline =
        settings.school_tagline ||
        'Mewujudkan Generasi Cerdas, Berkarakter, dan Berdaya Saing Global';

    return (
        <>
            {/* ── 2. HERO BANNER SLIDER (FULL WIDTH max-w-[98%] xl:max-w-[96%]) ── */}
            <div data-aos="fade-up" data-aos-duration="1000" className="relative z-20 mx-auto mt-2 w-full max-w-[98%] px-2 sm:mt-4 sm:px-4 xl:max-w-[96%]">
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

                    {/* GIANT BACKGROUND WATERMARK TYPOGRAPHY */}
                    <div
                        className={`pointer-events-none absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center overflow-hidden transition-opacity duration-1000 select-none ${showWatermark ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <span className="text-[7rem] leading-none font-black tracking-widest whitespace-nowrap text-white/10 uppercase sm:text-[13rem] lg:text-[17rem]">
                            {banners[currentBannerIndex]?.title
                                ? banners[currentBannerIndex].title.split(' ')[0]
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

                    {/* Bottom Row inside Banner Card */}
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
                                {banners[currentBannerIndex]?.subtitle ||
                                    schoolTagline}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 pt-3">
                                <button
                                    onClick={() => handleTabClick('news')}
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
                            <>
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
                                                    (prev + 1) % banners.length,
                                            )
                                        }
                                        aria-label="Next Banner"
                                        className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#142921] shadow-lg transition-all hover:scale-105 hover:bg-[#265243] hover:text-white active:scale-95"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Mobile Slide Indicator Dots */}
                                <div className="flex items-center justify-center gap-1.5 pt-2 sm:hidden">
                                    {banners.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() =>
                                                setCurrentBannerIndex(idx)
                                            }
                                            aria-label={`Go to banner slide ${idx + 1}`}
                                            className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ${
                                                idx === currentBannerIndex
                                                    ? 'w-6 bg-emerald-400'
                                                    : 'w-1.5 bg-white/40'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ── 3. SECTION: KOTAK PINTASAN CEPAT ── */}
            <div data-aos="fade-up" data-aos-delay="100" className="relative z-30 mx-auto mt-4 w-full max-w-[98%] px-2 sm:mt-5 sm:px-4 xl:max-w-[96%]">
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
                                onClick={() => handleTabClick(st.tab as any)}
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

            {/* ── MAIN CONTENT CONTAINER FOR HOME ── */}
            <main className="mx-auto w-full max-w-7xl flex-1 space-y-12 px-4 pt-6 pb-16 sm:space-y-18 sm:px-6 sm:pt-8 lg:px-8">
                <div className="space-y-12 sm:space-y-18 lg:space-y-20">
                    {/* SECTION: SAMBUTAN KEPALA SEKOLAH */}
                    <section data-aos="fade-up" data-aos-duration="900" className="space-y-10 pb-4 sm:space-y-14 lg:pb-8">
                        <div className="relative -mx-2 mt-4 pt-10 sm:-mx-12 sm:mt-10 sm:pt-28 lg:-mx-20 lg:pt-32">
                            <div className="relative flex min-h-[580px] flex-col justify-between space-y-12 rounded-[2.5rem] bg-[#064e3b] p-5 text-white shadow-2xl sm:space-y-20 sm:rounded-[3.5rem] sm:p-14 lg:min-h-[680px] lg:p-20">
                                {/* MAIN GRID */}
                                <div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
                                    {/* KOLOM KIRI: KATA SAMBUTAN */}
                                    <div data-aos="fade-right" data-aos-delay="150" className="relative space-y-8 lg:col-span-7">
                                        <div className="pointer-events-none absolute -top-10 -left-6 z-0 text-[11rem] leading-none font-black text-[#10b981]/15 select-none">
                                            “
                                        </div>

                                        <div className="relative z-10 space-y-2">
                                            <h3 className="font-sans text-2xl leading-tight font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                                                Selamat Datang di {schoolName}
                                            </h3>
                                        </div>

                                        {/* Editorial Paragraphs */}
                                        <div className="relative z-10 max-w-3xl space-y-4 text-xs leading-relaxed font-normal text-slate-100 sm:text-sm lg:text-base">
                                            {settings.principal_bio ? (
                                                <div className="space-y-3 font-medium whitespace-pre-line">
                                                    {settings.principal_bio}
                                                </div>
                                            ) : (
                                                <>
                                                    <p className="text-sm font-bold text-white italic sm:text-base lg:text-lg">
                                                        Assalamu'alaikum Warahmatullahi
                                                        Wabarakatuh,
                                                    </p>
                                                    <p>
                                                        Selamat datang di portal resmi{' '}
                                                        {settings.school_name ||
                                                            'MAN Tanjungpinang'}
                                                        . Sebagai lembaga pendidikan
                                                        unggulan, kami berkomitmen
                                                        menyelenggarakan pembelajaran
                                                        bermutu tinggi yang melahirkan
                                                        generasi cerdas, berkarakter
                                                        Pancasila, serta tangguh
                                                        menghadapi tantangan global.
                                                    </p>
                                                    <p className="pt-1 font-bold text-white italic">
                                                        Wassalamu'alaikum Warahmatullahi
                                                        Wabarakatuh.
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* KOLOM KANAN: FOTO KEPALA SEKOLAH */}
                                    <div data-aos="fade-left" data-aos-delay="200" className="relative z-20 mt-4 flex items-center justify-center pt-4 sm:-mt-36 lg:col-span-5 lg:-mt-52 lg:justify-end lg:pt-0">
                                        <div className="relative z-10 flex h-[380px] w-72 shrink-0 items-center justify-center overflow-hidden rounded-[6rem] bg-[#fef08a] shadow-2xl sm:h-[440px] sm:w-88 lg:h-[500px] lg:w-[400px]">
                                            {settings.principal_photo_url ? (
                                                <img
                                                    src={settings.principal_photo_url}
                                                    alt="Foto Kepala Sekolah"
                                                    className="h-full w-full rounded-[6rem] object-cover object-top"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full flex-col items-center justify-center bg-[#fef08a] p-8 text-center text-[#022c22]">
                                                    <User className="mb-2 h-24 w-24 text-[#064e3b]" />
                                                    <span className="text-xs font-bold text-[#064e3b]">
                                                        Foto Kepala Sekolah
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Floating Overlay Card */}
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
                                                Membangun Generasi Pendidikan
                                                Berkualitas
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* SECTION STATISTIK BAWAH */}
                                <div className="relative z-10 border-t border-white/10 pt-8 sm:pt-14">
                                    <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
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

                    {/* ── SECTION: GALERI DOKUMENTASI ── */}
                    <section data-aos="fade-up" className="mt-8 space-y-10 pt-3 pb-6 sm:mt-12 sm:pt-5 lg:pb-12">
                        <div className="mx-auto max-w-2xl space-y-2 text-center">
                            <p className="text-xs font-extrabold tracking-widest text-[#527365] uppercase italic sm:text-sm">
                                Dokumentasi Unggulan
                            </p>
                            <h3 className="font-sans text-3xl leading-tight font-black tracking-tight text-[#142921] sm:text-5xl">
                                Fasilitas & Layanan Pendidikan Terlengkap
                            </h3>
                        </div>

                        {featuredGalleries.length > 0 ? (
                            <div className="space-y-6 px-3 sm:-mx-12 sm:px-0 lg:-mx-20">
                                {/* HERO SHOWCASE CARD */}
                                <div
                                    onClick={() =>
                                        setSelectedGallery(
                                            featuredGalleries[
                                                activeGalleryIndex %
                                                    (featuredGalleries.length || 1)
                                            ],
                                        )
                                    }
                                    onTouchStart={handleGalleryTouchStart}
                                    onTouchEnd={handleGalleryTouchEnd}
                                    className="group relative flex min-h-[420px] cursor-pointer flex-col justify-between overflow-hidden rounded-[2.5rem] bg-[#142921] p-6 text-white shadow-xl sm:min-h-[540px] sm:p-10 lg:min-h-[620px] lg:p-12"
                                >
                                    {featuredGalleries[
                                        activeGalleryIndex %
                                            (featuredGalleries.length || 1)
                                    ]?.display_image ? (
                                        <img
                                            src={
                                                featuredGalleries[
                                                    activeGalleryIndex %
                                                        (featuredGalleries.length || 1)
                                                ].display_image!
                                            }
                                            alt={
                                                featuredGalleries[
                                                    activeGalleryIndex %
                                                        (featuredGalleries.length || 1)
                                                ].title
                                            }
                                            className="absolute inset-0 h-full w-full object-cover opacity-100 transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-[#142921]" />
                                    )}

                                    <div className="absolute inset-0 z-10 bg-black/50" />

                                    <div className="relative z-20 flex items-center justify-between">
                                        <span className="rounded-full bg-[#265243] px-4 py-1.5 text-xs font-black tracking-wider text-white uppercase shadow-md">
                                            DOKUMENTASI VISUAL
                                        </span>
                                        <span className="rounded-full border border-emerald-700/50 bg-[#142921] px-3.5 py-1 text-[11px] font-extrabold tracking-wider text-emerald-100 uppercase">
                                            {featuredGalleries[
                                                activeGalleryIndex %
                                                    (featuredGalleries.length || 1)
                                            ]?.category || 'FASILITAS'}
                                        </span>
                                    </div>

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
                                                            {featuredGalleries.length}
                                                        </span>
                                                    </span>
                                                    <span className="rounded-full bg-[#265243] px-3 py-1 text-xs font-extrabold text-emerald-100 uppercase shadow-xs">
                                                        {featuredGalleries[
                                                            activeGalleryIndex %
                                                                (featuredGalleries.length ||
                                                                    1)
                                                        ]?.type === 'youtube'
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
                                                        (featuredGalleries.length || 1)
                                                ]?.description && (
                                                    <p className="line-clamp-2 text-xs leading-relaxed font-medium text-slate-200 sm:text-sm">
                                                        {
                                                            featuredGalleries[
                                                                activeGalleryIndex %
                                                                    (featuredGalleries.length ||
                                                                        1)
                                                            ].description
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
                                                                (prev + 1) %
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

                                {/* Slide Progress Indicator Dots */}
                                {featuredGalleries.length > 1 && (
                                    <div className="flex items-center justify-center gap-2 pt-2 pb-1">
                                        {featuredGalleries.map((_, idx) => {
                                            const isActive =
                                                idx ===
                                                activeGalleryIndex %
                                                    featuredGalleries.length;
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() =>
                                                        setActiveGalleryIndex(idx)
                                                    }
                                                    aria-label={`Go to slide ${idx + 1}`}
                                                    className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                                                        isActive
                                                            ? 'w-8 bg-[#265243] shadow-xs'
                                                            : 'w-2 bg-[#c8dac5] hover:bg-[#527365]'
                                                    }`}
                                                />
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Mobile Button */}
                                <div className="flex justify-center pt-1 sm:hidden">
                                    <button
                                        onClick={() => handleTabClick('gallery')}
                                        className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full border border-[#c8dac5] bg-[#f4f8f3] px-6 py-3 text-center text-xs font-extrabold text-[#265243] shadow-xs transition-all hover:bg-[#265243] hover:text-white"
                                    >
                                        <span>Lihat Semua Galeri</span>
                                    </button>
                                </div>

                                {/* Interactive Thumbnail Carousel (Desktop) */}
                                <div className="hidden grid-cols-3 gap-4 pt-2 sm:grid lg:grid-cols-6">
                                    {featuredGalleries.map((item, idx) => (
                                        <div
                                            key={item.id}
                                            onClick={() => setActiveGalleryIndex(idx)}
                                            className={`group relative h-28 cursor-pointer overflow-hidden rounded-2xl border transition-all lg:h-32 ${
                                                idx ===
                                                activeGalleryIndex %
                                                    (featuredGalleries.length || 1)
                                                    ? 'scale-[1.02] border-[#265243] shadow-lg ring-4 ring-[#265243]'
                                                    : 'border-[#c8dac5] opacity-80 hover:border-[#265243] hover:opacity-100'
                                            }`}
                                        >
                                            {item.display_image ? (
                                                <img
                                                    src={item.display_image}
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
                                    ))}

                                    <div className="col-span-1 flex h-28 items-center justify-center lg:h-32">
                                        <button
                                            onClick={() => handleTabClick('gallery')}
                                            className="group inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#c8dac5] bg-[#f4f8f3] px-5 py-3 text-xs font-extrabold whitespace-nowrap text-[#265243] shadow-xs transition-all hover:bg-[#265243] hover:text-white"
                                        >
                                            <span>Lihat Semua Galeri</span>
                                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-[#c8dac5] bg-white p-12 text-center">
                                <ImageIcon className="mx-auto mb-3 h-12 w-12 text-[#265243]" />
                                <p className="text-sm font-bold text-[#142921]">
                                    Belum ada foto atau video dalam galeri.
                                </p>
                            </div>
                        )}
                    </section>

                    {/* ── SECTION: BERITA TERBARU ── */}
                    <section data-aos="fade-up" className="mt-6 space-y-8 px-3 pt-2 sm:-mx-12 sm:mt-10 sm:px-0 sm:pt-4 lg:-mx-20">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                            <div className="space-y-1">
                                <p className="text-xs font-bold tracking-widest text-[#527365] uppercase">
                                    Informasi & Pengumuman
                                </p>
                                <h3 className="font-sans text-3xl leading-tight font-black tracking-tight text-[#142921] sm:text-5xl">
                                    Kabar & Prestasi Terbaru Sekolah
                                </h3>
                            </div>
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
                                    Belum ada artikel berita yang dipublikasikan.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {news.slice(0, 6).map((item, idx) => (
                                        <Link
                                            key={item.id}
                                            href={`/news/${item.slug}`}
                                            data-aos="fade-up"
                                            data-aos-delay={idx * 100}
                                            className="group relative flex flex-col justify-between overflow-hidden rounded-[2.25rem] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                                        >
                                            <div className="absolute top-4 left-4 z-10">
                                                <span className="rounded-md bg-[#f59e0b] px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-white uppercase shadow-md sm:text-[11px]">
                                                    {idx === 0 ? 'BARU' : 'BERITA'}
                                                </span>
                                            </div>

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

                                            <div className="flex flex-1 flex-col justify-between space-y-4 p-5 sm:p-6">
                                                <div>
                                                    <h4 className="mb-2 line-clamp-2 px-1 text-center font-sans text-base leading-snug font-extrabold text-[#142921] transition-colors group-hover:text-[#265243] sm:text-lg">
                                                        {item.title}
                                                    </h4>

                                                    <div className="my-1.5 flex items-center justify-center gap-1.5 text-xs font-extrabold text-[#527365]">
                                                        <Eye className="h-3.5 w-3.5 text-[#265243]" />
                                                        <span>
                                                            {item.views_count || 0}{' '}
                                                            Dilihat
                                                        </span>
                                                    </div>

                                                    <p className="flex items-center justify-center gap-1.5 text-center text-[11px] font-bold text-[#527365] sm:text-xs">
                                                        <Calendar className="h-3.5 w-3.5 text-[#265243]" />
                                                        <span>
                                                            {item.published_at ||
                                                                'Terbaru'}
                                                        </span>
                                                        <span>•</span>
                                                        <User className="h-3.5 w-3.5 text-[#265243]" />
                                                        <span>{item.author}</span>
                                                    </p>
                                                </div>

                                                <div className="pt-2">
                                                    <span className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full border border-[#c8dac5] bg-white px-4 py-2.5 text-xs font-black text-[#265243] shadow-2xs transition-all group-hover:bg-[#265243] group-hover:text-white">
                                                        <span>Baca Selengkapnya</span>
                                                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                <div className="flex justify-center pt-2 sm:hidden">
                                    <button
                                        onClick={() => handleTabClick('news')}
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
            </main>
        </>
    );
}
