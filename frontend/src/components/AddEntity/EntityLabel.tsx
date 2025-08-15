import { Typography } from '@mui/material';

type Props = {
  errored: boolean;
  required: boolean;
  value: string | undefined;
  label: string;
};

const getLabelColour = (errored: boolean, required: boolean, value: string | undefined) => {
  if (value) {
    return 'initial';
  }
  if (errored || required) {
    return 'red';
  }
  return 'grey';
};

export const EntityLabel = ({ errored, required, value, label }: Props) => (
  <Typography component="span" sx={{ color: getLabelColour(errored, required, value) }}>
    {label}
  </Typography>
);
