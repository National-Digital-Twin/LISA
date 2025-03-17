// Global imports
import { useMemo } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Local imports
import { bem, Format } from '../../../utils';
import FilesSelector from '../../FilesSelector';

interface Props {
  active: boolean;
  selectedFiles: File[];
  recordings: File[];
  onFilesSelected: (files: File[]) => void;
  removeSelectedFile: (name: string) => void;
  removeRecording: (name: string) => void;
}

export default function FilesContent({
  active,
  selectedFiles,
  recordings,
  onFilesSelected,
  removeSelectedFile,
  removeRecording
}: Readonly<Props>) {
  const classes = bem('add-entry-tab', [active ? 'active' : ''], 'files');
  const totalLength = useMemo(
    () => recordings.length + selectedFiles.length,
    [selectedFiles, recordings]
  );
  const title = useMemo(() => {
    if (recordings.length > 0) {
      if (totalLength > recordings.length) {
        return `${totalLength} selected files and recordings`;
      }
      return `${recordings.length} recording${recordings.length === 1 ? '' : 's'}`;
    }
    if (totalLength > 0) {
      return `${totalLength} selected file${totalLength === 1 ? '' : 's'}`;
    }
    return 'No selected files or recordings';
  }, [recordings, totalLength]);

  return (
    <Box display="flex" flexDirection="column" gap={4} component="ul" className={classes()}>
      <Typography component="li" variant="body1">
        {title}
      </Typography>
      <Box component="li">
        {selectedFiles.map((file) => (
          <Box key={file.name} display="flex" flexDirection="row" alignItems="center" gap={1}>
            <Typography variant="body1" color="textSecondary">
              {file.name}
              <Typography
                variant="body1"
                component="span"
              >{` (${Format.fileSize(file.size)})`}</Typography>
            </Typography>
            <IconButton
              size="small"
              type="button"
              onClick={() => removeSelectedFile(file.name)}
              color="primary"
              title="Remove file"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        ))}
      </Box>
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
            type="button"
            onClick={() => removeRecording(recording.name)}
            color="primary"
            title="Remove file"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      ))}
      <li>
        <FilesSelector onSelect={onFilesSelected} />
      </li>
    </Box>
  );
}
