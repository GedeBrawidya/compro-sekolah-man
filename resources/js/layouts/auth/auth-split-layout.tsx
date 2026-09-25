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
            <div className="relative hidden flex-col overflow-hidden lg:flex lg:w-[52%] xl:w-[55%]">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0d1f1a] via-[#142921] to-[#1d3d2f]" />

                {/* Decorative circles */}
                <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#265243]/30 blur-3xl" />
                <div className="absolute top-1/3 -right-20 h-72 w-72 rounded-full bg-[#f59e0b]/10 blur-3xl" />
                <div className="absolute -bottom-20 left-1/4 h-80 w-80 rounded-full bg-[#265243]/20 blur-3xl" />

                {/* Floating decorative shapes */}
                <div className="absolute top-16 right-16 h-14 w-14 rotate-12 animate-[spin_20s_linear_infinite] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm" />
                <div className="absolute top-40 right-32 h-8 w-8 -rotate-6 rounded-xl border border-[#f59e0b]/30 bg-[#f59e0b]/10" />
                <div className="absolute bottom-32 left-16 h-10 w-10 rounded-full border border-white/10 bg-white/5" />
                <div className="absolute right-20 bottom-48 h-6 w-6 rounded-full bg-[#f59e0b]/40 blur-sm" />

                {/* Content */}
                <div className="relative z-10 flex h-full flex-col p-10 xl:p-14">
                    {/* Logo & School Name */}
                    <Link
                        href={home()}
                        className="group flex items-center gap-3"
                    >
                        {logoUrl ? (
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 p-1 shadow-lg">
                                <img
                                    src={logoUrl}
                                    alt={schoolName}
                                    className="h-full w-full object-contain"
                                />
                            </div>
                        ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#9db588] text-xl font-black text-[#142921] shadow-lg">
                                {schoolName.charAt(0)}
                            </div>
                        )}
                        <div>
                            <span className="block text-sm leading-tight font-extrabold text-white">
                                {schoolName}
                            </span>
                            <span className="text-[10px] font-bold tracking-widest text-[#9db588] uppercase">
                                Portal Administrasi
                            </span>
                        </div>
                    </Link>

                    {/* Illustration area */}
                    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
                        {/* School Logo display */}
                        <div className="relative mb-8">
                            <div className="group mx-auto flex h-52 w-52 items-center justify-center rounded-[40px] border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-md xl:h-64 xl:w-64">
                                {logoUrl ? (
                                    <img
                                        src={logoUrl}
                                        alt={schoolName}
                                        className="h-full w-full object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.4)] filter transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-[#9db588] text-6xl font-black text-[#142921] shadow-inner">
                                        {schoolName.charAt(0)}
                                    </div>
                                )}
                            </div>
                            {/* Floating badges */}
                            <div className="absolute -top-4 -right-4 rounded-2xl border border-[#f59e0b]/50 bg-[#f59e0b] px-3.5 py-1.5 text-[11px] font-black text-[#142921] shadow-lg">
                                Portal Sekolah
                            </div>
                            <div className="absolute -bottom-3 -left-4 rounded-2xl border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold text-white shadow-lg backdrop-blur-md">
                                Sistem Informasi
                            </div>
                        </div>

                        <h2 className="mb-3 text-3xl leading-tight font-black text-white xl:text-4xl">
                            Portal Administrasi
                            <br />
                            <span className="text-[#9db588]">
                                Sekolah Digital
                            </span>
                        </h2>
                        <p className="max-w-xs text-sm leading-relaxed font-medium text-white/60">
                            Kelola data sekolah, berita, fasilitas, dan
                            administrasi dalam satu platform terintegrasi.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Right Panel ─────────────────────────────────────────────── */}
            <div className="flex flex-1 flex-col items-center justify-center bg-[#f8faf7] px-6 py-10 sm:px-10">
                {/* Mobile logo */}
                <Link
                    href={home()}
                    className="mb-8 flex items-center gap-3 lg:hidden"
                >
                    {logoUrl ? (
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#265243]/20 bg-[#265243]/10 p-1">
                            <img
                                src={logoUrl}
                                alt={schoolName}
                                className="h-full w-full object-contain"
                            />
                        </div>
                    ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#265243] text-lg font-black text-white">
                            {schoolName.charAt(0)}
                        </div>
                    )}
                    <div>
                        <span className="block text-sm font-extrabold text-[#142921]">
                            {schoolName}
                        </span>
                        <span className="text-[10px] font-bold tracking-widest text-[#527365] uppercase">
                            Portal Administrasi
                        </span>
                    </div>
                </Link>

                <div className="w-full max-w-md">
                    {/* Card */}
                    <div className="rounded-3xl border border-[#e2ebd9] bg-white p-8 shadow-xl sm:p-10">
                        <div className="mb-8 text-center">
                            <h1 className="text-2xl font-black text-[#142921]">
                                {title}
                            </h1>
                            <p className="mt-1.5 text-sm font-medium text-[#527365]">
                                {description}
                            </p>
                        </div>
                        {children}
                    </div>

                    <p className="mt-6 text-center text-[11px] font-medium text-[#527365]/60">
                        © {new Date().getFullYear()} {schoolName}. Hak cipta
                        dilindungi undang-undang.
                    </p>
                </div>
            </div>
        </div>
    );
}
