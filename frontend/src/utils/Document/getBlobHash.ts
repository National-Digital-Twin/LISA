// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

export function getBlobHash(blob: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.addEventListener('error', () => {
      reject(fileReader.error ?? new Error('Failed to read file'));
    });

    fileReader.addEventListener('load', () => {
      try {
        const {result} = fileReader;

        if (!(result instanceof ArrayBuffer)) {
          reject(new TypeError('Expected ArrayBuffer from FileReader'));
          return;
        }

        const view = new Uint8Array(result);

        crypto.subtle
          .digest('SHA-256', view)
          .then((hashBuffer) => {
            const bytes = new Uint8Array(hashBuffer);
            const base64 = btoa(String.fromCharCode(...bytes));
            resolve(base64);
          })
          .catch((err) => {
            reject(err);
          });
      } catch (err) {
        reject(err);
      }
    });

    fileReader.readAsArrayBuffer(blob);
  });
}
