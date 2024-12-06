// Global imports
import { Request, Response } from 'express';

// Local imports
import { baseDir } from '../settings';

export default async (req: Request, res: Response) => {
  res.sendFile('/frontend/index.html', { root: baseDir });
};
