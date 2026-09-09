import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    BookCheck,
    BookMarked,
    CheckCircle2,
    ChevronDown,
    Clock,
    Edit3,
    Image as ImageIcon,
    ListFilter,
    Plus,
    Search,
    Tag,
    Trash2,
    X,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';

interface BookItem {
    id: number;
    title: string;
    author: string;
    category: string;
    isbn: string | null;
    total_stock: number;
    available_stock: number;
    borrowed_copies_count?: number;
    status: 'available' | 'borrowed';
    cover_image: string | null;
    description: string | null;
    created_at: string;
}

interface Props {
    books: {
        data: BookItem[];
        links: any[];
    };
    stats?: {
        total_copies: number;
        available_copies: number;
        borrowed_copies: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
    bookCategories?: string[];
}

export default function BooksIndex({ books, stats, filters, bookCategories = [] }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<BookItem | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [categorySearch, setCategorySearch] = useState('');

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<{
        title: string;
        author: string;
        category: string;
        isbn: string;
        total_stock: number;
        status: 'available' | 'borrowed';
        cover_image: File | null;
        description: string;
    }>({
        title: '',
        author: '',
        category: 'Umum',
        isbn: '',
        total_stock: 1,
        status: 'available',
        cover_image: null,
        description: '',
    });

    const filteredCategories = bookCategories.filter(cat =>
        cat.toLowerCase().includes(categorySearch.toLowerCase())
    );

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get('/admin/books', { search, status: statusFilter }, { preserveState: true });
    };

    const openCreateModal = () => {
        setEditingItem(null);
        reset();
        const initialCat = bookCategories.length > 0 ? bookCategories[0] : '';
        setData('category', initialCat);
        setCategorySearch(initialCat);
        setIsCategoryDropdownOpen(false);
        clearErrors();
        setFileError(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: BookItem) => {
        setEditingItem(item);
        setData({
            title: item.title,
            author: item.author,
            category: item.category,
            isbn: item.isbn || '',
            total_stock: item.total_stock || 1,
            status: item.status,
            cover_image: null,
            description: item.description || '',
        });
        setCategorySearch(item.category);
        setIsCategoryDropdownOpen(false);
        clearErrors();
        setFileError(null);
        setIsModalOpen(true);
    };

    const handleFileChange = (file: File | null) => {
        setFileError(null);
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setFileError('Ukuran file maksimal adalah 2MB.');
                setData('cover_image', null);
                return;
            }
        }
        setData('cover_image', file);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (fileError) return;

