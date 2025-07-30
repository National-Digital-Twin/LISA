import { render, screen } from '@testing-library/react';
import { mention } from '../mention';
import { Node } from '../types';

describe('mention function', () => {
  const testCases: Array<{
    name: string;
    node: Node;
    expectedText: string;
  }> = [
    {
      name: 'a user mention',
      node: {
        type: 'mention' as const,
        text: '@John Doe',
        mentionName: 'john_doe',
        mentionType: 'User'
      },
      expectedText: '@John Doe'
    },
    {
      name: 'a log entry mention',
      node: {
        type: 'mention' as const,
        text: '#Log Entry 123',
        mentionName: 'log_123',
        mentionType: 'LogEntry'
      },
      expectedText: '#Log Entry 123'
    },
    {
      name: 'a file mention',
      node: {
        type: 'mention' as const,
        text: '$document.pdf',
        mentionName: 'file_doc',
        mentionType: 'File'
      },
      expectedText: '$document.pdf'
    },
    {
      name: 'any mention type with the text as provided',
      node: {
        type: 'mention' as const,
        text: 'Some mention text',
        mentionName: 'unknown',
        mentionType: 'Unknown' as never
      },
      expectedText: 'Some mention text'
    }
  ];

  testCases.forEach(testCase => {
    it(`should render ${testCase.name}`, () => {
      render(<>{mention(testCase.node, `${testCase.name}-test-key`)}</>);
      const mentionElement = screen.getByText(testCase.expectedText);

      expect(mentionElement).toBeInTheDocument();
      expect(mentionElement).toHaveAttribute('data-lexical-mention', testCase.node.mentionName);
      expect(mentionElement).toHaveAttribute('data-lexical-mention-type', testCase.node.mentionType);
    });
  });
});
