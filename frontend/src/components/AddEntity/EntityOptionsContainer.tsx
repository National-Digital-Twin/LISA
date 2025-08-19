import { Box } from '@mui/material';
import { ValidationError } from '../../utils/types';
import { EntityOptionData, getEntityOptions } from './EntityOptions';
import { EntityDivider } from './EntityDivider';

type Props = {
  entityType: string;
  data: EntityOptionData[];
  errors: ValidationError[];
};

export const EntityOptionsContainer = ({ entityType, data, errors }: Props) => {
  const entityOptions = getEntityOptions(entityType, data, errors);

  return (
    <Box>
      {entityOptions.map((entityOption, index) => (
        <Box key={data[index].id}>
          {entityOption}
          <EntityDivider />
        </Box>
      ))}
    </Box>
  );
};
