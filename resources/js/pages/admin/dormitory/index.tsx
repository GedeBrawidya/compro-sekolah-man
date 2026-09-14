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
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>()
        .props;
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<DormitoryItem | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);

    const {
        data: settingsData,
        setData: setSettingsData,
        post: postSettings,
        processing: processingSettings,
    } = useForm({
        dormitory_pengasuh_name:
            settings?.dormitory_pengasuh_name || 'Ustadz & Ustadzah Pengasuh',
        dormitory_pengasuh_title:
            settings?.dormitory_pengasuh_title ||
            'Tim Pembina Karakter & Tahfidz MAN',
        dormitory_title:
            settings?.dormitory_title ||
            'Lingkungan Hunian Islami, Disiplin, & Berprestasi',
        dormitory_description:
            settings?.dormitory_description ||
            "Asrama Ma'had MAN dirancang untuk membentuk karakter santri yang mandiri, berilmu, dan berakhlaqul karimah. Dilengkapi dengan program Tahfidzul Qur'an, kajian kitab kuning, bimbingan akademik intensif, serta pembiasaan kedisiplinan hidup sehari-hari di bawah pengawasan pengasuh berpengalaman.",
        dormitory_wa_putra:
            settings?.dormitory_wa_putra || 'https://wa.me/6281234567890',
        dormitory_wa_putri:
            settings?.dormitory_wa_putri || 'https://wa.me/6281234567891',
        dormitory_instagram:
            settings?.dormitory_instagram || 'https://instagram.com',
        dormitory_tiktok: settings?.dormitory_tiktok || 'https://tiktok.com',
        dormitory_pengasuh_photo: null as File | null,
    });

    const handleSettingsSubmit = (e: FormEvent) => {
        e.preventDefault();
        postSettings('/admin/dormitory/settings', {
            preserveScroll: true,
        });
    };

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm<{
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
            router.post(
                `/admin/dormitory/${editingItem.id}`,
                {
                    _method: 'PUT',
                    ...data,
                },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        reset();
                    },
                    onError: (errs) => {
                        if (errs.media) {
                            setFileError(errs.media);
                        }
                    },
                },
            );
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
                },
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

            <div className="w-full space-y-6 p-4 sm:p-6">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
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
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#265243] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#1f4337]"
                        >
                            <Plus className="h-4 w-4" /> Tambah Konten Asrama
                        </button>
                    }
                />

                {/* Pengaturan Banner & Pengurus Asrama (2 Kotak Utama) */}
                <div className="space-y-4 rounded-2xl border border-emerald-900/40 bg-[#142921] p-5 text-white shadow-xl sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h3 className="text-lg font-black tracking-tight text-white">
                                Pengaturan Header &amp; Pengurus Asrama
                            </h3>
                            <p className="mt-0.5 text-xs font-medium text-emerald-200/90">
                                Kelola foto pengurus, deskripsi asrama, serta
                                link sosial media pengurus.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                            className="cursor-pointer rounded-xl border border-emerald-500/30 bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white shadow-md transition-all hover:bg-emerald-500"
                        >
                            {isSettingsOpen
                                ? 'Tutup Form'
                                : 'Edit Pengaturan Banner'}
                        </button>
                    </div>

                    {isSettingsOpen && (
                        <form
                            onSubmit={handleSettingsSubmit}
                            className="space-y-5 border-t border-emerald-800/60 pt-4"
                        >
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                {/* Column 1: Pengurus Asrama (Foto & Identitas) */}
                                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
                                    <h4 className="border-b border-slate-100 pb-2 text-xs font-extrabold tracking-wider text-[#265243] uppercase">
                                        Kotak 1: Foto &amp; Identitas Pengurus
                                    </h4>

                                    <div>
                                        <label className="mb-1 block text-xs font-bold text-slate-700">
                                            Nama Pengasuh / Pengurus *
                                        </label>
                                        <input
                                            type="text"
                                            value={
                                                settingsData.dormitory_pengasuh_name
                                            }
                                            onChange={(e) =>
                                                setSettingsData(
                                                    'dormitory_pengasuh_name',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 transition-all placeholder:text-slate-400 focus:border-[#265243] focus:ring-2 focus:ring-[#265243] focus:outline-none"
                                            placeholder="Misal: Ustadz & Ustadzah Pengasuh"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-bold text-slate-700">
                                            Jabatan / Subtitle Pengurus *
                                        </label>
                                        <input
                                            type="text"
                                            value={
                                                settingsData.dormitory_pengasuh_title
                                            }
                                            onChange={(e) =>
                                                setSettingsData(
                                                    'dormitory_pengasuh_title',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 transition-all placeholder:text-slate-400 focus:border-[#265243] focus:ring-2 focus:ring-[#265243] focus:outline-none"
                                            placeholder="Misal: Tim Pembina Karakter & Tahfidz MAN"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-bold text-slate-700">
                                            Upload Foto Pengurus Asrama
                                        </label>
                                        {settings?.dormitory_pengasuh_photo_url && (
                                            <div className="mb-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-2">
                                                <img
                                                    src={
                                                        settings.dormitory_pengasuh_photo_url
                                                    }
                                                    alt="Pengasuh"
                                                    className="h-14 w-14 rounded-lg border border-slate-300 object-cover shadow-xs"
                                                />
                                                <span className="text-[11px] font-semibold text-slate-600">
                                                    Foto pengurus saat ini
                                                </span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setSettingsData(
                                                    'dormitory_pengasuh_photo',
                                                    e.target.files?.[0] || null,
                                                )
                                            }
                                            className="w-full cursor-pointer text-xs text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-[#265243] file:px-4 file:py-2 file:text-xs file:font-bold file:text-white hover:file:bg-[#1f4337]"
                                        />
                                    </div>
                                </div>

                                {/* Column 2: Penjelasan Asrama & Link Sosmed */}
                                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
                                    <h4 className="border-b border-slate-100 pb-2 text-xs font-extrabold tracking-wider text-[#265243] uppercase">
                                        Kotak 2: Penjelasan &amp; Link
                                        Kontak/Sosmed
                                    </h4>

                                    <div>
                                        <label className="mb-1 block text-xs font-bold text-slate-700">
                                            Judul Penjelasan Asrama *
                                        </label>
                                        <input
                                            type="text"
                                            value={settingsData.dormitory_title}
                                            onChange={(e) =>
                                                setSettingsData(
                                                    'dormitory_title',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 transition-all placeholder:text-slate-400 focus:border-[#265243] focus:ring-2 focus:ring-[#265243] focus:outline-none"
                                            placeholder="Misal: Lingkungan Hunian Islami, Disiplin, & Berprestasi"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-xs font-bold text-slate-700">
                                            Deskripsi Penjelasan Asrama *
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={
                                                settingsData.dormitory_description
                                            }
                                            onChange={(e) =>
                                                setSettingsData(
                                                    'dormitory_description',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 transition-all placeholder:text-slate-400 focus:border-[#265243] focus:ring-2 focus:ring-[#265243] focus:outline-none"
                                            placeholder="Penjelasan fasilitas dan pembiasaan asrama..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-1 block text-[11px] font-bold text-slate-700">
                                                Link WA Pengurus Putra
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    settingsData.dormitory_wa_putra
                                                }
                                                onChange={(e) =>
                                                    setSettingsData(
                                                        'dormitory_wa_putra',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#265243] focus:outline-none"
                                                placeholder="https://wa.me/628..."
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-[11px] font-bold text-slate-700">
                                                Link WA Pengurus Putri
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    settingsData.dormitory_wa_putri
                                                }
                                                onChange={(e) =>
                                                    setSettingsData(
                                                        'dormitory_wa_putri',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#265243] focus:outline-none"
                                                placeholder="https://wa.me/628..."
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-[11px] font-bold text-slate-700">
                                                Link Instagram Asrama
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    settingsData.dormitory_instagram
                                                }
                                                onChange={(e) =>
                                                    setSettingsData(
                                                        'dormitory_instagram',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#265243] focus:outline-none"
                                                placeholder="https://instagram.com/..."
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-[11px] font-bold text-slate-700">
                                                Link TikTok Asrama
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    settingsData.dormitory_tiktok
                                                }
                                                onChange={(e) =>
                                                    setSettingsData(
                                                        'dormitory_tiktok',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#265243] focus:outline-none"
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
                                    className="cursor-pointer rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-extrabold text-white shadow-md transition-all hover:bg-amber-600 disabled:opacity-50"
                                >
                                    Simpan Pengaturan Header Asrama
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Search Bar */}
                <form
                    onSubmit={handleSearch}
                    className="flex items-center gap-2"
                >
                    <div className="relative max-w-md flex-1">
                        <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#265243]" />
                        <input
                            type="text"
                            placeholder="Cari kegiatan/artikel asrama..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                backgroundColor: '#e4ebe2',
                                color: '#1a3d31',
                            }}
                            className="w-full rounded-full border-none py-2.5 pr-4 pl-10 text-xs font-semibold shadow-xs transition-all placeholder:text-[#527365] focus:bg-white focus:ring-2 focus:ring-[#265243] focus:outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        style={{ backgroundColor: '#265243', color: '#ffffff' }}
                        className="rounded-full px-5 py-2.5 text-xs font-bold shadow-xs transition-all hover:bg-[#1f4337]"
                    >
                        Cari
                    </button>
                </form>

                {/* Table Data */}
                <div
                    style={{ backgroundColor: '#e8efe5' }}
                    className="overflow-hidden rounded-2xl border-none shadow-sm"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead
                                style={{
                                    backgroundColor: '#265243',
                                    color: '#ffffff',
                                }}
                                className="text-xs font-extrabold tracking-wider uppercase"
                            >
                                <tr>
                                    <th className="px-6 py-4 text-white">
                                        Dokumentasi
                                    </th>
                                    <th className="px-6 py-4 text-white">
                                        Judul Kegiatan / Artikel
                                    </th>
                                    <th className="px-6 py-4 text-white">
                                        Penulis
                                    </th>
                                    <th className="px-6 py-4 text-white">
                                        Tanggal Dibuat
                                    </th>
                                    <th className="px-6 py-4 text-right text-white">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#c8d6c0]">
                                {posts.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-12 text-center font-semibold text-[#4a6b5d]"
                                        >
                                            Belum ada konten asrama. Klik
                                            "Tambah Konten Asrama" untuk
                                            membuat.
                                        </td>
                                    </tr>
                                ) : (
                                    posts.data.map((item, idx) => (
                                        <tr
                                            key={item.id}
                                            style={{
                                                backgroundColor:
                                                    idx % 2 === 0
                                                        ? '#e8efe5'
                                                        : '#e0e9dd',
                                            }}
                                            className="transition-colors hover:bg-[#d6e2d3]"
                                        >
                                            <td className="px-6 py-4">
                                                {item.media ? (
                                                    <img
                                                        src={item.media}
                                                        alt={item.title}
                                                        className="h-10 w-14 rounded-lg border border-[#b8ceb0] object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-[#dce8d7] text-[#265243]">
                                                        <ImageIcon className="h-5 w-5" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="max-w-xs truncate px-6 py-4 font-bold text-[#142921]">
                                                {item.title}
                                            </td>
                                            <td className="px-6 py-4 text-xs font-semibold text-[#2e5445]">
                                                {item.author?.name ||
                                                    'Pengurus Asrama'}
                                            </td>
                                            <td className="px-6 py-4 text-xs font-semibold text-[#2e5445]">
                                                {new Date(
                                                    item.created_at,
                                                ).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() =>
                                                            openEditModal(item)
                                                        }
                                                        className="rounded-lg p-1.5 text-[#265243] transition-colors hover:bg-[#dce8d7] hover:text-[#142921]"
                                                        title="Edit"
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(item)
                                                        }
                                                        className="rounded-lg p-1.5 text-[#265243] transition-colors hover:bg-rose-50 hover:text-rose-600"
                                                        title="Hapus"
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

                    <Pagination
                        links={posts.links}
                        from={(posts as any).from}
                        to={(posts as any).to}
                        total={(posts as any).total}
                        className="border-t border-[#c8d6c0] px-6 py-4"
                    />
                </div>

                {/* Modal Create / Edit */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                            <div className="flex items-center justify-between border-b border-slate-100 p-6">
                                <h3 className="text-lg font-bold text-[#142921]">
                                    {editingItem
                                        ? 'Edit Konten Asrama'
                                        : 'Tambah Konten Asrama Baru'}
                                </h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4 p-6"
                            >
                                {fileError && (
                                    <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
                                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                        <span className="font-semibold">
                                            {fileError}
                                        </span>
                                    </div>
                                )}

                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                                        Judul Konten Asrama *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.title}
                                        onChange={(e) =>
                                            setData('title', e.target.value)
                                        }
                                        style={{
                                            backgroundColor: '#f7faf5',
                                            borderColor: '#b8ceb0',
                                            color: '#142921',
                                        }}
                                        className="w-full rounded-xl border px-4 py-2.5 text-xs font-semibold placeholder:text-[#527365] focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                        placeholder="Misal: Kegiatan Pengajian Rutin Santri Asrama"
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-xs text-rose-500">
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                                        Isi Konten / Deskripsi *
                                    </label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={data.content}
                                        onChange={(e) =>
                                            setData('content', e.target.value)
                                        }
                                        style={{
                                            backgroundColor: '#f7faf5',
                                            borderColor: '#b8ceb0',
                                            color: '#142921',
                                        }}
                                        className="w-full rounded-xl border px-4 py-2.5 text-xs font-semibold placeholder:text-[#527365] focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                        placeholder="Tuliskan detail kegiatan asrama..."
                                    />
                                    {errors.content && (
                                        <p className="mt-1 text-xs text-rose-500">
                                            {errors.content}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                                        Foto/Media Dokumentasi (Maksimal 2MB)
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg,image/webp,video/mp4"
                                        onChange={(e) =>
                                            handleFileChange(
                                                e.target.files?.[0] || null,
                                            )
                                        }
                                        className="w-full text-xs text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-[#265243] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-[#1f4337]"
                                    />
                                    <p className="mt-1 text-[11px] text-slate-400">
                                        Ukuran file maksimal adalah 2MB.
                                    </p>
                                </div>

                                <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing || !!fileError}
                                        className="rounded-xl bg-[#265243] px-5 py-2 text-xs font-semibold text-white hover:bg-[#1f4337] disabled:opacity-50"
                                    >
                                        {editingItem
                                            ? 'Simpan Perubahan'
                                            : 'Simpan Konten'}
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
                                        className="rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-rose-700"
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
