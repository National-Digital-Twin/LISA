import { PropsWithChildren, createContext, useCallback, useMemo, useState } from 'react';

import { ToastContextType, ToastEntry } from '../utils/types';

export const ToastContext = createContext({});

export default function ToastProvider({ children }: Readonly<PropsWithChildren>) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const postToast = useCallback((toast: ToastEntry) => {
    setToasts((prev) => {
      if (prev.find((t) => t.id === toast.id)) {
        return prev;
      }
      return [...prev, toast];
    });
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value: ToastContextType = useMemo(() => ({
    postToast,
    removeToast,
    toasts
  }), [postToast, removeToast, toasts]);

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}
