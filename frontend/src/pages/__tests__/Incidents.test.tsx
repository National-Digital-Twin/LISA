// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { fireEvent, screen, within } from '@testing-library/react';
import { type Incident } from 'common/Incident';
import { providersRender } from '../../test-utils';
import Incidents from '../Incidents';
import * as hooks from '../../hooks';

const mockNavigate = jest.fn();

const mockIncidents: Incident[] = [
  {
    id: 'incident-1',
    name: 'Test Incident 1',
    type: 'TerrorismInternational',
    stage: 'Response',
    startedAt: '2025-01-01T10:00:00Z',
    reportedBy: { username: 'john.doe', displayName: 'John Doe' },
    referrer: {
      email: 'test@example.com',
      name: 'Test User',
      organisation: 'Test Org',
      telephone: '123-456-7890',
      supportRequested: 'No'
    }
  },
  {
    id: 'incident-2',
    name: 'Test Incident 2',
    type: 'FloodingCoastal',
    stage: 'Monitoring',
    startedAt: '2025-01-01T11:00:00Z',
    reportedBy: { username: 'jane.smith', displayName: 'Jane Smith' },
    referrer: {
      email: 'test2@example.com',
      name: 'Test User 2',
      organisation: 'Test Org 2',
      telephone: '098-765-4321',
      supportRequested: 'No'
    }
  }
];

const mockAdminUser = {
  current: {
    username: 'admin',
    displayName: 'Admin User',
    email: 'admin@test.com',
    groups: ['lisa_admin']
  }
};

const mockRegularUser = {
  current: {
    username: 'user',
    displayName: 'Regular User',
    email: 'user@test.com',
    groups: []
  }
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

jest.mock('../../hooks');

describe('Incidents Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (hooks.useIncidents as jest.Mock).mockReturnValue({
      data: mockIncidents,
      isLoading: false,
      error: null
    });

    (hooks.useAuth as jest.Mock).mockReturnValue({
      user: mockRegularUser,
      offline: false,
      logout: jest.fn()
    });
  });

  describe('Regular view (isManaging = false)', () => {
    it('renders the incidents page with correct title', () => {
      providersRender(<Incidents />);

      expect(screen.getByText('Incidents')).toBeInTheDocument();
    });

    it('renders incidents with all required information', () => {
      providersRender(<Incidents />);

      // Incident names
      expect(screen.getByText('Test Incident 1')).toBeInTheDocument();
      expect(screen.getByText('Test Incident 2')).toBeInTheDocument();

      // Reported by information
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();

      // Incident is linked to logbook
      const firstIncident = screen.getByText('Test Incident 1');
      fireEvent.click(firstIncident);
      expect(mockNavigate).toHaveBeenCalledWith('/logbook/incident-1');
    });

    it('shows Sort & Filter button in header', () => {
      providersRender(<Incidents />);

      const filterButton = screen.getByText(/Sort & Filter/);
      expect(filterButton).toBeInTheDocument();
    });

    it('shows empty state when no incidents exist', () => {
      (hooks.useIncidents as jest.Mock).mockReturnValueOnce({
        data: [],
        isLoading: false,
        error: null
      });

      providersRender(<Incidents />);

      expect(screen.getByText('No incidents found')).toBeInTheDocument();
      expect(screen.getByText('There are currently no incidents.')).toBeInTheDocument();
    });

    it('does not show Add incident button in regular view', () => {
      providersRender(<Incidents />);

      expect(screen.queryByText('Add incident')).not.toBeInTheDocument();
    });
  });

  describe('Management view (isManaging = true)', () => {
    beforeEach(() => {
      (hooks.useAuth as jest.Mock).mockReturnValue({
        user: mockAdminUser,
        offline: false,
        logout: jest.fn()
      });
    });

    it('renders the manage incidents page with correct title', () => {
      providersRender(<Incidents isManaging={true} />);

      expect(screen.getByText('Manage incidents')).toBeInTheDocument();
    });

    it('does not show Sort & Filter button in header for management view', () => {
      providersRender(<Incidents isManaging={true} />);

      const headerSection = screen.getByTestId('incidents-header');

      // Verify title is in the header without Sort & Filter
      expect(within(headerSection).getByText('Manage incidents')).toBeInTheDocument();
      expect(within(headerSection).queryByText(/Sort & Filter/)).not.toBeInTheDocument();
    });

    it('shows Add incident and Sort & Filter buttons in content area', () => {
      providersRender(<Incidents isManaging={true} />);

      const contentSection = screen.getByTestId('incidents-management-buttons');

      expect(within(contentSection).getByText('Add incident')).toBeInTheDocument();
      expect(within(contentSection).getByText(/Sort & Filter/)).toBeInTheDocument();
    });

    it('navigates to create log page when Add incident button clicked', () => {
      providersRender(<Incidents isManaging={true} />);

      const addButton = screen.getByText('Add incident');
      fireEvent.click(addButton);

      expect(mockNavigate).toHaveBeenCalledWith('/create');
    });

    it('renders incidents data same as regular view', () => {
      providersRender(<Incidents isManaging={true} />);

      expect(screen.getByText('Test Incident 1')).toBeInTheDocument();
      expect(screen.getByText('Test Incident 2')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  describe('Admin access control', () => {
    it('redirects non-admin users when trying to access management view', () => {
      (hooks.useAuth as jest.Mock).mockReturnValueOnce({
        user: mockRegularUser,
        offline: false,
        logout: jest.fn()
      });

      providersRender(<Incidents isManaging={true} />);

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('allows admin users to access management view', () => {
      (hooks.useAuth as jest.Mock).mockReturnValueOnce({
        user: mockAdminUser,
        offline: false,
        logout: jest.fn()
      });

      providersRender(<Incidents isManaging={true} />);

      expect(mockNavigate).not.toHaveBeenCalledWith('/');
      expect(screen.getByText('Manage incidents')).toBeInTheDocument();
    });

    it('allows all users to access regular view', () => {
      (hooks.useAuth as jest.Mock).mockReturnValueOnce({
        user: mockRegularUser,
        offline: false,
        logout: jest.fn()
      });

      providersRender(<Incidents isManaging={false} />);

      expect(mockNavigate).not.toHaveBeenCalledWith('/');
      expect(screen.getByText('Incidents')).toBeInTheDocument();
    });
  });
});
