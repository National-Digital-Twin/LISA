import {
  getAllIncidents,
  deleteIncident,
  getAllForms,
  deleteForms,
  getAllLogs,
  deleteLog,
} from './dbOperations';
import { post } from '../../api';
  
export async function syncAllOfflineEntities() {
  // Sync incidents
  const offlineIncidents = await getAllIncidents();
  await offlineIncidents
    .filter(incident => incident.offline)
    .reduce((promise, incident) =>
      promise.then(async () => {
        try {
          await post('/incident', incident);
          await deleteIncident(incident.id);
          // console.log(`Synced incident ${incident.id}`);
        } catch (err) {
          // console.error(`Failed to sync incident ${incident.id}`, err);
        }
      }),
    Promise.resolve()
    );
  
  // Sync forms
  const offlineForms = await getAllForms();
  await offlineForms
    .reduce((promise, form) =>
      promise.then(async () => {
        try {
          await post(`/incident/${form.incidentId}/form`, form); // TODO: correct model to include incidentId
          await deleteForms(form.id);
          // console.log(`Synced form ${form.id}`);
        } catch (err) {
          // console.error(`Failed to sync form ${form.id}`, err);
        }
      }),
    Promise.resolve()
    );
  
  // Sync logs
  const offlineLogs = await getAllLogs();
  await offlineLogs
    .reduce((promise, log) =>
      promise.then(async () => {
        try {
          await post(`/incident/${log.incidentId}/logEntry`, log);
          await deleteLog(log.id!);
          // console.log(`Synced log ${log.id}`);
        } catch (err) {
          // console.error(`Failed to sync log ${log.id}`, err);
        }
      }),
    Promise.resolve()
    );
  
  // console.log('All offline entities synced successfully');
}
  