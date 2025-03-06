// Global imports
import { ReactElement, useState } from 'react';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
import { Box, Button, Typography } from '@mui/material';

// Local imports
import { type IncidentStage } from 'common/IncidentStage';
import { type LogEntry } from 'common/LogEntry';
import { ChangeStage, PageTitle } from '../components';
import SetInformation from '../components/SetInformation';
import { useChangeIncidentStage, useIncidents } from '../hooks/useIncidents';
import { Format } from '../utils';
import { useCreateLogEntry } from '../hooks';
import Stage from '../components/Stage';
import PageWrapper from '../components/PageWrapper';

const GridListItem = ({
  title,
  text = undefined,
  children = undefined
}: {
  title: string;
  text?: string;
  children?: ReactElement;
}) => (
  <Grid component="li" size={{ xs: 12, md: 6 }}>
    <Box display="flex" flexDirection="column" gap={1}>
      <Typography variant="h3" fontSize="1rem" fontWeight="bold">
        {title}
      </Typography>
      {text && <Typography variant="body1">{text}</Typography>}
      {children}
    </Box>
  </Grid>
);

const Overview = () => {
  const { incidentId } = useParams();
  const { incidents, invalidateIncidents } = useIncidents();
  const changeIncidentStage = useChangeIncidentStage();
  const createLogEntry = useCreateLogEntry(incidentId);
  const [changingStage, setChangingStage] = useState<boolean>();
  const [settingInformation, setSettingInformation] = useState<boolean>();

  const incident = incidents?.find((inc) => inc.id === incidentId);
  if (!incident) {
    return null;
  }

  const onChangeStage = (stage: IncidentStage) => {
    changeIncidentStage.mutate(
      { ...incident, stage },
      {
        onSuccess: () => {}
      }
    );
    setChangingStage(false);
  };

  const onChangeStateClick = () => {
    setSettingInformation(false);
    setChangingStage(true);
  };

  const onSetInformation = (logEntry: Partial<LogEntry>) => {
    createLogEntry.mutate(
      { newLogEntry: logEntry as LogEntry },
      {
        onSuccess: () => {
          invalidateIncidents();
        }
      }
    );
    setSettingInformation(false);
  };

  const onEditClick = () => {
    setChangingStage(false);
    setSettingInformation(true);
  };

  return (
    <PageWrapper>
      <>
        <PageTitle title="Incident overview">
          <Box display="flex" justifyContent="end" gap={2}>
            <Button
              type="button"
              variant="contained"
              disableRipple
              disableFocusRipple
              onClick={onChangeStateClick}
              color="primary"
            >
              Change Stage
            </Button>
            <Button
              type="button"
              variant="contained"
              disableRipple
              disableFocusRipple
              onClick={onEditClick}
              color="primary"
            >
              Edit
            </Button>
          </Box>
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

        <Box display="flex" flexDirection="column" gap={2}>
          <Typography variant="h2" fontSize="1.6rem">
            Summary
          </Typography>
          <Grid component="ul" container padding={3} spacing={4} bgcolor="background.default">
            <GridListItem title="Stage">
              <Stage
                label={Format.incident.stage(incident.stage).toUpperCase()}
                stage={incident.stage}
              />
            </GridListItem>
            <GridListItem title="Incident Type" text={Format.incident.type(incident.type)} />
            <GridListItem
              title="Date and time recorded"
              text={`${Format.date(incident.startedAt)} @ ${Format.time(incident.startedAt)}`}
            />
            <GridListItem title="Incident name" text={incident.name} />
          </Grid>

          {incident.referrer && (
            <>
              <Typography variant="h2" fontSize="1.6rem">
                Referral information
              </Typography>
              <Grid component="ul" container padding={3} spacing={4} bgcolor="background.default">
                <GridListItem title="Referred by" text={incident.referrer.name} />
                <GridListItem title="Organisation" text={incident.referrer.organisation} />
                <GridListItem title="Telephone number" text={incident.referrer.telephone} />
                <GridListItem title="Email" text={incident.referrer.email} />
                <GridListItem
                  title="Supported requested?"
                  text={incident.referrer.supportRequested}
                />
                {incident.referrer.supportRequested === 'Yes' && (
                  <GridListItem
                    title="Support details"
                    text={incident.referrer.supportDescription}
                  />
                )}
              </Grid>
            </>
          )}

          <Typography variant="h2" fontSize="1.6rem">
            Other Information
          </Typography>
          <Grid component="ul" container padding={3} spacing={4} bgcolor="background.default">
            <GridListItem title="Recorded by" text={Format.user(incident.reportedBy)} />
            <GridListItem title="Current stage" text={Format.incident.stage(incident.stage)} />
          </Grid>
        </Box>
      </>
    </PageWrapper>
  );
};

export default Overview;
