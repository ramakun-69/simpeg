<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Grade extends Model
{
     use HasUuids,SoftDeletes;
    protected $guarded = [];
    protected $keyType = 'string';
    public $incrementing = false;
}
