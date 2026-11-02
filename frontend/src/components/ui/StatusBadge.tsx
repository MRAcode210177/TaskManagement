import { Badge, type BadgeVariant } from './Badge';
import type { TaskStatus } from '@/lib/types';

type StatusBadgeProps = {
  status: TaskStatus;
  isOverdue?: boolean;
  size?: 'sm' | 'md';
  className?: string;
};

export function StatusBadge({
  status,
  isOverdue = false,
  size = 'md',
  className = '',
}: StatusBadgeProps) {
  if (isOverdue && status !== 'done') {
    return (
      <Badge variant="danger" size={size} dot className={className}>
        Overdue
      </Badge>
    );
  }

  const config: Record<TaskStatus, { label: string; variant: BadgeVariant }> = {
    todo: { label: 'To Do', variant: 'warning' },
    in_progress: { label: 'In Progress', variant: 'info' },
    done: { label: 'Done', variant: 'success' },
  };

  const current = config[status] ?? { label: status, variant: 'default' };

  return (
    <Badge variant={current.variant} size={size} dot className={className}>
      {current.label}
    </Badge>
  );
}
