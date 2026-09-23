import { Link } from '@inertiajs/react';
import { Building2, ChevronDown, LogIn, Menu, X } from 'lucide-react';
import { ProfileSubTabType, TabType } from './types';

interface WelcomeNavbarProps {
    settings: Record<string, string>;
    auth?: { user: any };
    activeTab: TabType;
    profileSubTab: ProfileSubTabType;
    isScrolled: boolean;
    isMobileMenuOpen: boolean;
    isMobileProfileOpen: boolean;
    isProfileDropdownOpen: boolean;
    setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsMobileProfileOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsProfileDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleTabClick: (tabId: TabType) => void;
    setProfileSubTab: (tab: ProfileSubTabType) => void;
}

export function WelcomeNavbar({
    settings,
    auth,
    activeTab,
    profileSubTab,
    isScrolled,
    isMobileMenuOpen,
    isMobileProfileOpen,
    isProfileDropdownOpen,
    setIsMobileMenuOpen,
    setIsMobileProfileOpen,
    setIsProfileDropdownOpen,
    handleTabClick,
    setProfileSubTab,
}: WelcomeNavbarProps) {
    const rawSchoolName = settings.school_name || 'MAN TANJUNGPINANG';
    const schoolName =
        rawSchoolName.trim().toUpperCase() === 'MAN'
            ? 'MAN TANJUNGPINANG'
            : rawSchoolName;

    return (
        <div
            style={{
                transition: 'padding 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                willChange: 'padding',
            }}
            className={`pointer-events-none sticky top-0 z-50 flex w-full justify-center ${
                isScrolled ? 'px-3 pt-2 sm:px-6 sm:pt-3' : 'px-0 pt-0'
            }`}
        >
            <header
                style={{
                    transition:
                        'max-width 0.6s cubic-bezier(0.22, 1, 0.36, 1), ' +
                        'border-radius 0.6s cubic-bezier(0.22, 1, 0.36, 1), ' +
                        'padding 0.6s cubic-bezier(0.22, 1, 0.36, 1), ' +
                        'background-color 0.6s cubic-bezier(0.22, 1, 0.36, 1), ' +
                        'border-color 0.6s cubic-bezier(0.22, 1, 0.36, 1), ' +
                        'box-shadow 0.6s cubic-bezier(0.22, 1, 0.36, 1), ' +
                        'backdrop-filter 0.6s cubic-bezier(0.22, 1, 0.36, 1), ' +
                        'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                    willChange:
                        'max-width, border-radius, padding, box-shadow, background-color, transform',
                }}
                className={`pointer-events-auto flex w-full items-center justify-between border backdrop-blur-xl ${
                    isMobileMenuOpen
                        ? 'max-w-7xl rounded-2xl border-[#c8dac5] bg-white/98 px-4 py-3 shadow-xl sm:px-8'
                        : isScrolled
                          ? 'max-w-7xl rounded-2xl border-[#c8dac5] bg-white/90 px-4 py-2.5 shadow-lg shadow-[#142921]/5 sm:rounded-full sm:px-6 sm:py-3'
                          : 'max-w-full rounded-none border-b border-[#e2ebd9] bg-white px-4 py-3.5 shadow-none sm:px-8 sm:py-4'
                }`}
            >
                <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between">
                    {/* Brand Logo & Name */}
                    <div
                        className={`mr-4 flex shrink-0 origin-left cursor-pointer items-center gap-3 lg:mr-8 ${
                            isScrolled ? 'scale-[0.97]' : 'scale-100'
                        }`}
                        style={{
                            transition:
                                'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                        }}
                        onClick={() => handleTabClick('home')}
                    >
                        {settings.school_logo_url ? (
                            <img
                                src={settings.school_logo_url}
                                alt="Logo Sekolah"
                                className="h-10 w-10 object-contain"
                            />
                        ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#265243] text-lg font-black text-white shadow-sm">
                                S
                            </div>
                        )}
                        <div>
                            <h1 className="text-xs leading-tight font-extrabold tracking-tight text-[#142921] sm:text-sm">
                                {schoolName}
                            </h1>
                            <p className="text-[9px] font-bold text-[#527365] sm:text-[10px]">
                                Portal Resmi Sekolah
                            </p>
                        </div>
                    </div>

                    {/* Nav Links (Desktop) */}
                    <nav className="hidden items-center gap-1 lg:flex xl:gap-2">
                        <button
                            onClick={() => handleTabClick('home')}
                            style={
                                activeTab === 'home'
                                    ? {
                                          backgroundColor: '#265243',
                                          color: '#ffffff',
                                      }
                                    : { color: '#142921' }
                            }
                            className={`rounded-full px-3.5 py-2 text-xs font-extrabold whitespace-nowrap transition-all duration-300 ${
                                activeTab === 'home'
                                    ? 'scale-[1.02] shadow-xs'
                                    : 'hover:bg-[#e2ebd9]'
                            }`}
                        >
                            Beranda
                        </button>

                        {/* Profil Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setIsProfileDropdownOpen(true)}
                            onMouseLeave={() => setIsProfileDropdownOpen(false)}
                        >
                            <button
                                onClick={() =>
                                    setIsProfileDropdownOpen((prev) => !prev)
                                }
                                style={
                                    activeTab === 'profile' ||
                                    activeTab === 'vision'
                                        ? {
                                              backgroundColor: '#265243',
                                              color: '#ffffff',
                                          }
                                        : { color: '#142921' }
                                }
                                className={`flex cursor-pointer items-center gap-1 rounded-full px-3.5 py-2 text-xs font-extrabold whitespace-nowrap transition-all duration-300 ${
                                    activeTab === 'profile' ||
                                    activeTab === 'vision'
                                        ? 'scale-[1.02] shadow-xs'
                                        : 'hover:bg-[#e2ebd9]'
                                }`}
                            >
                                <span>Profil</span>
                                <ChevronDown
                                    className={`h-3.5 w-3.5 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {isProfileDropdownOpen && (
                                <div className="animate-in fade-in slide-in-from-top-2 absolute top-full left-0 z-50 w-52 pt-2 duration-200">
                                    <div className="space-y-1 rounded-2xl border border-[#c8dac5] bg-white p-2 shadow-xl">
                                        <button
                                            onClick={() => {
                                                handleTabClick('profile');
                                                setProfileSubTab('profile');
                                                setIsProfileDropdownOpen(false);
                                            }}
                                            className={`flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-xs font-extrabold transition-all ${
                                                activeTab === 'profile' &&
                                                profileSubTab === 'profile'
                                                    ? 'bg-[#265243] text-white shadow-xs'
                                                    : 'text-[#142921] hover:bg-[#f4f8f3]'
                                            }`}
                                        >
                                            <span
                                                className={`h-1.5 w-1.5 shrink-0 rounded-full ${activeTab === 'profile' && profileSubTab === 'profile' ? 'bg-white' : 'bg-[#265243]'}`}
                                            ></span>
                                            <span>Profil Sekolah</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleTabClick('profile');
                                                setProfileSubTab('vision');
                                                setIsProfileDropdownOpen(false);
                                            }}
                                            className={`flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-xs font-extrabold transition-all ${
                                                activeTab === 'profile' &&
                                                profileSubTab === 'vision'
                                                    ? 'bg-[#265243] text-white shadow-xs'
                                                    : 'text-[#142921] hover:bg-[#f4f8f3]'
                                            }`}
                                        >
                                            <span
                                                className={`h-1.5 w-1.5 shrink-0 rounded-full ${activeTab === 'profile' && profileSubTab === 'vision' ? 'bg-white' : 'bg-[#265243]'}`}
                                            ></span>
                                            <span>Visi &amp; Misi</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleTabClick('profile');
                                                setProfileSubTab('history');
                                                setIsProfileDropdownOpen(false);
                                            }}
                                            className={`flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-xs font-extrabold transition-all ${
                                                activeTab === 'profile' &&
                                                profileSubTab === 'history'
                                                    ? 'bg-[#265243] text-white shadow-xs'
                                                    : 'text-[#142921] hover:bg-[#f4f8f3]'
                                            }`}
                                        >
                                            <span
                                                className={`h-1.5 w-1.5 shrink-0 rounded-full ${activeTab === 'profile' && profileSubTab === 'history' ? 'bg-white' : 'bg-[#265243]'}`}
                                            ></span>
                                            <span>Sejarah Singkat</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleTabClick('profile');
                                                setProfileSubTab('facilities');
                                                setIsProfileDropdownOpen(false);
                                            }}
                                            className={`flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-xs font-extrabold transition-all ${
                                                activeTab === 'profile' &&
                                                profileSubTab === 'facilities'
                                                    ? 'bg-[#265243] text-white shadow-xs'
                                                    : 'text-[#142921] hover:bg-[#f4f8f3]'
                                            }`}
                                        >
                                            <span
                                                className={`h-1.5 w-1.5 shrink-0 rounded-full ${activeTab === 'profile' && profileSubTab === 'facilities' ? 'bg-white' : 'bg-[#265243]'}`}
                                            ></span>
                                            <span>Sarana & Prasarana</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {[
                            { id: 'news', label: 'Berita Terbaru' },
                            { id: 'gallery', label: 'Galeri' },
                            { id: 'books', label: 'Perpustakaan' },
                            { id: 'dormitory', label: 'Asrama' },
                            { id: 'legalization', label: 'E-Legalisir' },
                            { id: 'complaints', label: 'Pengaduan' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabClick(tab.id as any)}
                                style={
                                    activeTab === tab.id
                                        ? {
                                              backgroundColor: '#265243',
                                              color: '#ffffff',
                                          }
                                        : { color: '#142921' }
                                }
                                className={`rounded-full px-3.5 py-2 text-xs font-extrabold whitespace-nowrap transition-all duration-300 ${
                                    activeTab === tab.id
                                        ? 'scale-[1.02] shadow-xs'
                                        : 'hover:bg-[#e2ebd9]'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>

                    {/* Admin Login Button (Desktop) */}
                    <div className="hidden shrink-0 items-center gap-2 lg:flex">
                        {auth?.user ? (
                            <Link
                                href="/admin/dashboard"
                                style={{
                                    backgroundColor: '#265243',
                                    color: '#ffffff',
                                }}
                                className="inline-flex items-center gap-2 rounded-full px-4.5 py-2 text-xs font-extrabold shadow-sm transition-all hover:scale-105 hover:bg-[#1a3d31]"
                            >
                                <Building2 className="h-3.5 w-3.5 text-white" />{' '}
                                Admin
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                style={{
                                    backgroundColor: '#265243',
                                    color: '#ffffff',
                                }}
                                className="inline-flex items-center gap-2 rounded-full px-4.5 py-2 text-xs font-extrabold shadow-sm transition-all hover:scale-105 hover:bg-[#1a3d31]"
                            >
                                <LogIn className="h-3.5 w-3.5 text-white" />{' '}
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Hamburger Garis 3 Button (Pojok Kanan Header) */}
                    <button
                        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                        aria-label="Toggle Navigation Menu"
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c8dac5] text-[#142921] shadow-md transition-all lg:hidden ${
                            isMobileMenuOpen
                                ? 'bg-white text-[#265243] ring-2 ring-[#265243]/20 hover:bg-[#265243] hover:text-white'
                                : 'bg-[#f4f8f3] hover:bg-[#265243] hover:text-white'
                        }`}
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>

                    {/* Mobile Listdown Dropdown Menu Panel */}
                    {isMobileMenuOpen && (
                        <div className="animate-in fade-in slide-in-from-top-3 absolute top-full right-0 left-0 z-50 mt-2 space-y-2 rounded-3xl border border-[#c8dac5] bg-white/98 p-4 shadow-2xl backdrop-blur-xl duration-300 lg:hidden">
                            <div className="space-y-1">
                                {/* Beranda */}
                                <button
                                    onClick={() => handleTabClick('home')}
                                    className={`w-full rounded-2xl px-4 py-2.5 text-left text-xs font-black transition-all ${
                                        activeTab === 'home'
                                            ? 'bg-[#265243] text-white shadow-xs'
                                            : 'text-[#142921] hover:bg-[#f4f8f3]'
                                    }`}
                                >
                                    Beranda
                                </button>

                                {/* Profil Accordion Dropdown */}
                                <div className="space-y-1">
                                    <button
                                        onClick={() =>
                                            setIsMobileProfileOpen(
                                                (prev) => !prev,
                                            )
                                        }
                                        className={`flex w-full cursor-pointer items-center justify-between rounded-2xl px-4 py-2.5 text-left text-xs font-black transition-all ${
                                            activeTab === 'profile' ||
                                            activeTab === 'vision'
                                                ? 'bg-[#265243] text-white shadow-xs'
                                                : 'text-[#142921] hover:bg-[#f4f8f3]'
                                        }`}
                                    >
                                        <span>Profil Sekolah</span>
                                        <ChevronDown
                                            className={`h-4 w-4 transition-transform duration-200 ${isMobileProfileOpen ? 'rotate-180 text-[#265243]' : activeTab === 'profile' || activeTab === 'vision' ? 'text-white' : 'text-[#265243]'}`}
                                        />
                                    </button>

                                    {isMobileProfileOpen && (
                                        <div className="animate-in fade-in space-y-1.5 py-1 pl-4 duration-200">
                                            <button
                                                onClick={() => {
                                                    handleTabClick('profile');
                                                    setProfileSubTab('profile');
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className={`flex w-full items-center gap-2.5 rounded-xl px-4 py-2 text-left text-xs font-extrabold transition-all ${
                                                    activeTab === 'profile' &&
                                                    profileSubTab === 'profile'
                                                        ? 'bg-[#265243] text-white shadow-2xs'
                                                        : 'border border-[#c8dac5]/50 bg-[#f4f8f3] text-[#142921] hover:bg-[#e2ebd9]'
                                                }`}
                                            >
                                                <span
                                                    className={`h-2 w-2 shrink-0 rounded-full ${activeTab === 'profile' && profileSubTab === 'profile' ? 'bg-white' : 'bg-[#265243]'}`}
                                                ></span>
                                                <span>Profil Sekolah</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleTabClick('profile');
                                                    setProfileSubTab('vision');
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className={`flex w-full items-center gap-2.5 rounded-xl px-4 py-2 text-left text-xs font-extrabold transition-all ${
                                                    activeTab === 'profile' &&
                                                    profileSubTab === 'vision'
                                                        ? 'bg-[#265243] text-white shadow-2xs'
                                                        : 'border border-[#c8dac5]/50 bg-[#f4f8f3] text-[#142921] hover:bg-[#e2ebd9]'
                                                }`}
                                            >
                                                <span
                                                    className={`h-2 w-2 shrink-0 rounded-full ${activeTab === 'profile' && profileSubTab === 'vision' ? 'bg-white' : 'bg-[#265243]'}`}
                                                ></span>
                                                <span>Visi &amp; Misi</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleTabClick('profile');
                                                    setProfileSubTab('history');
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className={`flex w-full items-center gap-2.5 rounded-xl px-4 py-2 text-left text-xs font-extrabold transition-all ${
                                                    activeTab === 'profile' &&
                                                    profileSubTab === 'history'
                                                        ? 'bg-[#265243] text-white shadow-2xs'
                                                        : 'border border-[#c8dac5]/50 bg-[#f4f8f3] text-[#142921] hover:bg-[#e2ebd9]'
                                                }`}
                                            >
                                                <span
                                                    className={`h-2 w-2 shrink-0 rounded-full ${activeTab === 'profile' && profileSubTab === 'history' ? 'bg-white' : 'bg-[#265243]'}`}
                                                ></span>
                                                <span>Sejarah Singkat</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleTabClick('profile');
                                                    setProfileSubTab(
                                                        'facilities',
                                                    );
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className={`flex w-full items-center gap-2.5 rounded-xl px-4 py-2 text-left text-xs font-extrabold transition-all ${
                                                    activeTab === 'profile' &&
                                                    profileSubTab ===
                                                        'facilities'
                                                        ? 'bg-[#265243] text-white shadow-2xs'
                                                        : 'border border-[#c8dac5]/50 bg-[#f4f8f3] text-[#142921] hover:bg-[#e2ebd9]'
                                                }`}
                                            >
                                                <span
                                                    className={`h-2 w-2 shrink-0 rounded-full ${activeTab === 'profile' && profileSubTab === 'facilities' ? 'bg-white' : 'bg-[#265243]'}`}
                                                ></span>
                                                <span>Sarana & Prasarana</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {[
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
                                    {
                                        id: 'legalization',
                                        label: 'Permohonan Legalisir',
                                    },
                                    {
                                        id: 'complaints',
                                        label: 'Kotak Pengaduan',
                                    },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() =>
                                            handleTabClick(tab.id as any)
                                        }
                                        className={`w-full rounded-2xl px-4 py-2.5 text-left text-xs font-black transition-all ${
                                            activeTab === tab.id
                                                ? 'bg-[#265243] text-white shadow-xs'
                                                : 'text-[#142921] hover:bg-[#f4f8f3]'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="border-t border-[#c8dac5] pt-2">
                                {auth?.user ? (
                                    <Link
                                        href="/admin/dashboard"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#265243] px-4 py-2.5 text-xs font-black text-white shadow-sm transition-all hover:bg-[#1a3d31]"
                                    >
                                        <Building2 className="h-4 w-4 text-white" />{' '}
                                        Dashboard Admin
                                    </Link>
                                ) : (
                                    <Link
                                        href="/login"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#265243] px-4 py-2.5 text-xs font-black text-white shadow-sm transition-all hover:bg-[#1a3d31]"
                                    >
                                        <LogIn className="h-4 w-4 text-white" />{' '}
                                        Login Admin
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </header>
        </div>
    );
}
