// eslint-disable-next-line @typescript-eslint/ban-types
export function debounce(fn: Function, delay: number = 250) {
  // eslint-disable-next-line no-undef
  let timeout: NodeJS.Timeout;

  return (...args: unknown[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
