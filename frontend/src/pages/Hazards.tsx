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
          HAZARD ENTRIES
        </h2>
        <form>
          <div className="section log-form">
            <ul>
              <li>
                <label htmlFor="inc-">
                  TBD
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
