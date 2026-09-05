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
    Bookmark
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

export default function NewsShow({ news, recentNews, settings, auth }: PageProps) {
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
    const schoolTagline = settings?.school_tagline || 'BERSINAR : Bersih, Sehat, Indah, Aman, Ramah';
    const logoUrl = settings?.school_logo_url || null;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Helper to format HTML content into clean paragraphs if plain text is provided
    const renderArticleContent = () => {
        if (!news.content) return <p className="italic text-slate-500">Tidak ada konten berita.</p>;

        const isHtml = /<[a-z][\s\S]*>/i.test(news.content);
        if (isHtml) {
            return (
                <div
                    className="prose prose-lg max-w-none text-slate-800 leading-relaxed font-sans prose-headings:font-black prose-headings:text-[#142921] prose-a:text-[#265243] prose-a:font-bold prose-img:rounded-2xl prose-blockquote:border-l-4 prose-blockquote:border-[#265243] prose-blockquote:bg-[#f4f8f3] prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:italic"
                    dangerouslySetInnerHTML={{ __html: news.content }}
                />
            );
        }

        const paragraphs = news.content.split(/\n\s*\n/).filter(Boolean);
        return (
            <div className="space-y-6 text-slate-800 leading-relaxed text-base sm:text-lg font-sans">
                {paragraphs.map((para, idx) => (
                    <p
                        key={idx}
                        className={
                            idx === 0
                                ? 'first-letter:text-6xl first-letter:font-black first-letter:float-left first-letter:mr-3.5 first-letter:mt-1 first-letter:text-[#265243] first-letter:leading-none'
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

            <div className="min-h-screen bg-[#f4f7f4] text-slate-900 selection:bg-[#265243] selection:text-white flex flex-col font-sans">
                {/* ── TOP HEADER / NAVBAR (DYNAMIC MORPH ON SCROLL) ────────────────── */}
                <div className="sticky top-0 z-50 w-full flex justify-center pointer-events-none transition-all duration-500 ease-in-out">
                    <header
                        className={`pointer-events-auto transition-all duration-500 ease-in-out flex items-center justify-between ${
                            isScrolled
                                ? 'mt-3 w-[calc(100%-2rem)] max-w-6xl bg-white/90 backdrop-blur-xl rounded-full shadow-2xl border border-[#c8dac5] px-6 py-2.5'
                                : 'w-full max-w-full bg-[#f4f8f3]/95 backdrop-blur-md border-b border-[#c8dac5] shadow-xs px-4 sm:px-8 py-3.5'
                        }`}
                    >
                        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
                            {/* Logo & School Name */}
                            <Link href="/" className="flex items-center gap-3 group shrink-0">
                                {logoUrl ? (
                                    <img
                                        src={logoUrl}
                                        alt={schoolName}
                                        className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
                                    />
                                ) : (
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#265243] text-white flex items-center justify-center font-black text-base sm:text-lg shadow-md group-hover:scale-105 transition-transform">
                                        M
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#142921] group-hover:text-[#265243] transition-colors leading-tight">
                                        {schoolName}
                                    </span>
                                    <span className="text-[9px] sm:text-[10px] font-extrabold tracking-wider text-[#527365] uppercase hidden sm:block">
                                        {schoolTagline}
                                    </span>
                                </div>
                            </Link>

                            {/* Back to Home button */}
                            <div className="flex items-center gap-3 shrink-0">
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#265243] text-xs font-black border border-[#c8dac5] shadow-xs hover:bg-[#265243] hover:text-white transition-all"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span className="hidden sm:inline">Kembali ke Beranda</span>
                                    <span className="sm:hidden">Beranda</span>
                                </Link>
                            </div>
                        </div>
                    </header>
                </div>

                {/* ── MAIN NEWSPAPER EDITORIAL CARD ─────────────────────────────────── */}
                <main className="flex-1 py-8 sm:py-12 px-3 sm:px-6 max-w-7xl mx-auto w-full space-y-12">
                    <article className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-[#c8dac5]/80 overflow-hidden">
                        {/* 1. EDITORIAL HEADER BAR (EXACT REFERENCE DESIGN - G BADGE / AUTHOR TAG & TOP ACTIONS) */}
                        <div className="px-6 sm:px-12 pt-8 pb-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-500">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-[#265243] text-white font-black flex items-center justify-center text-lg shadow-sm">
                                    G
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                        Informasi Publik & Berita
                                    </span>
                                    <span className="font-extrabold text-[#265243] hover:underline cursor-pointer">
                                        Liputan Resmi {schoolName}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-slate-400">
                                <button
                                    onClick={handleCopyLink}
                                    title="Bagikan Berita"
                                    className="p-2 rounded-full hover:bg-slate-100 hover:text-[#265243] transition-colors flex items-center gap-1.5"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-4 h-4 text-emerald-600" />
                                            <span className="text-emerald-600 font-bold text-[11px]">Tersalin!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Share2 className="w-4 h-4" />
                                            <span className="hidden sm:inline text-[11px]">Bagikan</span>
                                        </>
                                    )}
                                </button>
                                <span className="w-px h-4 bg-slate-200" />
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                                    <Calendar className="w-3.5 h-3.5 text-[#265243]" />
                                    <span>{news.published_at || 'Terbaru'}</span>
                                </div>
                            </div>
                        </div>

                        {/* 2. EDITORIAL ARTICLE TITLE & BYLINE */}
                        <div className="px-6 sm:px-12 pt-8 pb-6">
                            <div className="max-w-4xl space-y-4">
                                <span className="inline-block px-3.5 py-1 rounded-full bg-[#f4f8f3] text-[#265243] text-[11px] font-black tracking-widest uppercase border border-[#c8dac5]">
                                    Kabar Utama Sekolah
                                </span>
                                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#142921] tracking-tight leading-[1.15]">
                                    {news.title}
                                </h1>
                                <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm font-semibold text-slate-500 border-b border-slate-100 pb-6">
                                    <span className="text-slate-800 font-extrabold flex items-center gap-1.5">
                                        <User className="w-4 h-4 text-[#265243]" />
                                        Oleh <span className="text-[#265243]">{news.author}</span>
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4 text-slate-400" />
                                        {news.published_at || 'Dipublikasikan Baru Saja'}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1.5 font-bold text-[#265243]">
                                        <Eye className="w-4 h-4 text-[#265243]" />
                                        {news.views_count || 0} Dilihat
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 3. SPLIT EDITORIAL CONTENT GRID (LEFT: CONTENT & IMAGE, RIGHT: REAL-TIME HIGHLIGHTS) */}
                        <div className="px-6 sm:px-12 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
                            {/* LEFT COLUMN: ARTICLE BODY & THUMBNAIL (8 COLS) */}
                            <div className="lg:col-span-8 space-y-8">
                                {/* Featured Thumbnail Image */}
                                {news.thumbnail && (
                                    <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 group">
                                        <img
                                            src={news.thumbnail}
                                            alt={news.title}
                                            className="w-full max-h-[500px] object-cover group-hover:scale-102 transition-transform duration-500"
                                        />
                                        <div className="absolute bottom-3 right-3 bg-black/65 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                                            Dokumentasi Humas
                                        </div>
                                    </div>
                                )}

                                {/* Article Main Paragraph Text */}
                                {renderArticleContent()}
                            </div>

                            {/* RIGHT COLUMN: REAL-TIME / RECENT HIGHLIGHTS SIDEBAR (4 COLS - MATCHING REFERENCE) */}
                            <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-slate-200 pt-8 lg:pt-0 lg:pl-8 space-y-8">
                                {/* Sidebar Box Header */}
                                <div className="space-y-1 pb-4 border-b border-slate-200">
                                    <p className="text-[11px] font-black text-[#527365] uppercase tracking-widest">
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
                                                className="group block space-y-2 pb-5 border-b border-slate-100 last:border-b-0 hover:opacity-90 transition-opacity"
                                            >
                                                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                                                    <span className="uppercase tracking-wider text-[#265243]">
                                                        {item.author}
                                                    </span>
                                                    <span>{item.published_at}</span>
                                                </div>
                                                <h4 className="font-extrabold text-sm sm:text-base text-[#142921] group-hover:text-[#265243] group-hover:underline transition-colors leading-snug line-clamp-2">
                                                    {item.title}
                                                </h4>
                                            </Link>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-400 italic">Belum ada berita terkini lainnya.</p>
                                    )}
                                </div>

                                {/* Action Banner Card inside Sidebar */}
                                <div className="p-6 rounded-3xl bg-[#142921] text-white space-y-4 shadow-lg border border-emerald-900/40">
                                    <div className="w-10 h-10 rounded-2xl bg-white/15 text-emerald-300 flex items-center justify-center font-bold">
                                        <Globe className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-black text-lg text-white">
                                            Layanan Online Sekolah
                                        </h4>
                                        <p className="text-xs text-emerald-100/80 font-medium">
                                            Dapatkan akses permohonan e-legalisir dan informasi pendaftaran secara cepat.
                                        </p>
                                    </div>
                                    <Link
                                        href="/"
                                        className="inline-flex items-center justify-center w-full py-2.5 rounded-full bg-white text-[#265243] text-xs font-black hover:bg-emerald-50 transition-colors shadow-sm"
                                    >
                                        Jelajahi Portal Sekolah
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* 4. RECENTLY BERITA / BERITA LAINNYA GRID SECTION AT BOTTOM OF ARTICLE CARD */}
                        <div className="bg-[#f8faf7] border-t border-[#c8dac5]/80 p-6 sm:p-12 space-y-8">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                                <div>
                                    <p className="text-xs font-bold text-[#527365] uppercase tracking-widest">
                                        Rekomendasi Bacaan
                                    </p>
                                    <h3 className="text-2xl sm:text-3xl font-black text-[#142921] tracking-tight">
                                        Recently Berita / Berita Lainnya
                                    </h3>
                                </div>
                                <Link
                                    href="/"
                                    className="px-5 py-2.5 rounded-full bg-[#f4f8f3] hover:bg-[#265243] text-[#265243] hover:text-white border border-[#c8dac5] text-xs font-extrabold transition-all shadow-xs shrink-0"
                                >
                                    Lihat Semua Berita
                                </Link>
                            </div>

                            {/* Cards Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {recentNews.map((item, idx) => (
                                    <Link
                                        key={item.id}
                                        href={`/news/${item.slug}`}
                                        className="relative bg-white rounded-[2.25rem] overflow-hidden flex flex-col justify-between group transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1"
                                    >
                                        {/* Top Badge */}
                                        <div className="absolute top-4 left-4 z-10">
                                            <span className="bg-[#f59e0b] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-md uppercase tracking-wider">
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
                                                    <ImageIcon className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Body */}
                                        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                                            <div>
                                                {/* Centered Title */}
                                                <h4 className="text-center font-extrabold text-[#142921] text-sm sm:text-base leading-snug group-hover:text-[#265243] transition-colors line-clamp-2 mb-1.5 font-sans px-1">
                                                    {item.title}
                                                </h4>

                                                {/* Centered Views Count */}
                                                <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-[#527365] my-1">
                                                    <Eye className="w-3.5 h-3.5 text-[#265243]" />
                                                    <span>{item.views_count || 0} Dilihat</span>
                                                </div>

                                                {/* Centered Metadata */}
                                                <p className="text-center text-[10px] sm:text-[11px] font-bold text-[#527365] flex items-center justify-center gap-1">
                                                    <span>{item.published_at || 'Terbaru'}</span>
                                                    <span>•</span>
                                                    <span>{item.author}</span>
                                                </p>
                                            </div>

                                            {/* Bottom Action Button */}
                                            <div className="pt-1">
                                                <span className="inline-flex items-center justify-center gap-1 w-full py-2 px-3 rounded-full bg-white text-[#265243] group-hover:bg-[#265243] group-hover:text-white border border-[#c8dac5] text-[11px] font-black transition-all shadow-2xs cursor-pointer">
                                                    <span>Baca Selengkapnya</span>
                                                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
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
                <footer style={{ backgroundColor: '#142921' }} className="text-white border-t border-[#265243] mt-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#265243]">
                            <div className="flex items-center gap-4">
                                {logoUrl ? (
                                    <img src={logoUrl} alt={schoolName} className="w-12 h-12 object-contain" />
                                ) : (
                                    <div className="w-12 h-12 rounded-2xl bg-[#265243] text-white flex items-center justify-center font-black text-xl">
                                        M
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-lg font-black text-white">{schoolName}</h3>
                                    <p className="text-xs text-[#b5d6c6] font-medium">{schoolTagline}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
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

                        <div className="text-center sm:text-left text-xs text-white/70 font-medium">
                            <p>{settings.footer_copyright || `© Copyright ${new Date().getFullYear()} ${schoolName}. All rights reserved.`}</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

NewsShow.layout = (page: any) => page;
