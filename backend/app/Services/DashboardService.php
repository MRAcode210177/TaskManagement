<?php

namespace App\Services;

use App\Enums\TaskStatus;
use App\Models\Task;
use App\Models\User;

class DashboardService
{
    /**
     * The counts for ONE admin. Only the admin's own data is counted.
     *
     * @return array{members_count: int, tasks_total: int, tasks_by_status: array<string, int>}
     */
    public function summaryFor(User $admin): array
    {
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

        return [
            'members_count' => User::membersOf($admin)->count(),
            'tasks_total' => array_sum($byStatus),
            'tasks_by_status' => $byStatus,
        ];
    }
}
