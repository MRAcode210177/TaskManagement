import { Button } from '@/components/ui/Button';
import { LinkButton } from '@/components/ui/LinkButton';
import { TASK_STATUSES } from '@/lib/task-status';
import type { TaskStatus, User } from '@/lib/types';

type Props = {
  status?: TaskStatus;
  assignedTo?: number;
  members: User[];
};

const selectClass =
  'rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none';
const labelClass = 'mb-1 block text-sm font-medium text-gray-700';

/** A normal HTML form with method="get". The choices become ?status=...&assigned_to=... */
export function TaskFilters({ status, assignedTo, members }: Props) {
  return (
    <form method="get" action="/admin/tasks" className="mb-4 flex flex-wrap items-end gap-3">
      <div>
        <label htmlFor="filter-status" className={labelClass}>
          Status
        </label>
        <select
          id="filter-status"
          name="status"
          defaultValue={status ?? ''}
          className={selectClass}
        >
          <option value="">All</option>
          {TASK_STATUSES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="filter-member" className={labelClass}>
          Member
        </label>
        <select
          id="filter-member"
          name="assigned_to"
          defaultValue={assignedTo ? String(assignedTo) : ''}
          className={selectClass}
        >
          <option value="">All</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" variant="secondary">
        Filter
      </Button>
      <LinkButton href="/admin/tasks" variant="secondary">
        Clear
      </LinkButton>
    </form>
  );
}
