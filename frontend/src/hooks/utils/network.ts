export function isOnline() {
  return typeof navigator !== 'undefined' && navigator.onLine;
}