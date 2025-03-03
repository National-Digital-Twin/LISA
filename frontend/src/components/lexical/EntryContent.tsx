// Global imports
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { $getRoot, type EditorState, type LexicalEditor } from 'lexical';
import { useState } from 'react';

// Local imports
import { type Mentionable } from 'common/Mentionable';
import EntryContentTheme from './EntryContentTheme';
import { ActionsPlugin, MentionsPlugin, nodes, SpeechToTextPlugin } from './plugins';
import { SPEECH_TO_TEXT_COMMAND } from './plugins/SpeechToTextPlugin';

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

type EntryContentProps = {
  id: string,
  json?: string,
  editable: boolean,
  mentionables?: Array<Mentionable>,
  speechToTextActive: boolean,
  onChange?: (id: string, json: string, text: string) => void,
  onSpeechToText?: (active: boolean) => void,
  toggleRecording?: () => void
};

const EntryContent = ({
  id,
  json: _json = undefined,
  editable,
  mentionables = [],
  speechToTextActive,
  onChange = undefined,
  onSpeechToText = undefined,
  toggleRecording = undefined
}: EntryContentProps) => {
  const [json, setJSON] = useState<string | undefined>(_json);

  const onCommand = (type: string | undefined, active: boolean) => {
    console.log('calling onCommand', type, active);
    if (type === SPEECH_TO_TEXT_COMMAND.type) {
      if (typeof onSpeechToText === 'function') {
        onSpeechToText(active);
        if (toggleRecording) {
          toggleRecording();
        }
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
      <div className="editor-container">
        <div className="editor-inner">
          <PlainTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={null}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <MentionsPlugin mentionables={mentionables ?? []} />
          <SpeechToTextPlugin />
          <ActionsPlugin onCommand={onCommand} speechToTextActive={speechToTextActive} />
          <OnChangePlugin onChange={onEditorChange} />
        </div>
      </div>
    </LexicalComposer>
  );
};

export default EntryContent;
