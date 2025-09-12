// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box, IconButton, Typography } from '@mui/material';
import MicOutlinedIcon from '@mui/icons-material/MicOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useCallback } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { Format } from '../utils';

interface Props {
  recordings?: File[];
  onRecordingsChanged: (recordings: File[]) => void;
}

export default function Recordings({ recordings = [], onRecordingsChanged }: Readonly<Props>) {
  const { startRecording, stopRecording, status, error } = useReactMediaRecorder({
    audio: true,
    onStop: async (blobUrl) => {
      if (blobUrl) {
        try {
          const response = await fetch(blobUrl);
          const blob = await response.blob();

          const recordingCount = recordings.length;
          const name = recordingCount === 0 ? 'Recording.webm' : `Recording ${recordingCount + 1}.webm`;
          const file = new File([blob], name, { type: 'audio/webm' });
          const newRecordings = [...recordings, file];
          onRecordingsChanged(newRecordings);
        } catch (error) {
          console.error('Error processing recording:', error);
        }
      }
    }
  });

  const isRecording = status === 'recording';
  const hasError = !!error;

  const handleStartRecording = useCallback(() => {
    startRecording();
  }, [startRecording]);

  const handleStopRecording = useCallback(() => {
    stopRecording();
  }, [stopRecording]);

  const handleRemoveRecording = useCallback((name: string) => {
    const newRecordings = recordings.filter(r => r.name !== name);
    onRecordingsChanged(newRecordings);
  }, [recordings, onRecordingsChanged]);

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'permission_denied':
        return 'Microphone access denied. Please allow microphone access and try again.';
      case 'no_specified_media_found':
        return 'No microphone found. Please check your audio devices.';
      case 'media_in_use':
        return 'Microphone is currently in use by another application.';
      case 'invalid_media_constraints':
        return 'Invalid audio settings. Please try again.';
      case 'no_constraints':
        return 'Audio recording not supported in this browser.';
      case 'recorder_error':
        return 'Recording failed. Please try again.';
      case 'media_aborted':
        return 'Recording was interrupted. Please try again.';
      default:
        return 'An unknown error occurred with audio recording.';
    }
  };

  let iconTitle = isRecording ? 'Stop recording' : 'Start recording';
  if (hasError) {
    iconTitle = getErrorMessage(error);
  }

  const renderContent = () => {
    if (hasError) {
      return (
        <Box maxWidth={300}>
          <Typography variant="body2" color="error" gutterBottom>
            Recording Error
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {getErrorMessage(error)}
          </Typography>
        </Box>
      );
    } else if (recordings.length === 0) {
      return <Typography variant="body1">No voice recordings</Typography>;
    }

    return (
      <>
        <Typography variant="body1">
          {Format.pretty.pluralize(recordings.length, 'voice recording')}
        </Typography>
        <Box>
          {recordings.map((recording) => (
            <Box key={recording.name} display="flex" flexDirection="row" alignItems="center" gap={1}>
              <Typography variant="body1" color="textSecondary">
                {recording.name}
                <Typography
                  variant="body1"
                  component="span"
                >{` (${Format.fileSize(recording.size)})`}</Typography>
              </Typography>
              <IconButton
                size="small"
                onClick={() => handleRemoveRecording(recording.name)}
                color="primary"
                title="Remove recording"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      </>
    );
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} minHeight={300}>
      {renderContent()}

      <Box display="flex" justifyContent="center">
        <IconButton
          onClick={() => (isRecording ? handleStopRecording() : handleStartRecording())}
          disabled={hasError}
          className={`recording-button ${isRecording ? 'recording-button--active' : ''}`}
          title={iconTitle}
          sx={{
            width: 80,
            height: 80,
            backgroundColor: isRecording ? 'recording.active' : 'recording.inactive',
            '&:hover:not(.Mui-disabled)': {
              backgroundColor: isRecording ? 'recording.activeDark' : 'primary.dark'
            }
          }}
        >
          <MicOutlinedIcon sx={{ fontSize: 40, color: hasError ? 'text.disabled' : 'white' }} />
        </IconButton>
      </Box>
    </Box>
  );
}
