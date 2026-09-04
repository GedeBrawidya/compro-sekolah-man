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

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus pengaduan ini?')) {
            router.delete(`/admin/complaints/${id}`);
        }
    };

    return (
        <>
            <Head title="Pengaduan Masyarakat - Admin" />

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
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <MessageSquare className="w-6 h-6 text-rose-500" /> Pengaduan Masyarakat
                        </h1>
                        <p className="text-sm text-slate-500">Kelola masukan, kritik, dan pengaduan yang dikirimkan oleh wali murid / masyarakat umum.</p>
                    </div>
                </div>

                {/* Filters */}
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari pengirim, email, atau isi pengaduan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            router.get('/admin/complaints', { search, status: e.target.value }, { preserveState: true });
                        }}
                        className="px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                        <option value="">Semua Status</option>
                        <option value="pending">Pending</option>
                        <option value="processed">Diproses</option>
                        <option value="resolved">Selesai</option>
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
                                    <th className="px-6 py-4">Pengirim</th>
                                    <th className="px-6 py-4">Subjek & Pesan</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Tanggal Masuk</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {complaints.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                            Tidak ada data pengaduan masyarakat.
                                        </td>
                                    </tr>
                                ) : (
                                    complaints.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                                                <p className="text-xs text-slate-500">{item.email}</p>
                                                {item.phone && <p className="text-[11px] text-slate-400">{item.phone}</p>}
                                            </td>
                                            <td className="px-6 py-4 max-w-sm">
                                                <p className="font-medium text-slate-900 dark:text-white">{item.subject || 'Tanpa Subjek'}</p>
                                                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{item.message}</p>
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
                                            <td className="px-6 py-4 text-xs text-slate-500">
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

                {/* Response Modal */}
                {activeComplaint && (
                    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tanggapi Pengaduan</h3>
                                <button onClick={() => setActiveComplaint(null)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitResponse} className="p-6 space-y-4">
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>Dari: {activeComplaint.name} ({activeComplaint.email})</span>
                                        <span>{new Date(activeComplaint.created_at).toLocaleDateString('id-ID')}</span>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{activeComplaint.subject || 'Tanpa Subjek'}</p>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{activeComplaint.message}</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Update Status Pengaduan *</label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value as any)}
                                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                    >
                                        <option value="pending">Pending (Belum Di-proses)</option>
                                        <option value="processed">Sedang Diproses</option>
                                        <option value="resolved">Selesai Ditindaklanjuti</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Catatan Respon / Tindak Lanjut Admin</label>
                                    <textarea
                                        rows={4}
                                        value={data.response}
                                        onChange={(e) => setData('response', e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                        placeholder="Tuliskan respon atau kabar perbaikan..."
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setActiveComplaint(null)}
                                        className="px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl bg-[#265243] text-white hover:bg-[#1f4337] disabled:opacity-50"
                                    >
                                        <Send className="w-4 h-4" /> Simpan Respon
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

ComplaintsIndex.layout = {
    breadcrumbs: [{ title: 'Pengaduan Masyarakat', href: '/admin/complaints' }],
};
