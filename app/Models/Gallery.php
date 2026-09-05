<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Gallery extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'type',
        'image_path',
        'youtube_url',
        'youtube_id',
        'description',
        'category',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Helper to extract YouTube Video ID from standard/shortened YouTube links.
     */
    public static function extractYoutubeId(?string $url): ?string
    {
        if (empty($url)) {
            return null;
        }

        preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/', $url, $matches);

        return $matches[1] ?? null;
    }

    /**
     * Accessor for full image URL or YouTube thumbnail URL
     */
    public function getDisplayImageAttribute(): ?string
    {
        if ($this->type === 'photo') {
            return $this->image_path ? Storage::url($this->image_path) : null;
        }

        if ($this->type === 'youtube' && $this->youtube_id) {
            return "https://img.youtube.com/vi/{$this->youtube_id}/hqdefault.jpg";
        }

        return $this->image_path ? Storage::url($this->image_path) : null;
    }
}
