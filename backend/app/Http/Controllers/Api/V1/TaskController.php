<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\TaskStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\IndexTaskRequest;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Requests\UpdateTaskStatusRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class TaskController extends Controller
{
    /** Load the assignee with the tasks in ONE extra query (no N+1). */
    private const WITH_ASSIGNEE = 'assignee:id,name,email';

    /** GET /tasks (admin and member). The scope decides which tasks you see. */
    public function index(IndexTaskRequest $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Task::class);

        $tasks = Task::visibleTo($request->user())
            ->with(self::WITH_ASSIGNEE)
            ->when($request->validated('status'), fn ($query, $status) => $query->where('status', $status))
            ->when($request->validated('assigned_to'), fn ($query, $id) => $query->where('assigned_to', $id))
            ->latest('id')
            ->paginate(15)
            ->withQueryString();

        return TaskResource::collection($tasks);
    }

    /** POST /tasks (admin only) */
    public function store(StoreTaskRequest $request): JsonResponse
    {
        $this->authorize('create', Task::class);

        $task = new Task($request->safe()->only(['title', 'description', 'assigned_to', 'due_date']));

        // The SERVER sets the owner and the first status. Never the client.
        $task->admin_id = $request->user()->id;
        $task->status = TaskStatus::Todo;
        $task->save();

        return (new TaskResource($task->load(self::WITH_ASSIGNEE)))
            ->response()
            ->setStatusCode(201);
    }

    /** GET /tasks/{id} (admin and member) */
    public function show(Request $request, int $id): TaskResource
    {
        $task = $this->findVisibleTask($request, $id);
        $this->authorize('view', $task);

        return new TaskResource($task->load(self::WITH_ASSIGNEE));
    }

    /** PUT /tasks/{id} (admin only) */
    public function update(UpdateTaskRequest $request, int $id): TaskResource
    {
        $task = $this->findVisibleTask($request, $id);
        $this->authorize('update', $task);

        $task->fill($request->validated())->save();

        return new TaskResource($task->load(self::WITH_ASSIGNEE));
    }

    /** PATCH /tasks/{id}/status (admin and the assigned member) */
    public function updateStatus(UpdateTaskStatusRequest $request, int $id): TaskResource
    {
        $task = $this->findVisibleTask($request, $id);
        $this->authorize('updateStatus', $task);

        $task->status = TaskStatus::from($request->validated('status'));
        $task->save();

        return new TaskResource($task->load(self::WITH_ASSIGNEE));
    }

    /** DELETE /tasks/{id} (admin only) */
    public function destroy(Request $request, int $id): Response
    {
        $task = $this->findVisibleTask($request, $id);
        $this->authorize('delete', $task);

        $task->delete();

        return response()->noContent();
    }

    /**
     * OWNERSHIP LAYER 1: look only inside the tasks this user may see.
     * Admin => own tasks. Member => assigned tasks. Anything else => 404.
     */
    private function findVisibleTask(Request $request, int $id): Task
    {
        return Task::visibleTo($request->user())->findOrFail($id);
    }
}
