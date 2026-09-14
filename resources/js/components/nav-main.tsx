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
            <SidebarGroup key={groupTitle} className="space-y-1 px-3 py-1.5">
                <SidebarGroupLabel className="mb-1 px-2.5 text-[10px] font-black tracking-widest text-[#9db588]/80 uppercase select-none">
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
                                    className={`h-9.5 rounded-xl px-3 text-xs font-semibold transition-all duration-200 sm:text-sm ${
                                        active
                                            ? 'border border-white/20 bg-white/20 font-extrabold text-white shadow-sm hover:bg-white/25 hover:text-white'
                                            : 'text-[#d1dcd4] hover:bg-[#1f3a2f] hover:text-white'
                                    }`}
                                >
                                    <Link
                                        href={item.href}
                                        prefetch
                                        className="flex items-center gap-3"
                                    >
                                        {item.icon && (
                                            <item.icon
                                                className={`size-4.5 shrink-0 ${
                                                    active
                                                        ? 'text-[#f59e0b]'
                                                        : 'text-[#9db588]'
                                                }`}
                                            />
                                        )}
                                        <span className="truncate group-data-[collapsible=icon]:hidden">
                                            {item.title}
                                        </span>
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
