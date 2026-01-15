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
    protected $appends = ['last_position', 'last_rank', 'last_education','current_position'];

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

    public function assignments()
    {
        return $this->hasMany(EmployeeAssigment::class);
    }

    // assignment aktif (PLH / PLT)
    public function activeAssignment()
    {
        return $this->hasOne(EmployeeAssigment::class)
            ->whereIn('type', ['PLH', 'PLT'])
            ->whereDate('start_date', '<=', now())
            ->where(function ($q) {
                $q->whereNull('end_date')
                    ->orWhereDate('end_date', '>=', now());
            });
    }

    public function getCurrentPositionAttribute()
    {
        // Jika ada PLH / PLT aktif → pakai itu
        if ($this->activeAssignment && $this->activeAssignment->position) {
            return [
                'id'   => $this->activeAssignment->position->id,
                'name' => $this->activeAssignment->position->name,
                'type' => $this->activeAssignment->type, // PLH / PLT
            ];
        }

        // Jika tidak → posisi definitif
        if ($this->position) {
            return [
                'id'   => $this->position->id,
                'name' => $this->position->name,
                'type' => 'DEFINITIF',
            ];
        }

        return null;
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
