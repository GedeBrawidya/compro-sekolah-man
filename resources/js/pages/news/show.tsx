import React, { useEffect, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    Calendar,
    ChevronRight,
    Clock,
    Copy,
    Check,
    Eye,
    Globe,
    LogIn,
    MessageSquare,
    Newspaper,
    Pin,
    Share2,
    Star,
    User,
    Image as ImageIcon,
    Award,
    MapPin,
    Phone,
    Mail,
    Bookmark,
} from 'lucide-react';

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

interface PageProps {
    news: NewsItem;
    recentNews: NewsItem[];
    settings: Record<string, string>;
    auth?: {
        user?: any;
    };
}

export default function NewsShow({
    news,
    recentNews,
    settings,
    auth,
}: PageProps) {
    const [copied, setCopied] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

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

    const schoolName = settings?.school_name || 'MAN TANJUNGPINANG';
    const schoolTagline =
        settings?.school_tagline ||
        'BERSINAR : Bersih, Sehat, Indah, Aman, Ramah';
    const logoUrl = settings?.school_logo_url || null;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Helper to format HTML content into clean paragraphs if plain text is provided
    const renderArticleContent = () => {
        if (!news.content)
            return (
                <p className="text-slate-500 italic">
                    Tidak ada konten berita.
                </p>
            );

        const isHtml = /<[a-z][\s\S]*>/i.test(news.content);
        if (isHtml) {
            return (
                <div
                    className="prose prose-lg prose-headings:font-black prose-headings:text-[#142921] prose-a:text-[#265243] prose-a:font-bold prose-img:rounded-2xl prose-blockquote:border-l-4 prose-blockquote:border-[#265243] prose-blockquote:bg-[#f4f8f3] prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:italic max-w-none font-sans leading-relaxed text-slate-800"
                    dangerouslySetInnerHTML={{ __html: news.content }}
                />
            );
        }

        const paragraphs = news.content.split(/\n\s*\n/).filter(Boolean);
        return (
            <div className="space-y-6 font-sans text-base leading-relaxed text-slate-800 sm:text-lg">
                {paragraphs.map((para, idx) => (
                    <p
                        key={idx}
                        className={
                            idx === 0
                                ? 'first-letter:float-left first-letter:mt-1 first-letter:mr-3.5 first-letter:text-6xl first-letter:leading-none first-letter:font-black first-letter:text-[#265243]'
                                : ''
                        }
                    >
                        {para.trim()}
                    </p>
                ))}
            </div>
        );
    };

    return (
        <>
            <Head title={`${news.title} - ${schoolName}`}>
                {logoUrl && <link rel="icon" href={logoUrl} />}
                {logoUrl && <link rel="shortcut icon" href={logoUrl} />}
                {logoUrl && <link rel="apple-touch-icon" href={logoUrl} />}
            </Head>

            <div className="flex min-h-screen flex-col bg-[#f4f7f4] font-sans text-slate-900 selection:bg-[#265243] selection:text-white">
                {/* ── TOP HEADER / NAVBAR (DYNAMIC MORPH ON SCROLL) ────────────────── */}
                <div className="pointer-events-none sticky top-0 z-50 flex w-full justify-center transition-all duration-500 ease-in-out">
                    <header
                        className={`pointer-events-auto flex items-center justify-between transition-all duration-500 ease-in-out ${
                            isScrolled
                                ? 'mt-3 w-[calc(100%-2rem)] max-w-6xl rounded-full border border-[#c8dac5] bg-white/90 px-6 py-2.5 shadow-2xl backdrop-blur-xl'
                                : 'w-full max-w-full border-b border-[#c8dac5] bg-[#f4f8f3]/95 px-4 py-3.5 shadow-xs backdrop-blur-md sm:px-8'
                        }`}
                    >
                        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
                            {/* Logo & School Name */}
                            <Link
                                href="/"
                                className="group flex shrink-0 items-center gap-3"
                            >
                                {logoUrl ? (
                                    <img
                                        src={logoUrl}
                                        alt={schoolName}
                                        className="h-9 w-9 object-contain drop-shadow-sm transition-transform group-hover:scale-105 sm:h-10 sm:w-10"
                                    />
                                ) : (
                                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#265243] text-base font-black text-white shadow-md transition-transform group-hover:scale-105 sm:h-10 sm:w-10 sm:text-lg">
                                        M
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className="text-sm leading-tight font-extrabold tracking-tight text-[#142921] transition-colors group-hover:text-[#265243] sm:text-base">
                                        {schoolName}
                                    </span>
                                    <span className="hidden text-[9px] font-extrabold tracking-wider text-[#527365] uppercase sm:block sm:text-[10px]">
                                        {schoolTagline}
                                    </span>
                                </div>
                            </Link>

                            {/* Back to Home button */}
                            <div className="flex shrink-0 items-center gap-3">
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 rounded-full border border-[#c8dac5] bg-white px-4 py-2 text-xs font-black text-[#265243] shadow-xs transition-all hover:bg-[#265243] hover:text-white"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    <span className="hidden sm:inline">
                                        Kembali ke Beranda
                                    </span>
                                    <span className="sm:hidden">Beranda</span>
                                </Link>
                            </div>
                        </div>
                    </header>
                </div>

                {/* ── MAIN NEWSPAPER EDITORIAL CARD ─────────────────────────────────── */}
                <main className="mx-auto w-full max-w-7xl flex-1 space-y-12 px-3 py-8 sm:px-6 sm:py-12">
                    <article className="overflow-hidden rounded-[2rem] border border-[#c8dac5]/80 bg-white shadow-2xl sm:rounded-[2.5rem]">
                        {/* 1. EDITORIAL HEADER BAR (EXACT REFERENCE DESIGN - G BADGE / AUTHOR TAG & TOP ACTIONS) */}
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 pt-8 pb-4 text-xs font-semibold text-slate-500 sm:px-12">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#265243] text-lg font-black text-white shadow-sm">
                                    G
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                        Informasi Publik & Berita
                                    </span>
                                    <span className="cursor-pointer font-extrabold text-[#265243] hover:underline">
                                        Liputan Resmi {schoolName}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-slate-400">
                                <button
                                    onClick={handleCopyLink}
                                    title="Bagikan Berita"
                                    className="flex items-center gap-1.5 rounded-full p-2 transition-colors hover:bg-slate-100 hover:text-[#265243]"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="h-4 w-4 text-emerald-600" />
                                            <span className="text-[11px] font-bold text-emerald-600">
                                                Tersalin!
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <Share2 className="h-4 w-4" />
                                            <span className="hidden text-[11px] sm:inline">
                                                Bagikan
                                            </span>
                                        </>
                                    )}
                                </button>
                                <span className="h-4 w-px bg-slate-200" />
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                                    <Calendar className="h-3.5 w-3.5 text-[#265243]" />
                                    <span>
                                        {news.published_at || 'Terbaru'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 2. EDITORIAL ARTICLE TITLE & BYLINE */}
                        <div className="px-6 pt-8 pb-6 sm:px-12">
                            <div className="max-w-4xl space-y-4">
                                <span className="inline-block rounded-full border border-[#c8dac5] bg-[#f4f8f3] px-3.5 py-1 text-[11px] font-black tracking-widest text-[#265243] uppercase">
                                    Kabar Utama Sekolah
                                </span>
                                <h1 className="text-3xl leading-[1.15] font-black tracking-tight text-[#142921] sm:text-5xl lg:text-6xl">
                                    {news.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-slate-100 pt-2 pb-6 text-xs font-semibold text-slate-500 sm:text-sm">
                                    <span className="flex items-center gap-1.5 font-extrabold text-slate-800">
                                        <User className="h-4 w-4 text-[#265243]" />
                                        Oleh{' '}
                                        <span className="text-[#265243]">
                                            {news.author}
                                        </span>
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4 text-slate-400" />
                                        {news.published_at ||
                                            'Dipublikasikan Baru Saja'}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1.5 font-bold text-[#265243]">
                                        <Eye className="h-4 w-4 text-[#265243]" />
                                        {news.views_count || 0} Dilihat
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 3. SPLIT EDITORIAL CONTENT GRID (LEFT: CONTENT & IMAGE, RIGHT: REAL-TIME HIGHLIGHTS) */}
                        <div className="grid grid-cols-1 gap-10 px-6 pb-12 sm:px-12 lg:grid-cols-12 lg:gap-12">
                            {/* LEFT COLUMN: ARTICLE BODY & THUMBNAIL (8 COLS) */}
                            <div className="space-y-8 lg:col-span-8">
                                {/* Featured Thumbnail Image */}
                                {news.thumbnail && (
                                    <div className="group relative overflow-hidden rounded-3xl border border-slate-200/80 shadow-xl">
                                        <img
                                            src={news.thumbnail}
                                            alt={news.title}
                                            className="max-h-[500px] w-full object-cover transition-transform duration-500 group-hover:scale-102"
                                        />
                                        <div className="absolute right-3 bottom-3 rounded-full bg-black/65 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur-md">
                                            Dokumentasi Humas
                                        </div>
                                    </div>
                                )}

                                {/* Article Main Paragraph Text */}
                                {renderArticleContent()}
                            </div>

                            {/* RIGHT COLUMN: REAL-TIME / RECENT HIGHLIGHTS SIDEBAR (4 COLS - MATCHING REFERENCE) */}
                            <div className="space-y-8 border-t border-slate-200 pt-8 lg:col-span-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
                                {/* Sidebar Box Header */}
                                <div className="space-y-1 border-b border-slate-200 pb-4">
                                    <p className="text-[11px] font-black tracking-widest text-[#527365] uppercase">
                                        Real time / Terkini
                                    </p>
                                    <h3 className="text-xl font-black text-[#142921]">
                                        Berita Terkait Lainnya
                                    </h3>
                                </div>

                                {/* List of Quick News Highlights */}
                                <div className="space-y-6">
                                    {recentNews.length > 0 ? (
                                        recentNews.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={`/news/${item.slug}`}
                                                className="group block space-y-2 border-b border-slate-100 pb-5 transition-opacity last:border-b-0 hover:opacity-90"
                                            >
                                                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                                                    <span className="tracking-wider text-[#265243] uppercase">
                                                        {item.author}
                                                    </span>
                                                    <span>
                                                        {item.published_at}
                                                    </span>
                                                </div>
                                                <h4 className="line-clamp-2 text-sm leading-snug font-extrabold text-[#142921] transition-colors group-hover:text-[#265243] group-hover:underline sm:text-base">
                                                    {item.title}
                                                </h4>
                                            </Link>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-400 italic">
                                            Belum ada berita terkini lainnya.
                                        </p>
                                    )}
                                </div>

                                {/* Action Banner Card inside Sidebar */}
                                <div className="space-y-4 rounded-3xl border border-emerald-900/40 bg-[#142921] p-6 text-white shadow-lg">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 font-bold text-emerald-300">
                                        <Globe className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-black text-white">
                                            Layanan Online Sekolah
                                        </h4>
                                        <p className="text-xs font-medium text-emerald-100/80">
                                            Dapatkan akses permohonan
                                            e-legalisir dan informasi
                                            pendaftaran secara cepat.
                                        </p>
                                    </div>
                                    <Link
                                        href="/"
                                        className="inline-flex w-full items-center justify-center rounded-full bg-white py-2.5 text-xs font-black text-[#265243] shadow-sm transition-colors hover:bg-emerald-50"
                                    >
                                        Jelajahi Portal Sekolah
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* 4. RECENTLY BERITA / BERITA LAINNYA GRID SECTION AT BOTTOM OF ARTICLE CARD */}
                        <div className="space-y-8 border-t border-[#c8dac5]/80 bg-[#f8faf7] p-6 sm:p-12">
                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                                <div>
                                    <p className="text-xs font-bold tracking-widest text-[#527365] uppercase">
                                        Rekomendasi Bacaan
                                    </p>
                                    <h3 className="text-2xl font-black tracking-tight text-[#142921] sm:text-3xl">
                                        Recently Berita / Berita Lainnya
                                    </h3>
                                </div>
                                <Link
                                    href="/"
                                    className="shrink-0 rounded-full border border-[#c8dac5] bg-[#f4f8f3] px-5 py-2.5 text-xs font-extrabold text-[#265243] shadow-xs transition-all hover:bg-[#265243] hover:text-white"
                                >
                                    Lihat Semua Berita
                                </Link>
                            </div>

                            {/* Cards Grid */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {recentNews.map((item, idx) => (
                                    <Link
                                        key={item.id}
                                        href={`/news/${item.slug}`}
                                        className="group relative flex flex-col justify-between overflow-hidden rounded-[2.25rem] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                                    >
                                        {/* Top Badge */}
                                        <div className="absolute top-4 left-4 z-10">
                                            <span className="rounded-md bg-[#f59e0b] px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-white uppercase shadow-md">
                                                {idx === 0 ? 'BARU' : 'BERITA'}
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
                                                    <ImageIcon className="h-8 w-8" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Body */}
                                        <div className="flex flex-1 flex-col justify-between space-y-3 p-4 sm:p-5">
                                            <div>
                                                {/* Centered Title */}
                                                <h4 className="mb-1.5 line-clamp-2 px-1 text-center font-sans text-sm leading-snug font-extrabold text-[#142921] transition-colors group-hover:text-[#265243] sm:text-base">
                                                    {item.title}
                                                </h4>

                                                {/* Centered Views Count */}
                                                <div className="my-1 flex items-center justify-center gap-1.5 text-xs font-extrabold text-[#527365]">
                                                    <Eye className="h-3.5 w-3.5 text-[#265243]" />
                                                    <span>
                                                        {item.views_count || 0}{' '}
                                                        Dilihat
                                                    </span>
                                                </div>

                                                {/* Centered Metadata */}
                                                <p className="flex items-center justify-center gap-1 text-center text-[10px] font-bold text-[#527365] sm:text-[11px]">
                                                    <span>
                                                        {item.published_at ||
                                                            'Terbaru'}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{item.author}</span>
                                                </p>
                                            </div>

                                            {/* Bottom Action Button */}
                                            <div className="pt-1">
                                                <span className="inline-flex w-full cursor-pointer items-center justify-center gap-1 rounded-full border border-[#c8dac5] bg-white px-3 py-2 text-[11px] font-black text-[#265243] shadow-2xs transition-all group-hover:bg-[#265243] group-hover:text-white">
                                                    <span>
                                                        Baca Selengkapnya
                                                    </span>
                                                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </article>
                </main>

                {/* ── FOOTER ───────────────────────────────────────────────────────── */}
                <footer
                    style={{ backgroundColor: '#142921' }}
                    className="mt-auto border-t border-[#265243] text-white"
                >
                    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
                        <div className="flex flex-col justify-between gap-6 border-b border-[#265243] pb-8 md:flex-row md:items-center">
                            <div className="flex items-center gap-4">
                                {logoUrl ? (
                                    <img
                                        src={logoUrl}
                                        alt={schoolName}
                                        className="h-12 w-12 object-contain"
                                    />
                                ) : (
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#265243] text-xl font-black text-white">
                                        M
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-lg font-black text-white">
                                        {schoolName}
                                    </h3>
                                    <p className="text-xs font-medium text-[#b5d6c6]">
                                        {schoolTagline}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
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

                        <div className="text-center text-xs font-medium text-white/70 sm:text-left">
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

NewsShow.layout = (page: any) => page;
