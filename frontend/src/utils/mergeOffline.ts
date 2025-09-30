// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

export type OfflineMergable = { id?: string; offline?: boolean };

export function mergeOfflineEntities<T extends OfflineMergable>(
  cachedEntities: Array<T> | undefined,
  entities: Array<T>
): Array<T> {
  if (!cachedEntities?.length) return entities;

  const ids: Record<string, boolean> = {};
  for (const entity of entities) {
    if (entity.id) ids[entity.id] = true;
  }

  return [
    ...cachedEntities.filter((item) => item.offline && item.id && !ids[item.id]),
    ...entities
  ];
}
