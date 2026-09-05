import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ items }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-3 py-1">
            <SidebarGroupLabel className="text-[11px] font-bold uppercase tracking-wider text-[#7ea38c] mb-2 px-2">
                Navigasi Utama
            </SidebarGroupLabel>
            <SidebarMenu className="space-y-1">
                {items.map((item) => {
                    const active = isCurrentUrl(item.href);
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={active}
                                tooltip={{ children: item.title }}
                                className={`transition-all duration-200 h-10 rounded-xl px-3 text-sm font-medium ${
                                    active
                                        ? 'bg-[#9db588] text-[#142921] font-bold shadow-md shadow-black/10 hover:bg-[#a8bf93] hover:text-[#142921]'
                                        : 'text-[#d1dcd4] hover:bg-[#1f3a2f] hover:text-white'
                                }`}
                            >
                                <Link href={item.href} prefetch className="flex items-center gap-3">
                                    {item.icon && (
                                        <item.icon
                                            className={`size-4.5 shrink-0 ${
                                                active ? 'text-[#142921]' : 'text-[#9db588]'
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
}
