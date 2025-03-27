// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

const RiskAssessment = () => {
  const title = 'Liaison Officer Risk Assessment';
  return (
    <div className="wrapper">
      <div className="container">
        <h1 className="page-title">{title}</h1>
        <form>
          <div className="section log-form">
            <ul>
              <li>
                <label htmlFor="risk-officer-emergency">
                  <span>Name of emergency</span>
                  <input type="text" id="risk-officer-emergency" name="risk-officer-emergency" />
                </label>
              </li>
              <li>
                <label htmlFor="risk-location">
                  <span>Location</span>
                  <input type="text" id="risk-location" name="risk-location" />
                </label>
              </li>
              <li>
                <label htmlFor="risk-date">
                  <span>Date</span>
                  <input className="input-calendar" type="text" id="risk-date" name="risk-date" />
                </label>
              </li>
              <li>
                <label htmlFor="risk-time">
                  <span>Time</span>
                  <input type="text" id="risk-time" name="risk-time" />
                </label>
              </li>
              <li>
                <label htmlFor="risk-completed-by">
                  <span>Assessment completed by</span>
                  <input type="text" id="risk-completed-by" name="risk-completed-by" />
                </label>
              </li>
            </ul>
          </div>
          <div className="section log-form">
            <ul>
              <li>
                <label htmlFor="risk-reviewed">
                  <span>Reviewed by</span>
                  <input type="text" id="risk-reviewed" name="risk-reviewed" />
                </label>
              </li>
              <li>
                <label htmlFor="risk-reviewed-date">
                  <span>Reviewed date</span>
                  <input className="input-calendar" type="text" id="risk-reviewed-date" name="risk-reviewed-date" />
                </label>
              </li>
              <li>
                <label htmlFor="risk-reviewed-date">
                  <span>Time Review completed</span>
                  <input type="text" id="risk-reviewed-time-completed" name="risk-reviewed-time-completed" />
                </label>
              </li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RiskAssessment;
