import { Head, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    Edit3,
    Film,
    Filter,
    Image as ImageIcon,
    Plus,
    Search,
    Trash2,
    Video,
    X,
    Youtube,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';

interface GalleryItem {
    id: number;
    title: string;
    type: 'photo' | 'youtube';
    image_path: string | null;
    youtube_url: string | null;
    youtube_id: string | null;
    display_image: string | null;
    description: string | null;
    category: string | null;
    is_active: boolean;
    created_at: string;
}

interface Props {
    galleries: {
        data: GalleryItem[];
        links: any[];
        from?: number | null;
        to?: number | null;
        total?: number | null;
    };
    filters: {
        type?: string;
        search?: string;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function GalleryIndex({ galleries, filters, flash }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedType, setSelectedType] = useState(filters.type || '');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

    // Form state
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<{
        title: string;
        type: 'photo' | 'youtube';
        image: File | null;
        youtube_url: string;
        category: string;
        description: string;
        _method?: string;
    }>({
        title: '',
        type: 'photo',
        image: null,
        youtube_url: '',
        category: 'Kegiatan',
        description: '',
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const openModal = (item?: GalleryItem) => {
        clearErrors();
        if (item) {
            setEditingItem(item);
            setData({
                title: item.title,
                type: item.type,
                image: null,
                youtube_url: item.youtube_url || '',
                category: item.category || 'Kegiatan',
                description: item.description || '',
            });
            setImagePreview(item.display_image);
        } else {
            setEditingItem(null);
            reset();
            setImagePreview(null);
        }
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingItem(null);
        reset();
        setImagePreview(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (editingItem) {
            post(`/admin/gallery/${editingItem.id}`, {
                headers: { 'X-HTTP-Method-Override': 'PUT' },
                onSuccess: () => closeModal(),
            });
        } else {
            post('/admin/gallery', {
                onSuccess: () => closeModal(),
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
        confirmText: 'Ya, Hapus Media',
        onConfirm: () => {},
    });

    const handleDelete = (item: GalleryItem) => {
        setConfirmModal({
            isOpen: true,
            title: 'Hapus Media Galeri',
            description: `Apakah Anda yakin ingin menghapus media "${item.title}" dari galeri?`,
            confirmText: 'Ya, Hapus Media',
            onConfirm: () => {
                router.delete(`/admin/gallery/${item.id}`);
                setConfirmModal((prev) => ({ ...prev, isOpen: false }));
            },
        });
    };

    const handleToggleStatus = (id: number) => {
        router.patch(`/admin/gallery/${id}/toggle-status`);
    };

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get('/admin/gallery', { search, type: selectedType }, { preserveState: true });
    };

    const handleFilterType = (typeVal: string) => {
        setSelectedType(typeVal);
        router.get('/admin/gallery', { search, type: typeVal }, { preserveState: true });
    };

    return (
        <>
            <Head title="Galeri Foto & Video - Admin - MAN TANJUNGPINANG" />

            <div className="p-4 sm:p-6 w-full space-y-6">
                {flash?.success && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}

                {/* Header */}
                <PageHeader
                    title="Galeri Foto & Video"
                    description="Upload album foto dokumentasi kegiatan sekolah dan sematkan link video YouTube resmi."
                    icon={Film}
                    badge="Media Galeri"
                    action={
                        <button
                            onClick={() => openModal()}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#265243] text-white font-bold text-xs hover:bg-[#1f4337] transition-all shadow-xs"
                        >
                            <Plus className="w-4 h-4" /> Tambah Media Galeri
                        </button>
                    }
                />

                {/* Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    {/* Tabs filter */}
                    <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#e4ebe2] self-start shadow-xs">
                        <button
                            onClick={() => handleFilterType('')}
                            style={selectedType === '' ? { backgroundColor: '#265243', color: '#ffffff' } : { color: '#265243' }}
                            className="px-4 py-1.5 text-xs font-bold rounded-xl transition-all hover:bg-[#dce8d7]"
                        >
                            Semua Media
                        </button>
                        <button
                            onClick={() => handleFilterType('photo')}
                            style={selectedType === 'photo' ? { backgroundColor: '#265243', color: '#ffffff' } : { color: '#265243' }}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-xl transition-all hover:bg-[#dce8d7]"
                        >
                            <ImageIcon className="w-3.5 h-3.5" /> Foto Upload
                        </button>
                        <button
                            onClick={() => handleFilterType('youtube')}
                            style={selectedType === 'youtube' ? { backgroundColor: '#265243', color: '#ffffff' } : { color: '#265243' }}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-xl transition-all hover:bg-[#dce8d7]"
                        >
                            <Youtube className={`w-3.5 h-3.5 ${selectedType === 'youtube' ? 'text-white' : 'text-rose-600'}`} /> Video YouTube
                        </button>
                    </div>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex items-center gap-2">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#265243]" />
                            <input
                                type="text"
                                placeholder="Cari judul / kategori..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ backgroundColor: '#e4ebe2', color: '#142921' }}
                                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border-none shadow-xs font-semibold placeholder:text-[#527365] focus:outline-none focus:ring-2 focus:ring-[#265243] transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            style={{ backgroundColor: '#265243', color: '#ffffff' }}
                            className="px-5 py-2.5 rounded-xl hover:bg-[#1f4337] text-xs font-bold transition-all shadow-xs"
                        >
                            Cari
                        </button>
                    </form>
                </div>

                {/* Grid Galeri */}
                {galleries.data.length === 0 ? (
                    <div
                        style={{ backgroundColor: '#e8efe5' }}
                        className="p-12 text-center rounded-2xl border-none shadow-xs"
                    >
                        <Film className="w-12 h-12 text-[#265243]/40 mx-auto mb-3" />
                        <h3 className="text-sm font-bold text-[#142921]">Belum Ada Media Galeri</h3>
                        <p className="text-xs text-[#2e5445] mt-1 max-w-sm mx-auto font-medium">
                            Klik tombol &quot;Tambah Media Galeri&quot; di atas untuk mengunggah foto dokumentasi sekolah atau menyematkan link YouTube.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {galleries.data.map((item) => (
                            <div
                                key={item.id}
                                style={{ backgroundColor: '#e8efe5' }}
                                className={`group rounded-2xl border-none shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md hover:-translate-y-0.5 ${
                                    item.is_active ? '' : 'opacity-60'
                                }`}
                            >
                                {/* Media Preview / Thumbnail */}
                                <div style={{ backgroundColor: '#eef4eb' }} className="relative aspect-video overflow-hidden">
                                    {item.display_image ? (
                                        <img src={item.display_image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[#265243]/40">
                                            <ImageIcon className="w-8 h-8" />
                                        </div>
                                    )}

                                    {/* Type Tag Badge */}
                                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full backdrop-blur-md border shadow-xs flex items-center gap-1 text-white ${
                                            item.type === 'youtube'
                                                ? 'bg-rose-600/90 border-rose-400/30'
                                                : 'bg-[#265243]/90 border-emerald-400/30'
                                        }`}>
                                            {item.type === 'youtube' ? (
                                                <>
                                                    <Youtube className="w-3 h-3" /> YouTube Video
                                                </>
                                            ) : (
                                                <>
                                                    <ImageIcon className="w-3 h-3" /> Foto Upload
                                                </>
                                            )}
                                        </span>
                                    </div>

                                    {/* Play Overlay if Youtube */}
                                    {item.type === 'youtube' && item.youtube_url && (
                                        <a
                                            href={item.youtube_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="absolute inset-0 bg-slate-900/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg">
                                                <Video className="w-5 h-5 ml-0.5" />
                                            </div>
                                        </a>
                                    )}
                                </div>

                                {/* Details Body */}
                                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                                    <div>
                                        <div className="flex items-center justify-between gap-2 mb-1.5">
                                            <span style={{ backgroundColor: '#d0dfcb', color: '#142921' }} className="px-2 py-0.5 text-[10px] font-extrabold rounded-md">
                                                {item.category || 'Umum'}
                                            </span>
                                            <span className="text-[10px] text-[#527365] font-semibold">{item.created_at}</span>
                                        </div>
                                        <h4 className="text-sm font-extrabold text-[#142921] line-clamp-2 leading-snug">
                                            {item.title}
                                        </h4>
                                        {item.description && (
                                            <p className="text-xs text-[#2e5445] font-medium mt-1 line-clamp-2">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Action footer */}
                                    <div className="pt-2.5 border-t border-[#265243]/10 flex items-center justify-between text-xs">
                                        <button
                                            onClick={() => handleToggleStatus(item.id)}
                                            style={
                                                item.is_active
                                                    ? { backgroundColor: '#265243', color: '#ffffff' }
                                                    : { backgroundColor: '#dbe6d8', color: '#265243' }
                                            }
                                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border-none shadow-xs"
                                        >
                                            {item.is_active ? 'Tampil' : 'Sembunyi'}
                                        </button>

                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => openModal(item)}
                                                style={{ backgroundColor: '#dbe6d8', color: '#265243' }}
                                                className="p-1.5 rounded-lg border-none hover:bg-[#cfddcc] transition-all"
                                                title="Edit Media"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                            {item.youtube_url && (
                                                <a
                                                    href={item.youtube_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                                                    title="Tonton di YouTube"
                                                >
                                                    <Youtube className="w-3.5 h-3.5" />
                                                </a>
                                            )}
                                            <button
                                                onClick={() => handleDelete(item)}
                                                className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Pagination
                    links={galleries.links}
                    from={galleries.from}
                    to={galleries.to}
                    total={galleries.total}
                />
            </div>

            {/* Modal Tambah / Edit Galeri */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div style={{ backgroundColor: '#f7faf5', borderColor: '#b8ceb0' }} className="w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#b8ceb0]/40">
                            <h3 className="text-base font-bold text-[#142921] flex items-center gap-2">
                                <Film className="w-5 h-5 text-[#265243]" />
                                {editingItem ? 'Edit Media Galeri' : 'Tambah Media Galeri Baru'}
                            </h3>
                            <button onClick={closeModal} className="text-[#527365] hover:text-[#142921]">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Type Switcher */}
                            <div>
                                <label className="block text-xs font-semibold text-[#142921] mb-1.5">
                                    Tipe Media
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setData('type', 'photo')}
                                        style={data.type === 'photo' ? { backgroundColor: '#265243', borderColor: '#265243', color: '#ffffff' } : { backgroundColor: '#eef4eb', borderColor: '#b8ceb0', color: '#265243' }}
                                        className="flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl border transition-all hover:opacity-90 shadow-xs"
                                    >
                                        <ImageIcon className="w-4 h-4" /> Foto Upload
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData('type', 'youtube')}
                                        style={data.type === 'youtube' ? { backgroundColor: '#e11d48', borderColor: '#e11d48', color: '#ffffff' } : { backgroundColor: '#eef4eb', borderColor: '#b8ceb0', color: '#265243' }}
                                        className="flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl border transition-all hover:opacity-90 shadow-xs"
                                    >
                                        <Youtube className="w-4 h-4" /> Link Video YouTube
                                    </button>
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-xs font-semibold text-[#142921] mb-1">
                                    Judul Media / Kegiatan <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Upacara Bendera HUT RI / Profil Fasilitas Laboratorium"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    style={{ backgroundColor: '#ffffff', borderColor: '#b8ceb0', color: '#142921' }}
                                    className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#265243] placeholder:text-[#527365]"
                                    required
                                />
                                {errors.title && <p className="text-[11px] text-rose-500 mt-1">{errors.title}</p>}
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-xs font-semibold text-[#142921] mb-1">
                                    Kategori
                                </label>
                                <select
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    style={{ backgroundColor: '#ffffff', borderColor: '#b8ceb0', color: '#142921' }}
                                    className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#265243]"
                                >
                                    <option value="Kegiatan">Kegiatan Sekolah</option>
                                    <option value="Prestasi">Prestasi & Lomba</option>
                                    <option value="Fasilitas">Fasilitas & Gedung</option>
                                    <option value="Acara">Acara / Festival</option>
                                    <option value="Umum">Umum</option>
                                </select>
                            </div>

                            {/* Conditional Input: Photo upload OR YouTube link */}
                            {data.type === 'photo' ? (
                                <div>
                                    <label className="block text-xs font-semibold text-[#142921] mb-1">
                                        Upload File Foto {!editingItem && <span className="text-rose-500">*</span>}
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full text-xs text-[#2e5445] font-semibold file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#265243] file:text-white hover:file:bg-[#1f4337]"
                                    />
                                    {errors.image && <p className="text-[11px] text-rose-500 mt-1">{errors.image}</p>}
                                    {imagePreview && (
                                        <div className="mt-2.5 rounded-xl overflow-hidden border border-[#b8ceb0] max-h-40">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-xs font-semibold text-[#142921] mb-1">
                                        Link URL YouTube <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="Contoh: https://www.youtube.com/watch?v=dQw4w9WgXcQ atau https://youtu.be/..."
                                        value={data.youtube_url}
                                        onChange={(e) => setData('youtube_url', e.target.value)}
                                        style={{ backgroundColor: '#ffffff', borderColor: '#b8ceb0', color: '#142921' }}
                                        className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border focus:outline-none focus:ring-2 focus:ring-rose-500 placeholder:text-[#527365]"
                                        required
                                    />
                                    {errors.youtube_url && <p className="text-[11px] text-rose-500 mt-1">{errors.youtube_url}</p>}
                                </div>
                            )}

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-semibold text-[#142921] mb-1">
                                    Deskripsi Singkat (Opsional)
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Tuliskan keterangan singkat mengenai foto atau video ini..."
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    style={{ backgroundColor: '#ffffff', borderColor: '#b8ceb0', color: '#142921' }}
                                    className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#265243] placeholder:text-[#527365]"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#b8ceb0]/40">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    style={{ backgroundColor: '#eef4eb', borderColor: '#b8ceb0', color: '#265243' }}
                                    className="px-4 py-2 text-xs font-bold rounded-xl border hover:bg-[#dce8d7] transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 text-xs font-bold rounded-xl bg-[#265243] text-white hover:bg-[#1f4337] shadow-xs disabled:opacity-50 transition-all"
                                >
                                    {editingItem ? 'Simpan Perubahan' : 'Simpan Media'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Custom Confirm Modal */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div style={{ backgroundColor: '#f7faf5', borderColor: '#b8ceb0' }} className="w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden animate-in fade-in zoom-in duration-150">
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
                            <div className="flex items-center justify-center gap-3 pt-3 border-t border-[#b8ceb0]/40">
                                <button
                                    type="button"
                                    onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                                    style={{ backgroundColor: '#eef4eb', borderColor: '#b8ceb0', color: '#265243' }}
                                    className="px-5 py-2.5 text-xs font-bold rounded-xl border hover:bg-[#dce8d7] transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmModal.onConfirm}
                                    className="px-5 py-2.5 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-all"
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
