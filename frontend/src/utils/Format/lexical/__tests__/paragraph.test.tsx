import { JSX } from 'react';
import { render, screen } from '@testing-library/react';
import { paragraph } from '../paragraph';
import { Node, TypeFunction } from '../types';

describe('paragraph', () => {
  const renderChild: (node: Node, key: string) => JSX.Element = (node: Node, key: string) => (
    <span key={key} data-testid={`child-${key}`}>
      {node.text}
    </span>
  );

  it('renders a paragraph with text and no children', () => {
    const node: Node = { type: 'paragraph', text: 'Hello world!' };
    render(<>{paragraph(node, 'test-key', renderChild as TypeFunction)}</>);

    const pElement = screen.getByText('Hello world!');
    expect(pElement.tagName).toBe('P');
  });

  it('renders a paragraph with text and children', () => {
    const node: Node = {
      text: 'Parent text',
      type: 'paragraph',
      children: [
        { text: 'Child 1', type: 'text' },
        { text: 'Child 2', type: 'text' }
      ]
    };
    render(<>{paragraph(node, 'test-key', renderChild as TypeFunction)}</>);

    // Verify parent text is rendered inside the paragraph
    const parentText = screen.getByText('Parent text');
    expect(parentText).toBeInTheDocument();

    // Verify each child rendered by the renderChild function
    expect(screen.getByTestId('child-test-key.0')).toHaveTextContent('Child 1');
    expect(screen.getByTestId('child-test-key.1')).toHaveTextContent('Child 2');
  });

  it('renders a paragraph with empty text and children only', () => {
    const node: Node = {
      text: '',
      type: 'paragraph',
      children: [{ text: 'Only child', type: 'text' }]
    };
    render(<>{paragraph(node, 'test-key', renderChild as TypeFunction)}</>);

    expect(screen.getByTestId('child-test-key.0')).toHaveTextContent('Only child');
  });
});
