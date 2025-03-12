// Global imports
import * as sparql from 'rdf-sparql-builder';
import { Request } from 'express';

// Local imports
import { settings } from './settings';

async function sendInsertQuery(req: Request, insertQuery) {
  const url = new URL(settings.SCG_URL);
  url.pathname = 'knowledge/update';

  const headers = {
    'Content-Type': 'application/sparql-update',
  };

  if (req.headers['X-Auth-Request-Access-Token']) {
    headers['X-Auth-Request-Access-Token'] = req.headers['X-Auth-Request-Access-Token'];
  }

  const insertResp = await fetch(url, {
    method: 'POST',
    headers,
    body: insertQuery.toString()
  });
  if (insertResp.status !== 204) {
    throw new Error(`Unexpected response status: ${insertResp.status}`);
  }
}

export async function insert(req: Request, { triples, where }: { triples; where?}) {
  let insertQuery = sparql.insert(triples);
  if (where) {
    insertQuery = insertQuery.where(where);
  }
  await sendInsertQuery(req, insertQuery);
}

export async function insertData(req: Request, triples) {
  await sendInsertQuery(req, sparql.insertData(triples));
}

export type ResultRow = Record<
  string,
  {
    type: string;
    value: string;
  }
>;

export async function select(req: Request, {
  clause,
  filters,
  orderBy,
  selection = ['*']
}: {
  clause;
  filters?;
  orderBy?;
  selection?;
}): Promise<ResultRow[]> {
  let selectQuery = sparql.select(selection).distinct().where(clause);

  if (orderBy) {
    selectQuery = selectQuery.orderBy(orderBy);
  }

  if (filters) {
    selectQuery = selectQuery.filter(filters);
  }

  const url = new URL(settings.SCG_URL);
  url.pathname = 'knowledge/sparql';

  const headers = {
    'Content-Type': 'application/sparql-query',
  };

  if (req.headers['X-Auth-Request-Access-Token']) {
    headers['X-Auth-Request-Access-Token'] = req.headers['X-Auth-Request-Access-Token'];
  }

  const selectResp = await fetch(url, {
    method: 'POST',
    headers,
    body: selectQuery.toString()
  });

  if (selectResp.status !== 200) {
    throw new Error(`Unexpected response status: ${selectResp.status}`);
  }

  const data = JSON.parse(await selectResp.text());
  return data?.results?.bindings || ([] as ResultRow[]);
}
