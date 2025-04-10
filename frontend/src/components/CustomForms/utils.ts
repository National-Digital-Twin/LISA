// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

export function generateFieldKey(label: string): string {
  return `f${  label
    .toLowerCase()
    .replace(/\s+/g, '_')        // Replace spaces with underscore
    .replace(/[^a-z0-9_]/g, '')}`; // Remove all non-alphanumerics
};
  