export function generateFieldKey(label: string): string {
  return `f${  label
    .toLowerCase()
    .replace(/\s+/g, '_')        // Replace spaces with underscore
    .replace(/[^a-z0-9_]/g, '')}`; // Remove all non-alphanumerics
};
  