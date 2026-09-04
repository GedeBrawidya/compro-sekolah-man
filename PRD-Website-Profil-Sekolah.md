# Product Requirements Document (PRD)
## Website Profil Sekolah Berbasis CMS

**Versi:** 1.0
**Tech Stack:** Laravel (Backend/API) + React (Frontend)
**Sumber:** Diturunkan dari Dokumen User Stories Pengembangan Website Profil Sekolah
**Catatan:** Secondary User Stories (Edge Cases: fitur PMBM & Lazy Loading Galeri) **tidak termasuk** dalam scope dokumen ini.

---

## 1. Ringkasan Produk

Website profil sekolah berbasis CMS yang memungkinkan pihak sekolah (Admin, Pengurus Asrama, Pustakawan) mempublikasikan informasi ke publik, serta memungkinkan pengunjung (calon siswa, orang tua, alumni, masyarakat umum) mengakses informasi sekolah, perpustakaan digital, asrama, dan layanan publik lainnya.

## 2. Tech Stack & Design System

| Layer | Teknologi |
|---|---|
| Backend / API | Laravel (REST API, Sanctum/Passport untuk auth) |
| Frontend | React (SPA, Inertia.js, Tailwind CSS) |
| Database | MySQL/PostgreSQL |
| Auth | Laravel Sanctum / Fortify (session/token-based), Role-Based Access Control |
| File Storage | Laravel Storage (local/S3) untuk foto & video |
| Cache | Laravel Cache (Redis/file) untuk halaman publik |

### 2.1 Design System & Palette Warna
- **Base Background:** Broken White (`#FAF9F5`) / Pure White (`#FFFFFF`)
- **Primary Brand / Hero:** Deep Forest Green (`#265243`)
- **Secondary Accent:** Muted Sage Green (`#5E8363`)
- **Light Highlight:** Light Sage / Olive Green (`#9DB588`)
- **Text & Dark Elements:** Dark Slate Charcoal (`#212C34`)


## 3. Role & Aktor

| Role | Deskripsi Akses |
|---|---|
| **Admin Utama (Super Admin)** | Akses penuh ke seluruh dashboard termasuk modul Asrama & Perpustakaan |
| **Humas/Admin** | Kelola berita & galeri |
| **Pengurus Asrama** | Kelola konten Profil Asrama |
| **Pustakawan** | Kelola koleksi & status ketersediaan buku |
| **Pengunjung (Guest)** | Publik, tanpa login, akses halaman-halaman informasi |
| **Masyarakat/Wali Murid** | Guest yang mengirim pengaduan |
| **Alumni** | Guest yang mengakses layanan E-Legalisir |

---

## 4. Functional Requirements

### 4.1 Modul Admin & Manajemen Konten

#### FR-1.1 — Publikasi Berita & Galeri
- **Aktor:** Humas/Admin
- **Deskripsi:** Admin login ke Dashboard, membuka menu "Update Berita", mengisi form (judul, isi, foto/video), lalu klik "Publish".
- **Behavior:**
  - Berita langsung tayang otomatis di halaman publik.
  - Media yang diunggah otomatis tersimpan dan tampil di halaman "Galeri".
- **Entity terkait:** `news` (id, title, content, thumbnail, published_at, author_id), `media` (id, news_id, type, url)

#### FR-1.2 — Manajemen Informasi Asrama
- **Aktor:** Pengurus Asrama
- **Deskripsi:** Login ke Dashboard Pengurus, menambah artikel/kegiatan asrama beserta dokumentasi.
- **Behavior:**
  - Konten otomatis tampil khusus di halaman "Profil Asrama".
  - Tidak memengaruhi/mengubah konten sekolah utama (data terisolasi per modul).
- **Entity terkait:** `dormitory_posts` (id, title, content, media, author_id)

#### FR-1.3 — Manajemen Koleksi Perpustakaan
- **Aktor:** Pustakawan
- **Deskripsi:** CRUD data koleksi buku (tambah, edit, hapus) beserta status ketersediaan.
- **Behavior:**
  - Perubahan status (mis. "Tersedia" → "Dipinjam") langsung ter-update real-time di halaman publik "Perpustakaan Digital".
- **Entity terkait:** `books` (id, title, author, category, status[available/borrowed], cover_image)

#### FR-1.4 — Hak Akses Super Admin
- **Aktor:** Admin Utama
- **Deskripsi:** Admin Utama dapat mengakses seluruh dashboard modul lain (Pustakawan & Pengurus Asrama) tanpa perlu login ulang.
- **Behavior:**
  - Sidebar menampilkan modul "Manajemen Asrama" dan "Manajemen Perpustakaan" untuk role Admin Utama.
  - Implementasi via Role-Based Access Control (lihat FR-6.1).

### 4.2 Modul Publik (Pengunjung)

#### FR-2.1 — Navigasi Profil Sekolah
- Dropdown "Profile" di Navbar berisi: Visi Misi, Sejarah, Sarana Prasarana.
- Klik salah satu item mengarahkan ke halaman statis terkait dengan teks & foto.

#### FR-2.2 — Akses Perpustakaan Digital
- Menu "Perpustakaan Digital" di Navbar mengarah ke halaman list buku (dari FR-1.3).
- Terdapat tombol CTA mencolok (WhatsApp/Email) untuk menghubungi Pustakawan.

