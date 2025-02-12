// Global imports
import { Link } from 'react-router-dom';

// Local imports
import SectionTick from '../assets/images/icon-tick.svg';

// TODO: Address disabled lint issues when doing this page properly.
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
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label>Has a MAJOR INCIDENT been declared?</label>
                <div className="log-form-buttons">
                  <li className="major-incident-yes">
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <Link onClick={handleLink} className="button submit" to="" role="button">YES</Link>
                  </li>
                  <li className="major-incident-no">
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <Link onClick={handleLink} className="button submit" to="" role="button">NO</Link>
                  </li>
                </div>
              </li>
              <li>
                <label htmlFor="inc-location">
                  {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                  <span className="highlight-blue-dark">EXACT</span> location {/* */}
                  <textarea id="inc-location" name="inc-location" rows={4} />
                </label>
              </li>
              <li>
                <label htmlFor="inc-type">
                  {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                  <span className="highlight-blue-dark">TYPE</span> of incident {/* */}
                  <textarea id="inc-type" name="inc-type" rows={4} />
                </label>
              </li>
              <li>
                <label htmlFor="inc-hazards">
                  {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                  <span className="highlight-blue-dark">HAZARDS</span> present or suspected {/* */}
                  <textarea id="inc-hazards" name="inc-hazards" rows={4} />
                </label>
              </li>
              <li>
                <label htmlFor="inc-access">
                  {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                  <span className="highlight-blue-dark">ACCESS</span> routes that are safe to use {/* */}
                  <textarea id="inc-access" name="inc-access" rows={4} />
                </label>
              </li>
              <li>
                <label htmlFor="inc-number">
                  {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                  <span className="highlight-blue-dark">NUMBER</span>, type, severity or casualties {/* */}
                  <textarea id="inc-number" name="inc-number" rows={4} />
                </label>
              </li>
              <li>
                <label htmlFor="inc-emgergeny">
                  {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                  <span className="highlight-blue-dark">EMERGENCY</span> services present and those required {/* */}
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
