// Global imports
import { useMemo } from 'react';

// Local imports
import { type Coordinates, type Location, type LocationType } from 'common/Location';
import { bem, Form, Map } from '../../../utils';
import { type FieldValueType, type FullLocationType, type ValidationError } from '../../../utils/types';
import { MapComponent } from '../../Map';
import { FormField } from '../../Form';
import { DESCRIPTION_FIELD, TYPE_FIELD } from './constants';

interface Props {
  active: boolean;
  required?: boolean;
  location: Partial<Location> | undefined;
  validationErrors: Array<ValidationError>;
  onLocationChange: (location: Partial<Location>) => void;
}

export default function LocationContent({
  active,
  required = false,
  location,
  validationErrors,
  onLocationChange
}: Props) {
  const classes = bem('add-entry-tab', [active ? 'active' : ''], 'location');
  const coordinatesError: ValidationError | undefined = useMemo(
    () => Form.getError({ id: 'location.coordinates' }, validationErrors),
    [validationErrors]
  );

  const onLocationTypeChange = (_: string, value: FieldValueType) => {
    onLocationChange(
      Map.getNewLocation(value as LocationType, (location ?? {}) as FullLocationType)
    );
  };

  const onLocationDescriptionChange = (_: string, description: FieldValueType) => {
    onLocationChange({ ...location, description } as Location);
  };

  const onLocationCoordinatesChange = (coordinates: Coordinates) => {
    onLocationChange({ ...location, coordinates } as Location);
  };

  const typeField = useMemo(
    () => ({ ...TYPE_FIELD, options: Map.getLocationTypes(required) }),
    [required]
  );

  return (
    <ul className={classes()}>
      <FormField
        field={{ ...typeField, value: location?.type }}
        error={Form.getError(typeField, validationErrors)}
        onChange={onLocationTypeChange}
      />
      {(location?.type === 'description' || location?.type === 'both') && (
        <FormField
          field={{ ...DESCRIPTION_FIELD, value: location?.description }}
          error={Form.getError(DESCRIPTION_FIELD, validationErrors)}
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
    </ul>
  );
}
