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
    const [imagePreview, setImagePreview] = useState<string | null>(editing?.image ?? null);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;

        if (f.size > MAX_FILE_SIZE_BYTES) {
            onErrorMsg(
                `Ukuran gambar (${(f.size / (1024 * 1024)).toFixed(1)}MB) melebihi batas maksimal 3MB. Silakan pilih gambar dengan ukuran di bawah 3MB.`
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
            router.post(`/admin/facilities/${editing.id}`, { _method: 'PUT', ...payload }, {
                onFinish: () => setSaving(false),
                onSuccess: () => onClose(),
            });
        } else {
            router.post('/admin/facilities', payload, {
                onFinish: () => setSaving(false),
                onSuccess: () => onClose(),
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#c8dac5] space-y-6 relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 border-b border-[#e2ebd9] pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-[#265243] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-[#142921]">
                            {editing ? 'Edit Fasilitas Sekolah' : 'Tambah Fasilitas Baru'}
                        </h3>
                        <p className="text-xs text-[#527365]">
                            {editing ? 'Perbarui informasi sarana & prasarana' : 'Tambahkan item fasilitas baru untuk ditampilkan di beranda publik'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-extrabold text-[#142921] uppercase tracking-wider mb-1.5">
                            Nama Fasilitas / Sarpras <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Contoh: Laboratorium Komputer Modern"
                            className="w-full px-4 py-3 rounded-2xl border border-[#c8dac5] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#265243] focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-extrabold text-[#142921] uppercase tracking-wider mb-1.5">
                            Deskripsi Singkat
                        </label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Jelaskan fasilitas ini secara singkat untuk menarik minat publik..."
                            className="w-full px-4 py-3 rounded-2xl border border-[#c8dac5] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#265243] focus:border-transparent transition-all resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-extrabold text-[#142921] uppercase tracking-wider mb-1.5">
                            Foto Fasilitas (Maks. 3MB)
                        </label>
                        <div className="flex items-center gap-4">
                            {imagePreview ? (
                                <div className="relative w-24 h-20 rounded-2xl overflow-hidden border border-[#c8dac5] shrink-0 group">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImageFile(null);
                                            setImagePreview(null);
                                            if (fileInputRef.current) fileInputRef.current.value = '';
                                        }}
                                        className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="w-24 h-20 rounded-2xl bg-[#f4f8f3] border border-dashed border-[#c8dac5] flex flex-col items-center justify-center text-[#527365] shrink-0">
                                    <ImageIcon className="w-6 h-6 opacity-60" />
                                    <span className="text-[10px] font-bold mt-1">No Image</span>
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
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#f4f8f3] hover:bg-[#e2ebd9] text-[#265243] border border-[#c8dac5] text-xs font-bold transition-all cursor-pointer shadow-2xs"
                                >
                                    <ImageIcon className="w-4 h-4" />
                                    {imagePreview ? 'Ganti Foto' : 'Upload Foto'}
                                </label>
                                <p className="text-[11px] text-[#527365] mt-1.5 font-medium">
                                    Format disarankan JPG, PNG, atau WEBP. Maksimum 3 MB.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-[#f4f8f3] border border-[#c8dac5]">
                        <div>
                            <span className="text-xs font-bold text-[#142921] block">Status Tampil di Beranda</span>
                            <span className="text-[11px] text-[#527365]">Aktifkan agar fasilitas ini muncul di halaman utama</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsActive(!isActive)}
                            className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none ${
                                isActive ? 'bg-[#265243]' : 'bg-slate-300'
                            }`}
                        >
                            <span
                                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-md ${
                                    isActive ? 'left-6.5' : 'left-0.5'
                                }`}
                            />
                        </button>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e2ebd9]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-2xl border border-[#c8dac5] text-xs font-bold text-[#527365] hover:bg-[#f4f8f3] transition-all"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2.5 rounded-2xl bg-[#265243] hover:bg-[#142921] text-white text-xs font-black transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                        >
                            <Check className="w-4 h-4" />
                            {saving ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Tambah Fasilitas'}
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

    const [modal, setModal] = useState<{ open: boolean; editing: FacilityItem | null }>({ open: false, editing: null });
    const [searchQuery, setSearchQuery] = useState('');
    const [toastModalMsg, setToastModalMsg] = useState<{ type: 'success' | 'error'; title: string; msg: string } | null>(null);

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
            setToastModalMsg({ type: 'success', title: 'Berhasil!', msg: flashSuccess });
        } else if (flashError) {
            setToastModalMsg({ type: 'error', title: 'Terjadi Kesalahan!', msg: flashError });
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
        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

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
            (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <>
            <Head title="Sarana & Prasarana - Admin MAN TANJUNGPINANG" />

            {/* Notification Modal Toast */}
            {toastModalMsg && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#c8dac5] space-y-4 text-center">
                        <div
                            className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-inner ${
                                toastModalMsg.type === 'success'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}
                        >
                            {toastModalMsg.type === 'success' ? (
                                <Check className="w-7 h-7" />
                            ) : (
                                <AlertTriangle className="w-7 h-7" />
                            )}
                        </div>
                        <h4 className="text-xl font-black text-[#142921]">{toastModalMsg.title}</h4>
                        <p className="text-xs text-[#527365] font-medium leading-relaxed">{toastModalMsg.msg}</p>
                        <button
                            onClick={() => setToastModalMsg(null)}
                            className="w-full py-3 rounded-2xl bg-[#265243] hover:bg-[#142921] text-white text-xs font-black transition-all shadow-md cursor-pointer mt-2"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#c8dac5] space-y-4 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 border border-rose-300 mx-auto flex items-center justify-center shadow-inner">
                            <AlertTriangle className="w-7 h-7" />
                        </div>
                        <h4 className="text-xl font-black text-[#142921]">{confirmModal.title}</h4>
                        <p className="text-xs text-[#527365] font-medium leading-relaxed">{confirmModal.description}</p>
                        <div className="flex items-center justify-center gap-3 pt-3">
                            <button
                                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                                className="px-5 py-2.5 rounded-2xl border border-[#c8dac5] text-xs font-bold text-[#527365] hover:bg-[#f4f8f3] transition-all cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmModal.onConfirm}
                                className="px-6 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition-all shadow-md cursor-pointer"
                            >
                                {confirmModal.confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-6 p-4 sm:p-6 w-full">
                {/* Header Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-[#265243] text-white p-6 sm:p-8 shadow-md border border-[#316150]">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2 max-w-2xl">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-black tracking-wide border border-white/15 backdrop-blur-md">
                                    <Building2 className="w-3.5 h-3.5 text-[#f59e0b]" /> Sarana &amp; Prasarana
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full bg-[#f59e0b] text-[#142921] text-[11px] font-black uppercase tracking-wider">
                                    Modul Sekolah
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                                Sarana &amp; Prasarana Sekolah
                            </h1>
                            <p className="text-xs sm:text-sm text-emerald-100/90 font-medium leading-relaxed">
                                Kelola daftar fasilitas, ruang kelas, laboratorium, dan sarana prasarana sekolah yang tampil di halaman publik portal MAN Tanjungpinang.
                            </p>
                        </div>

                        <button
                            onClick={() => setModal({ open: true, editing: null })}
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-[#265243] hover:bg-[#f4f8f3] text-xs font-black transition-all shadow-md shrink-0 cursor-pointer"
                        >
                            <Plus className="w-4 h-4 text-[#265243]" />
                            Tambah Fasilitas Baru
                        </button>
                    </div>
                </div>

                {/* Filter and Search Bar (Standalone Bar) */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:w-80">
                        <Search className="w-4 h-4 text-[#527365] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari nama atau deskripsi fasilitas..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#c8dac5] bg-white text-xs font-semibold text-[#142921] placeholder-[#527365]/70 focus:outline-none focus:ring-2 focus:ring-[#265243] shadow-2xs"
                        />
                    </div>

                    <div className="flex items-center gap-3 text-xs font-bold text-[#527365] self-end sm:self-center">
                        <span>Total Fasilitas: <strong className="text-[#142921] font-black">{facilities.length}</strong> Item</span>
                        <span className="w-1 h-1 rounded-full bg-[#c8dac5]" />
                        <span>Aktif: <strong className="text-emerald-700 font-black">{facilities.filter((f) => f.is_active).length}</strong></span>
                    </div>
                </div>

                {/* Facilities Grid (Full Width Grid) */}
                {filteredFacilities.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-[#c8dac5] space-y-3 shadow-2xs">
                        <Building2 className="w-10 h-10 text-[#527365] opacity-40 mx-auto" />
                        <h4 className="text-base font-extrabold text-[#142921]">Belum Ada Fasilitas</h4>
                        <p className="text-xs text-[#527365]">
                            {searchQuery
                                ? `Tidak ada fasilitas yang cocok dengan kata kunci "${searchQuery}".`
                                : 'Belum ada data fasilitas yang ditambahkan. Silakan klik tombol di atas untuk menambah.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                        {filteredFacilities.map((item, index) => (
                            <div
                                key={item.id}
                                className={`bg-white rounded-3xl border ${
                                    item.is_active ? 'border-[#c8dac5]' : 'border-slate-200 opacity-75'
                                } hover:border-[#265243] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group`}
                            >
                                <div>
                                    {/* Image Box */}
                                    <div className="relative h-48 w-full bg-[#f4f8f3] overflow-hidden border-b border-[#e2ebd9]">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-[#527365]/60">
                                                <Building2 className="w-10 h-10 mb-1 opacity-50" />
                                                <span className="text-[11px] font-bold">Tanpa Foto</span>
                                            </div>
                                        )}

                                        {/* Status Badge */}
                                        <div className="absolute top-3 left-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-xs ${
                                                    item.is_active
                                                        ? 'bg-[#265243] text-white border border-[#316150]'
                                                        : 'bg-slate-200 text-slate-700 border border-slate-300'
                                                }`}
                                            >
                                                {item.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </div>

                                        {/* Ordering Buttons */}
                                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-md p-1 rounded-xl border border-white/20">
                                            <button
                                                disabled={index === 0}
                                                onClick={() => handleReorder(index, 'up')}
                                                title="Naikkan Urutan"
                                                className="p-1 rounded-lg text-white hover:bg-white/20 disabled:opacity-30 cursor-pointer"
                                            >
                                                <ArrowUp className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                disabled={index === facilities.length - 1}
                                                onClick={() => handleReorder(index, 'down')}
                                                title="Turunkan Urutan"
                                                className="p-1 rounded-lg text-white hover:bg-white/20 disabled:opacity-30 cursor-pointer"
                                            >
                                                <ArrowDown className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content Box */}
                                    <div className="p-5 space-y-2">
                                        <h3 className="text-base font-black text-[#142921] line-clamp-1">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-[#527365] font-medium line-clamp-3 leading-relaxed">
                                            {item.description || 'Tidak ada deskripsi rinci untuk fasilitas ini.'}
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons Footer */}
                                <div className="p-4 border-t border-[#e2ebd9] bg-[#f8faf7] flex items-center justify-between gap-2">
                                    <button
                                        onClick={() => setModal({ open: true, editing: item })}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#e2ebd9] text-[#265243] border border-[#c8dac5] text-xs font-bold transition-all shadow-2xs cursor-pointer"
                                    >
                                        <PenLine className="w-3.5 h-3.5" />
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(item)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
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
                    onErrorMsg={(msg) => setToastModalMsg({ type: 'error', title: 'File Terlalu Besar', msg })}
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
