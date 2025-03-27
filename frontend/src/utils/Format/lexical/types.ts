// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { ReactNode } from 'react';

// Local imports
import { type MentionableType } from 'common/Mentionable';

type NodeType = 'paragraph' | 'text' | 'mention' | 'linebreak';

export type Key = number | string;

export type Node = {
  type: NodeType;
  text?: string;
  children?: Array<Node>;
  mentionName?: string;
  mentionType?: MentionableType;
};

export type TypeFunction = (node: Node, key: Key) => ReactNode;
