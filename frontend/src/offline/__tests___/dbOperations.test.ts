// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

/* eslint-disable import/no-extraneous-dependencies */
import 'fake-indexeddb/auto';
import { IncidentType } from 'common/IncidentType';
import { IncidentStage } from 'common/IncidentStage';
import { LogEntryTypeV2 } from 'common/LogEntryType';
import {
  addIncident,
  getIncident,
  deleteIncident,
  getAllIncidents,
  addLog,
  getLogsByIncidentId,
  getAllLogs,
  deleteLog,
  addForm,
  getForm,
  getAllForms,
  deleteForm
} from '../db/dbOperations';

global.structuredClone = global.structuredClone || ((obj) => JSON.parse(JSON.stringify(obj)));

const mockIncident = {
  id: 'incident-1',
  name: 'Mock Incident',
  stage: 'Monitoring' as IncidentStage,
  type: 'CBRNMedium' as IncidentType,
  referrer: {
    name: 'Test',
    organisation: 'TestOrg',
    telephone: '123456789',
    email: 'test@example.com',
    supportRequested: 'No' as const
  },
  startedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  offline: true as const
};

const mockLog = {
  id: 'log-1',
  incidentId: 'incident-1',
  type: 'general' as LogEntryTypeV2,
  dateTime: new Date().toISOString(),
  content: {
    text: 'This is a test log'
  },
  offline: true as const
};

const mockForm = {
  id: 'form-1',
  title: 'Test Form',
  formTemplateId: 'template-1',
  formData: { field1: 'value1' },
  incidentId: 'incident-1',
  createdAt: new Date().toISOString(),
  pendingLogEntry: mockLog
};

describe('IndexedDB Operations', () => {
  describe('Incidents', () => {
    it('adds, retrieves, and deletes an incident', async () => {
      await addIncident(mockIncident);
      const retrieved = await getIncident(mockIncident.id);
      expect(retrieved).toMatchObject(mockIncident);

      const all = await getAllIncidents();
      expect(all.length).toBe(1);

      await deleteIncident(mockIncident.id);
      const afterDelete = await getIncident(mockIncident.id);
      expect(afterDelete).toBeUndefined();
    });
  });

  describe('Logs', () => {
    it('adds, retrieves by incident, and deletes a log', async () => {
      await addLog(mockLog);

      const byIncident = await getLogsByIncidentId(mockLog.incidentId);
      expect(byIncident.length).toBe(1);
      expect(byIncident[0]).toMatchObject(mockLog);

      const all = await getAllLogs();
      expect(all.length).toBe(1);

      await deleteLog(mockLog.id);
      const afterDelete = await getAllLogs();
      expect(afterDelete.length).toBe(0);
    });
  });

  describe('Forms', () => {
    it('adds, retrieves, and deletes a form', async () => {
      await addForm(mockForm);

      const retrieved = await getForm(mockForm.id);
      expect(retrieved).toMatchObject(mockForm);

      const all = await getAllForms();
      expect(all.length).toBe(1);

      await deleteForm(mockForm.id);
      const afterDelete = await getForm(mockForm.id);
      expect(afterDelete).toBeUndefined();
    });
  });
});
