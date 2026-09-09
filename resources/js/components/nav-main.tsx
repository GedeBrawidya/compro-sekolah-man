import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavGroup, NavItem } from '@/types';

export function NavMain({
    groups,
    items,
}: {
    groups?: NavGroup[];
    items?: NavItem[];
}) {
    const { isCurrentUrl } = useCurrentUrl();

    const renderGroup = (groupTitle: string, groupItems: NavItem[]) => {
        if (groupItems.length === 0) return null;
        return (
            <SidebarGroup key={groupTitle} className="px-3 py-1.5 space-y-1">
                <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-widest text-[#9db588]/80 px-2.5 mb-1 select-none">
                    {groupTitle}
                </SidebarGroupLabel>
                <SidebarMenu className="space-y-1">
                    {groupItems.map((item) => {
                        const active = isCurrentUrl(item.href);
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={active}
                                    tooltip={{ children: item.title }}
                                    className={`transition-all duration-200 h-9.5 rounded-xl px-3 text-xs sm:text-sm font-semibold ${
                                        active
                                            ? 'bg-white/20 text-white font-extrabold shadow-sm border border-white/20 hover:bg-white/25 hover:text-white'
                                            : 'text-[#d1dcd4] hover:bg-[#1f3a2f] hover:text-white'
                                    }`}
                                >
                                    <Link href={item.href} prefetch className="flex items-center gap-3">
                                        {item.icon && (
                                            <item.icon
                                                className={`size-4.5 shrink-0 ${
                                                    active ? 'text-[#f59e0b]' : 'text-[#9db588]'
                                                }`}
                                            />
                                        )}
                                        <span className="truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroup>
        );
    };

    if (groups && groups.length > 0) {
        return (
            <div className="space-y-1.5 py-1">
                {groups.map((g) => renderGroup(g.title, g.items))}
            </div>
        );
    }

    return renderGroup('UTAMA', items || []);
}
