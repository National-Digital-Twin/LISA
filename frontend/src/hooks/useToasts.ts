// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

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
