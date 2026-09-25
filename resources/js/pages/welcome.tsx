import { useForm, usePage } from '@inertiajs/react';
import AOS from 'aos';
import { CheckCircle2 } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';

import { BooksTab } from '@/components/welcome/BooksTab';
import { ComplaintsTab } from '@/components/welcome/ComplaintsTab';
import { DormitoryTab } from '@/components/welcome/DormitoryTab';
import { FooterBanner } from '@/components/welcome/FooterBanner';
import { GalleryTab } from '@/components/welcome/GalleryTab';
import { HomeTab } from '@/components/welcome/HomeTab';
import { NewsTab } from '@/components/welcome/NewsTab';
import { ProfileTab } from '@/components/welcome/ProfileTab';
import {
    BannerItem,
    BookItem,
    DormitoryItem,
    FacilityItem,
    GalleryItem,
    MilestoneItem,
    NewsItem,
    ProfileSubTabType,
    TabType,
    WelcomeStats,
} from '@/components/welcome/types';
import { WelcomeFooter } from '@/components/welcome/WelcomeFooter';
import { WelcomeModals } from '@/components/welcome/WelcomeModals';
import { WelcomeNavbar } from '@/components/welcome/WelcomeNavbar';
import { WelcomeSeo } from '@/components/welcome/WelcomeSeo';

