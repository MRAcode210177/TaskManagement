<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Tests\TestCase;

class OwnershipTest extends TestCase
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

    // ---------- helpers ----------

    private function check(User $user, string $ability, object|string $target): Response
    {
        return Gate::forUser($user)->inspect($ability, $target);
    }

    private function assertAllows(Response $r): void
    {
        $this->assertTrue($r->allowed());
    }

    /** Denied with HTTP 403 (no special status). */
    private function assertDenies403(Response $r): void
    {
        $this->assertFalse($r->allowed());
        $this->assertNull($r->status());
    }

    /** Denied with HTTP 404 (hide that the row exists). */
    private function assertDenies404(Response $r): void
    {
        $this->assertFalse($r->allowed());
        $this->assertSame(404, $r->status());
    }

    // ---------- scopes ----------

    public function test_members_of_returns_only_the_members_of_that_admin(): void
    {
        $ids = User::membersOf($this->adminA)->pluck('id')->all();

        $this->assertEqualsCanonicalizing([$this->memberA1->id, $this->memberA2->id], $ids);
    }

    public function test_members_of_never_returns_admins(): void
    {
        $this->assertFalse(User::membersOf($this->adminA)->whereKey($this->adminA->id)->exists());
        $this->assertFalse(User::membersOf($this->adminA)->whereKey($this->adminB->id)->exists());
    }

    public function test_admin_sees_only_tasks_they_own(): void
    {
        $t1 = Task::factory()->forMember($this->memberA1)->create();
        $t2 = Task::factory()->forMember($this->memberA2)->create();
        Task::factory()->forMember($this->memberB1)->create();

        $ids = Task::visibleTo($this->adminA)->pluck('id')->all();

        $this->assertEqualsCanonicalizing([$t1->id, $t2->id], $ids);
    }

    public function test_member_sees_only_tasks_assigned_to_them(): void
    {
        $mine = Task::factory()->forMember($this->memberA1)->create();
        Task::factory()->forMember($this->memberA2)->create(); // same admin, other member
        Task::factory()->forMember($this->memberB1)->create(); // other admin

        $ids = Task::visibleTo($this->memberA1)->pluck('id')->all();

        $this->assertEquals([$mine->id], $ids);
    }

    public function test_find_or_fail_throws_not_found_for_another_admins_task(): void
    {
        $otherTask = Task::factory()->forMember($this->memberB1)->create();

        $this->expectException(ModelNotFoundException::class);

        Task::visibleTo($this->adminA)->findOrFail($otherTask->id);
    }

    // ---------- user policy (members) ----------

    public function test_admin_can_manage_own_members(): void
    {
        $this->assertAllows($this->check($this->adminA, 'viewAny', User::class));
        $this->assertAllows($this->check($this->adminA, 'create', User::class));
        $this->assertAllows($this->check($this->adminA, 'view', $this->memberA1));
        $this->assertAllows($this->check($this->adminA, 'update', $this->memberA1));
        $this->assertAllows($this->check($this->adminA, 'delete', $this->memberA1));
    }

    public function test_admin_gets_404_for_another_admins_member(): void
    {
        $this->assertDenies404($this->check($this->adminA, 'view', $this->memberB1));
        $this->assertDenies404($this->check($this->adminA, 'update', $this->memberB1));
        $this->assertDenies404($this->check($this->adminA, 'delete', $this->memberB1));
    }

    public function test_member_cannot_manage_members(): void
    {
        $this->assertDenies403($this->check($this->memberA1, 'viewAny', User::class));
        $this->assertDenies403($this->check($this->memberA1, 'create', User::class));
        $this->assertDenies403($this->check($this->memberA1, 'view', $this->memberA2));
        $this->assertDenies403($this->check($this->memberA1, 'delete', $this->memberA2));
    }

    // ---------- task policy ----------

    public function test_admin_can_do_everything_on_own_task(): void
    {
        $task = Task::factory()->forMember($this->memberA1)->create();

        $this->assertAllows($this->check($this->adminA, 'create', Task::class));
        $this->assertAllows($this->check($this->adminA, 'view', $task));
        $this->assertAllows($this->check($this->adminA, 'update', $task));
        $this->assertAllows($this->check($this->adminA, 'delete', $task));
        $this->assertAllows($this->check($this->adminA, 'updateStatus', $task));
    }

    public function test_admin_gets_404_for_another_admins_task(): void
    {
        $task = Task::factory()->forMember($this->memberB1)->create();

        foreach (['view', 'update', 'delete', 'updateStatus'] as $ability) {
            $this->assertDenies404($this->check($this->adminA, $ability, $task));
        }
    }

    public function test_member_can_view_and_change_status_of_assigned_task(): void
    {
        $task = Task::factory()->forMember($this->memberA1)->create();

        $this->assertAllows($this->check($this->memberA1, 'view', $task));
        $this->assertAllows($this->check($this->memberA1, 'updateStatus', $task));
    }

    public function test_member_cannot_create_edit_or_delete_tasks(): void
    {
        $task = Task::factory()->forMember($this->memberA1)->create();

        $this->assertDenies403($this->check($this->memberA1, 'create', Task::class));
        $this->assertDenies403($this->check($this->memberA1, 'update', $task));
        $this->assertDenies403($this->check($this->memberA1, 'delete', $task));
    }

    public function test_member_gets_404_for_another_members_task(): void
    {
        // memberA2 has the same admin, but it is not memberA1's task.
        $task = Task::factory()->forMember($this->memberA2)->create();

        foreach (['view', 'update', 'delete', 'updateStatus'] as $ability) {
            $this->assertDenies404($this->check($this->memberA1, $ability, $task));
        }
    }
}
