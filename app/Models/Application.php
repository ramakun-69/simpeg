<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasUuids;

    protected $guarded = [];
    protected $keyType = 'string';
    public $incrementing = false;

    protected $casts = [
        'is_admin' => 'boolean',
    ];

    public function accesses()
    {
        return $this->hasMany(ApplicationAccess::class);
    }
}
