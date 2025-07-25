// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { Box, IconButton, Tooltip } from '@mui/material';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useCallback, useRef, useState } from 'react';
import Map, {
  MapLayerMouseEvent,
  MapRef,
  Marker,
  MarkerDragEvent,
  NavigationControl
} from 'react-map-gl/maplibre';

// Local imports
import { type Coordinates } from 'common/Location';
import { Icons, MapUtils } from '../../utils';
import { type LocationResult } from '../../utils/types';
import { INITIAL_VIEW_STATE, MAP_BOUNDS, MAP_STYLE } from './config';
import SearchLocation from './SearchLocation';

interface Props {
  id: string;
  markers: Coordinates[];
  setMarkers: (markers: Coordinates[]) => void;
}

const MapComponent = ({ id, markers, setMarkers }: Props) => {
  const mapRef = useRef<MapRef>(null);
  const [location, setLocation] = useState<LocationResult>();

  const onLocationSet = useCallback(
    async (coordinates: Coordinates) => {
      setMarkers([...markers, coordinates]);
      MapUtils.loadLocations(coordinates, (found: LocationResult[]) => {
        if (found.length > 0) {
          setLocation(found[0]);
        } else {
          setLocation(undefined);
        }
      });
    },
    [markers, setMarkers]
  );

  const onMarkerDrag = useCallback(
    async (event: MarkerDragEvent, index: number) => {
      const newCoordinates: Coordinates = {
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat
      };

      const updatedMarkers = [...markers];
      updatedMarkers[index] = newCoordinates;
      setMarkers(updatedMarkers);
    },
    [markers, setMarkers]
  );

  const onDropPin = useCallback(
    (event: MapLayerMouseEvent) => {
      onLocationSet({
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat
      });
    },
    [onLocationSet]
  );

  const onRemoveMarker = useCallback(
    (index: number) => {
      const updatedMarkers = markers.filter((_, i) => i !== index);
      setMarkers(updatedMarkers);
    },
    [markers, setMarkers]
  );

  const onSelectLocation = useCallback(
    (loc: LocationResult) => {
      if (mapRef.current) {
        setLocation(loc);
        const coordinates: Coordinates = {
          latitude: parseFloat(loc.lat),
          longitude: parseFloat(loc.lon)
        };
        mapRef.current.getMap().flyTo({
          center: [coordinates.longitude, coordinates.latitude],
          zoom: 14,
          duration: 500
        });
        onLocationSet(coordinates);
      }
    },
    [onLocationSet]
  );

  return (
    <div className="map-container">
      <Map
        id={id}
        ref={mapRef}
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle={MAP_STYLE as unknown as string}
        attributionControl={false}
        onClick={onDropPin}
        maxZoom={17}
        minZoom={6}
        cooperativeGestures
        // uk bounds with a bit of padding
        maxBounds={MAP_BOUNDS}
      >
        <SearchLocation onSelectLocation={onSelectLocation} location={location} />
        <NavigationControl position="bottom-right" showCompass={false} />

        {markers.map((marker, index) => {
          const markerKey = `marker-${marker.longitude.toFixed(6)}-${marker.latitude.toFixed(6)}-${index}`;
          return (
            <Marker
              key={markerKey}
              longitude={marker.longitude}
              latitude={marker.latitude}
              anchor="bottom"
              draggable
              onDrag={(event) => onMarkerDrag(event, index)}
            >
              <Box sx={{ position: 'relative' }}>
                <Icons.MapPin />
                <Tooltip title="Click to remove">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveMarker(index);
                    }}
                    sx={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      width: '20px',
                      height: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#666',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: '#ff4444',
                        color: 'white',
                        borderColor: '#ff4444',
                        transform: 'scale(1.1)',
                        boxShadow: '0 3px 6px rgba(255,68,68,0.3)'
                      }
                    }}
                  >
                    ×
                  </IconButton>
                </Tooltip>
              </Box>
            </Marker>
          );
        })}
      </Map>
    </div>
  );
};

export default MapComponent;
