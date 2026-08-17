<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ApplicationAccess extends Model
{
    use HasUuids;

    protected $guarded = [];
    protected $keyType = 'string';
    public $incrementing = false;
    
    protected $casts = [
        'is_admin' => 'boolean',
    ];

    public function application()
    {
        return $this->belongsTo(Application::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
