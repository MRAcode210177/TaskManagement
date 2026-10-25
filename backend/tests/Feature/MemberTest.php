<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class MemberTest extends TestCase
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

    // ---------- who can use the API ----------

    public function test_guest_gets_401(): void
    {
        $this->getJson('/api/v1/members')->assertUnauthorized();
        $this->postJson('/api/v1/members', [])->assertUnauthorized();
    }

    public function test_member_gets_403_on_every_members_route(): void
    {
        Sanctum::actingAs($this->memberA1);
        $url = '/api/v1/members/'.$this->memberA2->id;

        $this->getJson('/api/v1/members')->assertForbidden();
        $this->postJson('/api/v1/members', [])->assertForbidden();
        $this->getJson($url)->assertForbidden();
        $this->putJson($url, ['name' => 'X'])->assertForbidden();
        $this->deleteJson($url)->assertForbidden();
    }

    // ---------- list ----------

    public function test_admin_lists_only_own_members(): void
    {
        Sanctum::actingAs($this->adminA);

        $response = $this->getJson('/api/v1/members')->assertOk();

        $ids = collect($response->json('data'))->pluck('id')->all();
        $this->assertEqualsCanonicalizing([$this->memberA1->id, $this->memberA2->id], $ids);
    }

    public function test_list_is_paginated(): void
    {
        User::factory()->count(20)->memberOf($this->adminA)->create();
        Sanctum::actingAs($this->adminA);

        $this->getJson('/api/v1/members')
            ->assertOk()
            ->assertJsonCount(15, 'data')
            ->assertJsonStructure(['data', 'links', 'meta'])
            ->assertJsonPath('meta.total', 22);
    }

    // ---------- create ----------

    public function test_admin_can_create_a_member(): void
    {
        Sanctum::actingAs($this->adminA);

        $this->postJson('/api/v1/members', [
            'name' => 'Sara Member',
            'email' => 'Sara@Example.com',
            'password' => 'password123',
        ])->assertCreated()
            ->assertJsonPath('data.role', 'member')
            ->assertJsonPath('data.admin_id', $this->adminA->id)
            ->assertJsonPath('data.email', 'sara@example.com')
            ->assertJsonMissingPath('data.password');

        $this->assertDatabaseHas('users', [
            'email' => 'sara@example.com',
            'role' => 'member',
            'admin_id' => $this->adminA->id,
        ]);

        // The new member can log in with the password the admin set.
        $this->postJson('/api/v1/auth/login', [
            'email' => 'sara@example.com',
            'password' => 'password123',
        ])->assertOk()->assertJsonPath('data.role', 'member');
    }

    public function test_create_ignores_role_and_admin_id_from_client(): void
    {
        Sanctum::actingAs($this->adminA);

        $this->postJson('/api/v1/members', [
            'name' => 'Sara',
            'email' => 'sara@example.com',
            'password' => 'password123',
            'role' => 'admin',
            'admin_id' => $this->adminB->id,
        ])->assertCreated();

        $this->assertDatabaseHas('users', [
            'email' => 'sara@example.com',
            'role' => 'member',
            'admin_id' => $this->adminA->id,
        ]);
    }

    public function test_create_validates_input(): void
    {
        Sanctum::actingAs($this->adminA);

        $this->postJson('/api/v1/members', [
            'email' => $this->memberA1->email,
            'password' => 'short',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'email', 'password']);

        // Email must be unique across ALL users, also other admins' members.
        $this->postJson('/api/v1/members', [
            'name' => 'X',
            'email' => $this->memberB1->email,
            'password' => 'password123',
        ])->assertUnprocessable()->assertJsonValidationErrors('email');
    }

    // ---------- show ----------

    public function test_admin_can_view_own_member(): void
    {
        Sanctum::actingAs($this->adminA);

        $this->getJson('/api/v1/members/'.$this->memberA1->id)
            ->assertOk()
            ->assertJsonPath('data.id', $this->memberA1->id);
    }

    public function test_admin_gets_404_for_another_admins_member(): void
    {
        Sanctum::actingAs($this->adminA);
        $url = '/api/v1/members/'.$this->memberB1->id;

        $this->getJson($url)->assertNotFound()->assertJsonPath('message', 'Not found.');
        $this->putJson($url, ['name' => 'Hacked'])->assertNotFound();
        $this->deleteJson($url)->assertNotFound();

        // The data of the other admin is untouched.
        $this->assertDatabaseHas('users', [
            'id' => $this->memberB1->id,
            'name' => $this->memberB1->name,
        ]);
    }

    public function test_members_api_never_returns_admins(): void
    {
        Sanctum::actingAs($this->adminA);

        $this->getJson('/api/v1/members/'.$this->adminA->id)->assertNotFound();
        $this->getJson('/api/v1/members/'.$this->adminB->id)->assertNotFound();
    }

    public function test_non_numeric_id_gives_404(): void
    {
        Sanctum::actingAs($this->adminA);

        $this->getJson('/api/v1/members/abc')->assertNotFound();
    }

    // ---------- update ----------

    public function test_admin_can_update_a_member_without_changing_the_password(): void
    {
        Sanctum::actingAs($this->adminA);
        $oldHash = $this->memberA1->password;

        $this->putJson('/api/v1/members/'.$this->memberA1->id, ['name' => 'New Name'])
            ->assertOk()
            ->assertJsonPath('data.name', 'New Name');

        $fresh = $this->memberA1->fresh();
        $this->assertSame('New Name', $fresh->name);
        $this->assertSame($oldHash, $fresh->password);
    }

    public function test_changing_password_hashes_it_and_revokes_tokens(): void
    {
        $this->memberA1->createToken('old');
        Sanctum::actingAs($this->adminA);

        $this->putJson('/api/v1/members/'.$this->memberA1->id, ['password' => 'new-password-123'])
            ->assertOk();

        $this->assertDatabaseCount('personal_access_tokens', 0);
        $this->assertTrue(Hash::check('new-password-123', $this->memberA1->fresh()->password));
    }

    public function test_update_email_rules(): void
    {
        Sanctum::actingAs($this->adminA);
        $url = '/api/v1/members/'.$this->memberA1->id;

        // Keeping the same email is fine.
        $this->putJson($url, ['email' => $this->memberA1->email])->assertOk();

        // The email of another user is not.
        $this->putJson($url, ['email' => $this->memberA2->email])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('email');
    }

    public function test_update_ignores_role_and_admin_id(): void
    {
        Sanctum::actingAs($this->adminA);

        $this->putJson('/api/v1/members/'.$this->memberA1->id, [
            'name' => 'Same Person',
            'role' => 'admin',
            'admin_id' => $this->adminB->id,
        ])->assertOk();

        $this->assertDatabaseHas('users', [
            'id' => $this->memberA1->id,
            'role' => 'member',
            'admin_id' => $this->adminA->id,
        ]);
    }

    // ---------- delete ----------

    public function test_admin_can_delete_a_member_with_tasks_and_tokens(): void
    {
        $task = Task::factory()->forMember($this->memberA1)->create();
        $this->memberA1->createToken('old');
        Sanctum::actingAs($this->adminA);

        $this->deleteJson('/api/v1/members/'.$this->memberA1->id)->assertNoContent();

        $this->assertDatabaseMissing('users', ['id' => $this->memberA1->id]);
        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }
}
