<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'author',
        'category',
        'total_stock',
        'available_stock',
        'isbn',
        'status',
        'cover_image',
        'description',
    ];

    public function copies()
    {
        return $this->hasMany(BookCopy::class);
    }

    /**
     * Recalculate and synchronize total_stock and available_stock based on physical copies.
     */
    public function syncStock()
    {
        $total = $this->copies()->count();
        $available = $this->copies()->where('status', 'available')->count();

        // If no physical copy records created yet, keep existing stock default
        if ($total > 0) {
            $this->update([
                'total_stock'     => $total,
                'available_stock' => $available,
                'status'          => $available > 0 ? 'available' : 'borrowed',
            ]);
        }
    }
}
