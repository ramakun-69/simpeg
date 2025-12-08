<?php

namespace App\Http\Requests\Master\Employee;

use Illuminate\Foundation\Http\FormRequest;

class RankDataRequest extends FormRequest
{
    protected $fill =
    [
        'rank_history_id' => 0,
        'rank_id' => 1,
        'grade_id' => 1,
        'rank_appointment_date' => 1,
        'rank_sk_number' => 1,
        'rank_sk_date' => 1,
        'rank_sk_file' => 1
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
                case 'rank_appointment_date':
                    $dataValidate[$key] .= '|date';
                    break;
                case 'rank_sk_date':
                    $dataValidate[$key] .= '|date';
                    break;
                case 'rank_sk_file':
                    $dataValidate[$key] .= '|file|mimes:pdf|max:10240';
                    break;
            }
        }
        return $dataValidate;
    }

    public function messages()
    {
        return [
            'rank_sk_file.max' => __('SK File May Not Be Greater Than 10MB'),
            'rank_sk_date.date' => __('SK Date Must Be A Valid Date'),
            'rank_sk_file.mimes' => __('SK File Must Be A PDF'),
        ];
    }
}
