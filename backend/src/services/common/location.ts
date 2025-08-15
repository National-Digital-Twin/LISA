// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { randomUUID } from 'crypto';
import { Node } from 'rdflib';
import { type Coordinates, type Location } from 'common/Location';
import { literalDecimal, literalString, ns } from '../../rdfutil';

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