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

  it('shows "No voice recordings" when empty', () => {
    render(<Recordings recordings={[]} onRecordingsChanged={mockOnRecordingsChanged} />);

    expect(screen.getByText('No voice recordings')).toBeInTheDocument();
  });

  it('displays recordings when they exist', () => {
    const recordings = [new File(['audio'], 'Recording.mp3', { type: 'audio/mpeg' })];

    render(
      <Recordings recordings={recordings} onRecordingsChanged={mockOnRecordingsChanged} />
    );

    expect(screen.getByText('1 voice recording')).toBeInTheDocument();
    expect(screen.getByText(/Recording\.mp3/)).toBeInTheDocument();
  });

  it('calls onRecordingsChanged when removing voice recording', () => {
    const recordings = [new File(['audio'], 'Recording.mp3', { type: 'audio/mpeg' })];

    render(
      <Recordings recordings={recordings} onRecordingsChanged={mockOnRecordingsChanged} />
    );

    const removeButton = screen.getByTestId('CloseIcon');
    fireEvent.click(removeButton);

    expect(mockOnRecordingsChanged).toHaveBeenCalledWith([]);
  });
});
