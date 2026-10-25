<?php

namespace App\Models;

use App\Enums\TaskStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    use HasFactory;

    /**
     * "admin_id" and "status" are NOT here on purpose.
     * The server sets the owner. Status changes use their own endpoint.
     */
    protected $fillable = [
        'title',
        'description',
        'assigned_to',
        'due_date',
    ];

    protected function casts(): array
    {
        return [
            'status' => TaskStatus::class,
            'due_date' => 'date',
        ];
    }

    /** The admin who owns this task. */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    /** The member who must do this task. */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * OWNERSHIP SCOPE.
     * A scope is a reusable "where" for queries.
     * Admin  => tasks they own.
     * Member => tasks assigned to them.
     */
    public function scopeVisibleTo(Builder $query, User $user): Builder
    {
        return $user->isAdmin()
            ? $query->where('admin_id', $user->id)
            : $query->where('assigned_to', $user->id);
    }
}
