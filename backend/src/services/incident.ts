// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import * as sparql from 'rdf-sparql-builder';
import TriplePattern from 'rdf-sparql-builder/lib/TriplePattern';

// Local imports
import { Incident, Referrer } from 'common/Incident';
import { IncidentAttachment } from 'common/IncidentAttachment';
import { IncidentType, addIncidentSuffix, removeIncidentSuffix } from 'common/IncidentType';
import { IncidentTypes } from 'common/IncidentTypes';
import { LogEntryType } from 'common/LogEntryType';
import { LogEntryAttachmentType } from 'common/LogEntryAttachment';
import { addStageSuffix, IncidentStage, removeStageSuffix } from 'common/IncidentStage';

import * as ia from '../ia';
import { literalDate, literalString, ns, nodeValue } from '../rdfutil';
import { ApplicationError, InvalidValueError } from '../errors';
import { getScanResultInternal } from './fileStorage';

type Amendments = Record<string, string>;

export async function create(req: Request, res: Response) {
  const incident = Incident.check(req.body);

  incident.id = randomUUID();
  incident.reportedBy = {
    username: res.locals.user.username,
    displayName: res.locals.user.displayName
  };

  const incidentBoundingState = randomUUID();
  const incidentState = randomUUID();
  const stateBoundingState = randomUUID();

  const startDateNode = literalDate(new Date(incident.startedAt));
  const incidentIdNode = ns.data(incident.id);
  const incidentStateNode = ns.data(incidentState);
  const reportedByNode = ns.data(incident.reportedBy.username);
  const referrerNode = ns.data(randomUUID());

  const referrerTriples = [
    [referrerNode, ns.rdf.type, ns.lisa.Referrer],
    [referrerNode, ns.ies.hasName, literalString(incident.referrer.name)],
    [referrerNode, ns.lisa.hasOrg, literalString(incident.referrer.organisation)],
    [referrerNode, ns.lisa.hasTel, literalString(incident.referrer.telephone)],
    [referrerNode, ns.lisa.hasEmail, literalString(incident.referrer.email)],
    [referrerNode, ns.lisa.hasSupportRequest, literalString(incident.referrer.supportRequested)]
  ];
  if (incident.referrer.supportRequested === 'Yes') {
    referrerTriples.push([
      referrerNode,
      ns.lisa.hasSupportRequestDesc,
      literalString(incident.referrer.supportDescription)
    ]);
  }
  referrerTriples.push([incidentIdNode, ns.lisa.hasReferrer, referrerNode]);

  await ia.insertData([
    [incidentIdNode, ns.rdf.type, ns.lisa(addIncidentSuffix(incident.type))],
    [incidentIdNode, ns.ies.hasName, literalString(incident.name)],
    [incidentIdNode, ns.lisa.createdAt, literalDate(new Date())],

    [reportedByNode, ns.rdf.type, ns.ies.Creator],
    [reportedByNode, ns.ies.hasName, literalString(incident.reportedBy.displayName)],
    [reportedByNode, ns.ies.isParticipantIn, incidentIdNode],

    ...referrerTriples,

    [ns.data(incidentBoundingState), ns.ies.inPeriod, startDateNode],
    [ns.data(incidentBoundingState), ns.ies.isStartOf, incidentIdNode],

    [incidentStateNode, ns.rdf.type, ns.lisa(addStageSuffix(incident.stage))],
    [incidentStateNode, ns.ies.isStateOf, incidentIdNode],
    [ns.data(stateBoundingState), ns.ies.inPeriod, startDateNode],
    [ns.data(stateBoundingState), ns.ies.isStartOf, incidentStateNode]
  ]);

  res.json({ id: incident.id }).end();
}

