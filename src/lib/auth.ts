import crypto from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'lumina_admin_session';
const SECRET = process.env.SESSION_SECRET || 'lumina-session-secret-key-super-secure-token-2026';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'lumina-secret-2026';

export function signToken(data: string): string {
  const hmac = crypto.createHmac('sha256', SECRET);
  hmac.update(data);
  const signature = hmac.digest('hex');
  return `${data}.${signature}`;
}

export function verifyToken(token: string): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [data, signature] = parts;
  const expectedHmac = crypto.createHmac('sha256', SECRET);
  expectedHmac.update(data);
  const expectedSignature = expectedHmac.digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

export function verifyPassword(password: string): boolean {
  if (!password) return false;
  return password === ADMIN_PASSWORD;
}

export async function createAdminSession() {
  const token = signToken(`admin-${Date.now()}`);
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  });
}

export async function clearAdminSession() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);
  if (!sessionCookie || !sessionCookie.value) return false;
  return verifyToken(sessionCookie.value);
}
