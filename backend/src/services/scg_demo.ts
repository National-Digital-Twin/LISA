// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import rdf from '@rdfjs/data-model';
import { Request, Response } from 'express';
import * as sparql from 'rdf-sparql-builder';

// Local imports
import { settings } from '../settings';

export async function query(req: Request, res: Response) {
  const s = rdf.variable('s');
  const p = rdf.variable('p');
  const o = rdf.variable('o');

  const select = sparql
    .select([s, p, o])
    .where([[s, p, o]])
    .limit(100);

  const url = new URL(settings.SCG_URL);
  url.pathname = '/knowledge/sparql';

  try {
    const resp = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/sparql-query'
      },
      body: select.toString()
    });
    if (resp.ok) {
      res.json(JSON.parse(await resp.text()));
    } else {
      console.error('SCG responded with', resp.status);
      res.status(500).end();
    }
  } catch (e) {
    console.log(e);
    if (e instanceof TypeError) {
      throw new Error(`SCG request has failed: ${e.cause['code']}`);
    }
    throw e;
  }
}
