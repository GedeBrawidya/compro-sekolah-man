import { usePage } from '@inertiajs/react';

export default function AppLogo() {
    const props = usePage().props as any;
    const schoolName = props.school_name || props.name || 'MAN Tanjungpinang';
    const logoUrl = props.school_logo_url;

    return (
        <div className="flex items-center gap-3">
            {logoUrl ? (
                <div className="flex aspect-square size-12 items-center justify-center rounded-xl bg-white/10 p-1 border border-white/20 shadow-md shrink-0">
                    <img src={logoUrl} alt={schoolName} className="size-full object-contain" />
                </div>
            ) : (
                <div className="bg-[#9db588] text-[#142921] flex aspect-square size-12 items-center justify-center rounded-xl font-black text-xl shadow-md shrink-0">
                    {schoolName ? schoolName.charAt(0) : 'M'}
                </div>
            )}
            <div className="grid flex-1 text-left group-data-[collapsible=icon]:hidden">
                <span className="truncate leading-tight font-extrabold text-white text-sm">
                    {schoolName}
                </span>
                <span className="text-[10px] text-[#9db588] font-bold tracking-wider uppercase mt-0.5">
                    PROFIL SEKOLAH
                </span>
            </div>
        </div>
    );
}
