import 'server-only';
import { cookies } from 'next/headers';
import { TOKEN_COOKIE } from './constants';

const SEVEN_DAYS = 60 * 60 * 24 * 7; // same as the token life in Laravel

export async function getToken(): Promise<string | undefined> {
  return (await cookies()).get(TOKEN_COOKIE)?.value;
}

export async function setToken(token: string): Promise<void> {
  (await cookies()).set(TOKEN_COOKIE, token, {
    httpOnly: true, // JavaScript in the browser cannot read it
    secure: process.env.NODE_ENV === 'production', // only over HTTPS on a live site
    sameSite: 'lax', // not sent on cross-site POST requests (CSRF protection)
    path: '/',
    maxAge: SEVEN_DAYS,
  });
}

export async function clearToken(): Promise<void> {
  (await cookies()).delete(TOKEN_COOKIE);
}
