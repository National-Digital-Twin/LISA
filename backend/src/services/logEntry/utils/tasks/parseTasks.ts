import { TaskStatus, type Task } from 'common/Task';
import { type ResultRow } from '../../../../ia';
import { nodeValue } from '../../../../rdfutil';

function removePrefix(uri: string): string {
  return uri.split('#').pop() || uri.split('/').pop() || uri;
}


export async function parseTasks(
  results: ResultRow[]
): Promise<Map<string, Task>> {
  const tasksByEntry = new Map<string, Task>();

  for (const result of results) {
    const entryId = nodeValue(result.entryId.value);
    const taskId = nodeValue(result.taskId.value);

    if (!tasksByEntry.has(entryId)) {
      const task: Task = {
        id: taskId,
        name: result.taskName.value,
        description: result.description?.value,
        status: removePrefix(result.taskStatus.value) as TaskStatus,
        assignee: {
          username: result.assigneeName?.value ?? undefined,
          displayName: result.assigneeName?.value ?? undefined
        }
      };

      tasksByEntry.set(entryId, task);
    }
  }

  return tasksByEntry;
}
