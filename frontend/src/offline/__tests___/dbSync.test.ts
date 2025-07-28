// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// eslint-disable-next-line import/no-extraneous-dependencies
import { LogEntryType } from 'common/LogEntryType';
import 'fake-indexeddb/auto';
import { syncAllOfflineEntities } from '../db/dbSync';
import * as dbOps from '../db/dbOperations';
import * as api from '../../api';
import * as formUtils from '../../hooks/Forms/utils';
import { OfflineIncident } from '../types/OfflineIncident';
import { OfflineFormInstance } from '../types/OfflineForm';
import { OfflineLogEntry } from '../types/OfflineLogEntry';

jest.mock('../../api');
jest.mock('../db/dbOperations');
jest.mock('../../hooks/Forms/utils');

describe('syncAllOfflineEntities', () => {
  const mockIncident: OfflineIncident = {
    id: 'i1',
    name: 'Incident 1',
    stage: 'Monitoring',
    type: 'CBRNMedium',
    referrer: {
      name: 'Ref',
      organisation: 'Org',
      telephone: '000',
      email: 'ref@example.com',
      supportRequested: 'No',
    },
    startedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    offline: true,
    expiresAt: '',
  };

  const mockLog: OfflineLogEntry = {
    id: 'l1',
    incidentId: 'i1',
    type: 'General' as LogEntryType,
    dateTime: new Date().toISOString(),
    content: { text: 'test' },
    offline: true,
    expiresAt: '',
  };

  const mockForm: OfflineFormInstance = {
    id: 'f1',
    incidentId: 'i1',
    title: 'Form 1',
    formTemplateId: 'template-1',
    formData: {},
    createdAt: new Date().toISOString(),
    expiresAt: '',
    pendingLogEntry: mockLog
  };

  beforeEach(() => {
    jest.resetAllMocks();

    jest.spyOn(dbOps, 'getAllIncidents').mockResolvedValue([mockIncident]);
    jest.spyOn(dbOps, 'getAllForms').mockResolvedValue([mockForm]);
    jest.spyOn(dbOps, 'getAllLogs').mockResolvedValue([mockLog]);

    jest.spyOn(api, 'post').mockResolvedValue({});
    jest.spyOn(dbOps, 'deleteIncident').mockResolvedValue();
    jest.spyOn(dbOps, 'deleteForms').mockResolvedValue();
    jest.spyOn(dbOps, 'deleteLog').mockResolvedValue();

    (formUtils.createLogEntryFromSubmittedForm as jest.Mock).mockReturnValue({
      type: 'FormSubmitted',
      dateTime: new Date().toISOString(),
      incidentId: 'i1',
      content: { text: 'mock log entry' },
    });
  });

  it('syncs incidents, forms, and logs in order', async () => {
    await syncAllOfflineEntities();

    expect(api.post).toHaveBeenCalledWith('/incident', mockIncident);
    expect(dbOps.deleteIncident).toHaveBeenCalledWith('i1');

    expect(api.post).toHaveBeenCalledWith('/incident/i1/form', mockForm);
    expect(api.post).toHaveBeenCalledWith('/incident/i1/logEntry', expect.any(Object));
    expect(dbOps.deleteForms).toHaveBeenCalledWith('f1');

    expect(api.post).toHaveBeenCalledWith('/incident/i1/logEntry', mockLog);
    expect(dbOps.deleteLog).toHaveBeenCalledWith('l1');
  });

  it('skips incident if not marked offline', async () => {
    (dbOps.getAllIncidents as jest.Mock).mockResolvedValue([
      { ...mockIncident, offline: false },
    ]);

    await syncAllOfflineEntities();

    expect(api.post).not.toHaveBeenCalledWith('/incident', expect.anything());
    expect(dbOps.deleteIncident).not.toHaveBeenCalled();
  });

  it('does not throw when post fails', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));

    await expect(syncAllOfflineEntities()).resolves.not.toThrow();

    // deletion should still not be called for failed incident
    expect(dbOps.deleteIncident).not.toHaveBeenCalled();
  });
});
