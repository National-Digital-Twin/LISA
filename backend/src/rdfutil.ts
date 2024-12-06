import namespace from '@rdfjs/namespace';
import rdf from '@rdfjs/data-model';

export const ns = {
  xsd: namespace('http://www.w3.org/2001/XMLSchema#'),
  rdf: namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#'),
  rdfs: namespace('http://www.w3.org/2000/01/rdf-schema#'),
  owl: namespace('http://www.w3.org/2002/07/owl#'),
  ies: namespace('http://ies.data.gov.uk/ontology/ies4#'),
  lisa: namespace('http://radicalit.co.uk/ontology/lisa#'),
  data: namespace('http://radicalit.co.uk/lisa#'),
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
