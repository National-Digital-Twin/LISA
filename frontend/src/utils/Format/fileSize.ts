// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

export function fileSize(size: number): string {
  if (size === 0) {
    return '0 Kb';
  }
  const sizeInKb = size / 1024;
  if (sizeInKb >= 1024) {
    return `${(sizeInKb / 1024).toFixed(2)} Mb`;
  }
  return `${sizeInKb.toFixed(2)} Kb`;
}
