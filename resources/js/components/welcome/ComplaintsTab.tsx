import { Send } from 'lucide-react';
import { FormEvent } from 'react';

interface ComplaintsTabProps {
    complaintForm: any;
    handleComplaintSubmit: (e: FormEvent) => void;
}

export function ComplaintsTab({
    complaintForm,
    handleComplaintSubmit,
}: ComplaintsTabProps) {
    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div
                style={{
                    backgroundColor: '#ffffff',
                    borderColor: '#c8dac5',
                }}
                className="space-y-6 rounded-3xl border p-6 shadow-md sm:p-8"
            >
                <div className="flex items-center gap-3 border-l-4 border-[#265243] pl-3">
                    <div>
                        <h3 className="text-xl font-black text-[#142921]">
                            Layanan Pengaduan & Aspirasi Masyarakat
                        </h3>
                        <p className="mt-1 text-xs font-semibold text-[#527365]">
                            Sampaikan masukan, saran, atau pengaduan secara langsung kepada pengelola sekolah.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleComplaintSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-xs font-extrabold tracking-wider text-[#265243] uppercase">
                                Nama Lengkap <span className="text-rose-600">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Nama pengirim..."
                                value={complaintForm.data.name}
                                onChange={(e) =>
                                    complaintForm.setData(
                                        'name',
                                        e.target.value,
                                    )
                                }
                                style={{
                                    backgroundColor: '#ffffff',
                                    borderColor: '#265243',
                                    color: '#142921',
                                }}
                                className="w-full rounded-xl border-2 px-4 py-3 text-xs font-bold shadow-xs focus:ring-2 focus:ring-[#265243]/20 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-extrabold tracking-wider text-[#265243] uppercase">
                                Email <span className="text-rose-600">*</span>
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="email@domain.com"
                                value={complaintForm.data.email}
                                onChange={(e) =>
                                    complaintForm.setData(
                                        'email',
                                        e.target.value,
                                    )
                                }
                                style={{
                                    backgroundColor: '#ffffff',
                                    borderColor: '#265243',
                                    color: '#142921',
                                }}
                                className="w-full rounded-xl border-2 px-4 py-3 text-xs font-bold shadow-xs focus:ring-2 focus:ring-[#265243]/20 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-xs font-extrabold tracking-wider text-[#265243] uppercase">
                                No. Telefon / WhatsApp
                            </label>
                            <input
                                type="text"
                                placeholder="0812xxxxxxxx"
                                value={complaintForm.data.phone}
                                onChange={(e) =>
                                    complaintForm.setData(
                                        'phone',
                                        e.target.value,
                                    )
                                }
                                style={{
                                    backgroundColor: '#ffffff',
                                    borderColor: '#265243',
                                    color: '#142921',
                                }}
                                className="w-full rounded-xl border-2 px-4 py-3 text-xs font-bold shadow-xs focus:ring-2 focus:ring-[#265243]/20 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-extrabold tracking-wider text-[#265243] uppercase">
                                Subjek Pengaduan <span className="text-rose-600">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Topik / judul pengaduan..."
                                value={complaintForm.data.subject}
                                onChange={(e) =>
                                    complaintForm.setData(
                                        'subject',
                                        e.target.value,
                                    )
                                }
                                style={{
                                    backgroundColor: '#ffffff',
                                    borderColor: '#265243',
                                    color: '#142921',
                                }}
                                className="w-full rounded-xl border-2 px-4 py-3 text-xs font-bold shadow-xs focus:ring-2 focus:ring-[#265243]/20 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-extrabold tracking-wider text-[#265243] uppercase">
                            Isi Masukan & Pesan Pengaduan <span className="text-rose-600">*</span>
                        </label>
                        <textarea
                            rows={5}
                            required
                            placeholder="Tuliskan laporan pengaduan, masukan, atau saran secara detail..."
                            value={complaintForm.data.message}
                            onChange={(e) =>
                                complaintForm.setData(
                                    'message',
                                    e.target.value,
                                )
                            }
                            style={{
                                backgroundColor: '#ffffff',
                                borderColor: '#265243',
                                color: '#142921',
                            }}
                            className="w-full rounded-xl border-2 px-4 py-3 text-xs font-semibold shadow-xs focus:ring-2 focus:ring-[#265243]/20 focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={complaintForm.processing}
                        style={{
                            backgroundColor: '#265243',
                            color: '#ffffff',
                        }}
                        className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-extrabold shadow-md transition-all hover:bg-[#1a3d31] disabled:opacity-50"
                    >
                        <Send className="h-4 w-4 text-white" /> Kirim Pengaduan Sekarang
                    </button>
                </form>
            </div>
        </div>
    );
}
