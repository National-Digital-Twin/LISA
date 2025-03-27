// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { useMemo } from 'react';

// Local imports
import { type Coordinates, type Location, type LocationType } from 'common/Location';
import { Box } from '@mui/material';
import { bem, Form, MapUtils } from '../../../utils';
import {
  type FieldValueType,
  type FullLocationType,
  type ValidationError
} from '../../../utils/types';
import { MapComponent } from '../../Map';
import { FormField } from '../../Form';
import { DESCRIPTION_FIELD, TYPE_FIELD } from './constants';

interface Props {
  active: boolean;
  required?: boolean;
  location: Partial<Location> | undefined;
  validationErrors: Array<ValidationError>;
  onLocationChange: (location: Partial<Location>) => void;
  showValidationErrors: boolean;
}

export default function LocationContent({
  active,
  required = false,
  location,
  validationErrors,
  onLocationChange,
  showValidationErrors
}: Readonly<Props>) {
  const classes = bem('add-entry-tab', [active ? 'active' : ''], 'location');
  const coordinatesError: ValidationError | undefined = useMemo(
    () => Form.getError({ id: 'location.coordinates' }, validationErrors),
    [validationErrors]
  );

  const onLocationTypeChange = (_: string, value: FieldValueType) => {
    onLocationChange(
      MapUtils.getNewLocation(value as LocationType, (location ?? {}) as FullLocationType)
    );
  };

  const onLocationDescriptionChange = (_: string, description: FieldValueType) => {
    onLocationChange({ ...location, description } as Location);
  };

  const onLocationCoordinatesChange = (coordinates: Coordinates) => {
    onLocationChange({ ...location, coordinates } as Location);
  };

  const typeField = useMemo(
    () => ({ ...TYPE_FIELD, options: MapUtils.getLocationTypes(required) }),
    [required]
  );

  return (
    <Box display="flex" flexDirection="column" gap={4} component="ul" className={classes()}>
      <FormField
        component="li"
        field={{ ...typeField, value: location?.type }}
        error={showValidationErrors ? Form.getError(typeField, validationErrors) : undefined}
        onChange={onLocationTypeChange}
      />
      {(location?.type === 'description' || location?.type === 'both') && (
        <FormField
          field={{ ...DESCRIPTION_FIELD, value: location?.description }}
          error={
            showValidationErrors ? Form.getError(DESCRIPTION_FIELD, validationErrors) : undefined
          }
          onChange={onLocationDescriptionChange}
        />
      )}
      {(location?.type === 'coordinates' || location?.type === 'both') && (
        <li className="full-width">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="location.coordinates">
            <MapComponent
              id="location.coordinates"
              marker={location?.coordinates}
              setMarker={onLocationCoordinatesChange}
            />
          </label>
          {coordinatesError && (
            <div className="field-error">
              Click on the map to place a pin or search for a location
            </div>
          )}
        </li>
      )}
    </Box>
  );
}
