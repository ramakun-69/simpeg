<?php

namespace App\Http\Requests\Master\Employee;

use Illuminate\Foundation\Http\FormRequest;

class StatusChangeRequest extends FormRequest
{
    protected $fill = [
        'nip' => 1,
        'status_reason' => 0,
        'status' => 1,
    ];
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $dataValidate = [];
        if ($this->status == 'Inactive') {
            $this->fill['status_reason'] = 1;
        }
        foreach (array_keys($this->fill) as $key) {
            $dataValidate[$key] = ($this->fill[$key] == 1) ? 'required' : 'nullable';
        }
        return $dataValidate;
    }
}
