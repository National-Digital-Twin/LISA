import React, { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';

const ProvidersWrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

export default ProvidersWrapper;
