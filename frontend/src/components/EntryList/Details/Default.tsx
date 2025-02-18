import { ReactNode } from 'react';

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
      {content && fields && <hr />}
      {fields}
    </>
  );
}