        if (editingItem) {
            router.post(`/admin/books/${editingItem.id}`, {
                _method: 'PUT',
                ...data,
            }, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
                onError: (errs) => {
                    if (errs.cover_image) {
                        setFileError(errs.cover_image);
                    }
                }
            });
        } else {
            post('/admin/books', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
                onError: (errs) => {
                    if (errs.cover_image) {
                        setFileError(errs.cover_image);
                    }
                }
            });
        }
    };

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        confirmText: string;
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: '',
        description: '',
        confirmText: 'Ya, Hapus Buku',
        onConfirm: () => {},
    });

    const handleDelete = (item: BookItem) => {
        setConfirmModal({
            isOpen: true,
            title: 'Hapus Koleksi Buku',
            description: `Apakah Anda yakin ingin menghapus koleksi buku "${item.title}" beserta seluruh unit eksemplarnya?`,
            confirmText: 'Ya, Hapus Buku',
            onConfirm: () => {
                router.delete(`/admin/books/${item.id}`);
                setConfirmModal((prev) => ({ ...prev, isOpen: false }));
            },
        });
    };

    return (
        <>
            <Head title="Katalog Buku - Admin - MAN TANJUNGPINANG" />

            <div className="p-4 sm:p-6 w-full space-y-6">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}

                {/* Header Actions */}
                <PageHeader
                    title="Katalog Buku & Perpustakaan"
                    description="Kelola koleksi buku, jumlah stok eksemplar, dan status peminjaman siswa secara terintegrasi."
                    icon={BookMarked}
                    badge="Manajemen Perpustakaan"
                    action={
                        <div className="flex items-center gap-2">
                            <Link
                                href="/admin/book-categories"
                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 text-white font-bold text-sm hover:bg-white/30 transition-all border border-white/30"
                            >
                                <Tag className="w-4 h-4" /> Kelola Kategori
                            </Link>
                            <button
                                onClick={openCreateModal}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#265243] font-bold text-sm hover:bg-slate-100 transition-all shadow-sm"
                            >
                                <Plus className="w-4 h-4" /> Tambah Buku Baru
                            </button>
                        </div>
                    }
                />


                {/* Filters */}
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#265243]" />
                        <input
                            type="text"
                            placeholder="Cari judul, pengarang, atau ISBN..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ backgroundColor: '#e4ebe2', color: '#1a3d31' }}
                            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-full border-none shadow-xs font-semibold placeholder:text-[#527365] focus:outline-none focus:ring-2 focus:ring-[#265243] focus:bg-white transition-all"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            router.get('/admin/books', { search, status: e.target.value }, { preserveState: true });
                        }}
                        style={{ backgroundColor: '#e4ebe2', color: '#1a3d31' }}
                        className="px-4 py-2.5 text-xs rounded-full border-none shadow-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#265243] focus:bg-white transition-all"
                    >
                        <option value="">Semua Status Stok</option>
                        <option value="available">Tersedia Siap Pinjam</option>
                        <option value="borrowed">Habis Dipinjam</option>
                    </select>
                    <button
                        type="submit"
                        style={{ backgroundColor: '#265243', color: '#ffffff' }}
                        className="px-5 py-2.5 rounded-full hover:bg-[#1f4337] text-xs font-bold transition-all shadow-xs"
                    >
                        Filter
                    </button>
                </form>

                {/* Table Data */}
                <div style={{ backgroundColor: '#e8efe5' }} className="rounded-2xl border-none overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead style={{ backgroundColor: '#265243', color: '#ffffff' }} className="text-xs font-extrabold uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 text-white">Cover</th>
                                    <th className="px-6 py-4 text-white">Judul & Pengarang</th>
                                    <th className="px-6 py-4 text-white">Kategori & ISBN</th>
                                    <th className="px-6 py-4 text-white">Ketersediaan Stok</th>
                                    <th className="px-6 py-4 text-right text-white">Aksi & Detail Stok</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#265243]/10">
                                {books.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-[#4a6b5d] font-semibold">
                                            Belum ada koleksi buku. Klik "Tambah Buku Baru" untuk menambahkan.
                                        </td>
                                    </tr>
                                ) : (
                                    books.data.map((book, idx) => {
                                        const isAvailable = book.available_stock > 0;
                                        return (
                                            <tr
                                                key={book.id}
                                                style={{ backgroundColor: idx % 2 === 0 ? '#e8efe5' : '#e0e9dd' }}
                                                className="hover:bg-[#d6e4d4] transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    {book.cover_image ? (
                                                        <img src={book.cover_image} alt={book.title} className="w-12 h-16 object-cover rounded-lg border border-[#b8ceb0] shadow-xs" />
                                                    ) : (
                                                        <div className="w-12 h-16 rounded-lg bg-[#dce8d7] flex items-center justify-center text-[#265243]">
                                                            <ImageIcon className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-[#142921] leading-snug">{book.title}</p>
                                                    <p className="text-xs font-semibold text-[#2e5445] mt-0.5">Penulis: {book.author}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2.5 py-0.5 rounded-md bg-[#dce8d7] text-xs text-[#142921] font-bold">
                                                        {book.category}
                                                    </span>
                                                    {book.isbn && <p className="text-[11px] text-[#2e5445] mt-1 font-mono font-semibold">ISBN: {book.isbn}</p>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-xs inline-flex items-center gap-1.5 ${
                                                            isAvailable
                                                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                                                : 'bg-rose-100 text-rose-900 border border-rose-300'
                                                        }`}>
                                                            {isAvailable ? <BookCheck className="w-3.5 h-3.5 text-emerald-700" /> : <Clock className="w-3.5 h-3.5 text-rose-700" />}
                                                            {isAvailable ? `Tersedia (${book.available_stock}/${book.total_stock})` : `Habis Dipinjam (0/${book.total_stock})`}
                                                        </span>
                                                        <p className="text-[11px] text-[#2e5445] font-semibold">
                                                            {book.borrowed_copies_count ?? (book.total_stock - book.available_stock)} eksemplar sedang keluar
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/admin/books/${book.id}`}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#265243] hover:bg-[#1f4337] text-white text-xs font-bold shadow-xs transition-all"
                                                        >
                                                            <ListFilter className="w-3.5 h-3.5" /> Stok & Peminjaman →
                                                        </Link>

                                                        <button
                                                            onClick={() => openEditModal(book)}
                                                            className="p-1.5 rounded-lg text-[#265243] hover:text-[#142921] hover:bg-[#dce8d7]"
                                                            title="Edit Detail Buku"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(book)}
                                                            className="p-1.5 rounded-lg text-[#265243] hover:text-rose-600 hover:bg-rose-50"
                                                            title="Hapus Buku"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        links={books.links}
                        from={(books as any).from}
                        to={(books as any).to}
                        total={(books as any).total}
                        className="px-6 py-4 border-t border-[#c8d6c0]"
                    />
                </div>

                {/* Modal Form Tambah / Edit Buku */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                                <h3 className="text-base font-bold text-[#142921] flex items-center gap-2">
                                    <BookMarked className="w-5 h-5 text-[#265243]" />
                                    {editingItem ? 'Edit Informasi Buku' : 'Tambah Buku Baru & Stok'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {fileError && (
                                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        <span>{fileError}</span>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Buku <span className="text-rose-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        style={{ backgroundColor: '#f7faf5', borderColor: '#b8ceb0', color: '#142921' }}
                                        className="w-full px-3.5 py-2 text-xs font-semibold text-[#142921] rounded-xl border focus:ring-2 focus:ring-[#265243] focus:outline-none placeholder:text-[#527365]"
                                        placeholder="Judul buku lengkap"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Pengarang / Penulis <span className="text-rose-500">*</span></label>
                                        <input
                                            type="text"
                                            required
                                            value={data.author}
                                            onChange={(e) => setData('author', e.target.value)}
                                            style={{ backgroundColor: '#f7faf5', borderColor: '#b8ceb0', color: '#142921' }}
                                            className="w-full px-3.5 py-2 text-xs font-semibold text-[#142921] rounded-xl border focus:ring-2 focus:ring-[#265243] focus:outline-none placeholder:text-[#527365]"
                                            placeholder="Nama penulis"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="block text-xs font-semibold text-slate-700">Kategori <span className="text-rose-500">*</span></label>
                                            <Link href="/admin/book-categories" target="_blank" className="text-[11px] font-bold text-[#265243] hover:underline">
                                                + Kelola Kategori
                                            </Link>
                                        </div>
                                        {bookCategories.length === 0 ? (
                                            <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-50 border border-amber-200">
                                                <p className="text-xs text-amber-700 font-semibold">Belum ada kategori.</p>
                                                <Link href="/admin/book-categories" className="text-xs font-bold text-[#265243] underline">Tambah di sini →</Link>
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        required
                                                        value={categorySearch}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            setCategorySearch(val);
                                                            setIsCategoryDropdownOpen(true);
                                                            const match = bookCategories.find(c => c.toLowerCase() === val.toLowerCase());
                                                            if (match) {
                                                                setData('category', match);
                                                            } else {
                                                                setData('category', '');
                                                            }
                                                        }}
                                                        onFocus={() => setIsCategoryDropdownOpen(true)}
                                                        style={{ backgroundColor: '#f7faf5', borderColor: data.category ? '#b8ceb0' : categorySearch ? '#fca5a5' : '#b8ceb0', color: '#142921' }}
                                                        className="w-full pl-3.5 pr-8 py-2 text-xs font-semibold text-[#142921] rounded-xl border focus:ring-2 focus:ring-[#265243] focus:outline-none placeholder:text-[#527365]"
                                                        placeholder="Ketik untuk mencari kategori..."
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                                                    >
                                                        <ChevronDown className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {/* Dropdown Suggestions */}
                                                {isCategoryDropdownOpen && (
                                                    <div className="absolute z-50 left-0 right-0 mt-1 max-h-44 overflow-y-auto bg-white border border-[#c8dac5] rounded-xl shadow-lg p-1 space-y-0.5">
                                                        {filteredCategories.length === 0 ? (
                                                            <div className="p-3 text-center">
                                                                <p className="text-xs text-slate-500 font-semibold mb-1">Tidak ada kategori "{categorySearch}"</p>
                                                                <p className="text-[10px] text-amber-700 font-medium">Kategori baru harus ditambahkan lewat menu Kelola Kategori.</p>
                                                            </div>
                                                        ) : (
                                                            filteredCategories.map((cat) => (
                                                                <button
                                                                    key={cat}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setData('category', cat);
                                                                        setCategorySearch(cat);
                                                                        setIsCategoryDropdownOpen(false);
                                                                    }}
                                                                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                                                                        data.category === cat
                                                                            ? 'bg-[#265243] text-white font-bold'
                                                                            : 'text-[#142921] hover:bg-[#eef5eb]'
                                                                    }`}
                                                                >
                                                                    <span>{cat}</span>
                                                                    {data.category === cat && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                                                </button>
                                                            ))
                                                        )}
                                                    </div>
                                                )}

                                                {categorySearch && !data.category && (
                                                    <p className="mt-1 text-[11px] text-rose-500 font-semibold">
                                                        ⚠️ Pilih salah satu kategori dari dropdown sugesti di atas.
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Kode ISBN (Opsional)</label>
                                        <input
                                            type="text"
                                            value={data.isbn}
                                            onChange={(e) => setData('isbn', e.target.value)}
                                            style={{ backgroundColor: '#f7faf5', borderColor: '#b8ceb0', color: '#142921' }}
                                            className="w-full px-3.5 py-2 text-xs font-semibold text-[#142921] rounded-xl border focus:ring-2 focus:ring-[#265243] focus:outline-none placeholder:text-[#527365]"
                                            placeholder="978-xxx-xxx"
                                        />
                                    </div>
                                    {!editingItem && (
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah Stok Fisik <span className="text-rose-500">*</span></label>
                                            <input
                                                type="number"
                                                min={1}
                                                max={100}
                                                required
                                                value={data.total_stock}
                                                onChange={(e) => setData('total_stock', parseInt(e.target.value) || 1)}
                                                style={{ backgroundColor: '#f7faf5', borderColor: '#b8ceb0', color: '#142921' }}
                                                className="w-full px-3.5 py-2 text-xs font-semibold text-[#142921] rounded-xl border focus:ring-2 focus:ring-[#265243] focus:outline-none"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Foto Sampul Buku (Opsional)</label>
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg,image/webp"
                                        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                                        className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#265243] file:text-white hover:file:bg-[#1f4337]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Ringkasan / Sinopsis (Opsional)</label>
                                    <textarea
                                        rows={3}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        style={{ backgroundColor: '#f7faf5', borderColor: '#b8ceb0', color: '#142921' }}
                                        className="w-full px-3.5 py-2 text-xs font-semibold text-[#142921] rounded-xl border focus:ring-2 focus:ring-[#265243] focus:outline-none placeholder:text-[#527365]"
                                        placeholder="Ringkasan isi buku..."
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#265243] hover:bg-[#1f4337] text-white shadow-sm disabled:opacity-50"
                                    >
                                        {editingItem ? 'Simpan Perubahan' : 'Tambah & Buat Stok'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Custom Confirm Modal */}
                {confirmModal.isOpen && (
                    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-150">
                            <div className="p-6 text-center space-y-4">
                                <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
                                    <Trash2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-extrabold text-[#142921]">{confirmModal.title}</h3>
                                    <p className="text-xs text-[#2e5445] font-semibold mt-1 leading-relaxed">
                                        {confirmModal.description}
                                    </p>
                                </div>
                                <div className="flex items-center justify-center gap-3 pt-3 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                                        className="px-5 py-2.5 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="button"
                                        onClick={confirmModal.onConfirm}
                                        className="px-5 py-2.5 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all"
                                    >
                                        {confirmModal.confirmText}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
