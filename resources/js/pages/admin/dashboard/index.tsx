import { Head, Link, usePage } from '@inertiajs/react';
import {
    BookMarked,
    Clock,
    FileCheck,
    Home,
    MessageSquare,
    Newspaper,
    ShieldCheck,
    Users,
} from 'lucide-react';

interface Props {
    stats: {
        total_news: number;
        total_books: number;
        available_books: number;
        total_dormitory_posts: number;
        pending_complaints: number;
        pending_legalizations: number;
        total_users: number;
    };
    recentComplaints: Array<{
        id: number;
        name: string;
        email: string;
        subject: string;
        status: 'pending' | 'processed' | 'resolved';
        created_at: string;
    }>;
    recentLegalizations: Array<{
        id: number;
        alumni_name: string;
        document_type: string;
        status: 'pending' | 'processing' | 'approved' | 'rejected';
        created_at: string;
    }>;
    recentNews: Array<{
        id: number;
        title: string;
        published_at: string;
        author?: { name: string };
    }>;
    userRole: string;
}

export default function AdminDashboard({
    stats,
    recentComplaints,
    recentLegalizations,
    recentNews,
    userRole,
}: Props) {
    const pageProps = usePage().props as any;
    const schoolLogoUrl = pageProps.school_logo_url;

    const roleLabels: Record<string, { label: string; color: string }> = {
        super_admin: { label: 'Super Admin', color: 'bg-[#9db588]/20 text-[#265243] border-[#9db588]/40' },
        admin: { label: 'Humas / Admin', color: 'bg-blue-500/10 text-blue-700 border-blue-200' },
        pengurus_asrama: { label: 'Pengurus Asrama', color: 'bg-amber-500/10 text-amber-700 border-amber-200' },
        pustakawan: { label: 'Pustakawan', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-200' },
    };

    const activeRole = roleLabels[userRole] || roleLabels.admin;

    return (
        <>
            <Head title="Dashboard - Admin - MAN TANJUNGPINANG" />

            <div className="flex flex-col gap-6 p-4 sm:p-6 w-full">
                {/* Header Welcome Banner with Natural Forest & Sage Gradient */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#265243] via-[#316150] to-[#5e8363] p-6 sm:p-8 text-white shadow-md">
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start sm:items-center gap-4">
                            {schoolLogoUrl && (
                                <div className="p-2.5 rounded-2xl bg-white/15 text-white backdrop-blur-md border border-white/20 shadow-sm shrink-0 flex items-center justify-center w-12 h-12">
                                    <img src={schoolLogoUrl} alt="Logo Sekolah" className="w-full h-full object-contain" />
                                </div>
                            )}
                            <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="px-3 py-0.5 text-xs font-bold rounded-full bg-white/20 text-white backdrop-blur-md border border-white/30 tracking-wide uppercase">
                                        {activeRole.label}
                                    </span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                    Selamat Datang di Panel CMS Sekolah 👋
                                </h1>
                                <p className="mt-1 text-sm sm:text-base text-slate-100 max-w-2xl">
                                    Kelola konten website profil sekolah, berita & galeri, profil asrama, perpustakaan digital, hingga layanan publik dalam satu dashboard yang bersih dan terpadu.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-white text-[#265243] hover:bg-[#faf9f5] transition-all shadow-sm"
                            >
                                Lihat Web Publik →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Metrics Stats Grid with Broken White / Clean Palette Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl border border-[#e1e7db] bg-white dark:bg-[#212c34] shadow-sm flex items-center justify-between hover:border-[#9db588] transition-all">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Berita & Galeri</p>
                            <h3 className="text-3xl font-extrabold text-[#212c34] dark:text-white mt-1">{stats.total_news}</h3>
                            <Link href="/admin/news" className="text-xs font-semibold text-[#265243] dark:text-[#9db588] hover:underline mt-2 inline-block">
                                Kelola berita &rarr;
                            </Link>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#f0f4ec] text-[#265243] dark:bg-[#2c3b45] dark:text-[#9db588]">
                            <Newspaper className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl border border-[#e1e7db] bg-white dark:bg-[#212c34] shadow-sm flex items-center justify-between hover:border-[#9db588] transition-all">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Koleksi Perpustakaan</p>
                            <h3 className="text-3xl font-extrabold text-[#212c34] dark:text-white mt-1">{stats.total_books}</h3>
                            <p className="text-xs font-semibold text-[#5e8363] dark:text-[#9db588] mt-0.5">{stats.available_books} Tersedia</p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#f0f4ec] text-[#5e8363] dark:bg-[#2c3b45] dark:text-[#9db588]">
                            <BookMarked className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl border border-[#e1e7db] bg-white dark:bg-[#212c34] shadow-sm flex items-center justify-between hover:border-[#9db588] transition-all">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Konten Asrama</p>
                            <h3 className="text-3xl font-extrabold text-[#212c34] dark:text-white mt-1">{stats.total_dormitory_posts}</h3>
                            <Link href="/admin/dormitory" className="text-xs font-semibold text-[#265243] dark:text-[#9db588] hover:underline mt-2 inline-block">
                                Kelola asrama &rarr;
                            </Link>
                        </div>
                        <div className="p-3.5 rounded-xl bg-[#f0f4ec] text-[#265243] dark:bg-[#2c3b45] dark:text-[#9db588]">
                            <Home className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl border border-[#e1e7db] bg-white dark:bg-[#212c34] shadow-sm flex items-center justify-between hover:border-[#9db588] transition-all">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pengaduan Masuk</p>
                            <h3 className="text-3xl font-extrabold text-[#212c34] dark:text-white mt-1">{stats.pending_complaints}</h3>
                            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mt-0.5">Menunggu respon</p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Complaints Widget */}
                    <div className="lg:col-span-2 rounded-2xl border border-[#e1e7db] bg-white dark:bg-[#212c34] p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-base font-bold text-[#212c34] dark:text-white flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-[#265243] dark:text-[#9db588]" /> Pengaduan Masyarakat Terbaru
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Pesan pengaduan publik yang memerlukan respon tindak lanjut.</p>
                            </div>
                            <Link href="/admin/complaints" className="text-xs font-bold text-[#265243] dark:text-[#9db588] hover:underline">
                                Lihat Semua &rarr;
                            </Link>
                        </div>

                        {recentComplaints.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-sm">Belum ada pengaduan masyarakat.</div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {recentComplaints.map((item) => (
                                    <div key={item.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div>
                                            <p className="text-sm font-semibold text-[#212c34] dark:text-white">{item.subject || 'Pengaduan Tanpa Subjek'}</p>
                                            <p className="text-xs text-slate-500">{item.name} ({item.email})</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-md shadow-sm ${
                                                item.status === 'pending'
                                                    ? 'bg-amber-500 text-white'
                                                    : item.status === 'processed'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-[#265243] text-white'
                                            }`}>
                                                {item.status === 'pending' ? 'Pending' : item.status === 'processed' ? 'Diproses' : 'Selesai'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent E-Legalisir Requests Widget */}
                    <div className="rounded-2xl border border-[#e1e7db] bg-white dark:bg-[#212c34] p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-base font-bold text-[#212c34] dark:text-white flex items-center gap-2">
                                    <FileCheck className="w-4 h-4 text-[#5e8363] dark:text-[#9db588]" /> Permohonan Legalisir
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Layanan e-legalisir alumni.</p>
                            </div>
                            <Link href="/admin/legalization" className="text-xs font-bold text-[#265243] dark:text-[#9db588] hover:underline">
                                Kelola &rarr;
                            </Link>
                        </div>

                        {recentLegalizations.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-sm">Belum ada permohonan legalisir.</div>
                        ) : (
                            <div className="space-y-3">
                                {recentLegalizations.map((req) => (
                                    <div key={req.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#e1e7db] dark:border-slate-700 flex items-center justify-between text-xs">
                                        <div>
                                            <p className="font-bold text-[#212c34] dark:text-white">{req.alumni_name}</p>
                                            <p className="text-slate-500">{req.document_type}</p>
                                        </div>
                                        <span className={`px-2.5 py-0.5 rounded-md font-bold shadow-sm text-white ${
                                            req.status === 'pending'
                                                ? 'bg-amber-500'
                                                : req.status === 'approved'
                                                ? 'bg-[#265243]'
                                                : req.status === 'processing'
                                                ? 'bg-blue-600'
                                                : 'bg-rose-600'
                                        }`}>
                                            {req.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/admin/dashboard' }],
};
