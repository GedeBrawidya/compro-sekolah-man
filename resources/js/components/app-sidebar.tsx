import { Link, usePage } from '@inertiajs/react';
import {
    BookMarked,
    Building2,
    FileCheck,
    Globe,
    Home,
    Image as ImageIcon,
    LayoutGrid,
    LayoutTemplate,
    MessageSquare,
    Newspaper,
    Tag,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavGroup, NavItem, SharedData } from '@/types';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const userRole = auth.user?.role || 'admin';

    const navGroups: NavGroup[] = [
        {
            title: 'UTAMA',
            items: [
                {
                    title: 'Dasbor',
                    href: '/admin/dashboard',
                    icon: LayoutGrid,
                },
            ],
        },
    ];

    // Konten & CMS Group
    if (userRole === 'super_admin' || userRole === 'admin') {
        navGroups.push({
            title: 'KONTEN & CMS',
            items: [
                {
                    title: 'CMS Beranda',
                    href: '/admin/landing-page',
                    icon: LayoutTemplate,
                },
                {
                    title: 'Sarana & Prasarana',
                    href: '/admin/facilities',
                    icon: Building2,
                },
                {
                    title: 'Berita Sekolah',
                    href: '/admin/news',
                    icon: Newspaper,
                },
                {
                    title: 'Galeri Dokumentasi',
                    href: '/admin/gallery',
                    icon: ImageIcon,
                },
            ],
        });
    }

    // Akademik & Asrama Group
    const akademikItems: NavItem[] = [];
    if (
        userRole === 'super_admin' ||
        userRole === 'admin' ||
        userRole === 'pustakawan'
    ) {
        akademikItems.push(
            {
                title: 'Katalog Buku',
                href: '/admin/books',
                icon: BookMarked,
            },
            {
                title: 'Kategori Buku',
                href: '/admin/book-categories',
                icon: Tag,
            },
        );
    }
    if (
        userRole === 'super_admin' ||
        userRole === 'admin' ||
        userRole === 'pengurus_asrama'
    ) {
        akademikItems.push({
            title: 'Informasi Asrama',
            href: '/admin/dormitory',
            icon: Home,
        });
    }
    if (akademikItems.length > 0) {
        navGroups.push({
            title: 'PERPUSTAKAAN & ASRAMA',
            items: akademikItems,
        });
    }

    // Layanan & Publik Group
    if (userRole === 'super_admin' || userRole === 'admin') {
        navGroups.push({
            title: 'LAYANAN & PUBLIK',
            items: [
                {
                    title: 'E-Legalisir Alumni',
                    href: '/admin/legalization',
                    icon: FileCheck,
                },
                {
                    title: 'Pengaduan Masyarakat',
                    href: '/admin/complaints',
                    icon: MessageSquare,
                },
            ],
        });
    }

    // Pengaturan & User Group
    if (userRole === 'super_admin') {
        navGroups.push({
            title: 'PENGATURAN',
            items: [
                {
                    title: 'Manajemen User',
                    href: '/admin/users',
                    icon: Users,
                },
            ],
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
        <Sidebar
            collapsible="none"
            variant="sidebar"
            className="sticky top-0 h-screen shrink-0 bg-transparent py-3 pl-3"
        >
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#316150] bg-[#265243] text-white shadow-xl">
                {/* Header */}
                <div className="shrink-0 border-b border-[#316150] px-5 py-5">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                size="lg"
                                asChild
                                className="hover:bg-transparent"
                            >
                                <Link href="/admin/dashboard" prefetch>
                                    <AppLogo />
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </div>

                {/* Nav Items Grouped */}
                <SidebarContent className="flex-1 overflow-y-auto px-1 py-2">
                    <NavMain groups={navGroups} />
                </SidebarContent>

                {/* Footer */}
                <div className="shrink-0 space-y-1 border-t border-[#316150] px-3 py-3">
                    <NavFooter items={footerNavItems} className="mt-auto" />
                    <NavUser />
                </div>
            </div>
        </Sidebar>
    );
}
