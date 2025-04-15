import { type LogEntry } from 'common/LogEntry';
import { screen } from '@testing-library/react';
import Task from '../Task';
import { providersRender } from '../../../test-utils';

describe('Task Component', () => {
  const mockLogEntry: LogEntry = {
    incidentId: '123',
    id: 'log-123',
    task: {
      id: 'task-1',
      name: 'Investigate issue',
      description: 'Look into the failing pipeline',
      assignee: { username: 'jdoe', displayName: 'John Doe' },
      status: 'ToDo'
    },
    author: { username: 'author', displayName: 'Author Name' },
    dateTime: '2025-04-02T12:00:00Z',
    content: {text: "", json: ""},
    type: 'General'
  };

  it('renders task name, description, and assignee', () => {
    providersRender(<Task entry={mockLogEntry} />);

    expect(screen.getByText('Task name')).toBeInTheDocument();
    expect(screen.getByText('Investigate issue')).toBeInTheDocument();

    expect(screen.getByText('Assigned to')).toBeInTheDocument();
    expect(screen.getByText('jdoe')).toBeInTheDocument();

    expect(screen.getByText('Task description')).toBeInTheDocument();
    expect(screen.getByText('Look into the failing pipeline')).toBeInTheDocument();
  });

  it('returns null if task is not present in entry', () => {
    const noTaskEntry = { ...mockLogEntry, task: undefined };
    providersRender(<Task entry={noTaskEntry} />);
    expect(screen.queryByText('Task name')).not.toBeInTheDocument();
  });  
});
