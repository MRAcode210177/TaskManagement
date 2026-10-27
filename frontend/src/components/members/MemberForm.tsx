'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/Button';
import { FormError } from '@/components/ui/FormError';
import { Input } from '@/components/ui/Input';
import { LinkButton } from '@/components/ui/LinkButton';
import type { FormState, User } from '@/lib/types';

type Props = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  member?: User; // given on the edit page
  submitLabel: string;
};

/** One form for "add" and "edit". */
export function MemberForm({ action, member, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const errors = state.fieldErrors;
  const isEdit = member !== undefined;

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <FormError message={state.error} />
      <Input
        label="Name"
        name="name"
        autoComplete="off"
        defaultValue={state.values?.name ?? member?.name}
        error={errors?.name?.[0]}
        required
      />
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="off"
        defaultValue={state.values?.email ?? member?.email}
        error={errors?.email?.[0]}
        required
      />
      <Input
        label={isEdit ? 'New password (leave empty to keep the old one)' : 'Password'}
        name="password"
        type="password"
        autoComplete="new-password"
        error={errors?.password?.[0]}
        required={!isEdit}
      />
      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving...' : submitLabel}
        </Button>
        <LinkButton href="/admin/members" variant="secondary">
          Cancel
        </LinkButton>
      </div>
    </form>
  );
}
