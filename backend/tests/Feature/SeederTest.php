<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeder_creates_the_expected_demo_data(): void
    {
        $this->seed();

        $this->assertSame(2, User::where('role', 'admin')->count());
        $this->assertSame(5, User::where('role', 'member')->count());
        $this->assertSame(11, Task::count());
    }

    public function test_seeded_users_can_log_in(): void
    {
        $this->seed();

        $accounts = [
            'alice@example.com' => 'admin',
            'brian@example.com' => 'admin',
            'ben@example.com' => 'member',
            'emma@example.com' => 'member',
        ];

        foreach ($accounts as $email => $role) {
            $this->postJson('/api/v1/auth/login', ['email' => $email, 'password' => 'password'])
                ->assertOk()
                ->assertJsonPath('data.role', $role);
        }
    }

    public function test_seeded_admins_only_see_their_own_data(): void
    {
        $this->seed();

        Sanctum::actingAs(User::where('email', 'alice@example.com')->firstOrFail());
        $this->getJson('/api/v1/members')->assertOk()->assertJsonPath('meta.total', 3);
        $this->getJson('/api/v1/dashboard')->assertOk()
            ->assertJsonPath('data.members_count', 3)
            ->assertJsonPath('data.tasks_total', 7)
            ->assertJsonPath('data.tasks_by_status.todo', 3)
            ->assertJsonPath('data.tasks_by_status.in_progress', 2)
            ->assertJsonPath('data.tasks_by_status.done', 2);

        Sanctum::actingAs(User::where('email', 'brian@example.com')->firstOrFail());
        $this->getJson('/api/v1/members')->assertOk()->assertJsonPath('meta.total', 2);
        $this->getJson('/api/v1/dashboard')->assertOk()
            ->assertJsonPath('data.members_count', 2)
            ->assertJsonPath('data.tasks_total', 4)
            ->assertJsonPath('data.tasks_by_status.todo', 2)
            ->assertJsonPath('data.tasks_by_status.in_progress', 1)
            ->assertJsonPath('data.tasks_by_status.done', 1);
    }

    public function test_no_seeded_task_is_assigned_across_admins(): void
    {
        $this->seed();

        // A broken task = the task owner is not the owner of the assigned member.
        $broken = Task::query()
            ->join('users', 'users.id', '=', 'tasks.assigned_to')
            ->whereColumn('users.admin_id', '!=', 'tasks.admin_id')
            ->count();

        $this->assertSame(0, $broken);
    }

    public function test_seeder_does_nothing_in_production(): void
    {
        $this->app->detectEnvironment(fn () => 'production');

        (new DatabaseSeeder())->run();

        $this->assertSame(0, User::count());
    }
}
