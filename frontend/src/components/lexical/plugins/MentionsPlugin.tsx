/**
 * Copied and modified from https://github.com/facebook/lexical.
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// Global imports
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  MenuTextMatch,
  useBasicTypeaheadTriggerMatch
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { TextNode } from 'lexical';
import { JSX, KeyboardEvent, useCallback, useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';

// Local imports
import { type MentionableType, type Mentionable } from 'common/Mentionable';
import { $createMentionNode } from './nodes/MentionNode';

const LOG_SUFFIX = 'log ';
const USER_SUFFIX = 'user ';
const FILE_SUFFIX = 'file ';

const TypesBySuffix: Record<string, MentionableType> = {
  [LOG_SUFFIX]: 'LogEntry',
  [USER_SUFFIX]: 'User',
  [FILE_SUFFIX]: 'File'
};

const PUNCTUATION = '\\.,\\+\\*\\?\\$\\@\\|{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';
const NAME = `\\b[A-Z][^\\s${PUNCTUATION}]`;

const DocumentMentionsRegex = {
  NAME,
  PUNCTUATION,
};

const PUNC = DocumentMentionsRegex.PUNCTUATION;

const TRIGGERS = ['@'].join('');

// Chars we expect to see in a mention (non-space, non-punctuation).
const VALID_CHARS = `[^${TRIGGERS}${PUNC}\\s]`;

// Non-standard series of chars. Each series must be preceded and followed by
// a valid char.
const VALID_JOINS = [
  '(?:',
  '\\.[ |$]|', // E.g. "r. " in "Mr. Smith"
  ' |', // E.g. " " in "Josh Duck"
  '[',
  PUNC,
  ']|', // E.g. "-' in "Salier-Hellendag"
  ')'
].join('');

const LENGTH_LIMIT = 75;

const AtSignMentionsRegex = new RegExp([
  '(^|\\s|\\()(',
  '[',
  TRIGGERS,
  ']',
  '((?:',
  VALID_CHARS,
  VALID_JOINS,
  '){0,',
  LENGTH_LIMIT,
  '})',
  ')$'
].join(''));

// 50 is the longest alias length limit.
const ALIAS_LENGTH_LIMIT = 50;

// Regex used to match alias.
const AtSignMentionsRegexAliasRegex = new RegExp([
  '(^|\\s|\\()(',
  '[',
  TRIGGERS,
  ']',
  '((?:',
  VALID_CHARS,
  '){0,',
  ALIAS_LENGTH_LIMIT,
  '})',
  ')$'
].join(''));

// At most, 5 suggestions are shown in the popup.
const SUGGESTION_LIST_LENGTH_LIMIT = 5;

const lookupService = {
  search(
    data: Array<Mentionable>,
    string: string,
    callback: (results: Array<Mentionable>) => void
  ): void {
    setTimeout(() => {
      let type: MentionableType = 'User';
      let match = string.trim().toLowerCase();
      Object.keys(TypesBySuffix).forEach((suffix) => {
        if (string.startsWith(suffix)) {
          type = TypesBySuffix[suffix];
          match = string.substring(suffix.length).trim().toLowerCase();
        }
      });

      const results = data.filter((mention) => mention.type === type
        && mention.label.toLocaleLowerCase().includes(match));
      callback(results);
    }, 500);
  }
};

function useMentionLookupService(mentionables: Array<Mentionable>, mentionString: string | null) {
  const [results, setResults] = useState<Array<Mentionable>>([]);

  useEffect(() => {
    if (mentionString == null) {
      setResults([]);
      return;
    }
    lookupService.search(mentionables, mentionString, (newResults) => {
      setResults(newResults);
    });
  }, [mentionables, mentionString]);

  return results;
}

function checkForAtSignMentions(
  text: string,
  minMatchLength: number,
): MenuTextMatch | null {
  let match = AtSignMentionsRegex.exec(text);

  if (match === null) {
    match = AtSignMentionsRegexAliasRegex.exec(text);
  }
  if (match !== null) {
    // The strategy ignores leading whitespace but we need to know it's
    // length to add it to the leadOffset
    const maybeLeadingWhitespace = match[1];

    const matchingString = match[3];
    if (matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: match[2],
      };
    }
  }
  return null;
}

function getPossibleQueryMatch(text: string): MenuTextMatch | null {
  return checkForAtSignMentions(text, 1);
}

class MentionTypeaheadOption extends MenuOption {
  id: string;

  type: MentionableType;

  name: string;

  picture: JSX.Element;

  constructor(mention: Mentionable, picture: JSX.Element) {
    super(mention.label);
    this.id = mention.id;
    this.type = mention.type;
    this.name = mention.label;
    this.picture = picture;
  }
}

function MentionsTypeaheadMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: MentionTypeaheadOption;
}) {
  const className = `item${isSelected ? ' selected' : ''}`;
  const onKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === 'Enter') {
      onClick();
    }
  };
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={className}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={`typeahead-item-${index}`}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {option.picture}
      <span className="text">{option.name}</span>
    </li>
  );
}

type MentionsPluginProps = {
  mentionables: Array<Mentionable>;
};

export default function MentionsPlugin({ mentionables }: MentionsPluginProps): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  const [queryString, setQueryString] = useState<string | null>(null);

  const results = useMentionLookupService(mentionables, queryString);

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  });

  const options = useMemo(
    () => results.map((result) => new MentionTypeaheadOption(result, <i className="icon user" />))
      .slice(0, SUGGESTION_LIST_LENGTH_LIMIT),
    [results],
  );

  const onSelectOption = useCallback(
    (
      selectedOption: MentionTypeaheadOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void,
    ) => {
      editor.update(() => {
        const mentionNode = $createMentionNode(
          selectedOption.id,
          selectedOption.type,
          selectedOption.name
        );
        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode);
        }
        mentionNode.select();
        closeMenu();
      });
    },
    [editor],
  );

  const checkForMentionMatch = useCallback(
    (text: string) => {
      const slashMatch = checkForSlashTriggerMatch(text, editor);
      if (slashMatch !== null) {
        return null;
      }
      return getPossibleQueryMatch(text);
    },
    [checkForSlashTriggerMatch, editor],
  );

  const menuRenderFn = (
    anchorElementRef: { current?: HTMLElement | null },
    arg1: {
      selectedIndex: number | null,
      selectOptionAndCleanUp: (option: MentionTypeaheadOption) => unknown,
      setHighlightedIndex: (index: number) => unknown
    }
  ) => {
    if (anchorElementRef.current && results.length > 0) {
      const { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex } = arg1;
      return ReactDOM.createPortal(
        <div className="typeahead-popover mentions-menu">
          <ul>
            {options.map((option, i: number) => (
              <MentionsTypeaheadMenuItem
                index={i}
                isSelected={selectedIndex === i}
                onClick={() => {
                  setHighlightedIndex(i);
                  selectOptionAndCleanUp(option);
                }}
                onMouseEnter={() => {
                  setHighlightedIndex(i);
                }}
                key={option.key}
                option={option}
              />
            ))}
          </ul>
        </div>,
        anchorElementRef.current
      );
    }
    return null;
  };

  const containers = document.getElementsByClassName('rollup-container');
  const [parent] = containers;

  return (
    <LexicalTypeaheadMenuPlugin<MentionTypeaheadOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForMentionMatch}
      options={options}
      menuRenderFn={menuRenderFn}
      parent={parent as HTMLElement}
    />
  );
}
