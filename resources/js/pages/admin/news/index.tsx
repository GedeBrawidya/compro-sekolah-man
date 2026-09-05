import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    Edit3,
    Image as ImageIcon,
    Newspaper,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';

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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/news', { search }, { preserveState: true });
    };

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: '',
        description: '',
        onConfirm: () => {},
    });

    const handleDelete = (item: NewsItem) => {
        setConfirmModal({
            isOpen: true,
            title: 'Hapus Berita Sekolah',
            description: `Apakah Anda yakin ingin menghapus artikel berita "${item.title}"? Tindakan ini akan menghapus data secara permanen.`,
            onConfirm: () => {
                router.delete(`/admin/news/${item.id}`, {
                    onFinish: () => setConfirmModal((prev) => ({ ...prev, isOpen: false })),
                });
            },
        });
    };

    return (
        <>
            <Head title="Berita Sekolah - Admin - MAN TANJUNG PINANG" />

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
                    title="Berita Sekolah"
                    description="Publikasikan artikel berita terbaru dan pengumuman ke halaman publik sekolah."
                    icon={Newspaper}
                    badge="Manajemen Artikel"
                    action={
                        <Link
                            href="/admin/news/create"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#265243] font-bold text-sm hover:bg-slate-100 transition-all shadow-sm"
                        >
                            <Plus className="w-4 h-4" /> Tulis Berita Baru
                        </Link>
                    }
                />

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#265243]" />
                        <input
                            type="text"
                            placeholder="Cari judul berita..."
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
                                    <th className="px-6 py-4 text-white">Thumbnail</th>
                                    <th className="px-6 py-4 text-white">Judul Berita</th>
                                    <th className="px-6 py-4 text-white">Penulis</th>
                                    <th className="px-6 py-4 text-white">Status</th>
                                    <th className="px-6 py-4 text-white">Tanggal Publish</th>
                                    <th className="px-6 py-4 text-right text-white">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#265243]/10">
                                {news.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-[#4a6b5d] font-semibold">
                                            Belum ada data berita. Klik "Publish Berita Baru" untuk menambahkan.
                                        </td>
                                    </tr>
                                ) : (
                                    news.data.map((item, idx) => (
                                        <tr
                                            key={item.id}
                                            style={{ backgroundColor: idx % 2 === 0 ? '#e8efe5' : '#e0e9dd' }}
                                            className="hover:bg-[#d6e4d4] transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                {item.thumbnail ? (
                                                    <img src={item.thumbnail} alt={item.title} className="w-14 h-10 object-cover rounded-lg border border-[#b8ceb0]" />
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
                                            <td className="px-6 py-4 text-xs font-semibold text-[#2e5445]">
                                                {item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID') : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/news/${item.id}/edit`}
                                                        className="p-1.5 rounded-lg text-[#265243] hover:text-[#142921] hover:bg-[#dce8d7] transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </Link>
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
                        links={news.links}
                        from={(news as any).from}
                        to={(news as any).to}
                        total={(news as any).total}
                        className="px-6 py-4 border-t border-[#c8d6c0]"
                    />
                </div>

                {/* ── MODAL KONFIRMASI HAPUS BERITA ── */}
                {confirmModal.isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
                        <div
                            style={{ backgroundColor: '#ffffff', borderColor: '#b8ceb0' }}
                            className="w-full max-w-md rounded-2xl shadow-2xl border p-6 text-center space-y-5"
                        >
                            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                                <Trash2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-base font-extrabold text-[#142921]">
                                    {confirmModal.title}
                                </h3>
                                <p className="text-xs font-semibold text-[#2e5445] mt-1.5 leading-relaxed">
                                    {confirmModal.description}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                                    style={{ backgroundColor: '#eef4eb', color: '#142921', borderColor: '#b8ceb0' }}
                                    className="flex-1 py-2.5 rounded-xl border text-xs font-extrabold hover:bg-[#dce8d7] transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmModal.onConfirm}
                                    className="flex-1 py-2.5 rounded-xl text-xs font-extrabold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-all"
                                >
                                    Ya, Hapus
                                </button>
                            </div>
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
