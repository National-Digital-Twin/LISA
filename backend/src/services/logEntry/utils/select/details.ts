// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { optional } from 'rdf-sparql-builder';

// Local imports
import { select } from '../../../../ia';
import { ns } from '../../../../rdfutil';

export function details(incidentId: string) {
  return select({
    clause: [
      [ns.data(incidentId), ns.lisa.hasLogEntry, '?entryId'],
      optional([
        ['?entryId', ns.lisa.hasModifiedTask, '?changedTaskId'],
        ['?changedTaskId', ns.ies.hasName, '?changedTaskName']
      ]),
      optional([['?entryId', ns.lisa.hasStatus, '?changedStatus']]),
      optional([['?entryId', ns.lisa.assignee, '?changedAssignee']]),
      optional([
        ['?entryId', ns.lisa.hasCompletedForm, '?submittedFormId'],
        ['?submittedFormId', ns.rdf.type, '?submittedFormTemplateId'],
        ['?submittedFormTemplateId', ns.ies.hasName, '?submittedFormTitle']
      ])
    ]
  });
}
