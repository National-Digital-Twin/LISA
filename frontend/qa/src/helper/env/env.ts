import * as dotenv from 'dotenv';

export const getEnv = () => {
  if (process.env.ENV) {
    dotenv.config({
      path: `src/helper/env/.env.${process.env.ENV}`
    });
  }
};
