// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

export function timestamp(date?: Date): string {
  const d = date ?? new Date();
  return d.toISOString().substring(0, 19).replace('T', ' at ');
}
