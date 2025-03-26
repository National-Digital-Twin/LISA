import { useState, useEffect } from 'react';

interface NavigatorWithUAData extends Navigator {
  userAgentData?: {
    getHighEntropyValues: (hints: string[]) => Promise<{ mobile: boolean }>;
  };
}

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof navigator !== 'undefined') {
      return /Mobi|Android/i.test(navigator.userAgent);
    }
    return false;
  });

  useEffect(() => {
    const nav = navigator as NavigatorWithUAData;
    if (nav.userAgentData) {
      nav.userAgentData
        .getHighEntropyValues(['mobile'])
        .then((ua) => setIsMobile(ua.mobile))
        .catch(() => {
          setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
        });
    }
  }, []);

  return isMobile;
}

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
