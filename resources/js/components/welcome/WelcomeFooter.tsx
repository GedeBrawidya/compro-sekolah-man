import { ChevronRight, Mail, MapPin, Phone } from 'lucide-react';
import { TabType } from './types';

interface WelcomeFooterProps {
    settings: Record<string, string>;
    activeTab: TabType;
    handleTabClick: (tabId: TabType) => void;
}

export function WelcomeFooter({
    settings,
    activeTab,
    handleTabClick,
}: WelcomeFooterProps) {
    const rawSchoolName = settings.school_name || 'MAN TANJUNGPINANG';
    const schoolName =
        rawSchoolName.trim().toUpperCase() === 'MAN'
            ? 'MAN TANJUNGPINANG'
            : rawSchoolName;
    const schoolTagline =
        settings.school_tagline ||
        'Mewujudkan Generasi Cerdas, Berkarakter, dan Berdaya Saing Global';

    return (
        <footer
            data-aos="fade-up"
            className={`mt-auto border-t border-[#265243] bg-[#142921] pb-8 text-white shadow-2xl ${activeTab === 'books' ? 'pt-12 sm:pt-16' : 'pt-32 sm:pt-36'}`}
        >
            <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
                    {/* Col 1 & 2: Brand Identity & Social Icons */}
                    <div className="space-y-4 lg:col-span-2">
                        <div
                            className="flex cursor-pointer items-center gap-3"
                            onClick={() => handleTabClick('home')}
                        >
                            {settings.school_logo_url ? (
                                <img
                                    src={settings.school_logo_url}
                                    alt="Logo Sekolah"
                                    className="h-11 w-11 object-contain"
                                />
                            ) : (
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl font-black text-[#142921] shadow-sm">
                                    S
                                </div>
                            )}
                            <div>
                                <h3 className="text-base font-black tracking-tight text-white">
                                    {schoolName}
                                </h3>
                                <p className="text-[11px] font-bold text-[#b5d6c6]">
                                    Portal Resmi Sekolah
                                </p>
                            </div>
                        </div>
                        <p className="max-w-sm text-xs leading-relaxed font-medium text-[#eaf2ee]">
                            {schoolTagline}
                        </p>

                        {/* Social Media Icons Row */}
                        <div className="flex items-center gap-2 pt-2">
                            <a
                                href={settings.footer_facebook || '#'}
                                target={
                                    settings.footer_facebook
                                        ? '_blank'
                                        : '_self'
                                }
                                rel="noopener noreferrer"
                                title="Facebook"
                                aria-label="Facebook Sekolah"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-xs transition-all duration-300 hover:scale-110 hover:bg-white hover:text-[#142921]"
                            >
                                <svg
                                    className="h-4 w-4 fill-current"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            <a
                                href={settings.footer_instagram || '#'}
                                target={
                                    settings.footer_instagram
                                        ? '_blank'
                                        : '_self'
                                }
                                rel="noopener noreferrer"
                                title="Instagram"
                                aria-label="Instagram Sekolah"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-xs transition-all duration-300 hover:scale-110 hover:bg-white hover:text-[#142921]"
                            >
                                <svg
                                    className="h-4 w-4 fill-current"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            <a
                                href={settings.footer_youtube || '#'}
                                target={
                                    settings.footer_youtube
                                        ? '_blank'
                                        : '_self'
                                }
                                rel="noopener noreferrer"
                                title="YouTube"
                                aria-label="YouTube Sekolah"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-xs transition-all duration-300 hover:scale-110 hover:bg-white hover:text-[#142921]"
                            >
                                <svg
                                    className="h-4 w-4 fill-current"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                            <a
                                href={`mailto:${settings.footer_email || settings.school_email || 'info@sekolah.sch.id'}`}
                                title="Email"
                                aria-label="Email Sekolah"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-xs transition-all duration-300 hover:scale-110 hover:bg-white hover:text-[#142921]"
                            >
                                <Mail className="h-4 w-4" />
                            </a>
                            <a
                                href={`tel:${settings.footer_phone || settings.school_phone || '(021) 12345678'}`}
                                title="Telepon"
                                aria-label="Telepon Sekolah"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-xs transition-all duration-300 hover:scale-110 hover:bg-white hover:text-[#142921]"
                            >
                                <Phone className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Col 3: Profil Sekolah */}
                    <div className="space-y-3">
                        <h4 className="border-b border-[#265243] pb-2 text-xs font-black tracking-wider text-[#b5d6c6] uppercase">
                            Profil Sekolah
                        </h4>
                        <ul className="space-y-2.5 text-xs font-medium">
                            {[
                                { id: 'home', label: 'Beranda Utama' },
                                {
                                    id: 'news',
                                    label: 'Berita & Pengumuman',
                                },
                                {
                                    id: 'gallery',
                                    label: 'Galeri Dokumentasi',
                                },
                                {
                                    id: 'books',
                                    label: 'Perpustakaan Digital',
                                },
                                {
                                    id: 'dormitory',
                                    label: 'Informasi Asrama',
                                },
                            ].map((item) => (
                                <li key={item.id}>
                                    <button
                                        onClick={() =>
                                            handleTabClick(item.id as any)
                                        }
                                        className="group flex items-center gap-1.5 text-left text-[#eaf2ee] transition-all hover:translate-x-1 hover:text-white"
                                    >
                                        <ChevronRight className="h-3.5 w-3.5 text-[#9dc3b2] transition-transform group-hover:translate-x-0.5" />
                                        <span>{item.label}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 4: Layanan Digital */}
                    <div className="space-y-3">
                        <h4 className="border-b border-[#265243] pb-2 text-xs font-black tracking-wider text-[#b5d6c6] uppercase">
                            Layanan Digital
                        </h4>
                        <ul className="space-y-2.5 text-xs font-medium">
                            {[
                                {
                                    id: 'legalization',
                                    label: 'Permohonan E-Legalisir',
                                },
                                {
                                    id: 'complaints',
                                    label: 'Kotak Pengaduan Digital',
                                },
                            ].map((item) => (
                                <li key={item.id}>
                                    <button
                                        onClick={() =>
                                            handleTabClick(item.id as any)
                                        }
                                        className="group flex items-center gap-1.5 text-left text-[#eaf2ee] transition-all hover:translate-x-1 hover:text-white"
                                    >
                                        <ChevronRight className="h-3.5 w-3.5 text-[#9dc3b2] transition-transform group-hover:translate-x-0.5" />
                                        <span>{item.label}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="pt-2">
                            <p className="text-[11px] font-extrabold text-[#b5d6c6]">
                                Jam Layanan:
                            </p>
                            <p className="mt-0.5 text-xs font-medium text-[#eaf2ee]">
                                Senin - Jumat: 07.30 - 16.00 WIB
                            </p>
                        </div>
                    </div>

                    {/* Col 5: Hubungi Kami */}
                    <div className="space-y-3">
                        <h4 className="border-b border-[#265243] pb-2 text-xs font-black tracking-wider text-[#b5d6c6] uppercase">
                            Hubungi Kami
                        </h4>
                        <div className="space-y-2.5 text-xs font-medium text-[#eaf2ee]">
                            <p className="flex items-start gap-2.5">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#9dc3b2]" />
                                <span>
                                    {settings.school_address ||
                                        'Jl. Pendidikan No. 1, Kota Sekolah'}
                                </span>
                            </p>
                            <p className="flex items-center gap-2.5">
                                <Phone className="h-4 w-4 shrink-0 text-[#9dc3b2]" />
                                <span>
                                    {settings.school_phone ||
                                        '(021) 12345678'}
                                </span>
                            </p>
                            <p className="flex items-center gap-2.5">
                                <Mail className="h-4 w-4 shrink-0 text-[#9dc3b2]" />
                                <span>
                                    {settings.school_email ||
                                        'info@sekolah.sch.id'}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Copyright Bar */}
                <div className="border-t border-[#265243] pt-6 text-center text-xs font-medium text-white/70 sm:text-left">
                    <p>
                        {settings.footer_copyright ||
                            `© Copyright ${new Date().getFullYear()} ${schoolName}. All rights reserved.`}
                    </p>
                </div>
            </div>
        </footer>
    );
}