export async function changeStage(req: Request, res: Response) {
  const { id: incidentId, stage: stageStr, sequence: seqNumber } = req.body;

  const stage = IncidentStage.check(stageStr);

  const incidentIdNode = ns.data(incidentId);

  const notExistsFilter = new TriplePattern('?x', ns.ies.isEndOf, '?lastStateNodeId');

  const results = await ia.select({
    selection: ['?stage', '?lastStateNodeId'],
    clause: [
      ['?lastStateNodeId', ns.ies.isStateOf, incidentIdNode],
      ['?lastStateNodeId', ns.rdf.type, '?stage'],
      ['?lastBoundingStateId', ns.ies.isStartOf, '?lastStateNodeId'],
      ['?lastBoundingStateId', ns.ies.inPeriod, '?startDate'],
      `FILTER NOT EXISTS {${notExistsFilter}}`
    ]
  });

  if (results.length === 0) {
    res.sendStatus(404);
    return;
  }

  if (results.length !== 1) {
    throw new ApplicationError(
      `Query for latest stage of incident ${incidentId} returned multiple rows: ${results}`
    );
  }

  const row = results[0];
  const curStage = removeStageSuffix(row.stage.value);
  if (curStage === stage) {
    throw new InvalidValueError('New stage is the same as the old stage');
  }
  const lastStateNodeId = nodeValue(row.lastStateNodeId.value);
  const incidentState = randomUUID();
  const lastStateBoundingStateNode = ns.data(randomUUID());
  const stateBoundingStateNode = ns.data(randomUUID());

  const entryIdNode = ns.data(randomUUID());
  const authorNode = ns.data(randomUUID());

  const now = new Date();
  const incidentStateNode = ns.data(incidentState);
  const startDateNode = literalDate(now);

  await ia.insert({
    triples: [
      // Closing the last state
      [lastStateBoundingStateNode, ns.ies.inPeriod, startDateNode],
      [lastStateBoundingStateNode, ns.ies.isEndOf, ns.data(lastStateNodeId)],

      // Creating a new open-ended state
      [incidentStateNode, ns.rdf.type, ns.lisa(addStageSuffix(stage))],
      [incidentStateNode, ns.ies.isStateOf, incidentIdNode],
      [stateBoundingStateNode, ns.ies.inPeriod, startDateNode],
      [stateBoundingStateNode, ns.ies.isStartOf, incidentStateNode],

      // Adding a 'ChangeState' LogEntry
      [incidentIdNode, ns.lisa.hasLogEntry, entryIdNode],
      [entryIdNode, ns.rdf.type, ns.lisa('ChangeStage' as LogEntryType)],
      [entryIdNode, ns.lisa.inStage, literalString(stage)],
      [entryIdNode, ns.ies.inPeriod, startDateNode],
      [entryIdNode, ns.lisa.createdAt, literalDate(now)],
      [entryIdNode, ns.lisa.hasSequence, literalString(seqNumber)],

      [authorNode, ns.rdf.type, ns.ies.Creator],
      [authorNode, ns.ies.hasName, literalString(res.locals.user.displayName)],
      [authorNode, ns.ies.isParticipantIn, entryIdNode]
    ],
    where: [
      `FILTER NOT EXISTS {${new TriplePattern('?x', ns.ies.isEndOf, ns.data(lastStateNodeId))}}`
    ]
  });

  res.json({ id: incidentId, ...results[0] });
}

function getReferrer(row: ia.ResultRow, amendments?: Amendments): Referrer | undefined {
  if (!row.referrerName?.value) {
    return undefined;
  }
  const referrer: Partial<Referrer> = {
    name: amendments?.['referrer.name'] ?? row.referrerName?.value,
    organisation: amendments?.['referrer.organisation'] ?? row.referrerOrg?.value,
    telephone: amendments?.['referrer.telephone'] ?? row.referrerTel?.value,
    email: amendments?.['referrer.email'] ?? row.referrerEmail?.value
  };
  const supportRequested =
    amendments?.['referrer.supportRequested'] ?? row.referrerSupportRequested?.value;
  if (supportRequested === 'Yes') {
    referrer.supportRequested = 'Yes';
    referrer.supportDescription =
      amendments?.['referrer.supportDescription'] ?? row.referrerSupportDesc?.value;
  } else {
    referrer.supportRequested = 'No';
  }
  return referrer as Referrer;
}

function getName(row: ia.ResultRow, amendments?: Amendments): string {
  return amendments?.name ?? row.name?.value;
}

