<?php

namespace Database\Seeders;

use App\Models\SchoolMilestone;
use Illuminate\Database\Seeder;

class SchoolMilestoneSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        SchoolMilestone::truncate();

        $milestones = [
            [
                'year' => 1982,
                'title' => 'Pendirian Awal & Cikal Bakal',
                'description' => 'Berdiri sebagai lembaga pendidikan Islam tingkat menengah di Tanjungpinang untuk menjawab kebutuhan masyarakat Kepulauan Riau akan pendidikan formal berwawasan keagamaan.',
                'order' => 1,
            ],
            [
                'year' => 1993,
                'title' => 'Penetapan Status MAN Tanjungpinang',
                'description' => 'Resmi berstatus Madrasah Aliyah Negeri (MAN) Tanjungpinang berdasarkan Keputusan Menteri Agama RI, menjadi madrasah aliyah negeri utama di ibu kota Kepulauan Riau.',
                'order' => 2,
            ],
            [
                'year' => 2005,
                'title' => 'Pengembangan Sarana & Laboratorium',
                'description' => 'Pembangunan kompleks ruang kelas baru, Laboratorium IPA Terpadu, Laboratorium Bahasa, serta Perpustakaan Sekolah untuk menunjang kegiatan akademik.',
                'order' => 3,
            ],
            [
                'year' => 2012,
                'title' => 'Raihan Akreditasi "A" (Unggul)',
                'description' => 'MAN Tanjungpinang berhasil meraih peringkat Akreditasi "A" dari Badan Akreditasi Nasional Sekolah/Madrasah (BAN-S/M) dengan nilai sangat memuaskan.',
                'order' => 4,
            ],
            [
                'year' => 2016,
                'title' => 'Peresmian Pusat Keagamaan & Tahfiz',
                'description' => 'Pembangunan dan peresmian fasilitas keagamaan terpadu serta dimulainya Program Unggulan Tahfiz Al-Qur\'an bagi para santri/siswa madrasah.',
                'order' => 5,
            ],
            [
                'year' => 2019,
                'title' => 'Transformasi Pembelajaran Digital',
                'description' => 'Penerapan E-Learning Madrasah, Computer Based Test (CBT), serta integrasi sistem informasi sekolah berbasis online secara menyeluruh.',
                'order' => 6,
            ],
            [
                'year' => 2022,
                'title' => 'Implementasi Kurikulum Merdeka',
                'description' => 'Penerapan Kurikulum Merdeka dan Projek Penguatan Profil Pelajar Pancasila & Rahmatan Lil \'Alamin (P5-PPRA) untuk mencetak generasi berkarakter.',
                'order' => 7,
            ],
            [
                'year' => 2025,
                'title' => 'Peluncuran Portal Digital Modern',
                'description' => 'Peluncuran portal web terpadu MAN Tanjungpinang untuk meningkatkan transparansi publik, layanan informasi alumni, dan interaksi civitas akademika.',
                'order' => 8,
            ],
        ];

        foreach ($milestones as $milestone) {
            SchoolMilestone::create($milestone);
        }
    }
}
