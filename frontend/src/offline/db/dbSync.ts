// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import {
  getAllIncidents,
  deleteIncident,
  getAllForms,
  deleteForms,
  getAllLogs,
  deleteLog,
} from './dbOperations';
import { post } from '../../api';
import { OfflineFormInstance } from '../types/OfflineForm';
import { createLogEntryFromSubmittedForm } from '../../hooks/Forms/utils';
import { OfflineIncident } from '../types/OfflineIncident';
import { OfflineLogEntry } from '../types/OfflineLogEntry';

async function handleFormSync(form : OfflineFormInstance) {
  try {
    await post(`/incident/${form.incidentId}/form`, form);
    const logEntry = createLogEntryFromSubmittedForm(
      form.title,
      form.id,
      form.incidentId
    );
    await post(`/incident/${form.incidentId}/logEntry`, logEntry);
    await deleteForms(form.id);
  } catch (_err) {
    // console.error(`Failed to sync form ${form.id}`, err);
  }
}

async function handleIncidentSync(incident : OfflineIncident) {
  try {
    await post('/incident', incident);
    await deleteIncident(incident.id);
  } catch (_err) {
    // console.error(`Failed to sync incident ${incident.id}`, err);
  }
}

async function handleLogSync(log : OfflineLogEntry) {
  try {
    await post(`/incident/${log.incidentId}/logEntry`, log);
    await deleteLog(log.id!);
  } catch (_err) {
    // console.error(`Failed to sync log ${log.id}`, err);
  }
}
  
export async function syncAllOfflineEntities() {
  // Sync incidents
  const offlineIncidents = await getAllIncidents();
  await offlineIncidents
    .filter(incident => incident.offline)
    .reduce((promise, incident) =>
      promise.then(async () => {
        handleIncidentSync(incident);
      }),
    Promise.resolve()
    );
  
  // Sync forms
  const offlineForms = await getAllForms();
  await offlineForms
    .reduce((promise, form) =>
      promise.then(async () => {
        handleFormSync(form);
      }),
    Promise.resolve()
    );
  
  // Sync logs
  const offlineLogs = await getAllLogs();
  await offlineLogs
    .reduce((promise, log) =>
      promise.then(async () => {
        handleLogSync(log);
      }),
    Promise.resolve()
    );
  
  // console.log('All offline entities synced successfully');
}
  