// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

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
