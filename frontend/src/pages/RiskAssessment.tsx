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
                  Name of emergency {/* */}
                  <input type="text" id="risk-officer-emergency" name="risk-officer-emergency" />
                </label>
              </li>
              <li>
                <label htmlFor="risk-location">
                  Location {/* */}
                  <input type="text" id="risk-location" name="risk-location" />
                </label>
              </li>
              <li>
                <label htmlFor="risk-date">
                  Date {/* */}
                  <input className="input-calendar" type="text" id="risk-date" name="risk-date" />
                </label>
              </li>
              <li>
                <label htmlFor="risk-time">
                  Time {/* */}
                  <input type="text" id="risk-time" name="risk-time" />
                </label>
              </li>
              <li>
                <label htmlFor="risk-completed-by">
                  Assessment completed by {/* */}
                  <input type="text" id="risk-completed-by" name="risk-completed-by" />
                </label>
              </li>
            </ul>
          </div>
          <div className="section log-form">
            <ul>
              <li>
                <label htmlFor="risk-reviewed">
                  Reviewed by {/* */}
                  <input type="text" id="risk-reviewed" name="risk-reviewed" />
                </label>
              </li>
              <li>
                <label htmlFor="risk-reviewed-date">
                  Reviewed date {/* */}
                  <input className="input-calendar" type="text" id="risk-reviewed-date" name="risk-reviewed-date" />
                </label>
              </li>
              <li>
                <label htmlFor="risk-reviewed-date">
                  Time Review completed {/* */}
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
