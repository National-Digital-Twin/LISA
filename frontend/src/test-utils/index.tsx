import { ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import ProvidersWrapper from './ProvidersWrapper';

export const providersRender = (ui: ReactNode, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: ProvidersWrapper, ...options });

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
