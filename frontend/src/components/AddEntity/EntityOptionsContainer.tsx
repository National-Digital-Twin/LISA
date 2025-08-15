import { ReactNode } from 'react';
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
  const allEntityOptions = getEntityOptions(data, errors);
  const entityOptionsForType: ReactNode[] | undefined = allEntityOptions[entityType];

  return (
    <Box>
      {entityOptionsForType?.map((entityOption) => (
        <>
          {entityOption}
          <EntityDivider />
        </>
      ))}
    </Box>
  );
};
