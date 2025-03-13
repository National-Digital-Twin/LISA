/* eslint-disable dot-notation */
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

  // eslint-disable-next-line max-len
  req.headers['x-auth-request-access-token'] = 'eyJraWQiOiI4NGlvRU91SThkNlwvXC9iaDhYN2RaZVdYUjdjSDNhMXZlY01IK3oyd3p1dVE9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIxNjgyYjJjNC03MGUxLTcwY2ItM2ZkOC0zYzNmYzE0ZmM4NDYiLCJjb2duaXRvOmdyb3VwcyI6WyJ0Y19yZWFkIiwiaXJpc19hY2Nlc3MiLCJwYXJhbG9nX2FjY2VzcyIsInRjX3dyaXRlIiwibGlzYV9hY2Nlc3MiLCJ0Y19hZG1pbiJdLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0yLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMl8yNGZPQ2puZFYiLCJncm91cHMiOlsidGNfcmVhZCIsImlyaXNfYWNjZXNzIiwicGFyYWxvZ19hY2Nlc3MiLCJ0Y193cml0ZSIsImxpc2FfYWNjZXNzIiwidGNfYWRtaW4iXSwidmVyc2lvbiI6MiwiY2xpZW50X2lkIjoiN3I5azFjY2tlNmJlbnM0cWZvMDIydGlyNHUiLCJvcmlnaW5fanRpIjoiOTI3YjAwYTYtZjMxOC00YzcyLTg3NGUtMGExNGRjOTk5NGI1IiwiZXZlbnRfaWQiOiJiZmExOTM3OS04MzRjLTRjYWYtOWYxNS1hMjE1ZjM3MDdkYmIiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6Im9wZW5pZCBlbWFpbCIsImF1dGhfdGltZSI6MTc0MTg2Mjk4MCwiZXhwIjoxNzQxODY2NTgwLCJpYXQiOjE3NDE4NjI5ODEsImVtYWlsIjoib3dlbi5sYW1iZXJ0QGluZm9ybWVkLmNvbSIsImp0aSI6ImI4ZDBhMDA5LTkxNjMtNDMyZS04ZmY2LThkMjk5ZDU4NjY1MCIsInVzZXJuYW1lIjoib3dlbi5sYW1iZXJ0In0.hbLd75lTnx20_JsdoPZiXxds_1jZOoQkBu8nKIVs447HZXbpBarC1FNu_iEGWDm_-F5SEt8YjLMJLT49bd6LjVlFuNkjtQ5xZXWFxBGT-gjOm4d5EDCyHleJdSBDvR6V8GzAJV_nd0_2Howyf_lUVBKXkcGsEnrAE9VZDbvzy0GKA52VPRXWV2cE5o6MVF5DXVKEdTNTK9DoVFwRRVJxxjgath4ZlXN31R5QCArwmfta5N8Js4PQyCIq1W_0tnFdEIGDVws49wPY9P_HsJQc3mrplIZ7tPsfWNGMrvbBlf_EICo-K0K6Kx8ia6bhdBdsHS7WaFi6umucP0W6w-l-9g';

  if (req.headers['x-auth-request-access-token']) {
    headers['Authorization'] = `Bearer ${req.headers['x-auth-request-access-token']}`;
  }

  console.log(`Temporary logging - INSERT query - ${JSON.stringify(headers)}`);

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

  // eslint-disable-next-line max-len
  req.headers['x-auth-request-access-token'] = 'eyJraWQiOiI4NGlvRU91SThkNlwvXC9iaDhYN2RaZVdYUjdjSDNhMXZlY01IK3oyd3p1dVE9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIxNjgyYjJjNC03MGUxLTcwY2ItM2ZkOC0zYzNmYzE0ZmM4NDYiLCJjb2duaXRvOmdyb3VwcyI6WyJ0Y19yZWFkIiwiaXJpc19hY2Nlc3MiLCJwYXJhbG9nX2FjY2VzcyIsInRjX3dyaXRlIiwibGlzYV9hY2Nlc3MiLCJ0Y19hZG1pbiJdLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0yLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMl8yNGZPQ2puZFYiLCJncm91cHMiOlsidGNfcmVhZCIsImlyaXNfYWNjZXNzIiwicGFyYWxvZ19hY2Nlc3MiLCJ0Y193cml0ZSIsImxpc2FfYWNjZXNzIiwidGNfYWRtaW4iXSwidmVyc2lvbiI6MiwiY2xpZW50X2lkIjoiN3I5azFjY2tlNmJlbnM0cWZvMDIydGlyNHUiLCJvcmlnaW5fanRpIjoiOTI3YjAwYTYtZjMxOC00YzcyLTg3NGUtMGExNGRjOTk5NGI1IiwiZXZlbnRfaWQiOiJiZmExOTM3OS04MzRjLTRjYWYtOWYxNS1hMjE1ZjM3MDdkYmIiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6Im9wZW5pZCBlbWFpbCIsImF1dGhfdGltZSI6MTc0MTg2Mjk4MCwiZXhwIjoxNzQxODY2NTgwLCJpYXQiOjE3NDE4NjI5ODEsImVtYWlsIjoib3dlbi5sYW1iZXJ0QGluZm9ybWVkLmNvbSIsImp0aSI6ImI4ZDBhMDA5LTkxNjMtNDMyZS04ZmY2LThkMjk5ZDU4NjY1MCIsInVzZXJuYW1lIjoib3dlbi5sYW1iZXJ0In0.hbLd75lTnx20_JsdoPZiXxds_1jZOoQkBu8nKIVs447HZXbpBarC1FNu_iEGWDm_-F5SEt8YjLMJLT49bd6LjVlFuNkjtQ5xZXWFxBGT-gjOm4d5EDCyHleJdSBDvR6V8GzAJV_nd0_2Howyf_lUVBKXkcGsEnrAE9VZDbvzy0GKA52VPRXWV2cE5o6MVF5DXVKEdTNTK9DoVFwRRVJxxjgath4ZlXN31R5QCArwmfta5N8Js4PQyCIq1W_0tnFdEIGDVws49wPY9P_HsJQc3mrplIZ7tPsfWNGMrvbBlf_EICo-K0K6Kx8ia6bhdBdsHS7WaFi6umucP0W6w-l-9g';

  if (req.headers['x-auth-request-access-token']) {
    headers['Authorization'] = `Bearer ${req.headers['x-auth-request-access-token']}`;
  }

  console.log(`Temporary logging - SELECT query - ${JSON.stringify(headers)}`);

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
