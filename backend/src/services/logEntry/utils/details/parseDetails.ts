// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { TaskStatus } from 'common/Task';
import { LogEntryChangeDetails } from 'common/LogEntryChangeDetails';
import { type ResultRow } from '../../../../ia';
import { nodeValue } from '../../../../rdfutil';

export async function parseDetails(
  results: ResultRow[]
): Promise<Map<string, LogEntryChangeDetails>> {
  const detailsByEntry = new Map<string, LogEntryChangeDetails>();

  for (const result of results) {
    const entryId = nodeValue(result.entryId.value);

    const createdTaskId = result?.createdTaskId?.value
      ? nodeValue(result?.createdTaskId?.value)
      : undefined;
    const createdTaskName = result?.createdTaskName?.value;    
    const changedTaskId = result?.changedTaskId?.value
      ? nodeValue(result?.changedTaskId?.value)
      : undefined;
    const changedTaskName = result?.changedTaskName?.value;
    const changedAssignee = result?.changedAssignee?.value;
    const changedStatus = result?.changedStatus?.value as TaskStatus;
    const submittedFormId = result?.submittedFormId?.value
      ? nodeValue(result?.submittedFormId?.value)
      : undefined;
    const submittedFormTitle = result?.submittedFormTitle?.value;
    const submittedFormTemplateId = result?.submittedFormTemplateId?.value ? nodeValue(result?.submittedFormTemplateId?.value) : undefined;

    if (!detailsByEntry.has(entryId)) {
      const details: LogEntryChangeDetails = {
        createdTaskId,
        createdTaskName,        
        changedTaskId,
        changedTaskName,
        changedAssignee,
        changedStatus,
        submittedFormId,
        submittedFormTitle,
        submittedFormTemplateId
      };

      detailsByEntry.set(entryId, details);
    }
  }

  return detailsByEntry;
}
