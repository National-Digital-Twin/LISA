import { useToastEntries } from '../../hooks';
import Toast from './Toast';

export default function Toasts() {
  const { toasts, removeToast } = useToastEntries();
  return (
    <div className="toasts-container">
      {toasts.slice(0, 4).map((t) => (
        <Toast key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>
  );
}

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

