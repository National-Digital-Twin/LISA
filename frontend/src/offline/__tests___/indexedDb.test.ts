// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity


import 'fake-indexeddb/auto';
import { IncidentType } from 'common/IncidentType';
import { IncidentStage } from 'common/IncidentStage';
import { LogEntryType } from 'common/LogEntryType';
import { clearExpiredEntities, dbPromise } from '../db/indexedDb';
import { OfflineIncident } from '../types/OfflineIncident';
import { OfflineFormInstance } from '../types/OfflineForm';
import { OfflineLogEntry } from '../types/OfflineLogEntry';

global.structuredClone = global.structuredClone || ((obj) => JSON.parse(JSON.stringify(obj)));

const createDateOffset = (daysOffset: number) =>
  new Date(Date.now() + daysOffset * 24 * 60 * 60 * 1000).toISOString();

describe('IndexedDB clearExpiredEntities()', () => {
  beforeEach(async () => {
    const db = await dbPromise;

    // Clear stores before each test
    const tx = db.transaction(['incidents', 'forms', 'logs'], 'readwrite');
    await Promise.all([
      tx.objectStore('incidents').clear(),
      tx.objectStore('forms').clear(),
      tx.objectStore('logs').clear(),
    ]);
    await tx.done;
  });

  it('removes expired incidents, forms, and logs', async () => {
    const db = await dbPromise;
    const expiredDate = createDateOffset(-1);
    const futureDate = createDateOffset(1);

    const expiredIncident: OfflineIncident = {
      id: 'i1',
      name: 'Expired Incident',
      type: 'CBRNMedium' as IncidentType,
      stage: 'Monitoring' as IncidentStage,
      startedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      referrer: {
        name: 'Test',
        organisation: 'TestOrg',
        telephone: '123456789',
        email: 'test@example.com',
        supportRequested: 'No',
      },
      offline: true,
      expiresAt: expiredDate,
    };

    const expiredLog: OfflineLogEntry = {
      id: 'l1',
      incidentId: 'i1',
      type: 'General' as LogEntryType,
      dateTime: new Date().toISOString(),
      content: { text: 'Expired log' },
      offline: true,
      expiresAt: expiredDate,
    };

    const futureForm: OfflineFormInstance = {
      id: 'f1',
      title: 'Future Form',
      formTemplateId: 'template1',
      formData: { field: 'value' },
      incidentId: 'i1',
      createdAt: new Date().toISOString(),
      expiresAt: futureDate,
    };

    const tx = db.transaction(['incidents', 'forms', 'logs'], 'readwrite');
    await Promise.all([
      tx.objectStore('incidents').put(expiredIncident),
      tx.objectStore('forms').put(futureForm),
      tx.objectStore('logs').put(expiredLog),
    ]);
    await tx.done;

    // Run cleanup
    await clearExpiredEntities();

    const tx2 = db.transaction(['incidents', 'forms', 'logs'], 'readonly');
    const remainingIncidents = await tx2.objectStore('incidents').getAll();
    const remainingForms = await tx2.objectStore('forms').getAll();
    const remainingLogs = await tx2.objectStore('logs').getAll();

    expect(remainingIncidents).toHaveLength(0); // Expired = removed
    expect(remainingForms).toHaveLength(1);     // Future = kept
    expect(remainingLogs).toHaveLength(0);      // Expired = removed
  });
});
