<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/**
 * The main rule of the project: one admin can never see or change
 * another admin's data. These tests try to break that rule.
 */
class IsolationTest extends TestCase
{
    use RefreshDatabase;

    // ---------- helpers ----------

    /** Create a member with the real API. Returns the new id. */
    private function createMember(User $admin, string $name, string $email): int
    {
        Sanctum::actingAs($admin);

        return $this->postJson('/api/v1/members', [
            'name' => $name,
            'email' => $email,
            'password' => 'password123',
        ])->assertCreated()->json('data.id');
    }

    /** Create a task with the real API. Returns the new id. */
    private function createTask(User $admin, string $title, int $memberId): int
    {
        Sanctum::actingAs($admin);

        return $this->postJson('/api/v1/tasks', [
            'title' => $title,
            'assigned_to' => $memberId,
        ])->assertCreated()->json('data.id');
    }

    private function idsOf(string $url): array
    {
        return collect($this->getJson($url)->assertOk()->json('data'))->pluck('id')->all();
    }

    /** $actor tries everything against the data of the OTHER admin. */
    private function assertCannotTouch(
        User $actor,
        int $foreignMemberId,
        int $foreignTaskId,
        int $ownMemberId,
        int $ownTaskId
    ): void {
        Sanctum::actingAs($actor);

        // Members of the other admin: not found.
        $this->getJson("/api/v1/members/{$foreignMemberId}")->assertNotFound();
        $this->putJson("/api/v1/members/{$foreignMemberId}", ['name' => 'Hacked'])->assertNotFound();
        $this->deleteJson("/api/v1/members/{$foreignMemberId}")->assertNotFound();

        // Tasks of the other admin: not found.
        $this->getJson("/api/v1/tasks/{$foreignTaskId}")->assertNotFound();
        $this->putJson("/api/v1/tasks/{$foreignTaskId}", ['title' => 'Hacked'])->assertNotFound();
        $this->patchJson("/api/v1/tasks/{$foreignTaskId}/status", ['status' => 'done'])->assertNotFound();
        $this->deleteJson("/api/v1/tasks/{$foreignTaskId}")->assertNotFound();

        // Cannot give work to the other admin's member (create or reassign).
        $this->postJson('/api/v1/tasks', ['title' => 'Sneaky', 'assigned_to' => $foreignMemberId])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('assigned_to');
        $this->putJson("/api/v1/tasks/{$ownTaskId}", ['assigned_to' => $foreignMemberId])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('assigned_to');

        // Lists and the dashboard show only own data.
        $this->assertEquals([$ownMemberId], $this->idsOf('/api/v1/members'));
        $this->assertEquals([$ownTaskId], $this->idsOf('/api/v1/tasks'));
        $this->getJson('/api/v1/dashboard')
            ->assertOk()
            ->assertJsonPath('data.members_count', 1)
            ->assertJsonPath('data.tasks_total', 1);
    }

    // ---------- tests ----------

    public function test_two_admins_are_fully_separated_through_the_real_api(): void
    {
        $alice = User::factory()->create();
        $brian = User::factory()->create();

        // Each admin builds a small world with the real API.
        $aliceMember = $this->createMember($alice, 'Alice Member', 'alice-member@example.com');
        $aliceTask = $this->createTask($alice, 'Alice task', $aliceMember);
        $brianMember = $this->createMember($brian, 'Brian Member', 'brian-member@example.com');
        $brianTask = $this->createTask($brian, 'Brian task', $brianMember);

        // Brian attacks Alice's data. Then Alice attacks Brian's data.
        $this->assertCannotTouch($brian, $aliceMember, $aliceTask, $brianMember, $brianTask);
        $this->assertCannotTouch($alice, $brianMember, $brianTask, $aliceMember, $aliceTask);

        // After all attacks, nothing has changed.
        $this->assertDatabaseHas('users', ['id' => $aliceMember, 'name' => 'Alice Member', 'admin_id' => $alice->id]);
        $this->assertDatabaseHas('users', ['id' => $brianMember, 'name' => 'Brian Member', 'admin_id' => $brian->id]);
        $this->assertDatabaseHas('tasks', [
            'id' => $aliceTask, 'title' => 'Alice task', 'status' => 'todo',
            'assigned_to' => $aliceMember, 'admin_id' => $alice->id,
        ]);
        $this->assertDatabaseHas('tasks', [
            'id' => $brianTask, 'title' => 'Brian task', 'status' => 'todo',
            'assigned_to' => $brianMember, 'admin_id' => $brian->id,
        ]);
        $this->assertDatabaseCount('users', 4);
        $this->assertDatabaseCount('tasks', 2);
    }

    public function test_a_member_sees_only_their_own_work(): void
    {
        $alice = User::factory()->create();
        $brian = User::factory()->create();
        $ben = User::factory()->memberOf($alice)->create();
        $carla = User::factory()->memberOf($alice)->create();
        $emma = User::factory()->memberOf($brian)->create();

        $bensTask = Task::factory()->forMember($ben)->create();
        $carlasTask = Task::factory()->forMember($carla)->create(); // same admin
        $emmasTask = Task::factory()->forMember($emma)->create();   // other admin

        Sanctum::actingAs($ben);

        // Only the own task is in the list.
        $this->assertEquals([$bensTask->id], $this->idsOf('/api/v1/tasks'));

        // The other tasks look like they do not exist.
        foreach ([$carlasTask, $emmasTask] as $task) {
            $this->getJson('/api/v1/tasks/'.$task->id)->assertNotFound();
            $this->patchJson('/api/v1/tasks/'.$task->id.'/status', ['status' => 'done'])->assertNotFound();
        }

        // Admin features are closed.
        $this->getJson('/api/v1/members')->assertForbidden();
        $this->getJson('/api/v1/dashboard')->assertForbidden();
        $this->postJson('/api/v1/tasks', ['title' => 'T', 'assigned_to' => $ben->id])->assertForbidden();

        // The own status change works.
        $this->patchJson('/api/v1/tasks/'.$bensTask->id.'/status', ['status' => 'done'])->assertOk();

        // The other tasks were not touched.
        $this->assertDatabaseHas('tasks', ['id' => $carlasTask->id, 'status' => 'todo']);
        $this->assertDatabaseHas('tasks', ['id' => $emmasTask->id, 'status' => 'todo']);
    }
}
