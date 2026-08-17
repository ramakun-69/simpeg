<?php

namespace App\Http\Requests\Master\Employee;

use Illuminate\Foundation\Http\FormRequest;

class ApplicationAccessRequest extends FormRequest
{
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
        return [
            'accesses' => ['array'],
            'accesses.*.application_id' => ['required', 'uuid', 'exists:applications,id'],
            'accesses.*.is_admin' => ['boolean'],
        ];
    }
}
