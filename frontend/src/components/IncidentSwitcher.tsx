// Global imports
import { useState } from 'react';

// Local imports
import IconArrowDown from '../assets/images/icon-arrow-down-thick.svg';
import { useIncidents } from '../hooks';

const IncidentSwitcher = () => {
  const query = useIncidents();
  const [open, setOpen] = useState<boolean>(false);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div className="incident-switcher">
      <button onClick={handleToggle} className="button" type="button">
        <span>INCIDENTS</span>
        <span className="arrow-down">
          <img src={IconArrowDown} alt="Expand" />
        </span>
      </button>
      {open && (
        <div className="dropdown">
          {query.data?.map((incident) => (
            <div key={incident.id} className="item">
              {incident.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IncidentSwitcher;

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
