export function getBlobHash(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.addEventListener('error', () => {
      reject(new Error(fileReader.error?.message));
    });

    fileReader.addEventListener('load', async () => {
      const buffer = await crypto.subtle.digest('SHA-256', fileReader.result as ArrayBuffer);
      const numberArray = Array.from(new Uint8Array(buffer));
      resolve(btoa(String.fromCharCode.apply(null, numberArray)));
    });

    fileReader.readAsArrayBuffer(blob);
  });
}
