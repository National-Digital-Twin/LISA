// Local imports
import { type LogEntry } from 'common/LogEntry';
import { type FieldValueType } from './types';

export type OnCreateEntry = (entry: Omit<LogEntry, 'id' | 'author'>, files: File[]) => LogEntry | undefined;

export type OnFieldBlur = (id: string) => void;
export type OnFieldChange = (id: string, value: FieldValueType, nested?: boolean) => void;
