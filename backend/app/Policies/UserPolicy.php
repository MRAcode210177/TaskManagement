<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

/**
 * Rules for managing MEMBERS. Only admins can do this.
 * Rule: wrong role = 403. Not your member = 404.
 */
class UserPolicy
{
    public function viewAny(User $actor): Response
    {
        return $this->adminOnly($actor);
    }

    public function create(User $actor): Response
    {
        return $this->adminOnly($actor);
    }

    public function view(User $actor, User $member): Response
    {
        return $this->manage($actor, $member);
    }

    public function update(User $actor, User $member): Response
    {
        return $this->manage($actor, $member);
    }

    public function delete(User $actor, User $member): Response
    {
        return $this->manage($actor, $member);
    }

    private function adminOnly(User $actor): Response
    {
        return $actor->isAdmin()
            ? Response::allow()
            : Response::deny('Only admins can manage members.');
    }

    private function manage(User $actor, User $target): Response
    {
        if (! $actor->isAdmin()) {
            return Response::deny('Only admins can manage members.'); // 403
        }

        if (! $this->ownsMember($actor, $target)) {
            return Response::denyAsNotFound(); // 404
        }

        return Response::allow();
    }

    private function ownsMember(User $admin, User $target): bool
    {
        return $target->isMember() && (int) $target->admin_id === (int) $admin->id;
    }
}
