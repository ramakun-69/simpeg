<?php

namespace App\Http\Requests\Master\Employee;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Validator;

class ApplicationAccessRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $accesses = collect($this->input('accesses', []))
            ->map(function (array $access) {
                if (isset($access['application_code'])) {
                    $access['application_code'] = Str::upper(
                        trim($access['application_code'])
                    );
                }

                return $access;
            })
            ->values()
            ->all();

        $this->merge([
            'accesses' => $accesses,
        ]);
    }

    public function rules(): array
    {
        return [
            'accesses' => ['array'],

            'accesses.*' => ['array'],

            // Dipakai oleh form web
            'accesses.*.application_id' => [
                'nullable',
                'uuid',
                'exists:applications,id',
            ],

            // Dipakai oleh API WBS
            'accesses.*.application_code' => [
                'nullable',
                'string',
                'exists:applications,code',
            ],

            'accesses.*.is_admin' => [
                'nullable',
                'boolean',
            ],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            foreach ($this->input('accesses', []) as $index => $access) {
                $hasId = filled($access['application_id'] ?? null);
                $hasCode = filled($access['application_code'] ?? null);

                if (!$hasId && !$hasCode) {
                $validator->errors()->add("accesses.$index.application_id",__('Application is required.'));
                }
                if ($hasId && $hasCode) {
                    $validator->errors()->add("accesses.$index.application_id",__('Use application ID or application code, not both.'));
                }
            }
        });
    }
}
