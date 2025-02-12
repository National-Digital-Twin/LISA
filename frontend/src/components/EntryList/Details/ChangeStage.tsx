import { type LogEntry } from 'common/LogEntry';
import { Format, Icons } from '../../../utils';

interface Props {
  entry: LogEntry;
}
export default function ChangeStage({ entry }: Readonly<Props>) {
  const { stage } = entry;
  if (!stage) {
    return null;
  }

  return (
    <>
      <span>Stage changed to</span>
      <span className={`incident-stage ${stage}`}>
        <Icons.Stage />
        {Format.incident.stage(stage)}
      </span>
    </>
  );
}
