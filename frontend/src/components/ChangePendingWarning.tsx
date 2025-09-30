import { Alert } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';

type Props = { sx?: SxProps<Theme>; hidden?: boolean };

export default function ChangePendingWarning({ sx = undefined, hidden = false }: Readonly<Props>) {
  if (hidden) return null;
  return (
    <Alert severity="warning" sx={sx}>
      Submission pending. The warning will be removed once confirmed.
    </Alert>
  );
}
