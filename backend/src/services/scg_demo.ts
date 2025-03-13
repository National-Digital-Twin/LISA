/* eslint-disable dot-notation */
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

  const headers = {
    'Content-Type': 'application/sparql-query',
  };

  if (req.headers['x-auth-request-access-token']) {
    headers['Authorization'] = `Bearer ${req.headers['x-auth-request-access-token']}`;
  }

  try {
    const resp = await fetch(url.toString(), {
      method: 'POST',
      headers,
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
