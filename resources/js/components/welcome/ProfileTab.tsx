import { Award, Building2, Play, User, X } from 'lucide-react';
import {
    FacilityItem,
    MilestoneItem,
    ProfileSubTabType,
    TabType,
} from './types';
import { getYouTubeEmbedUrl, getYouTubeId, getYouTubeThumbnail } from './utils';

interface ProfileTabProps {
    settings: Record<string, string>;
    milestones: MilestoneItem[];
    facilities?: FacilityItem[];
    profileSubTab: ProfileSubTabType;
    isPlayingInlineVideo: boolean;
    selectedFacility: FacilityItem | null;
    setIsPlayingInlineVideo: React.Dispatch<React.SetStateAction<boolean>>;
    setProfileSubTab: React.Dispatch<React.SetStateAction<ProfileSubTabType>>;
    setSelectedFacility: React.Dispatch<React.SetStateAction<FacilityItem | null>>;
    setActiveTab: (tabId: TabType) => void;
}

const DEFAULT_FACILITIES: FacilityItem[] = [
    {
        id: 1,
        title: 'Ruang Kelas Nyaman',
        description:
            'Dilengkapi dengan proyektor, AC/Kipas, dan sirkulasi udara yang baik untuk mendukung fokus belajar siswa dalam suasana kondusif dan berbasis digital.',
        image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1000&auto=format&fit=crop',
        order: 1,
        is_active: true,
    },
    {
        id: 2,
        title: 'Perpustakaan Digital',
        description:
            'Koleksi buku lengkap dengan akses e-library, komputer pencarian katalog, dan ruang baca ber-AC yang tenang dan representatif.',
        image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1000&auto=format&fit=crop',
        order: 2,
        is_active: true,
    },
    {
        id: 3,
        title: 'Laboratorium Sains',
        description:
            'Fasilitas praktikum Fisika, Kimia, dan Biologi berstandar nasional dengan alat peraga dan mikroskop modern untuk eksperimen ilmiah.',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop',
        order: 3,
        is_active: true,
    },
    {
        id: 4,
        title: 'Laboratorium Komputer',
        description:
            'Dilengkapi puluhan PC spesifikasi tinggi, jaringan LAN terintegrasi, dan akses internet fiber optic berkecepatan tinggi untuk CBT dan coding.',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop',
        order: 4,
        is_active: true,
    },
    {
        id: 5,
        title: 'Masjid Utama Sekolah',
        description:
            "Pusat kegiatan ibadah, salat berjamaah, tahfiz Al-Qur'an, dan pembinaan karakter keagamaan siswa dengan area yang luas dan bersih.",
        image: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?q=80&w=1000&auto=format&fit=crop',
        order: 5,
        is_active: true,
    },
    {
        id: 6,
        title: 'Lapangan Olahraga',
        description:
            'Area multi-fungsi yang luas untuk basket, futsal, bola voli, badminton, dan pelaksanaan upacara bendera serta kegiatan ekstrakurikuler.',
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop',
        order: 6,
        is_active: true,
    },
];

