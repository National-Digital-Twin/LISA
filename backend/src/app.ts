// Global imports
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';

// Local imports
import router from './routes';

const app = express();

// This allows executing trusted inline scripts
// app.use((req, res, next) => {
//   res.locals.cspNonce = crypto.randomBytes(32).toString('base64url');
//   next();
// });
// app.use(helmet({
//   contentSecurityPolicy: {
//     directives: {
//       scriptSrc: [
//         "'self'",
//         (req: express.Request, res: express.Response) => `'nonce-${res.locals.cspNonce}'`
//       ],
//     },
//   },
// }));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      'worker-src': ["'self'", 'blob:'],
      'child-src': ["'self'", 'blob:'],
      'img-src': ["'self'", 'data:', 'blob:'],
      'connect-src': ["'self'", 'data:', 'https://api.os.uk', 'https://nominatim.openstreetmap.org'],
    },
  },
}));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(router);

app.disable('x-powered-by');

export default app;
