import { pretty } from './index';

describe('pretty.name', () => {
  const nameTests: Array<{ description: string; input: string; expected: string }> = [
    {
      description: 'converts a simple lowercase name to title case',
      input: 'john doe',
      expected: 'John Doe'
    },
    {
      description: 'handles names with non-word characters',
      input: 'john-doe',
      expected: 'John Doe'
    },
    {
      description: 'handles names with extra spaces and punctuation',
      input: '  jane..doe!  ',
      expected: 'Jane Doe'
    },
    {
      description: 'returns an empty string when an empty string is provided',
      input: '',
      expected: ''
    }
  ];

  nameTests.forEach(({ description, input, expected }) => {
    it(`${description}`, () => {
      expect(pretty.name(input)).toBe(expected);
    });
  });
});

describe('pretty.initials', () => {
  const initialsTests: Array<{ description: string; input: string; expected: string }> = [
    {
      description: 'returns the initials for a simple two-word name',
      input: 'john doe',
      expected: 'JD'
    },
    {
      description: 'returns the initials for a multi-word name',
      input: 'john doe smith',
      expected: 'JDS'
    },
    {
      description: 'handles names with dots or extra spaces',
      input: 'anna.marie lee',
      expected: 'AML'
    },
    {
      description: 'trims the name before processing',
      input: '  alice park  ',
      expected: 'AP'
    }
  ];

  initialsTests.forEach(({ description, input, expected }) => {
    it(`${description}`, () => {
      expect(pretty.initials(input)).toBe(expected);
    });
  });
});
