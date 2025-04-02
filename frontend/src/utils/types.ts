// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { ReactNode } from 'react';

// Local imports
import { type Field } from 'common/Field';
import { type Incident } from 'common/Incident';
import { type LocationType } from 'common/Location';
import { type LogEntryType } from 'common/LogEntryType';
import { type MessagingTopicType } from 'common/Messaging';
import { type User } from 'common/User';

export type ContentType = { json: string; text: string };
export type FieldValueType = string | Array<string> | File | ContentType | User | undefined;
export type OptionType = { value: string; label: string };
export type FilterType = { author: Array<string>; category: Array<string> };
export type SpanType = {
  getAttribute: (name: string) => unknown;
  tagName?: string;
  textContent: string | undefined | null;
};

export type AuthContextType = {
  user: {
    current?: User;
    offline: boolean;
    logout: () => void;
  };
};

export type MessagingSubscriber = () => void;

export type MessagingContextType = {
  subscribe: (topic: MessagingTopicType, subject: string, callback: MessagingSubscriber) => void;
  unsubscribe: (topic: MessagingTopicType, subject: string, callback: MessagingSubscriber) => void;
};

export type ToastEntry = {
  id: string;
  type: 'Success' | 'Info' | 'Error';
  content: ReactNode;
  isDismissable?: boolean;
};

export type ToastContextType = {
  toasts: ToastEntry[];
  postToast: (toast: ToastEntry) => void;
  removeToast: (id: string) => void;
};

export type IncidentSection = {
  id: string;
  title: string;
  fields: (incident: Partial<Incident>) => Array<Field>;
};

export type FullLocationType = {
  type: LocationType;
  description?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
};

export type LocationResult = {
  place_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  type: string;
  importance: number;
  value: number;
  label: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AsyncReturnType<T extends (..._args: any) => Promise<any>> = Awaited<ReturnType<T>>;

export type SketchLine = {
  points: Array<number>;
  color: string;
};

export type ValidationError = {
  fieldId: string;
  error: string;
};

export type Linkable = { type: LogEntryType; id: string };
