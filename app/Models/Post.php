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
        'tag',
        'slug',
        'thumbnail',
        'is_show',
        'is_top',
        'published_at'
       
    ];
}
