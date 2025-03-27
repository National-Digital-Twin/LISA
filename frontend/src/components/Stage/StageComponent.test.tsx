// Stage.test.tsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Stage from './Stage';

describe('Stage component', () => {
  it('renders with default size and width', () => {
    render(<Stage label="Monitoring Stage" stage="Monitoring" />);
    const chipElement = screen.getByText('Monitoring Stage');
    expect(chipElement).toBeInTheDocument();
  });

  it('renders with custom size and width', () => {
    render(<Stage label="Response Stage" stage="Response" size="small" width={200} />);
    const chipElement = screen.getByText('Response Stage');
    expect(chipElement).toBeInTheDocument();
  });

  it('applies correct styling based on the stage prop', () => {
    // Render the component with a specific stage prop.
    const { asFragment } = render(<Stage label="Recovery Stage" stage="Recovery" />);
    const chipElement = screen.getByText('Recovery Stage');
    expect(chipElement).toBeInTheDocument();

    // Use asFragment() for snapshot testing instead of container.firstChild.
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot for Closed stage', () => {
    const { asFragment } = render(<Stage label="Closed Stage" stage="Closed" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
