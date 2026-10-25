<?php

namespace App\Http\Requests;

use App\Enums\TaskStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/** Checks the filters of GET /tasks (?status=&assigned_to=&page=). */
class IndexTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['sometimes', Rule::enum(TaskStatus::class)],
            'assigned_to' => ['sometimes', 'integer'],
            'page' => ['sometimes', 'integer', 'min:1'],
        ];
    }
}
