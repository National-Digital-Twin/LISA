// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

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
  onFilesSelected: (files: File[]) => void;
  removeSelectedFile: (name: string) => void;
}

export default function FilesContent({
  active,
  selectedFiles,
  onFilesSelected,
  removeSelectedFile
}: Readonly<Props>) {
  const classes = bem('add-entry-tab', [active ? 'active' : ''], 'files');
  const title = useMemo(() => {
    if (selectedFiles.length > 0) {
      return `${selectedFiles.length} selected file${selectedFiles.length === 1 ? '' : 's'}`;
    }
    return 'No selected files';
  }, [selectedFiles.length]);

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
      <li>
        <FilesSelector onSelect={onFilesSelected} />
      </li>
    </Box>
  );
}
