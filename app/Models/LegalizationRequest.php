<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LegalizationRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'alumni_name',
        'email',
        'phone',
        'graduation_year',
        'document_type',
        'copies',
        'document_file',
        'status',
        'notes',
    ];
}
