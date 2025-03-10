import { ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import ProvidersWrapper from './ProvidersWrapper';

export const providersRender = (ui: ReactNode, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: ProvidersWrapper, ...options });
