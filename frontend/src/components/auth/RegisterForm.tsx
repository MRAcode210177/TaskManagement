'use client';

import { useActionState } from 'react';
import { registerAction } from '../../actions/auth';
import { Button } from '../../components/ui/Button';
import { FormError } from '../../components/ui/FormError';
import { Input } from '../../components/ui/Input';
import type { FormState } from '../../lib/types';

const initialState: FormState = {};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);
  const errors = state.fieldErrors;

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <FormError message={state.error} />
      <Input
        label="Admin Name"
        name="name"
        placeholder="e.g. Brian Admin"
        autoComplete="name"
        defaultValue={state.values?.name}
        error={errors?.name?.[0]}
        required
      />
      <Input
        label="Work Email"
        name="email"
        type="email"
        placeholder="brian.admin@company.internal"
        autoComplete="email"
        defaultValue={state.values?.email}
        error={errors?.email?.[0]}
        required
      />
      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={errors?.password?.[0]}
        required
      />
      <Input
        label="Confirm Password"
        name="password_confirmation"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={errors?.password_confirmation?.[0]}
        required
      />
      <Button type="submit" disabled={pending} className="w-full mt-2" size="lg">
        {pending ? 'Provisioning account...' : 'Create Admin Workspace'}
      </Button>
    </form>
  );
}
