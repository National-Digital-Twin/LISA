// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import 'dotenv/config';
import { cleanEnv, num, str, url } from 'envalid';
import path from 'path';
import { fileURLToPath } from 'url';

export const settings = cleanEnv(process.env, {
  PORT: num({ default: 3000 }),
  HOST: str({ default: 'localhost' }),
  SCG_URL: url({ default: 'http://localhost:3030' }),
  COGNITO_USER_POOL_ID: str(),
  S3_BUCKET_ID: str(),
  MAX_UPLOAD_SIZE: num({ default: 104857600 }),
  NODE_ENV: str({
    choices: ['development', 'test', 'production', 'staging'],
    default: 'development'
  }),
  IDENTITY_API_URL: str({ default: 'http://localhost:3001' }),
  LANDING_PAGE_URL: str({ default: 'http://localhost:3002' }),
  COGNITO_USER_GROUP_NAME: str(),
  OS_MAPS_KEY: str()
});

const filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const dirname = path.dirname(filename); // get the name of the directory

export const baseDir = `${dirname}/../dist`;
