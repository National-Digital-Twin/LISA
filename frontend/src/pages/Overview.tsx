// Global imports
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

// Local imports
import { type IncidentStage } from 'common/IncidentStage';
import { type LogEntry } from 'common/LogEntry';
import { ChangeStage, PageTitle } from '../components';
import SetInformation from '../components/SetInformation';
import { useChangeIncidentStage, useIncidents } from '../hooks/useIncidents';
import { Format, Icons } from '../utils';
import { useCreateLogEntry } from '../hooks';

const Overview = () => {
  const { incidentId } = useParams();
  const { incidents, invalidateIncidents } = useIncidents();
  const changeIncidentStage = useChangeIncidentStage();
  const createLogEntry = useCreateLogEntry(incidentId);
  const [changingStage, setChangingStage] = useState<boolean>();
  const [settingInformation, setSettingInformation] = useState<boolean>();

  const incident = incidents?.find((inc) => inc.id === incidentId);
  const subtitle = useMemo(() => Format.incident.name(incident), [incident]);
  if (!incident) {
    return null;
  }

  const onChangeStage = (stage: IncidentStage) => {
    changeIncidentStage.mutate({ ...incident, stage }, {
      onSuccess: () => {}
    });
    setChangingStage(false);
  };

  const onChangeStateClick = () => {
    setSettingInformation(false);
    setChangingStage(true);
  };

  const onSetInformation = (logEntry: Partial<LogEntry>) => {
    createLogEntry.mutate({ newLogEntry: logEntry as LogEntry }, {
      onSuccess: () => {
        invalidateIncidents();
      }
    });
    setSettingInformation(false);
  };

  const onEditClick = () => {
    setChangingStage(false);
    setSettingInformation(true);
  };

  return (
    <div className="wrapper">
      <div className="container">
        <PageTitle title="Incident overview" subtitle={subtitle}>
          <button type="button" className="button blue" onClick={onChangeStateClick}>
            Change stage
          </button>
          <button type="button" className="button blue" onClick={onEditClick}>
            Edit
          </button>
        </PageTitle>

        {changingStage && (
          <ChangeStage
            incident={incident}
            onChangeStage={onChangeStage}
            onCancel={() => setChangingStage(false)}
          />
        )}

        {settingInformation && (
          <SetInformation
            incident={incident}
            onSetInformation={onSetInformation}
            onCancel={() => setSettingInformation(false)}
          />
        )}

        <div className="section log-form readonly">
          <h2>
            Summary
            <div className={`incident-stage ${incident.stage}`}>
              <Icons.Stage />
              {Format.incident.stage(incident.stage)}
            </div>
          </h2>
          <ul>
            <li>
              <div className="field-label">Incident type</div>
              {Format.incident.type(incident.type)}
            </li>
            <li>
              <div className="field-label">Date and time recorded</div>
              {Format.date(incident.startedAt)}
              &nbsp;@&nbsp;
              {Format.time(incident.startedAt)}
            </li>
            <li>
              <div className="field-label">Incident name</div>
              {incident.name}
            </li>
          </ul>
        </div>

        {incident.referrer && (
          <div className="section log-form readonly">
            <h2>Referral information</h2>
            <ul>
              <li>
                <div className="field-label">Referred by</div>
                {incident.referrer.name}
              </li>
              <li>
                <div className="field-label">Organisation</div>
                {incident.referrer.organisation}
              </li>
              <li>
                <div className="field-label">Telephone number</div>
                {incident.referrer.telephone}
              </li>
              <li>
                <div className="field-label">Email</div>
                {incident.referrer.email}
              </li>
              <li>
                <div className="field-label">Support requested?</div>
                {incident.referrer.supportRequested}
              </li>
              {incident.referrer.supportRequested === 'Yes' && (
                <li>
                  <div className="field-label">Support details</div>
                  {incident.referrer.supportDescription}
                </li>
              )}
            </ul>
          </div>
        )}

        <div className="section log-form readonly">
          <h2>Other information</h2>
          <ul>
            <li>
              <div className="field-label">Recorded by</div>
              {Format.user(incident.reportedBy)}
            </li>
            <li>
              <div className="field-label">Current stage</div>
              {Format.incident.stage(incident.stage)}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Overview;
