'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/Button';
import { FormError } from '@/components/ui/FormError';
import { Input } from '@/components/ui/Input';
import { LinkButton } from '@/components/ui/LinkButton';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import type { FormState, Task, User } from '@/lib/types';

type Props = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  members: User[]; // the people the task can be given to
  task?: Task; // given on the edit page
  submitLabel: string;
};

/** One form for "add task" and "edit task". */
export function TaskForm({ action, members, task, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const errors = state.fieldErrors;
  const values = state.values;

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <FormError message={state.error} />
      <Input
        label="Title"
        name="title"
        defaultValue={values?.title ?? task?.title}
        error={errors?.title?.[0]}
        required
      />
      <Textarea
        label="Description (optional)"
        name="description"
        rows={4}
        defaultValue={values?.description ?? task?.description ?? ''}
        error={errors?.description?.[0]}
      />
      <Select
        label="Assign to"
        name="assigned_to"
        defaultValue={values?.assigned_to ?? String(task?.assigned_to ?? '')}
        error={errors?.assigned_to?.[0]}
        required
      >
        <option value="">Choose a member</option>
        {members.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name}
          </option>
        ))}
      </Select>
      <Input
        label="Due date (optional)"
        name="due_date"
        type="date"
        defaultValue={values?.due_date ?? task?.due_date ?? ''}
        error={errors?.due_date?.[0]}
      />
      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving...' : submitLabel}
        </Button>
        <LinkButton href="/admin/tasks" variant="secondary">
          Cancel
        </LinkButton>
      </div>
    </form>
  );
}
