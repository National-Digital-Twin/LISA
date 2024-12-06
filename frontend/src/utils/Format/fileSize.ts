export function fileSize(size: number): string {
  if (size === 0) {
    return '0 Kb';
  }
  const sizeInKb = size / 1024;
  if (sizeInKb > 1024) {
    return `${(sizeInKb / 1024).toFixed(2)} Mb`;
  }
  return `${sizeInKb.toFixed(2)} Kb`;
}
