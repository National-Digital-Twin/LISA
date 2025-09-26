// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { dbPromise, OfflineDB } from './indexedDb';

// Helper functions
function getExpiry() {
  const expiryMs = 1000 * 60 * 60 * 24; // 24 hours
  const now = new Date();
  return new Date(now.getTime() + expiryMs).toISOString();
}

// Incidents
export async function addIncident(incident: OfflineDB['incidents']['value']) {
  const db = await dbPromise;
  await db.put('incidents', {...incident, expiresAt: getExpiry()});
}

export async function getIncident(id: string) {
  const db = await dbPromise;
  return db.get('incidents', id);
}

export async function deleteIncident(id: string) {
  const db = await dbPromise;
  await db.delete('incidents', id);
}

export async function getAllIncidents() {
  const db = await dbPromise;
  return db.getAll('incidents');
}

// Logs
export async function addLog(log: OfflineDB['logs']['value']) {
  const db = await dbPromise;
  await db.put('logs', {...log, expiresAt: getExpiry()});
}

export async function getLogsByIncidentId(incidentId: string) {
  const db = await dbPromise;
  return db.getAllFromIndex('logs', 'by-incidentId', incidentId);
}

export async function getAllLogs() {
  const db = await dbPromise;
  return db.getAll('logs');
}

export async function deleteLog(id: string) {
  const db = await dbPromise;
  await db.delete('logs', id);
}

// Forms
export async function addForm(form: OfflineDB['forms']['value']) {
  const db = await dbPromise;
  await db.put('forms', {...form, expiresAt: getExpiry()});
}
  
export async function getForm(id: string) {
  const db = await dbPromise;
  return db.get('forms', id);
}
  
export async function getAllForms() {
  const db = await dbPromise;
  return db.getAll('forms');
}

export async function deleteForm(id: string) {
  const db = await dbPromise;
  await db.delete('forms', id);
}
