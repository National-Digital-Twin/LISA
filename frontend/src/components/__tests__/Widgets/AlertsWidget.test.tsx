// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { useNavigate } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import AlertsWidget from '../../Widgets/AlertsWidget';
import { useNotifications } from '../../../hooks/useNotifications';

jest.mock('../../../hooks/useNotifications');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('AlertsWidget', () => {
  const mockNotifications = [
    { id: 1, read: false },
    { id: 2, read: false },
    { id: 3, read: true },
  ];

  beforeEach(() => {
    (useNotifications as jest.Mock).mockReturnValue({ notifications: mockNotifications });
  });

  it('renders with correct unread count', () => {
    render(<AlertsWidget />);
    expect(screen.getByText(/alerts/i)).toBeInTheDocument();
    expect(screen.getByText('2 unread')).toBeInTheDocument();
    expect(screen.getByText(/notifications/i)).toBeInTheDocument();
  });

  it('renders the arrow button and handles click', () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    render(<AlertsWidget />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('/notifications');
  });
});
