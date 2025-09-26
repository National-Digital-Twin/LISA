// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { useMemo } from 'react';

// Local imports
import { type Coordinates, type Location, type LocationType } from 'common/Location';
import { Box } from '@mui/material';
import { Form, MapUtils } from '../../../utils';
import {
  type FieldValueType,
  type FullLocationType,
  type ValidationError
} from '../../../utils/types';
import { MapComponent } from '../../Map';
import { DESCRIPTION_FIELD, TYPE_FIELD } from './constants';
import { GenericFormField } from '../../Form/GenericFormField';

interface Props {
  required?: boolean;
  location: Partial<Location> | undefined;
  validationErrors: Array<ValidationError>;
  onLocationChange: (location: Partial<Location>) => void;
}

export default function LocationContent({
  required = false,
  location,
  validationErrors,
  onLocationChange
}: Readonly<Props>) {
  const coordinatesError: ValidationError | undefined = useMemo(
    () => Form.getError({ id: 'location.coordinates' }, validationErrors),
    [validationErrors]
  );

  // Convert single coordinates to array format for backward compatibility
  const markers = useMemo(() => {
    if (!location || location.type === 'none' || location.type === 'description') return [];
    if ('coordinates' in location && location.coordinates) {
      return Array.isArray(location.coordinates) ? location.coordinates : [location.coordinates];
    }
    return [];
  }, [location]);

  const onLocationTypeChange = (_: string, value: FieldValueType) => {
    onLocationChange(
      MapUtils.getNewLocation(value as LocationType, (location ?? {}) as FullLocationType)
    );
  };

  const onLocationDescriptionChange = (_: string, description: FieldValueType) => {
    onLocationChange({ ...location, description } as Location);
  };

  const onLocationCoordinatesChange = (coordinates: Coordinates[]) => {
    onLocationChange({ ...location, coordinates } as Location);
  };

  const typeField = useMemo(
    () => ({ ...TYPE_FIELD, options: MapUtils.getLocationTypes(required) }),
    [required]
  );

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <GenericFormField
        field={{ ...typeField, value: location?.type }}
        errors={validationErrors}
        onChange={onLocationTypeChange}
      />
      {(location?.type === 'description' || location?.type === 'both') && (
        <GenericFormField
          field={{ ...DESCRIPTION_FIELD, value: location?.description }}
          errors={validationErrors}
          onChange={onLocationDescriptionChange}
        />
      )}
      {(location?.type === 'coordinates' || location?.type === 'both') && (
        <li className="full-width">
          <label htmlFor="location.coordinates">
            <MapComponent
              id="location.coordinates"
              markers={markers}
              setMarkers={onLocationCoordinatesChange}
            />
          </label>
          {coordinatesError && (
            <div className="field-error">
              Click on the map to place pins or search for a location
            </div>
          )}
        </li>
      )}
    </Box>
  );
}
