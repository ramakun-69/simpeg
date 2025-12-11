<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeAssigmentRequest extends FormRequest
{
    protected $fill = [
        'id' => 0,
        'employee_id' => 1,
        'position_id' => 1,
        'letter_number' => 1,
        'letter_date' => 1,
        'letter_subject' => 1,
        'type' => 1,
        'start_date' => 1,
        'end_date' => 1,
        'letter_document' => 1,

    ];
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
    protected function prepareForValidation()
    {
        $trimmed = [];

        foreach ($this->fill as $key) {
            if ($this->has($key)) {
                $trimmed[$key] = is_string($this->input($key)) ? trim($this->input($key)) : $this->input($key);
            }
        }

        $this->merge($trimmed);
    }

    public function rules(): array
    {
        $dataValidate = [];
        foreach (array_keys($this->fill) as $key) {
            $dataValidate[$key] = ($this->fill[$key] == 1) ? 'required' : 'nullable';
            switch ($key) {
                case 'start_date':
                case 'end_date':
                case 'letter_date':
                    $dataValidate[$key] .= '|date';
                    break;
                case 'letter_document':
                    $dataValidate[$key] .= '|file|mimes:pdf|max:10240';
                default:
            }
        }

        return $dataValidate;
    }
}
