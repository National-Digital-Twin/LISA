// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

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
          <Box sx={{ py: 0.8 }}>
            {entityOption}
          </Box>
          <EntityDivider />
        </Box>
      ))}
    </Box>
  );
};
