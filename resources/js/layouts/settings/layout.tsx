import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: edit(),
        icon: null,
    },
    {
        title: 'Security',
        href: editSecurity(),
        icon: null,
    },
    {
        title: 'Appearance',
        href: editAppearance(),
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className="p-4 sm:p-6 w-full space-y-6">
            <div style={{ backgroundColor: '#f2f7f0', borderColor: '#b8ceb0' }} className="p-6 rounded-2xl border shadow-xs space-y-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-[#142921]">Pengaturan Akun</h1>
                    <p className="text-xs font-semibold text-[#2e5445] mt-1">Kelola profil, kata sandi, dan tampilan preferensi akun Anda.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    <aside className="w-full lg:w-56 shrink-0">
                        <nav
                            className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0"
                            aria-label="Settings"
                        >
                            {sidebarNavItems.map((item, index) => {
                                const isActive = isCurrentOrParentUrl(item.href);
                                return (
                                    <Link
                                        key={`${toUrl(item.href)}-${index}`}
                                        href={item.href}
                                        style={{
                                            backgroundColor: isActive ? '#265243' : 'transparent',
                                            color: isActive ? '#ffffff' : '#142921',
                                        }}
                                        className={cn(
                                            'px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap',
                                            !isActive && 'hover:bg-[#dce8d7]'
                                        )}
                                    >
                                        {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
                                        <span>{item.title === 'Profile' ? 'Profil Saya' : item.title === 'Security' ? 'Keamanan & Password' : item.title === 'Appearance' ? 'Tampilan' : item.title}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </aside>

                    <div className="flex-1 min-w-0">
                        <div style={{ backgroundColor: '#f7faf5', borderColor: '#b8ceb0' }} className="p-6 rounded-2xl border shadow-xs space-y-6">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
