import { dataURLtoFile } from '../dataUrlToFile';
// Helper to read file content using FileReader
function readFileText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
}

describe('dataURLtoFile', () => {
  it('should convert a text data URL to a File with correct content and MIME type', async () => {
    const text = 'Hello, World!';
    const base64 = btoa(text);
    const dataurl = `data:text/plain;base64,${base64}`;
    const filename = 'hello.txt';

    const file = dataURLtoFile(dataurl, filename);
    expect(file).toBeInstanceOf(File);
    expect(file.name).toBe(filename);
    expect(file.type).toBe('text/plain');

    // Use our helper function instead of file.text()
    const fileText = await readFileText(file);
    expect(fileText).toBe(text);
  });

  it('should convert an image data URL to a File with correct MIME type', async () => {
    const dataurl =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+8AfQAAAAASUVORK5CYII=';
    const filename = 'pixel.png';

    const file = dataURLtoFile(dataurl, filename);
    expect(file).toBeInstanceOf(File);
    expect(file.name).toBe(filename);
    expect(file.type).toBe('image/png');
    expect(file.size).toBeGreaterThan(0);
  });

  it('should not throw and create a File even if the data URL is invalid', () => {
    const dataurl = 'invalidDataURL';
    const filename = 'invalid.txt';

    expect(() => {
      dataURLtoFile(dataurl, filename);
    }).not.toThrow();

    const file = dataURLtoFile(dataurl, filename);
    expect(file.name).toBe(filename);
  });
});
