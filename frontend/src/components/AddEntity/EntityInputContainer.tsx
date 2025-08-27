// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box, Button, IconButton, Typography } from '@mui/material';
import { ReactNode } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import { EntityDivider } from './EntityDivider';

export type EntityInputContainerData = {
  heading: string;
  inputControls: ReactNode;
  hideButtons?: boolean;
};

type Props = {
  level: number;
  setLevel: (level: number) => void;
  data: EntityInputContainerData[];
  onMainBackClick: () => void;
  onSubmit: () => void;
  onCancel: () => void;
  disableSubmit: boolean;
};

export const EntityInputContainer = ({
  level,
  setLevel,
  data,
  onMainBackClick,
  onSubmit,
  onCancel,
  disableSubmit
}: Props) => {
  const entityInputItem = data[level];

  const handleBackClick = () => (level > 0 ? setLevel(level - 1) : onMainBackClick());
  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" marginBottom={1} alignItems="center" gap={1}>
        <IconButton onClick={handleBackClick}>
          <ArrowBackIcon />
        </IconButton>
        <Typography
          fontSize="1.5rem"
          variant="h1"
          className="title"
          fontWeight={400}
          sx={{
            mb: 0,
            lineHeight: 1.15,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: '1 1 auto'
          }}
        >
          {entityInputItem.heading}
        </Typography>
      </Box>
      <EntityDivider />
      {entityInputItem.inputControls}
      {!entityInputItem?.hideButtons && (
        <Box display="flex" alignSelf="flex-end" gap={1} marginTop={2}>
          <Button onClick={onCancel} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            variant="contained"
            disabled={disableSubmit}
            startIcon={<ImportContactsIcon />}
          >
            Save
          </Button>
        </Box>
      )}
    </Box>
  );
};
