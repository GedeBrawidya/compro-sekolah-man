import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    FileCheck,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { FormEvent, useState } from 'react';

interface LegalizationItem {
    id: number;
    alumni_name: string;
    email: string;
    phone: string | null;
    graduation_year: string | null;
    document_type: string;
    copies: number;
    status: 'pending' | 'processing' | 'approved' | 'rejected';
    notes: string | null;
    created_at: string;
}

interface Props {
    requests: {
        data: LegalizationItem[];
        links: any[];
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function LegalizationIndex({ requests, filters }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [activeItem, setActiveItem] = useState<LegalizationItem | null>(null);

    const { data, setData, put, processing, reset } = useForm<{
        status: 'pending' | 'processing' | 'approved' | 'rejected';
        notes: string;
    }>({
        status: 'processing',
        notes: '',
    });

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get('/admin/legalization', { search, status: statusFilter }, { preserveState: true });
    };

    const openStatusModal = (item: LegalizationItem) => {
        setActiveItem(item);
        setData({
            status: item.status,
            notes: item.notes || '',
        });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!activeItem) return;

        router.put(`/admin/legalization/${activeItem.id}/status`, data, {
            onSuccess: () => {
                setActiveItem(null);
                reset();
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus permohonan legalisir ini?')) {
            router.delete(`/admin/legalization/${id}`);
        }
    };

    return (
        <>
            <Head title="E-Legalisir Alumni - Admin" />

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
                            <FileCheck className="w-6 h-6 text-purple-600" /> Permohonan E-Legalisir Alumni
                        </h1>
                        <p className="text-sm text-slate-500">Proses pendaftaran dan legalisasi dokumen ijazah/transkrip alumni secara online.</p>
                    </div>
                </div>

                {/* Filters */}
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari nama alumni, email, dokumen..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            router.get('/admin/legalization', { search, status: e.target.value }, { preserveState: true });
                        }}
                        className="px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                        <option value="">Semua Status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Sedang Diproses</option>
                        <option value="approved">Disetujui / Selesai</option>
                        <option value="rejected">Ditolak</option>
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
                                    <th className="px-6 py-4">Nama Alumni & Tahun Lulus</th>
                                    <th className="px-6 py-4">Dokumen & Jumlah</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Tanggal Pengajuan</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {requests.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                            Tidak ada permohonan e-legalisir.
                                        </td>
                                    </tr>
                                ) : (
                                    requests.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-slate-900 dark:text-white">{item.alumni_name}</p>
                                                <p className="text-xs text-slate-500">{item.email} {item.phone && `• ${item.phone}`}</p>
                                                <p className="text-[11px] text-purple-600 font-medium mt-0.5">Lulusan Tahun: {item.graduation_year || '-'}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-slate-900 dark:text-white">{item.document_type}</p>
                                                <p className="text-xs text-slate-500">{item.copies} Berkas Legalisir</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1.5 rounded-md text-xs font-bold shadow-sm ${
                                                    item.status === 'pending'
                                                        ? 'bg-amber-500 text-white'
                                                        : item.status === 'processing'
                                                        ? 'bg-blue-600 text-white'
                                                        : item.status === 'approved'
                                                        ? 'bg-[#265243] text-white'
                                                        : 'bg-rose-600 text-white'
                                                }`}>
                                                    {item.status === 'pending' ? 'Pending' : item.status === 'processing' ? 'Diproses' : item.status === 'approved' ? 'Selesai' : 'Ditolak'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-500">
                                                {new Date(item.created_at).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openStatusModal(item)}
                                                        className="px-3 py-2 rounded-lg text-xs font-bold bg-[#265243] text-white hover:bg-[#1f4337] shadow-sm transition-colors"
                                                    >
                                                        Update Status
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

                {/* Status Update Modal */}
                {activeItem && (
                    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Proses Permohonan Legalisir</h3>
                                <button onClick={() => setActiveItem(null)} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{activeItem.alumni_name} (Lulus {activeItem.graduation_year})</p>
                                    <p className="text-xs text-slate-600 dark:text-slate-300">Dokumen: {activeItem.document_type} ({activeItem.copies} rangkap)</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Status Legalisir *</label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value as any)}
                                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                    >
                                        <option value="pending">Pending (Menunggu Verifikasi Berkas)</option>
                                        <option value="processing">Sedang Diproses Legalisir</option>
                                        <option value="approved">Disetujui & Ready Ambil/Kirim</option>
                                        <option value="rejected">Ditolak (Berkas Tidak Sesuai)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Catatan / Instruksi Pengambilan</label>
                                    <textarea
                                        rows={3}
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                        placeholder="Misal: Dokumen sudah siap diambil di ruang Tata Usaha pada jam kerja..."
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setActiveItem(null)}
                                        className="px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-5 py-2 text-sm font-semibold rounded-xl bg-[#265243] text-white hover:bg-[#1f4337] disabled:opacity-50"
                                    >
                                        Simpan Perubahan Status
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

LegalizationIndex.layout = {
    breadcrumbs: [{ title: 'E-Legalisir Layanan Publik', href: '/admin/legalization' }],
};