export function ProfileTab({
    settings,
    milestones,
    facilities,
    profileSubTab,
    isPlayingInlineVideo,
    selectedFacility,
    setIsPlayingInlineVideo,
    setProfileSubTab,
    setSelectedFacility,
    setActiveTab,
}: ProfileTabProps) {
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
        'MAN TANJUNGPINANG merupakan lembaga pendidikan unggulan yang berdedikasi tinggi dalam mencetak lulusan berprestasi akademik, berakhlak mulia, serta menguasai keterampilan sains dan teknologi.';
    const logoUrl = settings.school_logo_url || null;

    const missionItems = (() => {
        const rawMission = settings.mission || settings.misi;
        if (rawMission && rawMission.trim()) {
            const lines = rawMission
                .split('\n')
                .map((l) => l.trim())
                .filter((l) => l.length > 0);

            if (lines.length > 0) {
                return lines.map((line, idx) => {
                    const cleanDesc = line.replace(
                        /^(?:\d+[.\)]\s*|-\s*)/,
                        '',
                    );
                    return {
                        num: String(idx + 1).padStart(2, '0'),
                        desc: cleanDesc,
                    };
                });
            }
        }
        return [
            {
                num: '01',
                desc: 'Meningkatkan Keimanan dan Ketaqwaan terhadap Tuhan Yang Maha Esa.',
            },
            {
                num: '02',
                desc: 'Meningkatkan Wawasan kebangsaan dan cinta tanah air.',
            },
            {
                num: '03',
                desc: 'Meningkatkan karakter kemandirian, kerja keras, dan kepemimpinan.',
            },
            {
                num: '04',
                desc: 'Memperkaya Kurikulum Berwawasan Lingkungan dengan Budaya Karakter Bangsa berbasis Kearifan Lokal.',
            },
            {
                num: '05',
                desc: 'Mengembangkan kultur sekolah yang disiplin, agamis, dan menerapkan budaya 5S (Senyum, Sapa, Salam, Sopan, Santun).',
            },
        ];
    })();

    return (
        <div data-aos="fade-up" className="animate-in fade-in relative space-y-8 px-3 duration-300 sm:-mx-12 sm:px-0 lg:-mx-20">
            {/* VIDEO PROFIL HEADER */}
            {(settings.principal_media_type ?? 'video') === 'photo' ? (
                <div className="relative flex aspect-video max-h-[500px] w-full items-center justify-center overflow-hidden rounded-3xl bg-slate-900 shadow-xl sm:rounded-[2.5rem]">
                    <img
                        src={
                            settings.principal_media_photo_url ||
                            settings.principal_photo_url ||
                            '/images/school-banner.jpg'
                        }
                        alt="Foto Media Profil Sekolah"
                        className="absolute inset-0 h-full w-full object-cover opacity-85"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src =
                                '/images/school-banner.jpg';
                        }}
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center gap-3 p-6 text-center text-white sm:p-10">
                        <span className="rounded-full bg-[#265243] px-4 py-1.5 text-xs font-black tracking-wider text-white uppercase shadow-md">
                            PROFIL SEKOLAH
                        </span>
                        <h2 className="text-2xl font-black tracking-tight text-white drop-shadow-md sm:text-5xl lg:text-6xl">
                            {schoolName}
                        </h2>
                        <div className="mt-1 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-[#142921] px-4 py-1.5 text-xs font-bold text-emerald-300 shadow-sm">
                            <span>PROFIL SEKOLAH</span>
                            <span>•</span>
                            <span className="font-extrabold text-white">
                                {profileSubTab === 'vision'
                                    ? 'Visi & Misi'
                                    : profileSubTab === 'profile'
                                      ? 'Profil Sekolah'
                                      : profileSubTab === 'facilities'
                                        ? 'Sarana & Prasarana'
                                        : 'Sejarah Singkat'}
                            </span>
                        </div>
                    </div>
                </div>
            ) : isPlayingInlineVideo ? (
                <div className="relative flex aspect-video max-h-[500px] w-full items-center justify-center overflow-hidden rounded-3xl bg-slate-900 shadow-xl sm:rounded-[2.5rem]">
                    <iframe
                        src={`${getYouTubeEmbedUrl(settings.principal_video_url || 'https://youtu.be/swh2GC1XqyE?si=zDzgUxvpB2XObqte')}?autoplay=1&rel=0`}
                        title="Video Profil Sekolah"
                        className="h-full w-full rounded-3xl border-0 sm:rounded-[2.5rem]"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                    <button
                        onClick={() => setIsPlayingInlineVideo(false)}
                        className="absolute top-4 right-4 z-10 flex cursor-pointer items-center gap-1.5 rounded-full border border-white/20 bg-black/70 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md transition-all hover:bg-black"
                    >
                        <X className="h-4 w-4" />
                        <span>Tutup Video</span>
                    </button>
                </div>
            ) : (
                <div
                    onClick={() => setIsPlayingInlineVideo(true)}
                    className="group relative flex aspect-video max-h-[500px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-3xl bg-slate-900 shadow-xl sm:rounded-[2.5rem]"
                >
                    <img
                        src={getYouTubeThumbnail(
                            settings.principal_video_url,
                        )}
                        alt="Cover Video Profil Sekolah"
                        className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src =
                                `https://img.youtube.com/vi/${getYouTubeId(settings.principal_video_url)}/hqdefault.jpg`;
                        }}
                    />

                    <div className="absolute inset-0 bg-black/50 transition-colors group-hover:bg-black/40" />

                    <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center gap-3 p-6 text-center text-white sm:p-10">
                        <div className="my-1 flex h-16 w-16 items-center justify-center rounded-full bg-[#064e3b] text-white shadow-2xl transition-all group-hover:scale-110 group-hover:bg-[#047857] sm:h-20 sm:w-20">
                            <Play className="h-8 w-8 translate-x-0.5 fill-white text-white sm:h-10 sm:w-10" />
                        </div>

                        <span className="rounded-full bg-[#265243] px-4 py-1.5 text-xs font-black tracking-wider text-white uppercase shadow-md">
                            PUTAR VIDEO PROFIL SEKOLAH
                        </span>

                        <h2 className="text-2xl font-black tracking-tight text-white drop-shadow-md sm:text-5xl lg:text-6xl">
                            {schoolName.toUpperCase().includes('TANJUNG')
                                ? schoolName.replace(
                                      /TANJUNG\s+PINANG/gi,
                                      'TANJUNGPINANG',
                                  )
                                : `${schoolName} TANJUNGPINANG`}
                        </h2>
                    </div>
                </div>
            )}

            {/* PINTASAN NAVIGASI PROFIL */}
            <div data-aos="fade-up" data-aos-delay="100" className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-6">
                {[
                    { id: 'profile', label: 'Profil Sekolah' },
                    { id: 'vision', label: 'Visi & Misi' },
                    { id: 'history', label: 'Sejarah Singkat' },
                    { id: 'facilities', label: 'Sarana & Prasarana' },
                ].map((sub) => {
                    const isActive = profileSubTab === sub.id;
                    return (
                        <button
                            key={sub.id}
                            onClick={() => {
                                setProfileSubTab(sub.id as any);
                                if (sub.id === 'vision') setActiveTab('vision');
                                else setActiveTab('profile');
                            }}
                            className={`relative flex cursor-pointer items-center justify-center rounded-2xl border-0 border-none p-3 text-center text-xs font-extrabold shadow-md transition-all duration-300 outline-none sm:rounded-3xl sm:p-6 sm:text-base ${
                                isActive
                                    ? '-translate-y-1 scale-[1.02] bg-[#265243] text-white shadow-xl sm:-translate-y-2'
                                    : 'bg-white text-[#142921] hover:-translate-y-1 hover:bg-slate-50 hover:shadow-xl'
                            }`}
                        >
                            <span className="tracking-wide">{sub.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* SUBTAB CONTENT CONTAINER */}
            <div className="min-h-[350px] space-y-8 bg-transparent">
                {/* SUB-TAB 1: PROFIL SEKOLAH */}
                {profileSubTab === 'profile' && (
                    <div className="animate-in fade-in space-y-8 duration-300">
                        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
                            {/* LEFT COLUMN: SCHOOL LOGO */}
                            <div className="relative space-y-4 lg:col-span-5">
                                <div className="relative z-10 mx-auto max-w-md lg:max-w-none">
                                    <div className="group relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-3xl bg-[#142921] p-8 shadow-xl">
                                        {logoUrl ? (
                                            <img
                                                src={logoUrl}
                                                alt={`Logo ${schoolName}`}
                                                className="relative z-10 max-h-48 object-contain drop-shadow-2xl filter transition-transform duration-500 group-hover:scale-105 sm:max-h-56"
                                            />
                                        ) : (
                                            <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-xl">
                                                <Building2 className="h-14 w-14 text-emerald-300" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN: EDITORIAL PROFILE TEXT */}
                            <div className="space-y-6 lg:col-span-7">
                                <div className="space-y-2 border-b border-[#e2ebd9] pb-3">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <span className="rounded-full bg-[#f59e0b] px-3.5 py-1 text-[10px] font-black tracking-widest text-white uppercase shadow-xs sm:text-[11px]">
                                            PROFIL SEKOLAH
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">
                                            <Award className="h-4 w-4 text-emerald-700" />{' '}
                                            Akreditasi{' '}
                                            {settings.accreditation ||
                                                'A (Unggul)'}
                                        </span>
                                    </div>
                                    <h3 className="font-sans text-2xl leading-tight font-black tracking-tight text-[#142921] sm:text-4xl">
                                        Profil &amp; Identitas Sekolah
                                    </h3>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                    <span className="rounded-full bg-[#265243] px-3 py-1 text-xs font-extrabold text-white shadow-xs">
                                        Status:{' '}
                                        {settings.school_status || 'Negeri'}
                                    </span>
                                    <span className="rounded-full border border-[#b8ceb0] bg-[#f4f8f3] px-3 py-1 text-xs font-extrabold text-[#142921]">
                                        NPSN:{' '}
                                        {settings.school_npsn || '12345678'}
                                    </span>
                                </div>

                                <div className="space-y-4 text-xs leading-relaxed font-medium text-[#2e5445] sm:text-sm">
                                    <p className="text-sm leading-snug font-bold text-[#142921] sm:text-base">
                                        {schoolName} adalah institusi
                                        pendidikan menengah tingkat atas terkemuka
                                        yang berdedikasi tinggi dalam membentuk
                                        generasi unggul, berakhlak mulia, dan
                                        berdaya saing global.
                                    </p>
                                    <p>{schoolDesc}</p>
                                    <p>
                                        Melalui berbagai program unggulan
                                        akademik, ekstrakurikuler, pembinaan
                                        tahfidz, serta digitalisasi perpustakaan
                                        dan portal e-legalisir alumni, kami
                                        berkomitmen mencetak lulusan
                                        berkepribadian mandiri yang siap
                                        melanjutkan ke perguruan tinggi terbaik
                                        nasional maupun internasional.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* SUB-TAB 2: VISI & MISI */}
                {profileSubTab === 'vision' && (
                    <div className="animate-in fade-in space-y-8 duration-300">
                        <div className="space-y-2 border-b border-[#e2ebd9] pb-3">
                            <h3 className="text-2xl font-black tracking-tight text-[#142921] sm:text-3xl">
                                Visi &amp; Misi Sekolah
                            </h3>
                            <div className="h-1 w-16 rounded-full bg-[#f59e0b]" />
                        </div>

                        {/* VISI CARD */}
                        <div data-aos="zoom-in" className="group relative overflow-hidden rounded-3xl border border-emerald-900/50 bg-[#142921] p-6 text-white shadow-xl sm:p-8">
                            <div className="relative z-10 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div>
                                        <span className="rounded-md bg-white/10 px-2.5 py-0.5 text-[10px] font-black tracking-widest text-[#f59e0b] uppercase sm:text-xs">
                                            VISI SEKOLAH
                                        </span>
                                        <h4 className="mt-1 text-lg font-extrabold text-white sm:text-xl">
                                            {schoolName}
                                        </h4>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <p className="text-base leading-relaxed font-bold tracking-wide text-emerald-50 italic sm:text-xl">
                                        "
                                        {settings.vision ||
                                            settings.visi ||
                                            'TERWUJUDNYA MADRASAH ALIYAH NEGERI TANJUNGPINANG YANG BERKUALITAS, AGAMIS, UNGGUL DAN BERWAWASAN LINGKUNGAN'}
                                        "
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* MISI CARDS GRID */}
                        <div className="space-y-6 pt-2">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                    <h4 className="text-lg font-black text-[#142921] sm:text-xl">
                                        MISI SEKOLAH
                                    </h4>
                                    <p className="text-xs font-medium text-[#527365]">
                                        {missionItems.length} Pilar Utama
                                        Pelaksanaan Pendidikan
                                    </p>
                                </div>
                                <span className="rounded-full border border-[#c8dac5] bg-[#f4f8f3] px-3 py-1 text-xs font-black text-[#265243]">
                                    {missionItems.length} Poin Misi Utama
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {missionItems.map((item, idx) => {
                                    const isFullWidth =
                                        idx === missionItems.length - 1 &&
                                        missionItems.length % 2 !== 0;
                                    return (
                                        <div
                                            key={idx}
                                            data-aos="fade-up"
                                            data-aos-delay={idx * 60}
                                            className={`group relative flex min-h-[90px] items-center justify-between gap-4 rounded-2xl border border-[#c8dac5] bg-white p-5 shadow-xs transition-all duration-300 hover:border-[#265243] hover:shadow-md sm:p-6 ${isFullWidth ? 'md:col-span-2' : ''}`}
                                        >
                                            <div className="flex flex-1 items-center">
                                                <p className="w-full text-left text-sm leading-relaxed font-extrabold text-[#142921] sm:text-base">
                                                    {item.desc}
                                                </p>
                                            </div>

                                            <div className="flex shrink-0 items-center justify-center self-stretch border-l border-[#e2ebd9] pl-4">
                                                <span className="font-mono text-2xl font-black tracking-tighter text-[#c8dac5] transition-colors group-hover:text-[#265243] sm:text-3xl">
                                                    {item.num}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* SUB-TAB 3: SEJARAH SINGKAT */}
                {profileSubTab === 'history' && (
                    <div className="animate-in fade-in space-y-8 duration-300">
                        <div className="space-y-2 border-b border-[#e2ebd9] pb-3">
                            <h3 className="text-2xl font-black tracking-tight text-[#142921] sm:text-3xl">
                                Sejarah Singkat Sekolah
                            </h3>
                            <div className="h-1 w-16 rounded-full bg-[#f59e0b]" />
                        </div>

                        {milestones.length === 0 ? (
                            <div className="prose prose-sm space-y-4 leading-relaxed font-medium text-[#2e5445]">
                                <p>
                                    {schoolName} didirikan sebagai institusi
                                    pendidikan menengah tingkat atas yang
                                    berdedikasi melayani masyarakat. Berdiri di
                                    lokasi strategis, sekolah ini telah
                                    melahirkan ribuan alumni yang sukses di
                                    berbagai bidang akademis, pemerintahan,
                                    industri, dan kewirausahaan.
                                </p>
                                <p>
                                    Seiring perjalanan waktu, sekolah terus
                                    melakukan transformasi digital dan modernisasi
                                    kurikulum untuk menjawab tantangan
                                    perkembangan sains, teknologi, dan
                                    globalisasi.
                                </p>
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="absolute top-0 bottom-0 left-1/2 hidden w-0.5 -translate-x-1/2 bg-[#265243] sm:block" />

                                <div className="space-y-8 sm:space-y-0">
                                    {milestones.map((milestone, idx) => {
                                        const isLeft = idx % 2 === 0;
                                        return (
                                            <div
                                                key={milestone.id}
                                                className={`relative flex flex-col items-start gap-4 sm:mb-12 sm:flex-row sm:items-center sm:gap-0 ${isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
                                            >
                                                <div
                                                    className={`w-full sm:w-[calc(50%-2.5rem)] ${isLeft ? 'sm:pr-6' : 'sm:pl-6'}`}
                                                >
                                                    <div className="group rounded-2xl border border-[#c8dac5] bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md">
                                                        <div className="flex items-start gap-3">
                                                            <div className="shrink-0 rounded-lg bg-[#142921] px-3 py-1.5 text-xs font-black text-white shadow-sm transition-colors group-hover:bg-[#265243]">
                                                                {milestone.year}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm leading-snug font-extrabold text-[#142921]">
                                                                    {
                                                                        milestone.title
                                                                    }
                                                                </p>
                                                                {milestone.description && (
                                                                    <p className="mt-1 text-xs leading-relaxed font-medium text-[#527365]">
                                                                        {
                                                                            milestone.description
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="absolute left-1/2 z-10 hidden -translate-x-1/2 sm:flex">
                                                    <div className="h-5 w-5 rounded-full border-4 border-white bg-[#f59e0b] shadow-md" />
                                                </div>

                                                <div className="hidden w-[calc(50%-2.5rem)] sm:block" />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* SUB-TAB 4: SARANA & PRASARANA */}
                {profileSubTab === 'facilities' && (
                    <div className="animate-in fade-in space-y-8 duration-300">
                        <div className="space-y-2 border-b border-[#e2ebd9] pb-3 text-center">
                            <h3 className="text-2xl font-black tracking-tight text-[#142921] sm:text-3xl">
                                Sarana &amp; Prasarana
                            </h3>
                            <div className="mx-auto h-1 w-16 rounded-full bg-[#f59e0b]" />
                        </div>

                        <div className="mx-auto mb-8 max-w-3xl space-y-4 text-center leading-relaxed font-medium text-[#2e5445]">
                            <p>
                                Untuk mendukung proses belajar mengajar yang
                                optimal, {schoolName} menyediakan berbagai
                                fasilitas unggulan yang modern, lengkap, dan
                                terintegrasi.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {(facilities && facilities.length > 0
                                ? facilities
                                : DEFAULT_FACILITIES
                            ).map((fac, idx) => (
                                <div
                                    key={fac.id}
                                    data-aos="fade-up"
                                    data-aos-delay={idx * 80}
                                    onClick={() => setSelectedFacility(fac)}
                                    className="group relative flex h-72 cursor-pointer flex-col justify-end overflow-hidden rounded-2xl border border-[#2d5645]/40 bg-[#142921] shadow-lg transition-all duration-500 hover:-translate-y-1.5 hover:border-[#f59e0b]/60 hover:shadow-2xl sm:h-80"
                                >
                                    {fac.image ? (
                                        <img
                                            src={fac.image}
                                            alt={fac.title}
                                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-[#1b382d]">
                                            <Building2 className="h-16 w-16 text-[#3a6956]" />
                                        </div>
                                    )}

                                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#091510] via-[#091510]/70 to-transparent" />

                                    <div className="relative z-20 w-full space-y-2 p-6 text-center">
                                        <span className="inline-block rounded-full border border-[#427a66]/60 bg-[#265243]/80 px-3 py-1 text-[11px] font-bold tracking-wider text-[#f59e0b] uppercase shadow-sm backdrop-blur-md">
                                            Fasilitas Sekolah
                                        </span>
                                        <h4 className="text-xl leading-tight font-black text-white drop-shadow-md transition-colors group-hover:text-[#f59e0b]">
                                            {fac.title}
                                        </h4>
                                        <div className="flex items-center justify-center gap-1.5 pt-1 text-xs font-semibold text-emerald-300/90 transition-colors group-hover:text-white">
                                            <span>Klik untuk detail</span>
                                            <span className="text-base transition-transform group-hover:translate-x-1">
                                                →
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* MOTTO SEKOLAH QUOTE BANNER */}
            <div data-aos="zoom-in" className="relative space-y-4 overflow-hidden rounded-3xl border border-emerald-900/40 bg-[#142921] p-8 text-center text-white shadow-xl sm:p-12">
                <div className="flex justify-center">
                    <span className="inline-block rounded-full bg-[#f59e0b] px-4 py-1.5 text-xs font-black tracking-widest text-white uppercase shadow-md">
                        MOTTO SEKOLAH
                    </span>
                </div>
                <blockquote className="mx-auto max-w-4xl text-2xl leading-relaxed font-extrabold text-white italic drop-shadow-md sm:text-4xl">
                    "
                    {schoolTagline ||
                        'Unggul Dalam Prestasi, Berkarakter, dan Berwawasan Lingkungan'}
                    "
                </blockquote>
                <div className="mx-auto my-2 h-1 w-16 rounded-full bg-[#f59e0b]" />
                <p className="text-xs font-bold tracking-widest text-emerald-300 uppercase sm:text-sm">
                    — {schoolName} —
                </p>
            </div>
        </div>
    );
}
