import { Head, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowDown,
    ArrowUp,
    Building2,
    Check,
    Image as ImageIcon,
    PenLine,
    Plus,
    Search,
    Sparkles,
    Trash2,
    X,
} from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';

interface FacilityItem {
    id: number;
    title: string;
    description: string | null;
    image: string | null;
    order: number;
    is_active: boolean;
}

interface Props {
    facilities: FacilityItem[];
    flash?: { success?: string; error?: string };
}

const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024; // 3MB limit

/* ─── Facility Add/Edit Modal Component ─────────────────────────────── */
function FacilityModal({
    editing,
    onClose,
    onErrorMsg,
}: {
    editing: FacilityItem | null;
    onClose: () => void;
    onErrorMsg: (msg: string) => void;
}) {
    const [title, setTitle] = useState(editing?.title ?? '');
    const [description, setDescription] = useState(editing?.description ?? '');
    const [isActive, setIsActive] = useState(editing?.is_active ?? true);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        editing?.image ?? null,
    );
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;

        if (f.size > MAX_FILE_SIZE_BYTES) {
            onErrorMsg(
                `Ukuran gambar (${(f.size / (1024 * 1024)).toFixed(1)}MB) melebihi batas maksimal 3MB. Silakan pilih gambar dengan ukuran di bawah 3MB.`,
            );
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setImageFile(f);
        setImagePreview(URL.createObjectURL(f));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setSaving(true);
        const payload: Record<string, any> = {
            title,
            description,
            is_active: isActive ? 1 : 0,
        };
        if (imageFile) payload.image = imageFile;

        if (editing) {
            router.post(
                `/admin/facilities/${editing.id}`,
                { _method: 'PUT', ...payload },
                {
                    onFinish: () => setSaving(false),
                    onSuccess: () => onClose(),
                },
            );
        } else {
            router.post('/admin/facilities', payload, {
                onFinish: () => setSaving(false),
                onSuccess: () => onClose(),
            });
        }
    };

    return (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs duration-200">
            <div className="relative max-h-[90vh] w-full max-w-xl space-y-6 overflow-y-auto rounded-3xl border border-[#c8dac5] bg-white p-6 shadow-2xl sm:p-8">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-3 border-b border-[#e2ebd9] pb-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#265243] text-white shadow-xs">
                        <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-[#142921]">
                            {editing
                                ? 'Edit Fasilitas Sekolah'
                                : 'Tambah Fasilitas Baru'}
                        </h3>
                        <p className="text-xs text-[#527365]">
                            {editing
                                ? 'Perbarui informasi sarana & prasarana'
                                : 'Tambahkan item fasilitas baru untuk ditampilkan di beranda publik'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-1.5 block text-xs font-extrabold tracking-wider text-[#142921] uppercase">
                            Nama Fasilitas / Sarpras{' '}
                            <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Contoh: Laboratorium Komputer Modern"
                            className="w-full rounded-2xl border border-[#c8dac5] px-4 py-3 text-xs font-semibold transition-all focus:border-transparent focus:ring-2 focus:ring-[#265243] focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-extrabold tracking-wider text-[#142921] uppercase">
                            Deskripsi Singkat
                        </label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Jelaskan fasilitas ini secara singkat untuk menarik minat publik..."
                            className="w-full resize-none rounded-2xl border border-[#c8dac5] px-4 py-3 text-xs font-semibold transition-all focus:border-transparent focus:ring-2 focus:ring-[#265243] focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-extrabold tracking-wider text-[#142921] uppercase">
                            Foto Fasilitas (Maks. 3MB)
                        </label>
                        <div className="flex items-center gap-4">
                            {imagePreview ? (
                                <div className="group relative h-20 w-24 shrink-0 overflow-hidden rounded-2xl border border-[#c8dac5]">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="h-full w-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImageFile(null);
                                            setImagePreview(null);
                                            if (fileInputRef.current)
                                                fileInputRef.current.value = '';
                                        }}
                                        className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex h-20 w-24 shrink-0 flex-col items-center justify-center rounded-2xl border border-dashed border-[#c8dac5] bg-[#f4f8f3] text-[#527365]">
                                    <ImageIcon className="h-6 w-6 opacity-60" />
                                    <span className="mt-1 text-[10px] font-bold">
                                        No Image
                                    </span>
                                </div>
                            )}

                            <div className="flex-1">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="facility-image-input"
                                />
                                <label
                                    htmlFor="facility-image-input"
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-[#c8dac5] bg-[#f4f8f3] px-4 py-2.5 text-xs font-bold text-[#265243] shadow-2xs transition-all hover:bg-[#e2ebd9]"
                                >
                                    <ImageIcon className="h-4 w-4" />
                                    {imagePreview
                                        ? 'Ganti Foto'
                                        : 'Upload Foto'}
                                </label>
                                <p className="mt-1.5 text-[11px] font-medium text-[#527365]">
                                    Format disarankan JPG, PNG, atau WEBP.
                                    Maksimum 3 MB.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-[#c8dac5] bg-[#f4f8f3] p-4">
                        <div>
                            <span className="block text-xs font-bold text-[#142921]">
                                Status Tampil di Beranda
                            </span>
                            <span className="text-[11px] text-[#527365]">
                                Aktifkan agar fasilitas ini muncul di halaman
                                utama
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsActive(!isActive)}
                            className={`relative h-6 w-12 rounded-full transition-colors focus:outline-none ${
                                isActive ? 'bg-[#265243]' : 'bg-slate-300'
                            }`}
                        >
                            <span
                                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
                                    isActive ? 'left-6.5' : 'left-0.5'
                                }`}
                            />
                        </button>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-[#e2ebd9] pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-2xl border border-[#c8dac5] px-5 py-2.5 text-xs font-bold text-[#527365] transition-all hover:bg-[#f4f8f3]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 rounded-2xl bg-[#265243] px-6 py-2.5 text-xs font-black text-white shadow-md transition-all hover:bg-[#142921] disabled:opacity-50"
                        >
                            <Check className="h-4 w-4" />
                            {saving
                                ? 'Menyimpan...'
                                : editing
                                  ? 'Simpan Perubahan'
                                  : 'Tambah Fasilitas'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ─── Main Page Component ───────────────────────────────────────────── */
export default function AdminFacilities({ facilities = [], flash }: Props) {
    const page = usePage();
    const flashSuccess = flash?.success || (page.props as any).flash?.success;
    const flashError = flash?.error || (page.props as any).flash?.error;

    const [modal, setModal] = useState<{
        open: boolean;
        editing: FacilityItem | null;
    }>({ open: false, editing: null });
    const [searchQuery, setSearchQuery] = useState('');
    const [toastModalMsg, setToastModalMsg] = useState<{
        type: 'success' | 'error';
        title: string;
        msg: string;
    } | null>(null);

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
        confirmText: 'Hapus',
        onConfirm: () => {},
    });

    useEffect(() => {
        if (flashSuccess) {
            setToastModalMsg({
                type: 'success',
                title: 'Berhasil!',
                msg: flashSuccess,
            });
        } else if (flashError) {
            setToastModalMsg({
                type: 'error',
                title: 'Terjadi Kesalahan!',
                msg: flashError,
            });
        }
    }, [flashSuccess, flashError]);

    const handleDelete = (item: FacilityItem) => {
        setConfirmModal({
            isOpen: true,
            title: 'Hapus Fasilitas',
            description: `Apakah Anda yakin ingin menghapus fasilitas "${item.title}"? Tindakan ini tidak dapat dibatalkan.`,
            confirmText: 'Hapus Sekarang',
            onConfirm: () => {
                router.delete(`/admin/facilities/${item.id}`, {
                    onSuccess: () => {
                        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                    },
                });
            },
        });
    };

    const handleReorder = (currentIndex: number, direction: 'up' | 'down') => {
        const newItems = [...facilities];
        const targetIndex =
            direction === 'up' ? currentIndex - 1 : currentIndex + 1;

        if (targetIndex < 0 || targetIndex >= newItems.length) return;

        const temp = newItems[currentIndex];
        newItems[currentIndex] = newItems[targetIndex];
        newItems[targetIndex] = temp;

        const orderPayload = newItems.map((item) => item.id);
        router.post('/admin/facilities/reorder', { order: orderPayload });
    };

    const filteredFacilities = facilities.filter(
        (f) =>
            f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (f.description &&
                f.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())),
    );

    return (
        <>
            <Head title="Sarana & Prasarana - Admin MAN TANJUNGPINANG" />

            {/* Notification Modal Toast */}
            {toastModalMsg && (
                <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs duration-200">
                    <div className="w-full max-w-md space-y-4 rounded-3xl border border-[#c8dac5] bg-white p-6 text-center shadow-2xl sm:p-7">
                        <div
                            className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner ${
                                toastModalMsg.type === 'success'
                                    ? 'border border-emerald-300 bg-emerald-100 text-emerald-800'
                                    : 'border border-rose-300 bg-rose-100 text-rose-800'
                            }`}
                        >
                            {toastModalMsg.type === 'success' ? (
                                <Check className="h-7 w-7" />
                            ) : (
                                <AlertTriangle className="h-7 w-7" />
                            )}
                        </div>
                        <h4 className="text-xl font-black text-[#142921]">
                            {toastModalMsg.title}
                        </h4>
                        <p className="text-xs leading-relaxed font-medium text-[#527365]">
                            {toastModalMsg.msg}
                        </p>
                        <button
                            onClick={() => setToastModalMsg(null)}
                            className="mt-2 w-full cursor-pointer rounded-2xl bg-[#265243] py-3 text-xs font-black text-white shadow-md transition-all hover:bg-[#142921]"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {confirmModal.isOpen && (
                <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs duration-200">
                    <div className="w-full max-w-md space-y-4 rounded-3xl border border-[#c8dac5] bg-white p-6 text-center shadow-2xl sm:p-7">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-300 bg-rose-100 text-rose-700 shadow-inner">
                            <AlertTriangle className="h-7 w-7" />
                        </div>
                        <h4 className="text-xl font-black text-[#142921]">
                            {confirmModal.title}
                        </h4>
                        <p className="text-xs leading-relaxed font-medium text-[#527365]">
                            {confirmModal.description}
                        </p>
                        <div className="flex items-center justify-center gap-3 pt-3">
                            <button
                                onClick={() =>
                                    setConfirmModal((prev) => ({
                                        ...prev,
                                        isOpen: false,
                                    }))
                                }
                                className="cursor-pointer rounded-2xl border border-[#c8dac5] px-5 py-2.5 text-xs font-bold text-[#527365] transition-all hover:bg-[#f4f8f3]"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmModal.onConfirm}
                                className="cursor-pointer rounded-2xl bg-rose-600 px-6 py-2.5 text-xs font-black text-white shadow-md transition-all hover:bg-rose-700"
                            >
                                {confirmModal.confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex w-full flex-col gap-6 p-4 sm:p-6">
                {/* Header Banner */}
                <div className="relative overflow-hidden rounded-3xl border border-[#316150] bg-[#265243] p-6 text-white shadow-md sm:p-8">
                    <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                        <div className="max-w-2xl space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black tracking-wide text-white backdrop-blur-md">
                                    <Building2 className="h-3.5 w-3.5 text-[#f59e0b]" />{' '}
                                    Sarana &amp; Prasarana
                                </span>
                                <span className="rounded-full bg-[#f59e0b] px-2.5 py-0.5 text-[11px] font-black tracking-wider text-[#142921] uppercase">
                                    Modul Sekolah
                                </span>
                            </div>
                            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                                Sarana &amp; Prasarana Sekolah
                            </h1>
                            <p className="text-xs leading-relaxed font-medium text-emerald-100/90 sm:text-sm">
                                Kelola daftar fasilitas, ruang kelas,
                                laboratorium, dan sarana prasarana sekolah yang
                                tampil di halaman publik portal MAN
                                Tanjungpinang.
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                setModal({ open: true, editing: null })
                            }
                            className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-black text-[#265243] shadow-md transition-all hover:bg-[#f4f8f3]"
                        >
                            <Plus className="h-4 w-4 text-[#265243]" />
                            Tambah Fasilitas Baru
                        </button>
                    </div>
                </div>

                {/* Filter and Search Bar (Standalone Bar) */}
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#527365]" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari nama atau deskripsi fasilitas..."
                            className="w-full rounded-2xl border border-[#c8dac5] bg-white py-2.5 pr-4 pl-10 text-xs font-semibold text-[#142921] placeholder-[#527365]/70 shadow-2xs focus:ring-2 focus:ring-[#265243] focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-3 self-end text-xs font-bold text-[#527365] sm:self-center">
                        <span>
                            Total Fasilitas:{' '}
                            <strong className="font-black text-[#142921]">
                                {facilities.length}
                            </strong>{' '}
                            Item
                        </span>
                        <span className="h-1 w-1 rounded-full bg-[#c8dac5]" />
                        <span>
                            Aktif:{' '}
                            <strong className="font-black text-emerald-700">
                                {facilities.filter((f) => f.is_active).length}
                            </strong>
                        </span>
                    </div>
                </div>

                {/* Facilities Grid (Full Width Grid) */}
                {filteredFacilities.length === 0 ? (
                    <div className="space-y-3 rounded-3xl border border-dashed border-[#c8dac5] bg-white p-12 text-center shadow-2xs">
                        <Building2 className="mx-auto h-10 w-10 text-[#527365] opacity-40" />
                        <h4 className="text-base font-extrabold text-[#142921]">
                            Belum Ada Fasilitas
                        </h4>
                        <p className="text-xs text-[#527365]">
                            {searchQuery
                                ? `Tidak ada fasilitas yang cocok dengan kata kunci "${searchQuery}".`
                                : 'Belum ada data fasilitas yang ditambahkan. Silakan klik tombol di atas untuk menambah.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredFacilities.map((item, index) => (
                            <div
                                key={item.id}
                                className={`rounded-3xl border bg-white ${
                                    item.is_active
                                        ? 'border-[#c8dac5]'
                                        : 'border-slate-200 opacity-75'
                                } group flex flex-col justify-between overflow-hidden shadow-xs transition-all hover:border-[#265243] hover:shadow-md`}
                            >
                                <div>
                                    {/* Image Box */}
                                    <div className="relative h-48 w-full overflow-hidden border-b border-[#e2ebd9] bg-[#f4f8f3]">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full flex-col items-center justify-center text-[#527365]/60">
                                                <Building2 className="mb-1 h-10 w-10 opacity-50" />
                                                <span className="text-[11px] font-bold">
                                                    Tanpa Foto
                                                </span>
                                            </div>
                                        )}

                                        {/* Status Badge */}
                                        <div className="absolute top-3 left-3">
                                            <span
                                                className={`rounded-full px-3 py-1 text-[10px] font-black tracking-wider uppercase shadow-xs ${
                                                    item.is_active
                                                        ? 'border border-[#316150] bg-[#265243] text-white'
                                                        : 'border border-slate-300 bg-slate-200 text-slate-700'
                                                }`}
                                            >
                                                {item.is_active
                                                    ? 'Aktif'
                                                    : 'Nonaktif'}
                                            </span>
                                        </div>

                                        {/* Ordering Buttons */}
                                        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-xl border border-white/20 bg-black/40 p-1 backdrop-blur-md">
                                            <button
                                                disabled={index === 0}
                                                onClick={() =>
                                                    handleReorder(index, 'up')
                                                }
                                                title="Naikkan Urutan"
                                                className="cursor-pointer rounded-lg p-1 text-white hover:bg-white/20 disabled:opacity-30"
                                            >
                                                <ArrowUp className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                disabled={
                                                    index ===
                                                    facilities.length - 1
                                                }
                                                onClick={() =>
                                                    handleReorder(index, 'down')
                                                }
                                                title="Turunkan Urutan"
                                                className="cursor-pointer rounded-lg p-1 text-white hover:bg-white/20 disabled:opacity-30"
                                            >
                                                <ArrowDown className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content Box */}
                                    <div className="space-y-2 p-5">
                                        <h3 className="line-clamp-1 text-base font-black text-[#142921]">
                                            {item.title}
                                        </h3>
                                        <p className="line-clamp-3 text-xs leading-relaxed font-medium text-[#527365]">
                                            {item.description ||
                                                'Tidak ada deskripsi rinci untuk fasilitas ini.'}
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons Footer */}
                                <div className="flex items-center justify-between gap-2 border-t border-[#e2ebd9] bg-[#f8faf7] p-4">
                                    <button
                                        onClick={() =>
                                            setModal({
                                                open: true,
                                                editing: item,
                                            })
                                        }
                                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#c8dac5] bg-white px-3.5 py-1.5 text-xs font-bold text-[#265243] shadow-2xs transition-all hover:bg-[#e2ebd9]"
                                    >
                                        <PenLine className="h-3.5 w-3.5" />
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(item)}
                                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3 py-1.5 text-xs font-bold text-rose-700 shadow-2xs transition-all hover:bg-rose-50"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Facility Modal */}
            {modal.open && (
                <FacilityModal
                    editing={modal.editing}
                    onClose={() => setModal({ open: false, editing: null })}
                    onErrorMsg={(msg) =>
                        setToastModalMsg({
                            type: 'error',
                            title: 'File Terlalu Besar',
                            msg,
                        })
                    }
                />
            )}
        </>
    );
}

AdminFacilities.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Sarana & Prasarana', href: '/admin/facilities' },
    ],
};
