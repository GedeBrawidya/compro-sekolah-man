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
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>()
        .props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });
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

            <div className="w-full space-y-6 p-4 sm:p-6">
                {/* Flash */}
                {flash?.success && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-600">
                        <CheckCircle2 className="h-5 w-5 shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-600">
                        <X className="h-5 w-5 shrink-0" />
                        <span>{flash.error}</span>
                    </div>
                )}

                <PageHeader
                    title="Manajemen Kategori Buku"
                    description="Tambah dan kelola kategori buku perpustakaan. Kategori yang ditambahkan di sini tersedia saat menambahkan buku baru."
                    icon={BookMarked}
                    badge="Perpustakaan"
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Add Category Form */}
                    <div className="md:col-span-1">
                        <div
                            style={{
                                backgroundColor: '#f7faf5',
                                borderColor: '#b8ceb0',
                            }}
                            className="space-y-4 rounded-2xl border p-5 shadow-sm"
                        >
                            <h3 className="flex items-center gap-2 text-sm font-extrabold text-[#142921]">
                                <Tag className="h-4 w-4 text-[#265243]" />
                                Tambah Kategori Baru
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="Nama kategori, misal: Matematika"
                                        style={{
                                            backgroundColor: '#ffffff',
                                            borderColor: '#b8ceb0',
                                            color: '#142921',
                                        }}
                                        className="w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold placeholder:text-[#527365] focus:ring-2 focus:ring-[#265243] focus:outline-none"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-xs font-semibold text-rose-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing || !data.name.trim()}
                                    style={{
                                        backgroundColor: '#265243',
                                        color: '#ffffff',
                                    }}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all hover:bg-[#1f4337] disabled:opacity-50"
                                >
                                    <Plus className="h-4 w-4" />
                                    Tambah Kategori
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Category List */}
                    <div className="md:col-span-2">
                        <div
                            style={{
                                backgroundColor: '#f2f7f0',
                                borderColor: '#b8ceb0',
                            }}
                            className="overflow-hidden rounded-2xl border shadow-sm"
                        >
                            <div
                                style={{ backgroundColor: '#265243' }}
                                className="flex items-center justify-between px-5 py-3"
                            >
                                <h3 className="text-xs font-extrabold tracking-wider text-white uppercase">
                                    Daftar Kategori
                                </h3>
                                <span className="text-xs font-black text-white/70">
                                    {categories.length} kategori
                                </span>
                            </div>

                            {categories.length === 0 ? (
                                <div className="p-12 text-center">
                                    <Tag className="mx-auto mb-3 h-10 w-10 text-[#265243] opacity-50" />
                                    <p className="text-sm font-bold text-[#142921]">
                                        Belum ada kategori.
                                    </p>
                                    <p className="mt-1 text-xs text-[#527365]">
                                        Tambahkan kategori menggunakan form di
                                        sebelah kiri.
                                    </p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-[#c8d6c0]">
                                    {categories.map((cat) => (
                                        <li
                                            key={cat.id}
                                            className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-[#eef4eb]"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#265243]/10">
                                                    <Tag className="h-3.5 w-3.5 text-[#265243]" />
                                                </div>
                                                <span className="text-sm font-bold text-[#142921]">
                                                    {cat.name}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    setConfirmId(cat.id)
                                                }
                                                className="rounded-lg p-1.5 text-[#527365] transition-all hover:bg-rose-50 hover:text-rose-600"
                                                title="Hapus Kategori"
                                            >
                                                <Trash2 className="h-4 w-4" />
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                        <div className="space-y-4 p-6 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                                <Trash2 className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-base font-extrabold text-[#142921]">
                                    Hapus Kategori?
                                </h3>
                                <p className="mt-1 text-xs text-[#527365]">
                                    Buku yang menggunakan kategori ini tidak
                                    ikut terhapus, namun pilihan kategori akan
                                    hilang dari daftar.
                                </p>
                            </div>
                            <div className="flex items-center justify-center gap-3 border-t border-slate-100 pt-2">
                                <button
                                    onClick={() => setConfirmId(null)}
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={() => handleDelete(confirmId)}
                                    className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700"
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
