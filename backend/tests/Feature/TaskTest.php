<?php

namespace Tests\Feature;

use App\Enums\TaskStatus;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    private User $adminA;
    private User $adminB;
    private User $memberA1;
    private User $memberA2;
    private User $memberB1;

    protected function setUp(): void
    {
        parent::setUp();

        $this->adminA = User::factory()->create();
        $this->adminB = User::factory()->create();
        $this->memberA1 = User::factory()->memberOf($this->adminA)->create();
        $this->memberA2 = User::factory()->memberOf($this->adminA)->create();
        $this->memberB1 = User::factory()->memberOf($this->adminB)->create();
    }

    private function taskFor(User $member, array $attributes = []): Task
    {
        return Task::factory()->forMember($member)->create($attributes);
    }

    /** The task ids from a list response. */
    private function idsFrom(string $url): array
    {
        return collect($this->getJson($url)->assertOk()->json('data'))->pluck('id')->all();
    }

    // ---------- who can use the API ----------

    public function test_guest_gets_401(): void
    {
        $this->getJson('/api/v1/tasks')->assertUnauthorized();
        $this->postJson('/api/v1/tasks', [])->assertUnauthorized();
    }

    // ---------- list ----------

    public function test_admin_lists_only_own_tasks(): void
    {
        $t1 = $this->taskFor($this->memberA1);
        $t2 = $this->taskFor($this->memberA2);
        $this->taskFor($this->memberB1); // other admin
        Sanctum::actingAs($this->adminA);

        $this->assertEqualsCanonicalizing([$t1->id, $t2->id], $this->idsFrom('/api/v1/tasks'));
    }

    public function test_member_lists_only_assigned_tasks(): void
    {
        $mine = $this->taskFor($this->memberA1);
        $this->taskFor($this->memberA2); // same admin, other member
        $this->taskFor($this->memberB1); // other admin
        Sanctum::actingAs($this->memberA1);

        $this->assertEquals([$mine->id], $this->idsFrom('/api/v1/tasks'));
    }

    public function test_list_filters_by_status_and_assignee(): void
    {
        $todo = $this->taskFor($this->memberA1);
        $done = $this->taskFor($this->memberA1, ['status' => TaskStatus::Done]);
        $this->taskFor($this->memberA2);
        $this->taskFor($this->memberB1);
        Sanctum::actingAs($this->adminA);

        $this->assertEquals([$done->id], $this->idsFrom('/api/v1/tasks?status=done'));
        $this->assertEqualsCanonicalizing(
            [$todo->id, $done->id],
            $this->idsFrom('/api/v1/tasks?assigned_to='.$this->memberA1->id)
        );
        // Filtering by another admin's member gives an empty list.
        $this->assertSame([], $this->idsFrom('/api/v1/tasks?assigned_to='.$this->memberB1->id));
    }

    public function test_list_rejects_an_invalid_status_filter(): void
    {
        Sanctum::actingAs($this->adminA);

        $this->getJson('/api/v1/tasks?status=banana')
            ->assertUnprocessable()
            ->assertJsonValidationErrors('status');
    }

    public function test_list_is_paginated(): void
    {
        Task::factory()->count(20)->forMember($this->memberA1)->create();
        Sanctum::actingAs($this->adminA);

        $this->getJson('/api/v1/tasks')
            ->assertOk()
            ->assertJsonCount(15, 'data')
            ->assertJsonStructure(['data', 'links', 'meta'])
            ->assertJsonPath('meta.total', 20);
    }

    // ---------- create ----------

    public function test_admin_can_create_a_task(): void
    {
        Sanctum::actingAs($this->adminA);

        $this->postJson('/api/v1/tasks', [
            'title' => 'Write report',
            'description' => 'Q3 numbers',
            'assigned_to' => $this->memberA1->id,
            'due_date' => '2026-11-30',
        ])->assertCreated()
            ->assertJsonPath('data.title', 'Write report')
            ->assertJsonPath('data.status', 'todo')
            ->assertJsonPath('data.due_date', '2026-11-30')
            ->assertJsonPath('data.assigned_to', $this->memberA1->id)
            ->assertJsonPath('data.assignee.name', $this->memberA1->name);

        $this->assertDatabaseHas('tasks', [
            'title' => 'Write report',
            'admin_id' => $this->adminA->id,
            'assigned_to' => $this->memberA1->id,
            'status' => 'todo',
        ]);
    }

    public function test_create_ignores_admin_id_and_status_from_client(): void
    {
        Sanctum::actingAs($this->adminA);

        $this->postJson('/api/v1/tasks', [
            'title' => 'T',
            'assigned_to' => $this->memberA1->id,
            'admin_id' => $this->adminB->id,
            'status' => 'done',
        ])->assertCreated();

        $this->assertDatabaseHas('tasks', [
            'title' => 'T',
            'admin_id' => $this->adminA->id,
            'status' => 'todo',
        ]);
    }

    public function test_admin_cannot_assign_a_task_to_another_admins_member(): void
    {
        Sanctum::actingAs($this->adminA);

        $this->postJson('/api/v1/tasks', [
            'title' => 'T',
            'assigned_to' => $this->memberB1->id,
        ])->assertUnprocessable()->assertJsonValidationErrors('assigned_to');

        $this->assertDatabaseCount('tasks', 0);
    }

    public function test_admin_cannot_assign_a_task_to_an_admin(): void
    {
        Sanctum::actingAs($this->adminA);

        foreach ([$this->adminA, $this->adminB] as $admin) {
            $this->postJson('/api/v1/tasks', [
                'title' => 'T',
                'assigned_to' => $admin->id,
            ])->assertUnprocessable()->assertJsonValidationErrors('assigned_to');
        }

        $this->assertDatabaseCount('tasks', 0);
    }

    public function test_create_validates_input(): void
    {
        Sanctum::actingAs($this->adminA);

        $this->postJson('/api/v1/tasks', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['title', 'assigned_to']);

        $this->postJson('/api/v1/tasks', [
            'title' => 'T',
            'assigned_to' => $this->memberA1->id,
            'due_date' => 'tomorrow',
        ])->assertUnprocessable()->assertJsonValidationErrors('due_date');
    }

    public function test_member_cannot_create_edit_or_delete_tasks(): void
    {
        $task = $this->taskFor($this->memberA1);
        Sanctum::actingAs($this->memberA1);
        $url = '/api/v1/tasks/'.$task->id;

        $this->postJson('/api/v1/tasks', ['title' => 'T', 'assigned_to' => $this->memberA1->id])->assertForbidden();
        $this->putJson($url, ['title' => 'Hacked'])->assertForbidden();
        $this->deleteJson($url)->assertForbidden();

        $this->assertDatabaseHas('tasks', ['id' => $task->id, 'title' => $task->title]);
    }

    // ---------- show ----------

    public function test_admin_and_assigned_member_can_view_a_task(): void
    {
        $task = $this->taskFor($this->memberA1);

        foreach ([$this->adminA, $this->memberA1] as $user) {
            Sanctum::actingAs($user);

            $this->getJson('/api/v1/tasks/'.$task->id)
                ->assertOk()
                ->assertJsonPath('data.id', $task->id);
        }
    }

    public function test_admin_gets_404_for_another_admins_task(): void
    {
        $task = $this->taskFor($this->memberB1);
        Sanctum::actingAs($this->adminA);
        $url = '/api/v1/tasks/'.$task->id;

        $this->getJson($url)->assertNotFound()->assertJsonPath('message', 'Not found.');
        $this->putJson($url, ['title' => 'Hacked'])->assertNotFound();
        $this->patchJson($url.'/status', ['status' => 'done'])->assertNotFound();
        $this->deleteJson($url)->assertNotFound();

        $this->assertDatabaseHas('tasks', ['id' => $task->id, 'title' => $task->title, 'status' => 'todo']);
    }

    public function test_member_gets_404_for_another_members_task(): void
    {
        // memberA2 has the same admin, but it is not memberA1's task.
        $task = $this->taskFor($this->memberA2);
        Sanctum::actingAs($this->memberA1);
        $url = '/api/v1/tasks/'.$task->id;

        $this->getJson($url)->assertNotFound();
        $this->patchJson($url.'/status', ['status' => 'done'])->assertNotFound();

        $this->assertDatabaseHas('tasks', ['id' => $task->id, 'status' => 'todo']);
    }

    // ---------- update ----------

    public function test_admin_can_update_a_task_and_reassign_it(): void
    {
        $task = $this->taskFor($this->memberA1);
        Sanctum::actingAs($this->adminA);

        $this->putJson('/api/v1/tasks/'.$task->id, [
            'title' => 'New title',
            'assigned_to' => $this->memberA2->id,
        ])->assertOk()
            ->assertJsonPath('data.title', 'New title')
            ->assertJsonPath('data.assignee.id', $this->memberA2->id);

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'New title',
            'assigned_to' => $this->memberA2->id,
            'admin_id' => $this->adminA->id,
        ]);
    }

    public function test_admin_cannot_reassign_a_task_to_another_admins_member(): void
    {
        $task = $this->taskFor($this->memberA1);
        Sanctum::actingAs($this->adminA);

        $this->putJson('/api/v1/tasks/'.$task->id, ['assigned_to' => $this->memberB1->id])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('assigned_to');

        $this->assertDatabaseHas('tasks', ['id' => $task->id, 'assigned_to' => $this->memberA1->id]);
    }

    public function test_update_ignores_admin_id_and_status(): void
    {
        $task = $this->taskFor($this->memberA1);
        Sanctum::actingAs($this->adminA);

        $this->putJson('/api/v1/tasks/'.$task->id, [
            'title' => 'Same task',
            'admin_id' => $this->adminB->id,
            'status' => 'done',
        ])->assertOk();

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Same task',
            'admin_id' => $this->adminA->id,
            'status' => 'todo',
        ]);
    }

    // ---------- status ----------

    public function test_admin_and_assigned_member_can_change_the_status(): void
    {
        $task = $this->taskFor($this->memberA1);
        $url = '/api/v1/tasks/'.$task->id.'/status';

        Sanctum::actingAs($this->memberA1);
        $this->patchJson($url, ['status' => 'in_progress'])
            ->assertOk()
            ->assertJsonPath('data.status', 'in_progress');

        Sanctum::actingAs($this->adminA);
        $this->patchJson($url, ['status' => 'done'])
            ->assertOk()
            ->assertJsonPath('data.status', 'done');
    }

    public function test_status_endpoint_changes_only_the_status(): void
    {
        $task = $this->taskFor($this->memberA1, ['title' => 'Original']);
        Sanctum::actingAs($this->memberA1);

        $this->patchJson('/api/v1/tasks/'.$task->id.'/status', [
            'status' => 'done',
            'title' => 'Hacked',
            'assigned_to' => $this->memberA2->id,
        ])->assertOk();

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'Original',
            'assigned_to' => $this->memberA1->id,
            'status' => 'done',
        ]);
    }

    public function test_status_must_be_valid(): void
    {
        $task = $this->taskFor($this->memberA1);
        Sanctum::actingAs($this->memberA1);
        $url = '/api/v1/tasks/'.$task->id.'/status';

        $this->patchJson($url, ['status' => 'banana'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('status');
        $this->patchJson($url, [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('status');
    }

    // ---------- delete ----------

    public function test_admin_can_delete_own_task(): void
    {
        $task = $this->taskFor($this->memberA1);
        Sanctum::actingAs($this->adminA);

        $this->deleteJson('/api/v1/tasks/'.$task->id)->assertNoContent();

        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }
}
