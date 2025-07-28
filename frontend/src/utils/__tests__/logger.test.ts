// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

/* eslint-disable no-console */
import { logError } from '../logger';

describe('logError', () => {
  const originalEnv = process.env;
  const originalConsoleError = console.error;

  beforeEach(() => {
    process.env = { ...originalEnv };
    console.error = jest.fn();
  });

  afterEach(() => {
    process.env = originalEnv;
    console.error = originalConsoleError;
    jest.clearAllMocks();
  });

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
