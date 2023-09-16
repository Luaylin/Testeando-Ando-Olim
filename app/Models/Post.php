<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'content',
        'has_video',
        'video'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }
}
