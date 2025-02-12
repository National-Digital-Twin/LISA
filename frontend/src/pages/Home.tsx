// Global imports
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Local imports
import { type Incident } from 'common/Incident';
import { useIncidents } from '../hooks/useIncidents';
import { Format, Icons } from '../utils';
import { PageTitle } from '../components';

function open(incident: Incident) {
  return incident.stage !== 'Closed';
}

const Home = () => {
  const { incidents } = useIncidents();
  const [includeClosed, setIncludeClosed] = useState<boolean>(false);
  const navigate = useNavigate();

  const show = (incident: Incident): boolean => includeClosed || open(incident);

  const openCount = incidents?.filter(open)?.length ?? 0;
  const openCountName = openCount === 0 ? 'No' : openCount.toString();
  const closedCount = (incidents?.length ?? 0) - openCount;
  const closedCountName = closedCount === 0 ? 'None' : `+${closedCount.toString()}`;
  const title = `${openCountName} active incident${openCount === 1 ? '' : 's'}`;
  const subtitle = `( ${closedCountName} closed )`;

  const onIncludeClosedChange = () => {
    setIncludeClosed((prev) => !prev);
  };

  const onAddIncident = () => {
    navigate('/createlog');
  };

  return (
    <div className="wrapper">
      <div className="container">
        <PageTitle title={title} subtitle={subtitle}>
          <label className="include-closed" htmlFor="include-closed">
            <input
              id="include-closed"
              type="checkbox"
              checked={includeClosed}
              onChange={() => onIncludeClosedChange()}
            />
            Include closed incidents
          </label>
          <button type="button" className="button blue" onClick={onAddIncident}>
            + Add new incident
          </button>
        </PageTitle>

        <hr />

        <div className="incident-list">
          {incidents?.filter(show)?.map((inc) => (
            <Link key={inc.id} className="incident" to={`/logbook/${inc.id}`}>
              <span className="incident-title">
                {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                {Format.date(inc.startedAt)}: {Format.incident.name(inc)}
                {Format.incident.status(inc)}
              </span>
              <span className={`incident-stage ${inc.stage}`}>
                <Icons.Stage />
                {Format.incident.stage(inc.stage)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
