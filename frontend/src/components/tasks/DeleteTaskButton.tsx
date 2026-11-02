'use client';

import { deleteTaskAction } from '@/actions/tasks';
import { Button } from '@/components/ui/Button';

type Props = { id: number; title: string };

export function DeleteTaskButton({ id, title }: Props) {
  return (
    <form
      action={deleteTaskAction.bind(null, id)}
      onSubmit={(event) => {
        if (!window.confirm(`Delete the task "${title}"?`)) {
          event.preventDefault();
        }
      }}
    >
      <Button type="submit" variant="danger" size="sm">
        Delete
      </Button>
    </form>
  );
}
