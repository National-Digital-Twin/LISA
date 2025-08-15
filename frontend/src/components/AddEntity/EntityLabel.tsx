import { Typography } from '@mui/material';

type Props = {
  errored: boolean;
  label: string;
};

export const EntityLabel = ({ errored, label }: Props) => (
  <Typography component="span" sx={{ color: errored ? 'red' : 'initial' }}>
    {label}
  </Typography>
);
