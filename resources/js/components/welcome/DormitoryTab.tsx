import {
    Building2,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Image as ImageIcon,
    User,
} from 'lucide-react';
import { DormitoryItem } from './types';
import { getExcerpt } from './utils';

interface DormitoryTabProps {
    settings: Record<string, string>;
    dormitory: DormitoryItem[];
    dormPage: number;
    DORM_PER_PAGE: number;
    setDormPage: React.Dispatch<React.SetStateAction<number>>;
}

export function DormitoryTab({
    settings,
    dormitory,
    dormPage,
    DORM_PER_PAGE,
    setDormPage,
}: DormitoryTabProps) {
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
        <div className="space-y-8 sm:space-y-12">
            {/* HERO HEADER BANNER CARD FOR DORMITORY */}
            <div className="relative grid min-h-[340px] grid-cols-1 items-stretch overflow-hidden rounded-[2.5rem] border border-emerald-900/30 bg-[#142921] text-white shadow-xl lg:grid-cols-12">
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

                    <div className="border-t border-emerald-800/40 pt-3">
                        <p className="mb-2.5 text-[11px] font-bold tracking-wider text-amber-300 uppercase">
                            Pintasan Kontak &amp; Media Sosial Pengurus:
                        </p>
                        <div className="flex flex-wrap items-center gap-2.5">
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
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                </svg>
                                <span>WA Pengurus Putri</span>
                            </a>

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
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="rounded-md bg-[#f59e0b] px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-white uppercase shadow-md sm:text-[11px]">
                                        ASRAMA
                                    </span>
                                </div>

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

                                <div className="flex flex-1 flex-col justify-between space-y-4 p-5 sm:p-6">
                                    <div>
                                        <h4 className="mb-2 line-clamp-2 px-1 text-center font-sans text-base leading-snug font-extrabold text-[#142921] transition-colors group-hover:text-[#265243] sm:text-lg">
                                            {post.title}
                                        </h4>

                                        <p className="mb-3 line-clamp-3 text-center text-xs leading-relaxed font-semibold text-[#2e5445]">
                                            {getExcerpt(post.content, 120)}
                                        </p>

                                        <p className="flex items-center justify-center gap-1.5 text-center text-[11px] font-bold text-[#527365] sm:text-xs">
                                            <Calendar className="h-3.5 w-3.5 text-[#265243]" />
                                            <span>{post.created_at}</span>
                                            <span>•</span>
                                            <User className="h-3.5 w-3.5 text-[#265243]" />
                                            <span>{post.author}</span>
                                        </p>
                                    </div>

                                    <div className="pt-2">
                                        <span className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full border border-[#c8dac5] bg-white px-4 py-2.5 text-xs font-black text-[#265243] shadow-2xs transition-all group-hover:bg-[#265243] group-hover:text-white">
                                            <span>Lihat Detail Asrama</span>
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
    );
}
