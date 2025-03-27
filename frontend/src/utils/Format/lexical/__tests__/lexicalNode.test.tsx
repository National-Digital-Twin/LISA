import { render, screen } from '@testing-library/react';
import { lexicalNode } from '../lexicalNode';
import { Key, Node } from '../types';

jest.mock('../paragraph', () => ({
  paragraph: (node: Node, key: Key) => (
    <div data-testid="paragraph" key={key}>
      {node.text ?? 'Paragraph'}
    </div>
  )
}));

jest.mock('../linebreak', () => ({
  linebreak: (key: Key) => <br key={key} data-testid="linebreak" />
}));

describe('lexicalNode function', () => {
  it('should render a text node', () => {
    const node: Node = { type: 'text', text: 'Sample Text' };
    render(<>{lexicalNode(node, 'text-key')}</>);
    const spanElement = screen.getByText('Sample Text');
    expect(spanElement).toBeInTheDocument();
    expect(spanElement.tagName).toBe('SPAN');
  });

  it('should render a paragraph node using the mocked paragraph function', () => {
    const node: Node = { type: 'paragraph', text: 'Paragraph Text' };
    render(<>{lexicalNode(node, 'para-key')}</>);
    expect(screen.getByTestId('paragraph')).toHaveTextContent('Paragraph Text');
  });

  it('should render a mention node', () => {
    const node: Node = {
      type: 'mention',
      text: 'Mentioned User',
      mentionName: 'User123',
      mentionType: 'User'
    };
    render(<>{lexicalNode(node, 'mention-key')}</>);
    const mentionElement = screen.getByText('Mentioned User');
    expect(mentionElement).toBeInTheDocument();
    expect(mentionElement).toHaveAttribute('data-lexical-mention', node.mentionName);
    expect(mentionElement).toHaveAttribute('data-lexical-mention-type', node.mentionType);
  });

  it('should render a linebreak node using the mocked linebreak function', () => {
    const node: Node = { type: 'linebreak' };
    render(<>{lexicalNode(node, 'linebreak-key')}</>);
    expect(screen.getByTestId('linebreak')).toBeInTheDocument();
  });

  it('should return null for an unknown node type', () => {
    const node = { type: 'unknown' } as unknown as Node;
    const element = lexicalNode(node, 'unknown-key');
    expect(element).toBeNull();
  });
});
