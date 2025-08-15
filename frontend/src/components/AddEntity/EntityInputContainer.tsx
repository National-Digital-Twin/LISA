import { Box, Button, Divider, IconButton, Typography } from '@mui/material';
import { ReactNode } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';

export type EntityInputContainerData = {
  heading: string;
  inputControls: ReactNode;
};

type Props = {
  level: number;
  setLevel: (level: number) => void;
  data: EntityInputContainerData[];
  onSubmit: () => void;
  onCancel: () => void;
  disableSubmit: boolean;
};

export const EntityInputContainer = ({
  level,
  setLevel,
  data,
  onSubmit,
  onCancel,
  disableSubmit
}: Props) => {
  const entityInputItem = data[level];

  const handleBackClick = () => setLevel(level > 0 ? level - 1 : level);

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" marginBottom={1}>
        <IconButton onClick={handleBackClick}>
          <ArrowBackIcon />
        </IconButton>
        <Typography component="h1" padding={1}>
          {entityInputItem.heading}
        </Typography>
      </Box>
      <Divider />
      {entityInputItem.inputControls}
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
    </Box>
  );
};
