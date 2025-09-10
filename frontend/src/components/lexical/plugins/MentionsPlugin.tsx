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
import TaskIcon from '@mui/icons-material/Task';

// Local imports
import { type MentionableType, type Mentionable } from 'common/Mentionable';
import { $createMentionNode } from './nodes/MentionNode';

// longest triggers first for future key shortcuts

const TRIGGERS = {
  DEFAULT: '@'
} as const;

const PUNCTUATION = '\\.,\\+\\*\\?\\$\\@\\|{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';
const VALID_CHARS = `[^${PUNCTUATION}\\s]`;
const VALID_JOINS = ['(?:', '\\.[ |$]|', ' |', '[', PUNCTUATION, ']|', ')'].join('');

const LENGTH_LIMIT = 75;
const SUGGESTION_LIST_LENGTH_LIMIT = 5;
const LOOKUP_TIMEOUT = 100;

function createTriggerRegex(trigger: string): RegExp {
  return new RegExp(
    [
      '(^|\\s|\\()(',
      '(',
      trigger,
      ')',
      '((?:',
      VALID_CHARS,
      VALID_JOINS,
      '){0,',
      LENGTH_LIMIT,
      '})',
      ')$'
    ].join('')
  );
}

const lookupService = {
  search(
    data: Array<Mentionable>,
    type: string,
    searchString: string | null,
    callback: (results: Array<Mentionable>) => void
  ): void {
    setTimeout(() => {
      const match = searchString !== null ? searchString.trim().toLowerCase() : '';

      const results = data.filter(
        (mention) => mention.type === type && mention.label.toLowerCase().includes(match)
      );
      callback(results);
    }, LOOKUP_TIMEOUT);
  }
};

function useMentionLookupService(
  mentionables: Array<Mentionable>,
  type: MentionableType | null,
  mentionString: string | null
) {
  const [results, setResults] = useState<Array<Mentionable>>([]);

  useEffect(() => {
    if (type == null) {
      setResults([]);
      return;
    }
    lookupService.search(mentionables, type, mentionString, setResults);
  }, [mentionables, type, mentionString]);

  return results;
}

function checkForMentions(text: string, minMatchLength: number): MenuTextMatch | null {
  const triggerList = Object.values(TRIGGERS);

  const match = triggerList
    .map((trigger) => ({ trigger, regex: createTriggerRegex(trigger) }))
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

  trigger: string | null;
  map: boolean;
  disabled: boolean;

  constructor(mention: Mentionable, trigger: string | null, map: boolean, disabled = false) {
    super(mention.label);
    this.id = mention.id;
    this.type = mention.type;
    this.name = mention.label;
    this.trigger = trigger;
    this.map = map;
    this.disabled = disabled;
  }
}

function MentionsTypeaheadMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option
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
      case 'Task':
        return <TaskIcon />;
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
      aria-disabled={option.disabled}
    >
      {getIcon()}
      <span className="text">{option.name}</span>
    </li>
  );
}

type MentionsPluginProps = {
  mentionables: Array<Mentionable>;
};

export default function MentionsPlugin({
  mentionables
}: Readonly<MentionsPluginProps>): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [type, setType] = useState<MentionableType | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  // remove leading filter
  const results = useMentionLookupService(
    mentionables,
    type || 'User',
    filter ? filter.slice(1) : ''
  );

  const onQueryChange = () => {};

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0
  });

  const defaultMentions: Array<Mentionable> = [
    { id: '0', label: 'User', type: 'User' },
    { id: '1', label: 'File', type: 'File' },
    { id: '2', label: 'Log Entry', type: 'LogEntry' },
    { id: '3', label: 'Task', type: 'Task' }
  ];

  const defaultOptions = useMemo(
    () =>
      defaultMentions
        .map(
          ({ id, label, type }) =>
            new MentionTypeaheadOption(
              { id, label, type },
              TRIGGERS.DEFAULT,
              true,
              !mentionables.some((m) => m.type === type)
            )
        )
        .filter((m) => !m.disabled),
    [mentionables]
  );

  const mentionOptions = useMemo(
    () =>
      results
        .map((result) => new MentionTypeaheadOption(result, type || null, false))
        .slice(0, SUGGESTION_LIST_LENGTH_LIMIT),
    [results, type]
  );

  const options = type ? mentionOptions : defaultOptions;

  const onSelectOption = useCallback(
    (
      selectedOption: MentionTypeaheadOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void
    ) => {
      if (selectedOption.map) {
        if (!selectedOption.disabled) {
          setType(selectedOption.type);
          setFilter(null);
        }
      } else {
        setType(null);
        setFilter(null);
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
      }
    },
    [editor]
  );

  const checkForMentionMatch = useCallback(
    (text: string) => {
      const slashMatch = checkForSlashTriggerMatch(text, editor);
      if (slashMatch !== null) {
        return null;
      }
      const match = getPossibleQueryMatch(text);
      if (match) {
        const trigger = match.replaceableString;
        setFilter(trigger);
      }
      return match;
    },
    [checkForSlashTriggerMatch, editor]
  );

  const menuRenderFn = (
    anchorElementRef: { current?: HTMLElement | null },
    arg1: {
      selectedIndex: number | null;
      selectOptionAndCleanUp: (option: MentionTypeaheadOption) => unknown;
      setHighlightedIndex: (index: number) => unknown;
    }
  ) => {
    if (anchorElementRef.current && options?.length) {
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
      onQueryChange={onQueryChange}
      onSelectOption={onSelectOption}
      triggerFn={checkForMentionMatch}
      options={options}
      menuRenderFn={menuRenderFn}
      parent={parent as HTMLElement}
    />
  );
}
