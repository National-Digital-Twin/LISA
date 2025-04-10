// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Local imports
import CreateLog from '../pages/CreateLog';
import Error404 from '../pages/Error404';
import Files from '../pages/Files';
import Home from '../pages/Home';
import Location from '../pages/Location';
import Logbook from '../pages/Logbook';
import Overview from '../pages/Overview';
import Layout from './Layout';
import Tasks from '../pages/Tasks';
import Forms from '../pages/Forms/FormTemplates';
import CreateForms from '../pages/Forms/CreateFormTemplates';
import LogForms from '../pages/Forms/FormInstances';

const AppWrapper = () => {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        { path: '', element: <Home /> },
        { path: 'forms', element: <Forms/>},
        { path: 'forms/create', element: <CreateForms/>},
        { path: 'forms/preview', element: <CreateForms/>},
        // { path: 'login', element: <Login /> },
        { path: 'createlog', element: <CreateLog /> },
        { path: 'incident/:incidentId', element: <Overview /> },
        { path: 'logbook/:incidentId', element: <Logbook /> },
        { path: 'tasks/:incidentId', element: <Tasks /> },
        { path: 'forms/:incidentId', element: <LogForms/>},
        // { path: 'methane/:incidentId', element: <Methane /> },
        // { path: 'handover/:incidentId', element: <Handover /> },
        // { path: 'hazards/:incidentId', element: <Hazards /> },
        { path: 'location/:incidentId', element: <Location /> },
        // { path: 'riskassessment/:incidentId', element: <RiskAssessment /> },
        { path: 'files/:incidentId', element: <Files /> },
        { path: '*', element: <Error404 /> }
      ]
    }
  ]);

  return <RouterProvider router={router} />;
};

export default AppWrapper;
