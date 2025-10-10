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
import {
  TextNode,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
} from 'lexical';
import { JSX, KeyboardEvent, useCallback, useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import PersonIcon from '@mui/icons-material/Person';
import ArticleIcon from '@mui/icons-material/Article';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import TaskIcon from '@mui/icons-material/Task';

// Local imports
import { type MentionableType, type Mentionable } from 'common/Mentionable';
import { $createMentionNode } from './nodes/MentionNode';

const BASE_TRIGGER = '@';

// longest triggers first for future key shortcuts
const TRIGGERS = {
  USER: '@u',
  LOG: '@l',
  FILE: '@f',
  TASK: '@t',
  DEFAULT: BASE_TRIGGER
} as const;

const TRIGGER_TO_TYPE: Record<string, MentionableType> = {
  [TRIGGERS.USER]: 'User',
  [TRIGGERS.LOG]: 'LogEntry',
  [TRIGGERS.FILE]: 'File',
  [TRIGGERS.TASK]: 'Task'
};

const PUNCTUATION = '\\.,\\+\\*\\?\\$\\@\\|{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';
const VALID_CHARS = `[^${PUNCTUATION}\\s]`;
const VALID_JOINS = ['(?:', '\\.[ |$]|', ' |', '[', PUNCTUATION, ']|', ')'].join('');

const LENGTH_LIMIT = 75;
const SUGGESTION_LIST_LENGTH_LIMIT = 5;

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
    const query = (searchString ?? '').trim().toLowerCase();

    const pool = data.filter((m) => m.type === type);

    if (!query) {
      const allAZ = [...pool].sort((a, b) =>
        a.label.localeCompare(b.label, undefined, { sensitivity: 'base' })
      );
      callback(allAZ);
      return;
    }

    const starts: Mentionable[] = [];
    const contains: Mentionable[] = [];

    for (const candidate of pool) {
      const name = candidate.label.toLowerCase();
      if (name.startsWith(query)) {
        starts.push(candidate);
      } else if (name.includes(query)) {
        contains.push(candidate);
      }
    }

    starts.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));
    contains.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));

    callback([...starts, ...contains]);
  },
};

function useMentionLookupService(
  mentionables: Array<Mentionable>,
  type: MentionableType | null,
  mentionString: string | null
) {
  const [results, setResults] = useState<Array<Mentionable>>([]);

  useEffect(() => {
    if (!type) {
      setResults([]);
      return;
    }
    lookupService.search(mentionables, type, mentionString, setResults);
  }, [mentionables, type, mentionString]);

  return results;
}

function checkForMentions(text: string, minMatchLength: number = 0): MenuTextMatch | null {
  const triggerList = Object.values(TRIGGERS);
  const sanitizedText = triggerList.reduce(
    (current, next) => current.replace(`${next}:`, next),
    text
  );

  const match = triggerList
    .map((trigger) => ({ trigger, regex: createTriggerRegex(trigger) }))
    .map(({ trigger, regex }) => ({ trigger, match: regex.exec(sanitizedText) }))
    .find(({ match }) => match !== null);

  if (match?.match) {
    const maybeLeadingWhitespace = match.match[1];

    const matchingString = triggerList.reduce(
      (current, next) => (next === BASE_TRIGGER ? current : current.replace(next, '')),
      match.match[2]
    );

    const replaceableString = triggerList.reduce(
      (current, next) => (next === BASE_TRIGGER ? current : current.replace(next, `${next}:`)),
      match.match[2]
    );

    if (matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString
      };
    }
  }
  return null;
}

