// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import '@testing-library/jest-dom';
import crypto from 'crypto';

Object.defineProperty(global, 'crypto', {
  value: {
    subtle: crypto.webcrypto.subtle
  }
});

jest.mock('react-media-recorder', () => ({
  useReactMediaRecorder: () => ({
    status: 'idle',
    startRecording: jest.fn(),
    stopRecording: jest.fn(),
    pauseRecording: jest.fn(),
    resumeRecording: jest.fn(),
    mediaBlobUrl: null
  })
}));

jest.mock('maplibre-gl/dist/maplibre-gl.css', () => ({}));

jest.mock('react-konva', () => {
  const Stub = () => null;
  return {
    __esModule: true,
    Stage: Stub,
    Layer: Stub,
    Line: Stub
  };
});

jest.mock('konva/lib/index-node.js', () => ({}), { virtual: true });
