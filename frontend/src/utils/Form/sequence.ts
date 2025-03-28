// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

export const createSequenceNumber = (date: Date) =>
  [
    date.getDate(),
    date.getMonth() + 1, // to account for zero based indexing on the month
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  ]
    .map((element) => String(element).padStart(2, '0'))
    .join('');