<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Complaint;
use App\Models\DormitoryPost;
use App\Models\LegalizationRequest;
use App\Models\News;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Users with distinct roles
        $superAdmin = User::updateOrCreate(
            ['email' => 'admin@sekolah.sch.id'],
            [
                'name' => 'Admin Utama',
                'password' => Hash::make('password'),
                'role' => User::ROLE_SUPER_ADMIN,
                'email_verified_at' => now(),
            ]
        );

        $humas = User::updateOrCreate(
            ['email' => 'humas@sekolah.sch.id'],
            [
                'name' => 'Budi Humas',
                'password' => Hash::make('password'),
                'role' => User::ROLE_ADMIN,
                'email_verified_at' => now(),
            ]
        );

        $pengurusAsrama = User::updateOrCreate(
            ['email' => 'asrama@sekolah.sch.id'],
            [
                'name' => 'Siti Asrama',
                'password' => Hash::make('password'),
                'role' => User::ROLE_PENGURUS_ASRAMA,
                'email_verified_at' => now(),
            ]
        );

        $pustakawan = User::updateOrCreate(
            ['email' => 'pustakawan@sekolah.sch.id'],
            [
                'name' => 'Rudi Pustakawan',
                'password' => Hash::make('password'),
                'role' => User::ROLE_PUSTAKAWAN,
                'email_verified_at' => now(),
            ]
        );

        // 2. Seed News (15 items for pagination)
        $sampleNews = [
            ['Penerimaan Siswa Baru Tahun Ajaran 2026/2027 Resmi Dibuka', 'penerimaan-siswa-baru-2026-2027', 'Sekolah kembali membuka pendaftaran untuk calon siswa baru dengan berbagai program unggulan akademik dan non-akademik.'],
            ['Tim Robotik Sekolah Raih Juara 1 Tingkat Nasional', 'tim-robotik-sekolah-raih-juara-1-nasional', 'Selamat kepada tim robotik sekolah yang berhasil mengalahkan 50 peserta lain dalam kompetisi robotik nasional.'],
            ['Olimpiade Sains Nasional: Siswa MAN Sabet 3 Medali Emas', 'olimpiade-sains-nasional-sabet-3-medali-emas', 'Siswa MAN Tanjungpinang berhasil mengukir prestasi gemilang dalam kompetisi Kompetisi Sains Madrasah tingkat provinsi dan nasional.'],
            ['Kunjungan Edukasi Civitas Akademika ke Perpustakaan Nasional', 'kunjungan-edukasi-ke-perpustakaan-nasional', 'Ratusan siswa didampingi dewan guru melakukan studi lapangan dan pengenalan literasi digital di institusi perpustakaan.'],
            ['Pelatihan Kewirausahaan Santri & Pembuatan Produk Kreatif', 'pelatihan-kewirausahaan-santri-produk-kreatif', 'Asrama dan sekolah menggelar workshop kewirausahaan guna mencetak generasi mandiri dan berjiwa wirausaha islami.'],
            ['Upacara Peringatan Hari Pendidikan Nasional Berlangsung Khidmat', 'upacara-peringatan-hari-pendidikan-nasional', 'Seluruh guru dan siswa mengikuti upacara bendera dengan mengenakan pakaian adat Nusantara.'],
            ['Pentas Seni & Bazar Kuliner Tradisional Tahunan Sukses Digelar', 'pentas-seni-bazar-kuliner-tradisional', 'Kegiatan kreatif siswa menampilkan berbagai tarian daerah, musik akustik, serta bazar makanan khas Riau Kepulauan.'],
            ['Workshop Literasi Digital: Etika Bermedia Sosial Bagi Remaja', 'workshop-literasi-digital-etika-medsos', 'Sekolah bekerja sama dengan Kementerian Kominfo menyelenggarakan sosialisasi pemanfaatan internet secara cerdas dan aman.'],
            ['Simulasi Ujian Berbasis Komputer berjalan Lancar dan Tertib', 'simulasi-ujian-berbasis-komputer-lancar', 'Persiapan ujian akhir sekolah berbasis CBT dilaksanakan tanpa kendala jaringan, dengan kesiapan 100% dari ruang laboratorium.'],
            ['Penyuluhan Kesehatan Remaja & Gerakan Donor Darah Sukses', 'penyuluhan-kesehatan-remaja-donor-darah', 'PMR dan Dinas Kesehatan setempat menggelar periksa kesehatan gratis dan aksi sosial donor darah bersama warga sekolah.'],
            ['Juara Umum Lomba Debat Bahasa Inggris & Arab Se-Sumatera', 'juara-umum-lomba-debat-bahasa-inggris-arab', 'Delegasi debat sekolah meraih trophy bergilir setelah mengungguli berbagai sekolah menengah favorit di wilayah Sumatera.'],
            ['Kultum Ramadan & Pembagian Sembako bagi Masyarakat Sekitar', 'kultum-ramadan-pembagian-sembako-masyarakat', 'Bentuk kepedulian sosial, OSIS dan Pengurus Asrama membagikan paket sembako bagi keluarga kurang mampu di lingkungan sekolah.'],
        ];

        foreach ($sampleNews as $i => $n) {
            News::updateOrCreate(
                ['slug' => $n[1]],
                [
                    'title' => $n[0],
                    'content' => $n[2] . ' Kegiatan ini berlangsung dengan lancar dan mendapatkan antusiasme yang sangat tinggi dari seluruh civitas akademika.',
                    'status' => 'published',
                    'published_at' => now()->subDays($i * 2),
                    'author_id' => $humas->id,
                    'views_count' => rand(25, 350),
                ]
            );
        }

        // 3. Seed Dormitory Posts (12 items for pagination)
        $sampleDorm = [
            ['Kegiatan Pengajian Rutin & Kajian Malam Santri Asrama', 'kegiatan-pengajian-rutin-santri-asrama', 'Setiap malam Jumat, seluruh penghuni asrama melaksanakan pembacaan Yasin dan ceramah agama bersama pengasuh asrama.'],
            ['Jadwal Kebersihan & Kerja Bakti Asrama Putra & Putri', 'jadwal-kebersihan-asrama-putra-putri', 'Kerja bakti lingkungan asrama dilaksanakan setiap hari Minggu pagi untuk menjaga kebersihan dan kesehatan penghuni.'],
            ['Setoran Hafalan Al-Qur’an (Tahfidz) Santri Asrama', 'setoran-hafalan-tahfidz-santri-asrama', 'Setiap ba’da Subuh dan Maghrib, santri melaksanakan muroja’ah dan setoran ziyadah hafalan Al-Qur’an.'],
            ['Pelatihan Bahasa Arab & Inggris Harian Santri Asrama', 'pelatihan-bahasa-arab-inggris-santri', 'Program pembiasaan percakapan (muhadatsah / conversation) bahasa asing harian di lingkungan kompleks asrama.'],
            ['Malam Inagurasi & Silaturahmi Santri Baru Asrama', 'malam-inagurasi-silaturahmi-santri-baru', 'Acara penyambutan dan keakraban antar penghuni asrama dengan penampilan seni Islami dan ramah tamah.'],
            ['Kajian Kitab Kuning & Akhlakul Karimah Bersama Pengasuh', 'kajian-kitab-kuning-akhlakul-karimah', 'Program pengajaran kitab suci dan akhlak guna membentuk kepribadian santri yang berbudi pekerti luhur.'],
            ['Olah Raga Bersama & Senam Sehat Minggu Pagi Santri', 'olah-raga-bersama-senam-sehat-santri', 'Guna mengimbangi kebugaran jasmani, seluruh santri asrama mengikuti kegiatan olahraga bulutangkis dan futsal.'],
            ['Bimbingan Belajar Malam (Study Club) Persiapan Ujian', 'bimbingan-belajar-malam-study-club', 'Program pendampingan tutor sebaya dan guru piket asrama untuk pendalaman materi pelajaran sekolah.'],
        ];

        foreach ($sampleDorm as $i => $d) {
            DormitoryPost::updateOrCreate(
                ['slug' => $d[1]],
                [
                    'title' => $d[0],
                    'content' => $d[2] . ' Pengurus asrama berkomitmen mendampingi santri secara intensif 24 jam.',
                    'author_id' => $pengurusAsrama->id,
                    'created_at' => now()->subDays($i * 3),
                ]
            );
        }

        // 4. Seed Library Books (15 items for pagination)
        $sampleBooks = [
            ['Matematika Modern untuk SMA Kelas XII', 'Prof. Dr. Suparno', 'Sains & Teknologi', '978-602-1234-56-7', 'available'],
            ['Laskar Pelangi', 'Andrea Hirata', 'Novel & Sastra', '978-979-3062-79-2', 'borrowed'],
            ['Fisika Dasar Edisi Kelima', 'Halliday & Resnick', 'Sains & Teknologi', '978-047-1320-57-9', 'available'],
            ['Biologi Molekuler & Genetika', 'Dr. Endang Rahayu', 'Sains & Teknologi', '978-602-5555-11-2', 'available'],
            ['Sejarah Kebudayaan Islam Nusantara', 'K.H. Agus Sunyoto', 'Agama & Kebudayaan', '978-602-7777-22-3', 'available'],
            ['Bumi Manusia', 'Pramoedya Ananta Toer', 'Novel & Sastra', '978-979-9731-23-9', 'available'],
            ['Kimia Organik untuk Pendidikan Menengah', 'Drs. H. Mulyono', 'Sains & Teknologi', '978-602-8888-33-4', 'available'],
            ['Bahasa Inggris & Tata Bahasa Akademik', 'Betty Schrampfer Azar', 'Bahasa & Kebudayaan', '978-013-4444-55-5', 'available'],
            ['Fiqih Syafi’i Terlengkap & Amaliyah', 'Dr. Wahbah Az-Zuhaili', 'Agama & Kebudayaan', '978-602-9999-66-7', 'available'],
            ['Algoritma & Pemrograman Python untuk Pemula', 'Rizky Kurniawan, M.Kom', 'Komputer & IT', '978-602-1111-77-8', 'available'],
            ['Ekonomi Mikro & Makro Kelas XI', 'Dra. Sri Mulyani', 'Ekonomi & Bisnis', '978-602-2222-88-9', 'available'],
            ['Sosiologi Budaya & Masayarakat Indonesia', 'Prof. Selo Soemardjan', 'Ilmu Sosial', '978-602-3333-99-0', 'available'],
        ];

        foreach ($sampleBooks as $b) {
            Book::updateOrCreate(
                ['isbn' => $b[3]],
                [
                    'title' => $b[0],
                    'author' => $b[1],
                    'category' => $b[2],
                    'status' => $b[4],
                    'description' => 'Buku koleksi resmi perpustakaan digital sekolah yang siap dipinjam oleh seluruh siswa dan guru.',
                ]
            );
        }

        // 5. Seed Complaints
        Complaint::create([
            'name' => 'Ahmad Fauzi',
            'email' => 'ahmad.fauzi@gmail.com',
            'phone' => '081234567890',
            'subject' => 'Fasilitas Laboratorium Komputer',
            'message' => 'Mohon perbaikan beberapa komputer di lab 2 yang kurang berfungsi dengan baik saat jam pelajaran praktek.',
            'status' => 'pending',
        ]);

        Complaint::create([
            'name' => 'Dewi Sartika',
            'email' => 'dewi.sartika@yahoo.com',
            'phone' => '082198765432',
            'subject' => 'Pencahayaan Lapangan Olahraga',
            'message' => 'Lampu di area lapangan basket malam hari ada yang mati.',
            'status' => 'processed',
            'response' => 'Terima kasih atas masukannya. Tim teknisi sarpras sedang dalam proses penggantian lampu.',
        ]);

        // 6. Seed Legalization Requests
        LegalizationRequest::create([
            'alumni_name' => 'Rian Hidayat',
            'email' => 'rian.hidayat@gmail.com',
            'phone' => '085712345678',
            'graduation_year' => '2023',
            'document_type' => 'Ijazah & Transkrip Nilai',
            'copies' => 5,
            'status' => 'pending',
            'notes' => 'Diperlukan untuk keperluan pendaftaran perguruan tinggi luar negeri.',
        ]);

        LegalizationRequest::create([
            'alumni_name' => 'Siti Nurhaliza',
            'email' => 'siti.nurhaliza@outlook.com',
            'phone' => '081399887766',
            'graduation_year' => '2022',
            'document_type' => 'Ijazah',
            'copies' => 3,
            'status' => 'approved',
            'notes' => 'Dokumen sudah selesai dilegalisir dan siap diambil di tata usaha.',
        ]);

        // 7. Seed School Milestones
        $this->call(SchoolMilestoneSeeder::class);
    }
}
