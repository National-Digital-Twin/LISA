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
 */
// Global imports
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { JSX, MouseEvent, useEffect, useState } from 'react';
import { RECORD_COMMAND } from './constants';

type ActionsPluginProps = {
  recordingActive: boolean;
  onCommand: (command: string | undefined, active: boolean) => void;
};
export default function ActionsPlugin({
  recordingActive,
  onCommand
}: Readonly<ActionsPluginProps>): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const [isRecording, setIsRecording] = useState(false);

  useEffect(
    () =>
      mergeRegister(
        editor.registerEditableListener((editable) => {
          setIsEditable(editable);
        })
      ),
    [editor]
  );

  useEffect(() => {
    if (recordingActive !== isRecording) {
      editor.dispatchCommand(RECORD_COMMAND, recordingActive);
      setIsRecording(recordingActive);
      onCommand(RECORD_COMMAND.type, recordingActive);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, recordingActive, isRecording, setIsRecording]);

  if (!isEditable) {
    return null;
  }

  const onToggleRecording = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    const active = !isRecording;
    editor.dispatchCommand(RECORD_COMMAND, active);
    setIsRecording(active);
    onCommand(RECORD_COMMAND.type, active);
  };

  return (
    <div className="actions">
      <button
        onClick={onToggleRecording}
        className={`action-button action-button-mic ${isRecording ? 'active' : ''}`}
        id="recordSpeech"
        title="Record Speech"
        type="button"
        aria-label={`${isRecording ? 'Enable' : 'Disable'} recording speech`}
      >
        <MicNoneOutlinedIcon />
      </button>
    </div>
  );
}
