// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { Router } from 'express';
import multer from 'multer';

// Local imports
import * as auth from '../services/auth';
import * as incident from '../services/incident';
import * as logEntry from '../services/logEntry';
import * as notifications from '../services/notifications';
import * as storage from '../services/fileStorage';
import * as osMaps from '../services/osMaps';
import * as task from '../services/task';
import * as formTemplate from '../services/formTemplate';
import * as formInstance from '../services/formInstance';
import * as scg from '../services/scg_demo';
import { settings } from '../settings';
import { authenticate } from '../auth/middleware';
import { errorsMiddleware } from '../errors';

const upload = multer({
  dest: '__uploads/',
  limits: {
    fileSize: settings.MAX_UPLOAD_SIZE
  }
});

const apiRouter = Router();

apiRouter.get('/auth/logout-links', auth.logoutLinks);

apiRouter.use(authenticate());

apiRouter.get('/auth/user', auth.user);
apiRouter.get('/auth/users', auth.users);

if (settings.NODE_ENV === 'development') {
  apiRouter.get('/query', scg.query);
}

apiRouter.get('/incidents', incident.get);
apiRouter.post('/incident', incident.create);

apiRouter.get('/incident/:incidentId', incident.getById);

apiRouter.get('/incident/:incidentId/logEntries', logEntry.get);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
apiRouter.post('/incident/:incidentId/logEntry', upload.any() as any, logEntry.create);

apiRouter.get('/incident/:incidentId/attachments', incident.getAttachments);

apiRouter.post('/incident/:incidentId/stage', incident.changeStage);

apiRouter.get('/files/:key/:fileName', storage.streamS3Object);
apiRouter.get('/files/scan-result/:key', storage.getScanResultExternal);

apiRouter.get('/searchLocation', osMaps.searchLocation);

apiRouter.get('/notifications', notifications.get);
apiRouter.put('/notifications/:id', notifications.markRead);

apiRouter.get('/tasks', task.get);
apiRouter.get('/incident/:incidentId/tasks', task.getForIncidentId);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
apiRouter.post('/incident/:incidentId/tasks', upload.any() as any, task.create);
apiRouter.patch('/task/:taskId/status', task.changeStatus);
apiRouter.patch('/task/:taskId/assignee', task.changeAssignee);

apiRouter.post('/form', formTemplate.create);
apiRouter.get('/form', formTemplate.get);

apiRouter.post('/incident/:incidentId/form', formInstance.create);
apiRouter.get('/incident/:incidentId/form', formInstance.get);

apiRouter.head('/ping', (_, res) => res.sendStatus(200));

apiRouter.use(errorsMiddleware);

export default apiRouter;
