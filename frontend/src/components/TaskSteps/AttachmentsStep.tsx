// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PageWrapper from '../PageWrapper';
import { PageTitle } from '..';
import Files from '../AddEntry/Files';

interface AttachmentsStepProps {
  selectedFiles: File[];
  onFilesSelected: (files: File[]) => void;
  removeSelectedFile: (name: string) => void;
  onBack: () => void;
}

export function AttachmentsStep({ 
  selectedFiles, 
  onFilesSelected, 
  removeSelectedFile, 
  onBack 
}: Readonly<AttachmentsStepProps>) {
  return (
    <PageWrapper>
      <PageTitle
        title="Add attachment(s)"
        titleStart={
          <IconButton aria-label="Back" onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>
        }
      />
      <Box display="flex" flexDirection="column" gap={2} bgcolor="background.default" padding={2}>
        <Files.Content
          active
          selectedFiles={selectedFiles}
          recordings={[]}
          onFilesSelected={onFilesSelected}
          removeSelectedFile={removeSelectedFile}
          removeRecording={() => {}}
        />
      </Box>
    </PageWrapper>
  );
}
