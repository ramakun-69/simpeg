<?php

namespace App\Http\Requests\Master\Employee;

use Illuminate\Foundation\Http\FormRequest;

class LastEducationRequest extends FormRequest
{
    protected $fill = [
        'education_history_id' => 0,
        'university_name' => 1,
        'study_program' => 1,
        'education_program' => 1,
        'honorific_title' => 0,
        'post_nominal_letters' => 0,
        'degree_certificate_number' => 1,
        'degree_certificate_date' => 1,
        'degree_certificate_file' => 1,
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
                case 'degree_certificate_date':
                    $dataValidate[$key] .= '|date';
                    break;
                case 'degree_certificate_file':
                    $dataValidate[$key] .= '|file|mimes:pdf|max:10240';
                    break;
            }
        }
        return $dataValidate;
    }

    public function messages()
    {
        return [
            'degree_certificate_file.max' => __('Degree Certificate File May Not Be Greater Than 10MB'),
            'degree_certificate_date.date' => __('Degree Certificate Date Must Be A Valid Date'),
            'degree_certificate_file.mimes' => __('Degree Certificate Must Be A PDF'),
        ];
    }
}
