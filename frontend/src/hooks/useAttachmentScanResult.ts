// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { useEffect, useState } from 'react';
import { get } from '../api';

export const useAttachmentScanResult = (initialScanResult: string, key: string) => {
  const [scanResult, setScanResult] = useState('');
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const pollScanResult = async (): Promise<void> => {
      if (initialScanResult === 'THREATS_FOUND' || initialScanResult === 'NO_THREATS_FOUND') {
        setScanResult(initialScanResult);
        return;
      }

      try {
        if (attempts <= 10) {
          if (scanResult === 'PENDING') {
            const response = await get<string>(`/files/scan-result/${key}`);

            if (response !== 'PENDING') {
              setScanResult(response);
              return;
            }

            setAttempts((prev) => prev + 1);
            timeout = setTimeout(pollScanResult, 2000);
          }
        }
      } catch (error) {
        setScanResult('PENDING');
      }
    };

    pollScanResult();

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [initialScanResult, key, scanResult, attempts]);

  return { scanResult };
};
