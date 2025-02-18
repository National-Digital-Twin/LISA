// Global imports
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';

// Local imports
import router from './routes';

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());

app.use(router);

app.disable('x-powered-by');

export default app;
