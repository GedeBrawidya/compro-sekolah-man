import { Link, usePage } from '@inertiajs/react';
import {
    BookMarked,
    FileCheck,
    Globe,
    Home,
    Image as ImageIcon,
    LayoutGrid,
    LayoutTemplate,
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
                title: 'Beranda (CMS)',
                href: '/admin/landing-page',
                icon: LayoutTemplate,
            },
            {
                title: 'Berita Sekolah',
                href: '/admin/news',
                icon: Newspaper,
            },
            {
                title: 'Galeri Foto & Video',
                href: '/admin/gallery',
                icon: ImageIcon,
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
        <Sidebar collapsible="none" variant="sidebar" className="bg-transparent shrink-0 py-3 pl-3 sticky top-0 h-screen">
            <div className="flex flex-col h-full bg-[#142921] text-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="border-b border-[#1d3d31] px-5 py-5 shrink-0">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
                                <Link href="/admin/dashboard" prefetch>
                                    <AppLogo />
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </div>

                {/* Nav Items */}
                <SidebarContent className="py-3 px-1 flex-1 overflow-y-auto">
                    <NavMain items={navItems} />
                </SidebarContent>

                {/* Footer */}
                <div className="border-t border-[#1d3d31] px-3 py-3 space-y-1 shrink-0">
                    <NavFooter items={footerNavItems} className="mt-auto" />
                    <NavUser />
                </div>
            </div>
        </Sidebar>
    );
}
