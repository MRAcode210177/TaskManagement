<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class RoleMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Two small test-only routes, so we can test the middleware.
        Route::middleware(['auth:sanctum', 'role:admin'])
            ->get('/api/v1/_test/admin-only', fn () => response()->json(['ok' => true]));

        Route::middleware(['auth:sanctum', 'role:admin,member'])
            ->get('/api/v1/_test/any-role', fn () => response()->json(['ok' => true]));
    }

    public function test_guest_gets_401(): void
    {
        $this->getJson('/api/v1/_test/admin-only')->assertUnauthorized();
    }

    public function test_admin_can_open_admin_only_route(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->getJson('/api/v1/_test/admin-only')->assertOk();
    }

    public function test_member_gets_403_on_admin_only_route(): void
    {
        $admin = User::factory()->create();
        Sanctum::actingAs(User::factory()->memberOf($admin)->create());

        $this->getJson('/api/v1/_test/admin-only')->assertForbidden();
    }

    public function test_member_can_open_route_open_to_both_roles(): void
    {
        $admin = User::factory()->create();
        Sanctum::actingAs(User::factory()->memberOf($admin)->create());

        $this->getJson('/api/v1/_test/any-role')->assertOk();
    }
}
