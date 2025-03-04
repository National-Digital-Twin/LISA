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
import { JSX, useEffect, useState } from 'react';

// Local imports
import { Icons } from '../../../utils';
import { SPEECH_TO_TEXT_COMMAND, SUPPORT_SPEECH_RECOGNITION } from './SpeechToTextPlugin';

export default function ActionsPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [isEditable, setIsEditable] = useState(editor.isEditable());
  const [isSpeechToText, setIsSpeechToText] = useState(false);

  // Centralised toggle function
  // const toggleSpeechRecognition = useCallback(
  //   (active: boolean) => {
  //     console.log('ACTIONS PLUGIN - toggleSpeechRecognition', active);
  //     editor.dispatchCommand(SPEECH_TO_TEXT_COMMAND, active);
  //     setIsSpeechToText(active);
  //     // onCommand(SPEECH_TO_TEXT_COMMAND.type, active);
  //   },
  //   [editor, onCommand]
  // );

  useEffect(() => mergeRegister(
    editor.registerEditableListener((editable) => {
      setIsEditable(editable);
    })
  ), [editor]);

  // useEffect(() => {
  //   if (speechToTextActive !== isSpeechToText) {
  //     toggleSpeechRecognition(speechToTextActive);
  //   }
  // }, [toggleSpeechRecognition, speechToTextActive, isSpeechToText, setIsSpeechToText]);

  if (!isEditable) {
    return null;
  }
  return (
    <div className="actions">
      {SUPPORT_SPEECH_RECOGNITION && (
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.dispatchCommand(SPEECH_TO_TEXT_COMMAND, !isSpeechToText);
            setIsSpeechToText(!isSpeechToText);
            console.log('ACTIONS PLUGIN - onToggleSpeechRecognition', !isSpeechToText);
            // if (isSpeechToText) {
            //   stopRecording();
            // } else {
            //   setTimeout(() => { startRecording(); }, 2000);
            // }
          }}
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
