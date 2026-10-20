// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2026. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the UK's Department for Business, Innovation, Science and Trade (BIST) as the governing entity.

// Global imports
import * as sparql from 'rdf-sparql-builder';

// Local imports
import { settings } from './settings';

async function sendInsertQuery(insertQuery, accessToken?: string) {
  const url = new URL(settings.SCG_URL);
  url.pathname = 'knowledge/update';

  const insertResp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/sparql-update',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
    },
    body: insertQuery.toString()
  });
  if (insertResp.status !== 204) {
    throw new Error(`Unexpected response status: ${insertResp.status}`);
  }
}

export async function insert({ triples, where, accessToken }: { triples; where?; accessToken?: string }) {
  let insertQuery = sparql.insert(triples);
  if (where) {
    insertQuery = insertQuery.where(where);
  }
  await sendInsertQuery(insertQuery, accessToken);
}

export async function insertData(triples, accessToken?: string) {
  await sendInsertQuery(sparql.insertData(triples), accessToken);
}

export type ResultRow = Record<
  string,
  {
    type: string;
    value: string;
  }
>;

export async function select({
  clause,
  filters,
  orderBy,
  selection = ['*'],
  accessToken
}: {
  clause;
  filters?;
  orderBy?;
  selection?;
  accessToken?: string;
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

  const selectResp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/sparql-query',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
    },
    body: selectQuery.toString()
  });

  if (selectResp.status !== 200) {
    throw new Error(`Unexpected response status: ${selectResp.status}`);
  }

  const data = JSON.parse(await selectResp.text());
  return data?.results?.bindings || ([] as ResultRow[]);
}
