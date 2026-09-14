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
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm<{
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
        router.get(
            '/admin/gallery',
            { search, type: selectedType },
            { preserveState: true },
        );
    };

    const handleFilterType = (typeVal: string) => {
        setSelectedType(typeVal);
        router.get(
            '/admin/gallery',
            { search, type: typeVal },
            { preserveState: true },
        );
    };

    return (
        <>
            <Head title="Galeri Foto & Video - Admin - MAN TANJUNGPINANG" />

            <div className="w-full space-y-6 p-4 sm:p-6">
                {flash?.success && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-600">
                        <CheckCircle2 className="h-5 w-5 shrink-0" />
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
                            className="inline-flex items-center gap-2 rounded-xl bg-[#265243] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#1f4337]"
                        >
                            <Plus className="h-4 w-4" /> Tambah Media Galeri
                        </button>
                    }
                />

                {/* Filter & Search Bar */}
                <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
                    {/* Tabs filter */}
                    <div className="flex items-center gap-1.5 self-start rounded-2xl bg-[#e4ebe2] p-1.5 shadow-xs">
                        <button
                            onClick={() => handleFilterType('')}
                            style={
                                selectedType === ''
                                    ? {
                                          backgroundColor: '#265243',
                                          color: '#ffffff',
                                      }
                                    : { color: '#265243' }
                            }
                            className="rounded-xl px-4 py-1.5 text-xs font-bold transition-all hover:bg-[#dce8d7]"
                        >
                            Semua Media
                        </button>
                        <button
                            onClick={() => handleFilterType('photo')}
                            style={
                                selectedType === 'photo'
                                    ? {
                                          backgroundColor: '#265243',
                                          color: '#ffffff',
                                      }
                                    : { color: '#265243' }
                            }
                            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-bold transition-all hover:bg-[#dce8d7]"
                        >
                            <ImageIcon className="h-3.5 w-3.5" /> Foto Upload
                        </button>
                        <button
                            onClick={() => handleFilterType('youtube')}
                            style={
                                selectedType === 'youtube'
                                    ? {
                                          backgroundColor: '#265243',
                                          color: '#ffffff',
                                      }
                                    : { color: '#265243' }
                            }
                            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-bold transition-all hover:bg-[#dce8d7]"
                        >
                            <Youtube
                                className={`h-3.5 w-3.5 ${selectedType === 'youtube' ? 'text-white' : 'text-rose-600'}`}
                            />{' '}
                            Video YouTube
                        </button>
                    </div>

                    {/* Search */}
                    <form
                        onSubmit={handleSearch}
                        className="flex items-center gap-2"
                    >
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#265243]" />
                            <input
                                type="text"
                                placeholder="Cari judul / kategori..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{
                                    backgroundColor: '#e4ebe2',
                                    color: '#142921',
                                }}
                                className="w-full rounded-xl border-none py-2.5 pr-4 pl-10 text-xs font-semibold shadow-xs transition-all placeholder:text-[#527365] focus:ring-2 focus:ring-[#265243] focus:outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            style={{
                                backgroundColor: '#265243',
                                color: '#ffffff',
                            }}
                            className="rounded-xl px-5 py-2.5 text-xs font-bold shadow-xs transition-all hover:bg-[#1f4337]"
                        >
                            Cari
                        </button>
                    </form>
                </div>

                {/* Grid Galeri */}
                {galleries.data.length === 0 ? (
                    <div
                        style={{ backgroundColor: '#e8efe5' }}
                        className="rounded-2xl border-none p-12 text-center shadow-xs"
                    >
                        <Film className="mx-auto mb-3 h-12 w-12 text-[#265243]/40" />
                        <h3 className="text-sm font-bold text-[#142921]">
                            Belum Ada Media Galeri
                        </h3>
                        <p className="mx-auto mt-1 max-w-sm text-xs font-medium text-[#2e5445]">
                            Klik tombol &quot;Tambah Media Galeri&quot; di atas
                            untuk mengunggah foto dokumentasi sekolah atau
                            menyematkan link YouTube.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {galleries.data.map((item) => (
                            <div
                                key={item.id}
                                style={{ backgroundColor: '#e8efe5' }}
                                className={`group flex flex-col overflow-hidden rounded-2xl border-none shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                                    item.is_active ? '' : 'opacity-60'
                                }`}
                            >
                                {/* Media Preview / Thumbnail */}
                                <div
                                    style={{ backgroundColor: '#eef4eb' }}
                                    className="relative aspect-video overflow-hidden"
                                >
                                    {item.display_image ? (
                                        <img
                                            src={item.display_image}
                                            alt={item.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-[#265243]/40">
                                            <ImageIcon className="h-8 w-8" />
                                        </div>
                                    )}

                                    {/* Type Tag Badge */}
                                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                                        <span
                                            className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs backdrop-blur-md ${
                                                item.type === 'youtube'
                                                    ? 'border-rose-400/30 bg-rose-600/90'
                                                    : 'border-emerald-400/30 bg-[#265243]/90'
                                            }`}
                                        >
                                            {item.type === 'youtube' ? (
                                                <>
                                                    <Youtube className="h-3 w-3" />{' '}
                                                    YouTube Video
                                                </>
                                            ) : (
                                                <>
                                                    <ImageIcon className="h-3 w-3" />{' '}
                                                    Foto Upload
                                                </>
                                            )}
                                        </span>
                                    </div>

                                    {/* Play Overlay if Youtube */}
                                    {item.type === 'youtube' &&
                                        item.youtube_url && (
                                            <a
                                                href={item.youtube_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="absolute inset-0 flex items-center justify-center bg-slate-900/30 opacity-0 transition-opacity group-hover:opacity-100"
                                            >
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg">
                                                    <Video className="ml-0.5 h-5 w-5" />
                                                </div>
                                            </a>
                                        )}
                                </div>

                                {/* Details Body */}
                                <div className="flex flex-1 flex-col justify-between space-y-3 p-4">
                                    <div>
                                        <div className="mb-1.5 flex items-center justify-between gap-2">
                                            <span
                                                style={{
                                                    backgroundColor: '#d0dfcb',
                                                    color: '#142921',
                                                }}
                                                className="rounded-md px-2 py-0.5 text-[10px] font-extrabold"
                                            >
                                                {item.category || 'Umum'}
                                            </span>
                                            <span className="text-[10px] font-semibold text-[#527365]">
                                                {item.created_at}
                                            </span>
                                        </div>
                                        <h4 className="line-clamp-2 text-sm leading-snug font-extrabold text-[#142921]">
                                            {item.title}
                                        </h4>
                                        {item.description && (
                                            <p className="mt-1 line-clamp-2 text-xs font-medium text-[#2e5445]">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Action footer */}
                                    <div className="flex items-center justify-between border-t border-[#265243]/10 pt-2.5 text-xs">
                                        <button
                                            onClick={() =>
                                                handleToggleStatus(item.id)
                                            }
                                            style={
                                                item.is_active
                                                    ? {
                                                          backgroundColor:
                                                              '#265243',
                                                          color: '#ffffff',
                                                      }
                                                    : {
                                                          backgroundColor:
                                                              '#dbe6d8',
                                                          color: '#265243',
                                                      }
                                            }
                                            className="rounded-lg border-none px-2.5 py-1 text-[11px] font-bold shadow-xs transition-all"
                                        >
                                            {item.is_active
                                                ? 'Tampil'
                                                : 'Sembunyi'}
                                        </button>

                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => openModal(item)}
                                                style={{
                                                    backgroundColor: '#dbe6d8',
                                                    color: '#265243',
                                                }}
                                                className="rounded-lg border-none p-1.5 transition-all hover:bg-[#cfddcc]"
                                                title="Edit Media"
                                            >
                                                <Edit3 className="h-3.5 w-3.5" />
                                            </button>
                                            {item.youtube_url && (
                                                <a
                                                    href={item.youtube_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="rounded-lg border border-rose-200 bg-rose-50 p-1.5 text-rose-600 transition-colors hover:bg-rose-100"
                                                    title="Tonton di YouTube"
                                                >
                                                    <Youtube className="h-3.5 w-3.5" />
                                                </a>
                                            )}
                                            <button
                                                onClick={() =>
                                                    handleDelete(item)
                                                }
                                                className="rounded-lg border border-rose-200 bg-rose-50 p-1.5 text-rose-600 transition-colors hover:bg-rose-100"
                                                title="Hapus"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                    <div
                        style={{
                            backgroundColor: '#f7faf5',
                            borderColor: '#b8ceb0',
                        }}
                        className="w-full max-w-lg overflow-hidden rounded-2xl border shadow-2xl"
                    >
                        <div className="flex items-center justify-between border-b border-[#b8ceb0]/40 px-6 py-4">
                            <h3 className="flex items-center gap-2 text-base font-bold text-[#142921]">
                                <Film className="h-5 w-5 text-[#265243]" />
                                {editingItem
                                    ? 'Edit Media Galeri'
                                    : 'Tambah Media Galeri Baru'}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-[#527365] hover:text-[#142921]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 p-6">
                            {/* Type Switcher */}
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-[#142921]">
                                    Tipe Media
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setData('type', 'photo')}
                                        style={
                                            data.type === 'photo'
                                                ? {
                                                      backgroundColor:
                                                          '#265243',
                                                      borderColor: '#265243',
                                                      color: '#ffffff',
                                                  }
                                                : {
                                                      backgroundColor:
                                                          '#eef4eb',
                                                      borderColor: '#b8ceb0',
                                                      color: '#265243',
                                                  }
                                        }
                                        className="flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold shadow-xs transition-all hover:opacity-90"
                                    >
                                        <ImageIcon className="h-4 w-4" /> Foto
                                        Upload
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setData('type', 'youtube')
                                        }
                                        style={
                                            data.type === 'youtube'
                                                ? {
                                                      backgroundColor:
                                                          '#e11d48',
                                                      borderColor: '#e11d48',
                                                      color: '#ffffff',
                                                  }
                                                : {
                                                      backgroundColor:
                                                          '#eef4eb',
                                                      borderColor: '#b8ceb0',
                                                      color: '#265243',
                                                  }
                                        }
                                        className="flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold shadow-xs transition-all hover:opacity-90"
                                    >
                                        <Youtube className="h-4 w-4" /> Link
                                        Video YouTube
                                    </button>
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-[#142921]">
                                    Judul Media / Kegiatan{' '}
                                    <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Upacara Bendera HUT RI / Profil Fasilitas Laboratorium"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    style={{
                                        backgroundColor: '#ffffff',
                                        borderColor: '#b8ceb0',
                                        color: '#142921',
                                    }}
                                    className="w-full rounded-xl border px-3.5 py-2 text-xs font-semibold placeholder:text-[#527365] focus:ring-2 focus:ring-[#265243] focus:outline-none"
                                    required
                                />
                                {errors.title && (
                                    <p className="mt-1 text-[11px] text-rose-500">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Category */}
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-[#142921]">
                                    Kategori
                                </label>
                                <select
                                    value={data.category}
                                    onChange={(e) =>
                                        setData('category', e.target.value)
                                    }
                                    style={{
                                        backgroundColor: '#ffffff',
                                        borderColor: '#b8ceb0',
                                        color: '#142921',
                                    }}
                                    className="w-full rounded-xl border px-3.5 py-2 text-xs font-semibold focus:ring-2 focus:ring-[#265243] focus:outline-none"
                                >
                                    <option value="Kegiatan">
                                        Kegiatan Sekolah
                                    </option>
                                    <option value="Prestasi">
                                        Prestasi & Lomba
                                    </option>
                                    <option value="Fasilitas">
                                        Fasilitas & Gedung
                                    </option>
                                    <option value="Acara">
                                        Acara / Festival
                                    </option>
                                    <option value="Umum">Umum</option>
                                </select>
                            </div>

                            {/* Conditional Input: Photo upload OR YouTube link */}
                            {data.type === 'photo' ? (
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-[#142921]">
                                        Upload File Foto{' '}
                                        {!editingItem && (
                                            <span className="text-rose-500">
                                                *
                                            </span>
                                        )}
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full text-xs font-semibold text-[#2e5445] file:mr-4 file:rounded-xl file:border-0 file:bg-[#265243] file:px-4 file:py-2 file:text-xs file:font-bold file:text-white hover:file:bg-[#1f4337]"
                                    />
                                    {errors.image && (
                                        <p className="mt-1 text-[11px] text-rose-500">
                                            {errors.image}
                                        </p>
                                    )}
                                    {imagePreview && (
                                        <div className="mt-2.5 max-h-40 overflow-hidden rounded-xl border border-[#b8ceb0]">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-[#142921]">
                                        Link URL YouTube{' '}
                                        <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="Contoh: https://www.youtube.com/watch?v=dQw4w9WgXcQ atau https://youtu.be/..."
                                        value={data.youtube_url}
                                        onChange={(e) =>
                                            setData(
                                                'youtube_url',
                                                e.target.value,
                                            )
                                        }
                                        style={{
                                            backgroundColor: '#ffffff',
                                            borderColor: '#b8ceb0',
                                            color: '#142921',
                                        }}
                                        className="w-full rounded-xl border px-3.5 py-2 text-xs font-semibold placeholder:text-[#527365] focus:ring-2 focus:ring-rose-500 focus:outline-none"
                                        required
                                    />
                                    {errors.youtube_url && (
                                        <p className="mt-1 text-[11px] text-rose-500">
                                            {errors.youtube_url}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Description */}
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-[#142921]">
                                    Deskripsi Singkat (Opsional)
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Tuliskan keterangan singkat mengenai foto atau video ini..."
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    style={{
                                        backgroundColor: '#ffffff',
                                        borderColor: '#b8ceb0',
                                        color: '#142921',
                                    }}
                                    className="w-full rounded-xl border px-3.5 py-2 text-xs font-semibold placeholder:text-[#527365] focus:ring-2 focus:ring-[#265243] focus:outline-none"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center justify-end gap-2 border-t border-[#b8ceb0]/40 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    style={{
                                        backgroundColor: '#eef4eb',
                                        borderColor: '#b8ceb0',
                                        color: '#265243',
                                    }}
                                    className="rounded-xl border px-4 py-2 text-xs font-bold transition-all hover:bg-[#dce8d7]"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-[#265243] px-5 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#1f4337] disabled:opacity-50"
                                >
                                    {editingItem
                                        ? 'Simpan Perubahan'
                                        : 'Simpan Media'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Custom Confirm Modal */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                    <div
                        style={{
                            backgroundColor: '#f7faf5',
                            borderColor: '#b8ceb0',
                        }}
                        className="animate-in fade-in zoom-in w-full max-w-md overflow-hidden rounded-2xl border shadow-2xl duration-150"
                    >
                        <div className="space-y-4 p-6 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                                <Trash2 className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold text-[#142921]">
                                    {confirmModal.title}
                                </h3>
                                <p className="mt-1 text-xs leading-relaxed font-semibold text-[#2e5445]">
                                    {confirmModal.description}
                                </p>
                            </div>
                            <div className="flex items-center justify-center gap-3 border-t border-[#b8ceb0]/40 pt-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setConfirmModal((prev) => ({
                                            ...prev,
                                            isOpen: false,
                                        }))
                                    }
                                    style={{
                                        backgroundColor: '#eef4eb',
                                        borderColor: '#b8ceb0',
                                        color: '#265243',
                                    }}
                                    className="rounded-xl border px-5 py-2.5 text-xs font-bold transition-all hover:bg-[#dce8d7]"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmModal.onConfirm}
                                    className="rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-rose-700"
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
