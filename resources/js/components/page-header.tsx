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

export function PageHeader({
    title,
    description,
    icon: Icon,
    badge,
    action,
}: PageHeaderProps) {
    const props = usePage().props as any;
    const schoolLogoUrl = props.school_logo_url;

    return (
        <div className="relative mb-6 overflow-hidden rounded-2xl border border-[#316150] bg-[#265243] p-6 text-white shadow-md sm:p-7">
            <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-start gap-4 sm:items-center">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 p-2.5 text-white shadow-sm backdrop-blur-md">
                        {schoolLogoUrl ? (
                            <img
                                src={schoolLogoUrl}
                                alt="Logo Sekolah"
                                className="h-full w-full object-contain"
                            />
                        ) : Icon ? (
                            <Icon className="h-6 w-6" />
                        ) : (
                            <Building2 className="h-6 w-6" />
                        )}
                    </div>
                    <div>
                        {badge && (
                            <div className="mb-1.5 flex items-center gap-2">
                                <span className="rounded-full border border-white/30 bg-white/20 px-3 py-0.5 text-[11px] font-bold tracking-wider text-white uppercase backdrop-blur-md">
                                    {badge}
                                </span>
                            </div>
                        )}
                        <h1 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                            {title}
                        </h1>
                        {description && (
                            <p className="mt-1 max-w-3xl text-xs leading-relaxed text-slate-100/90 sm:text-sm">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                {action && (
                    <div className="flex shrink-0 items-center gap-3 self-start pt-2 sm:self-auto sm:pt-0 [&_a]:!bg-white [&_a]:!font-bold [&_a]:!text-[#265243] [&_a]:!shadow-sm [&_a]:hover:!bg-slate-100 [&_button]:!bg-white [&_button]:!font-bold [&_button]:!text-[#265243] [&_button]:!shadow-sm [&_button]:hover:!bg-slate-100">
                        {action}
                    </div>
                )}
            </div>
        </div>
    );
}
