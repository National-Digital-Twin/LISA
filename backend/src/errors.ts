import { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';
import { settings } from './settings';

interface ExpressError extends Error {
  statusCode?: number;
}

export class AccessTokenMissingOrExpiredError extends Error {
  constructor() {
    super('Error: The X-Auth-Request-Access-Token header is either not set or has expired.');
  }
}

export class ApplicationError extends Error implements ExpressError {
  // eslint-disable-next-line class-methods-use-this
  get statusCode() {
    return 500;
  }
}

export class InvalidValueError extends ApplicationError {
  // eslint-disable-next-line class-methods-use-this
  get statusCode() {
    return 400;
  }
}

export function errorsMiddleware(
  err: ExpressError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log('error: ', err);
  if (err instanceof ApplicationError) {
    res.status(err.statusCode);
    res.json({ error: err.message });
  } else if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(413);
      res.json({
        error: `One or more files exceed the ${Math.round(settings.MAX_UPLOAD_SIZE / 1048576)}Mb size limit`
      });
    } else {
      next(err);
    }
  } else {
    next(err);
  }
}
