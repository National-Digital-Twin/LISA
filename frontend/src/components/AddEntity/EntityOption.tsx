import { ReactNode } from 'react';
import { Box } from '@mui/material';
import { EntityLabel } from './EntityLabel';

type Props = {
  onClick: () => void;
  icon: ReactNode;
  errored: boolean;
  label: string;
};

export const EntityOption = ({ onClick, icon, errored, label }: Props) => (
  <Box
    display="flex"
    textAlign="center"
    padding="10px 5px"
    gap={1}
    sx={{ cursor: 'pointer' }}
    onClick={onClick}
  >
    {icon}
    <EntityLabel errored={errored} label={label} />
  </Box>
);
