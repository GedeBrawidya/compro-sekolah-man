import { Head } from '@inertiajs/react';
import { useMemo } from 'react';

interface NewsItem {
    id: number;
    title: string;
    slug: string;
    content: string;
    thumbnail: string | null;
    published_at: string | null;
    author: string;
}

interface GalleryItem {
    id: number;
    title: string;
    type: 'photo' | 'youtube';
    display_image: string | null;
    youtube_url: string | null;
}

interface WelcomeSeoProps {
    settings: Record<string, string>;
    activeTab: string;
    selectedNews?: NewsItem | null;
    selectedGallery?: GalleryItem | null;
}

const getExcerpt = (html?: string, maxLength = 160) => {
    if (!html) return '';
    const text = html
        .replace(/<[^>]*>?/gm, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
};

export function WelcomeSeo({
    settings = {},
    activeTab = 'home',
    selectedNews = null,
    selectedGallery = null,
}: WelcomeSeoProps) {
    const rawSchoolName = settings.school_name || 'MAN TANJUNGPINANG';
    const schoolName =
        rawSchoolName.trim().toUpperCase() === 'MAN'
            ? 'MAN TANJUNGPINANG'
            : rawSchoolName;
    const schoolTagline =
        settings.school_tagline ||
        'Mewujudkan Generasi Cerdas, Berkarakter, dan Berdaya Saing Global';
    const schoolDesc =
        settings.school_description ||
        'MAN TANJUNGPINANG merupakan lembaga pendidikan unggulan di Kepulauan Riau yang berdedikasi tinggi dalam mencetak lulusan berprestasi akademik, berakhlak mulia, serta menguasai sains & teknologi.';
    const logoUrl =
        settings.school_logo_url || 'https://man-tanjungpinang.sch.id/logo.png';
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://man-tanjungpinang.sch.id';
    const currentUrl = typeof window !== 'undefined' ? window.location.href : siteUrl;

    const pageTitle = useMemo(() => {
        if (selectedNews) {
            return `${selectedNews.title} | ${schoolName}`;
        }
        switch (activeTab) {
            case 'profile':
            case 'vision':
                return `Profil & Visi Misi Sekolah | ${schoolName}`;
            case 'news':
                return `Berita & Pengumuman Terkini | ${schoolName}`;
            case 'gallery':
                return `Galeri Foto & Video Kegiatan | ${schoolName}`;
            case 'books':
                return `Perpustakaan Digital | ${schoolName}`;
            case 'dormitory':
                return `Informasi & Profil Asrama | ${schoolName}`;
            case 'legalization':
                return `Layanan Legalisasi Ijazah Online | ${schoolName}`;
            case 'complaints':
                return `Layanan Pengaduan & Layanan Publik | ${schoolName}`;
            default:
                return `${schoolName} - Portal Resmi Madrasah Aliyah Negeri`;
        }
    }, [activeTab, selectedNews, schoolName]);

    const pageDescription = useMemo(() => {
        if (selectedNews) {
            return getExcerpt(selectedNews.content) || schoolDesc;
        }
        if (selectedGallery?.title) {
            return `Galeri ${selectedGallery.title} - ${schoolName}`;
        }
        return schoolDesc;
    }, [selectedNews, selectedGallery, schoolDesc, schoolName]);

    const ogImage = useMemo(() => {
        if (selectedNews?.thumbnail) return selectedNews.thumbnail;
        if (selectedGallery?.display_image) return selectedGallery.display_image;
        return logoUrl;
    }, [selectedNews, selectedGallery, logoUrl]);

    // JSON-LD Schemas
    const schoolSchema = useMemo(() => {
        const socialLinks = [
            settings.facebook_url,
            settings.instagram_url,
            settings.youtube_url,
            settings.tiktok_url,
        ].filter(Boolean);

        return {
            '@context': 'https://schema.org',
            '@type': 'EducationalOrganization',
            '@id': `${siteUrl}/#organization`,
            name: schoolName,
            alternateName: ['MAN Tanjungpinang', 'Madrasah Aliyah Negeri Tanjungpinang'],
            url: siteUrl,
            logo: logoUrl,
            image: logoUrl,
            description: schoolDesc,
            slogan: schoolTagline,
            address: {
                '@type': 'PostalAddress',
                streetAddress: settings.school_address || 'Jl. Madong Lubis No.1, Tanjungpinang',
                addressLocality: 'Tanjungpinang',
                addressRegion: 'Kepulauan Riau',
                postalCode: '29115',
                addressCountry: 'ID',
            },
            telephone: settings.school_phone || '+62 771 123456',
            email: settings.school_email || 'info@man-tanjungpinang.sch.id',
            sameAs: socialLinks.length > 0 ? socialLinks : [
                'https://facebook.com/mantanjungpinang',
                'https://instagram.com/mantanjungpinang',
            ],
        };
    }, [schoolName, siteUrl, logoUrl, schoolDesc, schoolTagline, settings]);

    const websiteSchema = useMemo(() => {
        return {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            '@id': `${siteUrl}/#website`,
            name: schoolName,
            url: siteUrl,
            description: schoolDesc,
            publisher: {
                '@id': `${siteUrl}/#organization`,
            },
            potentialAction: {
                '@type': 'SearchAction',
                target: `${siteUrl}/?tab=books&q={search_term_string}`,
                'query-input': 'required name=search_term_string',
            },
        };
    }, [schoolName, siteUrl, schoolDesc]);

    const newsArticleSchema = useMemo(() => {
        if (!selectedNews) return null;
        return {
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: selectedNews.title,
            description: getExcerpt(selectedNews.content),
            image: selectedNews.thumbnail ? [selectedNews.thumbnail] : [logoUrl],
            datePublished: selectedNews.published_at || new Date().toISOString(),
            dateModified: selectedNews.published_at || new Date().toISOString(),
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `${siteUrl}/news/${selectedNews.slug || selectedNews.id}`,
            },
            author: {
                '@type': 'Person',
                name: selectedNews.author || schoolName,
            },
            publisher: {
                '@type': 'Organization',
                name: schoolName,
                logo: {
                    '@type': 'ImageObject',
                    url: logoUrl,
                },
            },
        };
    }, [selectedNews, siteUrl, schoolName, logoUrl]);

    const breadcrumbSchema = useMemo(() => {
        const items = [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Beranda',
                item: siteUrl,
            },
        ];

        if (activeTab !== 'home') {
            const tabNames: Record<string, string> = {
                profile: 'Profil Sekolah',
                vision: 'Visi & Misi',
                news: 'Berita',
                gallery: 'Galeri',
                books: 'Perpustakaan',
                dormitory: 'Asrama',
                legalization: 'Legalisasi',
                complaints: 'Pengaduan',
            };
            items.push({
                '@type': 'ListItem',
                position: 2,
                name: tabNames[activeTab] || activeTab,
                item: `${siteUrl}?tab=${activeTab}`,
            });
        }

        if (selectedNews) {
            items.push({
                '@type': 'ListItem',
                position: 3,
                name: selectedNews.title,
                item: currentUrl,
            });
        }

        return {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: items,
        };
    }, [activeTab, selectedNews, siteUrl, currentUrl]);

    const keywords = [
        schoolName,
        'MAN Tanjungpinang',
        'Madrasah Aliyah Negeri Tanjungpinang',
        'Sekolah Menengah Tanjungpinang',
        'Pendidikan Islam Kepulauan Riau',
        'PPDB MAN Tanjungpinang',
        'Perpustakaan Digital MAN Tanjungpinang',
        'Asrama MAN Tanjungpinang',
        'Berita Sekolah Tanjungpinang',
    ].join(', ');

    return (
        <Head title={pageTitle}>
            <meta name="description" content={pageDescription} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content={schoolName} />
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            <meta name="googlebot" content="index, follow" />
            <meta name="theme-color" content="#265243" />
            <link rel="canonical" href={currentUrl} />

            {/* Favicons & App Icons */}
            {logoUrl && <link rel="icon" href={logoUrl} />}
            {logoUrl && <link rel="shortcut icon" href={logoUrl} />}
            {logoUrl && <link rel="apple-touch-icon" href={logoUrl} />}

            {/* Open Graph / Facebook / WhatsApp */}
            <meta property="og:type" content={selectedNews ? 'article' : 'website'} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={pageDescription} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content={schoolName} />
            <meta property="og:locale" content="id_ID" />

            {/* Twitter Cards */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={currentUrl} />
            <meta name="twitter:title" content={pageTitle} />
            <meta name="twitter:description" content={pageDescription} />
            <meta name="twitter:image" content={ogImage} />

            {/* Structured Data (JSON-LD) */}
            <script type="application/ld+json">
                {JSON.stringify(schoolSchema)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(websiteSchema)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(breadcrumbSchema)}
            </script>
            {newsArticleSchema && (
                <script type="application/ld+json">
                    {JSON.stringify(newsArticleSchema)}
                </script>
            )}
        </Head>
    );
}
