/**
 * Copied and modified from https://github.com/facebook/lexical.
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// Global imports
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { JSX, MouseEvent, useEffect, useState } from 'react';

// Local imports
import { Icons } from '../../../utils';
import { SPEECH_TO_TEXT_COMMAND, SUPPORT_SPEECH_RECOGNITION } from './SpeechToTextPlugin';

type ActionsPluginProps = {
  speechToTextActive: boolean,
  onCommand: (command: string | undefined, active: boolean) => void
};
export default function ActionsPlugin({
  speechToTextActive,
  onCommand
}: ActionsPluginProps): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const [isSpeechToText, setIsSpeechToText] = useState(false);

  useEffect(() => mergeRegister(
    editor.registerEditableListener((editable) => {
      setIsEditable(editable);
    })
  ), [editor]);

  useEffect(() => {
    if (speechToTextActive !== isSpeechToText) {
      editor.dispatchCommand(SPEECH_TO_TEXT_COMMAND, speechToTextActive);
      setIsSpeechToText(speechToTextActive);
      onCommand(SPEECH_TO_TEXT_COMMAND.type, speechToTextActive);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, speechToTextActive, isSpeechToText, setIsSpeechToText]);

  if (!isEditable) {
    return null;
  }

  const onToggleSpeechRecognition = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    const active = !isSpeechToText;
    editor.dispatchCommand(SPEECH_TO_TEXT_COMMAND, active);
    setIsSpeechToText(active);
    onCommand(SPEECH_TO_TEXT_COMMAND.type, active);
  };

  return (
    <div className="actions">
      {SUPPORT_SPEECH_RECOGNITION && (
        <button
          onClick={onToggleSpeechRecognition}
          className={`action-button action-button-mic ${isSpeechToText ? 'active' : ''}`}
          id="lexicalSpeechToText"
          title="Speech To Text"
          type="button"
          aria-label={`${isSpeechToText ? 'Enable' : 'Disable'} speech to text`}
        >
          <Icons.Mic />
        </button>
      )}
    </div>
  );
}
