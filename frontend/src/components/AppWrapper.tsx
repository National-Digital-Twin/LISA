// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Local imports
import CreateLog from '../pages/CreateLog';
import Error404 from '../pages/Error404';
import Files from '../pages/Files';
import CreateForms from '../pages/Forms/CreateFormTemplates';
import LogForms from '../pages/Forms/FormInstances';
import Forms from '../pages/Forms/FormTemplates';
import Home from '../pages/Home';
import Incidents from '../pages/Incidents';
import Location from '../pages/Location';
import Logbook from '../pages/Logbook';
import Notifications from '../pages/Notifications';
import Overview from '../pages/Overview';
import IncidentTask from '../pages/IncidentTask';
import IncidentPickerPage from '../pages/IncidentPickerPage';
import Settings from '../pages/Settings';
import Tasks from '../pages/Tasks';
import Layout from './Layout';
import MyProfile from '../pages/MyProfile';
import AdminUserList from '../pages/AdminUserList';
import AdminViewUser from '../pages/AdminViewUser';
import AdminNewUser from '../pages/AdminNewUser';
import { CreateLogEntry } from '../pages/CreateLogEntry';
import CreateTask from '../pages/CreateTask';

const AppWrapper = () => {
  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        { path: '', element: <Home /> },
        { path: 'incidents', element: <Incidents /> },
        { path: 'forms', element: <Forms /> },
        { path: 'forms/create', element: <CreateForms /> },
        { path: 'forms/preview', element: <CreateForms /> },
        { path: 'createlog', element: <CreateLog /> },
        { path: 'incident/:incidentId', element: <Overview /> },
        { path: 'logbook/:incidentId', element: <Logbook /> },
        { path: 'logbook/:incidentId/create', element: <CreateLogEntry /> },
        { path: 'tasks', element: <Tasks /> },
        { path: 'tasks/:taskId', element: <IncidentTask /> },
        { path: 'tasks/create/:incidentId', element: <CreateTask /> },
        { path: 'incidents/pick', element: <IncidentPickerPage /> },
        { path: 'forms/:incidentId', element: <LogForms /> },
        { path: 'location/:incidentId', element: <Location /> },
        { path: 'files/:incidentId', element: <Files /> },
        { path: 'notifications', element: <Notifications /> },
        { path: 'settings', element: <Settings /> },
        { path: 'settings/incidents', element: <Incidents isManaging={true} /> },
        { path: 'settings/my-profile', element: <MyProfile /> },
        { path: 'settings/users', element: <AdminUserList /> },
        { path: 'settings/user-profile', element: <AdminViewUser /> },
        { path: 'settings/users/new', element: <AdminNewUser /> },
        { path: '*', element: <Error404 /> }
      ]
    }
  ]);

  return <RouterProvider router={router} />;
};

export default AppWrapper;
