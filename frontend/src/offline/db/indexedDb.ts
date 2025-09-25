// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { openDB, DBSchema } from 'idb';
import { OfflineIncident } from '../types/OfflineIncident';
import { OfflineLogEntry } from '../types/OfflineLogEntry';
import { OfflineFormInstance } from '../types/OfflineForm';
import { OfflineTask } from '../types/OfflineTask';


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
  };
  tasks: {
    key: string;
    value: OfflineTask;
    indexes: { 'by-incidentId': string };
  };
}

export const dbPromise = openDB<OfflineDB>('lisa-offline-db', 2, {
  upgrade(db, oldVersion) {
    if (!db.objectStoreNames.contains('incidents')) {
      db.createObjectStore('incidents', { keyPath: 'id' });
    }

    if (!db.objectStoreNames.contains('forms')) {
      db.createObjectStore('forms', { keyPath: 'id' });
    }

    if (!db.objectStoreNames.contains('logs')) {
      const logStore = db.createObjectStore('logs', { keyPath: 'id' });
      logStore.createIndex('by-incidentId', 'incidentId');
    }

    if (oldVersion < 2 && !db.objectStoreNames.contains('tasks')) {
      const taskStore = db.createObjectStore('tasks', { keyPath: 'id' });
      taskStore.createIndex('by-incidentId', 'incidentId');
    }
  },
});


export async function clearExpiredEntities() {
  const db = await dbPromise;

  if(!db) return;

  const tx = db.transaction(['incidents', 'forms', 'logs', 'tasks'], 'readwrite');
  const now = new Date();

  // Clear expired incidents
  const incidentStore = tx.objectStore('incidents');
  const allIncidents = await incidentStore.getAll();

  await Promise.all(
    allIncidents
      .filter(record => record.expiresAt && record.id && new Date(record.expiresAt) <= now)
      .map(record => incidentStore.delete(record.id))
  );

  // Clear expired forms
  const formStore = tx.objectStore('forms');
  const allForms = await formStore.getAll();

  await Promise.all(
    allForms
      .filter(record => record.expiresAt && record.id && new Date(record.expiresAt) <= now)
      .map(record => formStore.delete(record.id))
  );

  // Clear expired logs
  const logStore = tx.objectStore('logs');
  const allLogs = await logStore.getAll();

  await Promise.all(
    allLogs
      .filter(record => record.expiresAt && record.id && new Date(record.expiresAt) <= now)
      .map(record => logStore.delete(record.id!))
  );

  // Clear expired tasks
  const taskStore = tx.objectStore('tasks');
  const allTasks = await taskStore.getAll();

  await Promise.all(
    allTasks
      .filter(record => record.expiresAt && record.id && new Date(record.expiresAt) <= now)
      .map(record => taskStore.delete(record.id))
  );

  await tx.done;
}

