// Global imports
import { Literal, Static, Union } from 'runtypes';

const SUFFIX = 'Stage';

export const IncidentStage = Union(
  Literal('Monitoring'),
  Literal('Response'),
  Literal('Recovery'), // Need to be able to go back to Response from here.
  Literal('Closed')
);

// eslint-disable-next-line no-redeclare
export type IncidentStage = Static<typeof IncidentStage>;

type TypesDict = { [key in IncidentStage]: { label: string } };
export const IncidentStages: TypesDict = {
  Monitoring: { label: 'Monitoring' },
  Response: { label: 'Response' },
  Recovery: { label: 'Recovery' },
  Closed: { label: 'Closed' }
};

export function addStageSuffix(stage: IncidentStage): string {
  return `${stage}${SUFFIX}`;
}

export function removeStageSuffix(value: string): IncidentStage {
  return value.substring(0, value.indexOf(SUFFIX)) as IncidentStage;
}

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
