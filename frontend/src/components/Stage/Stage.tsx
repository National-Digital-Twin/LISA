import { Chip } from '@mui/material';

const Stage = ({
  label,
  stage
}: {
  label: string;
  stage: 'Monitoring' | 'Response' | 'Recovery' | 'Closed';
}) => {
  const color = stage.toLowerCase();
  return (
    <Chip
      label={label}
      sx={{
        width: 120,
        border: 1,
        borderColor: `stage.${color}.primary`,
        backgroundColor: `stage.${color}.secondary`
      }}
      variant="filled"
    />
  );
};

export default Stage;
