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
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>()
        .props;
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
                    onFinish: () =>
                        setConfirmModal((prev) => ({ ...prev, isOpen: false })),
                });
            },
        });
    };

    return (
        <>
            <Head title="Berita Sekolah - Admin - MAN TANJUNGPINANG" />

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
                    title="Berita Sekolah"
                    description="Publikasikan artikel berita terbaru dan pengumuman ke halaman publik sekolah."
                    icon={Newspaper}
                    badge="Manajemen Artikel"
                    action={
                        <Link
                            href="/admin/news/create"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#265243] shadow-sm transition-all hover:bg-slate-100"
                        >
                            <Plus className="h-4 w-4" /> Tulis Berita Baru
                        </Link>
                    }
                />

                {/* Search Bar */}
                <form
                    onSubmit={handleSearch}
                    className="flex items-center gap-2"
                >
                    <div className="relative max-w-md flex-1">
                        <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#265243]" />
                        <input
                            type="text"
                            placeholder="Cari judul berita..."
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
                                        Thumbnail
                                    </th>
                                    <th className="px-6 py-4 text-white">
                                        Judul Berita
                                    </th>
                                    <th className="px-6 py-4 text-white">
                                        Penulis
                                    </th>
                                    <th className="px-6 py-4 text-white">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-white">
                                        Tanggal Publish
                                    </th>
                                    <th className="px-6 py-4 text-right text-white">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#265243]/10">
                                {news.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-12 text-center font-semibold text-[#4a6b5d]"
                                        >
                                            Belum ada data berita. Klik "Publish
                                            Berita Baru" untuk menambahkan.
                                        </td>
                                    </tr>
                                ) : (
                                    news.data.map((item, idx) => (
                                        <tr
                                            key={item.id}
                                            style={{
                                                backgroundColor:
                                                    idx % 2 === 0
                                                        ? '#e8efe5'
                                                        : '#e0e9dd',
                                            }}
                                            className="transition-colors hover:bg-[#d6e4d4]"
                                        >
                                            <td className="px-6 py-4">
                                                {item.thumbnail ? (
                                                    <img
                                                        src={item.thumbnail}
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
                                                {item.author?.name || 'Admin'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`rounded-md px-3 py-1.5 text-xs font-bold shadow-sm ${
                                                        item.status ===
                                                        'published'
                                                            ? 'bg-[#265243] text-white'
                                                            : 'bg-slate-500 text-white'
                                                    }`}
                                                >
                                                    {item.status === 'published'
                                                        ? 'Published'
                                                        : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-semibold text-[#2e5445]">
                                                {item.published_at
                                                    ? new Date(
                                                          item.published_at,
                                                      ).toLocaleDateString(
                                                          'id-ID',
                                                      )
                                                    : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/news/${item.id}/edit`}
                                                        className="rounded-lg p-1.5 text-[#265243] transition-colors hover:bg-[#dce8d7] hover:text-[#142921]"
                                                        title="Edit"
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                    </Link>
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
                        links={news.links}
                        from={(news as any).from}
                        to={(news as any).to}
                        total={(news as any).total}
                        className="border-t border-[#c8d6c0] px-6 py-4"
                    />
                </div>

                {/* ── MODAL KONFIRMASI HAPUS BERITA ── */}
                {confirmModal.isOpen && (
                    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs duration-150">
                        <div
                            style={{
                                backgroundColor: '#ffffff',
                                borderColor: '#b8ceb0',
                            }}
                            className="w-full max-w-md space-y-5 rounded-2xl border p-6 text-center shadow-2xl"
                        >
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                                <Trash2 className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-base font-extrabold text-[#142921]">
                                    {confirmModal.title}
                                </h3>
                                <p className="mt-1.5 text-xs leading-relaxed font-semibold text-[#2e5445]">
                                    {confirmModal.description}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 pt-2">
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
                                        color: '#142921',
                                        borderColor: '#b8ceb0',
                                    }}
                                    className="flex-1 rounded-xl border py-2.5 text-xs font-extrabold transition-all hover:bg-[#dce8d7]"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmModal.onConfirm}
                                    className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-extrabold text-white shadow-xs transition-all hover:bg-rose-700"
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
