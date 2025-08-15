// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Request, Response } from 'express';
import { Task, TaskStatus } from 'common/Task';
import { selectAll } from './utils/select';
import { type ResultRow } from '../../ia';
import { nodeValue } from '../../rdfutil';
import { parseAttachments } from '../common/attachments';
import { buildLocation, parseLocations } from '../common/location';

function removePrefix(uri: string): string {
  return uri.split('#').pop() || uri.split('/').pop() || uri;
}


async function mapResultsToTasks(
  taskResults: ResultRow[],
  attachmentResults: ResultRow[]
): Promise<Task[]> {
  const taskMap = new Map<string, Task>();

  const attachmentsByTask = await parseAttachments(attachmentResults, 'taskId');
  const locationsByTask = parseLocations(taskResults, 'taskId');

  for (const result of taskResults) {
    const taskId = nodeValue(result.taskId.value);

    if (!taskMap.has(taskId)) {
      const incidentId = nodeValue(result.incidentId.value);
      const assigneeNode = result.assignee?.value;
      const assigneeUsername = assigneeNode ? nodeValue(assigneeNode) : undefined;
      const authorNode = result.author?.value;
      const authorUsername = authorNode ? nodeValue(authorNode) : undefined;

      taskMap.set(taskId, {
        id: taskId,
        name: result.taskName.value,
        description: result.description.value,
        incidentId,
        author: {
          username: authorUsername ?? 'unknown',
          displayName: result.authorName?.value ?? 'Unknown User'
        },
        assignee: {
          username: assigneeUsername ?? 'unknown',
          displayName: result.assigneeName?.value ?? 'Unknown User'
        },
        status: removePrefix(result.taskStatus?.value || 'ToDo') as TaskStatus,
        sequence: result.sequence.value,
        createdAt: result.createdAt.value,
        location: null,
        attachments: []
      });
    }
  }

  for (const task of taskMap.values()) {
    task.attachments = attachmentsByTask[task.id] ?? [];
    const locationData = locationsByTask[task.id];
    if (locationData) {
      task.location = buildLocation(locationData.coordinates, locationData.description);
    }
  }

  return Array.from(taskMap.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getForIncidentId(req: Request, res: Response) {
  const { incidentId } = req.params;
  if (!incidentId) {
    res.status(400).end();
    return;
  }

  try {
    const [taskResults, attachmentResults] = await Promise.all(selectAll(incidentId));
    const tasksArray = await mapResultsToTasks(taskResults, attachmentResults);
    res.json(tasksArray);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
}

export async function get(_req: Request, res: Response) {
  try {
    const [taskResults, attachmentResults] = await Promise.all(selectAll());
    const tasksArray = await mapResultsToTasks(taskResults, attachmentResults);
    res.json(tasksArray);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
}
