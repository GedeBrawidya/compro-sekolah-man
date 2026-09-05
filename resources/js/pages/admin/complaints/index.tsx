import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    MessageSquare,
    Search,
    Send,
    Trash2,
    X,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';

interface ComplaintItem {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    subject: string | null;
    message: string;
    status: 'pending' | 'processed' | 'resolved';
    response: string | null;
    created_at: string;
}

interface Props {
    complaints: {
        data: ComplaintItem[];
        links: any[];
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function ComplaintsIndex({ complaints, filters }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [activeComplaint, setActiveComplaint] = useState<ComplaintItem | null>(null);

    const { data, setData, put, processing, reset } = useForm<{
        status: 'pending' | 'processed' | 'resolved';
        response: string;
    }>({
        status: 'processed',
        response: '',
    });

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get('/admin/complaints', { search, status: statusFilter }, { preserveState: true });
    };

    const openResponseModal = (item: ComplaintItem) => {
        setActiveComplaint(item);
        setData({
            status: item.status,
            response: item.response || '',
        });
    };

    const handleSubmitResponse = (e: FormEvent) => {
        e.preventDefault();
        if (!activeComplaint) return;

        router.put(`/admin/complaints/${activeComplaint.id}/status`, data, {
            onSuccess: () => {
                setActiveComplaint(null);
                reset();
            },
        });
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

    const handleDelete = (item: ComplaintItem) => {
        setConfirmModal({
            isOpen: true,
            title: 'Hapus Pengaduan Masyarakat',
            description: `Apakah Anda yakin ingin menghapus pengaduan dari "${item.name}" (${item.subject || 'Tanpa Subjek'})? Tindakan ini tidak dapat dibatalkan.`,
            onConfirm: () => {
                router.delete(`/admin/complaints/${item.id}`, {
                    onFinish: () => setConfirmModal((prev) => ({ ...prev, isOpen: false })),
                });
            },
        });
    };

    return (
        <>
            <Head title="Pengaduan Masyarakat - Admin - MAN TANJUNG PINANG" />

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
                    title="Pengaduan Masyarakat"
                    description="Kelola masukan, kritik, dan pengaduan yang dikirimkan oleh wali murid / masyarakat umum."
                    icon={MessageSquare}
                />

                {/* Filters */}
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#265243]" />
                        <input
                            type="text"
                            placeholder="Cari pengirim, email, atau isi pengaduan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ backgroundColor: '#e4ebe2', color: '#1a3d31' }}
                            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-full border-none shadow-xs font-semibold placeholder:text-[#527365] focus:outline-none focus:ring-2 focus:ring-[#265243] focus:bg-white transition-all"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            router.get('/admin/complaints', { search, status: e.target.value }, { preserveState: true });
                        }}
                        style={{ backgroundColor: '#e4ebe2', color: '#1a3d31' }}
                        className="px-4 py-2.5 text-xs rounded-full border-none shadow-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#265243] focus:bg-white transition-all"
                    >
                        <option value="">Semua Status</option>
                        <option value="pending">Pending</option>
                        <option value="processed">Diproses</option>
                        <option value="resolved">Selesai</option>
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
                                    <th className="px-6 py-4 text-white">Pengirim</th>
                                    <th className="px-6 py-4 text-white">Subjek & Pesan</th>
                                    <th className="px-6 py-4 text-white">Status</th>
                                    <th className="px-6 py-4 text-white">Tanggal Masuk</th>
                                    <th className="px-6 py-4 text-right text-white">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#c8d6c0]">
                                {complaints.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-[#4a6b5d] font-semibold">
                                            Tidak ada data pengaduan masyarakat.
                                        </td>
                                    </tr>
                                ) : (
                                    complaints.data.map((item, idx) => (
                                        <tr
                                            key={item.id}
                                            style={{ backgroundColor: idx % 2 === 0 ? '#e8efe5' : '#e0e9dd' }}
                                            className="hover:bg-[#d6e2d3] transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-[#142921]">{item.name}</p>
                                                <p className="text-xs font-semibold text-[#2e5445]">{item.email}</p>
                                                {item.phone && <p className="text-[11px] font-semibold text-[#37594b]">{item.phone}</p>}
                                            </td>
                                            <td className="px-6 py-4 max-w-sm">
                                                <p className="font-bold text-[#142921]">{item.subject || 'Tanpa Subjek'}</p>
                                                <p className="text-xs font-semibold text-[#2e5445] line-clamp-2 mt-0.5">{item.message}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1.5 rounded-md text-xs font-bold shadow-sm text-white ${
                                                    item.status === 'pending'
                                                        ? 'bg-amber-500'
                                                        : item.status === 'processed'
                                                        ? 'bg-blue-600'
                                                        : 'bg-[#265243]'
                                                }`}>
                                                    {item.status === 'pending' ? 'Pending' : item.status === 'processed' ? 'Diproses' : 'Selesai'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-semibold text-[#2e5445]">
                                                {new Date(item.created_at).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openResponseModal(item)}
                                                        className="px-3 py-2 rounded-lg text-xs font-bold bg-[#265243] text-white hover:bg-[#1f4337] shadow-sm transition-colors"
                                                    >
                                                        Tanggapi
                                                    </button>
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
                        links={complaints.links}
                        from={(complaints as any).from}
                        to={(complaints as any).to}
                        total={(complaints as any).total}
                        className="px-6 py-4 border-t border-[#c8d6c0]"
                    />
                </div>

                {/* Response Modal */}
                {activeComplaint && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
                        <div
                            style={{ backgroundColor: '#ffffff', borderColor: '#b8ceb0' }}
                            className="w-full max-w-xl rounded-2xl shadow-2xl border overflow-hidden space-y-0"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-[#eef4eb] bg-[#f8faf7]">
                                <div className="flex items-center gap-2.5 border-l-4 border-[#265243] pl-3 py-0.5">
                                    <h3 className="text-base font-extrabold text-[#142921]">
                                        Tanggapi Pengaduan Masyarakat
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setActiveComplaint(null)}
                                    className="p-1.5 rounded-full text-[#265243] hover:bg-[#eaf2e7] transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitResponse} className="p-6 space-y-5">
                                <div style={{ backgroundColor: '#f4f8f3', borderColor: '#b8ceb0' }} className="p-4 rounded-xl border space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-[#527365]">
                                        <span>Dari: <strong className="text-[#142921]">{activeComplaint.name}</strong> ({activeComplaint.email})</span>
                                        <span>{new Date(activeComplaint.created_at).toLocaleDateString('id-ID')}</span>
                                    </div>
                                    <p className="text-xs font-extrabold text-[#142921]">Subjek: {activeComplaint.subject || 'Tanpa Subjek'}</p>
                                    <p className="text-xs font-semibold text-[#2e5445] leading-relaxed whitespace-pre-wrap">{activeComplaint.message}</p>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#265243]">
                                        Update Status Pengaduan <span className="text-rose-600">*</span>
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value as any)}
                                        style={{ backgroundColor: '#ffffff', borderColor: '#265243', color: '#142921' }}
                                        className="w-full px-4 py-3 text-xs font-bold rounded-xl border-2 shadow-xs focus:ring-2 focus:ring-[#265243]/20 focus:border-[#265243] focus:outline-none transition-all"
                                    >
                                        <option value="pending">Pending (Belum Diproses)</option>
                                        <option value="processed">Sedang Diproses</option>
                                        <option value="resolved">Selesai Ditindaklanjuti</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#265243]">
                                        Catatan Respon / Tindak Lanjut Admin
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={data.response}
                                        onChange={(e) => setData('response', e.target.value)}
                                        style={{ backgroundColor: '#ffffff', borderColor: '#265243', color: '#142921' }}
                                        className="w-full px-4 py-3 text-xs font-semibold rounded-xl border-2 shadow-xs placeholder:text-[#6b8e7d] focus:ring-2 focus:ring-[#265243]/20 focus:border-[#265243] focus:outline-none transition-all"
                                        placeholder="Tuliskan respon atau kabar perbaikan untuk pengirim..."
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#eef4eb]">
                                    <button
                                        type="button"
                                        onClick={() => setActiveComplaint(null)}
                                        style={{ backgroundColor: '#eef4eb', color: '#142921', borderColor: '#b8ceb0' }}
                                        className="px-5 py-2.5 rounded-xl border text-xs font-extrabold hover:bg-[#dce8d7] transition-all"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        style={{ backgroundColor: '#265243', color: '#ffffff' }}
                                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold hover:bg-[#1f4337] transition-all shadow-xs disabled:opacity-50"
                                    >
                                        <Send className="w-4 h-4" /> Simpan Respon
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ── MODAL KONFIRMASI HAPUS PENGADUAN ── */}
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

ComplaintsIndex.layout = {
    breadcrumbs: [{ title: 'Pengaduan Masyarakat', href: '/admin/complaints' }],
};
