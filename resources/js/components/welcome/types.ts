export interface BannerItem {
    id: number;
    title: string;
    subtitle: string | null;
    image: string | null;
    button_text: string | null;
    button_link: string | null;
}

export interface NewsItem {
    id: number;
    title: string;
    slug: string;
    content: string;
    thumbnail: string | null;
    published_at: string | null;
    author: string;
    views_count?: number;
}

export interface GalleryItem {
    id: number;
    title: string;
    type: 'photo' | 'youtube';
    display_image: string | null;
    youtube_url: string | null;
    youtube_id: string | null;
    category: string | null;
    description: string | null;
}

export interface BookItem {
    id: number;
    title: string;
    author: string;
    category: string;
    isbn: string | null;
    cover_image: string | null;
    description: string | null;
    status: string;
    available_copies: number;
    total_copies: number;
}

export interface DormitoryItem {
    id: number;
    title: string;
    content: string;
    media: string | null;
    author: string;
    created_at: string;
}

export interface MilestoneItem {
    id: number;
    year: number;
    title: string;
    description: string | null;
    order: number;
}

export interface FacilityItem {
    id: number;
    title: string;
    description: string | null;
    image: string | null;
    order: number;
    is_active: boolean;
}

export interface WelcomeStats {
    total_news: number;
    total_books: number;
    total_galleries: number;
    total_dormitory: number;
}

export type TabType =
    | 'home'
    | 'profile'
    | 'vision'
    | 'news'
    | 'gallery'
    | 'books'
    | 'dormitory'
    | 'legalization'
    | 'complaints';

export type ProfileSubTabType =
    | 'vision'
    | 'profile'
    | 'history'
    | 'target'
    | 'facilities'
    | 'motto';
