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
        <div className="min-h-svh bg-gradient-to-br from-[#0d1f1a] via-[#142921] to-[#1d3d2f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background decorative blobs */}
            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#265243]/30 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#f59e0b]/10 blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#265243]/10 blur-[100px] pointer-events-none" />

            {/* Floating shapes */}
            <div className="absolute top-10 left-10 w-10 h-10 rounded-2xl border border-white/10 bg-white/5 rotate-12 pointer-events-none" />
            <div className="absolute bottom-10 right-12 w-7 h-7 rounded-xl border border-[#f59e0b]/20 bg-[#f59e0b]/10 pointer-events-none" />
            <div className="absolute top-1/4 right-10 w-5 h-5 rounded-full bg-[#9db588]/20 pointer-events-none" />

            {/* Card */}
            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <Link href={home()} className="flex items-center justify-center gap-3 mb-6 group">
                    {logoUrl ? (
                        <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center p-1 shadow-lg group-hover:scale-105 transition-transform">
                            <img src={logoUrl} alt={schoolName} className="w-full h-full object-contain" />
                        </div>
                    ) : (
                        <div className="w-12 h-12 rounded-xl bg-[#9db588] text-[#142921] flex items-center justify-center font-black text-xl shadow-lg group-hover:scale-105 transition-transform">
                            {schoolName.charAt(0)}
                        </div>
                    )}
                    <div className="text-left">
                        <span className="text-white font-extrabold text-sm leading-tight block">{schoolName}</span>
                        <span className="text-[#9db588] text-[10px] font-bold tracking-widest uppercase">Portal Administrasi</span>
                    </div>
                </Link>

                {/* Form card */}
                <div className="bg-white/[0.07] backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8">
                    <div className="text-center mb-7">
                        <h1 className="text-2xl font-black text-white">{title}</h1>
                        <p className="text-white/50 text-sm mt-1.5 font-medium">{description}</p>
                    </div>
                    {children}
                </div>

                <p className="text-center text-[11px] text-white/25 font-medium mt-5">
                    © {new Date().getFullYear()} {schoolName}. Hak cipta dilindungi.
                </p>
            </div>
        </div>
    );
}
