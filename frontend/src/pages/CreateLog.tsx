// Global imports
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Local imports
import { type Referrer, type Incident } from 'common/Incident';
import { FormField, FormFooter } from '../components/Form';
import { useCreateIncident } from '../hooks/useIncidents';
import { Form, Incident as IncidentUtil, Validate } from '../utils';
import { type FieldValueType, type ValidationError } from '../utils/types';

const CreateLog = () => {
  const [incident, setIncident] = useState<Partial<Incident>>({
    stage: 'Monitoring',
    referrer: {} as Referrer
  });
  const [validationErrors, setValidationErrors] = useState<Array<ValidationError>>([]);
  const [showValidationErrors, setShowValidationErrors] = useState<boolean>(false);

  const createIncident = useCreateIncident();
  const navigate = useNavigate();

  // Go back to where we've just come from.
  const onCancel = () => navigate(-1);

  const onSubmit = () => {
    createIncident.mutate(incident as Incident, {
      onSuccess: (data) => navigate(`/logbook/${data.id}`)
    });
  };

  const onFieldChange = (id: string, value: FieldValueType) => {
    setIncident((prev) => Form.updateIncident(prev, id, value));
    // setIncident((prev) => ({ ...prev, [id]: value }));
  };

  useEffect(() => {
    setValidationErrors(Validate.incident(incident));
  }, [incident]);

  return (
    <div className="wrapper">
      <div className="container">
        <h1 className="page-title">New Incident Log</h1>
        <form>
          {IncidentUtil.Sections.map((section) => (
            <div key={section.id} className={`section log-form ${showValidationErrors ? 'validation-errors' : ''}`}>
              <h2>{section.title}</h2>
              <ul>
                {section.fields(incident).map((field) => (
                  <FormField
                    key={field.id}
                    field={{ ...field, value: incident[field.id as keyof Incident] as string }}
                    error={Form.getError(field, validationErrors)}
                    className={field.className}
                    onChange={onFieldChange}
                  />
                ))}
              </ul>
            </div>
          ))}
          <FormFooter
            validationErrors={validationErrors}
            onCancel={onCancel}
            onSubmit={onSubmit}
            submitLabel="Create incident log"
            onShowValidationErrors={setShowValidationErrors}
          />
        </form>
      </div>
    </div>
  );
};

export default CreateLog;
