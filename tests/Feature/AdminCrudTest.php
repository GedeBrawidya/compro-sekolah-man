<?php

namespace Tests\Feature;

use App\Models\Banner;
use App\Models\Book;
use App\Models\BookCopy;
use App\Models\Complaint;
use App\Models\DormitoryPost;
use App\Models\Gallery;
use App\Models\LegalizationRequest;
use App\Models\News;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminCrudTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['role' => User::ROLE_SUPER_ADMIN]);
        Storage::fake('public');
    }

    /** ── NEWS CRUD ── */
    public function test_admin_can_access_news_index_and_create_pages(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.news.index'));
        $response->assertOk();

        $response = $this->actingAs($this->admin)->get(route('admin.news.create'));
        $response->assertOk();
    }

    public function test_admin_can_store_update_and_delete_news(): void
    {
        // Store
        $file = UploadedFile::fake()->image('thumbnail.jpg');
        $storeResponse = $this->actingAs($this->admin)->post(route('admin.news.store'), [
            'title'     => 'Berita Prestasi Sekolah',
            'content'   => '<p>Siswa meraih juara 1 olimpiade.</p>',
            'status'    => 'published',
            'thumbnail' => $file,
        ]);
        $storeResponse->assertRedirect(route('admin.news.index'));

        $this->assertDatabaseHas('news', [
            'title'  => 'Berita Prestasi Sekolah',
            'status' => 'published',
        ]);

        $news = News::first();

        // Edit page
        $editResponse = $this->actingAs($this->admin)->get(route('admin.news.edit', $news->id));
        $editResponse->assertOk();

        // Update
        $updateResponse = $this->actingAs($this->admin)->put(route('admin.news.update', $news->id), [
            'title'   => 'Berita Prestasi Terbaru',
            'content' => '<p>Siswa meraih juara 1 nasional.</p>',
            'status'  => 'draft',
        ]);
        $updateResponse->assertRedirect(route('admin.news.index'));

        $this->assertDatabaseHas('news', [
            'id'    => $news->id,
            'title' => 'Berita Prestasi Terbaru',
            'status'=> 'draft',
        ]);

        // Destroy
        $destroyResponse = $this->actingAs($this->admin)->delete(route('admin.news.destroy', $news->id));
        $destroyResponse->assertRedirect();
        $this->assertDatabaseMissing('news', ['id' => $news->id]);
    }

    /** ── BOOK & COPIES CRUD ── */
    public function test_admin_can_manage_books_and_copies(): void
    {
        // Index
        $this->actingAs($this->admin)->get(route('admin.books.index'))->assertOk();

        // Store book
        $response = $this->actingAs($this->admin)->post(route('admin.books.store'), [
            'title'       => 'Matematika Kuantum',
            'author'      => 'Dr. Budi',
            'category'    => 'Sains',
            'isbn'        => '978-1234567890',
            'total_stock' => 2,
            'description' => 'Buku sains kelas 12',
        ]);
        $response->assertRedirect();

        $book = Book::first();
        $this->assertNotNull($book);
        $this->assertEquals(2, BookCopy::where('book_id', $book->id)->count());

        // Show book detail
        $this->actingAs($this->admin)->get(route('admin.books.show', $book->id))->assertOk();

        // Update book
        $this->actingAs($this->admin)->put(route('admin.books.update', $book->id), [
            'title'       => 'Matematika Kuantum Edisi 2',
            'author'      => 'Dr. Budi',
            'category'    => 'Sains & Teknologi',
            'description' => 'Buku sains kelas 12 edisi revisi',
        ])->assertRedirect();

        $this->assertDatabaseHas('books', ['id' => $book->id, 'title' => 'Matematika Kuantum Edisi 2']);

        // Toggle copy status (borrow)
        $copy = $book->copies()->first();
        $toggleResponse = $this->actingAs($this->admin)->post(route('admin.books.copies.toggle', [$book->id, $copy->id]), [
            'borrower_name' => 'Ahmad Santoso',
        ]);
        $toggleResponse->assertRedirect();

        $this->assertDatabaseHas('book_copies', [
            'id'            => $copy->id,
            'status'        => 'borrowed',
            'borrower_name' => 'Ahmad Santoso',
        ]);

        // Destroy book
        $this->actingAs($this->admin)->delete(route('admin.books.destroy', $book->id))->assertRedirect(route('admin.books.index'));
        $this->assertDatabaseMissing('books', ['id' => $book->id]);
    }

    /** ── COMPLAINTS CRUD ── */
    public function test_admin_can_manage_complaints(): void
    {
        $complaint = Complaint::create([
            'name'    => 'Budi Utomo',
            'email'   => 'budi@example.com',
            'subject' => 'AC Rusak',
            'message' => 'AC di ruang XI IPA 1 tidak dingin.',
            'status'  => 'pending',
        ]);

        $this->actingAs($this->admin)->get(route('admin.complaints.index'))->assertOk();

        $this->actingAs($this->admin)->put(route('admin.complaints.update-status', $complaint->id), [
            'status'   => 'resolved',
            'response' => 'Teknisi sudah memperbaiki AC.',
        ])->assertRedirect();

        $this->assertDatabaseHas('complaints', [
            'id'     => $complaint->id,
            'status' => 'resolved',
        ]);

        $this->actingAs($this->admin)->delete(route('admin.complaints.destroy', $complaint->id))->assertRedirect();
        $this->assertDatabaseMissing('complaints', ['id' => $complaint->id]);
    }

    /** ── DORMITORY POSTS CRUD ── */
    public function test_admin_can_manage_dormitory_posts(): void
    {
        $this->actingAs($this->admin)->get(route('admin.dormitory.index'))->assertOk();

        $this->actingAs($this->admin)->post(route('admin.dormitory.store'), [
            'title'   => 'Jadwal Makan Malam Asrama',
            'content' => 'Jadwal makan malam mulai pukul 18.30 WIB.',
        ])->assertRedirect();

        $post = DormitoryPost::first();
        $this->assertNotNull($post);

        $this->actingAs($this->admin)->put(route('admin.dormitory.update', $post->id), [
            'title'   => 'Jadwal Makan Malam Asrama Terbaru',
            'content' => 'Jadwal makan malam mulai pukul 18.45 WIB.',
        ])->assertRedirect();

        $this->assertDatabaseHas('dormitory_posts', ['id' => $post->id, 'title' => 'Jadwal Makan Malam Asrama Terbaru']);

        $this->actingAs($this->admin)->delete(route('admin.dormitory.destroy', $post->id))->assertRedirect();
        $this->assertDatabaseMissing('dormitory_posts', ['id' => $post->id]);
    }

    /** ── GALLERY CRUD ── */
    public function test_admin_can_manage_gallery_items(): void
    {
        $this->actingAs($this->admin)->get(route('admin.gallery.index'))->assertOk();

        // Store photo gallery
        $photo = UploadedFile::fake()->image('gallery.jpg');
        $this->actingAs($this->admin)->post(route('admin.gallery.store'), [
            'title'    => 'Upacara Bendera',
            'type'     => 'photo',
            'image'    => $photo,
            'category' => 'Kegiatan',
        ])->assertRedirect();

        $item = Gallery::first();
        $this->assertNotNull($item);

        // Toggle status
        $this->actingAs($this->admin)->patch(route('admin.gallery.toggle-status', $item->id))->assertRedirect();
        $this->assertDatabaseHas('galleries', ['id' => $item->id, 'is_active' => false]);

        // Destroy
        $this->actingAs($this->admin)->delete(route('admin.gallery.destroy', $item->id))->assertRedirect();
        $this->assertDatabaseMissing('galleries', ['id' => $item->id]);
    }

    /** ── LANDING PAGE CMS ── */
    public function test_admin_can_manage_landing_page_banners_and_settings(): void
    {
        $this->actingAs($this->admin)->get(route('admin.landing-page.index'))->assertOk();

        // Store Banner
        $bannerImg = UploadedFile::fake()->image('banner.jpg');
        $this->actingAs($this->admin)->post(route('admin.landing-page.banners.store'), [
            'title'       => 'Selamat Datang di Sekolah Kami',
            'subtitle'    => 'Mencetak generasi unggul',
            'image'       => $bannerImg,
            'button_text' => 'Selengkapnya',
            'button_link' => '/profil',
            'is_active'   => true,
        ])->assertRedirect();

        $banner = Banner::first();
        $this->assertNotNull($banner);

        // Update Banner
        $this->actingAs($this->admin)->post(route('admin.landing-page.banners.update', $banner->id), [
            'title'     => 'Selamat Datang versi 2',
            'is_active' => true,
        ])->assertRedirect();

        $this->assertDatabaseHas('banners', ['id' => $banner->id, 'title' => 'Selamat Datang versi 2']);

        // Update Settings
        $this->actingAs($this->admin)->post(route('admin.landing-page.settings'), [
            'school_name' => 'SMA Negeri 1 Prestasi',
            'school_phone' => '021-123456',
        ])->assertRedirect();

        // Destroy Banner
        $this->actingAs($this->admin)->delete(route('admin.landing-page.banners.destroy', $banner->id))->assertRedirect();
        $this->assertDatabaseMissing('banners', ['id' => $banner->id]);
    }

    /** ── LEGALIZATION REQUESTS CRUD ── */
    public function test_admin_can_manage_legalization_requests(): void
    {
        $req = LegalizationRequest::create([
            'alumni_name'   => 'Siti Rahma',
            'email'         => 'siti@example.com',
            'phone'         => '08123456789',
            'graduation_year' => '2022',
            'document_type' => 'Ijazah SMA',
            'status'        => 'pending',
        ]);

        $this->actingAs($this->admin)->get(route('admin.legalization.index'))->assertOk();

        $this->actingAs($this->admin)->put(route('admin.legalization.update-status', $req->id), [
            'status' => 'approved',
            'notes'  => 'Dokumen terverifikasi sah.',
        ])->assertRedirect();

        $this->assertDatabaseHas('legalization_requests', ['id' => $req->id, 'status' => 'approved']);

        $this->actingAs($this->admin)->delete(route('admin.legalization.destroy', $req->id))->assertRedirect();
        $this->assertDatabaseMissing('legalization_requests', ['id' => $req->id]);
    }

    /** ── USER MANAGEMENT CRUD ── */
    public function test_admin_can_manage_users(): void
    {
        $this->actingAs($this->admin)->get(route('admin.users.index'))->assertOk();

        // Create user
        $this->actingAs($this->admin)->post(route('admin.users.store'), [
            'name'     => 'Petugas Pustakawan Baru',
            'email'    => 'pustakawan@sekolah.sch.id',
            'password' => 'password123',
            'role'     => User::ROLE_PUSTAKAWAN,
        ])->assertRedirect();

        $newUser = User::where('email', 'pustakawan@sekolah.sch.id')->first();
        $this->assertNotNull($newUser);

        // Update user
        $this->actingAs($this->admin)->put(route('admin.users.update', $newUser->id), [
            'name'  => 'Petugas Pustakawan Utama',
            'email' => 'pustakawan@sekolah.sch.id',
            'role'  => User::ROLE_PUSTAKAWAN,
        ])->assertRedirect();

        $this->assertDatabaseHas('users', ['id' => $newUser->id, 'name' => 'Petugas Pustakawan Utama']);

        // Delete user
        $this->actingAs($this->admin)->delete(route('admin.users.destroy', $newUser->id))->assertRedirect();
        $this->assertDatabaseMissing('users', ['id' => $newUser->id]);
    }

    public function test_user_cannot_delete_themselves(): void
    {
        $response = $this->actingAs($this->admin)->delete(route('admin.users.destroy', $this->admin->id));
        $response->assertRedirect();
        $this->assertDatabaseHas('users', ['id' => $this->admin->id]);
    }
}
