import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginationProps {
    links?: PaginationLink[];
    from?: number | null;
    to?: number | null;
    total?: number | null;
    className?: string;
}

export function Pagination({ links, from, to, total, className = '' }: PaginationProps) {
    if (!links || links.length <= 3) {
        return null;
    }

    const cleanLabel = (label: string) => {
        return label
            .replace(/&laquo;/g, '')
            .replace(/&raquo;/g, '')
            .replace(/Previous/gi, 'Sebelumnya')
            .replace(/Next/gi, 'Selanjutnya')
            .trim();
    };

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-2 border-t border-[#c8dac5]/50 ${className}`}>
            <div className="text-xs sm:text-sm text-[#527365] font-bold">
                {from != null && to != null && total != null ? (
                    <>
                        Menampilkan <span className="font-extrabold text-[#142921]">{from}</span> -{' '}
                        <span className="font-extrabold text-[#142921]">{to}</span> dari{' '}
                        <span className="font-extrabold text-[#142921]">{total}</span> data
                    </>
                ) : (
                    'Navigasi Halaman'
                )}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap justify-center">
                {links.map((link, key) => {
                    const isPrev = link.label.includes('&laquo;') || link.label.toLowerCase().includes('previous');
                    const isNext = link.label.includes('&raquo;') || link.label.toLowerCase().includes('next');
                    const label = cleanLabel(link.label);

                    if (link.url === null) {
                        return (
                            <span
                                key={key}
                                className="inline-flex items-center justify-center px-3.5 py-1.5 min-w-[36px] h-9 text-xs sm:text-sm font-bold text-slate-400 bg-[#eef4eb] rounded-xl cursor-not-allowed border-none opacity-50 select-none"
                            >
                                {isPrev ? (
                                    <span className="flex items-center gap-1">
                                        <ChevronLeft className="w-4 h-4" />
                                        <span className="hidden md:inline">Sebelumnya</span>
                                    </span>
                                ) : isNext ? (
                                    <span className="flex items-center gap-1">
                                        <span className="hidden md:inline">Selanjutnya</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </span>
                                ) : (
                                    label
                                )}
                            </span>
                        );
                    }

                    return (
                        <Link
                            key={key}
                            href={link.url}
                            preserveScroll
                            preserveState
                            className={`inline-flex items-center justify-center px-3.5 py-1.5 min-w-[36px] h-9 text-xs sm:text-sm font-extrabold rounded-xl transition-all duration-200 border-none shadow-2xs ${
                                link.active
                                    ? 'bg-[#265243] text-white shadow-sm scale-105'
                                    : 'bg-[#e4ebe2] text-[#142921] hover:bg-[#265243] hover:text-white'
                            }`}
                        >
                            {isPrev ? (
                                <span className="flex items-center gap-1">
                                    <ChevronLeft className="w-4 h-4" />
                                    <span className="hidden md:inline">Sebelumnya</span>
                                </span>
                            ) : isNext ? (
                                <span className="flex items-center gap-1">
                                    <span className="hidden md:inline">Selanjutnya</span>
                                    <ChevronRight className="w-4 h-4" />
                                </span>
                            ) : (
                                label
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
