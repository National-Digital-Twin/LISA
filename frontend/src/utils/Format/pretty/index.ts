function prettyName(name: string): string {
  if (!name) return '';
  return name
    .replace(/\W+/g, ' ') // Replace one or more non-word characters with a single space
    .trim() // Remove leading and trailing spaces
    .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase()); // Capitalise first character and any character following a space
}

function prettyInitials(name: string): string {
  const words = name.trim().split(/[\s.]+/);
  return words.map((word) => word[0].toUpperCase()).join('');
}

export const pretty = {
  name: prettyName,
  initials: prettyInitials
};

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
