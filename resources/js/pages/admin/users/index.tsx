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
    const { flash, auth } = usePage<{
        flash: { success?: string; error?: string };
        auth: { user: UserItem };
    }>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<UserItem | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm<{
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
        super_admin: {
            label: 'Super Admin',
            style: 'bg-purple-600 text-white',
        },
        admin: { label: 'Humas / Admin', style: 'bg-blue-600 text-white' },
        pengurus_asrama: {
            label: 'Pengurus Asrama',
            style: 'bg-amber-500 text-white',
        },
        pustakawan: { label: 'Pustakawan', style: 'bg-[#265243] text-white' },
    };

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/users',
            { search, role: roleFilter },
            { preserveState: true },
        );
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
            <Head title="Manajemen User - Admin - MAN TANJUNGPINANG" />

            <div className="w-full space-y-6 p-4 sm:p-6">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-400">
                        <X className="h-5 w-5 flex-shrink-0" />
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
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#265243] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#1f4337]"
                        >
                            <Plus className="h-4 w-4" /> Tambah User Admin
                        </button>
                    }
                />

                {/* Filters */}
                <form
                    onSubmit={handleSearch}
                    className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
                >
                    <div className="relative max-w-md flex-1">
                        <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#265243]" />
                        <input
                            type="text"
                            placeholder="Cari nama atau email user..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                backgroundColor: '#e4ebe2',
                                color: '#1a3d31',
                            }}
                            className="w-full rounded-full border-none py-2.5 pr-4 pl-10 text-xs font-semibold shadow-xs transition-all placeholder:text-[#527365] focus:bg-white focus:ring-2 focus:ring-[#265243] focus:outline-none"
                        />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => {
                            setRoleFilter(e.target.value);
                            router.get(
                                '/admin/users',
                                { search, role: e.target.value },
                                { preserveState: true },
                            );
                        }}
                        style={{ backgroundColor: '#e4ebe2', color: '#1a3d31' }}
                        className="rounded-full border-none px-4 py-2.5 text-xs font-semibold shadow-xs transition-all focus:bg-white focus:ring-2 focus:ring-[#265243] focus:outline-none"
                    >
                        <option value="">Semua Peran / Role</option>
                        {roles.map((r) => (
                            <option key={r.value} value={r.value}>
                                {r.label}
                            </option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        style={{ backgroundColor: '#265243', color: '#ffffff' }}
                        className="rounded-full px-5 py-2.5 text-xs font-bold shadow-xs transition-all hover:bg-[#1f4337]"
                    >
                        Filter
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
                                        Nama User
                                    </th>
                                    <th className="px-6 py-4 text-white">
                                        Email
                                    </th>
                                    <th className="px-6 py-4 text-white">
                                        Peran (Role)
                                    </th>
                                    <th className="px-6 py-4 text-white">
                                        Tanggal Registrasi
                                    </th>
                                    <th className="px-6 py-4 text-right text-white">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#265243]/10">
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-12 text-center font-semibold text-[#4a6b5d]"
                                        >
                                            Tidak ada user admin ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((user, idx) => {
                                        const roleMeta =
                                            roleBadgeStyle[user.role] ||
                                            roleBadgeStyle.admin;
                                        return (
                                            <tr
                                                key={user.id}
                                                style={{
                                                    backgroundColor:
                                                        idx % 2 === 0
                                                            ? '#e8efe5'
                                                            : '#e0e9dd',
                                                }}
                                                className="transition-colors hover:bg-[#d6e4d4]"
                                            >
                                                <td className="px-6 py-4 font-bold text-[#142921]">
                                                    {user.name}
                                                    {user.id ===
                                                        auth.user.id && (
                                                        <span className="ml-2 rounded-full border border-emerald-300 bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-900">
                                                            Anda
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-xs font-semibold text-[#2e5445]">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`rounded-md px-3 py-1.5 text-xs font-bold shadow-sm ${roleMeta.style}`}
                                                    >
                                                        {roleMeta.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-xs font-semibold text-[#2e5445]">
                                                    {new Date(
                                                        user.created_at,
                                                    ).toLocaleDateString(
                                                        'id-ID',
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() =>
                                                                openEditModal(
                                                                    user,
                                                                )
                                                            }
                                                            className="rounded-lg p-1.5 text-[#265243] transition-colors hover:bg-[#dce8d7] hover:text-[#142921]"
                                                            title="Edit User"
                                                        >
                                                            <Edit3 className="h-4 w-4" />
                                                        </button>
                                                        {user.id !==
                                                            auth.user.id && (
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        user,
                                                                    )
                                                                }
                                                                className="rounded-lg p-1.5 text-[#265243] transition-colors hover:bg-rose-50 hover:text-rose-600"
                                                                title="Hapus User"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
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
                        className="border-t border-[#c8d6c0] px-6 py-4"
                    />
                </div>

                {/* Modal Create / Edit */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                            <div className="flex items-center justify-between border-b border-slate-100 p-6">
                                <h3 className="text-lg font-bold text-[#142921]">
                                    {editingItem
                                        ? 'Edit User Admin'
                                        : 'Tambah Admin User Baru'}
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
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                                        Nama Lengkap *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        style={{
                                            backgroundColor: '#f7faf5',
                                            borderColor: '#b8ceb0',
                                            color: '#142921',
                                        }}
                                        className="w-full rounded-xl border px-4 py-2.5 text-xs font-semibold placeholder:text-[#527365] focus:ring-2 focus:ring-[#265243] focus:outline-none"
                                        placeholder="Nama admin"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-xs text-rose-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                                        Alamat Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        style={{
                                            backgroundColor: '#f7faf5',
                                            borderColor: '#b8ceb0',
                                            color: '#142921',
                                        }}
                                        className="w-full rounded-xl border px-4 py-2.5 text-xs font-semibold placeholder:text-[#527365] focus:ring-2 focus:ring-[#265243] focus:outline-none"
                                        placeholder="email@sekolah.sch.id"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-xs text-rose-500">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                                        Peran Akses (Role) *
                                    </label>
                                    <select
                                        value={data.role}
                                        onChange={(e) =>
                                            setData(
                                                'role',
                                                e.target.value as any,
                                            )
                                        }
                                        style={{
                                            backgroundColor: '#f7faf5',
                                            borderColor: '#b8ceb0',
                                            color: '#142921',
                                        }}
                                        className="w-full rounded-xl border px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#265243] focus:outline-none"
                                    >
                                        {roles.map((r) => (
                                            <option
                                                key={r.value}
                                                value={r.value}
                                            >
                                                {r.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-slate-700">
                                        Password{' '}
                                        {editingItem
                                            ? '(Kosongkan jika tidak diubah)'
                                            : '*'}
                                    </label>
                                    <input
                                        type="password"
                                        required={!editingItem}
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        style={{
                                            backgroundColor: '#f7faf5',
                                            borderColor: '#b8ceb0',
                                            color: '#142921',
                                        }}
                                        className="w-full rounded-xl border px-4 py-2.5 text-xs font-semibold placeholder:text-[#527365] focus:ring-2 focus:ring-[#265243] focus:outline-none"
                                        placeholder="Minimal 8 karakter"
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-xs text-rose-500">
                                            {errors.password}
                                        </p>
                                    )}
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
                                        disabled={processing}
                                        className="rounded-xl bg-[#265243] px-5 py-2 text-xs font-semibold text-white hover:bg-[#1f4337] disabled:opacity-50"
                                    >
                                        {editingItem
                                            ? 'Simpan Perubahan'
                                            : 'Tambah User'}
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

UsersIndex.layout = {
    breadcrumbs: [{ title: 'Manajemen Admin User', href: '/admin/users' }],
};
