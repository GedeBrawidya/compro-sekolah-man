import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import type { AppLayoutProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function AppHeaderLayout({
    children,
    breadcrumbs,
}: AppLayoutProps) {
    const { school_logo_url } = usePage().props as any;
    const logoUrl = school_logo_url || '/favicon.png';

    return (
        <AppShell variant="header">
            <Head>
                <link rel="icon" href={logoUrl} />
                <link rel="shortcut icon" href={logoUrl} />
                <link rel="apple-touch-icon" href={logoUrl} />
            </Head>
            <AppHeader breadcrumbs={breadcrumbs} />
            <AppContent variant="header">{children}</AppContent>
        </AppShell>
    );
}
