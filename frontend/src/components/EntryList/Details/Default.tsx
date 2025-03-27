// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { ReactNode } from 'react';
import { Box } from '@mui/material';

import { type LogEntry } from 'common/LogEntry';
import { Format } from '../../../utils';

interface Props {
  entry: LogEntry;
}
export default function Default({ entry }: Readonly<Props>) {
  let content: ReactNode = null;
  let fields: ReactNode = null;
  if (entry.content.json) {
    content = Format.lexical.html(entry.content.json);
  }
  if (!content && entry.content.text) {
    content = entry.content.text;
  }
  if (entry.fields?.length) {
    fields = Format.entry.fields(entry);
  }
  return (
    <>
      {content}
      {fields && (
        <Box width="100%" mt={4}>
          {fields}
        </Box>
      )}
    </>
  );
}
