// Global imports
import 'dotenv/config';
import { cleanEnv, num, str, url } from 'envalid';
import path from 'path';
import { fileURLToPath } from 'url';

export const env = cleanEnv(process.env, {
  PORT: num({ default: 3000 }),
  HOST: str({ default: 'localhost' }),
  SERVER_URL: url({ default: 'http://localhost:3000' }),
  SCG_URL: url({ default: 'http://localhost:3030' }),
  COGNITO_DOMAIN: str(),
  COGNITO_USER_POOL_ID: str(),
  COGNITO_CLIENT_ID: str(),
  COGNITO_CLIENT_SECRET: str({ default: undefined }),
  S3_BUCKET_ID: str(),
  MAX_UPLOAD_SIZE: num({ default: 104857600 }),
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'], default: 'development' }),
});

const filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const dirname = path.dirname(filename); // get the name of the directory

export const baseDir = `${dirname}/../dist`;
