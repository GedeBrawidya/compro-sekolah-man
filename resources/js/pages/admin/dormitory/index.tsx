import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    Edit3,
    Home,
    Image as ImageIcon,
    Plus,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';

interface DormitoryItem {
    id: number;
    title: string;
    slug: string;
    content: string;
    media: string | null;
    created_at: string;
    author?: { id: number; name: string };
}

interface Props {
    posts: {
        data: DormitoryItem[];
        links: any[];
    };
    settings?: Record<string, string>;
    filters: {
        search?: string;
    };
}

export default function DormitoryIndex({ posts, settings, filters }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<DormitoryItem | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);

    const { data: settingsData, setData: setSettingsData, post: postSettings, processing: processingSettings } = useForm({
        dormitory_pengasuh_name: settings?.dormitory_pengasuh_name || 'Ustadz & Ustadzah Pengasuh',
        dormitory_pengasuh_title: settings?.dormitory_pengasuh_title || 'Tim Pembina Karakter & Tahfidz MAN',
        dormitory_title: settings?.dormitory_title || 'Lingkungan Hunian Islami, Disiplin, & Berprestasi',
        dormitory_description: settings?.dormitory_description || "Asrama Ma'had MAN dirancang untuk membentuk karakter santri yang mandiri, berilmu, dan berakhlaqul karimah. Dilengkapi dengan program Tahfidzul Qur'an, kajian kitab kuning, bimbingan akademik intensif, serta pembiasaan kedisiplinan hidup sehari-hari di bawah pengawasan pengasuh berpengalaman.",
        dormitory_wa_putra: settings?.dormitory_wa_putra || 'https://wa.me/6281234567890',
        dormitory_wa_putri: settings?.dormitory_wa_putri || 'https://wa.me/6281234567891',
        dormitory_instagram: settings?.dormitory_instagram || 'https://instagram.com',
        dormitory_tiktok: settings?.dormitory_tiktok || 'https://tiktok.com',
        dormitory_pengasuh_photo: null as File | null,
    });

    const handleSettingsSubmit = (e: FormEvent) => {
        e.preventDefault();
        postSettings('/admin/dormitory/settings', {
            preserveScroll: true,
        });
    };

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<{
        title: string;
        content: string;
        media: File | null;
    }>({
        title: '',
        content: '',
        media: null,
    });

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get('/admin/dormitory', { search }, { preserveState: true });
    };

    const openCreateModal = () => {
        setEditingItem(null);
        reset();
        clearErrors();
        setFileError(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: DormitoryItem) => {
        setEditingItem(item);
        setData({
            title: item.title,
            content: item.content,
            media: null,
        });
        clearErrors();
        setFileError(null);
        setIsModalOpen(true);
    };

    const handleFileChange = (file: File | null) => {
        setFileError(null);
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setFileError('Ukuran file maksimal adalah 2MB.');
                setData('media', null);
                return;
            }
        }
        setData('media', file);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (fileError) return;

        if (editingItem) {
            router.post(`/admin/dormitory/${editingItem.id}`, {
                _method: 'PUT',
                ...data,
            }, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
                onError: (errs) => {
                    if (errs.media) {
                        setFileError(errs.media);
                    }
                }
            });
        } else {
            post('/admin/dormitory', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
                onError: (errs) => {
                    if (errs.media) {
                        setFileError(errs.media);
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
        confirmText: 'Ya, Hapus Konten',
        onConfirm: () => {},
    });

    const handleDelete = (item: DormitoryItem) => {
        setConfirmModal({
            isOpen: true,
            title: 'Hapus Konten Asrama',
            description: `Apakah Anda yakin ingin menghapus konten asrama "${item.title}"?`,
            confirmText: 'Ya, Hapus Konten',
            onConfirm: () => {
                router.delete(`/admin/dormitory/${item.id}`);
                setConfirmModal((prev) => ({ ...prev, isOpen: false }));
            },
        });
    };

    return (
        <>
            <Head title="Informasi Asrama - Admin - MAN TANJUNGPINANG" />

            <div className="p-4 sm:p-6 w-full space-y-6">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}

                {/* Header Actions */}
                <PageHeader
                    title="Profil Asrama"
                    description="Kelola artikel, kegiatan, dan fasilitas pengadaan asrama santri/siswa."
                    icon={Home}
                    action={
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#265243] hover:bg-[#1f4337] text-white font-semibold text-sm transition-all shadow-sm"
                        >
                            <Plus className="w-4 h-4" /> Tambah Konten Asrama
                        </button>
                    }
                />

                {/* Pengaturan Banner & Pengurus Asrama (2 Kotak Utama) */}
                <div className="bg-[#142921] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 border border-emerald-900/40 text-white">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                            <h3 className="text-lg font-black text-white tracking-tight">Pengaturan Header &amp; Pengurus Asrama</h3>
                            <p className="text-xs text-emerald-200/90 font-medium mt-0.5">Kelola foto pengurus, deskripsi asrama, serta link sosial media pengurus.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition-all shadow-md cursor-pointer border border-emerald-500/30"
                        >
                            {isSettingsOpen ? 'Tutup Form' : 'Edit Pengaturan Banner'}
                        </button>
                    </div>

                    {isSettingsOpen && (
                        <form onSubmit={handleSettingsSubmit} className="pt-4 border-t border-emerald-800/60 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Column 1: Pengurus Asrama (Foto & Identitas) */}
                                <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-slate-900">
                                    <h4 className="text-xs font-extrabold text-[#265243] uppercase tracking-wider border-b border-slate-100 pb-2">Kotak 1: Foto &amp; Identitas Pengurus</h4>
                                    
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Nama Pengasuh / Pengurus *</label>
                                        <input
                                            type="text"
                                            value={settingsData.dormitory_pengasuh_name}
                                            onChange={(e) => setSettingsData('dormitory_pengasuh_name', e.target.value)}
                                            className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#265243] focus:border-[#265243] focus:outline-none transition-all"
                                            placeholder="Misal: Ustadz & Ustadzah Pengasuh"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Jabatan / Subtitle Pengurus *</label>
                                        <input
                                            type="text"
                                            value={settingsData.dormitory_pengasuh_title}
                                            onChange={(e) => setSettingsData('dormitory_pengasuh_title', e.target.value)}
                                            className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#265243] focus:border-[#265243] focus:outline-none transition-all"
                                            placeholder="Misal: Tim Pembina Karakter & Tahfidz MAN"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Upload Foto Pengurus Asrama</label>
                                        {settings?.dormitory_pengasuh_photo_url && (
                                            <div className="mb-2 flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-200">
                                                <img src={settings.dormitory_pengasuh_photo_url} alt="Pengasuh" className="w-14 h-14 object-cover rounded-lg border border-slate-300 shadow-xs" />
                                                <span className="text-[11px] text-slate-600 font-semibold">Foto pengurus saat ini</span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setSettingsData('dormitory_pengasuh_photo', e.target.files?.[0] || null)}
                                            className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#265243] file:text-white hover:file:bg-[#1f4337] cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {/* Column 2: Penjelasan Asrama & Link Sosmed */}
                                <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-slate-900">
                                    <h4 className="text-xs font-extrabold text-[#265243] uppercase tracking-wider border-b border-slate-100 pb-2">Kotak 2: Penjelasan &amp; Link Kontak/Sosmed</h4>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Judul Penjelasan Asrama *</label>
                                        <input
                                            type="text"
                                            value={settingsData.dormitory_title}
                                            onChange={(e) => setSettingsData('dormitory_title', e.target.value)}
                                            className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#265243] focus:border-[#265243] focus:outline-none transition-all"
                                            placeholder="Misal: Lingkungan Hunian Islami, Disiplin, & Berprestasi"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Penjelasan Asrama *</label>
                                        <textarea
                                            rows={3}
                                            value={settingsData.dormitory_description}
                                            onChange={(e) => setSettingsData('dormitory_description', e.target.value)}
                                            className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#265243] focus:border-[#265243] focus:outline-none transition-all"
                                            placeholder="Penjelasan fasilitas dan pembiasaan asrama..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Link WA Pengurus Putra</label>
                                            <input
                                                type="text"
                                                value={settingsData.dormitory_wa_putra}
                                                onChange={(e) => setSettingsData('dormitory_wa_putra', e.target.value)}
                                                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#265243] focus:outline-none"
                                                placeholder="https://wa.me/628..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Link WA Pengurus Putri</label>
                                            <input
                                                type="text"
                                                value={settingsData.dormitory_wa_putri}
                                                onChange={(e) => setSettingsData('dormitory_wa_putri', e.target.value)}
                                                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#265243] focus:outline-none"
                                                placeholder="https://wa.me/628..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Link Instagram Asrama</label>
                                            <input
                                                type="text"
                                                value={settingsData.dormitory_instagram}
                                                onChange={(e) => setSettingsData('dormitory_instagram', e.target.value)}
                                                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#265243] focus:outline-none"
                                                placeholder="https://instagram.com/..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Link TikTok Asrama</label>
                                            <input
                                                type="text"
                                                value={settingsData.dormitory_tiktok}
                                                onChange={(e) => setSettingsData('dormitory_tiktok', e.target.value)}
                                                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#265243] focus:outline-none"
                                                placeholder="https://tiktok.com/@..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={processingSettings}
                                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
                                >
                                    Simpan Pengaturan Header Asrama
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#265243]" />
                        <input
                            type="text"
                            placeholder="Cari kegiatan/artikel asrama..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ backgroundColor: '#e4ebe2', color: '#1a3d31' }}
                            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-full border-none shadow-xs font-semibold placeholder:text-[#527365] focus:outline-none focus:ring-2 focus:ring-[#265243] focus:bg-white transition-all"
                        />
                    </div>
                    <button
                        type="submit"
                        style={{ backgroundColor: '#265243', color: '#ffffff' }}
                        className="px-5 py-2.5 rounded-full hover:bg-[#1f4337] text-xs font-bold transition-all shadow-xs"
                    >
                        Cari
                    </button>
                </form>

                {/* Table Data */}
                <div style={{ backgroundColor: '#e8efe5' }} className="rounded-2xl border-none overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead style={{ backgroundColor: '#265243', color: '#ffffff' }} className="text-xs font-extrabold uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 text-white">Dokumentasi</th>
                                    <th className="px-6 py-4 text-white">Judul Kegiatan / Artikel</th>
                                    <th className="px-6 py-4 text-white">Penulis</th>
                                    <th className="px-6 py-4 text-white">Tanggal Dibuat</th>
                                    <th className="px-6 py-4 text-right text-white">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#c8d6c0]">
                                {posts.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-[#4a6b5d] font-semibold">
                                            Belum ada konten asrama. Klik "Tambah Konten Asrama" untuk membuat.
                                        </td>
                                    </tr>
                                ) : (
                                    posts.data.map((item, idx) => (
                                        <tr
                                            key={item.id}
                                            style={{ backgroundColor: idx % 2 === 0 ? '#e8efe5' : '#e0e9dd' }}
                                            className="hover:bg-[#d6e2d3] transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                {item.media ? (
                                                    <img src={item.media} alt={item.title} className="w-14 h-10 object-cover rounded-lg border border-[#b8ceb0]" />
                                                ) : (
                                                    <div className="w-14 h-10 rounded-lg bg-[#dce8d7] flex items-center justify-center text-[#265243]">
                                                        <ImageIcon className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-[#142921] max-w-xs truncate">
                                                {item.title}
                                            </td>
                                            <td className="px-6 py-4 text-xs font-semibold text-[#2e5445]">
                                                {item.author?.name || 'Pengurus Asrama'}
                                            </td>
                                            <td className="px-6 py-4 text-xs font-semibold text-[#2e5445]">
                                                {new Date(item.created_at).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(item)}
                                                        className="p-1.5 rounded-lg text-[#265243] hover:text-[#142921] hover:bg-[#dce8d7] transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item)}
                                                        className="p-1.5 rounded-lg text-[#265243] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                                        title="Hapus"
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

                    <Pagination
                        links={posts.links}
                        from={(posts as any).from}
                        to={(posts as any).to}
                        total={(posts as any).total}
                        className="px-6 py-4 border-t border-[#c8d6c0]"
                    />
                </div>

                {/* Modal Create / Edit */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                                <h3 className="text-lg font-bold text-[#142921]">
                                    {editingItem ? 'Edit Konten Asrama' : 'Tambah Konten Asrama Baru'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {fileError && (
                                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        <span className="font-semibold">{fileError}</span>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Konten Asrama *</label>
                                    <input
                                        type="text"
                                        required
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        style={{ backgroundColor: '#f7faf5', borderColor: '#b8ceb0', color: '#142921' }}
                                        className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl border focus:ring-2 focus:ring-amber-500 focus:outline-none placeholder:text-[#527365]"
                                        placeholder="Misal: Kegiatan Pengajian Rutin Santri Asrama"
                                    />
                                    {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Isi Konten / Deskripsi *</label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        style={{ backgroundColor: '#f7faf5', borderColor: '#b8ceb0', color: '#142921' }}
                                        className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl border focus:ring-2 focus:ring-amber-500 focus:outline-none placeholder:text-[#527365]"
                                        placeholder="Tuliskan detail kegiatan asrama..."
                                    />
                                    {errors.content && <p className="text-xs text-rose-500 mt-1">{errors.content}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Foto/Media Dokumentasi (Maksimal 2MB)
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg,image/webp,video/mp4"
                                        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                                        className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#265243] file:text-white hover:file:bg-[#1f4337]"
                                    />
                                    <p className="text-[11px] text-slate-400 mt-1">Ukuran file maksimal adalah 2MB.</p>
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing || !!fileError}
                                        className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#265243] text-white hover:bg-[#1f4337] disabled:opacity-50"
                                    >
                                        {editingItem ? 'Simpan Perubahan' : 'Simpan Konten'}
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

DormitoryIndex.layout = {
    breadcrumbs: [{ title: 'Profil Asrama', href: '/admin/dormitory' }],
};
