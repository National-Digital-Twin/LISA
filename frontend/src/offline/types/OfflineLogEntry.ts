// eslint-disable-next-line import/no-extraneous-dependencies
import { LogEntry as BaseLogEntry } from 'common/LogEntry';

export type OfflineLogEntry = BaseLogEntry & {
    expiresAt: string;
  };
  