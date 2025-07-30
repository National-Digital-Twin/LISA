// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

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
import PersonIcon from '@mui/icons-material/Person';
import ArticleIcon from '@mui/icons-material/Article';
import AttachFileIcon from '@mui/icons-material/AttachFile';

// Local imports
import { type MentionableType, type Mentionable } from 'common/Mentionable';
import { $createMentionNode } from './nodes/MentionNode';

const TRIGGERS = {
  USER: '@',
  LOG: '#',
  FILE: '$'
} as const;

const TRIGGER_TO_TYPE: Record<string, MentionableType> = {
  [TRIGGERS.USER]: 'User',
  [TRIGGERS.LOG]: 'LogEntry',
  [TRIGGERS.FILE]: 'File'
};

const PUNCTUATION = '\\.,\\+\\*\\?\\$\\@\\|{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';
const VALID_CHARS = `[^${PUNCTUATION}\\s]`;
const VALID_JOINS = [
  '(?:',
  '\\.[ |$]|',
  ' |',
  '[',
  PUNCTUATION,
  ']|',
  ')'
].join('');

const LENGTH_LIMIT = 75;
const SUGGESTION_LIST_LENGTH_LIMIT = 5;
const LOOKUP_TIMEOUT = 100;

function createTriggerRegex(trigger: string): RegExp {
  return new RegExp([
    '(^|\\s|\\()(',
    '[',
    trigger,
    ']',
    '((?:',
    VALID_CHARS,
    VALID_JOINS,
    '){0,',
    LENGTH_LIMIT,
    '})',
    ')$'
  ].join(''));
}

const lookupService = {
  search(
    data: Array<Mentionable>,
    trigger: string,
    searchString: string,
    callback: (results: Array<Mentionable>) => void
  ): void {
    setTimeout(() => {
      const type = TRIGGER_TO_TYPE[trigger];
      const match = searchString.trim().toLowerCase();
      
      const results = data.filter((mention) => 
        mention.type === type && 
        mention.label.toLowerCase().includes(match)
      );
      callback(results);
    }, LOOKUP_TIMEOUT);
  }
};

function useMentionLookupService(
  mentionables: Array<Mentionable>, 
  trigger: string | null, 
  mentionString: string | null
) {
  const [results, setResults] = useState<Array<Mentionable>>([]);

  useEffect(() => {
    if (trigger == null || mentionString == null) {
      setResults([]);
      return;
    }
    lookupService.search(mentionables, trigger, mentionString, setResults);
  }, [mentionables, trigger, mentionString]);

  return results;
}

function checkForMentions(text: string, minMatchLength: number): MenuTextMatch | null {
  const triggerList = Object.values(TRIGGERS);
  
  const match = triggerList
    .map(trigger => ({ trigger, regex: createTriggerRegex(trigger) }))
    .map(({ trigger, regex }) => ({ trigger, match: regex.exec(text) }))
    .find(({ match }) => match !== null);
  
  if (match?.match) {
    const maybeLeadingWhitespace = match.match[1];
    const matchingString = match.match[3];
    
    if (matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: match.match[2]
      };
    }
  }
  return null;
}

function getPossibleQueryMatch(text: string): MenuTextMatch | null {
  return checkForMentions(text, 0); // Start showing suggestions immediately
}

class MentionTypeaheadOption extends MenuOption {
  id: string;

  type: MentionableType;

  name: string;

  trigger: string;

  constructor(mention: Mentionable, trigger: string) {
    super(mention.label);
    this.id = mention.id;
    this.type = mention.type;
    this.name = mention.label;
    this.trigger = trigger;
  }
}

function MentionsTypeaheadMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: Readonly<{
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: MentionTypeaheadOption;
}>) {
  const className = `item${isSelected ? ' selected' : ''}`;
  
  const onKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === 'Enter') {
      onClick();
    }
  };
  
  const getIcon = () => {
    switch (option.type) {
      case 'User':
        return <PersonIcon />;
      case 'LogEntry':
        return <ArticleIcon />;
      case 'File':
        return <AttachFileIcon />;
      default:
        return null;
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
      {getIcon()}
      <span className="text">{option.name}</span>
    </li>
  );
}

type MentionsPluginProps = {
  mentionables: Array<Mentionable>;
};

export default function MentionsPlugin({ mentionables }: Readonly<MentionsPluginProps>):
  JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);
  const [currentTrigger, setCurrentTrigger] = useState<string | null>(null);

  const results = useMentionLookupService(mentionables, currentTrigger, queryString);

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  });

  const options = useMemo(
    () => results
      .map((result) => new MentionTypeaheadOption(result, currentTrigger || TRIGGERS.USER))
      .slice(0, SUGGESTION_LIST_LENGTH_LIMIT),
    [results, currentTrigger],
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
      const match = getPossibleQueryMatch(text);
      if (match) {
        const trigger = match.replaceableString.charAt(0);
        setCurrentTrigger(trigger);
      }
      return match;
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
