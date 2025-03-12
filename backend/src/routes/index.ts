// Global imports
import Router from 'express-promise-router';
import multer from 'multer';

// Local imports
import * as auth from '../services/auth';
import * as incident from '../services/incident';
import * as logEntry from '../services/logEntry';
import * as notifications from '../services/notifications';
import * as storage from '../services/fileStorage';
import * as osMaps from '../services/osMaps';
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

const router = Router();

const apiRouter = Router();
router.use('/api', apiRouter);

apiRouter.get('/auth/logout-links', auth.logoutLinks);

apiRouter.use(authenticate());

apiRouter.get('/auth/user', auth.user);
apiRouter.get('/auth/users', auth.users);

if (settings.NODE_ENV === 'development') {
  apiRouter.get('/query', scg.query);
}

apiRouter.get('/incidents', incident.get);
apiRouter.post('/incident', incident.create);

apiRouter.get('/incident/:incidentId/logEntries', logEntry.get);
apiRouter.post('/incident/:incidentId/logEntry', upload.any(), logEntry.create);

apiRouter.get('/incident/:incidentId/attachments', incident.getAttachments);

apiRouter.post('/incident/:incidentId/stage', incident.changeStage);

apiRouter.get('/files/:key/:fileName', storage.streamS3Object);

apiRouter.get('/searchLocation', osMaps.searchLocation);

apiRouter.get('/notifications', notifications.get);
apiRouter.put('/notifications/:id', notifications.markRead);

apiRouter.use(errorsMiddleware);

export default router;
