import { z } from 'zod';

const email = z.string().trim().min(1, 'Email is required.').email('Enter a valid email.');

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required.'),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required.').max(255, 'Name is too long.'),
    email,
    password: z.string().min(8, 'Use at least 8 characters.'),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match.',
    path: ['password_confirmation'],
  });

/** Read one text field from a form. A missing field becomes an empty text. */
export function formText(formData: FormData, name: string): string {
  return String(formData.get(name) ?? '');
}

/** Turn a Zod error into { field: [messages] }. */
export function fieldErrorsFrom(error: z.ZodError): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    (result[key] ??= []).push(issue.message);
  }
  return result;
}

// Member management schemas
const memberName = z.string().trim().min(1, 'Name is required.').max(255, 'Name is too long.');
const memberPassword = z.string().min(8, 'Use at least 8 characters.');

export const memberCreateSchema = z.object({
  name: memberName,
  email,
  password: memberPassword,
});

// On edit, the password is optional: empty means "keep the old one".
export const memberUpdateSchema = z.object({
  name: memberName,
  email,
  password: memberPassword.optional(),
});

// Task management schemas
export const taskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required.').max(255, 'Title is too long.'),
  description: z.string().trim().max(5000, 'Description is too long.'),
  // The form sends the member id as text, like "6".
  assigned_to: z.string().regex(/^\d+$/, 'Choose a member.'),
  // Empty is allowed. Otherwise the format is 2026-11-30.
  due_date: z
    .string()
    .refine((value) => value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value), 'Use a valid date.'),
});
