import { X } from 'lucide-react';
import { GalleryItem, NewsItem } from './types';

interface WelcomeModalsProps {
    selectedNews: NewsItem | null;
    selectedGallery: GalleryItem | null;
    setSelectedNews: (item: NewsItem | null) => void;
    setSelectedGallery: (item: GalleryItem | null) => void;
}

export function WelcomeModals({
    selectedNews,
    selectedGallery,
    setSelectedNews,
    setSelectedGallery,
}: WelcomeModalsProps) {
    return (
        <>
            {/* ── MODAL READ ARTICLE NEWS DETAIL ── */}
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

            {/* ── MODAL LIGHTBOX GALLERY DETAIL ── */}
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
        </>
    );
}
