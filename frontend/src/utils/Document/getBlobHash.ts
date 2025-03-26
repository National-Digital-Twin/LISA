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

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
