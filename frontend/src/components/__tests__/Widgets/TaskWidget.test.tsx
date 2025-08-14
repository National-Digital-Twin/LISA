// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { render, screen, fireEvent } from '@testing-library/react';
import type { Task } from 'common/Task';
import { useNavigate } from 'react-router-dom';
import TasksWidget from '../../Widgets/TaskWidget';
import { useAllTasks } from '../../../hooks/useTasks';
import { useAuth } from '../../../hooks';

jest.mock('../../../hooks/useTasks');
jest.mock('../../../hooks', () => ({
  ...jest.requireActual('../../../hooks'),
  useAuth: jest.fn()
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('TasksWidget', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useAuth as jest.Mock).mockReturnValue({
      user: { current: { username: 'test.user1' } }
    });
  });

  it('renders loading state', () => {
    (useAllTasks as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true
    });

    render(<TasksWidget />);

    expect(screen.getByText(/your tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/loading tasks/i)).toBeInTheDocument();
  });

  it('renders correct counts for ToDo and InProgress tasks', () => {
    const mockTasks: Partial<Task>[] = [
      { id: '1', status: 'ToDo',       assignee: { username: 'test.user1', displayName: 'Test user 1' } },
      { id: '2', status: 'ToDo',       assignee: { username: 'test.user1', displayName: 'Test user 1' } },
      { id: '3', status: 'InProgress', assignee: { username: 'test.user1', displayName: 'Test user 1' } },
      { id: '4', status: 'ToDo',       assignee: { username: 'test.user2', displayName: 'Test User 2' } },
      { id: '5', status: 'InProgress', assignee: { username: 'test.user3', displayName: 'Test User 3' } }
    ];


    (useAllTasks as jest.Mock).mockReturnValue({
      data: mockTasks,
      isLoading: false
    });

    render(<TasksWidget />);

    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /view to do tasks/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view in progress tasks/i })).toBeInTheDocument();
  });

  it.each([
    { status: 'ToDo' as Task['status'], expectedUrl: '/tasks?mine=true&status=ToDo' },
    { status: 'InProgress' as Task['status'], expectedUrl: '/tasks?mine=true&status=InProgress' }
  ])(
    'navigates to correct URL when %s count clicked',
    ({ status, expectedUrl }) => {
      const mockTasks: Partial<Task>[] = [
        { id: '1', status, assignee: { username: 'test.user1', displayName: 'Test user 1' } }
      ];
  
      (useAllTasks as jest.Mock).mockReturnValue({
        data: mockTasks,
        isLoading: false
      });
  
      render(<TasksWidget />);
  
      fireEvent.click(screen.getByRole('button', { name: '1' }));
      expect(mockNavigate).toHaveBeenCalledWith(expectedUrl);
    }
  );
  

  it('navigates to tasks when header arrow clicked', () => {
    (useAllTasks as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false
    });

    render(<TasksWidget />);

    fireEvent.click(screen.getByRole('button', { name: /open tasks/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/tasks?mine=true');
  });
});
