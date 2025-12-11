<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class EmployeeAssigment extends Model
{
    use HasUuids;

    protected $guarded = [];
    protected $keyType = 'string';
    public $incrementing = false;
    protected $appends = ['letter_document_url'];

    public function getLetterDocumentUrlAttribute()
    {
        if ($this->letter_document && Storage::exists($this->letter_document)) {
            return Storage::url($this->letter_document);
        }
        return null;
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function position()
    {
        return $this->belongsTo(Position::class);
    }
}
