import { Head, router, useForm, usePage } from '@inertiajs/react';
import { BookMarked, CheckCircle2, Plus, Tag, Trash2, X } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { PageHeader } from '@/components/page-header';

interface Category {
    id: number;
    name: string;
}

interface Props {
    categories: Category[];
    flash?: { success?: string; error?: string };
}

export default function BookCategories({ categories }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const { data, setData, post, processing, errors, reset } = useForm({ name: '' });
    const [confirmId, setConfirmId] = useState<number | null>(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/admin/book-categories', {
            onSuccess: () => reset(),
        });
    };

    const handleDelete = (id: number) => {
        router.delete(`/admin/book-categories/${id}`, {
            onSuccess: () => setConfirmId(null),
        });
    };

    return (
        <>
            <Head title="Manajemen Kategori Buku - Admin - MAN TANJUNGPINANG" />

            <div className="p-4 sm:p-6 w-full space-y-6">
                {/* Flash */}
                {flash?.success && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-sm flex items-center gap-2">
                        <X className="w-5 h-5 shrink-0" />
                        <span>{flash.error}</span>
                    </div>
                )}

                <PageHeader
                    title="Manajemen Kategori Buku"
                    description="Tambah dan kelola kategori buku perpustakaan. Kategori yang ditambahkan di sini tersedia saat menambahkan buku baru."
                    icon={BookMarked}
                    badge="Perpustakaan"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Add Category Form */}
                    <div className="md:col-span-1">
                        <div style={{ backgroundColor: '#f7faf5', borderColor: '#b8ceb0' }} className="rounded-2xl border p-5 space-y-4 shadow-sm">
                            <h3 className="text-sm font-extrabold text-[#142921] flex items-center gap-2">
                                <Tag className="w-4 h-4 text-[#265243]" />
                                Tambah Kategori Baru
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Nama kategori, misal: Matematika"
                                        style={{ backgroundColor: '#ffffff', borderColor: '#b8ceb0', color: '#142921' }}
                                        className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border focus:ring-2 focus:ring-[#265243] focus:outline-none placeholder:text-[#527365]"
                                    />
                                    {errors.name && (
                                        <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.name}</p>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing || !data.name.trim()}
                                    style={{ backgroundColor: '#265243', color: '#ffffff' }}
                                    className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#1f4337] transition-all disabled:opacity-50"
                                >
                                    <Plus className="w-4 h-4" />
                                    Tambah Kategori
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Category List */}
                    <div className="md:col-span-2">
                        <div style={{ backgroundColor: '#f2f7f0', borderColor: '#b8ceb0' }} className="rounded-2xl border shadow-sm overflow-hidden">
                            <div style={{ backgroundColor: '#265243' }} className="px-5 py-3 flex items-center justify-between">
                                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                                    Daftar Kategori
                                </h3>
                                <span className="text-xs font-black text-white/70">
                                    {categories.length} kategori
                                </span>
                            </div>

                            {categories.length === 0 ? (
                                <div className="p-12 text-center">
                                    <Tag className="w-10 h-10 text-[#265243] mx-auto mb-3 opacity-50" />
                                    <p className="text-sm font-bold text-[#142921]">Belum ada kategori.</p>
                                    <p className="text-xs text-[#527365] mt-1">Tambahkan kategori menggunakan form di sebelah kiri.</p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-[#c8d6c0]">
                                    {categories.map((cat) => (
                                        <li
                                            key={cat.id}
                                            className="flex items-center justify-between px-5 py-3 hover:bg-[#eef4eb] transition-colors"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-lg bg-[#265243]/10 flex items-center justify-center">
                                                    <Tag className="w-3.5 h-3.5 text-[#265243]" />
                                                </div>
                                                <span className="text-sm font-bold text-[#142921]">{cat.name}</span>
                                            </div>
                                            <button
                                                onClick={() => setConfirmId(cat.id)}
                                                className="p-1.5 rounded-lg text-[#527365] hover:text-rose-600 hover:bg-rose-50 transition-all"
                                                title="Hapus Kategori"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirm Delete Modal */}
            {confirmId !== null && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                        <div className="p-6 text-center space-y-4">
                            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
                                <Trash2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-base font-extrabold text-[#142921]">Hapus Kategori?</h3>
                                <p className="text-xs text-[#527365] mt-1">
                                    Buku yang menggunakan kategori ini tidak ikut terhapus, namun pilihan kategori akan hilang dari daftar.
                                </p>
                            </div>
                            <div className="flex items-center justify-center gap-3 pt-2 border-t border-slate-100">
                                <button
                                    onClick={() => setConfirmId(null)}
                                    className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={() => handleDelete(confirmId)}
                                    className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
                                >
                                    Ya, Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
