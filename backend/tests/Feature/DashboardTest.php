<?php

namespace Tests\Feature;

use App\Enums\TaskStatus;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_sees_counts_of_own_data_only(): void
    {
        $adminA = User::factory()->create();
        $adminB = User::factory()->create();
        $m1 = User::factory()->memberOf($adminA)->create();
        $m2 = User::factory()->memberOf($adminA)->create();
        $mb = User::factory()->memberOf($adminB)->create();

        Task::factory()->count(2)->forMember($m1)->create(); // todo
        Task::factory()->forMember($m2)->create(['status' => TaskStatus::InProgress]);
        Task::factory()->forMember($m2)->create(['status' => TaskStatus::Done]);
        Task::factory()->count(3)->forMember($mb)->create(); // other admin

        Sanctum::actingAs($adminA);

        $this->getJson('/api/v1/dashboard')
            ->assertOk()
            ->assertJsonPath('data.members_count', 2)
            ->assertJsonPath('data.tasks_total', 4)
            ->assertJsonPath('data.tasks_by_status.todo', 2)
            ->assertJsonPath('data.tasks_by_status.in_progress', 1)
            ->assertJsonPath('data.tasks_by_status.done', 1);
    }

    public function test_member_gets_403(): void
    {
        $admin = User::factory()->create();
        Sanctum::actingAs(User::factory()->memberOf($admin)->create());

        $this->getJson('/api/v1/dashboard')->assertForbidden();
    }

    public function test_guest_gets_401(): void
    {
        $this->getJson('/api/v1/dashboard')->assertUnauthorized();
    }
}
