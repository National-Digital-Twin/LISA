// Global imports
import express from 'express';

// Local imports
import { baseDir } from '../settings';

export default express.static(`${baseDir}/frontend/assets`, {
  redirect: false,
  fallthrough: false,
  index: false,
  maxAge: '1h',
  lastModified: false,
  etag: true,
});
