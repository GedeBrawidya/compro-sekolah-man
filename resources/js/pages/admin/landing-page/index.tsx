import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    Building2,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Clock,
    Edit3,
    GraduationCap,
    History,
    Image as ImageIcon,
    LayoutTemplate,
    MapPin,
    Phone,
    Plus,
    Save,
    Target,
    Trash2,
    Video,
    X,
    AlertTriangle,
} from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { PageHeader } from '@/components/page-header';

/* ─── Types ──────────────────────────────────────────────────────────── */
interface BannerItem {
    id: number;
    title: string;
    subtitle: string | null;
    image: string | null;
    button_text: string | null;
    button_link: string | null;
    order: number;
    is_active: boolean;
}

interface MilestoneItem {
    id: number;
    year: number;
    title: string;
    description: string | null;
    order: number;
}

interface Props {
    banners: BannerItem[];
    settings: Record<string, string | null>;
    milestones: MilestoneItem[];
    flash: { success?: string; error?: string };
}

type TabKey = 'banner' | 'sekolah' | 'media' | 'kepala' | 'visi' | 'sejarah' | 'footer';

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: 'banner', label: 'Banner Slider', icon: LayoutTemplate },
    { key: 'sekolah', label: 'Profil Sekolah', icon: Building2 },
    { key: 'media', label: 'Media Sambutan', icon: Video },
    { key: 'kepala', label: 'Kepala Sekolah', icon: GraduationCap },
    { key: 'visi', label: 'Visi & Misi', icon: Target },
    { key: 'sejarah', label: 'Sejarah Singkat', icon: History },
    { key: 'footer', label: 'Footer', icon: MapPin },
];

const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024; // 3MB limit for file uploads

