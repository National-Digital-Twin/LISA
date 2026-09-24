// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

export const createSequenceNumber = () => {
  const date = new Date();
  return [
    date.getDate(),
    date.getMonth() + 1, // to account for zero based indexing on the month
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  ]
    .map((element) => String(element).padStart(2, '0'))
    .join('');
};
