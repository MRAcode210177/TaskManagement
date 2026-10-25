<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMemberRequest;
use App\Http\Requests\UpdateMemberRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class MemberController extends Controller
{
    /** GET /members: 15 members per page. */
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', User::class);

        $members = User::membersOf($request->user())
            ->orderBy('name')
            ->orderBy('id')
            ->paginate(15);

        return UserResource::collection($members);
    }

    /** POST /members */
    public function store(StoreMemberRequest $request): JsonResponse
    {
        $this->authorize('create', User::class);

        $member = new User($request->safe()->only(['name', 'email', 'password']));

        // The SERVER sets the role and the owner. Never the client.
        $member->role = Role::Member;
        $member->admin_id = $request->user()->id;
        $member->save();

        return (new UserResource($member))->response()->setStatusCode(201);
    }

    /** GET /members/{id} */
    public function show(Request $request, int $id): UserResource
    {
        $member = $this->findOwnedMember($request, $id);
        $this->authorize('view', $member);

        return new UserResource($member);
    }

    /** PUT /members/{id} */
    public function update(UpdateMemberRequest $request, int $id): UserResource
    {
        $member = $this->findOwnedMember($request, $id);
        $this->authorize('update', $member);

        $data = $request->validated();

        // We write 2 tables (users and tokens), so we use a transaction.
        // A transaction means: both writes succeed, or none.
        DB::transaction(function () use ($member, $data) {
            $member->fill($data)->save();

            // New password = old tokens must stop working.
            if (isset($data['password'])) {
                $member->tokens()->delete();
            }
        });

        return new UserResource($member);
    }

    /** DELETE /members/{id} */
    public function destroy(Request $request, int $id): Response
    {
        $member = $this->findOwnedMember($request, $id);
        $this->authorize('delete', $member);

        DB::transaction(function () use ($member) {
            $member->tokens()->delete();
            $member->delete(); // The database also deletes the member's tasks.
        });

        return response()->noContent();
    }

    /**
     * OWNERSHIP LAYER 1: look only inside this admin's members.
     * Not found, or owned by another admin, or an admin id => 404.
     */
    private function findOwnedMember(Request $request, int $id): User
    {
        return User::membersOf($request->user())->findOrFail($id);
    }
}
