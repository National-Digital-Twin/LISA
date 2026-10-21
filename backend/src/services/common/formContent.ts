// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

import type { User } from 'common/User';
import { literalString, ns } from '../../rdfutil';

export function formContentTriples(
  formNode: ReturnType<typeof ns.data>,
  user: Pick<User, 'username' | 'displayName'>,
  formData: unknown
) {
  const authorNode = ns.data(user.username);

  return [
    [authorNode, ns.rdf.type, ns.ies.Creator],
    [authorNode, ns.ies.hasName, literalString(user.displayName)],
    [authorNode, ns.ies.isParticipantIn, formNode],
    [formNode, ns.lisa.hasData, literalString(JSON.stringify(formData))]
  ];
}
