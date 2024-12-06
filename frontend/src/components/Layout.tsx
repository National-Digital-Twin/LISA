// Global imports
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

// Local imports
import { PRINTABLE_KEY } from '../utils/constants';
import Footer from './Footer';
import Header from './Header';

export default function Layout() {
  // To come from user permissions/roles
  const [printable] = useState<boolean>(sessionStorage.getItem(PRINTABLE_KEY) === 'yes');
  return (
    <div className={`App ${printable ? 'printable' : ''}`}>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
