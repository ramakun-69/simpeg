<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class TrainingHistory extends Model
{
    use HasUuids;

    protected $guarded = [];
    protected $keyType = 'string';
    public $incrementing = false;
    protected $appends = ['training_certificate_file_url'];

    public function getTrainingCertificateFileUrlAttribute()
    {
        if ($this->training_certificate_file && Storage::exists($this->training_certificate_file)) {
            return Storage::url($this->training_certificate_file);
        }
        return null;
    }
}
