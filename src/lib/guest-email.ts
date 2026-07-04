import { STORAGE_KEYS } from './constants';

export function getStoredGuestEmail(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(STORAGE_KEYS.GUEST_EMAIL);
}

export function setStoredGuestEmail(email: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEYS.GUEST_EMAIL, email);
}
