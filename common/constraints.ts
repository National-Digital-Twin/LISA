export function nonFuture(dateString: string) {
  if (dateString) {
    const date = Date.parse(dateString);
    if (!Number.isNaN(date)) {
      // We have an actual date. Make sure it's not in the future.
      if (date > Date.now()) {
        return 'Cannot be in the future';
      }
    }
  }
  return true;
}
