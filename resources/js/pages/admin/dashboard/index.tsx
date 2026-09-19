import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BookMarked,
    Building2,
    ExternalLink,
    FileCheck,
    Image as ImageIcon,
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
        total_facilities: number;
        total_galleries: number;
        total_users: number;
        legalization_link?: string;
        complaint_link?: string;
    };
    visitorStats?: Array<{
        day: string;
        visitors: number;
    }>;
    recentDormitoryPosts?: Array<{
        id: number;
        title: string;
        content: string;
        author?: string;
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
    recentDormitoryPosts = [],
    recentNews = [],
    userRole,
}: Props) {
    const pageProps = usePage().props as any;

    const roleLabels: Record<string, { label: string; color: string }> = {
        super_admin: {
            label: 'Super Admin',
            color: 'bg-[#9db588]/20 text-[#265243] border-[#9db588]/40',
        },
        admin: {
            label: 'Humas / Admin',
            color: 'bg-blue-500/10 text-blue-700 border-blue-200',
        },
        pengurus_asrama: {
            label: 'Pengurus Asrama',
            color: 'bg-amber-500/10 text-amber-700 border-amber-200',
        },
        pustakawan: {
            label: 'Pustakawan',
            color: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
        },
    };

    const activeRole = roleLabels[userRole] || roleLabels.admin;

    // Visitor Stats calculations for SVG Chart
    const defaultStats = Array.from({ length: 7 }, (_, i) => ({
        day: `H-${6 - i}`,
        visitors: 0,
    }));
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
        const normalizedY =
            (item.visitors - minVisitors) / (maxVisitors - minVisitors || 1);
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

            <div className="flex w-full flex-col gap-6 p-4 sm:p-6">
                {/* ── 1. TOP OPERATIONAL HEADER BANNER (DARK GREEN CARD) ── */}
                <div className="relative overflow-hidden rounded-3xl border border-[#316150] bg-[#265243] p-6 text-white shadow-md sm:p-8">
                    <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                        <div className="max-w-2xl space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black tracking-wide text-white backdrop-blur-md">
                                    <LayoutTemplate className="h-3.5 w-3.5 text-[#f59e0b]" />{' '}
                                    Dasbor Operasional
                                </span>
                                <span className="rounded-full bg-[#f59e0b] px-2.5 py-0.5 text-[11px] font-black tracking-wider text-[#142921] uppercase">
                                    {activeRole.label}
                                </span>
                            </div>

                            <h1 className="text-3xl leading-snug font-black tracking-tight sm:text-4xl">
                                Ringkasan Operasional
                            </h1>
                            <p className="text-xs leading-relaxed font-medium text-emerald-100/90 sm:text-sm">
                                Posisi data publikasi berita, koleksi
                                perpustakaan, profil asrama, galeri dokumentasi,
                                serta link form legalisir dan pengaduan.
                            </p>
                        </div>

                        <div className="flex shrink-0 flex-wrap items-center gap-3">
                            <Link
                                href="/admin/landing-page"
                                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-black text-white shadow-xs transition-all hover:bg-white/20"
                            >
                                CMS Beranda{' '}
                                <ArrowRight className="h-3.5 w-3.5 text-[#f59e0b]" />
                            </Link>
                            {userRole === 'super_admin' && (
                                <Link
                                    href="/admin/users"
                                    className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-xs font-black text-[#265243] shadow-md transition-all hover:bg-[#f4f8f3]"
                                >
                                    Kelola User{' '}
                                    <Users className="h-3.5 w-3.5 text-[#265243]" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── 2. TOP METRIC KPI CARDS ROW ── */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* KPI 1: Berita */}
                    <div className="flex items-start justify-between rounded-2xl border border-[#c8dac5] bg-white p-5 shadow-xs transition-all hover:border-[#265243]">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[#527365]">
                                    Berita &amp; Artikel
                                </span>
                                <span className="rounded-md border border-[#c8dac5] bg-[#f4f8f3] px-2 py-0.5 text-[10px] font-black text-[#265243]">
                                    Publik
                                </span>
                            </div>
                            <h3 className="text-3xl font-black text-[#142921]">
                                {stats.total_news}
                            </h3>
                            <p className="pt-1 text-[11px] font-medium text-[#527365]">
                                Total publikasi aktif
                            </p>
                        </div>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#c8dac5] bg-[#f4f8f3] text-[#265243]">
                            <Newspaper className="h-5 w-5" />
                        </div>
                    </div>

                    {/* KPI 2: Buku */}
                    <div className="flex items-start justify-between rounded-2xl border border-[#c8dac5] bg-white p-5 shadow-xs transition-all hover:border-[#265243]">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[#527365]">
                                    Koleksi Buku
                                </span>
                                <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-black text-amber-700">
                                    {stats.available_books} Tersedia
                                </span>
                            </div>
                            <h3 className="text-3xl font-black text-[#142921]">
                                {stats.total_books}
                            </h3>
                            <p className="pt-1 text-[11px] font-medium text-[#527365]">
                                Buku di perpustakaan
                            </p>
                        </div>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-amber-700">
                            <BookMarked className="h-5 w-5" />
                        </div>
                    </div>

                    {/* KPI 3: Link E-Legalisir */}
                    <div className="flex items-start justify-between rounded-2xl border border-[#c8dac5] bg-white p-5 shadow-xs transition-all hover:border-[#265243]">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[#527365]">
                                    Form E-Legalisir
                                </span>
                                <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-800">
                                    Link Aktif
                                </span>
                            </div>
                            <h3 className="text-lg font-black text-[#142921]">
                                Form Online
                            </h3>
                            <Link
                                href="/admin/legalization"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#265243] hover:underline"
                            >
                                Edit Link Form &rarr;
                            </Link>
                        </div>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-800">
                            <FileCheck className="h-5 w-5" />
                        </div>
                    </div>

                    {/* KPI 4: Link Pengaduan */}
                    <div className="flex items-start justify-between rounded-2xl border border-[#c8dac5] bg-white p-5 shadow-xs transition-all hover:border-[#265243]">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[#527365]">
                                    Form Pengaduan
                                </span>
                                <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-black text-blue-700">
                                    Link Aktif
                                </span>
                            </div>
                            <h3 className="text-lg font-black text-[#142921]">
                                Form Masukan
                            </h3>
                            <Link
                                href="/admin/complaints"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#265243] hover:underline"
                            >
                                Edit Link Form &rarr;
                            </Link>
                        </div>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700">
                            <MessageSquare className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                {/* ── 3. MIDDLE SECTION (LEFT NEW FEATURE: DAILY VISITORS CHART & RIGHT DARK CARDS) ── */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left Column: NEW FEATURE - Tren Pengunjung Website Per Hari (Chart) (8 Cols) */}
                    <div className="flex flex-col justify-between space-y-6 rounded-3xl border border-[#c8dac5] bg-white p-6 shadow-xs sm:p-8 lg:col-span-8">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <div className="mb-1 flex items-center gap-2">
                                    <span className="rounded-md bg-[#265243] px-2.5 py-0.5 text-[10px] font-black tracking-wider text-white uppercase">
                                        Statistik Pengunjung
                                    </span>
                                    <span className="text-xs font-bold text-[#527365]">
                                        7 Hari Terakhir
                                    </span>
                                </div>
                                <h3 className="text-xl font-black text-[#142921]">
                                    Tren Volume Pengunjung Website
                                </h3>
                            </div>
                            <div className="rounded-2xl border border-[#316150] bg-[#265243] px-4.5 py-2.5 text-right text-white shadow-xs">
                                <span className="block text-2xl leading-tight font-black text-white">
                                    {totalVisitors.toLocaleString('id-ID')}
                                </span>
                                <span className="text-[10px] font-extrabold tracking-wider text-emerald-100/90 uppercase">
                                    Total Kunjungan
                                </span>
                            </div>
                        </div>

                        {/* SVG Smooth Curved Area Chart */}
                        <div className="relative pt-2 pb-1">
                            <div className="relative w-full">
                                <svg
                                    viewBox="0 0 600 170"
                                    className="h-auto w-full overflow-visible"
                                >
                                    <defs>
                                        <linearGradient
                                            id="visitorGradient"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#265243"
                                                stopOpacity="0.35"
                                            />
                                            <stop
                                                offset="60%"
                                                stopColor="#265243"
                                                stopOpacity="0.08"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#265243"
                                                stopOpacity="0.0"
                                            />
                                        </linearGradient>
                                        <filter
                                            id="chartGlow"
                                            x="-20%"
                                            y="-20%"
                                            width="140%"
                                            height="140%"
                                        >
                                            <feDropShadow
                                                dx="0"
                                                dy="4"
                                                stdDeviation="3"
                                                floodColor="#265243"
                                                floodOpacity="0.25"
                                            />
                                        </filter>
                                    </defs>

                                    {/* Horizontal Grid Lines - 100% Full Width */}
                                    <line
                                        x1="0"
                                        y1={paddingTop}
                                        x2={svgWidth}
                                        y2={paddingTop}
                                        stroke="#e2ebd9"
                                        strokeDasharray="4 4"
                                        strokeWidth="1"
                                    />
                                    <line
                                        x1="0"
                                        y1={paddingTop + drawHeight / 2}
                                        x2={svgWidth}
                                        y2={paddingTop + drawHeight / 2}
                                        stroke="#e2ebd9"
                                        strokeDasharray="4 4"
                                        strokeWidth="1"
                                    />
                                    <line
                                        x1="0"
                                        y1={svgHeight - paddingBottom}
                                        x2={svgWidth}
                                        y2={svgHeight - paddingBottom}
                                        stroke="#e2ebd9"
                                        strokeDasharray="4 4"
                                        strokeWidth="1"
                                    />

                                    {/* Filled Smooth Area */}
                                    <path
                                        d={areaPath}
                                        fill="url(#visitorGradient)"
                                    />

                                    {/* Smooth Curved Line */}
                                    <path
                                        d={linePath}
                                        fill="none"
                                        stroke="#265243"
                                        strokeWidth="3.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        filter="url(#chartGlow)"
                                    />

                                    {/* Interactive Dots, Guidelines & Floating Badges */}
                                    {points.map((p, idx) => {
                                        const badgeX =
                                            idx === 0
                                                ? Math.max(4, p.x - 12)
                                                : idx === vStats.length - 1
                                                  ? Math.min(
                                                        svgWidth - 52,
                                                        p.x - 36,
                                                    )
                                                  : p.x - 24;

                                        return (
                                            <g
                                                key={idx}
                                                className="group cursor-pointer"
                                            >
                                                {/* Dashed vertical guideline to x-axis */}
                                                <line
                                                    x1={p.x}
                                                    y1={p.y}
                                                    x2={p.x}
                                                    y2={
                                                        svgHeight -
                                                        paddingBottom
                                                    }
                                                    stroke="#265243"
                                                    strokeWidth="1"
                                                    strokeDasharray="2 2"
                                                    strokeOpacity="0.4"
                                                />

                                                {/* Circle Point */}
                                                <circle
                                                    cx={p.x}
                                                    cy={p.y}
                                                    r="5.5"
                                                    fill="#ffffff"
                                                    stroke="#265243"
                                                    strokeWidth="3"
                                                    className="group-hover:r-7.5 transition-all duration-200 group-hover:stroke-[#f59e0b]"
                                                />
                                                <circle
                                                    cx={p.x}
                                                    cy={p.y}
                                                    r="2"
                                                    fill="#265243"
                                                    className="transition-all duration-200 group-hover:fill-[#142921]"
                                                />

                                                {/* Value Badge Box with Down Pointer */}
                                                <g className="transition-all duration-200 group-hover:-translate-y-1">
                                                    <rect
                                                        x={badgeX}
                                                        y={p.y - 30}
                                                        width="48"
                                                        height="20"
                                                        rx="6"
                                                        fill="#142921"
                                                        stroke="#316150"
                                                        strokeWidth="1"
                                                    />
                                                    <polygon
                                                        points={`${p.x - 4},${p.y - 10} ${p.x + 4},${p.y - 10} ${p.x},${p.y - 6}`}
                                                        fill="#142921"
                                                    />
                                                    <text
                                                        x={badgeX + 24}
                                                        y={p.y - 16}
                                                        textAnchor="middle"
                                                        fill="#ffffff"
                                                        fontSize="10"
                                                        fontWeight="800"
                                                    >
                                                        {p.visitors}
                                                    </text>
                                                </g>
                                            </g>
                                        );
                                    })}
                                </svg>
                            </div>

                            {/* X-Axis Day Labels aligned with point percentages */}
                            <div className="relative h-8 w-full border-t border-[#e2ebd9] pt-3">
                                {vStats.map((item, idx) => (
                                    <span
                                        key={idx}
                                        className="absolute -translate-x-1/2 text-center text-xs font-bold text-[#527365]"
                                        style={{
                                            left: `${(points[idx].x / svgWidth) * 100}%`,
                                        }}
                                    >
                                        {item.day}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-[#e2ebd9] pt-2 text-xs font-medium text-[#527365]">
                            <span>
                                Rata-rata:{' '}
                                <strong className="font-bold text-[#142921]">
                                    {Math.round(
                                        totalVisitors / (vStats.length || 1),
                                    )}{' '}
                                    Kunjungan / Hari
                                </strong>
                            </span>
                            <span className="flex items-center gap-1 font-bold text-[#265243]">
                                <TrendingUp className="h-3.5 w-3.5 text-[#f59e0b]" />{' '}
                                Data Real-time
                            </span>
                        </div>
                    </div>

                    {/* Right Column: Stacked Dark Green Feature Cards (4 Cols) */}
                    <div className="flex flex-col justify-between space-y-4 lg:col-span-4">
                        {/* Dark Card 1: Admin & Pengguna */}
                        <div className="flex flex-1 flex-col justify-between space-y-4 rounded-3xl border border-[#316150] bg-[#265243] p-6 text-white shadow-md">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <span className="block text-xs font-bold tracking-wider text-emerald-200/90 uppercase">
                                        Pengguna &amp; Admin
                                    </span>
                                    <h4 className="mt-1 text-3xl font-black text-white">
                                        {stats.total_users}
                                    </h4>
                                    <p className="mt-0.5 text-xs font-medium text-emerald-100/80">
                                        Akun terdaftar dalam sistem
                                    </p>
                                </div>
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-[#f59e0b]">
                                    <Users className="h-6 w-6" />
                                </div>
                            </div>
                            {userRole === 'super_admin' && (
                                <Link
                                    href="/admin/users"
                                    className="inline-flex items-center gap-1.5 border-t border-white/10 pt-2 text-xs font-bold text-[#f59e0b] transition-colors hover:text-white"
                                >
                                    Kelola Pengguna Sistem &rarr;
                                </Link>
                            )}
                        </div>

                        {/* Dark Card 2: Layanan Form External */}
                        <div className="flex flex-1 flex-col justify-between space-y-4 rounded-3xl border border-emerald-900/40 bg-[#142921] p-6 text-white shadow-md">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <span className="block text-xs font-bold tracking-wider text-emerald-200/90 uppercase">
                                        Layanan E-Legalisir
                                    </span>
                                    <h4 className="mt-1 text-xl font-black text-[#f59e0b]">
                                        Form Tersambung
                                    </h4>
                                    <p className="mt-0.5 text-xs font-medium text-emerald-100/80">
                                        Perbarui link Google Form di CMS
                                    </p>
                                </div>
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white">
                                    <FileCheck className="h-6 w-6" />
                                </div>
                            </div>
                            <Link
                                href="/admin/legalization"
                                className="inline-flex items-center gap-1.5 border-t border-white/10 pt-2 text-xs font-bold text-[#9db588] transition-colors hover:text-white"
                            >
                                Kelola Link E-Legalisir &rarr;
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ── 4. FULL-WIDTH ROW: SEBARAN DATA & AKTIVITAS PORTAL ── */}
                <div className="w-full overflow-hidden rounded-3xl border border-[#c8dac5] bg-white shadow-xs">
                    {/* Header Bar Soft Sage */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#c8dac5] bg-[#f4f8f3] p-5 sm:p-6">
                        <div>
                            <h3 className="text-xl font-black text-[#142921]">
                                Sebaran Data &amp; Aktivitas Portal
                            </h3>
                            <p className="mt-0.5 text-xs font-medium text-[#527365]">
                                Ringkasan statistik operasional seluruh modul
                                sekolah
                            </p>
                        </div>
                        <span className="rounded-full border border-[#c8dac5] bg-white px-3.5 py-1 text-xs font-bold text-[#265243] shadow-xs">
                            Update Real-time
                        </span>
                    </div>

                    {/* Clean Body Content */}
                    <div className="p-6 sm:p-8">
                        {/* Metrics - Clean Row Divided by Thin Lines */}
                        <div className="grid grid-cols-1 divide-y divide-[#e2ebd9] sm:grid-cols-4 sm:divide-x sm:divide-y-0">
                            <div className="py-2 text-center first:pl-0 sm:px-6 sm:py-0 sm:text-left">
                                <span className="block text-xs font-extrabold tracking-wider text-[#527365] uppercase">
                                    Pustaka Tersedia
                                </span>
                                <span className="mt-1 block text-2xl font-black text-[#265243]">
                                    {stats.available_books}{' '}
                                    <span className="text-xs font-bold text-[#527365]">
                                        / {stats.total_books} Buku
                                    </span>
                                </span>
                            </div>
                            <div className="py-2 text-center sm:px-6 sm:py-0 sm:text-left">
                                <span className="block text-xs font-extrabold tracking-wider text-emerald-800 uppercase">
                                    Fasilitas Sekolah
                                </span>
                                <span className="mt-1 block text-2xl font-black text-emerald-800">
                                    {stats.total_facilities}{' '}
                                    <span className="text-xs font-bold text-emerald-700">
                                        Sarana
                                    </span>
                                </span>
                            </div>
                            <div className="py-2 text-center sm:px-6 sm:py-0 sm:text-left">
                                <span className="block text-xs font-extrabold tracking-wider text-amber-700 uppercase">
                                    Galeri Dokumentasi
                                </span>
                                <span className="mt-1 block text-2xl font-black text-amber-800">
                                    {stats.total_galleries}{' '}
                                    <span className="text-xs font-bold text-amber-700">
                                        Media
                                    </span>
                                </span>
                            </div>
                            <div className="py-2 text-center sm:px-6 sm:py-0 sm:text-left">
                                <span className="block text-xs font-extrabold tracking-wider text-blue-700 uppercase">
                                    Postingan Asrama
                                </span>
                                <span className="mt-1 block text-2xl font-black text-blue-800">
                                    {stats.total_dormitory_posts}{' '}
                                    <span className="text-xs font-bold text-blue-700">
                                        Artikel
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── 5. BOTTOM SECTION: RECENT ACTIVITY (DORMITORY & NEWS) ── */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Recent Dormitory Posts Widget */}
                    <div className="space-y-4 rounded-3xl border border-[#c8dac5] bg-white p-6 shadow-xs">
                        <div className="flex items-center justify-between gap-2">
                            <div>
                                <h3 className="flex items-center gap-2 text-base font-black text-[#142921]">
                                    <Building2 className="h-4.5 w-4.5 text-[#265243]" />{' '}
                                    Postingan Asrama Terbaru
                                </h3>
                                <p className="text-xs font-medium text-[#527365]">
                                    Informasi & kegiatan santri di asrama
                                </p>
                            </div>
                            <Link
                                href="/admin/dormitory"
                                className="shrink-0 text-xs font-bold text-[#265243] hover:underline"
                            >
                                Kelola &rarr;
                            </Link>
                        </div>
                        {recentDormitoryPosts.length === 0 ? (
                            <div className="rounded-2xl border border-[#e2ebd9] bg-[#f8faf7] p-8 text-center text-xs font-medium text-[#527365]">
                                Belum ada postingan asrama.
                            </div>
                        ) : (
                            <div className="divide-y divide-[#e2ebd9]">
                                {recentDormitoryPosts.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between gap-3 py-3"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-xs font-extrabold text-[#142921] sm:text-sm">
                                                {item.title}
                                            </p>
                                            <p className="truncate text-[11px] font-medium text-[#527365]">
                                                {item.author || 'Pengurus Asrama'} •{' '}
                                                {item.created_at}
                                            </p>
                                        </div>
                                        <Link
                                            href="/admin/dormitory"
                                            className="shrink-0 rounded-full border border-[#c8dac5] bg-[#f4f8f3] px-2.5 py-1 text-[10px] font-extrabold text-[#265243] hover:bg-[#265243] hover:text-white"
                                        >
                                            Lihat
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent News Widget */}
                    <div className="space-y-4 rounded-3xl border border-[#c8dac5] bg-white p-6 shadow-xs">
                        <div className="flex items-center justify-between gap-2">
                            <div>
                                <h3 className="flex items-center gap-2 text-base font-black text-[#142921]">
                                    <Newspaper className="h-4.5 w-4.5 text-[#265243]" />{' '}
                                    Berita & Artikel Terbaru
                                </h3>
                                <p className="text-xs font-medium text-[#527365]">
                                    Artikel berita resmi yang baru dipublikasi
                                </p>
                            </div>
                            <Link
                                href="/admin/news"
                                className="shrink-0 text-xs font-bold text-[#265243] hover:underline"
                            >
                                Kelola &rarr;
                            </Link>
                        </div>
                        {recentNews.length === 0 ? (
                            <div className="rounded-2xl border border-[#e2ebd9] bg-[#f8faf7] p-8 text-center text-xs font-medium text-[#527365]">
                                Belum ada artikel berita.
                            </div>
                        ) : (
                            <div className="divide-y divide-[#e2ebd9]">
                                {recentNews.map((news) => (
                                    <div
                                        key={news.id}
                                        className="flex items-center justify-between gap-3 py-3"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-xs font-extrabold text-[#142921] sm:text-sm">
                                                {news.title}
                                            </p>
                                            <p className="truncate text-[11px] font-medium text-[#527365]">
                                                {news.author?.name || 'Admin'} •{' '}
                                                {news.published_at || 'Terbaru'}
                                            </p>
                                        </div>
                                        <Link
                                            href="/admin/news"
                                            className="shrink-0 rounded-full border border-[#c8dac5] bg-[#f4f8f3] px-2.5 py-1 text-[10px] font-extrabold text-[#265243] hover:bg-[#265243] hover:text-white"
                                        >
                                            Detail
                                        </Link>
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
