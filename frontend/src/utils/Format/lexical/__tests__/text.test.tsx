import { render, screen } from '@testing-library/react';
import { text } from '../text';
import { Node } from '../types';

describe('text function', () => {
  it('should render a text node inside a span', () => {
    const node: Node = { type: 'text', text: 'Just some text' };
    render(<>{text(node, 'text-key')}</>);
    const spanElement = screen.getByText('Just some text');
    expect(spanElement).toBeInTheDocument();
    expect(spanElement.tagName).toBe('SPAN');
  });
});
