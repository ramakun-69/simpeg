<?php

namespace App\Http\Requests\Auth;

use App\Rules\EmailOrUsername;
use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{

    protected $fill = [
        'username' => 1,
        'password' => 1,
        'gRecaptcha' => 1,
        'remember' => 0,
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
                case 'password':
                    $dataValidate[$key] .= '|min:6';
                    break;
                case 'gRecaptcha':
                    $dataValidate[$key] .= '|captcha';
                    break;
            }
        }
        return $dataValidate;
    }

    public function messages(): array
    {

        return [
            'username.required' => __('NIP is required'),
            'password.required' => __('Password is required'),
            'gRecaptcha.required' => __("Please verify that you are not a robot.")
        ];
    }
}
