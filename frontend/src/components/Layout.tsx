// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

// Local imports
import { PRINTABLE_KEY } from '../utils/constants';
import Header from './Header';
import { OfflineBanner } from './OfflineBanner';

export default function Layout() {
  // To come from user permissions/roles
  const [printable] = useState<boolean>(sessionStorage.getItem(PRINTABLE_KEY) === 'yes');
  return (
    <div className={`App ${printable ? 'printable' : ''}`}>
      <div className="app-wrapper">
        <Header />
        <main className="app-content">
          <OfflineBanner /> 
          <Outlet />
        </main>
      </div>
    </div>
  );
}
