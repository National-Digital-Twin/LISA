import React, { JSX } from 'react';
import { render, screen } from '@testing-library/react';
import { linebreak } from '../linebreak';

interface BRAttributes
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLBRElement>, HTMLBRElement> {
  'data-testid': string;
}

describe('linebreak function', () => {
  it('should render a <br> element with the given key', () => {
    // Cast the returned element as a <br> element
    const brElement = linebreak('linebreak-test-key') as React.ReactElement<
      JSX.IntrinsicElements['br']
    >;

    // Define the props with our custom interface
    const props: BRAttributes = { 'data-testid': 'linebreak' };

    // Clone the element with the new props
    const brWithTestId = React.cloneElement(brElement, props);

    render(brWithTestId);

    // Now you can query the element by the test id.
    const renderedBr = screen.getByTestId('linebreak');
    expect(renderedBr.tagName).toBe('BR');
  });
});
