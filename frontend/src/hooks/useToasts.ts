import { useContext } from 'react';

import { ToastContext } from '../context/ToastContext';
import { ToastContextType } from '../utils/types';

export function useToast() {
  const { postToast } = useContext(ToastContext) as ToastContextType;
  return postToast;
}

export function useToastEntries() {
  const { toasts, removeToast } = useContext(ToastContext) as ToastContextType;
  return { toasts, removeToast };
}
