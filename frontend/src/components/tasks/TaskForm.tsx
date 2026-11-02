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
  members: User[];
  task?: Task;
  submitLabel: string;
};

export function TaskForm({ action, members, task, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const errors = state.fieldErrors;
  const values = state.values;

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800/90 dark:bg-slate-900/80">
      <form action={formAction} className="space-y-5" noValidate>
        <FormError message={state.error} />

        <Input
          label="Task Title"
          name="title"
          placeholder="e.g. Procure printer cartridges, paper reams, and markers"
          defaultValue={values?.title ?? task?.title}
          error={errors?.title?.[0]}
          required
        />

        <Textarea
          label="Task Description"
          name="description"
          placeholder="Detailed expectations, deliverables, references or instructions..."
          rows={4}
          defaultValue={values?.description ?? task?.description ?? ''}
          error={errors?.description?.[0]}
          hint="Provide clear guidance for the assigned member"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Assigned Member"
            name="assigned_to"
            defaultValue={values?.assigned_to ?? String(task?.assigned_to ?? '')}
            error={errors?.assigned_to?.[0]}
            required
          >
            <option value="">Select team member</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} ({member.email})
              </option>
            ))}
          </Select>

          <Input
            label="Target Due Date"
            name="due_date"
            type="date"
            defaultValue={values?.due_date ?? task?.due_date ?? ''}
            error={errors?.due_date?.[0]}
            hint="Deadlines are highlighted if overdue"
          />
        </div>

        <div className="flex items-center gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
          <Button type="submit" disabled={pending} variant="primary">
            {pending ? 'Saving...' : submitLabel}
          </Button>
          <LinkButton href="/admin/tasks" variant="secondary">
            Cancel
          </LinkButton>
        </div>
      </form>
    </div>
  );
}