#### FR-2.3 — Akses Profil Asrama
- Menu "Asrama" di Navbar mengarah ke halaman berisi info/berita asrama (dari FR-1.2).
- Terdapat tombol CTA untuk menghubungi Pengurus Asrama.

#### FR-2.4 — Pengaduan Masyarakat
- Form "Pengaduan Masyarakat" dapat diakses dari Navbar.
- Setelah submit: pengunjung menerima pesan sukses, Admin menerima notifikasi di Dashboard.
- **Entity terkait:** `complaints` (id, name, email, message, status, created_at)
- **Wajib:** Input harus di-sanitize (lihat FR-6.2).

#### FR-2.5 — Layanan Publik (E-Legalisir & PPID)
- Menu "Layanan Publik" → "E-Legalisir" menampilkan halaman panduan & form pendaftaran legalisir dokumen.
- **Entity terkait:** `legalization_requests` (id, alumni_name, document_type, status, created_at)

### 4.3 Error Handling

#### FR-4.1 — Login Gagal
- Saat email/password salah pada halaman login Dashboard Admin, sistem menolak login dan menampilkan pesan error: **"Email atau kata sandi tidak cocok."**

#### FR-4.2 — Upload Media Melebihi Batas
- Saat upload foto/video pada form berita/galeri melebihi 2MB, sistem menolak file seketika (client & server-side validation) dengan alert: **"Ukuran file maksimal adalah 2MB."**

#### FR-4.3 — Halaman 404
- URL yang tidak valid/tidak ditemukan menampilkan halaman 404 custom dengan tombol "Kembali ke Beranda".

---

## 5. Non-Functional Requirements (Performance)

| ID | Requirement |
|---|---|
| NFR-5.1 | Semua foto yang diunggah ke Galeri/Berita di-compress otomatis (auto-compress) di sisi server agar loading halaman publik < 3 detik. |
| NFR-5.2 | Implementasi caching statis di server (Laravel Cache/CDN) untuk halaman publik agar tetap cepat meski traffic tinggi. |
| NFR-5.3 | Navbar responsif — berubah menjadi hamburger menu di layar mobile/smartphone, termasuk CTA Admin, Perpustakaan, dan Asrama. |

## 6. Security Requirements

| ID | Requirement |
|---|---|
| FR-6.1 | **Role-Based Access Control (RBAC):** Pengurus Asrama dan Pustakawan **tidak boleh** mengakses Dashboard utama Admin (pengaturan website). Middleware Laravel per-role wajib diterapkan di setiap route dashboard. |
| FR-6.2 | **XSS & SQL Injection Protection:** Semua input publik (khususnya form "Pengaduan Masyarakat") wajib di-sanitize/di-escape. Gunakan Eloquent ORM (parameter binding) dan validasi/sanitasi input Laravel. |
| FR-6.3 | **Rate Limiting Login:** IP yang gagal login ke Dashboard (via CTA Admin) lebih dari 5 kali berturut-turut wajib diblokir sementara (Laravel Throttle Middleware) untuk mencegah Brute Force. |
| FR-6.4 | **SSL/HTTPS:** Seluruh koneksi (login, form pengaduan, data kredensial) wajib menggunakan HTTPS terenkripsi. |

---

## 7. Ringkasan Entity/Model (Draft untuk Laravel Migration)

- `users` (id, name, email, password, role[super_admin, admin, pengurus_asrama, pustakawan])
- `news` (id, title, content, thumbnail, published_at, author_id)
- `media` (id, news_id, type[image/video], url)
- `dormitory_posts` (id, title, content, media, author_id)
- `books` (id, title, author, category, status, cover_image)
- `complaints` (id, name, email, message, status, created_at)
- `legalization_requests` (id, alumni_name, document_type, status, created_at)
- `login_attempts` (id, ip_address, attempt_count, blocked_until) — untuk rate limiting

## 8. Ringkasan Endpoint API (Draft)

| Method | Endpoint | Deskripsi | Role |
|---|---|---|---|
| POST | `/api/login` | Login user | Public |
| GET | `/api/news` | List berita publik | Public |
| POST | `/api/admin/news` | Publish berita baru | Admin |
| GET | `/api/gallery` | List galeri | Public |
| GET | `/api/dormitory` | Info profil asrama | Public |
| POST | `/api/pengurus/dormitory-posts` | Tambah konten asrama | Pengurus Asrama |
| GET | `/api/library/books` | List koleksi buku | Public |
| PUT | `/api/pustakawan/books/{id}/status` | Update status buku | Pustakawan |
| POST | `/api/complaints` | Kirim pengaduan | Public |
| GET | `/api/admin/complaints` | Lihat notifikasi pengaduan | Admin |
| POST | `/api/legalization` | Ajukan E-Legalisir | Public (alumni) |
| GET | `/api/admin/dashboard/modules` | Daftar modul Super Admin | Super Admin |

---

## 9. Out of Scope

- Fitur PMBM (belum aktif — menunggu pengembangan lanjutan).
- Lazy loading galeri dengan data >50 foto (Edge Case, dieksklusi dari scope saat ini).

---

*Dokumen ini dirancang agar dapat langsung digunakan sebagai konteks kerja oleh AI coding assistant (mis. Claude Code) dalam membangun aplikasi Laravel + React sesuai requirement di atas.*
