import '@testing-library/jest-dom';
import crypto from 'crypto';
import { TextEncoder } from 'util';

global.TextEncoder = TextEncoder;

Object.defineProperty(global, 'crypto', {
  value: {
    subtle: crypto.webcrypto.subtle
  }
});
