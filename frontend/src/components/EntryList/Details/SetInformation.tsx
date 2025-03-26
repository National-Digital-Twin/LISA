import { type Field } from 'common/Field';
import { type LogEntry } from 'common/LogEntry';
// eslint-disable-next-line import/no-extraneous-dependencies
import { LogEntryTypes } from 'common/LogEntryTypes';
import { FieldItem } from '../../../utils/Format/entry/fields/FieldItem';
import { bem } from '../../../utils';

interface Props {
  entry: LogEntry;
}
export default function SetInformation({ entry }: Readonly<Props>) {
  const { fields, type } = entry;
  if (!fields?.length) {
    return null;
  }

  const fieldDescriptors = LogEntryTypes[type].fields(entry);
  const changedFields: Field[] = fields.map((fieldWithValue) => {
    const descriptor = fieldDescriptors.find((fd) => fd.id === fieldWithValue.id);
    return {
      ...{},
      ...descriptor,
      ...fieldWithValue
    };
  });

  const classes = bem('log-entry-fields', changedFields.length === 1 ? 'nowrap' : undefined);
  return (
    <>
      <span>Set the following information:</span>
      <hr />
      <div className={classes()}>
        {changedFields.map((field) => (
          <FieldItem key={field.id} field={field} entry={entry} />
        ))}
      </div>
    </>
  );
}

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
