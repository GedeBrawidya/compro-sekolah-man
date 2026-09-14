import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Image as ImageIcon,
    Newspaper,
    Save,
    Send,
} from 'lucide-react';
import { FormEvent, useRef, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { RichTextEditor } from '@/components/rich-text-editor';

export default function NewsCreate() {
    const { data, setData, processing, errors, setError } = useForm<{
        title: string;
        content: string;
        thumbnail: File | null;
        status: 'draft' | 'published';
    }>({
        title: '',
        content: '',
        thumbnail: null,
        status: 'published',
    });

    const [fileError, setFileError] = useState<string | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
        null,
    );
    const [confirmSaveModal, setConfirmSaveModal] = useState(false);
    const [validationErrorModal, setValidationErrorModal] = useState<{
        isOpen: boolean;
        message: string;
    }>({
        isOpen: false,
        message: '',
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (file: File | null) => {
        setFileError(null);
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setFileError('Ukuran file maksimal adalah 2MB.');
                return;
            }
            setThumbnailPreview(URL.createObjectURL(file));
        } else {
            setThumbnailPreview(null);
        }
        setData('thumbnail', file);
    };

    const handleFormPreSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!data.title.trim()) {
            setValidationErrorModal({
                isOpen: true,
                message:
                    'Judul artikel berita belum diisi. Harap masukkan judul berita terlebih dahulu!',
            });
            return;
        }

        const cleanContent = data.content.replace(/<[^>]*>/g, '').trim();
        if (!cleanContent) {
            setValidationErrorModal({
                isOpen: true,
                message:
                    'Isi konten berita belum diisi. Harap tuliskan artikel berita terlebih dahulu!',
            });
            return;
        }

        if (fileError) {
            setValidationErrorModal({
                isOpen: true,
                message: fileError,
            });
            return;
        }

        // Informative check & confirmation prompt
        setConfirmSaveModal(true);
    };

    const executeSubmit = () => {
        setConfirmSaveModal(false);
        router.post(
            '/admin/news',
            { ...data, status: data.status },
            {
                onError: (errs) => {
                    if (errs.thumbnail) setFileError(errs.thumbnail);
                    if (errs.title || errs.content) {
                        setValidationErrorModal({
                            isOpen: true,
                            message:
                                errs.title ||
                                errs.content ||
                                'Terjadi kesalahan saat menyimpan berita.',
                        });
                    }
                },
            },
        );
    };

    return (
        <>
            <Head title="Buat Berita Baru - Admin - MAN TANJUNGPINANG" />

            <div className="w-full space-y-6 p-4 sm:p-6">
                {/* Header Banner */}
                <PageHeader
                    title="Tulis & Publikasi Berita Baru"
                    description="Kelola pembuatan berita sekolah lengkap dengan editor rich text dan sampul thumbnail."
                    icon={Newspaper}
                    badge="Editor Berita"
                    action={
                        <Link
                            href="/admin/news"
                            className="inline-flex items-center gap-2 rounded-xl bg-[#265243] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#1f4337]"
                        >
                            <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar
                            Berita
                        </Link>
                    }
                />

                {/* Main Form Area */}
                <form
                    onSubmit={handleFormPreSubmit}
                    className="grid grid-cols-1 gap-6 lg:grid-cols-3"
                >
                    {/* ── Main Editor Area (Left Column) ─────────────────────────────────── */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Title input card */}
                        <div
                            style={{
                                backgroundColor: '#ffffff',
                                borderColor: '#c8dac5',
                            }}
                            className="space-y-3 rounded-2xl border p-6 shadow-sm sm:p-7"
                        >
                            <div className="flex items-center gap-2 border-l-4 border-[#265243] py-0.5 pl-3">
                                <label className="block text-xs font-extrabold tracking-wider text-[#265243] uppercase">
                                    Judul Artikel Berita{' '}
                                    <span className="text-rose-600">*</span>
                                </label>
                            </div>
                            <input
                                type="text"
                                placeholder="Tuliskan judul berita yang menarik di sini..."
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                style={{
                                    backgroundColor: '#ffffff',
                                    borderColor: '#265243',
                                    color: '#142921',
                                }}
                                className="w-full rounded-xl border-2 px-4 py-3.5 text-lg font-extrabold text-[#142921] shadow-xs transition-all placeholder:text-[#6b8e7d] focus:border-[#265243] focus:bg-white focus:ring-2 focus:ring-[#265243]/20 focus:outline-none sm:text-xl dark:text-[#142921]"
                            />
                            {errors.title && (
                                <p className="mt-1 flex items-center gap-1 text-xs font-bold text-rose-600">
                                    <AlertCircle className="h-3.5 w-3.5" />{' '}
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        {/* Rich Text Editor Card */}
                        <div
                            style={{
                                backgroundColor: '#ffffff',
                                borderColor: '#c8dac5',
                            }}
                            className="space-y-3 rounded-2xl border p-6 shadow-sm sm:p-7"
                        >
                            <div className="flex items-center gap-2 border-l-4 border-[#265243] py-0.5 pl-3">
                                <label className="block text-xs font-extrabold tracking-wider text-[#265243] uppercase">
                                    Isi Berita & Konten Teks{' '}
                                    <span className="text-rose-600">*</span>
                                </label>
                            </div>
                            <RichTextEditor
                                value={data.content}
                                onChange={(html) => setData('content', html)}
                                placeholder="Mulai menulis konten berita di sini... Anda bisa menambahkan heading, list, kutipan, dan format teks seperti Word."
                                minHeight="450px"
                            />
                            {errors.content && (
                                <p className="mt-1 flex items-center gap-1 text-xs font-bold text-rose-600">
                                    <AlertCircle className="h-3.5 w-3.5" />{' '}
                                    {errors.content}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ── Sidebar Actions & Settings (Right Column) ─────────────────────────────── */}
                    <div className="space-y-6">
                        {/* 1. Thumbnail Sampul Berita */}
                        <div
                            style={{
                                backgroundColor: '#ffffff',
                                borderColor: '#c8dac5',
                            }}
                            className="space-y-4 rounded-2xl border p-6 shadow-sm sm:p-7"
                        >
                            <div className="-ml-3 flex items-center gap-2 border-b border-l-4 border-[#265243] border-[#eef4eb] py-0.5 pb-3 pl-3">
                                <h3 className="text-sm font-extrabold text-[#142921]">
                                    Thumbnail Sampul Berita
                                </h3>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={(e) =>
                                    handleFileChange(
                                        e.target.files?.[0] || null,
                                    )
                                }
                            />

                            {thumbnailPreview ? (
                                <div className="group relative overflow-hidden rounded-xl border-2 border-[#b8ceb0] shadow-sm">
                                    <img
                                        src={thumbnailPreview}
                                        alt="Preview"
                                        className="h-48 w-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleFileChange(null)}
                                        className="absolute top-2.5 right-2.5 rounded-full bg-[#142921]/80 p-1.5 text-white shadow-md transition-colors hover:bg-rose-600"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    style={{
                                        backgroundColor: '#f4f8f3',
                                        borderColor: '#265243',
                                    }}
                                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center shadow-xs transition-all hover:bg-[#eaf2e7]"
                                >
                                    <ImageIcon className="mb-2 h-10 w-10 text-[#265243]" />
                                    <p className="text-xs font-extrabold text-[#142921]">
                                        Klik untuk upload foto sampul
                                    </p>
                                    <p className="mt-0.5 text-[11px] font-bold text-[#527365]">
                                        JPG, PNG, WEBP (Maks. 2MB)
                                    </p>
                                </div>
                            )}

                            {fileError && (
                                <p className="flex items-center gap-1 text-xs font-bold text-rose-600">
                                    <AlertCircle className="h-3.5 w-3.5" />{' '}
                                    {fileError}
                                </p>
                            )}
                        </div>

                        {/* 2. Status Publikasi & Single Save Button */}
                        <div
                            style={{
                                backgroundColor: '#ffffff',
                                borderColor: '#c8dac5',
                            }}
                            className="space-y-5 rounded-2xl border p-6 shadow-sm sm:p-7"
                        >
                            <div className="-ml-3 flex items-center gap-2 border-b border-l-4 border-[#265243] border-[#eef4eb] py-0.5 pb-3 pl-3">
                                <h3 className="text-sm font-extrabold text-[#142921]">
                                    Status Publikasi
                                </h3>
                            </div>

                            <div className="space-y-3">
                                <label
                                    onClick={() =>
                                        setData('status', 'published')
                                    }
                                    style={
                                        data.status === 'published'
                                            ? {
                                                  backgroundColor: '#265243',
                                                  color: '#ffffff',
                                              }
                                            : {
                                                  backgroundColor: '#f4f8f3',
                                                  borderColor: '#b8ceb0',
                                                  color: '#142921',
                                              }
                                    }
                                    className={`flex cursor-pointer items-start gap-3 rounded-xl p-4 transition-all ${
                                        data.status === 'published'
                                            ? 'border-0 shadow-md'
                                            : 'border-2 hover:bg-[#eaf2e7]'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="status"
                                        checked={data.status === 'published'}
                                        onChange={() =>
                                            setData('status', 'published')
                                        }
                                        className="mt-0.5 text-[#265243] focus:ring-[#265243]"
                                    />
                                    <div>
                                        <p
                                            className={`text-xs font-extrabold ${data.status === 'published' ? 'text-white' : 'text-[#142921]'}`}
                                        >
                                            Publish Langsung
                                        </p>
                                        <p
                                            className={`mt-0.5 text-[11px] font-semibold ${data.status === 'published' ? 'text-emerald-100' : 'text-[#527365]'}`}
                                        >
                                            Berita langsung dapat dibaca publik.
                                        </p>
                                    </div>
                                </label>

                                <label
                                    onClick={() => setData('status', 'draft')}
                                    style={
                                        data.status === 'draft'
                                            ? {
                                                  backgroundColor: '#265243',
                                                  color: '#ffffff',
                                              }
                                            : {
                                                  backgroundColor: '#f4f8f3',
                                                  borderColor: '#b8ceb0',
                                                  color: '#142921',
                                              }
                                    }
                                    className={`flex cursor-pointer items-start gap-3 rounded-xl p-4 transition-all ${
                                        data.status === 'draft'
                                            ? 'border-0 shadow-md'
                                            : 'border-2 hover:bg-[#eaf2e7]'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="status"
                                        checked={data.status === 'draft'}
                                        onChange={() =>
                                            setData('status', 'draft')
                                        }
                                        className="mt-0.5 text-[#265243] focus:ring-[#265243]"
                                    />
                                    <div>
                                        <p
                                            className={`text-xs font-extrabold ${data.status === 'draft' ? 'text-white' : 'text-[#142921]'}`}
                                        >
                                            Simpan sebagai Draft
                                        </p>
                                        <p
                                            className={`mt-0.5 text-[11px] font-semibold ${data.status === 'draft' ? 'text-emerald-100' : 'text-[#527365]'}`}
                                        >
                                            Disimpan sebagai draf internal dulu.
                                        </p>
                                    </div>
                                </label>
                            </div>

                            {/* Single Save Button */}
                            <div className="border-t border-[#eef4eb] pt-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    style={{
                                        backgroundColor: '#265243',
                                        color: '#ffffff',
                                    }}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-xs font-extrabold shadow-md transition-all hover:bg-[#1a3d31] disabled:opacity-50"
                                >
                                    <Save className="h-4 w-4 text-white" />{' '}
                                    Simpan Berita
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                {/* ── MODAL INFORMASI FIELD BELUM LENGKAP ── */}
                {validationErrorModal.isOpen && (
                    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs duration-150">
                        <div
                            style={{
                                backgroundColor: '#ffffff',
                                borderColor: '#b8ceb0',
                            }}
                            className="w-full max-w-sm space-y-4 rounded-2xl border p-6 text-center shadow-2xl"
                        >
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                                <AlertCircle className="h-6 w-6" />
                            </div>
                            <h3 className="text-base font-extrabold text-[#142921]">
                                Informasi Belum Lengkap
                            </h3>
                            <p className="text-xs leading-relaxed font-semibold text-[#2e5445]">
                                {validationErrorModal.message}
                            </p>
                            <button
                                type="button"
                                onClick={() =>
                                    setValidationErrorModal({
                                        isOpen: false,
                                        message: '',
                                    })
                                }
                                style={{
                                    backgroundColor: '#265243',
                                    color: '#ffffff',
                                }}
                                className="w-full rounded-xl py-2.5 text-xs font-extrabold shadow-xs transition-all hover:bg-[#1f4337]"
                            >
                                Saya Mengerti
                            </button>
                        </div>
                    </div>
                )}

                {/* ── MODAL KONFIRMASI SIMPAN BERITA ── */}
                {confirmSaveModal && (
                    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs duration-150">
                        <div
                            style={{
                                backgroundColor: '#ffffff',
                                borderColor: '#b8ceb0',
                            }}
                            className="w-full max-w-md space-y-5 rounded-2xl border p-6 text-center shadow-2xl"
                        >
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#dce8d7] text-[#265243]">
                                <Save className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-base font-extrabold text-[#142921]">
                                    Konfirmasi Simpan Berita
                                </h3>
                                <p className="mt-1.5 text-xs leading-relaxed font-semibold text-[#2e5445]">
                                    Apakah Anda yakin ingin{' '}
                                    {data.status === 'published'
                                        ? 'mempublikasikan berita ini secara langsung?'
                                        : 'menyimpan berita ini sebagai draf internal?'}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setConfirmSaveModal(false)}
                                    style={{
                                        backgroundColor: '#eef4eb',
                                        color: '#142921',
                                        borderColor: '#b8ceb0',
                                    }}
                                    className="flex-1 rounded-xl border py-2.5 text-xs font-extrabold transition-all hover:bg-[#dce8d7]"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    disabled={processing}
                                    onClick={executeSubmit}
                                    style={{
                                        backgroundColor: '#265243',
                                        color: '#ffffff',
                                    }}
                                    className="flex-1 rounded-xl py-2.5 text-xs font-extrabold shadow-xs transition-all hover:bg-[#1f4337] disabled:opacity-50"
                                >
                                    {processing
                                        ? 'Menyimpan...'
                                        : 'Ya, Simpan Berita'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
