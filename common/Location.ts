// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { Literal, Number, Record, Static, String, Union } from 'runtypes';

const LocationType = Union(
  Literal('none'),
  Literal('description'),
  Literal('coordinates'),
  Literal('both')
);

export const Coordinates = Record({
  latitude: Number,
  longitude: Number
});

const NoLocation = Record({
  type: Literal('none')
});
const DescriptionLocation = Record({
  type: Literal('description'),
  description: String
});
const CoordinatesLocation = Record({
  type: Literal('coordinates'),
  coordinates: Coordinates
});
const FullLocation = Record({
  type: Literal('both'),
  description: String,
  coordinates: Coordinates
});

export const Location = Union(
  NoLocation,
  DescriptionLocation,
  CoordinatesLocation,
  FullLocation,
);

// eslint-disable-next-line no-redeclare
export type Location = Static<typeof Location>;
// eslint-disable-next-line no-redeclare
export type Coordinates = Static<typeof Coordinates>;
// eslint-disable-next-line no-redeclare
export type LocationType = Static<typeof LocationType>;

type LocationTypesDict = {
  [key in LocationType]: string
};

export const LocationTypes: LocationTypesDict = {
  none: 'None',
  description: 'Description only',
  coordinates: 'Point on a map',
  both: 'Both a point on a map and a description'
};
