import { Link } from '@inertiajs/react';
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Eye,
    Image as ImageIcon,
    Newspaper,
    User,
} from 'lucide-react';
import { NewsItem } from './types';

interface NewsTabProps {
    news: NewsItem[];
    newsPage: number;
    NEWS_PER_PAGE: number;
    setNewsPage: React.Dispatch<React.SetStateAction<number>>;
}

export function NewsTab({
    news,
    newsPage,
    NEWS_PER_PAGE,
    setNewsPage,
}: NewsTabProps) {
    const totalNewsPages = Math.ceil(news.length / NEWS_PER_PAGE);
    const paginatedNews = news.slice(
        (newsPage - 1) * NEWS_PER_PAGE,
        newsPage * NEWS_PER_PAGE,
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
                    onClick={() => onPageChange(currentPage - 1)}
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
                                onClick={() => onPageChange(p)}
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
                    onClick={() => onPageChange(currentPage + 1)}
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

    return (
        <div className="space-y-6">
            {/* HERO HEADER BANNER CARD FOR NEWS */}
            <div data-aos="fade-up" className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-[2.5rem] border border-emerald-900/30 bg-[#142921] p-8 text-white shadow-xl sm:p-12 md:flex-row">
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
                        Dapatkan berita resmi, liputan kegiatan, pengumuman sekolah, serta pencapaian prestasi terbaru dari civitas akademika.
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
                        Belum ada artikel berita yang dipublikasikan.
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {paginatedNews.map((item, idx) => (
                            <Link
                                key={item.id}
                                href={`/news/${item.slug}`}
                                data-aos="fade-up"
                                data-aos-delay={idx * 80}
                                className="group relative flex flex-col justify-between overflow-hidden rounded-[2.25rem] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="rounded-md bg-[#f59e0b] px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-white uppercase shadow-md sm:text-[11px]">
                                        {(newsPage - 1) * NEWS_PER_PAGE + idx === 0
                                            ? 'BARU'
                                            : 'BERITA'}
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
                                                {item.views_count || 0} Dilihat
                                            </span>
                                        </div>

                                        <p className="flex items-center justify-center gap-1.5 text-center text-[11px] font-bold text-[#527365] sm:text-xs">
                                            <Calendar className="h-3.5 w-3.5 text-[#265243]" />
                                            <span>
                                                {item.published_at || 'Terbaru'}
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
                    {renderPaginationControls(
                        newsPage,
                        totalNewsPages,
                        setNewsPage,
                    )}
                </>
            )}
        </div>
    );
}
