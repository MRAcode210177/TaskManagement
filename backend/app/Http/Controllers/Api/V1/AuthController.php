<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /** Token lives for 7 days. */
    private const TOKEN_DAYS = 7;

    public function register(RegisterRequest $request): JsonResponse
    {
        // Only take the 3 allowed fields. Ignore anything else.
        $user = new User($request->safe()->only(['name', 'email', 'password']));

        // The server decides the role. The client cannot.
        $user->role = Role::Admin;
        $user->save();

        return response()->json([
            'data' => new UserResource($user),
            'token' => $this->newToken($user),
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->validated('email'))->first();

        if (! $user || ! Hash::check($request->validated('password'), $user->password)) {
            // One general message. We do not say which part was wrong.
            return response()->json(['message' => 'Invalid credentials.'], 401);
        }

        return response()->json([
            'data' => new UserResource($user),
            'token' => $this->newToken($user),
        ]);
    }

    public function logout(Request $request): Response
    {
        // Delete only the token used in this request.
        $request->user()->currentAccessToken()->delete();

        return response()->noContent();
    }

    public function me(Request $request): UserResource
    {
        return new UserResource($request->user());
    }

    private function newToken(User $user): string
    {
        return $user->createToken('auth', ['*'], now()->addDays(self::TOKEN_DAYS))->plainTextToken;
    }
}
