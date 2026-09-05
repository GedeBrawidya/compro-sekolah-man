import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import { edit as editAppearance } from '@/routes/appearance';

export default function Appearance() {
    return (
        <>
            <Head title="Pengaturan Tampilan" />

            <div className="space-y-6">
                <div className="border-b border-[#b8ceb0] pb-4">
                    <h2 className="text-lg font-bold text-[#142921]">Pengaturan Tampilan</h2>
                    <p className="text-xs font-semibold text-[#2e5445] mt-1">Pilih tema mode tampilan aplikasi yang sesuai dengan kenyamanan Anda.</p>
                </div>
                <AppearanceTabs />
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'Tampilan',
            href: editAppearance(),
        },
    ],
};