function extractMentionQuery(text: string | null): string {
  if (!text) return '';
  return text.replace(/^@([ulft])?:?/i, '');
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

export default function MentionsPlugin({mentionables}: Readonly<MentionsPluginProps>): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [filter, setFilter] = useState<string | null>(null);
  const [currentTrigger, setCurrentTrigger] = useState<string>(TRIGGERS.DEFAULT);

  const typeForLookup: MentionableType | null =
    currentTrigger !== TRIGGERS.DEFAULT ? TRIGGER_TO_TYPE[currentTrigger] : null;

  const results = useMentionLookupService(
    mentionables,
    typeForLookup,
    extractMentionQuery(filter)
  );

  const matchSlash = useBasicTypeaheadTriggerMatch('/', { minLength: 0 });

  const triggerFn = useCallback(
    (text: string) => {
      if (matchSlash(text, editor) !== null) return null;
      return checkForMentions(text);
    },
    [matchSlash, editor]
  );

  const defaultMentions: Array<Mentionable> = useMemo(
    () => [
      { id: '0', label: 'User', type: 'User' },
      { id: '1', label: 'Log Entry', type: 'LogEntry' },
      { id: '2', label: 'File', type: 'File' },
      { id: '3', label: 'Task', type: 'Task' }
    ],
    []
  );

  const defaultOptions = useMemo(
    () =>
      defaultMentions
        .map(
          ({ id, label, type }, index) =>
            new MentionTypeaheadOption(
              { id, label, type },
              Object.values(TRIGGERS)[index] ?? null,
              true,
              !mentionables.some((m) => m.type === type)
            )
        )
        .filter((m) => !m.disabled),
    [mentionables, defaultMentions]
  );

  const mentionOptions = useMemo(
    () =>
      results
        .map((result) => new MentionTypeaheadOption(result, currentTrigger, false))
        .slice(0, SUGGESTION_LIST_LENGTH_LIMIT),
    [results, currentTrigger]
  );

  const options = currentTrigger !== TRIGGERS.DEFAULT ? mentionOptions : defaultOptions;

  const handleQueryChange = useCallback((matchingString: string | null) => {
    const q = matchingString ?? '';
    setFilter(q);
    if (q === '@') {
      setCurrentTrigger(TRIGGERS.DEFAULT);
    }
  }, []);

  const handleCategoryPick = useCallback((opt: MentionTypeaheadOption) => {
    if (opt.disabled) return;
    const trig = opt.trigger ?? TRIGGERS.DEFAULT;
    setCurrentTrigger(trig);

    editor.update(() => { 
      const replacement = `${trig}:`;
      const sel = $getSelection();
      if ($isRangeSelection(sel)) {
        const focusNode = sel.focus.getNode();
        if ($isTextNode(focusNode)) {
          const text = focusNode.getTextContent();
          const focusOffset = sel.focus.offset;
          const atIndex = text.lastIndexOf('@', Math.max(0, focusOffset - 1));
          if (atIndex !== -1) {
            focusNode.spliceText(atIndex, focusOffset, replacement);
            sel.setTextNodeRange(
              focusNode,
              atIndex + replacement.length,
              focusNode,
              atIndex + replacement.length
            );
          } else {
            sel.insertText(replacement);
          }
        } else {
          sel.insertText(replacement);
        }
      }
    });

    setFilter(`${trig}:`);
  }, [editor]);

  const onSelectOption = useCallback(
    (
      selectedOption: MentionTypeaheadOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void
    ) => {
      if (selectedOption.map) {
        return;
      }

      editor.update(() => {
        const mentionNode = $createMentionNode(
          selectedOption.id,
          selectedOption.type,
          selectedOption.name
        );
        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode);
        } else {
          const sel = $getSelection();
          if ($isRangeSelection(sel)) sel.insertNodes([mentionNode]);
        }
        mentionNode.select();
      });
      closeMenu();
    },
    [editor]
  );

  const menuRenderFn = (
    anchorElementRef: { current?: HTMLElement | null },
    arg1: {
      selectedIndex: number | null;
      selectOptionAndCleanUp: (option: MentionTypeaheadOption) => unknown;
      setHighlightedIndex: (index: number) => unknown;
    }
  ) => {
    if (!anchorElementRef.current || !options?.length) return null;
    const { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex } = arg1;

    return ReactDOM.createPortal(
      <div className="typeahead-popover mentions-menu">
        <ul>
          {options.map((option, i: number) => {
            const onClick =
              option.map
                ? () => {
                  setHighlightedIndex(i);
                  handleCategoryPick(option);
                }
                : () => {
                  setHighlightedIndex(i);
                  selectOptionAndCleanUp(option);
                };

            return (
              <MentionsTypeaheadMenuItem
                index={i}
                isSelected={selectedIndex === i}
                onClick={onClick}
                onMouseEnter={() => setHighlightedIndex(i)}
                key={option.key}
                option={option}
              />
            );
          })}
        </ul>
      </div>,
      anchorElementRef.current
    );
  };

  const containers = document.getElementsByClassName('rollup-container');
  const parent = containers.length ? (containers[0] as HTMLElement) : undefined;

  return (
    <LexicalTypeaheadMenuPlugin<MentionTypeaheadOption>
      onQueryChange={handleQueryChange}
      onSelectOption={onSelectOption}
      triggerFn={triggerFn}
      options={options}
      menuRenderFn={menuRenderFn}
      parent={parent}
    />
  );
}
