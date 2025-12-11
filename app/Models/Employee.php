<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use HasUuids;
    protected $guarded = [];
    protected $keyType = 'string';
    public $incrementing = false;
    protected $appends = ['last_position', 'last_rank', 'last_education'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function position()
    {
        return $this->belongsTo(Position::class);
    }
    public function rank()
    {
        return $this->belongsTo(Rank::class);
    }

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }
    public function rankHistories()
    {
        return $this->hasMany(RankHistory::class);
    }
    public function positionHistories()
    {
        return $this->hasMany(PositionHistory::class);
    }
    public function educationHistories()
    {
        return $this->hasMany(EducationHistory::class);
    }
    public function trainingHistories()
    {
        return $this->hasMany(TrainingHistory::class);
    }

    public function getLastPositionAttribute()
    {
        $history = $this->positionHistories()->where('is_last', 'Yes')->first();

        return $history ? $history : null;
    }
    public function getLastRankAttribute()
    {
        $history = $this->rankHistories()->where('is_last', 'Yes')->first();

        return $history ? $history : null;
    }
    public function getLastEducationAttribute()
    {
        $history = $this->educationHistories()->where('is_last', 'Yes')->first();

        return $history ? $history : null;
    }

  
}
