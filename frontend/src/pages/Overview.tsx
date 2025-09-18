// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Typography, Grid2 as Grid, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Local imports
import { type IncidentStage } from 'common/IncidentStage';
import { PageTitle } from '../components';
import { useChangeIncidentStage, useIncidents } from '../hooks/useIncidents';
import { Format } from '../utils';
import { useAuth } from '../hooks';
import PageWrapper from '../components/PageWrapper';
import { GridListItem } from '../components/GridListItem';
import StageMini from '../components/Stage/StageMini';
import StageSelector from '../components/InlineSelectors/StageSelector';
import { isAdmin } from '../utils/userRoles';

const Overview = () => {
  const { incidentId } = useParams();
  const query = useIncidents();
  const { user } = useAuth();
  const changeIncidentStage = useChangeIncidentStage();
  const navigate = useNavigate();

  const isUserAdmin = isAdmin(user.current);

  const incident = query.data?.find((inc) => inc.id === incidentId);
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
  };

  const onEditClick = () => {
    navigate(`edit`);
  };

  return (
    <PageWrapper>
      <>
        <PageTitle
          title="Overview"
          titleStart={
            <IconButton aria-label="Back" onClick={() => { navigate(-1) }}>
              <ArrowBackIcon />
            </IconButton>
          }
          titleEnd={isUserAdmin && 
            <Button
              type="button"
              variant="contained"
              disableRipple
              disableFocusRipple
              onClick={onEditClick}
              color="primary"
              sx={{ px: 9 }}
            >
              Edit
            </Button>
          }
        >
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 0.5, px: 0.5, mt: 1 }}>
            <Typography fontSize="1.25rem" variant="h2" fontWeight={400}>
              {incident?.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StageMini stage={incident?.stage ?? 'Monitoring'} size={12} />

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  component="section"
                  variant="body2"
                  color="grey"
                  sx={{
                    m: 0,
                    lineHeight: 1.2,
                    overflowX: 'auto',
                    whiteSpace: 'nowrap',
                    pr: 2,
                    maskImage: 'linear-gradient(to right, black 80%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, black 80%, transparent 100%)',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
                  }}
                  aria-label="Incident type"
                >
                  {incident?.type ? Format.incident.type(incident.type).toUpperCase() : ''}
                </Typography>
              </Box>
            </Box>
          </Box>
        </PageTitle>

        <Box display="flex" flexDirection="column" gap={2}>
          <Typography variant="h6" fontWeight='bold' fontSize='1rem'>
            Summary
          </Typography>
          <Grid component="ul" container padding={3} spacing={4} bgcolor="background.default">
            {isUserAdmin ? (
              <StageSelector value={incident.stage} onChange={onChangeStage} />
            ) : (
              <GridListItem title="Stage">
                <Box display="flex" alignItems="center" gap={1} flexWrap="nowrap">
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', transform: 'translateY(-1px)' }}>
                    <StageMini stage={incident.stage} size={12} />
                  </Box>
                  <Typography
                    component="span"
                    variant="body1"
                    noWrap
                    sx={{ lineHeight: 1, m: 0 }}
                  >
                    {Format.incident.stage(incident.stage)}
                  </Typography>
                </Box>
              </GridListItem>
            )}
            <GridListItem title="Incident Type" text={Format.incident.type(incident.type)} />
            <GridListItem
              title="Date and time recorded"
              text={`${Format.date(incident.startedAt)} @ ${Format.time(incident.startedAt)}`}
            />
            <GridListItem title="Incident name" text={incident.name} />
          </Grid>

          {incident.referrer && (
            <>
              <Typography variant="h6" fontWeight='bold' fontSize='1rem'>
                Referral information
              </Typography>
              <Grid component="ul" container padding={3} spacing={4} bgcolor="background.default">
                <GridListItem title="Referred by" text={incident.referrer.name} />
                <GridListItem title="Organisation" text={incident.referrer.organisation} />
                <GridListItem title="Telephone number" text={incident.referrer.telephone} />
                <GridListItem title="Email" text={incident.referrer.email} />
                <GridListItem
                  title="Has the referrer requested support from the local resilience team?"
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

          <Typography variant="h6" fontWeight='bold' fontSize='1rem'>
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
