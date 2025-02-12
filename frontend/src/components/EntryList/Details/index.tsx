import { MouseEvent } from 'react';

import { type LogEntry } from 'common/LogEntry';
import ChangeStage from './ChangeStage';
import Default from './Default';
import SetInformation from './SetInformation';

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
interface Props {
  entry: LogEntry;
  onContentClick: (evt: MouseEvent<HTMLElement>) => void;
}
export default function Details({ entry, onContentClick }: Readonly<Props>) {
  const { type } = entry;
  let detail = null;
  switch (type) {
  case 'ChangeStage':
    detail = <ChangeStage entry={entry} />;
    break;
  case 'SetIncidentInformation':
    detail = <SetInformation entry={entry} />;
    break;
  default:
    detail = <Default entry={entry} />;
    break;
  }
  return (
    <div className="log-entry-details" onClick={onContentClick}>
      {detail}
    </div>
  );
}
