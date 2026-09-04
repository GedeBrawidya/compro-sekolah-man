import { usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <>
            <div className="bg-[#265243] text-white flex aspect-square size-8 items-center justify-center rounded-lg shadow-sm">
                <AppLogoIcon className="size-5 fill-current text-white" />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm group-data-[collapsible=icon]:hidden">
                <span className="mb-0.5 truncate leading-tight font-bold text-slate-900 dark:text-white">
                    {name || 'CMS Sekolah'}
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Profil Sekolah</span>
            </div>
        </>
    );
}
