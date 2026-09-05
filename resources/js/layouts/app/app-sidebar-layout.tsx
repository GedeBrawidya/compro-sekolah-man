import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <div className="flex min-h-screen w-full bg-slate-100">
            <AppShell variant="sidebar">
                <AppSidebar />
                <AppContent variant="sidebar" className="min-w-0 overflow-x-clip bg-white">
                    {children}
                </AppContent>
            </AppShell>
        </div>
    );
}
