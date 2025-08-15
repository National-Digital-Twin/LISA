// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { type Stage } from 'konva/lib/Stage';
import { type RefObject } from 'react';
import PageWrapper from '../PageWrapper';
import { PageTitle } from '..';
import Sketch from '../AddEntry/Sketch';
import { type SketchLine } from '../../utils/types';

interface SketchStepProps {
  canvasRef: RefObject<Stage | null>;
  lines: SketchLine[];
  onChangeLines: (lines: SketchLine[]) => void;
  onBack: () => void;
}

export function SketchStep({ canvasRef, lines, onChangeLines, onBack }: Readonly<SketchStepProps>) {
  return (
    <PageWrapper>
      <PageTitle
        title="Add sketch"
        titleStart={
          <IconButton aria-label="Back" onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>
        }
      />
      <Box display="flex" flexDirection="column" gap={2} bgcolor="background.default" padding={2}>
        <Sketch.Content
          active
          canvasRef={canvasRef}
          lines={lines}
          onChangeLines={onChangeLines}
        />
      </Box>
    </PageWrapper>
  );
}
