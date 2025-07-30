import { render, screen } from '@testing-library/react';
import { mention } from '../mention';
import { Node } from '../types';

describe('mention function', () => {
  it('should render a user mention with correct attributes', () => {
    const node: Node = {
      type: 'mention',
      text: '@John Doe',
      mentionName: 'john_doe',
      mentionType: 'User'
    };

    render(<>{mention(node, 'mention-test-key')}</>);
    const mentionElement = screen.getByText('@John Doe');

    expect(mentionElement).toBeInTheDocument();
    expect(mentionElement).toHaveAttribute('data-lexical-mention', node.mentionName);
    expect(mentionElement).toHaveAttribute('data-lexical-mention-type', node.mentionType);
    expect(mentionElement.tagName).toBe('SPAN');
  });

  it('should render a log entry mention with correct attributes', () => {
    const node: Node = {
      type: 'mention',
      text: '#Log Entry 123',
      mentionName: 'log_123',
      mentionType: 'LogEntry'
    };

    render(<>{mention(node, 'log-mention-test-key')}</>);
    const mentionElement = screen.getByText('#Log Entry 123');

    expect(mentionElement).toBeInTheDocument();
    expect(mentionElement).toHaveAttribute('data-lexical-mention', node.mentionName);
    expect(mentionElement).toHaveAttribute('data-lexical-mention-type', node.mentionType);
  });

  it('should render a file mention with correct attributes', () => {
    const node: Node = {
      type: 'mention',
      text: '$document.pdf',
      mentionName: 'file_doc',
      mentionType: 'File'
    };

    render(<>{mention(node, 'file-mention-test-key')}</>);
    const mentionElement = screen.getByText('$document.pdf');

    expect(mentionElement).toBeInTheDocument();
    expect(mentionElement).toHaveAttribute('data-lexical-mention', node.mentionName);
    expect(mentionElement).toHaveAttribute('data-lexical-mention-type', node.mentionType);
  });

  it('should render any mention type with the text as provided', () => {
    const node: Node = {
      type: 'mention',
      text: 'Some mention text',
      mentionName: 'unknown',
      mentionType: 'Unknown' as never
    };

    render(<>{mention(node, 'unknown-mention-test-key')}</>);
    const mentionElement = screen.getByText('Some mention text');

    expect(mentionElement).toBeInTheDocument();
    expect(mentionElement).toHaveAttribute('data-lexical-mention', node.mentionName);
    expect(mentionElement).toHaveAttribute('data-lexical-mention-type', node.mentionType);
  });
});
