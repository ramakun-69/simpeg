<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use LaravelLang\Publisher\Concerns\Has;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class PositionHistory extends Model
{
    use HasUuids;

    protected $guarded = [];
    protected $keyType = 'string';
    public $incrementing = false;
    protected $appends = ['sk_file_url'];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function position()
    {
        return $this->belongsTo(Position::class);
    }

    public function getSkFileUrlAttribute()
    {
        if ($this->position_sk_file && Storage::exists($this->position_sk_file)) {
            return Storage::url($this->position_sk_file);
        }
        return null;
    }
}
