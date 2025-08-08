import { type Task as TaskData } from 'common/Task';
import { screen } from '@testing-library/react';
import Task from '../Task';
import { providersRender } from '../../../test-utils';

describe('Task Component', () => {
  const mockTask: TaskData = {
    id: 'task-1',
    incidentId: '123',
    name: 'Investigate issue',
    description: 'Look into the failing pipeline',
    assignee: { username: 'jdoe', displayName: 'John Doe', email: 'jdoe@test.com', groups: [] },
    status: 'ToDo',
    author: { username: 'author', displayName: 'Author Name', email: 'author@test.com', groups: [] },
    createdAt: '2025-04-02T12:00:00Z',
    sequence: '1'
  };

  it('renders task name, description, and assignee', () => {
    providersRender(<Task task={mockTask} />);

    expect(screen.getByText('Task name:')).toBeInTheDocument();
    expect(screen.getByText('Investigate issue')).toBeInTheDocument();

    expect(screen.getByText('Assigned to:')).toBeInTheDocument();
    expect(screen.getByText('jdoe')).toBeInTheDocument();

    expect(screen.getByText('Task description')).toBeInTheDocument();
    expect(screen.getByText('Look into the failing pipeline')).toBeInTheDocument();
  });
});
