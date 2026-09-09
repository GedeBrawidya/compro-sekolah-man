<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebsiteVisit extends Model
{
    protected $fillable = [
        'date',
        'views_count',
    ];

    /**
     * Record dynamic visitor count for today.
     */
    public static function recordVisit(): void
    {
        $today = now()->toDateString();
        
        $visit = static::firstOrCreate(
            ['date' => $today],
            ['views_count' => 0]
        );

        $visit->increment('views_count');
    }
}
