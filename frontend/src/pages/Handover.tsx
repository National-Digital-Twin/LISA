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
                  Name of officer
                  <input type="text" id="inc-officer-name" name="inc-officer-name" />
                </label>
              </li>
              <li>
                <label htmlFor="inc-officer-role">
                  Role of officer
                  <input type="text" id="inc-officer-role" name="inc-officer-role" />
                </label>
              </li>
              <li>
                <label htmlFor="inc-shift-start-date">
                  Start shift date
                  <input className="input-calendar" type="text" id="inc-shift-start-date" name="inc-shift-start-date" />
                </label>
              </li>
              <li>
                <label htmlFor="inc-shift-start-time">
                  Start shift time
                  <input type="text" id="inc-shift-start-time" name="inc-shift-start-time" />
                </label>
              </li>
              <li>
                <label htmlFor="inc-shift-end-date">
                  End shift date
                  <input className="input-calendar" type="text" id="inc-shift-end-date" name="inc-shift-end-date" />
                </label>
              </li>
              <li>
                <label htmlFor="inc-shift-end-time">
                  End shift time
                  <input type="text" id="inc-shift-end-time" name="inc-shift-end-time" />
                </label>
              </li>
              <li>
                <label htmlFor="inc-handover-to">
                  Name of officer handing over to
                  <input type="text" id="inc-handover-to" name="inc-handover-to" />
                </label>
              </li>
              <li>
                <label htmlFor="inc-ref-notes">
                  Reference to page number with handover notes
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
