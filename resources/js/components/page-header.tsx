import { ReactNode } from 'react';
import { LucideIcon, Building2 } from 'lucide-react';
import { usePage } from '@inertiajs/react';

interface PageHeaderProps {
    title: string;
    description?: string;
    icon?: LucideIcon;
    badge?: string;
    action?: ReactNode;
}

export function PageHeader({ title, description, icon: Icon, badge, action }: PageHeaderProps) {
    const props = usePage().props as any;
    const schoolLogoUrl = props.school_logo_url;

    return (
        <div className="relative overflow-hidden rounded-2xl bg-[#265243] p-6 sm:p-7 text-white shadow-md border border-[#316150] mb-6">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-4">
                    <div className="p-2.5 rounded-2xl bg-white/15 text-white backdrop-blur-md border border-white/20 shadow-sm shrink-0 flex items-center justify-center w-12 h-12">
                        {schoolLogoUrl ? (
                            <img src={schoolLogoUrl} alt="Logo Sekolah" className="w-full h-full object-contain" />
                        ) : Icon ? (
                            <Icon className="w-6 h-6" />
                        ) : (
                            <Building2 className="w-6 h-6" />
                        )}
                    </div>
                    <div>
                        {badge && (
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full bg-white/20 text-white backdrop-blur-md border border-white/30">
                                    {badge}
                                </span>
                            </div>
                        )}
                        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                            {title}
                        </h1>
                        {description && (
                            <p className="mt-1 text-xs sm:text-sm text-slate-100/90 max-w-3xl leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                {action && (
                    <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto pt-2 sm:pt-0 [&_a]:!bg-white [&_a]:!text-[#265243] [&_a]:hover:!bg-slate-100 [&_a]:!font-bold [&_a]:!shadow-sm [&_button]:!bg-white [&_button]:!text-[#265243] [&_button]:hover:!bg-slate-100 [&_button]:!font-bold [&_button]:!shadow-sm">
                        {action}
                    </div>
                )}
            </div>
        </div>
    );
}
