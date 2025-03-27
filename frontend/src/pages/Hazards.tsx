// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Local imports
import SectionTick from '../assets/images/icon-tick.svg';

const Hazards = () => {
  const title = 'Hazards';
  return (
    <div className="wrapper">
      <div className="container">
        <h1 className="page-title">{title}</h1>

        <h2>
          <img className="icon" src={SectionTick} alt="Section complete" />
          <span>HAZARD ENTRIES</span>
        </h2>
        <form>
          <div className="section log-form">
            <ul>
              <li>
                <label htmlFor="inc-">
                  <span>TBD</span>
                  <textarea className="inc-" id="inc-" name="inc-" rows={4} />
                </label>
              </li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Hazards;
