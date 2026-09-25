import { TabType } from './types';

interface FooterBannerProps {
    settings: Record<string, string>;
    activeTab: TabType;
}

export function FooterBanner({ settings, activeTab }: FooterBannerProps) {
    if (activeTab === 'books') return null;

    const rawTitle = settings.footer_banner_title || 'MAN TANJUNGPINANG';
    const cleanTitle = rawTitle.replace(/TANJUNG\s+PINANG/gi, 'TANJUNGPINANG');

    const renderTitle = () => {
        if (cleanTitle.toUpperCase().startsWith('MAN ')) {
            const subTitle = cleanTitle.substring(4).trim();
            return (
                <h3 className="flex flex-col items-center gap-1 text-center text-4xl leading-none font-black tracking-wider text-white uppercase drop-shadow-lg sm:text-6xl lg:text-7xl">
                    <span>MAN</span>
                    <span>{subTitle}</span>
                </h3>
            );
        }
        if (cleanTitle.toUpperCase() === 'MAN TANJUNGPINANG') {
            return (
                <h3 className="flex flex-col items-center gap-1 text-center text-4xl leading-none font-black tracking-wider text-white uppercase drop-shadow-lg sm:text-6xl lg:text-7xl">
                    <span>MAN</span>
                    <span>TANJUNGPINANG</span>
                </h3>
            );
        }
        return (
            <h3 className="flex flex-col items-center text-center text-4xl leading-tight font-black tracking-wider text-white uppercase drop-shadow-lg sm:text-6xl lg:text-7xl">
                {cleanTitle.split('\n').map((line, idx) => (
                    <span key={idx}>{line}</span>
                ))}
            </h3>
        );
    };

    return (
        <div data-aos="zoom-in" className="relative z-30 mx-auto mt-16 -mb-20 w-full max-w-6xl px-4 sm:-mb-24">
            <div className="relative flex min-h-[280px] flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border border-emerald-900/40 bg-[#142921] p-10 text-center text-white shadow-2xl sm:min-h-[340px] sm:p-16">
                {/* Background Image */}
                {settings.footer_banner_bg_url ? (
                    <img
                        src={settings.footer_banner_bg_url}
                        alt="Footer Banner Background"
                        className="absolute inset-0 z-0 h-full w-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 z-0 bg-[#142921]" />
                )}

                {/* Dark Overlay */}
                <div className="absolute inset-0 z-10 bg-black/60" />

                {/* Centered Typography Content */}
                <div className="relative z-20 mx-auto flex max-w-3xl flex-col items-center space-y-4 text-center">
                    {renderTitle()}
                    <p className="max-w-2xl text-center font-sans text-xs leading-relaxed font-medium tracking-wide text-emerald-100/90 sm:text-base">
                        {settings.footer_banner_subtitle ||
                            'Mewujudkan Generasi Cerdas, Berkarakter, dan Berdaya Saing Global'}
                    </p>
                </div>
            </div>
        </div>
    );
}
