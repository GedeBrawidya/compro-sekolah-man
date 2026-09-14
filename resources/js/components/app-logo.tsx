import { usePage } from '@inertiajs/react';

export default function AppLogo() {
    const props = usePage().props as any;
    const schoolName = props.school_name || props.name || 'MAN Tanjungpinang';
    const logoUrl = props.school_logo_url;

    return (
        <div className="flex items-center gap-3">
            {logoUrl ? (
                <div className="flex aspect-square size-12 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 p-1 shadow-md">
                    <img
                        src={logoUrl}
                        alt={schoolName}
                        className="size-full object-contain"
                    />
                </div>
            ) : (
                <div className="flex aspect-square size-12 shrink-0 items-center justify-center rounded-xl bg-[#9db588] text-xl font-black text-[#142921] shadow-md">
                    {schoolName ? schoolName.charAt(0) : 'M'}
                </div>
            )}
            <div className="grid flex-1 text-left group-data-[collapsible=icon]:hidden">
                <span className="truncate text-sm leading-tight font-extrabold text-white">
                    {schoolName}
                </span>
                <span className="mt-0.5 text-[10px] font-bold tracking-wider text-[#9db588] uppercase">
                    PROFIL SEKOLAH
                </span>
            </div>
        </div>
    );
}
