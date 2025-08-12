// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Request, Response } from 'express';
import { Task, TaskStatus } from 'common/Task';
import { tasks } from './utils/select/tasks';
import { type ResultRow } from '../../ia';
import { nodeValue } from '../../rdfutil';

function removePrefix(uri: string): string {
  return uri.split('#').pop() || uri.split('/').pop() || uri;
}

function mapResultToTask(result: ResultRow): Task {
  const taskId = nodeValue(result.taskId.value);
  const incidentId = nodeValue(result.incidentId.value);
  const assigneeNode = result.assignee?.value;
  const assigneeUsername = assigneeNode ? nodeValue(assigneeNode) : undefined;

  const authorNode = result.author?.value;
  const authorUsername = authorNode ? nodeValue(authorNode) : undefined;

  return {
    id: taskId,
    name: result.taskName.value,
    description: result.description.value,
    incidentId,
    author: {
      username: authorUsername ?? 'unknown',
      displayName: result.authorName?.value ?? 'Unknown User'
    },
    assignee: {
      username: assigneeUsername ?? result.assigneeName?.value ?? 'unknown',
      displayName: result.assigneeName?.value ?? 'Unknown User'
    },
    status: removePrefix(result.taskStatus?.value || 'ToDo') as TaskStatus,
    sequence: result.sequence.value,
    createdAt: result.createdAt.value
  };
}

export async function getForIncidentId(req: Request, res: Response) {
  const { incidentId } = req.params;
  if (!incidentId) {
    res.status(400).end();
    return;
  }

  try {
    const taskResults = await tasks(incidentId);
    const tasksArray = taskResults.map((r) => mapResultToTask(r));
    res.json(tasksArray);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
}

export async function get(_req: Request, res: Response) {
  try {
    const taskResults = await tasks();
    const tasksArray = taskResults.map((r) => mapResultToTask(r));
    res.json(tasksArray);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
}
