// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

/* eslint-disable no-console */

import { logError, logInfo } from '../logger';

describe('logger', () => {
  const originalEnv = process.env;
  const originalConsoleError = console.error;
  const originalConsoleLog = console.log;

  beforeEach(() => {
    process.env = { ...originalEnv };
    console.error = jest.fn();
    console.log = jest.fn();
  });

  afterEach(() => {
    process.env = originalEnv;
    console.error = originalConsoleError;
    console.log = originalConsoleLog;
    jest.clearAllMocks();
  });

  describe('logError', () => {
    it('should log error in non-production environments', () => {
      process.env.NODE_ENV = 'development';
      logError('TestContext', new Error('Test error'));

      expect(console.error).toHaveBeenCalledWith('[TestContext]', expect.any(Error));
    });

    it('should not log error in production environment', () => {
      process.env.NODE_ENV = 'production';
      logError('TestContext', new Error('Test error'));

      expect(console.error).not.toHaveBeenCalled();
    });
  });

  describe('logInfo', () => {
    it('should log message in non-production environments', () => {
      process.env.NODE_ENV = 'development';
      logInfo('This is an info message');

      expect(console.log).toHaveBeenCalledWith('This is an info message');
    });

    it('should not log message in production environment', () => {
      process.env.NODE_ENV = 'production';
      logInfo('This is an info message');

      expect(console.log).not.toHaveBeenCalled();
    });

    it('should handle empty messages gracefully', () => {
      process.env.NODE_ENV = 'development';
      logInfo('');

      expect(console.log).toHaveBeenCalledWith('');
    });
  });
});
