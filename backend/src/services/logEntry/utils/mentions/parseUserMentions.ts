// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type Mentionable } from 'common/Mentionable';
import { type ResultRow } from '../../../../ia';
import { nodeValue } from '../../../../rdfutil';

export function parseUserMentions(results: ResultRow[]) {
  return results.reduce((map, result) => {
    const entryId = nodeValue(result.entryId.value);
    const mention: Mentionable = { id: nodeValue(result.mentionsUser.value), type: 'User', label: '' };
    const mentions = map[entryId] || [];
    mentions.push(mention);
    return { ...map, [entryId]: mentions };
  }, new Map<string, Mentionable[]>());
}
