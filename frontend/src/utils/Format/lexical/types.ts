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
