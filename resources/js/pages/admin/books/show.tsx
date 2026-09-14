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

        borrowForm.post(
            `/admin/books/${book.id}/copies/${selectedCopy.id}/toggle`,
            {
                onSuccess: () => {
                    setBorrowModalOpen(false);
                    setSelectedCopy(null);
                    borrowForm.reset();
                },
            },
        );
    };

    const handleReturnCopy = (copy: CopyItem) => {
        setConfirmModal({
            isOpen: true,
            title: 'Konfirmasi Pengembalian Buku',
            description: `Apakah Anda yakin ingin menandai eksemplar (${copy.copy_code}) sebagai DIKEMBALIKAN (Tersedia)? Stok tersedia akan otomatis bertambah 1.`,
            confirmText: 'Ya, Tandai Dikembalikan',
            variant: 'success',
            onConfirm: () => {
                router.post(
                    `/admin/books/${book.id}/copies/${copy.id}/toggle`,
                    {
                        borrower_name: '',
                    },
                );
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
            <Head
                title={`Stok & Peminjaman: ${book.title} - Admin - MAN TANJUNGPINANG`}
            />

            <div className="w-full space-y-6 p-4 sm:p-6">
                {flash?.success && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-600">
                        <CheckCircle2 className="h-5 w-5 shrink-0" />
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
                            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#265243] shadow-sm transition-all hover:bg-slate-100"
                        >
                            <ArrowLeft className="h-4 w-4" /> Kembali ke Katalog
                            Buku
                        </Link>
                    }
                />

                {/* Stock Stats Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div
                        style={{ backgroundColor: '#265243' }}
                        className="flex items-center justify-between rounded-2xl border border-[#1b3d32] p-5 text-white shadow-sm"
                    >
                        <div>
                            <p className="text-xs font-extrabold tracking-wider text-emerald-100 uppercase">
                                Total Stok Fisik
                            </p>
                            <h3 className="mt-1 text-3xl font-extrabold text-white">
                                {book.total_stock}{' '}
                                <span className="text-xs font-semibold text-emerald-100">
                                    eksemplar
                                </span>
                            </h3>
                        </div>
                        <div className="rounded-xl bg-[#346b57] p-3.5 text-white">
                            <BookMarked className="h-6 w-6" />
                        </div>
                    </div>

                    <div
                        style={{ backgroundColor: '#1b7a5a' }}
                        className="flex items-center justify-between rounded-2xl border border-[#145d44] p-5 text-white shadow-sm"
                    >
                        <div>
                            <p className="text-xs font-extrabold tracking-wider text-emerald-100 uppercase">
                                Stok Tersedia
                            </p>
                            <h3 className="mt-1 text-3xl font-extrabold text-white">
                                {book.available_stock}{' '}
                                <span className="text-xs font-semibold text-emerald-100">
                                    siap pinjam
                                </span>
                            </h3>
                        </div>
                        <div className="rounded-xl bg-[#289c75] p-3.5 text-white">
                            <BookCheck className="h-6 w-6" />
                        </div>
                    </div>

                    <div
                        style={{ backgroundColor: '#b46a06' }}
                        className="flex items-center justify-between rounded-2xl border border-[#8f5304] p-5 text-white shadow-sm"
                    >
                        <div>
                            <p className="text-xs font-extrabold tracking-wider text-amber-100 uppercase">
                                Sedang Dipinjam
                            </p>
                            <h3 className="mt-1 text-3xl font-extrabold text-white">
                                {book.borrowed_count}{' '}
                                <span className="text-xs font-semibold text-amber-100">
                                    buku keluar
                                </span>
                            </h3>
                        </div>
                        <div className="rounded-xl bg-[#d98208] p-3.5 text-white">
                            <Clock className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                {/* Copies List Section */}
                <div className="space-y-4 rounded-2xl border border-[#c8d6c0] bg-white p-6 shadow-sm">
                    <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-3 sm:flex-row sm:items-center">
                        <div>
                            <h3 className="text-base font-bold text-[#142921]">
                                List Eksemplar & Status Peminjaman
                            </h3>
                            <p className="text-xs font-semibold text-[#2e5445]">
                                Setiap kali status eksemplar diubah ke
                                Dipinjam/Dikembalikan, stok tersedia akan
                                otomatis berkurang/bertambah.
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                copyForm.setData(
                                    'copy_code',
                                    `BK-${book.id}-${String(book.copies.length + 1).padStart(3, '0')}`,
                                );
                                setCopyModalOpen(true);
                            }}
                            style={{
                                backgroundColor: '#265243',
                                color: '#ffffff',
                            }}
                            className="inline-flex items-center gap-2 self-start rounded-xl px-4 py-2.5 text-xs font-bold shadow-sm transition-all hover:bg-[#1f4337] sm:self-auto"
                        >
                            <Plus className="h-4 w-4" /> Tambah Eksemplar Buku
                        </button>
                    </div>

                    {/* Search & Filter Eksemplar */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            router.get(
                                `/admin/books/${book.id}`,
                                { search, status: statusFilter },
                                { preserveState: true },
                            );
                        }}
                        className="flex flex-col items-stretch gap-3 py-1 sm:flex-row sm:items-center"
                    >
                        <div className="relative max-w-md flex-1">
                            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#265243]" />
                            <input
                                type="text"
                                placeholder="Cari kode eksemplar atau nama peminjam..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{
                                    backgroundColor: '#eef4eb',
                                    borderColor: '#b8ceb0',
                                    color: '#1a3d31',
                                }}
                                className="w-full rounded-full border py-2.5 pr-4 pl-10 text-xs font-semibold shadow-xs transition-all placeholder:text-[#527365] focus:bg-white focus:ring-2 focus:ring-[#265243] focus:outline-none"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                router.get(
                                    `/admin/books/${book.id}`,
                                    { search, status: e.target.value },
                                    { preserveState: true },
                                );
                            }}
                            style={{
                                backgroundColor: '#eef4eb',
                                borderColor: '#b8ceb0',
                                color: '#1a3d31',
                            }}
                            className="rounded-full border px-4 py-2.5 text-xs font-semibold shadow-xs transition-all focus:bg-white focus:ring-2 focus:ring-[#265243] focus:outline-none"
                        >
                            <option value="">Semua Status Eksemplar</option>
                            <option value="available">
                                Tersedia Siap Pinjam
                            </option>
                            <option value="borrowed">Sedang Dipinjam</option>
                        </select>
                        <button
                            type="submit"
                            style={{
                                backgroundColor: '#265243',
                                color: '#ffffff',
                            }}
                            className="rounded-full px-5 py-2.5 text-xs font-bold shadow-xs transition-all hover:bg-[#1f4337]"
                        >
                            Filter
                        </button>
                    </form>

                    {/* Copies Table */}
                    <div
                        style={{
                            backgroundColor: '#f2f7f0',
                            borderColor: '#b8ceb0',
                        }}
                        className="overflow-x-auto rounded-xl border"
                    >
                        <table className="w-full text-left text-sm">
                            <thead
                                style={{
                                    backgroundColor: '#265243',
                                    color: '#ffffff',
                                }}
                                className="text-xs font-extrabold tracking-wider uppercase"
                            >
                                <tr>
                                    <th className="px-5 py-3.5 text-white">
                                        Kode Eksemplar
                                    </th>
                                    <th className="px-5 py-3.5 text-white">
                                        Status Ketersediaan
                                    </th>
                                    <th className="px-5 py-3.5 text-white">
                                        Peminjam
                                    </th>
                                    <th className="px-5 py-3.5 text-white">
                                        Tgl Pinjam
                                    </th>
                                    <th className="px-5 py-3.5 text-white">
                                        Jatuh Tempo
                                    </th>
                                    <th className="px-5 py-3.5 text-right text-white">
                                        Aksi Peminjaman
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#c8d6c0]">
                                {book.copies.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-5 py-8 text-center text-xs font-semibold text-[#4a6b5d]"
                                        >
                                            Belum ada data eksemplar fisik. Klik
                                            "Tambah Eksemplar Baru" untuk
                                            membuat unit fisik buku ini.
                                        </td>
                                    </tr>
                                ) : (
                                    book.copies.map((copy, idx) => (
                                        <tr
                                            key={copy.id}
                                            style={{
                                                backgroundColor:
                                                    idx % 2 === 0
                                                        ? '#f7faf5'
                                                        : '#eef4eb',
                                            }}
                                            className="transition-colors hover:bg-[#e3edd9]"
                                        >
                                            <td className="px-5 py-4 font-mono text-xs font-bold text-[#142921]">
                                                {copy.copy_code}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold shadow-sm ${
                                                        copy.status ===
                                                        'available'
                                                            ? 'border border-emerald-300 bg-emerald-100 text-emerald-900'
                                                            : 'border border-amber-300 bg-amber-100 text-amber-900'
                                                    }`}
                                                >
                                                    {copy.status ===
                                                    'available' ? (
                                                        <>
                                                            <BookCheck className="h-3.5 w-3.5 text-emerald-700" />{' '}
                                                            Tersedia
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Clock className="h-3.5 w-3.5 text-amber-700" />{' '}
                                                            Dipinjam
                                                        </>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-xs font-bold text-[#142921]">
                                                {copy.borrower_name || (
                                                    <span className="font-normal text-[#4a6b5d] italic">
                                                        - (Belum dipinjam)
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-xs font-semibold text-[#2e5445]">
                                                {copy.borrowed_at || '-'}
                                            </td>
                                            <td className="px-5 py-4 text-xs font-semibold text-[#2e5445]">
                                                {copy.due_date || '-'}
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {copy.status ===
                                                    'available' ? (
                                                        <button
                                                            onClick={() =>
                                                                handleOpenBorrowModal(
                                                                    copy,
                                                                )
                                                            }
                                                            className="flex items-center gap-1 rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-amber-600"
                                                        >
                                                            <UserCheck className="h-3.5 w-3.5" />{' '}
                                                            Catat Dipinjam
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                handleReturnCopy(
                                                                    copy,
                                                                )
                                                            }
                                                            className="flex items-center gap-1 rounded-xl bg-[#265243] px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#1f4337]"
                                                        >
                                                            <RotateCcw className="h-3.5 w-3.5" />{' '}
                                                            Kembalikan
                                                            (Tersedia)
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteCopy(
                                                                copy.id,
                                                                copy.copy_code,
                                                            )
                                                        }
                                                        className="rounded-xl p-1.5 text-[#265243] transition-colors hover:bg-rose-50 hover:text-rose-600"
                                                        title="Hapus Eksemplar"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                            <h3 className="flex items-center gap-2 text-base font-bold text-[#142921]">
                                <Plus className="h-5 w-5 text-[#265243]" />{' '}
                                Tambah Eksemplar Stok Buku
                            </h3>
                            <button
                                onClick={() => setCopyModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleAddCopy}
                            className="space-y-4 p-6"
                        >
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-700">
                                    Kode Eksemplar / Barcode{' '}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Contoh: BK-001-004"
                                    value={copyForm.data.copy_code}
                                    onChange={(e) =>
                                        copyForm.setData(
                                            'copy_code',
                                            e.target.value,
                                        )
                                    }
                                    style={{
                                        backgroundColor: '#f7faf5',
                                        borderColor: '#b8ceb0',
                                        color: '#142921',
                                    }}
                                    className="w-full rounded-xl border px-3.5 py-2 text-xs font-semibold text-[#142921] placeholder:text-[#527365] focus:ring-2 focus:ring-[#265243] focus:outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-700">
                                    Catatan Kondisi (Opsional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Kondisi baik / Rak 02 / Sampul keras"
                                    value={copyForm.data.notes}
                                    onChange={(e) =>
                                        copyForm.setData(
                                            'notes',
                                            e.target.value,
                                        )
                                    }
                                    style={{
                                        backgroundColor: '#f7faf5',
                                        borderColor: '#b8ceb0',
                                        color: '#142921',
                                    }}
                                    className="w-full rounded-xl border px-3.5 py-2 text-xs font-semibold text-[#142921] placeholder:text-[#527365] focus:ring-2 focus:ring-[#265243] focus:outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setCopyModalOpen(false)}
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={copyForm.processing}
                                    className="rounded-xl bg-[#265243] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1f4337]"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                            <h3 className="flex items-center gap-2 text-base font-bold text-[#142921]">
                                <UserCheck className="h-5 w-5 text-amber-600" />{' '}
                                Catat Peminjaman Eksemplar
                            </h3>
                            <button
                                onClick={() => setBorrowModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleConfirmBorrow}
                            className="space-y-4 p-6"
                        >
                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs font-medium text-amber-900">
                                Eksemplar Kode:{' '}
                                <strong className="font-mono text-amber-950">
                                    {selectedCopy.copy_code}
                                </strong>
                                . Status akan diubah menjadi{' '}
                                <strong>DIPINJAM</strong> dan stok tersedia akan
                                otomatis berkurang 1.
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-700">
                                    Nama Peminjam (Siswa / Guru){' '}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Masukkan nama lengkap peminjam..."
                                    value={borrowForm.data.borrower_name}
                                    onChange={(e) =>
                                        borrowForm.setData(
                                            'borrower_name',
                                            e.target.value,
                                        )
                                    }
                                    style={{
                                        backgroundColor: '#f7faf5',
                                        borderColor: '#b8ceb0',
                                        color: '#142921',
                                    }}
                                    className="w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold text-[#142921] placeholder:text-[#527365] focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                    required
                                />
                                {borrowForm.errors.borrower_name && (
                                    <p className="mt-1 text-[11px] text-rose-500">
                                        {borrowForm.errors.borrower_name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-700">
                                    Tanggal Tanggung Jawab / Jatuh Tempo (Klik
                                    Kalender)
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={borrowForm.data.due_date}
                                        onChange={(e) =>
                                            borrowForm.setData(
                                                'due_date',
                                                e.target.value,
                                            )
                                        }
                                        onClick={(e) =>
                                            (
                                                e.target as HTMLInputElement
                                            ).showPicker?.()
                                        }
                                        style={{
                                            backgroundColor: '#f7faf5',
                                            borderColor: '#b8ceb0',
                                            color: '#142921',
                                        }}
                                        className="w-full cursor-pointer rounded-xl border px-3.5 py-2.5 text-xs font-semibold text-[#142921] focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                    />
                                    <Calendar className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-amber-700" />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setBorrowModalOpen(false)}
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={borrowForm.processing}
                                    className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-600"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                    <div className="animate-in fade-in zoom-in w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl duration-150">
                        <div className="space-y-4 p-6 text-center">
                            <div
                                className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${
                                    confirmModal.variant === 'danger'
                                        ? 'bg-rose-100 text-rose-600'
                                        : confirmModal.variant === 'warning'
                                          ? 'bg-amber-100 text-amber-600'
                                          : 'bg-emerald-100 text-emerald-600'
                                }`}
                            >
                                {confirmModal.variant === 'danger' ? (
                                    <Trash2 className="h-6 w-6" />
                                ) : confirmModal.variant === 'warning' ? (
                                    <AlertCircle className="h-6 w-6" />
                                ) : (
                                    <CheckCircle2 className="h-6 w-6" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold text-[#142921]">
                                    {confirmModal.title}
                                </h3>
                                <p className="mt-1 text-xs leading-relaxed font-semibold text-[#2e5445]">
                                    {confirmModal.description}
                                </p>
                            </div>
                            <div className="flex items-center justify-center gap-3 border-t border-slate-100 pt-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setConfirmModal((prev) => ({
                                            ...prev,
                                            isOpen: false,
                                        }))
                                    }
                                    className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmModal.onConfirm}
                                    className={`rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all ${
                                        confirmModal.variant === 'danger'
                                            ? 'bg-rose-600 hover:bg-rose-700'
                                            : confirmModal.variant === 'warning'
                                              ? 'bg-amber-600 hover:bg-amber-700'
                                              : 'bg-[#265243] hover:bg-[#1f4337]'
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
