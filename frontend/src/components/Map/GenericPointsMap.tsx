// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { FitBoundsOptions } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import Map, { LngLatBoundsLike, MapRef, Marker, NavigationControl } from 'react-map-gl/maplibre';

// Local imports
import { Box } from '@mui/material';
import { type Coordinates } from 'common/Location';
import { bem, Icons, MapUtils } from '../../utils';
import { type FullLocationType } from '../../utils/types';
import { INITIAL_VIEW_STATE, MAP_BOUNDS, MAP_STYLE } from './config';

// Types

export type PointMarker = {
  id: string;
  coordinates: Coordinates;
};

export interface PointsMapProps {
  locations: FullLocationType[] | undefined;
  maxZoomOnFit?: number;
}

function PointMarkerComponent({ marker, onClick }: Readonly<{ marker: PointMarker; onClick: (m: PointMarker) => void }>) {
  const classes = bem('map-marker');
  return (
    <Marker
      key={marker.id}
      latitude={marker.coordinates.latitude}
      longitude={marker.coordinates.longitude}
      className={classes()}
      onClick={() => onClick(marker)}
      anchor="bottom"
    >
      <Icons.MapPin />
    </Marker>
  );
}

export default function GenericPointsMap({
  locations,
  maxZoomOnFit = 15
}: Readonly<PointsMapProps>): ReactElement {
  const [redrawing, setRedrawing] = useState<boolean>(false);
  const mapRef = useRef<MapRef>(null);

  const markers: PointMarker[] = useMemo(() => {
    if (!locations) return [];
    const list: PointMarker[] = [];

    locations.forEach((loc, locIdx) => {
      const { coordinates } = (loc || {}) as FullLocationType;
      if (!coordinates || !Array.isArray(coordinates)) return;

      coordinates.forEach((coord, coordIdx) => {
        list.push({
          id: `${locIdx}-${coordIdx}`,
          coordinates: coord
        });
      });
    });

    return list;
  }, [locations]);

  const mapBounds: LngLatBoundsLike | undefined = useMemo(
    () => MapUtils.getBounds(markers.map((m) => m.coordinates)),
    [markers]
  );

  const zoomMap = (bounds: LngLatBoundsLike | undefined, focusLocation?: FullLocationType) => {
    if (!mapRef.current) return;

    const baseOptions: FitBoundsOptions = { padding: 60, duration: 250 };
    const coords = (focusLocation?.coordinates || []) as Coordinates[];

    if (Array.isArray(coords) && coords.length > 1) {
      const entryBounds: LngLatBoundsLike = [
        [Math.min(...coords.map((c) => c.longitude)), Math.min(...coords.map((c) => c.latitude))],
        [Math.max(...coords.map((c) => c.longitude)), Math.max(...coords.map((c) => c.latitude))]
      ];

      mapRef.current.fitBounds(entryBounds, { ...baseOptions, maxZoom: maxZoomOnFit });
    } else if (Array.isArray(coords) && coords.length === 1) {
      const options: FitBoundsOptions = { ...baseOptions };
      options.center = [coords[0].longitude, coords[0].latitude];

      if (bounds) {
        mapRef.current.fitBounds(bounds, options);
      } else {
        mapRef.current.getMap().flyTo(options);
      }
    } else if (bounds) {
      mapRef.current.fitBounds(bounds, baseOptions);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapBounds && mapRef.current) {
        zoomMap(mapBounds);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [mapBounds]);

  const redraw = () => {
    setRedrawing(true);
    setTimeout(() => setRedrawing(false), 0);
  };

  const handleMarkerClick = (marker: PointMarker) => {
    const [locIdxStr] = marker.id.split('-');
    const locIdx = Number(locIdxStr);
    const loc = locations?.[locIdx];

    if (mapRef.current) {
      zoomMap(mapBounds, loc);
    }
    redraw();
  };

  return (
    <Box
      className="container--location map-container"
      sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <Map
        ref={mapRef}
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle={MAP_STYLE as unknown as string}
        attributionControl={false}
        maxZoom={17}
        minZoom={6}
        cooperativeGestures
        maxBounds={MAP_BOUNDS}
      >
        <NavigationControl position="bottom-right" showCompass={false} />
        {!redrawing &&
          markers.map((marker) => (
            <PointMarkerComponent key={marker.id} marker={marker} onClick={handleMarkerClick} />
          ))}
      </Map>
    </Box>
  );
}
