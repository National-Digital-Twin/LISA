// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { ChangeEvent, useState } from 'react';
import {
  Autocomplete,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { matchSorter } from 'match-sorter';

// Local imports
import { type Coordinates } from 'common/Location';
import { MapUtils } from '../../utils';
import { type LocationResult } from '../../utils/types';

interface Props {
  location: LocationResult | undefined;
  onSelectLocation: (location: LocationResult) => void;
}

const SearchLocation = ({ location, onSelectLocation }: Props) => {
  const [options, setOptions] = useState<LocationResult[] | []>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState<string | Coordinates | undefined>(undefined);

  const search = (value: string | Coordinates) => {
    setLoading(true);
    MapUtils.loadLocations(value, (result) => {
      setLoading(false);
      setOptions(result);
    });
  };

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const value = event.target.value ? event.target.value : undefined;
    if (value) {
      setSearchValue(value);
      search(value);
    }
  };

  const handleOnClick = () => {
    if (searchValue) search(searchValue);
  };

  return (
    <Box position="absolute" top={0.5} right={0.5} padding={1} width="100%">
      <Autocomplete
        options={options}
        fullWidth
        value={location}
        onChange={(_, selection) => {
          if (selection) onSelectLocation(selection);
        }}
        loading={loading}
        sx={{ backgroundColor: 'white' }}
        getOptionLabel={(option) => option.label}
        filterOptions={(options, { inputValue }) =>
          matchSorter(options, inputValue, {
            keys: [(option) => option.label]
          })
        }
        // renderOption={(props, option) => <li>{option.label}</li>}
        renderInput={(params) => (
          <TextField
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...params}
            placeholder="Search map..."
            onChange={handleOnChange}
            hiddenLabel
            variant="filled"
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton type="button" onClick={handleOnClick}>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : (
                        <SearchIcon color="primary" />
                      )}
                    </IconButton>
                    {params.InputProps.endAdornment}
                  </InputAdornment>
                )
              }
            }}
          />
        )}
      />
    </Box>
  );
};

export default SearchLocation;
