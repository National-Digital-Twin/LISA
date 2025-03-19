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
import { ActionsPlugin, MentionsPlugin, nodes, SpeechToTextPlugin } from './plugins';
import { SPEECH_TO_TEXT_COMMAND } from './plugins/SpeechToTextPlugin';
import { useIsMobile } from '../../hooks/useIsMobile';

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
  speechToTextActive: boolean;
  onChange?: (id: string, json: string, text: string) => void;
  onSpeechToText?: (active: boolean) => void;
  error: boolean;
};
const EntryContent = ({
  id,
  json: _json = undefined,
  editable,
  mentionables = [],
  speechToTextActive,
  onChange = undefined,
  onSpeechToText = undefined,
  error
}: EntryContentProps) => {
  const [json, setJSON] = useState<string | undefined>(_json);
  const isMobile = useIsMobile();

  const onCommand = (type: string | undefined, active: boolean) => {
    if (type === SPEECH_TO_TEXT_COMMAND.type) {
      if (typeof onSpeechToText === 'function') {
        onSpeechToText(active);
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
          {!isMobile && <SpeechToTextPlugin />}
          <ActionsPlugin onCommand={onCommand} speechToTextActive={speechToTextActive} />
          <OnChangePlugin onChange={onEditorChange} />
        </div>
      </LexicalField>
    </LexicalComposer>
  );
};

export default EntryContent;
