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
        <div className="w-full space-y-6 p-4 sm:p-6">
            <div
                style={{ backgroundColor: '#f2f7f0', borderColor: '#b8ceb0' }}
                className="space-y-6 rounded-2xl border p-6 shadow-xs"
            >
                <div>
                    <h1 className="text-2xl font-extrabold text-[#142921]">
                        Pengaturan Akun
                    </h1>
                    <p className="mt-1 text-xs font-semibold text-[#2e5445]">
                        Kelola profil, kata sandi, dan tampilan preferensi akun
                        Anda.
                    </p>
                </div>

                <div className="flex flex-col gap-6 lg:flex-row">
                    <aside className="w-full shrink-0 lg:w-56">
                        <nav
                            className="flex flex-row gap-1.5 overflow-x-auto pb-2 lg:flex-col lg:pb-0"
                            aria-label="Settings"
                        >
                            {sidebarNavItems.map((item, index) => {
                                const isActive = isCurrentOrParentUrl(
                                    item.href,
                                );
                                return (
                                    <Link
                                        key={`${toUrl(item.href)}-${index}`}
                                        href={item.href}
                                        style={{
                                            backgroundColor: isActive
                                                ? '#265243'
                                                : 'transparent',
                                            color: isActive
                                                ? '#ffffff'
                                                : '#142921',
                                        }}
                                        className={cn(
                                            'flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all',
                                            !isActive && 'hover:bg-[#dce8d7]',
                                        )}
                                    >
                                        {item.icon && (
                                            <item.icon className="h-4 w-4 shrink-0" />
                                        )}
                                        <span>
                                            {item.title === 'Profile'
                                                ? 'Profil Saya'
                                                : item.title === 'Security'
                                                  ? 'Keamanan & Password'
                                                  : item.title === 'Appearance'
                                                    ? 'Tampilan'
                                                    : item.title}
                                        </span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </aside>

                    <div className="min-w-0 flex-1">
                        <div
                            style={{
                                backgroundColor: '#f7faf5',
                                borderColor: '#b8ceb0',
                            }}
                            className="space-y-6 rounded-2xl border p-6 shadow-xs"
                        >
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
