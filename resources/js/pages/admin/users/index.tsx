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
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';

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
        confirmText: 'Ya, Hapus',
        onConfirm: () => {},
    });

    const handleDelete = (item: UserItem) => {
        if (item.id === auth.user.id) {
            alert('Anda tidak bisa menghapus akun Anda sendiri.');
            return;
        }

        setConfirmModal({
            isOpen: true,
            title: 'Hapus Akun User Admin',
            description: `Apakah Anda yakin ingin menghapus akun ${item.name} (${item.email}) dari sistem?`,
            confirmText: 'Ya, Hapus Akun',
            onConfirm: () => {
                router.delete(`/admin/users/${item.id}`);
                setConfirmModal((prev) => ({ ...prev, isOpen: false }));
            },
        });
    };

    return (
        <>
            <Head title="Manajemen User - Admin - MAN TANJUNG PINANG" />

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
                <PageHeader
                    title="Kelola Admin & Akses"
                    description="Tambah akun pengelola website dan tentukan hak akses peran (Super Admin, Humas, Asrama, Pustakawan)."
                    icon={Users}
                    action={
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#265243] hover:bg-[#1f4337] text-white font-semibold text-sm transition-all shadow-sm"
                        >
                            <Plus className="w-4 h-4" /> Tambah User Admin
                        </button>
                    }
                />

                {/* Filters */}
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#265243]" />
                        <input
                            type="text"
                            placeholder="Cari nama atau email user..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ backgroundColor: '#e4ebe2', color: '#1a3d31' }}
                            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-full border-none shadow-xs font-semibold placeholder:text-[#527365] focus:outline-none focus:ring-2 focus:ring-[#265243] focus:bg-white transition-all"
                        />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => {
                            setRoleFilter(e.target.value);
                            router.get('/admin/users', { search, role: e.target.value }, { preserveState: true });
                        }}
                        style={{ backgroundColor: '#e4ebe2', color: '#1a3d31' }}
                        className="px-4 py-2.5 text-xs rounded-full border-none shadow-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#265243] focus:bg-white transition-all"
                    >
                        <option value="">Semua Peran / Role</option>
                        {roles.map((r) => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        style={{ backgroundColor: '#265243', color: '#ffffff' }}
                        className="px-5 py-2.5 rounded-full hover:bg-[#1f4337] text-xs font-bold transition-all shadow-xs"
                    >
                        Filter
                    </button>
                </form>

                {/* Table Data */}
                <div style={{ backgroundColor: '#e8efe5' }} className="rounded-2xl border-none overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead style={{ backgroundColor: '#265243', color: '#ffffff' }} className="text-xs font-extrabold uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 text-white">Nama User</th>
                                    <th className="px-6 py-4 text-white">Email</th>
                                    <th className="px-6 py-4 text-white">Peran (Role)</th>
                                    <th className="px-6 py-4 text-white">Tanggal Registrasi</th>
                                    <th className="px-6 py-4 text-right text-white">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#265243]/10">
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-[#4a6b5d] font-semibold">
                                            Tidak ada user admin ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((user, idx) => {
                                        const roleMeta = roleBadgeStyle[user.role] || roleBadgeStyle.admin;
                                        return (
                                            <tr
                                                key={user.id}
                                                style={{ backgroundColor: idx % 2 === 0 ? '#e8efe5' : '#e0e9dd' }}
                                                className="hover:bg-[#d6e4d4] transition-colors"
                                            >
                                                <td className="px-6 py-4 font-bold text-[#142921]">
                                                    {user.name}
                                                    {user.id === auth.user.id && (
                                                        <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2 py-0.5 rounded-full">Anda</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-xs font-semibold text-[#2e5445]">{user.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1.5 rounded-md text-xs font-bold shadow-sm ${roleMeta.style}`}>
                                                        {roleMeta.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-xs font-semibold text-[#2e5445]">
                                                    {new Date(user.created_at).toLocaleDateString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => openEditModal(user)}
                                                            className="p-1.5 rounded-lg text-[#265243] hover:text-[#142921] hover:bg-[#dce8d7] transition-colors"
                                                            title="Edit User"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                        {user.id !== auth.user.id && (
                                                            <button
                                                                onClick={() => handleDelete(user)}
                                                                className="p-1.5 rounded-lg text-[#265243] hover:text-rose-600 hover:bg-rose-50 transition-colors"
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

                    <Pagination
                        links={users.links}
                        from={(users as any).from}
                        to={(users as any).to}
                        total={(users as any).total}
                        className="px-6 py-4 border-t border-[#c8d6c0]"
                    />
                </div>

                {/* Modal Create / Edit */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                                <h3 className="text-lg font-bold text-[#142921]">
                                    {editingItem ? 'Edit User Admin' : 'Tambah Admin User Baru'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
                                    <input
                                        type="text"
                                        required
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        style={{ backgroundColor: '#f7faf5', borderColor: '#b8ceb0', color: '#142921' }}
                                        className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl border focus:ring-2 focus:ring-[#265243] focus:outline-none placeholder:text-[#527365]"
                                        placeholder="Nama admin"
                                    />
                                    {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Email *</label>
                                    <input
                                        type="email"
                                        required
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        style={{ backgroundColor: '#f7faf5', borderColor: '#b8ceb0', color: '#142921' }}
                                        className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl border focus:ring-2 focus:ring-[#265243] focus:outline-none placeholder:text-[#527365]"
                                        placeholder="email@sekolah.sch.id"
                                    />
                                    {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Peran Akses (Role) *</label>
                                    <select
                                        value={data.role}
                                        onChange={(e) => setData('role', e.target.value as any)}
                                        style={{ backgroundColor: '#f7faf5', borderColor: '#b8ceb0', color: '#142921' }}
                                        className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl border focus:ring-2 focus:ring-[#265243] focus:outline-none"
                                    >
                                        {roles.map((r) => (
                                            <option key={r.value} value={r.value}>{r.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Password {editingItem ? '(Kosongkan jika tidak diubah)' : '*'}
                                    </label>
                                    <input
                                        type="password"
                                        required={!editingItem}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        style={{ backgroundColor: '#f7faf5', borderColor: '#b8ceb0', color: '#142921' }}
                                        className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl border focus:ring-2 focus:ring-[#265243] focus:outline-none placeholder:text-[#527365]"
                                        placeholder="Minimal 8 karakter"
                                    />
                                    {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password}</p>}
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
                                        disabled={processing}
                                        className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#265243] text-white hover:bg-[#1f4337] disabled:opacity-50"
                                    >
                                        {editingItem ? 'Simpan Perubahan' : 'Tambah User'}
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

UsersIndex.layout = {
    breadcrumbs: [{ title: 'Manajemen Admin User', href: '/admin/users' }],
};
