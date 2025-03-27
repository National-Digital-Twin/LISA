import { mentionables } from '../mentionables';

describe('mentionables', () => {
  it('should return an empty array when no mention is present', () => {
    const json = JSON.stringify({
      root: {
        type: 'text',
        text: 'Hello, world!',
        children: []
      }
    });
    expect(mentionables(json)).toEqual([]);
  });

  it('should return a single mention when the root node is a mention', () => {
    const json = JSON.stringify({
      root: {
        type: 'mention',
        mentionName: 'john',
        mentionType: 'user',
        text: 'John Doe'
      }
    });
    expect(mentionables(json)).toEqual([{ id: 'john', label: 'John Doe', type: 'user' }]);
  });

  it('should find mentions in nested children', () => {
    const json = JSON.stringify({
      root: {
        type: 'container',
        children: [
          {
            type: 'mention',
            mentionName: 'anna',
            mentionType: 'user',
            text: 'Anna Smith'
          },
          {
            type: 'text',
            text: 'Not a mention'
          },
          {
            type: 'container',
            children: [
              {
                type: 'mention',
                mentionName: 'bob',
                mentionType: 'group',
                text: 'Bob Group'
              }
            ]
          }
        ]
      }
    });
    expect(mentionables(json)).toEqual([
      { id: 'anna', label: 'Anna Smith', type: 'user' },
      { id: 'bob', label: 'Bob Group', type: 'group' }
    ]);
  });

  it('should ignore mention nodes missing required fields', () => {
    const json = JSON.stringify({
      root: {
        type: 'container',
        children: [
          {
            type: 'mention',
            // missing mentionType
            mentionName: 'john',
            text: 'John Doe'
          },
          {
            type: 'mention',
            // missing mentionName
            mentionType: 'user',
            text: 'Jane Doe'
          },
          {
            type: 'mention',
            mentionName: 'valid',
            mentionType: 'user',
            text: 'Valid Mention'
          }
        ]
      }
    });
    expect(mentionables(json)).toEqual([{ id: 'valid', label: 'Valid Mention', type: 'user' }]);
  });
});
