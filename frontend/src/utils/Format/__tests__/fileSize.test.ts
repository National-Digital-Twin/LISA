import { fileSize } from '../fileSize';

describe('fileSize', () => {
  it('should return "0 Kb" for size 0', () => {
    expect(fileSize(0)).toBe('0 Kb');
  });

  it('should return size in Kb for sizes less than 1024Kb (1Mb)', () => {
    const sizeInBytes = 512;
    // Expected: 512 / 1024 = 0.50 Kb
    expect(fileSize(sizeInBytes)).toBe('0.50 Kb');

    // For 1023 bytes:
    expect(fileSize(1023)).toBe(`${(1023 / 1024).toFixed(2)} Kb`);
  });

  it('should correctly format size exactly as 1 Kb when size is 1024 bytes', () => {
    expect(fileSize(1024)).toBe('1.00 Kb');
  });

  it('should return size in Mb for sizes greater than 1023 Kb', () => {
    // For example, for size = 1024 * 1024 bytes:
    const oneMbInBytes = 1024 * 1024;
    // (1024*1024 / 1024) = 1024 Kb, then 1024 / 1024 = 1 Mb
    expect(fileSize(oneMbInBytes)).toBe('1.00 Mb');

    const fiveMbInBytes = 5 * 1024 * 1024;
    // (fiveMbInBytes / 1024) = 5 * 1024 = 5120 Kb
    // then 5120 / 1024 = 5 Mb
    expect(fileSize(fiveMbInBytes)).toBe('5.00 Mb');
  });
});
