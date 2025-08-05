import crypto from 'crypto';

import { getBlobHash } from '../getBlobHash';

describe('getBlobHash', () => {
  class FileReaderMock {
    DONE = FileReader.DONE;

    EMPTY = FileReader.EMPTY;

    LOADING = FileReader.LOADING;

    readyState: 0 | 1 | 2 = 0;

    error: FileReader['error'] = null;

    result: FileReader['result'] = null;

    abort = jest.fn();

    addEventListener = jest.fn();

    dispatchEvent = jest.fn();

    onabort = jest.fn();

    onerror = jest.fn();

    onload = jest.fn();

    onloadend = jest.fn();

    onloadprogress = jest.fn();

    onloadstart = jest.fn();

    onprogress = jest.fn();

    readAsArrayBuffer = jest.fn();

    readAsBinaryString = jest.fn();

    readAsDataURL = jest.fn();

    readAsText = jest.fn();

    removeEventListener = jest.fn();
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the correct hash for a valid blob', async () => {
    // Create a file with known content; here we use a single zero byte.
    const contentArray = new Uint8Array([0]);
    const file = new File([contentArray], 'file.jpg');

    // Compute expected hash using Node's crypto.
    const expectedHash = crypto
      .createHash('sha256')
      .update(Buffer.from(contentArray))
      .digest('base64');

    const fileReader = new FileReaderMock();

    // Instead of calling file.arrayBuffer(), use the known ArrayBuffer.
    fileReader.result = contentArray.buffer;

    // Simulate the 'load' event: when addEventListener('load', callback) is called, immediately invoke the callback.
    fileReader.addEventListener.mockImplementation((event, fn) => {
      if (event === 'load') {
        fn();
      }
    });

    // When getBlobHash creates a new FileReader, return our mock.
    jest.spyOn(window, 'FileReader').mockImplementation(() => fileReader);

    const hash = await getBlobHash(file);

    expect(hash).toBe(expectedHash);
    // Verify that readAsArrayBuffer was called with the file.
    expect(fileReader.readAsArrayBuffer).toHaveBeenCalledTimes(1);
    expect(fileReader.readAsArrayBuffer).toHaveBeenCalledWith(file);
  });
});
