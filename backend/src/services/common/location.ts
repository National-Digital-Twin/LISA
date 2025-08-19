// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { randomUUID } from 'crypto';
import { Node } from 'rdflib';
import { type Coordinates, type Location } from 'common/Location';
import { literalDecimal, literalString, ns, nodeValue } from '../../rdfutil';
import { type ResultRow } from '../../ia';

export function buildLocation(
  coordinates: Coordinates[],
  locationDescription?: string
): Location | null {
  if (coordinates.length > 0) {
    if (locationDescription) {
      return {
        type: 'both',
        coordinates,
        description: locationDescription
      };
    }
    return {
      type: 'coordinates',
      coordinates
    };
  }
  if (locationDescription) {
    return {
      type: 'description',
      description: locationDescription
    };
  }
  return null;
}

export function addLocationTriples(location: Location | undefined, entityIdNode: Node): unknown[] {
  if (!location || location.type === 'none') {
    return [];
  }

  let coordinates: Coordinates[];
  let description: string;
  let locationIdNode: string | undefined;
  const triples: unknown[] = [];

  if (location.type === 'description' || location.type === 'both') {
    description = location.description;
  }
  if (location.type === 'coordinates' || location.type === 'both') {
    coordinates = location.coordinates;
  }

  if (coordinates) {
    coordinates.forEach((coordinate, index) => {
      locationIdNode = `${randomUUID()}-${index}`;
      triples.push([ns.data(locationIdNode), ns.rdf.type, ns.ies.Location]);
      triples.push([ns.data(locationIdNode), ns.ies.Latitude, literalDecimal(coordinate.latitude)]);
      triples.push([
        ns.data(locationIdNode),
        ns.ies.Longitude,
        literalDecimal(coordinate.longitude)
      ]);
      triples.push([entityIdNode, ns.ies.inLocation, ns.data(locationIdNode)]);
    });
  }

  if (description) {
    if (!locationIdNode) {
      locationIdNode = randomUUID();
      triples.push([ns.data(locationIdNode), ns.rdf.type, ns.ies.Location]);
      triples.push([entityIdNode, ns.ies.inLocation, ns.data(locationIdNode)]);
    }
    triples.push([ns.data(locationIdNode), ns.lisa.hasDescription, literalString(description)]);
  }

  return triples;
}

function isDuplicateCoordinate(coordinates: Coordinates[], lat: number, lng: number): boolean {
  return coordinates.some((c) => c.latitude === lat && c.longitude === lng);
}

export function parseLocations(results: ResultRow[], entityIdField: string) {
  const locationsByEntity: Record<string, { coordinates: Coordinates[]; description?: string }> = {};

  for (const result of results) {
    if (!result.locationId) continue;

    const entityId = nodeValue(result[entityIdField].value);
    const location = locationsByEntity[entityId] ?? (locationsByEntity[entityId] = { coordinates: [] });

    if (result.latitude && result.longitude) {
      const lat = Number(result.latitude.value);
      const lng = Number(result.longitude.value);
      if (!isDuplicateCoordinate(location.coordinates, lat, lng)) {
        location.coordinates.push({ latitude: lat, longitude: lng });
      }
    }

    if (result.locationDescription && !location.description) {
      location.description = result.locationDescription.value;
    }
  }

  return locationsByEntity;
}
