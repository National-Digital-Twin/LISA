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
