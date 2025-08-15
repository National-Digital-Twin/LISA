import { ReactNode } from 'react';
import { Box, Divider } from '@mui/material';
import { ValidationError } from '../../utils/types';
import { EntityOptionData, getEntityOptions } from './EntityOptions';

type Props = {
  entityType: string;
  data: EntityOptionData[];
  errors: ValidationError[];
};

export const EntityOptionsContainer = ({ entityType, data, errors }: Props) => {
  const allEntityOptions = getEntityOptions(data, errors);
  const entityOptionsForType: ReactNode[] | undefined = allEntityOptions[entityType];

  return (
    <Box>
      {entityOptionsForType &&
        entityOptionsForType.map((entityOption) => (
          <>
            {entityOption}
            <Divider />
          </>
        ))}
    </Box>
  );
};
