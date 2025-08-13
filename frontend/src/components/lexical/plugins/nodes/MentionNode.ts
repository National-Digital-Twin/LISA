// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type EditorConfig,
  type LexicalNode,
  type NodeKey,
  type SerializedTextNode,
  type Spread,
  $applyNodeReplacement,
  TextNode,
} from 'lexical';

// Local imports
import { type MentionableType } from 'common/Mentionable';

export type SerializedMentionNode = Spread<
  {
    mentionName: string;
    text: string;
    mentionType: MentionableType;
  },
  SerializedTextNode
>;

function convertMentionElement(domNode: HTMLElement): DOMConversionOutput | null {
  const { textContent } = domNode;
  const type: MentionableType = domNode.getAttribute('data-lexical-mention-type') as MentionableType;
  const id: string = domNode.getAttribute('data-lexical-mention') as string;

  if (textContent !== null) {
    const node = $createMentionNode(textContent, type, id);
    return {
      node,
    };
  }

  return null;
}

const mentionStyle = 'background-color: rgba(24, 119, 232, 0.2)';

export class MentionNode extends TextNode {
  __mention: string;

  __mentionType: MentionableType;

  static getType(): string {
    return 'mention';
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(node.__mention, node.__mentionType, node.__text, node.__key);
  }

  static importJSON(serializedNode: SerializedMentionNode): MentionNode {
    const node = $createMentionNode(
      serializedNode.mentionName,
      serializedNode.mentionType,
      serializedNode.text
    );
    node.setTextContent(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  constructor(mentionName: string, type: MentionableType, text?: string, key?: NodeKey) {
    super(text ?? mentionName, key);
    this.__mention = mentionName;
    this.__mentionType = type;
  }

  exportJSON(): SerializedMentionNode {
    return {
      ...super.exportJSON(),
      mentionName: this.__mention,
      mentionType: this.__mentionType,
      type: 'mention',
      version: 1,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    dom.style.cssText = mentionStyle;
    dom.className = 'mention';
    return dom;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('span');
    element.setAttribute('data-lexical-mention', 'true');
    element.textContent = this.__text;
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-mention')) {
          return null;
        }
        return {
          conversion: convertMentionElement,
          priority: 1,
        };
      },
    };
  }

  isTextEntity(): boolean {
    return true;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }
}

export function $createMentionNode(
  mentionName: string,
  type: MentionableType,
  text: string
): MentionNode {
  const mentionNode = new MentionNode(mentionName, type, text);
  mentionNode.setMode('segmented').toggleDirectionless();
  return $applyNodeReplacement(mentionNode);
}

export function $isMentionNode(
  node: LexicalNode | null | undefined
): node is MentionNode {
  return node instanceof MentionNode;
}

export default MentionNode;
