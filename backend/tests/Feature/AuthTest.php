<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    private function validRegisterData(array $override = []): array
    {
        return array_merge([
            'name' => 'Admin One',
            'email' => 'admin1@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ], $override);
    }

    public function test_guest_can_register_as_admin(): void
    {
        $response = $this->postJson('/api/v1/auth/register', $this->validRegisterData());

        $response->assertCreated()
            ->assertJsonPath('data.role', 'admin')
            ->assertJsonStructure(['data' => ['id', 'name', 'email', 'role'], 'token']);

        $this->assertDatabaseHas('users', [
            'email' => 'admin1@example.com',
            'role' => 'admin',
            'admin_id' => null,
        ]);
    }

    public function test_register_ignores_role_and_admin_id_sent_by_client(): void
    {
        $this->postJson('/api/v1/auth/register', $this->validRegisterData([
            'role' => 'member',
            'admin_id' => 999,
        ]))->assertCreated();

        $this->assertDatabaseHas('users', [
            'email' => 'admin1@example.com',
            'role' => 'admin',
            'admin_id' => null,
        ]);
    }

    public function test_register_fails_with_bad_data(): void
    {
        User::factory()->create(['email' => 'taken@example.com']);

        $this->postJson('/api/v1/auth/register', $this->validRegisterData([
            'email' => 'taken@example.com',
            'password_confirmation' => 'different',
        ]))->assertUnprocessable()
            ->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_user_can_login_with_correct_password(): void
    {
        User::factory()->create([
            'email' => 'a@example.com',
            'password' => 'password123',
        ]);

        $this->postJson('/api/v1/auth/login', [
            'email' => 'a@example.com',
            'password' => 'password123',
        ])->assertOk()
            ->assertJsonPath('data.role', 'admin')
            ->assertJsonStructure(['token']);
    }

    public function test_login_fails_with_wrong_password(): void
    {
        User::factory()->create(['email' => 'a@example.com']);

        $this->postJson('/api/v1/auth/login', [
            'email' => 'a@example.com',
            'password' => 'wrong-password',
        ])->assertUnauthorized()
            ->assertJsonPath('message', 'Invalid credentials.');
    }

    public function test_login_requires_email_and_password(): void
    {
        $this->postJson('/api/v1/auth/login', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_login_is_rate_limited_after_five_tries(): void
    {
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/v1/auth/login', [
                'email' => 'a@example.com',
                'password' => 'wrong-password',
            ])->assertUnauthorized();
        }

        $this->postJson('/api/v1/auth/login', [
            'email' => 'a@example.com',
            'password' => 'wrong-password',
        ])->assertStatus(429);
    }

    public function test_me_requires_a_token(): void
    {
        $this->getJson('/api/v1/auth/me')->assertUnauthorized();
    }

    public function test_me_returns_the_logged_in_user(): void
    {
        $admin = User::factory()->create();
        $member = User::factory()->memberOf($admin)->create();

        $token = $member->createToken('test')->plainTextToken;

        $this->withToken($token)->getJson('/api/v1/auth/me')
            ->assertOk()
            ->assertJsonPath('data.id', $member->id)
            ->assertJsonPath('data.role', 'member')
            ->assertJsonPath('data.admin_id', $admin->id);
    }

    public function test_logout_deletes_the_token(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $this->withToken($token)->postJson('/api/v1/auth/logout')->assertNoContent();

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }
}
