// Global imports
import React from 'react';
import ReactDOM from 'react-dom/client';

// Local imports
import App from './App';

// Styles
import './App.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