function mapIncident(row: ia.ResultRow, amendmentsByIncident: Map<string, Amendments>): Incident {
  return {
    id: nodeValue(row.id.value),
    type: removeIncidentSuffix(nodeValue(row.type.value)),
    stage: removeStageSuffix(nodeValue(row.stage.value)),
    startedAt: row.startedAt.value,
    createdAt: row.createdAt?.value,
    name: getName(row, amendmentsByIncident[nodeValue(row.id.value)]),
    referrer: getReferrer(row, amendmentsByIncident[nodeValue(row.id.value)]),
    reportedBy: {
      username: row.reportedByName?.value ?? undefined,
      displayName: row.reportedByName?.value ?? undefined
    }
  } satisfies Incident;
}

export async function get(_: Request, res: Response) {
  const typeFilters = Object.keys(IncidentTypes).map(
    (value: string) => `<${ns.lisa(addIncidentSuffix(value as IncidentType)).value}>`
  );

  const requests: Promise<ia.ResultRow[]>[] = [];

  requests.push(
    ia.select({
      clause: [
        ['?id', ns.lisa.hasLogEntry, '?entryId'],
        ['?entryId', ns.lisa.createdAt, '?createdAt'],
        ['?entryId', ns.rdf.type, '?type'],
        ['?entryId', ns.lisa.hasField, '?fieldId'],
        ['?fieldId', ns.ies.hasName, '?fieldName'],
        ['?fieldId', ns.ies.hasValue, '?fieldValue'],
        `VALUES (?type) { (<${ns.lisa('SetIncidentInformation').value}>) }`
      ],
      orderBy: [['?createdAt', 'ASC']]
    })
  );

  const valuesMappedtypeFilters = typeFilters.map((typeFilter) => `(${typeFilter})`);

  requests.push(
    ia.select({
      clause: [
        ['?id', ns.rdf.type, '?type'],
        ['?isStateOf', ns.ies.isStateOf, '?id'],
        ['?isStateOf', ns.rdf.type, '?stage'],
        ['?isStartOf', ns.ies.isStartOf, '?id'],
        ['?isStartOf', ns.ies.inPeriod, '?startedAt'],
        sparql.optional([
          ['?id', ns.ies.hasName, '?name'],
          ['?reportedBy', ns.ies.isParticipantIn, '?id'],
          ['?reportedBy', ns.ies.hasName, '?reportedByName']
        ]),
        sparql.optional([
          ['?id', ns.lisa.hasReferrer, '?referrer'],
          ['?referrer', ns.ies.hasName, '?referrerName'],
          ['?referrer', ns.lisa.hasOrg, '?referrerOrg'],
          ['?referrer', ns.lisa.hasTel, '?referrerTel'],
          ['?referrer', ns.lisa.hasEmail, '?referrerEmail'],
          ['?referrer', ns.lisa.hasSupportRequest, '?referrerSupportRequested'],
          sparql.optional([['?referrer', ns.lisa.hasSupportRequestDesc, '?referrerSupportDesc']])
        ]),
        sparql.optional([['?id', ns.lisa.createdAt, '?createdAt']]),
        `FILTER NOT EXISTS {${new TriplePattern('?x', ns.ies.isEndOf, '?isStateOf')}}`,
        `VALUES (?type) { ${valuesMappedtypeFilters.join('\n')} }`
      ],
      orderBy: [['?startedAt', 'DESC']]
    })
  );

  const [amendments, results] = await Promise.all(requests);

  const amendmentsByIncident = amendments.reduce((map, row) => {
    const incidentId = nodeValue(row.id.value);
    const amends = map[incidentId] ?? {};
    amends[row.fieldName.value] = row.fieldValue.value;
    return { ...map, [incidentId]: amends };
  }, new Map<string, Amendments>());

  const incidents = results.map((row) => mapIncident(row, amendmentsByIncident));

  res.json(incidents);
}

