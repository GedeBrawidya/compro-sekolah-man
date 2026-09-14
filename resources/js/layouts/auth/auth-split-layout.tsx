import { Link, usePage } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const props = usePage().props as any;
    const schoolName = props.school_name || props.name || 'MAN Tanjungpinang';
    const logoUrl = props.school_logo_url;

    return (
        <div className="relative flex min-h-dvh w-full overflow-hidden">
            {/* ── Left Panel ─────────────────────────────────────────────── */}
            <div className="relative hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0d1f1a] via-[#142921] to-[#1d3d2f]" />

                {/* Decorative circles */}
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#265243]/30 blur-3xl" />
                <div className="absolute top-1/3 -right-20 w-72 h-72 rounded-full bg-[#f59e0b]/10 blur-3xl" />
                <div className="absolute -bottom-20 left-1/4 w-80 h-80 rounded-full bg-[#265243]/20 blur-3xl" />

                {/* Floating decorative shapes */}
                <div className="absolute top-16 right-16 w-14 h-14 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm rotate-12 animate-[spin_20s_linear_infinite]" />
                <div className="absolute top-40 right-32 w-8 h-8 rounded-xl border border-[#f59e0b]/30 bg-[#f59e0b]/10 -rotate-6" />
                <div className="absolute bottom-32 left-16 w-10 h-10 rounded-full border border-white/10 bg-white/5" />
                <div className="absolute bottom-48 right-20 w-6 h-6 rounded-full bg-[#f59e0b]/40 blur-sm" />

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">
                    {/* Logo & School Name */}
                    <Link href={home()} className="flex items-center gap-3 group">
                        {logoUrl ? (
                            <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center p-1 shadow-lg">
                                <img src={logoUrl} alt={schoolName} className="w-full h-full object-contain" />
                            </div>
                        ) : (
                            <div className="w-11 h-11 rounded-xl bg-[#9db588] text-[#142921] flex items-center justify-center font-black text-xl shadow-lg">
                                {schoolName.charAt(0)}
                            </div>
                        )}
                        <div>
                            <span className="text-white font-extrabold text-sm leading-tight block">{schoolName}</span>
                            <span className="text-[#9db588] text-[10px] font-bold tracking-widest uppercase">Portal Administrasi</span>
                        </div>
                    </Link>

                    {/* Illustration area */}
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                        {/* School Logo display */}
                        <div className="relative mb-8">
                            <div className="w-52 h-52 xl:w-64 xl:h-64 rounded-[40px] bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center p-8 shadow-2xl mx-auto group">
                                {logoUrl ? (
                                    <img
                                        src={logoUrl}
                                        alt={schoolName}
                                        className="w-full h-full object-contain filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.4)] transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-28 h-28 rounded-3xl bg-[#9db588] text-[#142921] flex items-center justify-center font-black text-6xl shadow-inner">
                                        {schoolName.charAt(0)}
                                    </div>
                                )}
                            </div>
                            {/* Floating badges */}
                            <div className="absolute -top-4 -right-4 bg-[#f59e0b] text-[#142921] rounded-2xl px-3.5 py-1.5 text-[11px] font-black shadow-lg border border-[#f59e0b]/50">
                                ✦ Portal Sekolah
                            </div>
                            <div className="absolute -bottom-3 -left-4 bg-white/10 backdrop-blur-md text-white rounded-2xl px-3.5 py-1.5 text-[11px] font-bold border border-white/20 shadow-lg">
                                📚 Sistem Informasi
                            </div>
                        </div>

                        <h2 className="text-3xl xl:text-4xl font-black text-white leading-tight mb-3">
                            Portal Administrasi<br />
                            <span className="text-[#9db588]">Sekolah Digital</span>
                        </h2>
                        <p className="text-white/60 text-sm font-medium leading-relaxed max-w-xs">
                            Kelola data sekolah, berita, fasilitas, dan administrasi dalam satu platform terintegrasi.
                        </p>
                    </div>

                    {/* Bottom stats */}
                    <div className="flex items-center justify-center gap-8 py-4 border-t border-white/10">
                        {[
                            { label: 'Berita', val: '∞' },
                            { label: 'Fasilitas', val: '✓' },
                            { label: 'Galeri', val: '✓' },
                        ].map((item) => (
                            <div key={item.label} className="text-center">
                                <div className="text-[#f59e0b] font-black text-lg">{item.val}</div>
                                <div className="text-white/50 text-[11px] font-bold">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Right Panel ─────────────────────────────────────────────── */}
            <div className="flex flex-1 flex-col items-center justify-center bg-[#f8faf7] px-6 py-10 sm:px-10">
                {/* Mobile logo */}
                <Link href={home()} className="flex items-center gap-3 mb-8 lg:hidden">
                    {logoUrl ? (
                        <div className="w-10 h-10 rounded-xl bg-[#265243]/10 border border-[#265243]/20 flex items-center justify-center p-1">
                            <img src={logoUrl} alt={schoolName} className="w-full h-full object-contain" />
                        </div>
                    ) : (
                        <div className="w-10 h-10 rounded-xl bg-[#265243] text-white flex items-center justify-center font-black text-lg">
                            {schoolName.charAt(0)}
                        </div>
                    )}
                    <div>
                        <span className="text-[#142921] font-extrabold text-sm block">{schoolName}</span>
                        <span className="text-[#527365] text-[10px] font-bold tracking-widest uppercase">Portal Administrasi</span>
                    </div>
                </Link>

                <div className="w-full max-w-md">
                    {/* Card */}
                    <div className="bg-white rounded-3xl shadow-xl border border-[#e2ebd9] p-8 sm:p-10">
                        <div className="mb-8 text-center">
                            <h1 className="text-2xl font-black text-[#142921]">{title}</h1>
                            <p className="text-[#527365] text-sm mt-1.5 font-medium">{description}</p>
                        </div>
                        {children}
                    </div>

                    <p className="text-center text-[11px] text-[#527365]/60 font-medium mt-6">
                        © {new Date().getFullYear()} {schoolName}. Hak cipta dilindungi undang-undang.
                    </p>
                </div>
            </div>
        </div>
    );
}
