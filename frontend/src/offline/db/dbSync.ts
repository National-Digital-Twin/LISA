// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import {
  getAllIncidents,
  deleteIncident,
  getAllForms,
  deleteForm,
  getAllLogs,
  deleteLog,
} from './dbOperations';
import { post } from '../../api';
import { OfflineFormInstance } from '../types/OfflineForm';
import { OfflineIncident } from '../types/OfflineIncident';
import { OfflineLogEntry } from '../types/OfflineLogEntry';
import { logError } from '../../utils/logger';

async function handleFormSync(form : OfflineFormInstance) {
  try {
    await post(`/incident/${form.incidentId}/form`, form);
    await post(`/incident/${form.incidentId}/logEntry`, form.pendingLogEntry);
    await deleteForm(form.id);
  } catch (err) {
    logError(`handle form sync: ${form.id}`, err);
  }
}

async function handleIncidentSync(incident : OfflineIncident) {
  try {
    await post('/incident', incident);
    await deleteIncident(incident.id);
  } catch (err) {
    logError(`handle incident sync: ${incident.id}`, err);
  }
}

async function handleLogSync(log : OfflineLogEntry) {
  try {
    await post(`/incident/${log.incidentId}/logEntry`, log);
    await deleteLog(log.id!);
  } catch (err) {
    logError(`handle log sync: ${log.id}`, err);
  }
}
  
export async function syncAllOfflineEntities() {
  // Sync incidents
  const offlineIncidents = await getAllIncidents();
  await offlineIncidents
    .filter(incident => incident.offline)
    .reduce((promise, incident) =>
      promise.then(async () => {
        await handleIncidentSync(incident);
      }),
    Promise.resolve()
    );
  
  // Sync forms
  const offlineForms = await getAllForms();
  await offlineForms
    .reduce((promise, form) =>
      promise.then(async () => {
        await handleFormSync(form);
      }),
    Promise.resolve()
    );
  
  // Sync logs
  const offlineLogs = await getAllLogs();
  await offlineLogs
    .reduce((promise, log) =>
      promise.then(async () => {
        await handleLogSync(log);
      }),
    Promise.resolve()
    );
}
  