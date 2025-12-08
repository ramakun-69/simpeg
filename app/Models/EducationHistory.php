<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class EducationHistory extends Model
{
    use HasUuids;

    protected $guarded = [];
    protected $keyType = 'string';
    public $incrementing = false;
    protected $appends = ['degree_certificate_file_url'];

    public function getDegreeCertificateFileUrlAttribute()
    {
        if ($this->degree_certificate_file && Storage::exists($this->degree_certificate_file)) {
            return Storage::url($this->degree_certificate_file);
        }
        return null;
    }
}
