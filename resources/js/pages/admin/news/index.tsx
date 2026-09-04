import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    Edit3,
    Image as ImageIcon,
    Plus,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { FormEvent, useState } from 'react';

interface NewsItem {
    id: number;
    title: string;
    slug: string;
    content: string;
    thumbnail: string | null;
    status: 'draft' | 'published';
    published_at: string | null;
    created_at: string;
    author?: { id: number; name: string };
}

interface Props {
    news: {
        data: NewsItem[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
    };
}

export default function NewsIndex({ news, filters }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<{
        title: string;
        content: string;
        thumbnail: File | null;
        status: 'draft' | 'published';
    }>({
        title: '',
        content: '',
        thumbnail: null,
        status: 'published',
    });

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get('/admin/news', { search }, { preserveState: true });
    };

    const openCreateModal = () => {
        setEditingItem(null);
        reset();
        clearErrors();
        setFileError(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: NewsItem) => {
        setEditingItem(item);
        setData({
            title: item.title,
            content: item.content,
            thumbnail: null,
            status: item.status,
        });
        clearErrors();
        setFileError(null);
        setIsModalOpen(true);
    };

    const handleFileChange = (file: File | null) => {
        setFileError(null);
        if (file) {
            // Client-side 2MB file size validation (FR-4.2)
            if (file.size > 2 * 1024 * 1024) {
                setFileError('Ukuran file maksimal adalah 2MB.');
                setData('thumbnail', null);
                return;
            }
        }
        setData('thumbnail', file);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (fileError) return;

        if (editingItem) {
            // FormData update via post with _method spoofing for multipart file upload in Laravel
            router.post(`/admin/news/${editingItem.id}`, {
                _method: 'PUT',
                ...data,
            }, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
                onError: (errs) => {
                    if (errs.thumbnail) {
                        setFileError(errs.thumbnail);
                    }
                }
            });
        } else {
            post('/admin/news', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
                onError: (errs) => {
                    if (errs.thumbnail) {
                        setFileError(errs.thumbnail);
                    }
                }
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
            router.delete(`/admin/news/${id}`);
        }
    };

    return (
        <>
            <Head title="Kelola Berita & Galeri - Admin" />

            <div className="p-4 sm:p-6 w-full space-y-6">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}

                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Update Berita & Galeri</h1>
                        <p className="text-sm text-slate-500">Publikasikan berita terbaru dan galeri foto ke halaman publik sekolah.</p>
                    </div>

                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#265243] hover:bg-[#1f4337] text-white font-medium text-sm transition-all shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> Publish Berita Baru
                    </button>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari judul berita..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button type="submit" className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-200">
                        Cari
                    </button>
                </form>

                {/* Table Data */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-4">Thumbnail</th>
                                    <th className="px-6 py-4">Judul Berita</th>
                                    <th className="px-6 py-4">Penulis</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Tanggal Publish</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {news.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                            Belum ada data berita. Klik "Publish Berita Baru" untuk menambahkan.
                                        </td>
                                    </tr>
                                ) : (
                                    news.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                            <td className="px-6 py-4">
                                                {item.thumbnail ? (
                                                    <img src={item.thumbnail} alt={item.title} className="w-14 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-700" />
                                                ) : (
                                                    <div className="w-14 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                        <ImageIcon className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white max-w-xs truncate">
                                                {item.title}
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-500">
                                                {item.author?.name || 'Admin'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1.5 rounded-md text-xs font-bold shadow-sm ${
                                                    item.status === 'published'
                                                        ? 'bg-[#265243] text-white'
                                                        : 'bg-slate-500 text-white'
                                                }`}>
                                                    {item.status === 'published' ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-500">
                                                {item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID') : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(item)}
                                                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                                        title="Edit"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30"
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
                </div>

                {/* Modal Create / Edit */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    {editingItem ? 'Edit Berita' : 'Tambah Berita Baru'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {/* Error Alert for File Size (FR-4.2) */}
                                {fileError && (
                                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        <span className="font-semibold">{fileError}</span>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Judul Berita *</label>
                                    <input
                                        type="text"
                                        required
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        placeholder="Masukkan judul berita"
                                    />
                                    {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Isi Berita *</label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        placeholder="Tuliskan isi berita di sini..."
                                    />
                                    {errors.content && <p className="text-xs text-rose-500 mt-1">{errors.content}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Thumbnail (Maksimal 2MB)
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg,image/webp"
                                        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                                        className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    <p className="text-[11px] text-slate-400 mt-1">Format: JPG, PNG, WEBP. Ukuran file maksimal adalah 2MB.</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Status Publikasi</label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value as any)}
                                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                    >
                                        <option value="published">Publish Langsung</option>
                                        <option value="draft">Simpan Draf</option>
                                    </select>
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing || !!fileError}
                                        className="px-5 py-2 text-sm font-semibold rounded-xl bg-[#265243] text-white hover:bg-[#1f4337] disabled:opacity-50"
                                    >
                                        {editingItem ? 'Simpan Perubahan' : 'Publish Sekarang'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

NewsIndex.layout = {
    breadcrumbs: [{ title: 'Berita & Galeri', href: '/admin/news' }],
};
