import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BookMarked,
    Building2,
    FileCheck,
    LayoutTemplate,
    MessageSquare,
    Newspaper,
    TrendingUp,
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
    visitorStats?: Array<{
        day: string;
        visitors: number;
    }>;
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
    visitorStats = [],
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

    // Visitor Stats calculations for SVG Chart
    const defaultStats = [
        { day: '31 Agu', visitors: 290 },
        { day: '1 Sep', visitors: 380 },
        { day: '2 Sep', visitors: 520 },
        { day: '3 Sep', visitors: 410 },
        { day: '4 Sep', visitors: 480 },
        { day: '5 Sep', visitors: 610 },
        { day: '6 Sep', visitors: 540 },
    ];
    const vStats = visitorStats.length > 0 ? visitorStats : defaultStats;
    const totalVisitors = vStats.reduce((sum, item) => sum + item.visitors, 0);

    const maxVisitors = Math.max(...vStats.map((v) => v.visitors), 1);
    const minVisitors = Math.min(...vStats.map((v) => v.visitors), 0);

    // Calculate SVG Chart Points with edge-to-edge smooth cubic Bezier curve
    const svgWidth = 600;
    const svgHeight = 170;
    const paddingX = 24; // Compact padding for dots
    const paddingTop = 42;
    const paddingBottom = 28;

    const drawWidth = svgWidth - paddingX * 2;
    const drawHeight = svgHeight - paddingTop - paddingBottom;

    const points = vStats.map((item, idx) => {
        const x = paddingX + (idx / (vStats.length - 1)) * drawWidth;
        const normalizedY = (item.visitors - minVisitors) / (maxVisitors - minVisitors || 1);
        const y = svgHeight - paddingBottom - normalizedY * drawHeight;
        return { x, y, visitors: item.visitors, day: item.day };
    });

    const getCubicBezierPath = (pts: { x: number; y: number }[]) => {
        if (pts.length === 0) return '';
        if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
        let path = `M ${pts[0].x} ${pts[0].y}`;
        for (let i = 0; i < pts.length - 1; i++) {
            const p0 = pts[i];
            const p1 = pts[i + 1];
            const controlX = (p0.x + p1.x) / 2;
            path += ` C ${controlX} ${p0.y}, ${controlX} ${p1.y}, ${p1.x} ${p1.y}`;
        }
        return path;
    };

    // Extended points to span 100% edge-to-edge from x=0 to x=svgWidth
    const extendedPoints = [
        { x: 0, y: points[0].y },
        ...points,
        { x: svgWidth, y: points[points.length - 1].y },
    ];

    const linePath = getCubicBezierPath(extendedPoints);
    const areaPath = `${linePath} L ${svgWidth} ${svgHeight - paddingBottom} L 0 ${svgHeight - paddingBottom} Z`;

    return (
        <>
            <Head title="Dashboard - Admin - MAN TANJUNGPINANG" />

            <div className="flex flex-col gap-6 p-4 sm:p-6 w-full">
                
                {/* ── 1. TOP OPERATIONAL HEADER BANNER (DARK GREEN CARD) ── */}
                <div className="relative overflow-hidden rounded-3xl bg-[#265243] text-white p-6 sm:p-8 shadow-md border border-[#316150]">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-3 max-w-2xl">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-black tracking-wide border border-white/15 backdrop-blur-md">
                                    <LayoutTemplate className="w-3.5 h-3.5 text-[#f59e0b]" /> Dasbor Operasional
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full bg-[#f59e0b] text-[#142921] text-[11px] font-black uppercase tracking-wider">
                                    {activeRole.label}
                                </span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-snug">
                                Ringkasan Operasional
                            </h1>
                            <p className="text-xs sm:text-sm text-emerald-100/90 font-medium leading-relaxed">
                                Posisi data publikasi berita, koleksi perpustakaan, profil asrama, legalisir alumni, dan pengaduan saat ini.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 flex-wrap">
                            <Link
                                href="/admin/landing-page"
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-black border border-white/20 transition-all shadow-xs"
                            >
                                CMS Beranda <ArrowRight className="w-3.5 h-3.5 text-[#f59e0b]" />
                            </Link>
                            {userRole === 'super_admin' && (
                                <Link
                                    href="/admin/users"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-[#265243] hover:bg-[#f4f8f3] text-xs font-black transition-all shadow-md"
                                >
                                    Kelola User <Users className="w-3.5 h-3.5 text-[#265243]" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── 2. TOP METRIC KPI CARDS ROW ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-[#c8dac5] hover:border-[#265243] p-5 rounded-2xl shadow-xs transition-all flex items-start justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[#527365]">Berita &amp; Artikel</span>
                                <span className="px-2 py-0.5 rounded-md bg-[#f4f8f3] text-[#265243] text-[10px] font-black border border-[#c8dac5]">
                                    Publik
                                </span>
                            </div>
                            <h3 className="text-3xl font-black text-[#142921]">{stats.total_news}</h3>
                            <p className="text-[11px] text-[#527365] font-medium pt-1">Total publikasi aktif</p>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-[#f4f8f3] text-[#265243] flex items-center justify-center shrink-0 border border-[#c8dac5]">
                            <Newspaper className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-white border border-[#c8dac5] hover:border-[#265243] p-5 rounded-2xl shadow-xs transition-all flex items-start justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[#527365]">Koleksi Buku</span>
                                <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-black border border-amber-200">
                                    {stats.available_books} Tersedia
                                </span>
                            </div>
                            <h3 className="text-3xl font-black text-[#142921]">{stats.total_books}</h3>
                            <p className="text-[11px] text-[#527365] font-medium pt-1">Buku di perpustakaan</p>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                            <BookMarked className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-white border border-[#c8dac5] hover:border-[#265243] p-5 rounded-2xl shadow-xs transition-all flex items-start justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[#527365]">E-Legalisir Alumni</span>
                                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-black border border-emerald-200">
                                    {stats.pending_legalizations} Pending
                                </span>
                            </div>
                            <h3 className="text-3xl font-black text-[#142921]">{stats.pending_legalizations}</h3>
                            <p className="text-[11px] text-[#527365] font-medium pt-1">Perlu verifikasi dokumen</p>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
                            <FileCheck className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-white border border-[#c8dac5] hover:border-[#265243] p-5 rounded-2xl shadow-xs transition-all flex items-start justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[#527365]">Pengaduan Masuk</span>
                                <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-black border border-rose-200">
                                    Respon
                                </span>
                            </div>
                            <h3 className="text-3xl font-black text-[#142921]">{stats.pending_complaints}</h3>
                            <p className="text-[11px] text-[#527365] font-medium pt-1">Menunggu tindak lanjut</p>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* ── 3. MIDDLE SECTION (LEFT NEW FEATURE: DAILY VISITORS CHART & RIGHT DARK CARDS) ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Left Column: NEW FEATURE - Tren Pengunjung Website Per Hari (Chart) (8 Cols) */}
                    <div className="lg:col-span-8 bg-white border border-[#c8dac5] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs flex flex-col justify-between">
                        <div className="flex items-start justify-between flex-wrap gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2.5 py-0.5 rounded-md bg-[#265243] text-white text-[10px] font-black uppercase tracking-wider">
                                        Statistik Pengunjung
                                    </span>
                                    <span className="text-xs text-[#527365] font-bold">7 Hari Terakhir</span>
                                </div>
                                <h3 className="text-xl font-black text-[#142921]">Tren Volume Pengunjung Website</h3>
                            </div>
                            <div className="text-right bg-[#265243] border border-[#316150] px-4.5 py-2.5 rounded-2xl text-white shadow-xs">
                                <span className="text-2xl font-black text-white block leading-tight">
                                    {totalVisitors.toLocaleString('id-ID')}
                                </span>
                                <span className="text-[10px] text-emerald-100/90 font-extrabold uppercase tracking-wider">Total Kunjungan</span>
                            </div>
                        </div>

                        {/* SVG Smooth Curved Area Chart */}
                        <div className="relative pt-2 pb-1">
                            <div className="w-full relative">
                                <svg viewBox="0 0 600 170" className="w-full h-auto overflow-visible">
                                    <defs>
                                        <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#265243" stopOpacity="0.35" />
                                            <stop offset="60%" stopColor="#265243" stopOpacity="0.08" />
                                            <stop offset="100%" stopColor="#265243" stopOpacity="0.0" />
                                        </linearGradient>
                                        <filter id="chartGlow" x="-20%" y="-20%" width="140%" height="140%">
                                            <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#265243" floodOpacity="0.25" />
                                        </filter>
                                    </defs>

                                    {/* Horizontal Grid Lines - 100% Full Width */}
                                    <line x1="0" y1={paddingTop} x2={svgWidth} y2={paddingTop} stroke="#e2ebd9" strokeDasharray="4 4" strokeWidth="1" />
                                    <line x1="0" y1={paddingTop + drawHeight / 2} x2={svgWidth} y2={paddingTop + drawHeight / 2} stroke="#e2ebd9" strokeDasharray="4 4" strokeWidth="1" />
                                    <line x1="0" y1={svgHeight - paddingBottom} x2={svgWidth} y2={svgHeight - paddingBottom} stroke="#e2ebd9" strokeDasharray="4 4" strokeWidth="1" />

                                    {/* Filled Smooth Area */}
                                    <path d={areaPath} fill="url(#visitorGradient)" />

                                    {/* Smooth Curved Line */}
                                    <path d={linePath} fill="none" stroke="#265243" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#chartGlow)" />

                                    {/* Interactive Dots, Guidelines & Floating Badges */}
                                    {points.map((p, idx) => {
                                        const badgeX =
                                            idx === 0
                                                ? Math.max(4, p.x - 12)
                                                : idx === vStats.length - 1
                                                ? Math.min(svgWidth - 52, p.x - 36)
                                                : p.x - 24;

                                        return (
                                            <g key={idx} className="group cursor-pointer">
                                                {/* Dashed vertical guideline to x-axis */}
                                                <line x1={p.x} y1={p.y} x2={p.x} y2={svgHeight - paddingBottom} stroke="#265243" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.4" />

                                                {/* Circle Point */}
                                                <circle cx={p.x} cy={p.y} r="5.5" fill="#ffffff" stroke="#265243" strokeWidth="3" className="transition-all duration-200 group-hover:r-7.5 group-hover:stroke-[#f59e0b]" />
                                                <circle cx={p.x} cy={p.y} r="2" fill="#265243" className="transition-all duration-200 group-hover:fill-[#142921]" />

                                                {/* Value Badge Box with Down Pointer */}
                                                <g className="transition-all duration-200 group-hover:-translate-y-1">
                                                    <rect x={badgeX} y={p.y - 30} width="48" height="20" rx="6" fill="#142921" stroke="#316150" strokeWidth="1" />
                                                    <polygon points={`${p.x - 4},${p.y - 10} ${p.x + 4},${p.y - 10} ${p.x},${p.y - 6}`} fill="#142921" />
                                                    <text x={badgeX + 24} y={p.y - 16} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="800">
                                                        {p.visitors}
                                                    </text>
                                                </g>
                                            </g>
                                        );
                                    })}
                                </svg>
                            </div>

                            {/* X-Axis Day Labels aligned with point percentages */}
                            <div className="relative w-full h-8 pt-3 border-t border-[#e2ebd9]">
                                {vStats.map((item, idx) => (
                                    <span
                                        key={idx}
                                        className="absolute -translate-x-1/2 text-center text-xs font-bold text-[#527365]"
                                        style={{ left: `${(points[idx].x / svgWidth) * 100}%` }}
                                    >
                                        {item.day}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs font-medium text-[#527365] pt-2 border-t border-[#e2ebd9]">
                            <span>Rata-rata: <strong className="text-[#142921] font-bold">{Math.round(totalVisitors / vStats.length)} Kunjungan / Hari</strong></span>
                            <span className="text-[#265243] font-bold flex items-center gap-1">
                                <TrendingUp className="w-3.5 h-3.5 text-[#f59e0b]" /> Traffic Meningkat
                            </span>
                        </div>
                    </div>

                    {/* Right Column: Stacked Dark Green Feature Cards (4 Cols) */}
                    <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
                        
                        {/* Dark Card 1: Admin & Pengguna */}
                        <div className="bg-[#265243] text-white rounded-3xl p-6 shadow-md border border-[#316150] space-y-4 flex-1 flex flex-col justify-between">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <span className="text-xs font-bold text-emerald-200/90 uppercase tracking-wider block">
                                        Pengguna &amp; Admin
                                    </span>
                                    <h4 className="text-3xl font-black text-white mt-1">{stats.total_users}</h4>
                                    <p className="text-xs text-emerald-100/80 font-medium mt-0.5">Akun terdaftar dalam sistem</p>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-white/10 text-[#f59e0b] border border-white/20 flex items-center justify-center shrink-0">
                                    <Users className="w-6 h-6" />
                                </div>
                            </div>
                            {userRole === 'super_admin' && (
                                <Link
                                    href="/admin/users"
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f59e0b] hover:text-white transition-colors pt-2 border-t border-white/10"
                                >
                                    Kelola Pengguna Sistem &rarr;
                                </Link>
                            )}
                        </div>

                        {/* Dark Card 2: Layanan Alumni */}
                        <div className="bg-[#142921] text-white rounded-3xl p-6 shadow-md border border-emerald-900/40 space-y-4 flex-1 flex flex-col justify-between">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <span className="text-xs font-bold text-emerald-200/90 uppercase tracking-wider block">
                                        Layanan E-Legalisir
                                    </span>
                                    <h4 className="text-3xl font-black text-[#f59e0b] mt-1">{stats.pending_legalizations}</h4>
                                    <p className="text-xs text-emerald-100/80 font-medium mt-0.5">Permohonan perlu diproses</p>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-white/10 text-white border border-white/20 flex items-center justify-center shrink-0">
                                    <FileCheck className="w-6 h-6" />
                                </div>
                            </div>
                            <Link
                                href="/admin/legalization"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9db588] hover:text-white transition-colors pt-2 border-t border-white/10"
                            >
                                Proses Legalisir Alumni &rarr;
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ── 4. FULL-WIDTH ROW: SEBARAN DATA & AKTIVITAS PORTAL ── */}
                <div className="w-full bg-white border border-[#c8dac5] rounded-3xl overflow-hidden shadow-xs">
                    {/* Header Bar Soft Sage */}
                    <div className="bg-[#f4f8f3] p-5 sm:p-6 border-b border-[#c8dac5] flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h3 className="text-xl font-black text-[#142921]">Sebaran Data &amp; Aktivitas Portal</h3>
                            <p className="text-xs text-[#527365] font-medium mt-0.5">Ringkasan statistik operasional seluruh modul sekolah</p>
                        </div>
                        <span className="px-3.5 py-1 rounded-full bg-white border border-[#c8dac5] text-[#265243] text-xs font-bold shadow-xs">
                            Update Real-time
                        </span>
                    </div>

                    {/* Clean Body Content */}
                    <div className="p-6 sm:p-8">
                        {/* Metrics - Clean Row Divided by Thin Lines */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#e2ebd9]">
                            <div className="py-2 sm:py-0 sm:px-6 first:pl-0 text-center sm:text-left">
                                <span className="text-xs font-extrabold text-[#527365] uppercase tracking-wider block">Pustaka Tersedia</span>
                                <span className="text-2xl font-black text-[#265243] mt-1 block">{stats.available_books} <span className="text-xs font-bold text-[#527365]">Buku</span></span>
                            </div>
                            <div className="py-2 sm:py-0 sm:px-6 text-center sm:text-left">
                                <span className="text-xs font-extrabold text-amber-700 uppercase tracking-wider block">Legalisir Pending</span>
                                <span className="text-2xl font-black text-amber-800 mt-1 block">{stats.pending_legalizations} <span className="text-xs font-bold text-amber-700">Dokumen</span></span>
                            </div>
                            <div className="py-2 sm:py-0 sm:px-6 text-center sm:text-left">
                                <span className="text-xs font-extrabold text-rose-700 uppercase tracking-wider block">Pengaduan Pending</span>
                                <span className="text-2xl font-black text-rose-800 mt-1 block">{stats.pending_complaints} <span className="text-xs font-bold text-rose-700">Pesan</span></span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── 5. BOTTOM SECTION: RECENT TABLES (COMPLAINTS & LEGALIZATIONS) ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Complaints Widget */}
                    <div className="bg-white border border-[#c8dac5] rounded-3xl p-6 shadow-xs space-y-4">
                        <div className="flex items-center justify-between gap-2">
                            <div>
                                <h3 className="text-base font-black text-[#142921] flex items-center gap-2">
                                    <MessageSquare className="w-4.5 h-4.5 text-[#265243]" /> Pengaduan Masuk Terbaru
                                </h3>
                                <p className="text-xs text-[#527365] font-medium">Kotak suara &amp; masukan dari masyarakat</p>
                            </div>
                            <Link href="/admin/complaints" className="text-xs font-bold text-[#265243] hover:underline shrink-0">
                                Lihat Semua &rarr;
                            </Link>
                        </div>
                        {recentComplaints.length === 0 ? (
                            <div className="p-8 text-center text-xs text-[#527365] font-medium bg-[#f8faf7] rounded-2xl border border-[#e2ebd9]">
                                Belum ada pengaduan masyarakat.
                            </div>
                        ) : (
                            <div className="divide-y divide-[#e2ebd9]">
                                {recentComplaints.map((item) => (
                                    <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs sm:text-sm font-extrabold text-[#142921] truncate">{item.subject || 'Tanpa Subjek'}</p>
                                            <p className="text-[11px] text-[#527365] font-medium truncate">{item.name} • {item.email}</p>
                                        </div>
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0 ${
                                            item.status === 'pending'
                                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                                : item.status === 'processed'
                                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                        }`}>
                                            {item.status === 'pending' ? 'Pending' : item.status === 'processed' ? 'Diproses' : 'Selesai'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Legalization Widget */}
                    <div className="bg-white border border-[#c8dac5] rounded-3xl p-6 shadow-xs space-y-4">
                        <div className="flex items-center justify-between gap-2">
                            <div>
                                <h3 className="text-base font-black text-[#142921] flex items-center gap-2">
                                    <FileCheck className="w-4.5 h-4.5 text-[#265243]" /> Permohonan Legalisir Terbaru
                                </h3>
                                <p className="text-xs text-[#527365] font-medium">Permohonan verifikasi ijazah/transkrip alumni</p>
                            </div>
                            <Link href="/admin/legalization" className="text-xs font-bold text-[#265243] hover:underline shrink-0">
                                Kelola &rarr;
                            </Link>
                        </div>
                        {recentLegalizations.length === 0 ? (
                            <div className="p-8 text-center text-xs text-[#527365] font-medium bg-[#f8faf7] rounded-2xl border border-[#e2ebd9]">
                                Belum ada permohonan legalisir.
                            </div>
                        ) : (
                            <div className="divide-y divide-[#e2ebd9]">
                                {recentLegalizations.map((req) => (
                                    <div key={req.id} className="py-3 flex items-center justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs sm:text-sm font-extrabold text-[#142921] truncate">{req.alumni_name}</p>
                                            <p className="text-[11px] text-[#527365] font-medium truncate">{req.document_type}</p>
                                        </div>
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0 ${
                                            req.status === 'pending'
                                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                                : req.status === 'approved'
                                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                                : req.status === 'processing'
                                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                                : 'bg-rose-100 text-rose-800 border border-rose-300'
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
