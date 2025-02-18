// Global imports
import { MouseEvent, useEffect, useState } from 'react';

// Local imports
import { type Incident } from 'common/Incident';
import { type IncidentStage } from 'common/IncidentStage';
import { Form, Format } from '../../utils';
import { MODAL_KEY } from '../../utils/constants';
import { type FieldValueType, type ValidationError } from '../../utils/types';
import { FormField, FormFooter } from '../Form';
import Modal from '../Modal';
import { STAGE_FIELD } from './constants';

interface Props {
  incident: Incident;
  onChangeStage: (stage: IncidentStage) => void;
  onCancel: () => void;
}
export default function ChangeStage({ incident, onChangeStage, onCancel }: Readonly<Props>) {
  const [modal] = useState<boolean>(sessionStorage.getItem(MODAL_KEY) === 'yes');
  const [stage, setStage] = useState<IncidentStage>(incident.stage);
  const [validationErrors, setValidationErrors] = useState<Array<ValidationError>>([]);
  const [showValidationErrors, setShowValidationErrors] = useState<boolean>(false);

  useEffect(() => {
    if (stage) {
      if (stage === incident.stage) {
        setValidationErrors([{ fieldId: STAGE_FIELD.id, error: 'Stage has not changed' }]);
      } else {
        setValidationErrors([]);
      }
    } else {
      setValidationErrors([{ fieldId: STAGE_FIELD.id, error: 'Stage required' }]);
    }
  }, [stage, incident.stage]);

  if (!incident) {
    return null;
  }

  const onSubmit = (evt?: MouseEvent<HTMLButtonElement>) => {
    evt?.preventDefault();
    // Do the submission to the backend.
    onChangeStage(stage);
  };

  const onFieldChange = (id: string, value: FieldValueType) => {
    if (id === 'stage') {
      setStage(value as IncidentStage);
    }
  };

  return (
    <Modal modal={modal} onClose={onCancel}>
      <div className="rollup-container">
        <h2 className="rollup-header">
          Change incident stage
        </h2>
        <form id="rollup-log-book-entry">
          <div className={`section log-form ${showValidationErrors ? 'validation-errors' : ''}`}>
            <ul>
              <li>
                <div className="field-label">Current stage</div>
                {Format.incident.stage(incident.stage)}
              </li>
              <FormField
                field={{ ...STAGE_FIELD, value: stage }}
                error={Form.getError(STAGE_FIELD, validationErrors)}
                onChange={onFieldChange}
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
