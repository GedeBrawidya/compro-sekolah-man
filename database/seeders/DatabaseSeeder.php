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

        // 2. Seed News
        News::create([
            'title' => 'Penerimaan Siswa Baru Tahun Ajaran 2026/2027 Resmi Dibuka',
            'slug' => 'penerimaan-siswa-baru-2026-2027',
            'content' => 'Sekolah kembali membuka pendaftaran untuk calon siswa baru dengan berbagai program unggulan akademik dan non-akademik.',
            'status' => 'published',
            'published_at' => now(),
            'author_id' => $humas->id,
        ]);

        News::create([
            'title' => 'Tim Robotik Sekolah Raih Juara 1 Tingkat Nasional',
            'slug' => 'tim-robotik-sekolah-raih-juara-1-nasional',
            'content' => 'Selamat kepada tim robotik sekolah yang berhasil mengalahkan 50 peserta lain dalam kompetisi robotik nasional.',
            'status' => 'published',
            'published_at' => now()->subDays(2),
            'author_id' => $humas->id,
        ]);

        // 3. Seed Dormitory Posts
        DormitoryPost::create([
            'title' => 'Kegiatan Pengajian Rutin & Kajian Malam Santri Asrama',
            'slug' => 'kegiatan-pengajian-rutin-santri-asrama',
            'content' => 'Setiap malam Jumat, seluruh penghuni asrama melaksanakan pembacaan Yasin dan ceramah agama bersama pengasuh asrama.',
            'author_id' => $pengurusAsrama->id,
        ]);

        DormitoryPost::create([
            'title' => 'Jadwal Kebersihan & Kerja Bakti Asrama Putra',
            'slug' => 'jadwal-kebersihan-asrama-putra',
            'content' => 'Kerja bakti lingkungan asrama dilaksanakan setiap hari Minggu pagi untuk menjaga kebersihan dan kesehatan penghuni.',
            'author_id' => $pengurusAsrama->id,
        ]);

        // 4. Seed Library Books
        Book::create([
            'title' => 'Matematika Modern untuk SMA Kelas XII',
            'author' => 'Prof. Dr. Suparno',
            'category' => 'Sains & Teknologi',
            'isbn' => '978-602-1234-56-7',
            'status' => 'available',
            'description' => 'Buku panduan pembelajaran matematika tingkat lanjut untuk siswa SMA.',
        ]);

        Book::create([
            'title' => 'Laskar Pelangi',
            'author' => 'Andrea Hirata',
            'category' => 'Novel & Sastra',
            'isbn' => '978-979-3062-79-2',
            'status' => 'borrowed',
            'description' => 'Kisah perjuangan sepuluh anak di Belitung dalam menuntut ilmu di sekolah Muhammadiyah.',
        ]);

        Book::create([
            'title' => 'Fisika Dasar Edisi Kelima',
            'author' => 'Halliday & Resnick',
            'category' => 'Sains & Teknologi',
            'isbn' => '978-047-1320-57-9',
            'status' => 'available',
            'description' => 'Konsep-konsep dasar ilmu fisika mekanika, termodinamika, dan gelombang.',
        ]);

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
    }
}
