<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class RankHistory extends Model
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

    public function rank()
    {
        return $this->belongsTo(Rank::class);
    }
    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }

    public function getSkFileUrlAttribute()
    {
        if ($this->rank_sk_file && Storage::exists($this->rank_sk_file)) {
            return Storage::url($this->rank_sk_file);
        }
        return null;
    }
}
