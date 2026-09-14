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
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>()
        .props;

    const defaultLink =
        'https://docs.google.com/forms/d/e/1FAIpQLSeQFirrXnNpCuZEPGK4SOIWuBrs4c3sEPJLEoZB9l0LRWbTqw/formResponse';
    const [formLink, setFormLink] = useState(legalization_link || defaultLink);
    const [isSavingLink, setIsSavingLink] = useState(false);

    const handleSaveLink = (e: FormEvent) => {
        e.preventDefault();
        setIsSavingLink(true);
        router.post(
            '/admin/legalization/link',
            { legalization_link: formLink },
            {
                onFinish: () => setIsSavingLink(false),
            },
        );
    };

    return (
        <>
            <Head title="E-Legalisir Alumni - Admin - MAN TANJUNGPINANG" />

            <div className="w-full space-y-6 p-4 sm:p-6">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
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
                <div className="space-y-4 rounded-3xl border border-[#c8dac5] bg-white p-5 shadow-xs sm:p-6">
                    <div className="flex flex-col justify-between gap-3 border-b border-[#e2ebd9] pb-4 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#c8dac5] bg-[#f4f8f3] text-[#265243]">
                                <LinkIcon className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-extrabold text-[#142921]">
                                    Tautan Google Form E-Legalisir
                                </h3>
                                <p className="text-xs text-[#527365]">
                                    Kapan pun ada perubahan link Google Form,
                                    Anda dapat memperbaruinya di sini tanpa
                                    perlu mengubah kode web.
                                </p>
                            </div>
                        </div>

                        <a
                            href={formLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#c8dac5] bg-[#f4f8f3] px-4 py-2.5 text-xs font-bold text-[#265243] shadow-xs transition-all hover:bg-[#265243] hover:text-white"
                        >
                            <ExternalLink className="h-4 w-4" />
                            Buka Form GForm
                        </a>
                    </div>

                    <form
                        onSubmit={handleSaveLink}
                        className="flex flex-col items-center gap-3 sm:flex-row"
                    >
                        <div className="relative w-full flex-1">
                            <input
                                type="url"
                                value={formLink}
                                onChange={(e) => setFormLink(e.target.value)}
                                placeholder="https://docs.google.com/forms/d/e/..."
                                required
                                style={{
                                    backgroundColor: '#f8faf7',
                                    borderColor: '#c8dac5',
                                    color: '#142921',
                                }}
                                className="w-full rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all focus:ring-2 focus:ring-[#265243] focus:outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSavingLink}
                            style={{
                                backgroundColor: '#265243',
                                color: '#ffffff',
                            }}
                            className="inline-flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-extrabold shadow-xs transition-all hover:bg-[#1f4337] disabled:opacity-50 sm:w-auto"
                        >
                            <Save className="h-4 w-4" />
                            {isSavingLink ? 'Menyimpan...' : 'Simpan Link'}
                        </button>
                    </form>

                    <div className="flex items-start gap-3 rounded-2xl border border-[#c8dac5]/80 bg-[#f4f8f3] p-4 text-xs text-[#265243]">
                        <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#265243]" />
                        <div className="space-y-1">
                            <p className="font-extrabold">
                                Informasi Statistik & Laporan Masuk Google Form:
                            </p>
                            <p className="leading-relaxed text-[#366152]">
                                Karena pengisian e-legalisir dialihkan langsung
                                ke Google Form, statistik laporan masuk (seperti
                                grafik respon, data alumni, dan file lampiran)
                                dapat Anda pantau secara langsung dan akurat di
                                halaman{' '}
                                <strong>Jawaban / Response Google Form</strong>{' '}
                                atau <strong>Google Sheets</strong> sekolah.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

LegalizationIndex.layout = {
    breadcrumbs: [
        { title: 'E-Legalisir Layanan Publik', href: '/admin/legalization' },
    ],
};