export async function getById(req: Request, res: Response) {
  const { incidentId } = req.params;

  if (!incidentId) {
    return res.sendStatus(400);
  }

  const incidentIdNode = ns.data(incidentId);

  const requests: Promise<ia.ResultRow[]>[] = [
    ia.select({
      clause: [
        [incidentIdNode, ns.lisa.hasLogEntry, '?entryId'],
        ['?entryId', ns.lisa.createdAt, '?createdAt'],
        ['?entryId', ns.rdf.type, '?type'],
        ['?entryId', ns.lisa.hasField, '?fieldId'],
        ['?fieldId', ns.ies.hasName, '?fieldName'],
        ['?fieldId', ns.ies.hasValue, '?fieldValue'],
        `VALUES (?type) { (<${ns.lisa('SetIncidentInformation').value}>) }`
      ],
      orderBy: [['?createdAt', 'ASC']]
    }),
    ia.select({
      clause: [
        [incidentIdNode, ns.rdf.type, '?type'],
        ['?isStateOf', ns.ies.isStateOf, incidentIdNode],
        ['?isStateOf', ns.rdf.type, '?stage'],
        ['?isStartOf', ns.ies.isStartOf, incidentIdNode],
        ['?isStartOf', ns.ies.inPeriod, '?startedAt'],
        sparql.optional([
          [incidentIdNode, ns.ies.hasName, '?name'],
          ['?reportedBy', ns.ies.isParticipantIn, incidentIdNode],
          ['?reportedBy', ns.ies.hasName, '?reportedByName']
        ]),
        sparql.optional([
          [incidentIdNode, ns.lisa.hasReferrer, '?referrer'],
          ['?referrer', ns.ies.hasName, '?referrerName'],
          ['?referrer', ns.lisa.hasOrg, '?referrerOrg'],
          ['?referrer', ns.lisa.hasTel, '?referrerTel'],
          ['?referrer', ns.lisa.hasEmail, '?referrerEmail'],
          ['?referrer', ns.lisa.hasSupportRequest, '?referrerSupportRequested'],
          sparql.optional([['?referrer', ns.lisa.hasSupportRequestDesc, '?referrerSupportDesc']])
        ]),
        sparql.optional([[incidentIdNode, ns.lisa.createdAt, '?createdAt']]),
        `FILTER NOT EXISTS {${new TriplePattern('?x', ns.ies.isEndOf, '?isStateOf')}}`
      ],
      orderBy: [['?startedAt', 'DESC']]
    })
  ];

  const [amendments, results] = await Promise.all(requests);

  if (results.length === 0) {
    return res.sendStatus(404);
  }

  const amendmentsByIncident = amendments.reduce((map, row) => {
    const amends = map[incidentId] ?? {};
    amends[row.fieldName.value] = row.fieldValue.value;
    return { ...map, [incidentId]: amends };
  }, new Map<string, Amendments>());

  return res.json(
    mapIncident({ id: { type: 'string', value: incidentId }, ...results[0] }, amendmentsByIncident)
  );
}

export async function getAttachments(req: Request, res: Response) {
  const { incidentId } = req.params;

  const results = await ia.select({
    clause: [
      [ns.data(incidentId), ns.lisa.hasLogEntry, '?id'],
      ['?id', ns.lisa.createdAt, '?createdAt'],
      ['?author', ns.ies.isParticipantIn, '?id'],
      ['?author', ns.ies.hasName, '?authorName'],
      ['?id', ns.lisa.hasAttachment, '?attachmentId'],
      ['?attachmentId', ns.ies.hasName, '?attachmentName'],
      ['?attachmentId', ns.ies.hasKey, '?attachmentKey'],
      ['?attachmentId', ns.lisa.hasSize, '?attachmentSize'],
      ['?attachmentId', ns.lisa.hasMimeType, '?attachmentMimeType'],
      ['?attachmentId', ns.lisa.hasAttachmentType, '?attachmentType']
    ]
  });

  const attachments = await Promise.all(
    results.map(
      async (row) =>
        ({
          logEntryId: nodeValue(row.id.value),
          author: {
            username: row.authorName?.value,
            displayName: row.authorName?.value
          },
          uploadedAt: row.createdAt.value,
          name: row.attachmentName.value,
          type: row.attachmentType.value as LogEntryAttachmentType,
          key: row.attachmentKey.value,
          mimeType: row.attachmentMimeType.value,
          size: Number(row.attachmentSize.value),
          scanResult: await getScanResultInternal(row.attachmentKey.value)
        }) satisfies IncidentAttachment
    )
  );

  res.json(attachments);
}
