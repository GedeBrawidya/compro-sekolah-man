<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookCopy extends Model
{
    use HasFactory;

    protected $fillable = [
        'book_id',
        'copy_code',
        'borrower_name',
        'borrowed_at',
        'due_date',
        'status',
        'notes',
    ];

    protected $casts = [
        'borrowed_at' => 'date',
        'due_date'    => 'date',
    ];

    public function book()
    {
        return $this->belongsTo(Book::class);
    }

    /**
     * Boot model events to automatically sync available and total stock in parent Book.
     */
    protected static function booted()
    {
        static::saved(function ($copy) {
            $copy->book->syncStock();
        });

        static::deleted(function ($copy) {
            $copy->book->syncStock();
        });
    }
}
