// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { Link } from 'react-router-dom';

// Local imports
import SectionTick from '../assets/images/icon-tick.svg';

const Methane = () => {
  const handleLink = () => {
    document.documentElement.scrollTo(0, 0);
  };

  return (
    <div className="wrapper">
      <div className="container">
        <h1 className="page-title">
          Create Incident Log
        </h1>
        <h2>
          <img className="icon" src={SectionTick} alt="Section complete" />
          <span>METHANE</span>
        </h2>
        <form>
          <div className="section log-form">
            <ul>
              <li>
                <span className="field-label">Has a MAJOR INCIDENT been declared?</span>
                <div className="log-form-buttons">
                  <li className="major-incident-yes">
                    <button onClick={handleLink} className="button submit" type="button">YES</button>
                  </li>
                  <li className="major-incident-no">
                    <button onClick={handleLink} className="button submit" type="button">NO</button>
                  </li>
                </div>
              </li>
              <li>
                <label htmlFor="inc-location">
                  <span className="highlight-blue-dark">EXACT</span>
                  <span> location</span>
                  <textarea id="inc-location" name="inc-location" rows={4} />
                </label>
              </li>
              <li>
                <label htmlFor="inc-type">
                  <span className="highlight-blue-dark">TYPE</span>
                  <span> of incident</span>
                  <textarea id="inc-type" name="inc-type" rows={4} />
                </label>
              </li>
              <li>
                <label htmlFor="inc-hazards">
                  <span className="highlight-blue-dark">HAZARDS</span>
                  <span> present or suspected</span>
                  <textarea id="inc-hazards" name="inc-hazards" rows={4} />
                </label>
              </li>
              <li>
                <label htmlFor="inc-access">
                  <span className="highlight-blue-dark">ACCESS</span>
                  <span> routes that are safe to use</span>
                  <textarea id="inc-access" name="inc-access" rows={4} />
                </label>
              </li>
              <li>
                <label htmlFor="inc-number">
                  <span className="highlight-blue-dark">NUMBER</span>
                  <span>, type, severity or casualties</span>
                  <textarea id="inc-number" name="inc-number" rows={4} />
                </label>
              </li>
              <li>
                <label htmlFor="inc-emgergeny">
                  <span className="highlight-blue-dark">EMERGENCY</span>
                  <span> services present and those required</span>
                  <textarea id="inc-emgergeny" name="inc-emgergeny" rows={4} />
                </label>
              </li>
            </ul>
          </div>

          <h2>
            <img className="icon" src={SectionTick} alt="Section complete" />
            <span>REQUIREMENTS</span>
          </h2>

          <div className="section log-form">
            <ul>
              <li>
                <label htmlFor="inc-requirements">
                  <span>What is required from your organisation?</span>
                  <textarea
                    id="inc-requirements"
                    name="inc-requirements"
                    rows={6}
                    placeholder="( evacuation, welfare, technical, liaison officer, media, supplies, equipment )"
                  />
                </label>
              </li>
            </ul>
          </div>

          <div className="log-form-buttons">
            <Link onClick={handleLink} className="button submit" to="/location">Continue to location</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Methane;
