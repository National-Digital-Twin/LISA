// Global imports
import Map, { MapLayerMouseEvent, MapRef, Marker, MarkerDragEvent, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useCallback, useRef, useState } from 'react';

// Local imports
import { type Coordinates } from 'common/Location';
import { Icons, MapUtils } from '../../utils';
import { type LocationResult } from '../../utils/types';
import { INITIAL_VIEW_STATE, MAP_BOUNDS, MAP_STYLE } from './config';
import SearchLocation from './SearchLocation';

interface Props {
  id: string;
  marker: Coordinates | undefined;
  setMarker: (marker: Coordinates) => void;
}

const MapComponent = ({ id, marker, setMarker }: Props) => {
  const mapRef = useRef<MapRef>(null);
  const [location, setLocation] = useState<LocationResult>();

  const onLocationSet = useCallback(async (coordinates: Coordinates) => {
    setMarker(coordinates);
    MapUtils.loadLocations(coordinates, (found: LocationResult[]) => {
      if (found.length > 0) {
        setLocation(found[0]);
      } else {
        setLocation(undefined);
      }
    });
  }, [setMarker]);

  const onMarkerDrag = useCallback(async (event: MarkerDragEvent) => {
    onLocationSet({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat
    });
  }, [onLocationSet]);

  const onDropPin = useCallback((event: MapLayerMouseEvent) => {
    onLocationSet({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat
    });
  }, [onLocationSet]);

  const onSelectLocation = useCallback((loc: LocationResult) => {
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
      setMarker(coordinates);
    }
  }, [setMarker]);

  return (
    <div className="map-container">
      <Map
        id={id}
        ref={mapRef}
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle={MAP_STYLE}
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
        {marker && (
          <Marker
            longitude={marker.longitude}
            latitude={marker.latitude}
            anchor="bottom"
            draggable
            onDrag={onMarkerDrag}
          >
            <Icons.MapPin />
          </Marker>
        )}
      </Map>
    </div>
  );
};

export default MapComponent;

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
