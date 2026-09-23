export const getExcerpt = (html?: string, maxLength = 130) => {
    if (!html) return '';
    const text = html
        .replace(/<[^>]*>?/gm, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
};

export const getYouTubeId = (url?: string) => {
    if (!url) return 'swh2GC1XqyE';
    let videoId = '';
    if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('youtube.com/watch')) {
        const parts = url.split('v=');
        if (parts[1]) {
            videoId = parts[1].split('&')[0];
        }
    } else if (url.includes('youtube.com/embed/')) {
        videoId = url.split('youtube.com/embed/')[1]?.split('?')[0] || '';
    }
    return videoId || 'swh2GC1XqyE';
};

export const getYouTubeThumbnail = (url?: string) => {
    const id = getYouTubeId(url);
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
};

export const getYouTubeEmbedUrl = (url?: string) => {
    const id = getYouTubeId(url);
    return `https://www.youtube.com/embed/${id}`;
};
