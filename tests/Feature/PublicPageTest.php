<?php

namespace Tests\Feature;

use App\Models\News;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_user_can_visit_home_page(): void
    {
        $author = \App\Models\User::factory()->create();
        News::create([
            'title'        => 'Pengumuman Penting',
            'content'      => 'Konten berita publik',
            'status'       => 'published',
            'published_at' => now(),
            'author_id'    => $author->id,
        ]);

        $response = $this->get(route('home'));
        $response->assertOk();
    }

    public function test_public_user_can_view_news_detail(): void
    {
        $author = \App\Models\User::factory()->create();
        $news = News::create([
            'title'        => 'Kegiatan Pramuka Sekolah',
            'slug'         => 'kegiatan-pramuka-sekolah',
            'content'      => 'Konten berita lengkap kegiatan pramuka.',
            'status'       => 'published',
            'published_at' => now(),
            'author_id'    => $author->id,
        ]);

        $response = $this->get(route('public.news.show', $news->slug));
        $response->assertOk();
    }

    public function test_public_user_can_submit_legalization_request(): void
    {
        $response = $this->post(route('public.legalization.store'), [
            'alumni_name'     => 'Budi Santoso',
            'email'           => 'budi@example.com',
            'phone'           => '08123456789',
            'graduation_year' => '2023',
            'document_type'   => 'Ijazah SMA',
            'copies'          => 3,
            'notes'           => 'Mohon diproses cepat',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('legalization_requests', [
            'alumni_name' => 'Budi Santoso',
            'status'      => 'pending',
        ]);
    }

    public function test_public_user_can_submit_complaint(): void
    {
        $response = $this->post(route('public.complaints.store'), [
            'name'    => 'Orang Tua Murid',
            'email'   => 'ortu@example.com',
            'phone'   => '08987654321',
            'subject' => 'Saran Parkir',
            'message' => 'Mohon penataan parkir di depan gerbang utama.',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('complaints', [
            'name'   => 'Orang Tua Murid',
            'status' => 'pending',
        ]);
    }
}
