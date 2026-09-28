// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

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
