import { openDB, DBSchema } from 'idb';
import { OfflineIncident } from '../types/OfflineIncident';
import { OfflineLogEntry } from '../types/OfflineLogEntry';
import { OfflineFormInstance } from '../types/OfflineForm';


export interface OfflineDB extends DBSchema {
  incidents: {
    key: string;
    value: OfflineIncident;
  };
  logs: {
    key: string;
    value: OfflineLogEntry;
    indexes: { 'by-incidentId': string };
  };
  forms: {
    key: string;
    value: OfflineFormInstance
  }
}

export const dbPromise = openDB<OfflineDB>('lisa-offline-db', 1, {
  upgrade(db) {
    db.createObjectStore('incidents', { keyPath: 'id' });
    db.createObjectStore('forms', { keyPath: 'id' });

    const logStore = db.createObjectStore('logs', { keyPath: 'id' });
    logStore.createIndex('by-incidentId', 'incidentId');
  },
});


export async function clearExpiredEntities() {
  const db = await dbPromise;

  if(!db) return;

  const tx = db.transaction(['incidents', 'forms', 'logs'], 'readwrite');
  const now = new Date();

  // Clear expired incidents
  const incidentStore = tx.objectStore('incidents');
  const allIncidents = await incidentStore.getAll();

  await Promise.all(
    allIncidents
      .filter(record => record.expiresAt && record.id && new Date(record.expiresAt) <= now)
      .map(record => incidentStore.delete(record.id!))
  );

  // Clear expired forms
  const formStore = tx.objectStore('forms');
  const allForms = await formStore.getAll();

  await Promise.all(
    allForms
      .filter(record => record.expiresAt && record.id && new Date(record.expiresAt) <= now)
      .map(record => formStore.delete(record.id!))
  );

  // Clear expired logs
  const logStore = tx.objectStore('logs');
  const allLogs = await logStore.getAll();

  await Promise.all(
    allLogs
      .filter(record => record.expiresAt && record.id && new Date(record.expiresAt) <= now)
      .map(record => logStore.delete(record.id!))
  );

  await tx.done;
}

