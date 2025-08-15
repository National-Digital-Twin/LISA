// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { type Location as LocationModel } from 'common/Location';
import PageWrapper from '../PageWrapper';
import { PageTitle } from '..';
import Location from '../AddEntry/Location';

interface LocationStepProps {
  location?: LocationModel;
  onChange: (location: LocationModel | undefined) => void;
  onBack: () => void;
}

export function LocationStep({ location = undefined, onChange, onBack }: LocationStepProps) {
  const handleLocationChange = (loc: Partial<LocationModel>) => {
    onChange(loc as LocationModel | undefined);
  };

  return (
    <PageWrapper>
      <PageTitle
        title="Add location(s)"
        titleStart={
          <IconButton aria-label="Back" onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>
        }
      />
      <Box display="flex" flexDirection="column" gap={2} bgcolor="background.default" padding={2}>
        <Location.Content
          active
          required={false}
          location={location}
          validationErrors={[]}
          onLocationChange={handleLocationChange}
          showValidationErrors={false}
        />
      </Box>
    </PageWrapper>
  );
}