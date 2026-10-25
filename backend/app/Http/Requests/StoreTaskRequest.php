<?php

namespace App\Http\Requests;

use App\Enums\Role;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        // The route middleware and the policy do the real check.
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            // IMPORTANT: the assignee must be a MEMBER that belongs to THIS admin.
            'assigned_to' => [
                'required',
                'integer',
                Rule::exists('users', 'id')
                    ->where('role', Role::Member->value)
                    ->where('admin_id', $this->user()->id),
            ],
            'due_date' => ['nullable', 'date_format:Y-m-d'],
        ];
    }
}
