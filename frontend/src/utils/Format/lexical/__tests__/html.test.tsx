import { render, screen } from '@testing-library/react';
import { html } from '../html';

describe('html function', () => {
  it('should render nothing when root is missing', () => {
    render(<>{html('{}')}</>);
    // Expect that no non-empty text is rendered.
    expect(screen.queryByText(/.+/)).toBeNull();
  });

  it('should render Typography with children when valid JSON is provided', () => {
    const jsonInput = JSON.stringify({
      root: {
        children: [{ type: 'text', text: 'Hello World' }]
      }
    });

    render(<>{html(jsonInput)}</>);
    // Check for the text rendered by the text node.
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
