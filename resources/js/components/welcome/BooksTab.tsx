import {
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Filter,
    Library,
    Search,
    X,
} from 'lucide-react';
import { BookItem } from './types';

interface BooksTabProps {
    books: BookItem[];
    bookCategories: string[];
    bookSearch: string;
    bookCategory: string;
    bookAvailability: string;
    bookPage: number;
    BOOK_PER_PAGE: number;
    isFilterModalOpen: boolean;
    setBookSearch: React.Dispatch<React.SetStateAction<string>>;
    setBookCategory: React.Dispatch<React.SetStateAction<string>>;
    setBookAvailability: React.Dispatch<React.SetStateAction<string>>;
    setBookPage: React.Dispatch<React.SetStateAction<number>>;
    setIsFilterModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function BooksTab({
    books,
    bookCategories,
    bookSearch,
    bookCategory,
    bookAvailability,
    bookPage,
    BOOK_PER_PAGE,
    isFilterModalOpen,
    setBookSearch,
    setBookCategory,
    setBookAvailability,
    setBookPage,
    setIsFilterModalOpen,
}: BooksTabProps) {
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

    const totalBookPages = Math.ceil(filteredBooks.length / BOOK_PER_PAGE);
    const paginatedBooks = filteredBooks.slice(
        (bookPage - 1) * BOOK_PER_PAGE,
        bookPage * BOOK_PER_PAGE,
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
                            onChange={(e) => setBookSearch(e.target.value)}
                            className="w-full rounded-xl border border-[#c8dac5] bg-white py-2.5 pr-4 pl-10 text-xs font-bold text-[#142921] placeholder-[#527365] shadow-xs transition-all focus:border-[#265243]/40 focus:ring-2 focus:ring-[#265243]/20 focus:outline-none"
                        />
                        {bookSearch && (
                            <button
                                onClick={() => setBookSearch('')}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-[#527365] hover:text-[#142921]"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Filter Button */}
                    <button
                        onClick={() => setIsFilterModalOpen(true)}
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold whitespace-nowrap shadow-xs transition-all ${
                            bookCategory !== 'all' || bookAvailability !== 'all'
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
                                    onClick={() => setBookCategory('all')}
                                    className="hover:text-rose-600"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        )}
                        {bookAvailability !== 'all' && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-[#eef5eb] px-2.5 py-0.5 text-[11px] font-bold text-[#265243]">
                                Status:{' '}
                                {bookAvailability === 'available'
                                    ? 'Tersedia'
                                    : 'Tidak Tersedia'}
                                <button
                                    onClick={() => setBookAvailability('all')}
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
                                    onClick={() => setBookSearch('')}
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
                        <div className="flex items-center justify-between border-b border-[#e2ebd9] pb-3">
                            <div className="flex items-center gap-2 text-[#142921]">
                                <Filter className="h-5 w-5 text-[#265243]" />
                                <h4 className="text-base font-extrabold">
                                    Filter Katalog Buku
                                </h4>
                            </div>
                            <button
                                onClick={() => setIsFilterModalOpen(false)}
                                className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-5">
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
                                                    (b.available_copies ?? 0) >
                                                    0,
                                            ).length,
                                        },
                                        {
                                            id: 'borrowed',
                                            label: 'Tidak Tersedia',
                                            count: books.filter(
                                                (b) =>
                                                    (b.available_copies ?? 0) ===
                                                    0,
                                            ).length,
                                        },
                                    ].map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() =>
                                                setBookAvailability(opt.id)
                                            }
                                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-extrabold transition-all ${
                                                bookAvailability === opt.id
                                                    ? 'border-[#265243] bg-[#265243] text-white shadow-sm'
                                                    : 'border-[#c8dac5] bg-[#f8faf7] text-[#142921] hover:border-[#265243]/50 hover:bg-[#eef5eb]'
                                            }`}
                                        >
                                            {opt.label}
                                            <span
                                                className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${
                                                    bookAvailability === opt.id
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

                            {bookCategories.length > 0 && (
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold tracking-wider text-[#527365] uppercase">
                                        Kategori Buku
                                    </label>
                                    <div className="flex max-h-48 flex-wrap gap-2 overflow-y-auto pr-1">
                                        <button
                                            onClick={() => setBookCategory('all')}
                                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-extrabold transition-all ${
                                                bookCategory === 'all'
                                                    ? 'border-[#265243] bg-[#265243] text-white shadow-sm'
                                                    : 'border-[#c8dac5] bg-[#f8faf7] text-[#142921] hover:border-[#265243]/50 hover:bg-[#eef5eb]'
                                            }`}
                                        >
                                            Semua Kategori
                                        </button>
                                        {bookCategories.map((cat) => {
                                            const catCount = books.filter(
                                                (b) => b.category === cat,
                                            ).length;
                                            return (
                                                <button
                                                    key={cat}
                                                    onClick={() =>
                                                        setBookCategory(cat)
                                                    }
                                                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-extrabold transition-all ${
                                                        bookCategory === cat
                                                            ? 'border-[#265243] bg-[#265243] text-white shadow-sm'
                                                            : 'border-[#c8dac5] bg-[#f8faf7] text-[#142921] hover:border-[#265243]/50 hover:bg-[#eef5eb]'
                                                    }`}
                                                >
                                                    {cat}
                                                    <span
                                                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${
                                                            bookCategory === cat
                                                                ? 'bg-white/20 text-white'
                                                                : 'bg-[#c8dac5]/60 text-[#265243]'
                                                        }`}
                                                    >
                                                        {catCount}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

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
                                onClick={() => setIsFilterModalOpen(false)}
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
                        Tidak ada buku yang sesuai dengan pencarian Anda.
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
                                <div className="absolute top-3 left-3 z-10">
                                    <span className="rounded-md bg-[#265243] px-2.5 py-1 text-[10px] font-extrabold tracking-wider text-white uppercase shadow-md sm:text-[11px]">
                                        {book.category}
                                    </span>
                                </div>

                                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f4f8f3]">
                                    {book.cover_image ? (
                                        <img
                                            src={book.cover_image}
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

                                <div className="flex flex-1 flex-col justify-between space-y-3 p-4 sm:p-5">
                                    <div>
                                        <h4 className="mb-1.5 line-clamp-2 font-sans text-sm leading-snug font-extrabold text-[#142921] transition-colors group-hover:text-[#265243] sm:text-base">
                                            {book.title}
                                        </h4>

                                        <p className="line-clamp-1 text-xs leading-relaxed font-semibold text-[#527365]">
                                            Penulis:{' '}
                                            <span className="font-bold text-[#142921]">
                                                {book.author}
                                            </span>
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-[#eef4eb] pt-3">
                                        <span className="text-xs font-extrabold text-[#265243]">
                                            Stok:{' '}
                                            <span className="font-black text-[#142921]">
                                                {book.available_copies}
                                            </span>{' '}
                                            / {book.total_copies}
                                        </span>
                                        <span
                                            className={`rounded-md px-2.5 py-1 text-[10px] font-extrabold tracking-wider uppercase sm:text-[11px] ${
                                                book.available_copies > 0
                                                    ? 'border border-emerald-200 bg-emerald-100 text-emerald-800'
                                                    : 'border border-rose-200 bg-rose-100 text-rose-800'
                                            }`}
                                        >
                                            {book.available_copies > 0
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
    );
}
