import { LngLatBoundsLike, StyleSpecification } from 'maplibre-gl';
import { ViewState } from 'react-map-gl/dist/esm/types';

export const MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    'raster-tiles': {
      type: 'raster',
      tiles: ['/transparent-proxy/maps/raster/v1/zxy/Outdoor_3857/{z}/{x}/{y}.png?'],
      tileSize: 256
    }
  },
  layers: [
    {
      id: 'os-maps-zxy',
      type: 'raster',
      source: 'raster-tiles'
    }
  ]
};

// UK bounds, with a bit of padding.
export const MAP_BOUNDS: LngLatBoundsLike = [
  [-8.0, 49.5],
  [2.0, 60.8]
];

// Center of the Isle of Wight.
export const INITIAL_VIEW_STATE: Partial<ViewState> = {
  longitude: -1.3,
  latitude: 50.673,
  zoom: 9
};
