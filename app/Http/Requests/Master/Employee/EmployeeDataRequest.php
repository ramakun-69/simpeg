<?php

namespace App\Http\Requests\Master\Employee;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeDataRequest extends FormRequest
{
    protected $fill =
    [
        'id' => 0,
        'nip' => 1,
        'name' => 1,
        'gender' => 1,
        'email' => 1,
        'born_place' => 1,
        'born_date' => 1,
        'phone' => 1,
        'address' => 1,
        'employee_type' => 1,
        'division' => 1,
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
                case 'email':
                    $dataValidate[$key] .= '|email:dns|unique:users,email,'. $this->user_id;
                    break;
                case 'nip':
                    $dataValidate[$key] .= '|unique:employees,nip,'. $this->id;
                    break;
                case 'phone':
                    $dataValidate[$key] .= '|phone:AUTO,ID';
                    break;
            }
        }
        return $dataValidate;
    }
}
