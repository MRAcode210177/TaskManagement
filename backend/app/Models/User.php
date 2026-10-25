<?php

namespace App\Models;

use App\Enums\Role;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Only these fields can be filled from request data.
     * "role" and "admin_id" are NOT here on purpose.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => Role::class,
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === Role::Admin;
    }

    public function isMember(): bool
    {
        return $this->role === Role::Member;
    }

    /** The admin who owns this member. */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    /** The members owned by this admin. */
    public function members(): HasMany
    {
        return $this->hasMany(User::class, 'admin_id');
    }

    /** Tasks this admin owns. */
    public function ownedTasks(): HasMany
    {
        return $this->hasMany(Task::class, 'admin_id');
    }

    /** Tasks assigned to this member. */
    public function assignedTasks(): HasMany
    {
        return $this->hasMany(Task::class, 'assigned_to');
    }

    /**
     * OWNERSHIP SCOPE.
     * Only the members that belong to this admin.
     * Usage: User::membersOf($admin)->get()
     */
    public function scopeMembersOf(Builder $query, User $admin): Builder
    {
        return $query->where('role', Role::Member->value)
            ->where('admin_id', $admin->id);
    }
}
