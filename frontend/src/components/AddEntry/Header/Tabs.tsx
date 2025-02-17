// Local imports
import { useMemo } from 'react';
import { type ValidationError } from '../../../utils/types';
import { TABS } from '../constants';
import Files from '../Files';
import Form from '../Form';
import Location from '../Location';
import Sketch from '../Sketch';

interface Props {
  hash: string;
  fileCount: number;
  validationErrors: Array<ValidationError>;
}
export default function Tabs({ hash, fileCount, validationErrors }: Readonly<Props>) {
  const hasLocationError: boolean = useMemo(
    () => !!validationErrors.find((e) => e.fieldId.startsWith('location')),
    [validationErrors]
  );
  const hasFormError: boolean = useMemo(
    () => !!validationErrors.find((e) => !e.fieldId.startsWith('location')),
    [validationErrors]
  );
  return (
    <div className="rollup-tabs">
      <Form.Tab
        to={TABS.FORM}
        active={!hash || hash?.includes(TABS.FORM)}
        inError={hasFormError}
      />
      <Location.Tab
        to={TABS.LOCATION}
        active={hash.includes(TABS.LOCATION)}
        inError={hasLocationError}
      />
      <Files.Tab to={TABS.FILES} active={hash?.includes(TABS.FILES)} fileCount={fileCount} />
      <Sketch.Tab to={TABS.SKETCH} active={hash.includes(TABS.SKETCH)} />
    </div>
  );
}
