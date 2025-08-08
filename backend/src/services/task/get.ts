// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Request, Response } from 'express';
import { Task, TaskStatus } from 'common/Task';
import { tasks } from '../logEntry/utils/select/tasks';
import { type ResultRow } from '../../ia';
import { nodeValue } from '../../rdfutil';

function removePrefix(uri: string): string {
  return uri.split('#').pop() || uri.split('/').pop() || uri;
}

async function parseTasks(results: ResultRow[], incidentId: string): Promise<Task[]> {
  return results.map((result) => {
    const taskId = nodeValue(result.taskId.value);
    const assigneeNode = result.assignee?.value;
    const assigneeUsername = assigneeNode ? nodeValue(assigneeNode) : undefined;

    const authorNode = result.author?.value;
    const authorUsername = authorNode ? nodeValue(authorNode) : undefined;

    const task: Task = {
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

    return task;
  });
}

export async function get(req: Request, res: Response) {
  const { incidentId } = req.params;

  if (!incidentId) {
    res.status(400).end();
    return;
  }

  try {
    const taskResults = await tasks(incidentId);
    const tasksArray = await parseTasks(taskResults, incidentId);

    res.json(tasksArray);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
}
