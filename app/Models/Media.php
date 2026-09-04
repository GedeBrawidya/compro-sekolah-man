<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Media extends Model
{
    use HasFactory;

    protected $fillable = [
        'news_id',
        'type',
        'title',
        'url',
    ];

    public function news(): BelongsTo
    {
        return $this->belongsTo(News::class);
    }
}
