<?php

namespace Database\Factories;

use App\Enums\TaskStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    public function definition(): array
    {
        // Always call ->forMember($member) to set the owner and assignee.
        return [
            'title' => fake()->sentence(4),
            'description' => fake()->optional()->paragraph(),
            'status' => TaskStatus::Todo,
            'due_date' => fake()->optional()->dateTimeBetween('now', '+1 month'),
        ];
    }

    /** Make a task for this member. The owner is the member's admin. */
    public function forMember(User $member): static
    {
        return $this->state([
            'assigned_to' => $member->id,
            'admin_id' => $member->admin_id,
        ]);
    }
}
