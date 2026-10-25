<?php

namespace Database\Seeders;

use App\Enums\TaskStatus;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // SAFETY: these accounts have a known password ("password").
        // They must never be created on a live server.
        if (app()->environment('production')) {
            $this->command?->warn('DatabaseSeeder skipped: it must not run in production.');

            return;
        }

        // ---------- Admin 1: Alice (3 members, 7 tasks) ----------
        $alice = $this->admin('Alice Admin', 'alice@example.com');
        $ben = $this->member($alice, 'Ben Member', 'ben@example.com');
        $carla = $this->member($alice, 'Carla Member', 'carla@example.com');
        $dev = $this->member($alice, 'Dev Member', 'dev@example.com');

        $this->task($ben, 'Prepare weekly report', TaskStatus::Todo, 3);
        $this->task($ben, 'Update customer list', TaskStatus::InProgress, 5);
        $this->task($ben, 'Send invoices', TaskStatus::Done, 1);
        $this->task($carla, 'Design landing page', TaskStatus::InProgress, 7);
        $this->task($carla, 'Review pull requests', TaskStatus::Todo, 2);
        $this->task($dev, 'Fix login bug', TaskStatus::Todo, 1);
        $this->task($dev, 'Write API docs', TaskStatus::Done, 4);

        // ---------- Admin 2: Brian (2 members, 4 tasks) ----------
        $brian = $this->admin('Brian Admin', 'brian@example.com');
        $emma = $this->member($brian, 'Emma Member', 'emma@example.com');
        $farid = $this->member($brian, 'Farid Member', 'farid@example.com');

        $this->task($emma, 'Plan team meeting', TaskStatus::Todo, 4);
        $this->task($emma, 'Book travel', TaskStatus::InProgress, 6);
        $this->task($farid, 'Prepare budget', TaskStatus::Todo, 8);
        $this->task($farid, 'Order office supplies', TaskStatus::Done, 2);

        $this->command?->info('Demo accounts. The password of all of them is: password');
        $this->command?->line('  Admins : alice@example.com, brian@example.com');
        $this->command?->line('  Members: ben@, carla@, dev@ (Alice) and emma@, farid@ (Brian) + @example.com');
    }

    private function admin(string $name, string $email): User
    {
        // The factory makes an admin by default, with the password "password".
        return User::factory()->create(['name' => $name, 'email' => $email]);
    }

    private function member(User $admin, string $name, string $email): User
    {
        return User::factory()->memberOf($admin)->create(['name' => $name, 'email' => $email]);
    }

    private function task(User $member, string $title, TaskStatus $status, int $dueInDays): void
    {
        // forMember() copies the member's admin_id, so the owner is always correct.
        Task::factory()->forMember($member)->create([
            'title' => $title,
            'status' => $status,
            'due_date' => now()->addDays($dueInDays)->toDateString(),
        ]);
    }
}
