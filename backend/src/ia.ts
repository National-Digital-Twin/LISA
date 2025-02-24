// Global imports
import * as sparql from 'rdf-sparql-builder';

// Local imports
import { settings } from './settings';

async function sendInsertQuery(insertQuery) {
  const url = new URL(settings.SCG_URL);
  url.pathname = 'knowledge/update';

  const insertResp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/sparql-update'
    },
    body: insertQuery.toString()
  });
  if (insertResp.status !== 204) {
    throw new Error(`Unexpected response status: ${insertResp.status}`);
  }
}

export async function insert({ triples, where }: { triples; where? }) {
  let insertQuery = sparql.insert(triples);
  if (where) {
    insertQuery = insertQuery.where(where);
  }
  await sendInsertQuery(insertQuery);
}

export async function insertData(triples) {
  await sendInsertQuery(sparql.insertData(triples));
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

  const selectResp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/sparql-query'
    },
    body: selectQuery.toString()
  });

  if (selectResp.status !== 200) {
    throw new Error(`Unexpected response status: ${selectResp.status}`);
  }

  const data = JSON.parse(await selectResp.text());
  return data?.results?.bindings || ([] as ResultRow[]);
}
