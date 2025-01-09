<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use  HasFactory;

    public $table = "gc_games";
    public $timestamps = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'fg_id',
        'title',
        'genre',
        'size',
        'size_calculated',
        'status',
        'thoughts',
        'fg_article_date',
        'image',
        'fg_url',
        'playnite_title',
        'playnite_added',
        'playnite_playtime',
        'playnite_checktime',

    ];

    // 'platform',
    // 'graphic_style',
    // 'priority',
    // 'tags',
}
