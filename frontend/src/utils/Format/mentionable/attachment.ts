// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { type IncidentAttachment } from 'common/IncidentAttachment';
import { type Attachment } from 'common/Attachment';
import { type Mentionable } from 'common/Mentionable';

export function attachment(item: Attachment | IncidentAttachment): Mentionable {
  const entryId = (item as IncidentAttachment).logEntryId;
  return {
    id: `${entryId || 'this'}::${item.name}`,
    label: item.name,
    type: 'File'
  };
}
