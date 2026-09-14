import { Link, usePage } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const props = usePage().props as any;
    const schoolName = props.school_name || props.name || 'MAN Tanjungpinang';
    const logoUrl = props.school_logo_url;

    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#0d1f1a] via-[#142921] to-[#1d3d2f] p-6">
            {/* Background decorative blobs */}
            <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#265243]/30 blur-3xl" />
            <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-[#f59e0b]/10 blur-3xl" />
            <div className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#265243]/10 blur-[100px]" />

            {/* Floating shapes */}
            <div className="pointer-events-none absolute top-10 left-10 h-10 w-10 rotate-12 rounded-2xl border border-white/10 bg-white/5" />
            <div className="pointer-events-none absolute right-12 bottom-10 h-7 w-7 rounded-xl border border-[#f59e0b]/20 bg-[#f59e0b]/10" />
            <div className="pointer-events-none absolute top-1/4 right-10 h-5 w-5 rounded-full bg-[#9db588]/20" />

            {/* Card */}
            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <Link
                    href={home()}
                    className="group mb-6 flex items-center justify-center gap-3"
                >
                    {logoUrl ? (
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 p-1 shadow-lg transition-transform group-hover:scale-105">
                            <img
                                src={logoUrl}
                                alt={schoolName}
                                className="h-full w-full object-contain"
                            />
                        </div>
                    ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#9db588] text-xl font-black text-[#142921] shadow-lg transition-transform group-hover:scale-105">
                            {schoolName.charAt(0)}
                        </div>
                    )}
                    <div className="text-left">
                        <span className="block text-sm leading-tight font-extrabold text-white">
                            {schoolName}
                        </span>
                        <span className="text-[10px] font-bold tracking-widest text-[#9db588] uppercase">
                            Portal Administrasi
                        </span>
                    </div>
                </Link>

                {/* Form card */}
                <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-8 shadow-2xl backdrop-blur-2xl">
                    <div className="mb-7 text-center">
                        <h1 className="text-2xl font-black text-white">
                            {title}
                        </h1>
                        <p className="mt-1.5 text-sm font-medium text-white/50">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>

                <p className="mt-5 text-center text-[11px] font-medium text-white/25">
                    © {new Date().getFullYear()} {schoolName}. Hak cipta
                    dilindungi.
                </p>
            </div>
        </div>
    );
}
