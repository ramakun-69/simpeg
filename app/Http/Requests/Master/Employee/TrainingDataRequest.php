<?php

namespace App\Http\Requests\Master\Employee;

use Illuminate\Foundation\Http\FormRequest;

class TrainingDataRequest extends FormRequest
{
    protected $fill = [
        'training_history_id' => 0,
        'training_name' => 1,
        'issuing_institution' => 1,
        'start_date' => 1,
        'end_date' => 1,
        'training_hours' => 1,
        'certificate_number' => 1,
        'certificate_date' => 1,
        'training_certificate_file' => 1,
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
                case 'certificate_date':
                    $dataValidate[$key] .= '|date';
                    break;
                case 'training_hours':
                    $dataValidate[$key] .= '|numeric';
                    break;
                case 'training_certificate_file':
                    $dataValidate[$key] .= '|file|mimes:pdf|max:10240';
                    break;
            }
        }
        return $dataValidate;
    }
    public function messages()
    {
        return [
            'training_certificate_file.max' => __('Training Certificate File May Not Be Greater Than 10MB'),
            'certificate_date.date' => __('Certificate Date Must Be A Valid Date'),
            'degree_certificate_file.mimes' => __('Certificate Must Be A PDF'),
        ];
    }
}
