// Global imports
import express from 'express';
import Router from 'express-promise-router';
import multer from 'multer';

// Local imports
import assets from '../services/assets';
import * as auth from '../services/auth';
import * as incident from '../services/incident';
import * as logEntry from '../services/logEntry';
import * as notifications from '../services/notifications';
import * as storage from '../services/fileStorage';
import * as osMaps from '../services/osMaps';
import root from '../services/root';
import * as scg from '../services/scg_demo';
import { baseDir, env } from '../settings';
import { authenticate } from '../auth/middleware';
import { errorsMiddleware } from '../errors';

const upload = multer({
  dest: '__uploads/',
  limits: {
    fileSize: env.MAX_UPLOAD_SIZE
  }
});

const router = Router();
const incidentsRequestQueue: { [id: string]: Promise<void> } = {};

router.use('/assets', assets);
// include PWA service worker
router.use(express.static(`${baseDir}/frontend`));

const apiRouter = Router();
router.use('/api', apiRouter);

apiRouter.get('/auth/login', auth.login);
apiRouter.get('/auth/callback', auth.callback);
apiRouter.get('/auth/logout', auth.logout);

apiRouter.use(authenticate({}));

apiRouter.get('/auth/user', auth.user);
apiRouter.get('/auth/users', auth.users);

if (env.NODE_ENV === 'development') {
  apiRouter.get('/query', scg.query);
}

apiRouter.get('/incidents', incident.get);
apiRouter.post('/incident', incident.create);

apiRouter.get('/incident/:incidentId/logEntries', logEntry.get);
apiRouter.post('/incident/:incidentId/logEntry', upload.any(), logEntry.create);

apiRouter.post('/incident/:incidentId/logEntry/:entryId/updateSequence', async (req, res) => {
  const { incidentId } = req.params;

  if (!incidentId) {
    res.status(400).end();
    return;
  }

  // Is the request queue currently resolving a request for a particular incident?
  if (incidentId in incidentsRequestQueue) {
    // Attach the incoming request to until after the current one resolves. If the current one is rejected for whatever reason
    // then move the current request to the top of the queue.
    incidentsRequestQueue[incidentId].then(
      () => logEntry.updateSequence,
      () => {
        incidentsRequestQueue[incidentId] = logEntry.updateSequence(req, res);
      }
    );
  } else {
    // If no request is queued add the first one to be processed.
    incidentsRequestQueue[incidentId] = logEntry.updateSequence(req, res);
  }

  // When the promise has been resolved remove the incident from the queue.
  incidentsRequestQueue[incidentId].finally(() => delete incidentsRequestQueue[incidentId]);
});

apiRouter.get('/incident/:incidentId/attachments', incident.getAttachments);

apiRouter.post('/incident/:incidentId/stage', incident.changeStage);

apiRouter.get('/files/:key/:fileName', storage.streamS3Object);

apiRouter.get('/searchLocation', osMaps.searchLocation);

apiRouter.get('/notifications', notifications.get);
apiRouter.put('/notifications/:id', notifications.markRead);

apiRouter.use(errorsMiddleware);

// UI, which supports internal routing via the wildcard
router.get('/*', root);

export default router;
