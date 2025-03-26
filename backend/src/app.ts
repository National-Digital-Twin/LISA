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

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