interface Props {
    banners: BannerItem[];
    settings: Record<string, string>;
    news: NewsItem[];
    galleries: GalleryItem[];
    books: BookItem[];
    bookCategories: string[];
    dormitory: DormitoryItem[];
    milestones: MilestoneItem[];
    facilities?: FacilityItem[];
    stats: WelcomeStats;
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Welcome({
    banners = [],
    settings = {},
    news = [],
    galleries = [],
    books = [],
    bookCategories = [],
    dormitory = [],
    milestones = [],
    facilities = [],
    stats = {
        total_news: 0,
        total_books: 0,
        total_galleries: 0,
        total_dormitory: 0,
    },
}: Props) {
    const { auth, flash } = usePage<{
        auth: { user: any };
        flash: { success?: string; error?: string };
    }>().props;

    const [activeTab, setActiveTab] = useState<TabType>('home');
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
    const [selectedGallery, setSelectedGallery] = useState<GalleryItem | null>(null);
    const [selectedFacility, setSelectedFacility] = useState<FacilityItem | null>(null);

    const [bookSearch, setBookSearch] = useState('');
    const [bookCategory, setBookCategory] = useState<string>('all');
    const [bookAvailability, setBookAvailability] = useState<string>('all');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const [isPlayingInlineVideo, setIsPlayingInlineVideo] = useState(false);
    const [profileSubTab, setProfileSubTab] = useState<ProfileSubTabType>('vision');
    const [galleryCategory, setGalleryCategory] = useState<string>('all');

    const [newsPage, setNewsPage] = useState(1);
    const [galleryPage, setGalleryPage] = useState(1);
    const [bookPage, setBookPage] = useState(1);
    const [dormPage, setDormPage] = useState(1);

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    const [bannerTouchStart, setBannerTouchStart] = useState<number | null>(null);
    const [galleryTouchStart, setGalleryTouchStart] = useState<number | null>(null);
    const [showWatermark, setShowWatermark] = useState(true);

    const NEWS_PER_PAGE = 6;
    const GALLERY_PER_PAGE = 12;
    const BOOK_PER_PAGE = 8;
    const DORM_PER_PAGE = 6;

    const complaintForm = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-out-cubic',
            offset: 50,
        });
    }, []);

    useEffect(() => {
        AOS.refresh();
    }, [activeTab]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowWatermark(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        setBookPage(1);
    }, [bookSearch, bookCategory, bookAvailability]);

    const handleTabClick = (tabId: TabType) => {
        if (tabId === 'books') {
            window.open('/?tab=books', '_blank');
            return;
        }
        if (tabId === 'legalization') {
            const defaultLink =
                'https://docs.google.com/forms/d/e/1FAIpQLSeQFirrXnNpCuZEPGK4SOIWuBrs4c3sEPJLEoZB9l0LRWbTqw/formResponse';
            window.open(settings.legalization_link || defaultLink, '_blank');
            return;
        }
        if (tabId === 'complaints') {
            const defaultLink =
                'https://docs.google.com/forms/d/e/1FAIpQLSeQFirrXnNpCuZEPGK4SOIWuBrs4c3sEPJLEoZB9l0LRWbTqw/formResponse';
            window.open(
                settings.complaint_link ||
                    settings.legalization_link ||
                    defaultLink,
                '_blank',
            );
            return;
        }
        setActiveTab(tabId);
        setIsMobileMenuOpen(false);

        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        if (document.documentElement)
            document.documentElement.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth',
            });
        if (document.body)
            document.body.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

        requestAnimationFrame(() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        });
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');
        if (
            tabParam &&
            [
                'home',
                'profile',
                'vision',
                'news',
                'gallery',
                'books',
                'dormitory',
                'legalization',
                'complaints',
            ].includes(tabParam)
        ) {
            setActiveTab(tabParam as TabType);
        }
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, [activeTab]);

    const handleBannerTouchStart = (e: React.TouchEvent) => {
        setBannerTouchStart(e.touches[0].clientX);
    };

    const handleBannerTouchEnd = (e: React.TouchEvent) => {
        if (bannerTouchStart === null) return;
        const touchEnd = e.changedTouches[0].clientX;
        const diff = bannerTouchStart - touchEnd;
        if (diff > 40) {
            setCurrentBannerIndex((prev) => (prev + 1) % (banners.length || 1));
        } else if (diff < -40) {
            setCurrentBannerIndex(
                (prev) =>
                    (prev - 1 + (banners.length || 1)) % (banners.length || 1),
            );
        }
        setBannerTouchStart(null);
    };

    const handleGalleryTouchStart = (e: React.TouchEvent) => {
        setGalleryTouchStart(e.touches[0].clientX);
    };

    const handleGalleryTouchEnd = (e: React.TouchEvent) => {
        if (galleryTouchStart === null) return;
        const touchEnd = e.changedTouches[0].clientX;
        const diff = galleryTouchStart - touchEnd;
        if (diff > 40) {
            setActiveGalleryIndex(
                (prev) => (prev + 1) % (galleries.length || 1),
            );
        } else if (diff < -40) {
            setActiveGalleryIndex(
                (prev) =>
                    (prev - 1 + (galleries.length || 1)) %
                    (galleries.length || 1),
            );
        }
        setGalleryTouchStart(null);
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > 100) {
                setIsScrolled(true);
            } else if (currentScrollY < 40) {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [banners.length]);

    useEffect(() => {
        if (galleries.length <= 1) return;
        const timer = setInterval(() => {
            setActiveGalleryIndex((prev) => (prev + 1) % galleries.length);
        }, 7000);
        return () => clearInterval(timer);
    }, [galleries.length]);

    const handleComplaintSubmit = (e: FormEvent) => {
        e.preventDefault();
        complaintForm.post('/complaints', {
            onSuccess: () => complaintForm.reset(),
        });
    };

    const featuredGalleries = galleries.slice(0, 5);

    return (
        <>
            <WelcomeSeo
                settings={settings}
                activeTab={activeTab}
                selectedNews={selectedNews}
                selectedGallery={selectedGallery}
            />

            <div className="flex min-h-screen flex-col justify-between bg-[#f8faf7] font-sans text-[#142921] antialiased selection:bg-[#265243] selection:text-white">
                <WelcomeNavbar
                    settings={settings}
                    auth={auth}
                    activeTab={activeTab}
                    profileSubTab={profileSubTab}
                    isScrolled={isScrolled}
                    isMobileMenuOpen={isMobileMenuOpen}
                    isMobileProfileOpen={isMobileProfileOpen}
                    isProfileDropdownOpen={isProfileDropdownOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                    setIsMobileProfileOpen={setIsMobileProfileOpen}
                    setIsProfileDropdownOpen={setIsProfileDropdownOpen}
                    handleTabClick={handleTabClick}
                    setProfileSubTab={setProfileSubTab}
                />

                {flash?.success && (
                    <div className="mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between rounded-2xl bg-[#265243] p-4 text-xs font-bold text-white shadow-lg">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                                <span>{flash.success}</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'home' ? (
                    <HomeTab
                        banners={banners}
                        settings={settings}
                        news={news}
                        galleries={galleries}
                        featuredGalleries={featuredGalleries}
                        stats={stats}
                        currentBannerIndex={currentBannerIndex}
                        activeGalleryIndex={activeGalleryIndex}
                        showWatermark={showWatermark}
                        setCurrentBannerIndex={setCurrentBannerIndex}
                        setActiveGalleryIndex={setActiveGalleryIndex}
                        setSelectedGallery={setSelectedGallery}
                        handleBannerTouchStart={handleBannerTouchStart}
                        handleBannerTouchEnd={handleBannerTouchEnd}
                        handleGalleryTouchStart={handleGalleryTouchStart}
                        handleGalleryTouchEnd={handleGalleryTouchEnd}
                        handleTabClick={handleTabClick}
                    />
                ) : (
                    <main className="mx-auto w-full max-w-7xl flex-1 space-y-12 px-4 pt-6 pb-16 sm:space-y-18 sm:px-6 sm:pt-8 lg:px-8">
                        {(activeTab === 'profile' || activeTab === 'vision') && (
                            <ProfileTab
                                settings={settings}
                                milestones={milestones}
                                facilities={facilities}
                                profileSubTab={profileSubTab}
                                isPlayingInlineVideo={isPlayingInlineVideo}
                                selectedFacility={selectedFacility}
                                setIsPlayingInlineVideo={setIsPlayingInlineVideo}
                                setProfileSubTab={setProfileSubTab}
                                setSelectedFacility={setSelectedFacility}
                                setActiveTab={setActiveTab}
                            />
                        )}

                        {activeTab === 'news' && (
                            <NewsTab
                                news={news}
                                newsPage={newsPage}
                                NEWS_PER_PAGE={NEWS_PER_PAGE}
                                setNewsPage={setNewsPage}
                            />
                        )}

                        {activeTab === 'gallery' && (
                            <GalleryTab
                                galleries={galleries}
                                galleryCategory={galleryCategory}
                                galleryPage={galleryPage}
                                GALLERY_PER_PAGE={GALLERY_PER_PAGE}
                                setGalleryCategory={setGalleryCategory}
                                setGalleryPage={setGalleryPage}
                                setSelectedGallery={setSelectedGallery}
                            />
                        )}

                        {activeTab === 'books' && (
                            <BooksTab
                                books={books}
                                bookCategories={bookCategories}
                                bookSearch={bookSearch}
                                bookCategory={bookCategory}
                                bookAvailability={bookAvailability}
                                bookPage={bookPage}
                                BOOK_PER_PAGE={BOOK_PER_PAGE}
                                isFilterModalOpen={isFilterModalOpen}
                                setBookSearch={setBookSearch}
                                setBookCategory={setBookCategory}
                                setBookAvailability={setBookAvailability}
                                setBookPage={setBookPage}
                                setIsFilterModalOpen={setIsFilterModalOpen}
                            />
                        )}

                        {activeTab === 'dormitory' && (
                            <DormitoryTab
                                settings={settings}
                                dormitory={dormitory}
                                dormPage={dormPage}
                                DORM_PER_PAGE={DORM_PER_PAGE}
                                setDormPage={setDormPage}
                            />
                        )}

                        {activeTab === 'complaints' && (
                            <ComplaintsTab
                                complaintForm={complaintForm}
                                handleComplaintSubmit={handleComplaintSubmit}
                            />
                        )}
                    </main>
                )}

                <WelcomeModals
                    selectedNews={selectedNews}
                    selectedGallery={selectedGallery}
                    setSelectedNews={setSelectedNews}
                    setSelectedGallery={setSelectedGallery}
                />

                <FooterBanner settings={settings} activeTab={activeTab} />

                <WelcomeFooter
                    settings={settings}
                    activeTab={activeTab}
                    handleTabClick={handleTabClick}
                />
            </div>
        </>
    );
}
