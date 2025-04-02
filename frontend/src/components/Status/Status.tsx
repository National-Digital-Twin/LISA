import { Chip } from '@mui/material';
import { type TaskStatus } from 'common/Task';

const Status = ({
  status,
  size = 'medium',
  width = 120
}: {
  status: TaskStatus;
  size?: 'small' | 'medium';
  width?: string | number;
}) => {
  const color = status.toLowerCase();
  const label = status.toUpperCase().includes('INPROGRESS') ? 'IN PROGRESS' : status.toUpperCase();
  return (
    <Chip
      label={label}
      size={size}
      sx={{
        width,
        border: 1,
        borderColor: `status.${color}.primary`,
        backgroundColor: `status.${color}.secondary`
      }}
      variant="filled"
    />
  );
};

export default Status;