/* ─── Field helpers ──────────────────────────────────────────────────── */
function FieldInput({
    label, value, onChange, placeholder = '', type = 'text', required = false,
}: { label?: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; required?: boolean }) {
    return (
        <div>
            {label && (
                <label className="block text-xs font-semibold text-[#142921] mb-1.5">
                    {label} {required && <span className="text-rose-500">*</span>}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                style={{ backgroundColor: '#e4ebe2', borderColor: '#b8ceb0', color: '#142921' }}
                className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#265243] focus:bg-white transition-all placeholder:text-[#527365]"
            />
        </div>
    );
}

function FieldTextarea({
    label, value, onChange, placeholder = '', rows = 4,
}: { label?: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
    return (
        <div>
            {label && <label className="block text-xs font-semibold text-[#142921] mb-1.5">{label}</label>}
            <textarea
                rows={rows}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                style={{ backgroundColor: '#e4ebe2', borderColor: '#b8ceb0', color: '#142921' }}
                className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#265243] focus:bg-white transition-all resize-y placeholder:text-[#527365]"
            />
        </div>
    );
}

/* ─── Banner Form Modal ──────────────────────────────────────────────── */
function BannerModal({
    editing,
    onClose,
}: { editing: BannerItem | null; onClose: () => void }) {
    const [title, setTitle] = useState(editing?.title ?? '');
    const [subtitle, setSubtitle] = useState(editing?.subtitle ?? '');
    const [isActive, setIsActive] = useState(editing?.is_active ?? true);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(editing?.image ?? null);
    const [processing, setProcessing] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFile = (f: File | null) => {
        if (!f) return;
        if (f.size > MAX_FILE_SIZE_BYTES) {
            alert(`Ukuran foto banner (${(f.size / (1024 * 1024)).toFixed(1)}MB) melebihi batas maksimal 3MB. Silakan pilih foto dengan ukuran lebih kecil.`);
            if (fileRef.current) fileRef.current.value = '';
            return;
        }
        setImageFile(f);
        setImagePreview(URL.createObjectURL(f));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const payload = { title, subtitle, button_text: '', button_link: '', is_active: isActive ? 1 : 0, image: imageFile };

        if (editing) {
            router.post(`/admin/landing-page/banners/${editing.id}`, { _method: 'PUT', ...payload }, {
                onFinish: () => { setProcessing(false); onClose(); },
            });
        } else {
            router.post('/admin/landing-page/banners', payload as any, {
                onFinish: () => { setProcessing(false); onClose(); },
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div style={{ backgroundColor: '#ffffff', borderColor: '#c8dac5' }} className="w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#b8ceb0]/40">
                    <h3 className="text-base font-bold text-[#142921]">
                        {editing ? 'Edit Banner' : 'Tambah Banner Baru'}
                    </h3>
                    <button onClick={onClose} className="text-[#527365] hover:text-[#142921] transition-colors cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-xs font-semibold text-[#142921] mb-1.5">Gambar Banner</label>
                        {imagePreview ? (
                            <div className="relative mb-2">
                                <img src={imagePreview} alt="preview" className="w-full h-40 object-cover rounded-xl border border-[#b8ceb0]" />
                                <button
                                    type="button"
                                    onClick={() => { setImagePreview(null); setImageFile(null); if (fileRef.current) fileRef.current.value = ''; }}
                                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 text-rose-600 hover:bg-white shadow-xs text-xs font-bold flex items-center gap-1 cursor-pointer"
                                >✕</button>
                            </div>
                        ) : (
                            <div
                                onClick={() => fileRef.current?.click()}
                                style={{ backgroundColor: '#eef4eb', borderColor: '#b8ceb0' }}
                                className="w-full h-36 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#265243] hover:bg-[#dce8d7] transition-all"
                            >
                                <ImageIcon className="w-8 h-8 text-[#265243]" />
                                <p className="text-xs text-[#2e5445] text-center font-medium">Klik untuk upload gambar<br /><span className="text-[10px] text-[#527365]">(Maksimal 3MB, resolusi 1920×600)</span></p>
                            </div>
                        )}
                        <input ref={fileRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0] || null)} />
                    </div>

                    <FieldInput label="Judul Banner" value={title} onChange={setTitle} placeholder="Selamat Datang di..." required />
                    <FieldInput label="Sub-judul / Deskripsi" value={subtitle} onChange={setSubtitle} placeholder="Kami berkomitmen untuk..." />

                    <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
                        <div
                            onClick={() => setIsActive(!isActive)}
                            className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 ${isActive ? 'bg-[#265243]' : 'bg-[#b8ceb0]'}`}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                        </div>
                        <span className="text-xs text-[#142921] font-semibold">Banner aktif (tampil di halaman publik)</span>
                    </label>

                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#b8ceb0]/40">
                        <button
                            type="button"
                            onClick={onClose}
                            style={{ backgroundColor: '#eef4eb', borderColor: '#b8ceb0', color: '#265243' }}
                            className="px-4 py-2 text-xs font-semibold rounded-xl border hover:bg-[#dce8d7] transition-all cursor-pointer"
                        >
                            Batal
                        </button>
                        <button type="submit" disabled={processing || !title} className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#265243] text-white text-xs font-bold hover:bg-[#1f4337] disabled:opacity-50 transition-all shadow-xs cursor-pointer">
                            <Save className="w-4 h-4" /> {editing ? 'Simpan Perubahan' : 'Tambah Banner'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ─── Main Page ──────────────────────────────────────────────────────── */
export default function LandingPageIndex({ banners, settings, milestones = [], flash }: Props) {
    const page = usePage();
    const flashSuccess = flash?.success || (page.props as any).flash?.success;
    const flashError = flash?.error || (page.props as any).flash?.error;

    const [toastModalMsg, setToastModalMsg] = useState<{ type: 'success' | 'error'; title: string; msg: string } | null>(null);

    useEffect(() => {
        if (flashSuccess) {
            setToastModalMsg({ type: 'success', title: 'Berhasil!', msg: flashSuccess });
        } else if (flashError) {
            setToastModalMsg({ type: 'error', title: 'Terjadi Kesalahan!', msg: flashError });
        }
    }, [flashSuccess, flashError]);

    const handleFileSelect = (
        f: File | null,
        setFile: (file: File | null) => void,
        setPreview: (url: string | null) => void,
        ref: React.RefObject<HTMLInputElement>,
        labelName: string
    ) => {
        if (!f) return;
        if (f.size > MAX_FILE_SIZE_BYTES) {
            setToastModalMsg({
                type: 'error',
                title: 'Ukuran Foto Terlalu Besar!',
                msg: `Ukuran ${labelName} (${(f.size / (1024 * 1024)).toFixed(1)}MB) melebihi batas maksimal 3MB. Silakan pilih foto dengan ukuran di bawah 3MB.`,
            });
            if (ref.current) ref.current.value = '';
            return;
        }
        setFile(f);
        setPreview(URL.createObjectURL(f));
    };

    const [activeTab, setActiveTab] = useState<TabKey>('banner');
    const [bannerModal, setBannerModal] = useState<{ open: boolean; editing: BannerItem | null }>({ open: false, editing: null });
    const [saving, setSaving] = useState(false);

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
        confirmText: 'Hapus',
        onConfirm: () => {},
    });

    /* Milestone (Sejarah Singkat) State */
    /* Milestone (Sejarah Singkat) — Inertia prop, auto-updated after router.post/delete */
    const [milestoneModal, setMilestoneModal] = useState<{ open: boolean; editing: MilestoneItem | null }>({ open: false, editing: null });
    const [milestoneYear, setMilestoneYear] = useState('');
    const [milestoneTitle, setMilestoneTitle] = useState('');
    const [milestoneDesc, setMilestoneDesc] = useState('');
    const [milestoneSaving, setMilestoneSaving] = useState(false);

    const openMilestoneModal = (editing: MilestoneItem | null) => {
        setMilestoneModal({ open: true, editing });
        setMilestoneYear(editing ? String(editing.year) : new Date().getFullYear().toString());
        setMilestoneTitle(editing ? editing.title : '');
        setMilestoneDesc(editing ? (editing.description ?? '') : '');
    };

    const closeMilestoneModal = () => {
        setMilestoneModal({ open: false, editing: null });
        setMilestoneYear('');
        setMilestoneTitle('');
        setMilestoneDesc('');
    };

    const handleMilestoneSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMilestoneSaving(true);
        const payload = { year: parseInt(milestoneYear), title: milestoneTitle, description: milestoneDesc };
        if (milestoneModal.editing) {
            router.post(`/admin/landing-page/milestones/${milestoneModal.editing.id}`, { _method: 'PUT', ...payload }, {
                onFinish: () => { setMilestoneSaving(false); closeMilestoneModal(); },
            });
        } else {
            router.post('/admin/landing-page/milestones', payload, {
                onFinish: () => { setMilestoneSaving(false); closeMilestoneModal(); },
            });
        }
    };

    const deleteMilestone = (ms: MilestoneItem) => {
        setConfirmModal({
            isOpen: true,
            title: 'Hapus Milestone',
            description: `Hapus milestone "${ms.title} (${ms.year})"?`,
            confirmText: 'Ya, Hapus',
            onConfirm: () => {
                router.delete(`/admin/landing-page/milestones/${ms.id}`, {
                    onFinish: () => setConfirmModal((prev) => ({ ...prev, isOpen: false })),
                });
            },
        });
    };

    /* Profil Sekolah State */
    const [schoolName, setSchoolName] = useState(settings.school_name ?? '');
    const [schoolNpsn, setSchoolNpsn] = useState(settings.school_npsn ?? '');
    const [schoolStatus, setSchoolStatus] = useState(settings.school_status ?? '');
    const [schoolTagline, setSchoolTagline] = useState(settings.school_tagline ?? '');
    const [schoolAddress, setSchoolAddress] = useState(settings.school_address ?? '');
    const [schoolPhone, setSchoolPhone] = useState(settings.school_phone ?? '');
    const [schoolEmail, setSchoolEmail] = useState(settings.school_email ?? '');
    const [schoolWebsite, setSchoolWebsite] = useState(settings.school_website ?? '');
    const [schoolDesc, setSchoolDesc] = useState(settings.school_description ?? '');

    const [totalStudents, setTotalStudents] = useState(settings.total_students ?? '');
    const [totalTeachers, setTotalTeachers] = useState(settings.total_teachers ?? '');
    const [totalClassrooms, setTotalClassrooms] = useState(settings.total_classrooms ?? '');
    const [accreditation, setAccreditation] = useState(settings.accreditation ?? '');

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(settings.school_logo ?? null);
    const logoRef = useRef<HTMLInputElement>(null);

    /* Kepala Sekolah & Media State */
    const [principalName, setPrincipalName] = useState(settings.principal_name ?? '');
    const [principalTitle, setPrincipalTitle] = useState(settings.principal_title ?? '');
    const [principalBio, setPrincipalBio] = useState(settings.principal_bio ?? '');
    const [principalMediaType, setPrincipalMediaType] = useState<'video' | 'photo'>((settings.principal_media_type as any) ?? 'video');
    const [principalVideoUrl, setPrincipalVideoUrl] = useState(settings.principal_video_url ?? '');

    const [principalPhotoFile, setPrincipalPhotoFile] = useState<File | null>(null);
    const [principalPhotoPreview, setPrincipalPhotoPreview] = useState<string | null>(settings.principal_photo_url ?? null);
    const principalPhotoRef = useRef<HTMLInputElement>(null);

    const [principalMediaPhotoFile, setPrincipalMediaPhotoFile] = useState<File | null>(null);
    const [principalMediaPhotoPreview, setPrincipalMediaPhotoPreview] = useState<string | null>(settings.principal_media_photo_url ?? settings.principal_photo_url ?? null);
    const principalMediaPhotoRef = useRef<HTMLInputElement>(null);

    /* Visi Misi State */
    const [vision, setVision] = useState(settings.vision ?? '');
    const [mission, setMission] = useState(settings.mission ?? '');

    /* Footer State */
    const [footerCopyright, setFooterCopyright] = useState(settings.footer_copyright ?? '');
    const [footerAddress, setFooterAddress] = useState(settings.footer_address ?? '');
    const [footerPhone, setFooterPhone] = useState(settings.footer_phone ?? '');
    const [footerEmail, setFooterEmail] = useState(settings.footer_email ?? '');
    const [footerFacebook, setFooterFacebook] = useState(settings.footer_facebook ?? '');
    const [footerInstagram, setFooterInstagram] = useState(settings.footer_instagram ?? '');
    const [footerYoutube, setFooterYoutube] = useState(settings.footer_youtube ?? '');
    const [footerBannerTitle, setFooterBannerTitle] = useState(settings.footer_banner_title ?? '');
    const [footerBannerSubtitle, setFooterBannerSubtitle] = useState(settings.footer_banner_subtitle ?? '');

    const [footerBannerBgFile, setFooterBannerBgFile] = useState<File | null>(null);
    const [footerBannerBgPreview, setFooterBannerBgPreview] = useState<string | null>(settings.footer_banner_bg_url ?? null);
    const footerBannerBgRef = useRef<HTMLInputElement>(null);

    const saveSettings = (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const data: Record<string, any> = {
            school_name: schoolName,
            school_npsn: schoolNpsn,
            school_status: schoolStatus,
            school_tagline: schoolTagline,
            school_address: schoolAddress,
            school_phone: schoolPhone,
            school_email: schoolEmail,
            school_website: schoolWebsite,
            school_description: schoolDesc,
            total_students: totalStudents,
            total_teachers: totalTeachers,
            total_classrooms: totalClassrooms,
            accreditation: accreditation,
            principal_name: principalName,
            principal_title: principalTitle,
            principal_bio: principalBio,
            principal_media_type: principalMediaType,
            principal_video_url: principalVideoUrl,
            vision,
            mission,
            footer_copyright: footerCopyright,
            footer_address: footerAddress,
            footer_phone: footerPhone,
            footer_email: footerEmail,
            footer_facebook: footerFacebook,
            footer_instagram: footerInstagram,
            footer_youtube: footerYoutube,
            footer_banner_title: footerBannerTitle,
            footer_banner_subtitle: footerBannerSubtitle,
        };

        if (logoFile) data.school_logo = logoFile;
        if (principalPhotoFile) data.principal_photo = principalPhotoFile;
        if (principalMediaPhotoFile) data.principal_media_photo = principalMediaPhotoFile;
        if (footerBannerBgFile) data.footer_banner_bg = footerBannerBgFile;

        router.post('/admin/landing-page/settings', data, {
            onFinish: () => setSaving(false),
            onError: () => setSaving(false),
        });
    };

    const deleteBanner = (banner: BannerItem) => {
        setConfirmModal({
            isOpen: true,
            title: 'Hapus Banner',
            description: `Apakah Anda yakin ingin menghapus banner "${banner.title}"?`,
            confirmText: 'Ya, Hapus',
            onConfirm: () => {
                router.delete(`/admin/landing-page/banners/${banner.id}`, {
                    onFinish: () => setConfirmModal((prev) => ({ ...prev, isOpen: false })),
                });
            },
        });
    };

    return (
        <>
            <Head title="CMS Beranda - Admin - MAN TANJUNG PINANG" />

            <div className="p-6 space-y-6 w-full">
                <PageHeader
                    title="CMS Beranda"
                    description="Kelola konten halaman utama (landing page) website sekolah."
                    icon={LayoutTemplate}
                />

                {/* Tab Navigation */}
                <div style={{ backgroundColor: '#e8efe5', borderColor: '#b8ceb0' }} className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl border shadow-xs">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const active = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                style={
                                    active
                                        ? { backgroundColor: '#265243', color: '#ffffff' }
                                        : { backgroundColor: 'transparent', color: '#265243' }
                                }
                                className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                                    active
                                        ? 'shadow-xs'
                                        : 'hover:bg-[#d8e4d5]'
                                }`}
                            >
                                <Icon className="w-4 h-4" /> {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* ────────── BANNER TAB ────────── */}
                {activeTab === 'banner' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-[#2e5445]">Kelola slide banner yang tampil di bagian atas halaman utama.</p>
                            <button
                                onClick={() => setBannerModal({ open: true, editing: null })}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#265243] text-white text-xs font-bold hover:bg-[#1f4337] shadow-xs transition-all cursor-pointer"
                            >
                                <Plus className="w-4 h-4" /> Tambah Banner
                            </button>
                        </div>

                        {banners.length === 0 ? (
                            <div
                                style={{ backgroundColor: '#e8efe5', borderColor: '#b8ceb0' }}
                                className="p-16 rounded-2xl border-2 border-dashed text-center shadow-xs"
                            >
                                <ImageIcon className="w-10 h-10 text-[#265243]/40 mx-auto mb-3" />
                                <p className="text-[#2e5445] text-xs font-semibold">Belum ada banner. Klik &quot;Tambah Banner&quot; untuk menambahkan slide pertama.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {banners.map((b) => (
                                    <div
                                        key={b.id}
                                        style={{ backgroundColor: '#e8efe5', borderColor: '#b8ceb0' }}
                                        className={`rounded-2xl border shadow-xs overflow-hidden flex items-stretch transition-all hover:shadow-md ${
                                            b.is_active ? '' : 'opacity-60'
                                        }`}
                                    >
                                        {/* Image preview */}
                                        {b.image ? (
                                            <img src={b.image} alt={b.title} className="w-36 sm:w-48 object-cover flex-shrink-0" />
                                        ) : (
                                            <div style={{ backgroundColor: '#eef4eb' }} className="w-36 sm:w-48 flex items-center justify-center flex-shrink-0">
                                                <ImageIcon className="w-8 h-8 text-[#265243]/40" />
                                            </div>
                                        )}

                                        <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-bold text-[#142921] text-base">{b.title}</p>
                                                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${b.is_active ? 'bg-[#265243] text-white' : 'bg-[#8fa89b] text-white'}`}>
                                                        {b.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </span>
                                                </div>
                                                {b.subtitle && <p className="text-xs text-[#2e5445] font-semibold line-clamp-2">{b.subtitle}</p>}
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <button
                                                    onClick={() => setBannerModal({ open: true, editing: b })}
                                                    style={{ backgroundColor: '#eef4eb', borderColor: '#b8ceb0', color: '#265243' }}
                                                    className="p-2 rounded-xl border hover:bg-[#dce8d7] transition-all cursor-pointer"
                                                    title="Edit"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteBanner(b)}
                                                    className="p-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Banner Modal */}
                        {bannerModal.open && (
                            <BannerModal editing={bannerModal.editing} onClose={() => setBannerModal({ open: false, editing: null })} />
                        )}
                    </div>
                )}

                {/* ────────── PROFIL SEKOLAH TAB ────────── */}
                {activeTab === 'sekolah' && (
                    <form onSubmit={saveSettings} className="space-y-5">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Logo */}
                            <div style={{ backgroundColor: '#e8efe5', borderColor: '#b8ceb0' }} className="rounded-2xl border p-5 shadow-xs flex flex-col items-center gap-4">
                                <h3 className="text-sm font-extrabold text-[#142921] w-full">Logo Sekolah</h3>
                                {logoPreview ? (
                                    <div className="relative">
                                        <img src={logoPreview} alt="logo" className="w-32 h-32 object-contain rounded-xl border border-[#b8ceb0] bg-white p-2" />
                                        <button
                                            type="button"
                                            onClick={() => { setLogoPreview(null); setLogoFile(null); if (logoRef.current) logoRef.current.value = ''; }}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-rose-600 text-white rounded-full text-xs flex items-center justify-center shadow-xs hover:bg-rose-700 cursor-pointer"
                                        >✕</button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => logoRef.current?.click()}
                                        style={{ backgroundColor: '#e4ebe2', borderColor: '#b8ceb0' }}
                                        className="w-32 h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#265243] hover:bg-[#dce8d7] transition-all"
                                    >
                                        <ImageIcon className="w-8 h-8 text-[#265243]" />
                                        <p className="text-[10px] text-[#2e5445] font-semibold text-center">Upload Logo</p>
                                    </div>
                                )}
                                <input ref={logoRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e.target.files?.[0] || null, setLogoFile, setLogoPreview, logoRef, 'Logo Sekolah')} />
                                <button type="button" onClick={() => logoRef.current?.click()} className="text-xs text-[#265243] font-bold underline hover:text-[#1f4337] cursor-pointer">
                                    {logoPreview ? 'Ganti Logo' : 'Pilih Logo'}
                                </button>
                            </div>

                            {/* Identitas */}
                            <div style={{ backgroundColor: '#e8efe5', borderColor: '#b8ceb0' }} className="lg:col-span-2 rounded-2xl border p-5 shadow-xs space-y-4">
                                <h3 className="text-sm font-extrabold text-[#142921]">Identitas Sekolah</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FieldInput label="Nama Sekolah" value={schoolName} onChange={setSchoolName} placeholder="MAN Contoh Kota" required />
                                    <FieldInput label="NPSN" value={schoolNpsn} onChange={setSchoolNpsn} placeholder="12345678" />
                                    <FieldInput label="Status Sekolah" value={schoolStatus} onChange={setSchoolStatus} placeholder="Negeri / Swasta" />
                                    <FieldInput label="Website" value={schoolWebsite} onChange={setSchoolWebsite} placeholder="https://mancontoh.sch.id" />
                                    <FieldInput label="Telepon" value={schoolPhone} onChange={setSchoolPhone} placeholder="(0274) 123456" type="tel" />
                                    <FieldInput label="Email" value={schoolEmail} onChange={setSchoolEmail} placeholder="info@mancontoh.sch.id" type="email" />
                                </div>
                                <div className="pt-2 border-t border-[#b8ceb0]/40 space-y-3">
                                    <h4 className="text-xs font-bold text-[#265243] uppercase tracking-wider">Data Statistik (Banner Strip Beranda)</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <FieldInput label="Siswa Aktif" value={totalStudents} onChange={setTotalStudents} placeholder="850+" />
                                        <FieldInput label="Guru & Staf" value={totalTeachers} onChange={setTotalTeachers} placeholder="54+" />
                                        <FieldInput label="Ruang Kelas" value={totalClassrooms} onChange={setTotalClassrooms} placeholder="24" />
                                        <FieldInput label="Akreditasi" value={accreditation} onChange={setAccreditation} placeholder="A (Unggul)" />
                                    </div>
                                </div>
                                <FieldInput label="Tagline / Moto Sekolah" value={schoolTagline} onChange={setSchoolTagline} placeholder="Unggul dalam Prestasi, Mulia dalam Akhlak" />
                                <FieldTextarea label="Alamat Lengkap" value={schoolAddress} onChange={setSchoolAddress} placeholder="Jl. Contoh No. 1, Kecamatan..." rows={2} />
                                <FieldTextarea label="Deskripsi Singkat Sekolah" value={schoolDesc} onChange={setSchoolDesc} placeholder="Deskripsi singkat sekolah untuk ditampilkan di halaman utama..." rows={4} />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#265243] text-white text-xs font-bold hover:bg-[#1f4337] disabled:opacity-50 shadow-xs transition-all cursor-pointer">
                                <Save className="w-4 h-4" /> {saving ? 'Menyimpan...' : 'Simpan Profil Sekolah'}
                            </button>
                        </div>
                    </form>
                )}

                {/* ────────── MEDIA SAMBUTAN TAB (DEDICATED PINTASAN) ────────── */}
                {activeTab === 'media' && (
                    <form onSubmit={saveSettings} className="space-y-5">
                        <div style={{ backgroundColor: '#e8efe5', borderColor: '#b8ceb0' }} className="rounded-2xl border p-6 shadow-xs space-y-6">
                            <div className="border-b border-[#b8ceb0]/40 pb-4">
                                <h3 className="text-base font-extrabold text-[#142921] flex items-center gap-2">
                                    <Video className="w-5 h-5 text-[#265243]" /> Media Atas Kata Sambutan (Video / Foto)
                                </h3>
                                <p className="text-xs text-[#527365] mt-1 font-medium">
                                    Pilih jenis media yang akan ditampilkan di atas Kata Sambutan Kepala Sekolah pada beranda website. Anda dapat memilih antara **Video YouTube** atau **Foto Media Utama**.
                                </p>
                            </div>

                            {/* Pilihan Tipe Media Utama */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-[#142921] uppercase tracking-wider">Pilih Tipe Media Utama</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Opsi 1: Video YouTube */}
                                    <div
                                        onClick={() => setPrincipalMediaType('video')}
                                        style={
                                            principalMediaType === 'video'
                                                ? { backgroundColor: '#dce8d7', borderColor: '#265243' }
                                                : { backgroundColor: '#e4ebe2', borderColor: '#b8ceb0' }
                                        }
                                        className="p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">🎥</span>
                                            <div>
                                                <p className="text-xs font-bold text-[#142921]">Video YouTube Sekolah</p>
                                                <p className="text-[11px] text-[#527365]">Menampilkan player video YouTube profil sekolah</p>
                                            </div>
                                        </div>
                                        <input
                                            type="radio"
                                            name="media_type_tab"
                                            value="video"
                                            checked={principalMediaType === 'video'}
                                            onChange={() => setPrincipalMediaType('video')}
                                            className="accent-[#265243] w-4 h-4 cursor-pointer"
                                        />
                                    </div>

                                    {/* Opsi 2: Foto Media Utama */}
                                    <div
                                        onClick={() => setPrincipalMediaType('photo')}
                                        style={
                                            principalMediaType === 'photo'
                                                ? { backgroundColor: '#dce8d7', borderColor: '#265243' }
                                                : { backgroundColor: '#e4ebe2', borderColor: '#b8ceb0' }
                                        }
                                        className="p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">🖼️</span>
                                            <div>
                                                <p className="text-xs font-bold text-[#142921]">Foto Media Utama Sekolah</p>
                                                <p className="text-[11px] text-[#527365]">Menampilkan gambar/foto utama banner sekolah</p>
                                            </div>
                                        </div>
                                        <input
                                            type="radio"
                                            name="media_type_tab"
                                            value="photo"
                                            checked={principalMediaType === 'photo'}
                                            onChange={() => setPrincipalMediaType('photo')}
                                            className="accent-[#265243] w-4 h-4 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic Content Form */}
                            <div className="pt-4 border-t border-[#b8ceb0]/40">
                                {principalMediaType === 'video' ? (
                                    <div className="space-y-3">
                                        <FieldInput
                                            label="Link / URL Video YouTube Sekolah"
                                            value={principalVideoUrl}
                                            onChange={setPrincipalVideoUrl}
                                            placeholder="https://youtu.be/swh2GC1XqyE?si=zDzgUxvpB2XObqte"
                                        />
                                        <p className="text-xs text-[#527365] font-semibold">
                                            💡 Masukkan URL video YouTube lengkap atau tautan pendek (youtu.be). Video ini akan tampil di bagian atas profil sekolah.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <label className="block text-xs font-bold text-[#142921]">Foto Media Utama (Landscape 16:9)</label>
                                        {principalMediaPhotoPreview ? (
                                            <div className="relative text-center max-w-xl">
                                                <img src={principalMediaPhotoPreview} alt="media preview" className="w-full h-48 object-cover rounded-xl border border-[#b8ceb0] shadow-xs" />
                                                <div className="mt-2 flex items-center justify-center gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => principalMediaPhotoRef.current?.click()}
                                                        className="text-xs text-[#265243] font-bold underline hover:text-[#1f4337] cursor-pointer"
                                                    >
                                                        Ganti Foto Media
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setPrincipalMediaPhotoPreview(null); setPrincipalMediaPhotoFile(null); if (principalMediaPhotoRef.current) principalMediaPhotoRef.current.value = ''; }}
                                                        className="text-xs text-rose-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" /> Hapus Foto Media
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => principalMediaPhotoRef.current?.click()}
                                                style={{ backgroundColor: '#e4ebe2', borderColor: '#b8ceb0' }}
                                                className="w-full max-w-xl h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#265243] hover:bg-[#dce8d7] transition-all"
                                            >
                                                <ImageIcon className="w-8 h-8 text-[#265243]" />
                                                <p className="text-xs text-[#2e5445] font-bold text-center">Klik untuk upload foto media utama</p>
                                                <span className="text-[10px] text-[#527365]">(Maksimal 3MB, format JPG/PNG landscape)</span>
                                            </div>
                                        )}
                                        <input ref={principalMediaPhotoRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e.target.files?.[0] || null, setPrincipalMediaPhotoFile, setPrincipalMediaPhotoPreview, principalMediaPhotoRef, 'Foto Media Utama')} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#265243] text-white text-xs font-bold hover:bg-[#1f4337] disabled:opacity-50 shadow-xs transition-all cursor-pointer">
                                <Save className="w-4 h-4" /> {saving ? 'Menyimpan...' : 'Simpan Media Sambutan'}
                            </button>
                        </div>
                    </form>
                )}

                {/* ────────── KEPALA SEKOLAH TAB ────────── */}
                {activeTab === 'kepala' && (
                    <form onSubmit={saveSettings} className="space-y-5">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Foto Kepala Sekolah */}
                            <div style={{ backgroundColor: '#e8efe5', borderColor: '#b8ceb0' }} className="rounded-2xl border p-5 shadow-xs flex flex-col items-center gap-4">
                                <h3 className="text-sm font-extrabold text-[#142921] w-full">Foto Kepala Sekolah</h3>
                                {principalPhotoPreview ? (
                                    <div className="relative text-center">
                                        <img src={principalPhotoPreview} alt="kepala" className="w-36 h-48 object-cover rounded-xl border border-[#b8ceb0]" />
                                        <button
                                            type="button"
                                            onClick={() => { setPrincipalPhotoPreview(null); setPrincipalPhotoFile(null); if (principalPhotoRef.current) principalPhotoRef.current.value = ''; }}
                                            className="mt-2 text-xs text-rose-600 font-bold hover:underline cursor-pointer flex items-center justify-center gap-1 mx-auto"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" /> Hapus Foto
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => principalPhotoRef.current?.click()}
                                        style={{ backgroundColor: '#e4ebe2', borderColor: '#b8ceb0' }}
                                        className="w-36 h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#265243] hover:bg-[#dce8d7] transition-all"
                                    >
                                        <ImageIcon className="w-8 h-8 text-[#265243]" />
                                        <p className="text-[10px] text-[#2e5445] font-semibold text-center">Upload Foto<br />Kepala Sekolah</p>
                                        <span className="text-[9px] text-[#527365]">(Maks 3MB)</span>
                                    </div>
                                )}
                                <input ref={principalPhotoRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e.target.files?.[0] || null, setPrincipalPhotoFile, setPrincipalPhotoPreview, principalPhotoRef, 'Foto Kepala Sekolah')} />
                                <button type="button" onClick={() => principalPhotoRef.current?.click()} className="text-xs text-[#265243] font-bold underline hover:text-[#1f4337] cursor-pointer">
                                    {principalPhotoPreview ? 'Ganti Foto' : 'Pilih Foto'}
                                </button>
                            </div>

                            {/* Data Kepala Sekolah */}
                            <div style={{ backgroundColor: '#e8efe5', borderColor: '#b8ceb0' }} className="lg:col-span-2 rounded-2xl border p-5 shadow-xs space-y-4">
                                <h3 className="text-sm font-extrabold text-[#142921]">Data Kepala Sekolah</h3>
                                <FieldInput label="Nama Lengkap" value={principalName} onChange={setPrincipalName} placeholder="Drs. H. Ahmad, M.Pd." required />
                                <FieldInput label="Gelar / Jabatan" value={principalTitle} onChange={setPrincipalTitle} placeholder="Kepala MAN Contoh Kota" />
                                <FieldTextarea label="Kata Sambutan / Biografi Singkat" value={principalBio} onChange={setPrincipalBio} placeholder="Assalamu'alaikum wr. wb. Puji syukur kami panjatkan..." rows={6} />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#265243] text-white text-xs font-bold hover:bg-[#1f4337] disabled:opacity-50 shadow-xs transition-all cursor-pointer">
                                <Save className="w-4 h-4" /> {saving ? 'Menyimpan...' : 'Simpan Data Kepala Sekolah'}
                            </button>
                        </div>
                    </form>
                )}

                {/* ────────── VISI & MISI TAB ────────── */}
                {activeTab === 'visi' && (
                    <form onSubmit={saveSettings} className="space-y-5">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div style={{ backgroundColor: '#e8efe5', borderColor: '#b8ceb0' }} className="rounded-2xl border p-5 shadow-xs space-y-3">
                                <h3 className="text-sm font-extrabold text-[#142921] flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-lg bg-[#265243] text-white text-xs flex items-center justify-center font-bold">V</span>
                                    Visi Sekolah
                                </h3>
                                <FieldTextarea
                                    label=""
                                    value={vision}
                                    onChange={setVision}
                                    placeholder="Terwujudnya madrasah yang unggul, berkarakter islami, dan berdaya saing global..."
                                    rows={8}
                                />
                            </div>
                            <div style={{ backgroundColor: '#e8efe5', borderColor: '#b8ceb0' }} className="rounded-2xl border p-5 shadow-xs space-y-3">
                                <h3 className="text-sm font-extrabold text-[#142921] flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-lg bg-[#5e8363] text-white text-xs flex items-center justify-center font-bold">M</span>
                                    Misi Sekolah
                                </h3>
                                <FieldTextarea
                                    label=""
                                    value={mission}
                                    onChange={setMission}
                                    placeholder="1. Menyelenggarakan pembelajaran yang inovatif...&#10;2. Mengembangkan karakter islami siswa...&#10;3. Meningkatkan kualitas SDM..."
                                    rows={8}
                                />
                                <p className="text-xs text-[#527365] font-semibold">💡 Pisahkan setiap poin misi dengan baris baru (Enter). Sistem akan otomatis menampilkannya sebagai list.</p>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#265243] text-white text-xs font-bold hover:bg-[#1f4337] disabled:opacity-50 shadow-xs transition-all cursor-pointer">
                                <Save className="w-4 h-4" /> {saving ? 'Menyimpan...' : 'Simpan Visi & Misi'}
                            </button>
                        </div>
                    </form>
                )}

                {/* ────────── SEJARAH SINGKAT TAB ────────── */}
                {activeTab === 'sejarah' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold text-[#2e5445]">Kelola timeline sejarah/milestone sekolah yang tampil di halaman Profil &gt; Sejarah Singkat.</p>
                            </div>
                            <button
                                onClick={() => openMilestoneModal(null)}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#265243] text-white text-xs font-bold hover:bg-[#1f4337] shadow-xs transition-all cursor-pointer"
                            >
                                <Plus className="w-4 h-4" /> Tambah Milestone
                            </button>
                        </div>

                        {milestones.length === 0 ? (
                            <div
                                style={{ backgroundColor: '#e8efe5', borderColor: '#b8ceb0' }}
                                className="p-16 rounded-2xl border-2 border-dashed text-center shadow-xs"
                            >
                                <Clock className="w-10 h-10 text-[#265243]/40 mx-auto mb-3" />
                                <p className="text-[#2e5445] text-xs font-semibold">Belum ada milestone. Klik &quot;Tambah Milestone&quot; untuk menambahkan entri sejarah pertama.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {milestones.map((ms) => (
                                    <div
                                        key={ms.id}
                                        style={{ backgroundColor: '#e8efe5', borderColor: '#b8ceb0' }}
                                        className="rounded-2xl border shadow-xs overflow-hidden flex items-stretch transition-all hover:shadow-md"
                                    >
                                        {/* Year Badge */}
                                        <div className="w-20 sm:w-24 flex items-center justify-center bg-[#142921] text-white font-black text-base shrink-0">
                                            {ms.year}
                                        </div>
                                        <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div>
                                                <p className="font-bold text-[#142921] text-sm">{ms.title}</p>
                                                {ms.description && <p className="text-xs text-[#2e5445] font-medium mt-0.5 line-clamp-2">{ms.description}</p>}
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <button
                                                    onClick={() => openMilestoneModal(ms)}
                                                    style={{ backgroundColor: '#eef4eb', borderColor: '#b8ceb0', color: '#265243' }}
                                                    className="p-2 rounded-xl border hover:bg-[#dce8d7] transition-all cursor-pointer"
                                                    title="Edit"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteMilestone(ms)}
                                                    className="p-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Milestone Add/Edit Modal */}
                        {milestoneModal.open && (
                            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                                <div style={{ backgroundColor: '#ffffff', borderColor: '#c8dac5' }} className="w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden">
                                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#b8ceb0]/40" style={{ backgroundColor: '#142921' }}>
                                        <h3 className="text-base font-bold text-white">
                                            {milestoneModal.editing ? 'Edit Milestone' : 'Tambah Milestone Baru'}
                                        </h3>
                                        <button onClick={closeMilestoneModal} className="text-white/70 hover:text-white transition-colors cursor-pointer">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <form onSubmit={handleMilestoneSubmit} className="p-6 space-y-4">
                                        <FieldInput
                                            label="Tahun"
                                            value={milestoneYear}
                                            onChange={setMilestoneYear}
                                            placeholder="1987"
                                            type="number"
                                            required
                                        />
                                        <FieldInput
                                            label="Judul / Peristiwa"
                                            value={milestoneTitle}
                                            onChange={setMilestoneTitle}
                                            placeholder="Sekolah Didirikan"
                                            required
                                        />
                                        <FieldTextarea
                                            label="Deskripsi Singkat (Opsional)"
                                            value={milestoneDesc}
                                            onChange={setMilestoneDesc}
                                            placeholder="Deskripsi singkat tentang peristiwa ini..."
                                            rows={3}
                                        />
                                        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#b8ceb0]/40">
                                            <button
                                                type="button"
                                                onClick={closeMilestoneModal}
                                                style={{ backgroundColor: '#eef4eb', borderColor: '#b8ceb0', color: '#265243' }}
                                                className="px-4 py-2 text-xs font-semibold rounded-xl border hover:bg-[#dce8d7] transition-all cursor-pointer"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={milestoneSaving || !milestoneTitle || !milestoneYear}
                                                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#265243] text-white text-xs font-bold hover:bg-[#1f4337] disabled:opacity-50 transition-all shadow-xs cursor-pointer"
                                            >
                                                <Save className="w-4 h-4" /> {milestoneModal.editing ? 'Simpan Perubahan' : 'Tambah Milestone'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ────────── FOOTER TAB ────────── */}
                {activeTab === 'footer' && (
                    <form onSubmit={saveSettings} className="space-y-5">
                        {/* Box Banner CTA Footer Uploader */}
                        <div style={{ backgroundColor: '#e8efe5', borderColor: '#b8ceb0' }} className="rounded-2xl border p-5 shadow-xs space-y-4">
                            <h3 className="text-sm font-extrabold text-[#142921] flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-[#265243]" /> Banner Box Footer (Floating CTA Box)
                            </h3>
                            <p className="text-xs text-[#527365] font-semibold">
                                Upload gambar latar belakang penuh dan sesuaikan judul utama (misal: "MAN TANJUNGPINANG") yang tampil melayang di atas footer.
                            </p>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                                {/* Upload Box */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-[#142921]">Gambar Latar Belakang Banner Footer</label>
                                    {footerBannerBgPreview ? (
                                        <div className="relative rounded-xl overflow-hidden border border-[#b8ceb0] h-32 group">
                                            <img src={footerBannerBgPreview} alt="Preview Banner Footer" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => footerBannerBgRef.current?.click()}
                                                    className="px-3 py-1.5 rounded-lg bg-white text-[#265243] font-bold text-xs shadow-xs"
                                                >
                                                    Ganti
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => footerBannerBgRef.current?.click()}
                                            style={{ backgroundColor: '#e4ebe2', borderColor: '#b8ceb0' }}
                                            className="w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#265243] hover:bg-[#dce8d7] transition-all"
                                        >
                                            <ImageIcon className="w-6 h-6 text-[#265243]" />
                                            <p className="text-[11px] text-[#2e5445] text-center font-semibold">Klik untuk upload gambar banner<br /><span className="text-[10px] text-[#527365]">(Maks 3MB, 1920×600)</span></p>
                                        </div>
                                    )}
                                    <input
                                        ref={footerBannerBgRef}
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleFileSelect(e.target.files?.[0] || null, setFooterBannerBgFile, setFooterBannerBgPreview, footerBannerBgRef, 'Gambar Banner Footer')}
                                    />
                                </div>

                                {/* Text Inputs */}
                                <div className="lg:col-span-2 space-y-3">
                                    <FieldInput
                                        label="Judul Utama Banner (Tampil di Tengah Box)"
                                        value={footerBannerTitle}
                                        onChange={setFooterBannerTitle}
                                        placeholder="MAN TANJUNGPINANG"
                                        required
                                    />
                                    <FieldInput
                                        label="Sub-judul / Deskripsi Banner Footer"
                                        value={footerBannerSubtitle}
                                        onChange={setFooterBannerSubtitle}
                                        placeholder="Mewujudkan Generasi Cerdas, Berkarakter, dan Berdaya Saing Global..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div style={{ backgroundColor: '#e8efe5', borderColor: '#b8ceb0' }} className="rounded-2xl border p-5 shadow-xs space-y-4">
                                <h3 className="text-sm font-extrabold text-[#142921] flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-[#265243]" /> Informasi Kontak Footer
                                </h3>
                                <FieldInput label="Teks Copyright" value={footerCopyright} onChange={setFooterCopyright} placeholder="© 2026 MAN Tanjungpinang. All rights reserved." />
                                <FieldTextarea label="Alamat (Footer)" value={footerAddress} onChange={setFooterAddress} placeholder="Jl. Contoh No. 1..." rows={2} />
                                <div className="grid grid-cols-2 gap-3">
                                    <FieldInput label="Telepon" value={footerPhone} onChange={setFooterPhone} placeholder="(0271) 123456" type="tel" />
                                    <FieldInput label="Email" value={footerEmail} onChange={setFooterEmail} placeholder="info@sekolah.sch.id" type="email" />
                                </div>
                            </div>

                            <div style={{ backgroundColor: '#e8efe5', borderColor: '#b8ceb0' }} className="rounded-2xl border p-5 shadow-xs space-y-4">
                                <h3 className="text-sm font-extrabold text-[#142921]">Media Sosial</h3>
                                <FieldInput label="Facebook URL" value={footerFacebook} onChange={setFooterFacebook} placeholder="https://facebook.com/sekolah" />
                                <FieldInput label="Instagram URL" value={footerInstagram} onChange={setFooterInstagram} placeholder="https://instagram.com/sekolah" />
                                <FieldInput label="YouTube URL" value={footerYoutube} onChange={setFooterYoutube} placeholder="https://youtube.com/@sekolah" />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#265243] text-white text-xs font-bold hover:bg-[#1f4337] disabled:opacity-50 shadow-xs transition-all cursor-pointer">
                                <Save className="w-4 h-4" /> {saving ? 'Menyimpan...' : 'Simpan Pengaturan Footer'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Success / Error Pop-up Modal */}
            {toastModalMsg && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div style={{ backgroundColor: '#f7faf5', borderColor: '#b8ceb0' }} className="w-full max-w-sm rounded-2xl shadow-2xl border overflow-hidden animate-in fade-in zoom-in duration-150">
                        <div className="p-6 text-center space-y-4">
                            <div className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center shadow-xs ${
                                toastModalMsg.type === 'error' ? 'bg-rose-100 text-rose-600' : 'bg-[#dce8d7] text-[#265243]'
                            }`}>
                                {toastModalMsg.type === 'error' ? (
                                    <AlertTriangle className="w-8 h-8 text-rose-600" />
                                ) : (
                                    <CheckCircle2 className="w-8 h-8 text-[#265243]" />
                                )}
                            </div>
                            <div>
                                <h3 className={`text-lg font-extrabold ${toastModalMsg.type === 'error' ? 'text-rose-700' : 'text-[#142921]'}`}>
                                    {toastModalMsg.title}
                                </h3>
                                <p className="text-xs text-[#2e5445] font-semibold mt-1.5 leading-relaxed">
                                    {toastModalMsg.msg}
                                </p>
                            </div>
                            <div className="pt-2 border-t border-[#b8ceb0]/40 flex justify-center">
                                <button
                                    type="button"
                                    onClick={() => setToastModalMsg(null)}
                                    className={`px-6 py-2.5 text-xs font-bold rounded-xl text-white shadow-xs transition-all w-full cursor-pointer ${
                                        toastModalMsg.type === 'error' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-[#265243] hover:bg-[#1f4337]'
                                    }`}
                                >
                                    OK, Mengerti
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Confirm Modal */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div style={{ backgroundColor: '#f7faf5', borderColor: '#b8ceb0' }} className="w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden animate-in fade-in zoom-in duration-150">
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
                            <div className="flex items-center justify-center gap-3 pt-3 border-t border-[#b8ceb0]/40">
                                <button
                                    type="button"
                                    onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                                    style={{ backgroundColor: '#eef4eb', borderColor: '#b8ceb0', color: '#265243' }}
                                    className="px-5 py-2.5 text-xs font-bold rounded-xl border hover:bg-[#dce8d7] transition-all cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmModal.onConfirm}
                                    className="px-5 py-2.5 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-all cursor-pointer"
                                >
                                    {confirmModal.confirmText}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

LandingPageIndex.layout = {
    breadcrumbs: [{ title: 'CMS Beranda', href: '/admin/landing-page' }],
};
