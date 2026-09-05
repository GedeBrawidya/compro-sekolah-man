import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    const { school_logo_url } = usePage().props as any;
    const logoUrl = school_logo_url || '/favicon.png';

    return (
        <div className="flex min-h-screen w-full bg-slate-100">
            <Head>
                <link rel="icon" href={logoUrl} />
                <link rel="shortcut icon" href={logoUrl} />
                <link rel="apple-touch-icon" href={logoUrl} />
            </Head>
            <AppShell variant="sidebar">
                <AppSidebar />
                <AppContent variant="sidebar" className="min-w-0 overflow-x-clip bg-white">
                    {children}
                </AppContent>
            </AppShell>
        </div>
    );
}
