import { render, screen } from '@testing-library/react';
import { mention } from '../mention';
import { Node } from '../types';

describe('mention function', () => {
  it('should render a mention with correct attributes and text', () => {
    const node: Node = {
      type: 'mention',
      text: 'John Doe',
      mentionName: 'john_doe',
      mentionType: 'User'
    };

    render(<>{mention(node, 'mention-test-key')}</>);
    const mentionElement = screen.getByText('John Doe');

    expect(mentionElement).toBeInTheDocument();
    expect(mentionElement).toHaveAttribute('data-lexical-mention', node.mentionName);
    expect(mentionElement).toHaveAttribute('data-lexical-mention-type', node.mentionType);
    expect(mentionElement.tagName).toBe('SPAN');
  });
});
