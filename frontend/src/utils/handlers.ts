// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import { type LogEntry } from 'common/LogEntry';
import { type FieldValueType } from './types';

export type OnCreateEntry = (
  entry: Omit<LogEntry, 'id' | 'author'>,
  files: File[]
) => LogEntry | undefined;

export type OnFieldBlur = (id: string) => void;
export type OnFieldChange = (id: string, value: FieldValueType, nested?: boolean) => void;
