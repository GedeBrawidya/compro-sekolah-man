import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    BookCheck,
    BookMarked,
    Calendar,
    CheckCircle2,
    Clock,
    Plus,
    RotateCcw,
    Search,
    Trash2,
    UserCheck,
    X,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import { PageHeader } from '@/components/page-header';

interface CopyItem {
    id: number;
    copy_code: string;
    borrower_name: string | null;
    borrowed_at: string | null;
    due_date: string | null;
    status: 'available' | 'borrowed';
    notes: string | null;
}

interface BookDetail {
    id: number;
    title: string;
    author: string;
    category: string;
    isbn: string | null;
    total_stock: number;
    available_stock: number;
    borrowed_count: number;
    status: string;
    cover_image: string | null;
    description: string | null;
    created_at: string;
    copies: CopyItem[];
}

interface Props {
    book: BookDetail;
    filters?: {
        search?: string;
        status?: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function BookShow({ book, filters, flash }: Props) {
    const [search, setSearch] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || '');
    const [copyModalOpen, setCopyModalOpen] = useState(false);
    const [borrowModalOpen, setBorrowModalOpen] = useState(false);
    const [selectedCopy, setSelectedCopy] = useState<CopyItem | null>(null);

    // Custom confirm modal state
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        confirmText: string;
        variant: 'danger' | 'success' | 'warning';
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: '',
        description: '',
        confirmText: 'Ya, Lanjutkan',
        variant: 'success',
        onConfirm: () => {},
    });

    // Form for adding a new copy
    const copyForm = useForm({
        copy_code: `BK-${book.id}-${String(book.copies.length + 1).padStart(3, '0')}`,
        notes: '',
    });

    // Form for marking a copy as borrowed
    const borrowForm = useForm({
        borrower_name: '',
        due_date: '',
    });

    const handleAddCopy = (e: FormEvent) => {
        e.preventDefault();
        copyForm.post(`/admin/books/${book.id}/copies`, {
            onSuccess: () => {
                setCopyModalOpen(false);
                copyForm.reset();
            },
        });
    };

    const handleOpenBorrowModal = (copy: CopyItem) => {
        setSelectedCopy(copy);
        borrowForm.setData({
            borrower_name: copy.borrower_name || '',
            due_date: copy.due_date || '',
        });
        setBorrowModalOpen(true);
    };

    const handleConfirmBorrow = (e: FormEvent) => {
        e.preventDefault();
        if (!selectedCopy) return;

        borrowForm.post(`/admin/books/${book.id}/copies/${selectedCopy.id}/toggle`, {
            onSuccess: () => {
                setBorrowModalOpen(false);
                setSelectedCopy(null);
                borrowForm.reset();
            },
        });
    };

    const handleReturnCopy = (copy: CopyItem) => {
        setConfirmModal({
            isOpen: true,
            title: 'Konfirmasi Pengembalian Buku',
            description: `Apakah Anda yakin ingin menandai eksemplar (${copy.copy_code}) sebagai DIKEMBALIKAN (Tersedia)? Stok tersedia akan otomatis bertambah 1.`,
            confirmText: 'Ya, Tandai Dikembalikan',
            variant: 'success',
            onConfirm: () => {
                router.post(`/admin/books/${book.id}/copies/${copy.id}/toggle`, {
                    borrower_name: '',
                });
                setConfirmModal((prev) => ({ ...prev, isOpen: false }));
            },
        });
    };

    const handleDeleteCopy = (copyId: number, copyCode: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Hapus Eksemplar Buku',
            description: `Apakah Anda yakin ingin menghapus eksemplar (${copyCode}) dari daftar stok perpustakaan?`,
            confirmText: 'Ya, Hapus Eksemplar',
            variant: 'danger',
            onConfirm: () => {
                router.delete(`/admin/books/${book.id}/copies/${copyId}`);
                setConfirmModal((prev) => ({ ...prev, isOpen: false }));
            },
        });
    };

    return (
        <>
            <Head title={`Stok & Peminjaman: ${book.title} - Admin - MAN TANJUNG PINANG`} />

            <div className="p-4 sm:p-6 w-full space-y-6">
                {flash?.success && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}

                {/* Header */}
                <PageHeader
                    title={book.title}
                    description={`Penulis: ${book.author} | Kategori: ${book.category} ${book.isbn ? '| ISBN: ' + book.isbn : ''}`}
                    icon={BookMarked}
                    badge="Manajemen Stok & Peminjaman"
                    action={
                        <Link
                            href="/admin/books"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#265243] font-bold text-sm hover:bg-slate-100 transition-all shadow-sm"
                        >
                            <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog Buku
                        </Link>
                    }
                />

                {/* Stock Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div style={{ backgroundColor: '#265243' }} className="p-5 rounded-2xl text-white shadow-sm flex items-center justify-between border border-[#1b3d32]">
                        <div>
                            <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-100">Total Stok Fisik</p>
                            <h3 className="text-3xl font-extrabold text-white mt-1">{book.total_stock} <span className="text-xs font-semibold text-emerald-100">eksemplar</span></h3>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#346b57] text-white">
                            <BookMarked className="w-6 h-6" />
                        </div>
                    </div>

                    <div style={{ backgroundColor: '#1b7a5a' }} className="p-5 rounded-2xl text-white shadow-sm flex items-center justify-between border border-[#145d44]">
                        <div>
                            <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-100">Stok Tersedia</p>
                            <h3 className="text-3xl font-extrabold text-white mt-1">{book.available_stock} <span className="text-xs font-semibold text-emerald-100">siap pinjam</span></h3>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#289c75] text-white">
                            <BookCheck className="w-6 h-6" />
                        </div>
                    </div>

                    <div style={{ backgroundColor: '#b46a06' }} className="p-5 rounded-2xl text-white shadow-sm flex items-center justify-between border border-[#8f5304]">
                        <div>
                            <p className="text-xs font-extrabold uppercase tracking-wider text-amber-100">Sedang Dipinjam</p>
                            <h3 className="text-3xl font-extrabold text-white mt-1">{book.borrowed_count} <span className="text-xs font-semibold text-amber-100">buku keluar</span></h3>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#d98208] text-white">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Copies List Section */}
                <div className="p-6 rounded-2xl bg-white border border-[#c8d6c0] shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div>
                            <h3 className="text-base font-bold text-[#142921]">
                                List Eksemplar & Status Peminjaman
                            </h3>
                            <p className="text-xs text-[#2e5445] font-semibold">
                                Setiap kali status eksemplar diubah ke Dipinjam/Dikembalikan, stok tersedia akan otomatis berkurang/bertambah.
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                copyForm.setData('copy_code', `BK-${book.id}-${String(book.copies.length + 1).padStart(3, '0')}`);
                                setCopyModalOpen(true);
                            }}
                            style={{ backgroundColor: '#265243', color: '#ffffff' }}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-[#1f4337] text-xs font-bold shadow-sm transition-all self-start sm:self-auto"
                        >
                            <Plus className="w-4 h-4" /> Tambah Eksemplar Buku
                        </button>
                    </div>

                    {/* Search & Filter Eksemplar */}
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        router.get(`/admin/books/${book.id}`, { search, status: statusFilter }, { preserveState: true });
                    }} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 py-1">
                        <div className="relative flex-1 max-w-md">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#265243]" />
                            <input
                                type="text"
                                placeholder="Cari kode eksemplar atau nama peminjam..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ backgroundColor: '#eef4eb', borderColor: '#b8ceb0', color: '#1a3d31' }}
                                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-full border shadow-xs font-semibold placeholder:text-[#527365] focus:outline-none focus:ring-2 focus:ring-[#265243] focus:bg-white transition-all"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                router.get(`/admin/books/${book.id}`, { search, status: e.target.value }, { preserveState: true });
                            }}
                            style={{ backgroundColor: '#eef4eb', borderColor: '#b8ceb0', color: '#1a3d31' }}
                            className="px-4 py-2.5 text-xs rounded-full border shadow-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#265243] focus:bg-white transition-all"
                        >
                            <option value="">Semua Status Eksemplar</option>
                            <option value="available">Tersedia Siap Pinjam</option>
                            <option value="borrowed">Sedang Dipinjam</option>
                        </select>
                        <button
                            type="submit"
                            style={{ backgroundColor: '#265243', color: '#ffffff' }}
                            className="px-5 py-2.5 rounded-full hover:bg-[#1f4337] text-xs font-bold transition-all shadow-xs"
                        >
                            Filter
                        </button>
                    </form>

                    {/* Copies Table */}
                    <div style={{ backgroundColor: '#f2f7f0', borderColor: '#b8ceb0' }} className="overflow-x-auto rounded-xl border">
                        <table className="w-full text-left text-sm">
                            <thead style={{ backgroundColor: '#265243', color: '#ffffff' }} className="text-xs font-extrabold uppercase tracking-wider">
                                <tr>
                                    <th className="px-5 py-3.5 text-white">Kode Eksemplar</th>
                                    <th className="px-5 py-3.5 text-white">Status Ketersediaan</th>
                                    <th className="px-5 py-3.5 text-white">Peminjam</th>
                                    <th className="px-5 py-3.5 text-white">Tgl Pinjam</th>
                                    <th className="px-5 py-3.5 text-white">Jatuh Tempo</th>
                                    <th className="px-5 py-3.5 text-right text-white">Aksi Peminjaman</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#c8d6c0]">
                                {book.copies.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-8 text-center text-[#4a6b5d] font-semibold text-xs">
                                            Belum ada data eksemplar fisik. Klik "Tambah Eksemplar Baru" untuk membuat unit fisik buku ini.
                                        </td>
                                    </tr>
                                ) : (
                                    book.copies.map((copy, idx) => (
                                        <tr
                                            key={copy.id}
                                            style={{ backgroundColor: idx % 2 === 0 ? '#f7faf5' : '#eef4eb' }}
                                            className="hover:bg-[#e3edd9] transition-colors"
                                        >
                                            <td className="px-5 py-4 font-mono font-bold text-[#142921] text-xs">
                                                {copy.copy_code}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm inline-flex items-center gap-1 ${
                                                    copy.status === 'available'
                                                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                                                }`}>
                                                    {copy.status === 'available' ? (
                                                        <>
                                                            <BookCheck className="w-3.5 h-3.5 text-emerald-700" /> Tersedia
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Clock className="w-3.5 h-3.5 text-amber-700" /> Dipinjam
                                                        </>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-xs font-bold text-[#142921]">
                                                {copy.borrower_name || <span className="text-[#4a6b5d] font-normal italic">- (Belum dipinjam)</span>}
                                            </td>
                                            <td className="px-5 py-4 text-xs font-semibold text-[#2e5445]">
                                                {copy.borrowed_at || '-'}
                                            </td>
                                            <td className="px-5 py-4 text-xs font-semibold text-[#2e5445]">
                                                {copy.due_date || '-'}
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {copy.status === 'available' ? (
                                                        <button
                                                            onClick={() => handleOpenBorrowModal(copy)}
                                                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1"
                                                        >
                                                            <UserCheck className="w-3.5 h-3.5" /> Catat Dipinjam
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleReturnCopy(copy)}
                                                            className="px-3 py-1.5 rounded-xl bg-[#265243] hover:bg-[#1f4337] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1"
                                                        >
                                                            <RotateCcw className="w-3.5 h-3.5" /> Kembalikan (Tersedia)
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteCopy(copy.id, copy.copy_code)}
                                                        className="p-1.5 rounded-xl text-[#265243] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                                        title="Hapus Eksemplar"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Tambah Eksemplar Baru */}
            {copyModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h3 className="text-base font-bold text-[#142921] flex items-center gap-2">
                                <Plus className="w-5 h-5 text-[#265243]" /> Tambah Eksemplar Stok Buku
                            </h3>
                            <button onClick={() => setCopyModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddCopy} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Kode Eksemplar / Barcode <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Contoh: BK-001-004"
                                    value={copyForm.data.copy_code}
                                    onChange={(e) => copyForm.setData('copy_code', e.target.value)}
                                    style={{ backgroundColor: '#f7faf5', borderColor: '#b8ceb0', color: '#142921' }}
                                    className="w-full px-3.5 py-2 text-xs rounded-xl border font-semibold text-[#142921] focus:outline-none focus:ring-2 focus:ring-[#265243] placeholder:text-[#527365]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Catatan Kondisi (Opsional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Kondisi baik / Rak 02 / Sampul keras"
                                    value={copyForm.data.notes}
                                    onChange={(e) => copyForm.setData('notes', e.target.value)}
                                    style={{ backgroundColor: '#f7faf5', borderColor: '#b8ceb0', color: '#142921' }}
                                    className="w-full px-3.5 py-2 text-xs rounded-xl border font-semibold text-[#142921] focus:outline-none focus:ring-2 focus:ring-[#265243] placeholder:text-[#527365]"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setCopyModalOpen(false)}
                                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={copyForm.processing}
                                    className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#265243] hover:bg-[#1f4337] text-white shadow-sm"
                                >
                                    Tambah Eksemplar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Catat Peminjaman Buku */}
            {borrowModalOpen && selectedCopy && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <h3 className="text-base font-bold text-[#142921] flex items-center gap-2">
                                <UserCheck className="w-5 h-5 text-amber-600" /> Catat Peminjaman Eksemplar
                            </h3>
                            <button onClick={() => setBorrowModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleConfirmBorrow} className="p-6 space-y-4">
                            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
                                Eksemplar Kode: <strong className="font-mono text-amber-950">{selectedCopy.copy_code}</strong>. Status akan diubah menjadi <strong>DIPINJAM</strong> dan stok tersedia akan otomatis berkurang 1.
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Nama Peminjam (Siswa / Guru) <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Masukkan nama lengkap peminjam..."
                                    value={borrowForm.data.borrower_name}
                                    onChange={(e) => borrowForm.setData('borrower_name', e.target.value)}
                                    style={{ backgroundColor: '#f7faf5', borderColor: '#b8ceb0', color: '#142921' }}
                                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border font-semibold text-[#142921] focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-[#527365]"
                                    required
                                />
                                {borrowForm.errors.borrower_name && (
                                    <p className="text-[11px] text-rose-500 mt-1">{borrowForm.errors.borrower_name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Tanggal Tanggung Jawab / Jatuh Tempo (Klik Kalender)
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={borrowForm.data.due_date}
                                        onChange={(e) => borrowForm.setData('due_date', e.target.value)}
                                        onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                                        style={{ backgroundColor: '#f7faf5', borderColor: '#b8ceb0', color: '#142921' }}
                                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border font-semibold text-[#142921] focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                                    />
                                    <Calendar className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-amber-700 pointer-events-none" />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setBorrowModalOpen(false)}
                                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={borrowForm.processing}
                                    className="px-5 py-2 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
                                >
                                    Simpan Status Dipinjam
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
                            <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center ${
                                confirmModal.variant === 'danger' ? 'bg-rose-100 text-rose-600' :
                                confirmModal.variant === 'warning' ? 'bg-amber-100 text-amber-600' :
                                'bg-emerald-100 text-emerald-600'
                            }`}>
                                {confirmModal.variant === 'danger' ? <Trash2 className="w-6 h-6" /> :
                                 confirmModal.variant === 'warning' ? <AlertCircle className="w-6 h-6" /> :
                                 <CheckCircle2 className="w-6 h-6" />}
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
                                    className={`px-5 py-2.5 text-xs font-bold rounded-xl text-white shadow-sm transition-all ${
                                        confirmModal.variant === 'danger' ? 'bg-rose-600 hover:bg-rose-700' :
                                        confirmModal.variant === 'warning' ? 'bg-amber-600 hover:bg-amber-700' :
                                        'bg-[#265243] hover:bg-[#1f4337]'
                                    }`}
                                >
                                    {confirmModal.confirmText}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
