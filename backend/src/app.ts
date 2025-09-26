// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';

// Local imports
import router from './routes';

const app = express();

// The following is a temporary workaround until the cookie parser package is updated to work without this
// in express v5.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use(cookieParser() as any);
app.use(bodyParser.json());

app.use('/api', router);

app.disable('x-powered-by');

export default app;
