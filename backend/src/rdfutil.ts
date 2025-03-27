// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import namespace from '@rdfjs/namespace';
import rdf from '@rdfjs/data-model';

export const ns = {
  xsd: namespace('http://www.w3.org/2001/XMLSchema#'),
  rdf: namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
  rdfs: namespace('http://www.w3.org/2000/01/rdf-schema#'),
  owl: namespace('http://www.w3.org/2002/07/owl#'),
  ies: namespace('http://ies.data.gov.uk/ontology/ies4#'),
  lisa: namespace('http://ndtp.co.uk/ontology/lisa#'),
  data: namespace('http://ndtp.co.uk/lisa#'),
};

export function literalDate(date: Date) {
  return rdf.literal(date.toISOString(), ns.xsd.dateTime);
}

export function literalString(value: string) {
  return rdf.literal(value, ns.xsd.string);
}

export function literalInteger(value: number) {
  return rdf.literal(value, ns.xsd.integer);
}

export function literalDecimal(value: number) {
  return rdf.literal(value, ns.xsd.decimal);
}

export function nodeValue(value: string) {
  return value.substring(value.indexOf('#') + 1);
}
