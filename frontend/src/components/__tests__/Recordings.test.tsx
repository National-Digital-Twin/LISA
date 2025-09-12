// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { render, screen, fireEvent } from '@testing-library/react';
import Recordings from '../Recordings';

describe('Recordings component', () => {
  const mockOnRecordingsChanged = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows "No recordings" when empty', () => {
    render(<Recordings recordings={[]} onRecordingsChanged={mockOnRecordingsChanged} />);

    expect(screen.getByText('No recordings')).toBeInTheDocument();
  });

  it('displays recordings when they exist', () => {
    const recordings = [new File(['audio'], 'Recording.webm', { type: 'audio/webm' })];

    render(
      <Recordings recordings={recordings} onRecordingsChanged={mockOnRecordingsChanged} />
    );

    expect(screen.getByText('1 recording')).toBeInTheDocument();
    expect(screen.getByText(/Recording\.webm/)).toBeInTheDocument();
  });

  it('calls onRecordingsChanged when removing recording', () => {
    const recordings = [new File(['audio'], 'Recording.webm', { type: 'audio/webm' })];

    render(
      <Recordings recordings={recordings} onRecordingsChanged={mockOnRecordingsChanged} />
    );

    const removeButton = screen.getByTestId('CloseIcon');
    fireEvent.click(removeButton);

    expect(mockOnRecordingsChanged).toHaveBeenCalledWith([]);
  });
});
