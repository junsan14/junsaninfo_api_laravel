<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Post extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'content',
        'author_id',
        'excerpt',
        'keywords',
        'category',
        'sub_category',
        'tags',
        'slug',
        'thumbnail',
        'is_show',
        'is_top',
        'is_featured',
        'published_at',
       
    ];
    protected $casts = [
        'tags' => 'array',
    ];
}
