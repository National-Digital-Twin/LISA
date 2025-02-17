import { MouseEvent, useEffect, useState } from 'react';

import { type Field } from 'common/Field';
import { type Incident } from 'common/Incident';
import { type LogEntry } from 'common/LogEntry';
// eslint-disable-next-line import/no-extraneous-dependencies
import { LogEntryTypes } from 'common/LogEntryTypes';
import { Form } from '../../utils';
import { MODAL_KEY } from '../../utils/constants';
import { FieldValueType, ValidationError } from '../../utils/types';
import { FormFields, FormFooter } from '../Form';
import Modal from '../Modal';
import { getDirtyEntry, getInitialEntry, validate } from './utils';

interface Props {
  incident: Incident;
  onSetInformation: (setInformationEntry: Partial<LogEntry>) => void;
  onCancel: () => void;
}
export default function SetInformation({ incident, onSetInformation, onCancel }: Readonly<Props>) {
  const [modal] = useState<boolean>(sessionStorage.getItem(MODAL_KEY) === 'yes');
  const [validationErrors, setValidationErrors] = useState<Array<ValidationError>>([]);
  const [showValidationErrors, setShowValidationErrors] = useState<boolean>(false);
  const [entry, setEntry] = useState<Partial<LogEntry>>({});
  const [fields, setFields] = useState<Field[]>([]);

  useEffect(() => {
    if (!incident) return;

    setEntry(getInitialEntry(incident));
  }, [incident]);

  useEffect(() => {
    if (!incident || !entry.type) return;

    const type = LogEntryTypes.SetIncidentInformation;
    setFields(type?.fields(entry) || []);
    setValidationErrors(validate(entry, incident));
  }, [entry, incident]);

  if (!incident || !entry.type) {
    return null;
  }

  const onFieldChange = (id: string, value: FieldValueType) => {
    setEntry((prev) => Form.updateLogEntry(prev, id, value, true));
  };

  const onSubmit = (evt?: MouseEvent<HTMLButtonElement>) => {
    evt?.preventDefault();
    const dirtyEntry = getDirtyEntry(entry, incident);
    onSetInformation(dirtyEntry);
  };

  const nameField = fields.find((f) => f.id === 'name');
  const referrerFields = fields.filter((f) => f.id.startsWith('referrer.'));
  if (!nameField) {
    return null;
  }

  return (
    <Modal modal={modal} onClose={onCancel}>
      <div className="rollup-container">
        <h2 className="rollup-header">
          Set Incident Information
        </h2>
        <form id="rollup-log-book-entry">
          <div className={`section log-form ${showValidationErrors ? 'validation-errors' : ''}`}>
            <ul>
              <FormFields
                entry={entry}
                fields={[nameField]}
                groups={[]}
                onFieldChange={onFieldChange}
                validationErrors={validationErrors}
              />
            </ul>
            <h3>Referral information</h3>
            <ul>
              <FormFields
                entry={entry}
                fields={referrerFields}
                groups={[]}
                onFieldChange={onFieldChange}
                validationErrors={validationErrors}
              />
            </ul>
            <FormFooter
              validationErrors={validationErrors}
              onCancel={onCancel}
              onSubmit={onSubmit}
              onShowValidationErrors={setShowValidationErrors}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
}
