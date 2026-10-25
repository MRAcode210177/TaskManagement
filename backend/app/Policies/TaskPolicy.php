<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;
use Illuminate\Auth\Access\Response;

/**
 * Rules for tasks.
 * First: can you even see this task? If not => 404.
 * Then: is your role allowed to do this action? If not => 403.
 */
class TaskPolicy
{
    /** Both roles can list tasks. The list is limited by the visibleTo scope. */
    public function viewAny(User $user): Response
    {
        return Response::allow();
    }

    public function view(User $user, Task $task): Response
    {
        return $this->canSee($user, $task)
            ? Response::allow()
            : Response::denyAsNotFound();
    }

    public function create(User $user): Response
    {
        return $user->isAdmin()
            ? Response::allow()
            : Response::deny('Only admins can create tasks.');
    }

    public function update(User $user, Task $task): Response
    {
        return $this->adminOnTask($user, $task);
    }

    public function delete(User $user, Task $task): Response
    {
        return $this->adminOnTask($user, $task);
    }

    /** The owner admin and the assigned member can change the status. */
    public function updateStatus(User $user, Task $task): Response
    {
        return $this->view($user, $task);
    }

    private function adminOnTask(User $user, Task $task): Response
    {
        if (! $this->canSee($user, $task)) {
            return Response::denyAsNotFound(); // 404
        }

        return $user->isAdmin()
            ? Response::allow()
            : Response::deny('Only admins can change or delete tasks.'); // 403
    }

    private function canSee(User $user, Task $task): bool
    {
        return $user->isAdmin()
            ? (int) $task->admin_id === (int) $user->id
            : (int) $task->assigned_to === (int) $user->id;
    }
}
