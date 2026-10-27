import 'server-only';
import { getToken } from './session';

const API_URL = process.env.API_URL;

/** An error answer from Laravel (or a network problem when status is 0). */
export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

type Options = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  /** false = do not send the token (for login and register). */
  auth?: boolean;
};

/**
 * The ONE function that talks to Laravel.
 * It adds the base URL, the token, and handles errors in one place.
 */
export async function apiFetch<T>(path: string, options: Options = {}): Promise<T> {
  if (!API_URL) {
    throw new Error('API_URL is not set. Add it to frontend/.env.local and restart npm run dev.');
  }

  const { method = 'GET', body, auth = true } = options; // this line

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  if (auth) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/v1${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: 'no-store', // never keep old data
    });
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Please try again.');
  }

  if (response.status === 204) return undefined as T; // "no content"

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, json?.message ?? 'Something went wrong.', json?.errors);
  }

  return json as T;
}
