/**
 * Authorization helper for Event Hosting
 * Only specified Student Forge administrative emails are allowed to host/create events.
 */

export const AUTHORIZED_HOST_EMAILS = [
  'rishirohank.studentforge@gmail.com',
  'rishirohank.studentoforge@gmail.com',
  'events.studentforge@gmail.com',
  'rishirohankalapala@gmail.com'
];

export function isAuthorizedHost(email?: string | null): boolean {
  if (!email || typeof email !== 'string') return false;
  const clean = email.trim().toLowerCase();
  return AUTHORIZED_HOST_EMAILS.some(e => e.toLowerCase() === clean);
}
