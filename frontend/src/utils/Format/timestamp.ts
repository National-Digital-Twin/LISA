export function timestamp(date?: Date): string {
  const d = date ?? new Date();
  return d.toISOString().substring(0, 19).replace('T', ' at ');
}
