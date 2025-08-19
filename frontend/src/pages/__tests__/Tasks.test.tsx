// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { fireEvent, screen } from '@testing-library/react';
import { type Task } from 'common/Task';
import { type Incident } from 'common/Incident';
import * as hooks from '../../hooks';
import { providersRender } from '../../test-utils';
import Tasks from '../Tasks';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const mockIncidents: Incident[] = [
  {
    id: 'incident-1',
    name: 'Test Incident 1',
    type: 'TerrorismInternational',
    stage: 'Response',
    startedAt: '2025-01-01T10:00:00Z',
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
    referrer: {
      email: 'test2@example.com',
      name: 'Test User 2',
      organisation: 'Test Org 2',
      telephone: '098-765-4321',
      supportRequested: 'No'
    }
  }
];

const mockTasks: Task[] = [
  {
    id: 'task-1',
    name: 'High Priority Task',
    description: 'This is a high priority task',
    incidentId: 'incident-1',
    author: { username: 'john.doe', displayName: 'John Doe' },
    assignee: { username: 'jane.smith', displayName: 'Jane Smith' },
    status: 'ToDo',
    sequence: '1',
    createdAt: '2025-01-01T10:00:00Z',
    location: null,
    attachments: []
  },
  {
    id: 'task-2',
    name: 'In Progress Task',
    description: 'This task is in progress',
    incidentId: 'incident-2',
    author: { username: 'jane.smith', displayName: 'Jane Smith' },
    assignee: { username: 'bob.wilson', displayName: 'Bob Wilson' },
    status: 'InProgress',
    sequence: '2',
    createdAt: '2025-01-01T11:00:00Z',
    location: null,
    attachments: []
  },
  {
    id: 'task-3',
    name: 'Completed Task',
    description: 'This task is completed',
    incidentId: 'incident-1',
    author: { username: 'alice.jones', displayName: 'Alice Jones' },
    assignee: { username: 'john.doe', displayName: 'John Doe' },
    status: 'Done',
    sequence: '3',
    createdAt: '2025-01-01T09:00:00Z',
    location: null,
    attachments: []
  }
];

jest.mock('../../hooks', () => ({
  useIncidents: jest.fn(() => ({
    data: mockIncidents
  })),
  useAllTasks: jest.fn(() => ({
    data: mockTasks
  })),
  useAllTasksUpdates: jest.fn(() => ({
    startPolling: jest.fn(),
    clearPolling: jest.fn()
  })),
  useAuth: jest.fn(() => ({
    user: { current: { username: 'testUser', displayName: 'Test User', email: 'test@test.com', groups: [] } },
    logout: jest.fn()
  })),
}));

jest.mock('../../hooks/useIsOnline', () => ({
  useIsOnline: jest.fn(() => true)
}));

describe('Tasks Page', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the tasks page with title', () => {
    providersRender(<Tasks />);

    expect(screen.getByText('Tasks')).toBeInTheDocument();
  });

  it('renders tasks with all required information', () => {
    providersRender(<Tasks />);

    // Titles (filters out Done status by default)
    expect(screen.getByText('High Priority Task')).toBeInTheDocument();
    expect(screen.getByText('In Progress Task')).toBeInTheDocument();
    expect(screen.queryByText('Completed Task')).not.toBeInTheDocument();

    // Assignee information
    expect(screen.getByText('Assigned to: Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Assigned to: Bob Wilson')).toBeInTheDocument();

    // Incident names in footer
    expect(screen.getByText('INCIDENT: Test Incident 1')).toBeInTheDocument();
    expect(screen.getByText('INCIDENT: Test Incident 2')).toBeInTheDocument();
  });

  it('handles task click navigation', () => {
    providersRender(<Tasks />);

    const firstTask = screen.getByText('High Priority Task');
    fireEvent.click(firstTask);

    expect(mockNavigate).toHaveBeenCalledWith('/tasks/task-1');
  });

  it('opens sort and filter dialog when button clicked', () => {
    providersRender(<Tasks />);

    const filterButton = screen.getByText(/Sort & Filter/);
    fireEvent.click(filterButton);

    expect(screen.getByText('Sort by')).toBeInTheDocument();
  });

  it('shows empty state when no tasks exist', () => {
    (hooks.useAllTasks as jest.Mock).mockReturnValue({
      data: []
    });

    providersRender(<Tasks />);

    expect(screen.getByText('No tasks found')).toBeInTheDocument();
    expect(screen.getByText('There are currently no tasks.')).toBeInTheDocument();
  });

  it('shows filtered empty state when tasks exist but none match filters', () => {
    (hooks.useAllTasks as jest.Mock).mockReturnValue({
      data: [mockTasks[2]] // Only completed task
    });

    providersRender(<Tasks />);

    expect(screen.getByText('No results found')).toBeInTheDocument();
    expect(screen.getByText('There are no tasks matching your filters.')).toBeInTheDocument();
  });

  it('shows filter count in button when filters are active', () => {
    providersRender(<Tasks />);

    const filterButton = screen.getByText(/Sort & Filter/);
    expect(filterButton.textContent).toContain('(1)'); // Has status filter by default
  });
});
