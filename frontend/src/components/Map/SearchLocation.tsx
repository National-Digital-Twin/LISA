// Global imports
import AsyncSelect from 'react-select/async';

// Local imports
import { Icons, MapUtils } from '../../utils';
import { type LocationResult } from '../../utils/types';

function DropdownIndicator() {
  return <Icons.Search />;
}

interface Props {
  location: LocationResult | undefined;
  onSelectLocation: (location: LocationResult) => void;
}

const SearchLocation = ({ location, onSelectLocation }: Props) => (
  <AsyncSelect<LocationResult>
    cacheOptions
    defaultOptions
    loadOptions={(inputValue, callback) => MapUtils.loadLocations(inputValue, callback)}
    unstyled
    onChange={(option) => {
      if (option) {
        onSelectLocation(option);
      }
    }}
    components={{
      DropdownIndicator,
      IndicatorSeparator: () => null
    }}
    value={location}
    placeholder="Search map..."
    className="react-select map-select-location"
    classNamePrefix="react-select"
  />
);

export default SearchLocation;
