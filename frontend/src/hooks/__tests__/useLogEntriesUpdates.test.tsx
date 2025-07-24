import { type LogEntry } from 'common/LogEntry';
import { addOptimisticLogEntry } from '../useLogEntriesUpdates';

describe('useLogEntriesUpdates', () => {
  describe('addOptimisticLogEntry', () => {
    it('throws an error if query client is not available', async () => {
      const incidentId = 'incident-0';

      await expect(() => addOptimisticLogEntry(incidentId, {} as LogEntry)).rejects.toThrow(
        'queryClient not available!'
      );
    });
  });
});
