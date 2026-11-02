'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/Button';
import { FormError } from '@/components/ui/FormError';
import { Input } from '@/components/ui/Input';
import { LinkButton } from '@/components/ui/LinkButton';
import type { FormState, User } from '@/lib/types';

type Props = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  member?: User;
  submitLabel: string;
};

export function MemberForm({ action, member, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const errors = state.fieldErrors;
  const isEdit = member !== undefined;

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800/90 dark:bg-slate-900/80">
      <form action={formAction} className="space-y-5" noValidate>
        <FormError message={state.error} />

        <Input
          label="Full Name"
          name="name"
          placeholder="e.g. Emma Watson"
          autoComplete="off"
          defaultValue={state.values?.name ?? member?.name}
          error={errors?.name?.[0]}
          required
        />

        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="e.g. emma@example.com"
          autoComplete="off"
          defaultValue={state.values?.email ?? member?.email}
          error={errors?.email?.[0]}
          required
        />

        <Input
          label={isEdit ? 'New Password' : 'Password'}
          name="password"
          type="password"
          placeholder={isEdit ? 'Leave blank to keep unchanged' : '••••••••'}
          hint={
            isEdit
              ? 'Leave empty to preserve existing password'
              : 'At least 8 characters recommended'
          }
          autoComplete="new-password"
          error={errors?.password?.[0]}
          required={!isEdit}
        />

        <div className="flex items-center gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
          <Button type="submit" disabled={pending} variant="primary">
            {pending ? 'Saving...' : submitLabel}
          </Button>
          <LinkButton href="/admin/members" variant="secondary">
            Cancel
          </LinkButton>
        </div>
      </form>
    </div>
  );
}
