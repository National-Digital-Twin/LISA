import { Request, Response } from 'express';
import * as sparql from 'rdf-sparql-builder';
import { ns } from '../../rdfutil';
import * as ia from '../../ia';

export async function updateSequence(req: Request, res: Response) {
  const { incidentId, entryId } = req.params;

  if (!incidentId && !entryId) {
    res.status(400).end();
    return;
  }

  const entryIdNode = ns.data(entryId);
  const incidentIdNode = ns.data(incidentId);

  const triples = [
    [entryIdNode, ns.lisa.hasSequence, '?seq']
  ];

  await ia.insert({
    triples,
    where: [
      `{SELECT (COALESCE(MAX(?number), 0) AS ?maxNumber) WHERE {${sparql.optional([
        [incidentIdNode, ns.lisa.hasLogEntry, '?entry'],
        ['?entry', ns.lisa.hasSequence, '?number']
      ])}
        }}`,
      'BIND (?maxNumber + 1 AS ?seq)'
    ]
  });

  res.json({ id: entryId });
}
