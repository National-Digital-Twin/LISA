// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { randomUUID } from 'crypto';
import { CreateTask } from 'common/Task';
import { Request, Response } from 'express';
import { literalDate, literalString, ns } from '../../rdfutil';
import { create as createNotification } from '../notifications';
import * as ia from '../../ia';
import { extractAttachments } from '../common/attachments';
import { addLocationTriples } from '../common/location';

export async function create(req: Request, res: Response) {
  const { incidentId } = req.params;
  if (!incidentId) {
    res.status(400).end();
    return;
  }

  const task = CreateTask.check(
    req.files?.length ? { ...JSON.parse(req.body.task), incidentId } : { ...req.body, incidentId }
  );

  const taskId = task.id ?? randomUUID();
  const taskNode = ns.data(taskId);
  const incidentNode = ns.data(task.incidentId);
  const now = new Date();
  const nowNode = literalDate(now);

  const authorNode = ns.data(res.locals.user.username);
  const assigneeNode = ns.data(task.assignee.username);
  const statusNode = ns.data(randomUUID());
  const statusBoundingNode = ns.data(randomUUID());
  const assigneeStateNode = ns.data(randomUUID());
  const assigneeBoundingNode = ns.data(randomUUID());

  const { triples: attachmentTriples } = await extractAttachments(req, task.attachments, taskNode);

  const locationTriples = addLocationTriples(task.location, taskNode);
  const content = task.content ?? {}; // should probably be invalid request?

  const triples = [
    [incidentNode, ns.lisa.hasTask, taskNode],
    [taskNode, ns.rdf.type, ns.lisa.Task],
    [taskNode, ns.ies.hasName, literalString(task.name)],
    [taskNode, ns.lisa.contentText, literalString(content.text ?? '')],
    [taskNode, ns.lisa.contentJSON, literalString(content.json ?? '{}')],
    [taskNode, ns.lisa.createdAt, literalDate(now)],
    [taskNode, ns.lisa.hasSequence, task.sequence],

    // Author
    [authorNode, ns.rdf.type, ns.ies.Creator],
    [authorNode, ns.ies.hasName, literalString(res.locals.user.displayName)],
    [authorNode, ns.ies.isParticipantIn, taskNode],

    // Assignee
    [assigneeNode, ns.ies.hasName, literalString(task.assignee.displayName)],
    [assigneeStateNode, ns.rdf.type, ns.lisa.assignee],
    [assigneeStateNode, ns.ies.isStateOf, taskNode],
    [assigneeStateNode, ns.ies.relatesTo, assigneeNode],
    [assigneeBoundingNode, ns.ies.inPeriod, nowNode],
    [assigneeBoundingNode, ns.ies.isStartOf, assigneeStateNode],

    // Status
    [statusNode, ns.rdf.type, ns.lisa(task.status || 'ToDo')],
    [statusNode, ns.ies.isStateOf, taskNode],
    [statusBoundingNode, ns.ies.inPeriod, nowNode],
    [statusBoundingNode, ns.ies.isStartOf, statusNode],

    ...attachmentTriples,
    ...locationTriples
  ];

  await ia.insertData(triples);

  createNotification({
    recipient: task.assignee.username,
    type: 'TaskAssignedNotification',
    incidentId: task.incidentId,
    taskId
  });

  // TODO: create a log entry for this to notify of task creation like the status update one
  // await createTaskCreationLogEntry(incidentId, taskId, task, res.locals.user);

  res.json({ id: taskId });
}
