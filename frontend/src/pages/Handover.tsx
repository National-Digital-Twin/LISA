const Handover = () => {
  const title = 'Shift handover';

  return (
    <div className="wrapper">
      <div className="container">
        <h1 className="page-title">{title}</h1>

        <form>
          <div className="section log-form">
            <ul>
              <li>
                <label htmlFor="inc-officer-name">
                  <span>Name of officer</span>
                  <input type="text" id="inc-officer-name" name="inc-officer-name" />
                </label>
              </li>
              <li>
                <label htmlFor="inc-officer-role">
                  <span>Role of officer</span>
                  <input type="text" id="inc-officer-role" name="inc-officer-role" />
                </label>
              </li>
              <li>
                <label htmlFor="inc-shift-start-date">
                  <span>Start shift date</span>
                  <input className="input-calendar" type="text" id="inc-shift-start-date" name="inc-shift-start-date" />
                </label>
              </li>
              <li>
                <label htmlFor="inc-shift-start-time">
                  <span>Start shift time</span>
                  <input type="text" id="inc-shift-start-time" name="inc-shift-start-time" />
                </label>
              </li>
              <li>
                <label htmlFor="inc-shift-end-date">
                  <span>End shift date</span>
                  <input
                    className="input-calendar"
                    type="text"
                    id="inc-shift-end-date"
                    name="inc-shift-end-date"
                  />
                </label>
              </li>
              <li>
                <label htmlFor="inc-shift-end-time">
                  <span>End shift time</span>
                  <input type="text" id="inc-shift-end-time" name="inc-shift-end-time" />
                </label>
              </li>
              <li>
                <label htmlFor="inc-handover-to">
                  <span>Name of officer handing over to</span>
                  <input type="text" id="inc-handover-to" name="inc-handover-to" />
                </label>
              </li>
              <li>
                <label htmlFor="inc-ref-notes">
                  <span>Reference to page number with handover notes</span>
                  <input type="text" id="inc-ref-notes" name="inc-ref-notes" />
                </label>
              </li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Handover;

// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.
