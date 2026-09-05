<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SchoolMilestone extends Model
{
    protected $fillable = ['year', 'title', 'description', 'order'];
}
