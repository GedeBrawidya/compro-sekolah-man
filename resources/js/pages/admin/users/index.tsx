import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    Edit3,
    Plus,
    Search,
    Shield,
    Trash2,
    Users,
    X,
} from 'lucide-react';
import { FormEvent, useState } from 'react';

interface UserItem {
    id: number;
    name: string;
    email: string;
    role: 'super_admin' | 'admin' | 'pengurus_asrama' | 'pustakawan';
    created_at: string;
}

interface Props {
    users: {
        data: UserItem[];
        links: any[];
    };
    filters: {
        search?: string;
        role?: string;
    };
    roles: Array<{ value: string; label: string }>;
}

export default function UsersIndex({ users, filters, roles }: Props) {
    const { flash, auth } = usePage<{ flash: { success?: string; error?: string }; auth: { user: UserItem } }>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<UserItem | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<{
        name: string;
        email: string;
        password: string;
        role: 'super_admin' | 'admin' | 'pengurus_asrama' | 'pustakawan';
    }>({
        name: '',
        email: '',
        password: '',
        role: 'admin',
    });

    const roleBadgeStyle: Record<string, { label: string; style: string }> = {
        super_admin: { label: 'Super Admin', style: 'bg-purple-600 text-white' },
        admin: { label: 'Humas / Admin', style: 'bg-blue-600 text-white' },
        pengurus_asrama: { label: 'Pengurus Asrama', style: 'bg-amber-500 text-white' },
        pustakawan: { label: 'Pustakawan', style: 'bg-[#265243] text-white' },
    };

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get('/admin/users', { search, role: roleFilter }, { preserveState: true });
    };

    const openCreateModal = () => {
        setEditingItem(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (item: UserItem) => {
        setEditingItem(item);
        setData({
            name: item.name,
            email: item.email,
            password: '',
            role: item.role,
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (editingItem) {
            put(`/admin/users/${editingItem.id}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post('/admin/users', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (item: UserItem) => {
        if (item.id === auth.user.id) {
            alert('Anda tidak bisa menghapus akun Anda sendiri.');
            return;
        }

        if (confirm(`Apakah Anda yakin ingin menghapus akun ${item.name}?`)) {
            router.delete(`/admin/users/${item.id}`);
        }
    };

    return (
        <>
            <Head title="Manajemen User & Role Admin - Super Admin" />

            <div className="p-4 sm:p-6 w-full space-y-6">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm flex items-center gap-2">
                        <X className="w-5 h-5 flex-shrink-0" />
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Shield className="w-6 h-6 text-purple-600" /> Manajemen User Admin & Role RBAC
                        </h1>
                        <p className="text-sm text-slate-500">Tambah akun pengelola website dan tentukan hak akses peran (Super Admin, Humas, Asrama, Pustakawan).</p>
                    </div>

                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#265243] hover:bg-[#1f4337] text-white font-medium text-sm transition-all shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> Tambah User Admin
                    </button>
                </div>

                {/* Filters */}
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari nama atau email user..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => {
                            setRoleFilter(e.target.value);
                            router.get('/admin/users', { search, role: e.target.value }, { preserveState: true });
                        }}
                        className="px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                        <option value="">Semua Peran / Role</option>
                        {roles.map((r) => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                    </select>
                    <button type="submit" className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-200">
                        Filter
                    </button>
                </form>

                {/* Table Data */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-4">Nama User</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Peran (Role)</th>
                                    <th className="px-6 py-4">Tanggal Registrasi</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                            Tidak ada user admin ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((user) => {
                                        const roleMeta = roleBadgeStyle[user.role] || roleBadgeStyle.admin;
                                        return (
                                            <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                                <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                                                    {user.name}
                                                    {user.id === auth.user.id && (
                                                        <span className="ml-2 text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Anda</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">{user.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1.5 rounded-md text-xs font-bold shadow-sm ${roleMeta.style}`}>
                                                        {roleMeta.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-xs text-slate-500">
                                                    {new Date(user.created_at).toLocaleDateString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => openEditModal(user)}
                                                            className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                                                            title="Edit User"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                        {user.id !== auth.user.id && (
                                                            <button
                                                                onClick={() => handleDelete(user)}
                                                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30"
                                                                title="Hapus User"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal Create / Edit */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    {editingItem ? 'Edit User Admin' : 'Tambah Admin User Baru'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap *</label>
                                    <input
                                        type="text"
                                        required
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                                        placeholder="Nama admin"
                                    />
                                    {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Alamat Email *</label>
                                    <input
                                        type="email"
                                        required
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                                        placeholder="email@sekolah.sch.id"
                                    />
                                    {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Peran Akses (Role) *</label>
                                    <select
                                        value={data.role}
                                        onChange={(e) => setData('role', e.target.value as any)}
                                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                    >
                                        {roles.map((r) => (
                                            <option key={r.value} value={r.value}>{r.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Password {editingItem ? '(Kosongkan jika tidak diubah)' : '*'}
                                    </label>
                                    <input
                                        type="password"
                                        required={!editingItem}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                                        placeholder="Minimal 8 karakter"
                                    />
                                    {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password}</p>}
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
                                        disabled={processing}
                                        className="px-5 py-2 text-sm font-semibold rounded-xl bg-[#265243] text-white hover:bg-[#1f4337] disabled:opacity-50"
                                    >
                                        {editingItem ? 'Simpan Perubahan' : 'Tambah User'}
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

UsersIndex.layout = {
    breadcrumbs: [{ title: 'Manajemen Admin User', href: '/admin/users' }],
};
