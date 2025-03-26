// Global imports
import { useState } from 'react';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { $getRoot, type EditorState, type LexicalEditor } from 'lexical';
import { Box, styled } from '@mui/material';

// Local imports
import { type Mentionable } from 'common/Mentionable';
import EntryContentTheme from './EntryContentTheme';
import { ActionsPlugin, MentionsPlugin, nodes } from './plugins';
import { RECORD_COMMAND } from './plugins/constants';

const editorConfig = {
  namespace: 'LISA',
  nodes: [nodes.MentionNode],
  // Handling of errors during update
  onError(error: Error) {
    throw error;
  },
  // The editor theme
  theme: EntryContentTheme
};

const LexicalField = styled(Box, { shouldForwardProp: (prop) => prop !== 'error' })<{
  error: boolean;
}>(({ theme, error }) => ({
  backgroundColor: 'white',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  '&:before': {
    content: '""',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderBottom: `1px solid ${error ? theme.palette.error.main : theme.palette.divider}`,
    transition: theme.transitions.create('border-bottom-color', {
      duration: theme.transitions.duration.short,
      easing: theme.transitions.easing.easeOut
    })
  },
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.13)'
  },
  '&:focus-within': {
    backgroundColor: 'rgba(0, 0, 0, 0.13)'
  },
  '&:focus-within:before': {
    borderBottomColor: error ? theme.palette.error.main : theme.palette.primary.main,
    borderBottomWidth: 2
  },
  outline: 'none'
}));

type EntryContentProps = {
  id: string;
  json?: string;
  editable: boolean;
  mentionables?: Array<Mentionable>;
  recordingActive: boolean;
  onChange?: (id: string, json: string, text: string) => void;
  onRecording?: (active: boolean) => void;
  error: boolean;
};
const EntryContent = ({
  id,
  json: _json = undefined,
  editable,
  mentionables = [],
  recordingActive,
  onChange = undefined,
  onRecording = undefined,
  error
}: EntryContentProps) => {
  const [json, setJSON] = useState<string | undefined>(_json);

  const onCommand = (type: string | undefined, active: boolean) => {
    if (type === RECORD_COMMAND.type) {
      if (typeof onRecording === 'function') {
        onRecording(active);
      }
    }
  };

  const onEditorChange = (editorState: EditorState, editor: LexicalEditor) => {
    const editorJSON = JSON.stringify(editorState.toJSON());
    const parsedEditorState = editor.parseEditorState(editorJSON);
    const editorText = parsedEditorState.read(() => $getRoot().getTextContent());
    setJSON(editorJSON);
    if (typeof onChange === 'function') {
      onChange(id, editorJSON, editorText);
    }
  };

  return (
    <LexicalComposer
      initialConfig={{
        ...editorConfig,
        editable,
        editorState: json
      }}
    >
      <LexicalField error={error} className="editor-container">
        <div className="editor-inner">
          <PlainTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={null}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <MentionsPlugin mentionables={mentionables ?? []} />
          <ActionsPlugin onCommand={onCommand} recordingActive={recordingActive} />
          <OnChangePlugin onChange={onEditorChange} />
        </div>
      </LexicalField>
    </LexicalComposer>
  );
};

export default EntryContent;

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
