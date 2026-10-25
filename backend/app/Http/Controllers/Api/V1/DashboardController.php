<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\TaskStatus;
use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /** GET /dashboard (admin only). Counts for the logged-in admin's own data. */
    public function __invoke(Request $request): JsonResponse
    {
        $admin = $request->user();

        // One query: how many tasks for each status.
        $counts = Task::visibleTo($admin)
            ->toBase()
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $byStatus = [];
        foreach (TaskStatus::cases() as $status) {
            $byStatus[$status->value] = (int) ($counts[$status->value] ?? 0);
        }

        return response()->json([
            'data' => [
                'members_count' => User::membersOf($admin)->count(),
                'tasks_total' => array_sum($byStatus),
                'tasks_by_status' => $byStatus,
            ],
        ]);
    }
}
