import { ChevronLeft, ChevronRight, Image as ImageIcon, PlayCircle } from 'lucide-react';
import { GalleryItem } from './types';

interface GalleryTabProps {
    galleries: GalleryItem[];
    galleryCategory: string;
    galleryPage: number;
    GALLERY_PER_PAGE: number;
    setGalleryCategory: React.Dispatch<React.SetStateAction<string>>;
    setGalleryPage: React.Dispatch<React.SetStateAction<number>>;
    setSelectedGallery: (item: GalleryItem | null) => void;
}

export function GalleryTab({
    galleries,
    galleryCategory,
    galleryPage,
    GALLERY_PER_PAGE,
    setGalleryCategory,
    setGalleryPage,
    setSelectedGallery,
}: GalleryTabProps) {
    const filteredGalleries =
        galleryCategory === 'all'
            ? galleries
            : galleryCategory === 'photo'
              ? galleries.filter((g) => g.type === 'photo')
              : galleries.filter((g) => g.type === 'youtube');

    const totalGalleryPages = Math.ceil(
        filteredGalleries.length / GALLERY_PER_PAGE,
    );
    const paginatedGalleries = filteredGalleries.slice(
        (galleryPage - 1) * GALLERY_PER_PAGE,
        galleryPage * GALLERY_PER_PAGE,
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
            {/* HERO HEADER BANNER CARD FOR GALLERY */}
            <div data-aos="fade-up" className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-[2.5rem] border border-emerald-900/30 bg-[#142921] p-8 text-white shadow-xl sm:p-12 md:flex-row">
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
                        Kumpulan dokumentasi momen penting, fasilitas pendidikan, serta kegiatan belajar mengajar sekolah.
                    </p>
                </div>

                <div className="relative z-10 flex shrink-0 flex-wrap items-center gap-2">
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
                        {paginatedGalleries.map((item, idx) => (
                            <div
                                key={item.id}
                                data-aos="zoom-in"
                                data-aos-delay={idx * 60}
                                onClick={() => setSelectedGallery(item)}
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
    );
}
