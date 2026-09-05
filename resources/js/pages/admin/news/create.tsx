import { Head, Link, router, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, Image as ImageIcon, Newspaper, Save, Send } from 'lucide-react';
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
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [confirmSaveModal, setConfirmSaveModal] = useState(false);
    const [validationErrorModal, setValidationErrorModal] = useState<{ isOpen: boolean; message: string }>({
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
                message: 'Judul artikel berita belum diisi. Harap masukkan judul berita terlebih dahulu!',
            });
            return;
        }

        const cleanContent = data.content.replace(/<[^>]*>/g, '').trim();
        if (!cleanContent) {
            setValidationErrorModal({
                isOpen: true,
                message: 'Isi konten berita belum diisi. Harap tuliskan artikel berita terlebih dahulu!',
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
        router.post('/admin/news', { ...data, status: data.status }, {
            onError: (errs) => {
                if (errs.thumbnail) setFileError(errs.thumbnail);
                if (errs.title || errs.content) {
                    setValidationErrorModal({
                        isOpen: true,
                        message: errs.title || errs.content || 'Terjadi kesalahan saat menyimpan berita.',
                    });
                }
            },
        });
    };

    return (
        <>
            <Head title="Buat Berita Baru - Admin - MAN TANJUNG PINANG" />

            <div className="p-4 sm:p-6 w-full space-y-6">
                {/* Header Banner */}
                <PageHeader
                    title="Tulis & Publikasi Berita Baru"
                    description="Kelola pembuatan berita sekolah lengkap dengan editor rich text dan sampul thumbnail."
                    icon={Newspaper}
                    badge="Editor Berita"
                    action={
                        <Link
                            href="/admin/news"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#265243] text-white font-bold text-xs hover:bg-[#1f4337] transition-all shadow-xs"
                        >
                            <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Berita
                        </Link>
                    }
                />

                {/* Main Form Area */}
                <form onSubmit={handleFormPreSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* ── Main Editor Area (Left Column) ─────────────────────────────────── */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title input card */}
                        <div style={{ backgroundColor: '#ffffff', borderColor: '#c8dac5' }} className="p-6 sm:p-7 rounded-2xl border shadow-sm space-y-3">
                            <div className="flex items-center gap-2 border-l-4 border-[#265243] pl-3 py-0.5">
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#265243]">
                                    Judul Artikel Berita <span className="text-rose-600">*</span>
                                </label>
                            </div>
                            <input
                                type="text"
                                placeholder="Tuliskan judul berita yang menarik di sini..."
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                style={{ backgroundColor: '#ffffff', borderColor: '#265243', color: '#142921' }}
                                className="w-full text-lg sm:text-xl font-extrabold px-4 py-3.5 rounded-xl border-2 shadow-xs focus:ring-2 focus:ring-[#265243]/20 focus:border-[#265243] focus:outline-none placeholder:text-[#6b8e7d] text-[#142921] dark:text-[#142921] focus:bg-white transition-all"
                            />
                            {errors.title && (
                                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-bold">
                                    <AlertCircle className="w-3.5 h-3.5" /> {errors.title}
                                </p>
                            )}
                        </div>

                        {/* Rich Text Editor Card */}
                        <div style={{ backgroundColor: '#ffffff', borderColor: '#c8dac5' }} className="p-6 sm:p-7 rounded-2xl shadow-sm border space-y-3">
                            <div className="flex items-center gap-2 border-l-4 border-[#265243] pl-3 py-0.5">
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#265243]">
                                    Isi Berita & Konten Teks <span className="text-rose-600">*</span>
                                </label>
                            </div>
                            <RichTextEditor
                                value={data.content}
                                onChange={(html) => setData('content', html)}
                                placeholder="Mulai menulis konten berita di sini... Anda bisa menambahkan heading, list, kutipan, dan format teks seperti Word."
                                minHeight="450px"
                            />
                            {errors.content && (
                                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-bold">
                                    <AlertCircle className="w-3.5 h-3.5" /> {errors.content}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ── Sidebar Actions & Settings (Right Column) ─────────────────────────────── */}
                    <div className="space-y-6">
                        {/* 1. Thumbnail Sampul Berita */}
                        <div style={{ backgroundColor: '#ffffff', borderColor: '#c8dac5' }} className="p-6 sm:p-7 rounded-2xl shadow-sm border space-y-4">
                            <div className="flex items-center gap-2 border-l-4 border-[#265243] pl-3 py-0.5 border-b border-[#eef4eb] pb-3 -ml-3 pl-3">
                                <h3 className="text-sm font-extrabold text-[#142921]">
                                    Thumbnail Sampul Berita
                                </h3>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                            />

                            {thumbnailPreview ? (
                                <div className="relative rounded-xl overflow-hidden border-2 border-[#b8ceb0] group shadow-sm">
                                    <img src={thumbnailPreview} alt="Preview" className="w-full h-48 object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => handleFileChange(null)}
                                        className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-[#142921]/80 text-white hover:bg-rose-600 transition-colors shadow-md"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{ backgroundColor: '#f4f8f3', borderColor: '#265243' }}
                                    className="p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-[#eaf2e7] shadow-xs"
                                >
                                    <ImageIcon className="w-10 h-10 text-[#265243] mb-2" />
                                    <p className="text-xs font-extrabold text-[#142921]">Klik untuk upload foto sampul</p>
                                    <p className="text-[11px] text-[#527365] font-bold mt-0.5">JPG, PNG, WEBP (Maks. 2MB)</p>
                                </div>
                            )}

                            {fileError && (
                                <p className="text-xs text-rose-600 flex items-center gap-1 font-bold">
                                    <AlertCircle className="w-3.5 h-3.5" /> {fileError}
                                </p>
                            )}
                        </div>

                        {/* 2. Status Publikasi & Single Save Button */}
                        <div style={{ backgroundColor: '#ffffff', borderColor: '#c8dac5' }} className="p-6 sm:p-7 rounded-2xl shadow-sm border space-y-5">
                            <div className="flex items-center gap-2 border-l-4 border-[#265243] pl-3 py-0.5 border-b border-[#eef4eb] pb-3 -ml-3 pl-3">
                                <h3 className="text-sm font-extrabold text-[#142921]">
                                    Status Publikasi
                                </h3>
                            </div>

                            <div className="space-y-3">
                                <label
                                    onClick={() => setData('status', 'published')}
                                    style={
                                        data.status === 'published'
                                            ? { backgroundColor: '#265243', color: '#ffffff' }
                                            : { backgroundColor: '#f4f8f3', borderColor: '#b8ceb0', color: '#142921' }
                                    }
                                    className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                                        data.status === 'published' ? 'shadow-md border-0' : 'border-2 hover:bg-[#eaf2e7]'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="status"
                                        checked={data.status === 'published'}
                                        onChange={() => setData('status', 'published')}
                                        className="mt-0.5 text-[#265243] focus:ring-[#265243]"
                                    />
                                    <div>
                                        <p className={`text-xs font-extrabold ${data.status === 'published' ? 'text-white' : 'text-[#142921]'}`}>
                                            Publish Langsung
                                        </p>
                                        <p className={`text-[11px] font-semibold mt-0.5 ${data.status === 'published' ? 'text-emerald-100' : 'text-[#527365]'}`}>
                                            Berita langsung dapat dibaca publik.
                                        </p>
                                    </div>
                                </label>

                                <label
                                    onClick={() => setData('status', 'draft')}
                                    style={
                                        data.status === 'draft'
                                            ? { backgroundColor: '#265243', color: '#ffffff' }
                                            : { backgroundColor: '#f4f8f3', borderColor: '#b8ceb0', color: '#142921' }
                                    }
                                    className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                                        data.status === 'draft' ? 'shadow-md border-0' : 'border-2 hover:bg-[#eaf2e7]'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="status"
                                        checked={data.status === 'draft'}
                                        onChange={() => setData('status', 'draft')}
                                        className="mt-0.5 text-[#265243] focus:ring-[#265243]"
                                    />
                                    <div>
                                        <p className={`text-xs font-extrabold ${data.status === 'draft' ? 'text-white' : 'text-[#142921]'}`}>
                                            Simpan sebagai Draft
                                        </p>
                                        <p className={`text-[11px] font-semibold mt-0.5 ${data.status === 'draft' ? 'text-emerald-100' : 'text-[#527365]'}`}>
                                            Disimpan sebagai draf internal dulu.
                                        </p>
                                    </div>
                                </label>
                            </div>

                            {/* Single Save Button */}
                            <div className="pt-3 border-t border-[#eef4eb]">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    style={{ backgroundColor: '#265243', color: '#ffffff' }}
                                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl hover:bg-[#1a3d31] text-xs font-extrabold shadow-md transition-all disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4 text-white" /> Simpan Berita
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                {/* ── MODAL INFORMASI FIELD BELUM LENGKAP ── */}
                {validationErrorModal.isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
                        <div
                            style={{ backgroundColor: '#ffffff', borderColor: '#b8ceb0' }}
                            className="w-full max-w-sm rounded-2xl shadow-2xl border p-6 text-center space-y-4"
                        >
                            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-extrabold text-[#142921]">
                                Informasi Belum Lengkap
                            </h3>
                            <p className="text-xs font-semibold text-[#2e5445] leading-relaxed">
                                {validationErrorModal.message}
                            </p>
                            <button
                                type="button"
                                onClick={() => setValidationErrorModal({ isOpen: false, message: '' })}
                                style={{ backgroundColor: '#265243', color: '#ffffff' }}
                                className="w-full py-2.5 rounded-xl font-extrabold text-xs hover:bg-[#1f4337] transition-all shadow-xs"
                            >
                                Saya Mengerti
                            </button>
                        </div>
                    </div>
                )}

                {/* ── MODAL KONFIRMASI SIMPAN BERITA ── */}
                {confirmSaveModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
                        <div
                            style={{ backgroundColor: '#ffffff', borderColor: '#b8ceb0' }}
                            className="w-full max-w-md rounded-2xl shadow-2xl border p-6 text-center space-y-5"
                        >
                            <div className="w-12 h-12 rounded-full bg-[#dce8d7] text-[#265243] flex items-center justify-center mx-auto">
                                <Save className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-base font-extrabold text-[#142921]">
                                    Konfirmasi Simpan Berita
                                </h3>
                                <p className="text-xs font-semibold text-[#2e5445] mt-1.5 leading-relaxed">
                                    Apakah Anda yakin ingin {data.status === 'published' ? 'mempublikasikan berita ini secara langsung?' : 'menyimpan berita ini sebagai draf internal?'}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setConfirmSaveModal(false)}
                                    style={{ backgroundColor: '#eef4eb', color: '#142921', borderColor: '#b8ceb0' }}
                                    className="flex-1 py-2.5 rounded-xl border text-xs font-extrabold hover:bg-[#dce8d7] transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    disabled={processing}
                                    onClick={executeSubmit}
                                    style={{ backgroundColor: '#265243', color: '#ffffff' }}
                                    className="flex-1 py-2.5 rounded-xl text-xs font-extrabold hover:bg-[#1f4337] transition-all shadow-xs disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Ya, Simpan Berita'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
