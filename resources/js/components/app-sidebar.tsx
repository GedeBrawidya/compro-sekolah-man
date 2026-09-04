import { Link, usePage } from '@inertiajs/react';
import {
    BookMarked,
    FileCheck,
    Globe,
    Home,
    LayoutGrid,
    MessageSquare,
    Newspaper,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem, SharedData } from '@/types';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const userRole = auth.user?.role || 'admin';

    const navItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
            icon: LayoutGrid,
        },
    ];

    // Humas / Admin / Super Admin
    if (userRole === 'super_admin' || userRole === 'admin') {
        navItems.push(
            {
                title: 'Berita & Galeri',
                href: '/admin/news',
                icon: Newspaper,
            },
            {
                title: 'Pengaduan',
                href: '/admin/complaints',
                icon: MessageSquare,
            },
            {
                title: 'E-Legalisir',
                href: '/admin/legalization',
                icon: FileCheck,
            }
        );
    }

    // Pengurus Asrama / Super Admin
    if (userRole === 'super_admin' || userRole === 'pengurus_asrama') {
        navItems.push({
            title: 'Profil Asrama',
            href: '/admin/dormitory',
            icon: Home,
        });
    }

    // Pustakawan / Super Admin
    if (userRole === 'super_admin' || userRole === 'pustakawan') {
        navItems.push({
            title: 'Perpustakaan',
            href: '/admin/books',
            icon: BookMarked,
        });
    }

    // Super Admin only
    if (userRole === 'super_admin') {
        navItems.push({
            title: 'Kelola Admin',
            href: '/admin/users',
            icon: Users,
        });
    }

    const footerNavItems: NavItem[] = [
        {
            title: 'Halaman Publik',
            href: '/',
            icon: Globe,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
