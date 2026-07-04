const STORAGE_KEY = 'deritz_guest_email';

export function getStoredGuestEmail(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(STORAGE_KEY);
}

export function setStoredGuestEmail(email: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, email);
}
