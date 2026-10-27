'use client';

import { useActionState } from 'react';
import { loginAction } from '../../actions/auth';
import { Button } from '../../components/ui/Button';
import { FormError } from '../../components/ui/FormError';
import { Input } from '../../components/ui/Input';
import type { FormState } from '../../lib/types';

const initialState: FormState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <FormError message={state.error} />
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={state.values?.email}
        error={state.fieldErrors?.email?.[0]}
        required
      />
      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        error={state.fieldErrors?.password?.[0]}
        required
      />
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
}
