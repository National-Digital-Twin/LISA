// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box, Button, IconButton, Typography } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import { EntityDivider } from './EntityDivider';

export type EntityInputContainerData = {
  heading: string;
  inputControls: ReactNode;
  showButtons?: boolean;
  containerBackgroundColor?: string;
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

  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    setHasSaved(false);
  }, [level]);

  const handleBackClick = () => (level > 0 ? setLevel(level - 1) : onMainBackClick());

  const handleCancel = () => {
    setHasSaved(false);
    onCancel();
  };

  const handleSubmitOnce = () => {
    if (hasSaved) return;
    setHasSaved(true);
    onSubmit();
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100%">
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
      <Box
        display="flex"
        flexDirection="column"
        flexGrow={1}
        bgcolor={entityInputItem.containerBackgroundColor ?? 'initial'}
      >
        {entityInputItem.inputControls}
        {(entityInputItem?.showButtons ?? false) && (
          <Box display="flex" alignSelf="flex-end" gap={1} paddingY={2}>
            <Button onClick={handleCancel} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleSubmitOnce}
              variant="contained"
              disabled={disableSubmit || hasSaved}
              startIcon={<ImportContactsIcon />}
            >
              Save
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};
