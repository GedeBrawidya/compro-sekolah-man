import { Head, router, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    ExternalLink,
    FileCheck,
    Info,
    Link as LinkIcon,
    Save,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import { PageHeader } from '@/components/page-header';

interface Props {
    legalization_link?: string;
}

export default function LegalizationIndex({ legalization_link }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;

    const defaultLink = 'https://docs.google.com/forms/d/e/1FAIpQLSeQFirrXnNpCuZEPGK4SOIWuBrs4c3sEPJLEoZB9l0LRWbTqw/formResponse';
    const [formLink, setFormLink] = useState(legalization_link || defaultLink);
    const [isSavingLink, setIsSavingLink] = useState(false);

    const handleSaveLink = (e: FormEvent) => {
        e.preventDefault();
        setIsSavingLink(true);
        router.post('/admin/legalization/link', { legalization_link: formLink }, {
            onFinish: () => setIsSavingLink(false),
        });
    };

    return (
        <>
            <Head title="E-Legalisir Alumni - Admin - MAN TANJUNGPINANG" />

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
                    title="E-Legalisir Alumni"
                    description="Kelola tautan Google Form E-Legalisir alumni dan informasi permohonan."
                    icon={FileCheck}
                />

                {/* Google Form Link Configuration & Info Box */}
                <div className="bg-white border border-[#c8dac5] rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e2ebd9] pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-[#f4f8f3] text-[#265243] flex items-center justify-center shrink-0 border border-[#c8dac5]">
                                <LinkIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-extrabold text-[#142921]">Tautan Google Form E-Legalisir</h3>
                                <p className="text-xs text-[#527365]">
                                    Kapan pun ada perubahan link Google Form, Anda dapat memperbaruinya di sini tanpa perlu mengubah kode web.
                                </p>
                            </div>
                        </div>

                        <a
                            href={formLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#f4f8f3] hover:bg-[#265243] text-[#265243] hover:text-white border border-[#c8dac5] text-xs font-bold transition-all shadow-xs shrink-0"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Buka Form GForm
                        </a>
                    </div>

                    <form onSubmit={handleSaveLink} className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="relative flex-1 w-full">
                            <input
                                type="url"
                                value={formLink}
                                onChange={(e) => setFormLink(e.target.value)}
                                placeholder="https://docs.google.com/forms/d/e/..."
                                required
                                style={{ backgroundColor: '#f8faf7', borderColor: '#c8dac5', color: '#142921' }}
                                className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#265243] transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSavingLink}
                            style={{ backgroundColor: '#265243', color: '#ffffff' }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl hover:bg-[#1f4337] text-xs font-extrabold transition-all shadow-xs shrink-0 cursor-pointer disabled:opacity-50 w-full sm:w-auto justify-center"
                        >
                            <Save className="w-4 h-4" />
                            {isSavingLink ? 'Menyimpan...' : 'Simpan Link'}
                        </button>
                    </form>

                    <div className="p-4 rounded-2xl bg-[#f4f8f3] border border-[#c8dac5]/80 flex items-start gap-3 text-xs text-[#265243]">
                        <Info className="w-5 h-5 shrink-0 mt-0.5 text-[#265243]" />
                        <div className="space-y-1">
                            <p className="font-extrabold">Informasi Statistik & Laporan Masuk Google Form:</p>
                            <p className="text-[#366152] leading-relaxed">
                                Karena pengisian e-legalisir dialihkan langsung ke Google Form, statistik laporan masuk (seperti grafik respon, data alumni, dan file lampiran) dapat Anda pantau secara langsung dan akurat di halaman <strong>Jawaban / Response Google Form</strong> atau <strong>Google Sheets</strong> sekolah.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

LegalizationIndex.layout = {
    breadcrumbs: [{ title: 'E-Legalisir Layanan Publik', href: '/admin/legalization' }],
};
