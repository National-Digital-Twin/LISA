// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { Literal, Static, Union } from 'runtypes';

export const TerrorismType = Union(
  Literal('TerrorismInternational'),
  Literal('TerrorismNI'),
  Literal('TerrorismPublic'),
  Literal('TerrorismTransport'),
  Literal('HostageTaking'),
  Literal('Assassination'),
  Literal('CBRNSmall'),
  Literal('CBRNMedium'),
  Literal('CBRNLarge'),
  Literal('InfrastructureConventional'),
  Literal('InfrastructureCyber')
);

// eslint-disable-next-line no-redeclare
export type TerrorismType = Static<typeof TerrorismType>;
