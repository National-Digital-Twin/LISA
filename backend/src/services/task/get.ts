// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Request, Response } from 'express';
import { Task, TaskStatus } from 'common/Task';
import { type Location, type Coordinates } from 'common/Location';
import { tasks } from './utils/select/tasks';
import { type ResultRow } from '../../ia';
import { nodeValue } from '../../rdfutil';
import { parseAttachments } from '../common/attachments';

function removePrefix(uri: string): string {
  return uri.split('#').pop() || uri.split('/').pop() || uri;
}

async function mapResultsToTasks(results: ResultRow[]): Promise<Task[]> {
  const taskMap = new Map<string, Task>();
  const locationMap = new Map<string, { coordinates: Coordinates[]; description?: string }>();


  const attachmentsByTask = await parseAttachments(results, 'taskId');

  for (const result of results) {
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
        location: null, // Will be populated later
        attachments: [] // Will be populated later
      });

      locationMap.set(taskId, { coordinates: [] });
    }

    if (result.locationId) {
      const location = locationMap.get(taskId)!;
      
      if (result.latitude && result.longitude) {
        const lat = Number(result.latitude.value);
        const lng = Number(result.longitude.value);
        
        if (!location.coordinates.find(c => c.latitude === lat && c.longitude === lng)) {
          location.coordinates.push({ latitude: lat, longitude: lng });
        }
      }
      
      if (result.locationDescription && !location.description) {
        location.description = result.locationDescription.value;
      }
    }
  }

  // Update tasks with final location and attachment data
  for (const task of taskMap.values()) {
    const attachments = attachmentsByTask[task.id];
    const locationData = locationMap.get(task.id)!;
    
    let location: Location | null = null;
    if (locationData.coordinates.length > 0 && locationData.description) {
      location = { type: 'both', coordinates: locationData.coordinates, description: locationData.description };
    } else if (locationData.coordinates.length > 0) {
      location = { type: 'coordinates', coordinates: locationData.coordinates };
    } else if (locationData.description) {
      location = { type: 'description', description: locationData.description };
    }

    task.attachments = attachments ?? [];
    task.location = location;
  }

  // Sort by createdAt descending to preserve SPARQL ordering after Map operations
  return Array.from(taskMap.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getForIncidentId(req: Request, res: Response) {
  const { incidentId } = req.params;
  if (!incidentId) {
    res.status(400).end();
    return;
  }

  try {
    const taskResults = await tasks(incidentId);
    const tasksArray = await mapResultsToTasks(taskResults);
    res.json(tasksArray);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
}

export async function get(_req: Request, res: Response) {
  try {
    const taskResults = await tasks();
    const tasksArray = await mapResultsToTasks(taskResults);
    res.json(tasksArray);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
}
