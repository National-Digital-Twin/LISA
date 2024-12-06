// Global imports
import { MouseEvent, useState } from 'react';
import { Link } from 'react-router-dom';

// Local imports
import { MODAL_KEY, PRINTABLE_KEY } from '../utils/constants';
import helpGuidanceData from './helpGuidanceData.json';
import { Icons } from '../utils';

interface propsHelp {
  helpId: string;
  onClose: () => void;
}

const HelpGuidance = ({ helpId, onClose }: propsHelp) => {
  const [modal, setModal] = useState<boolean>(sessionStorage.getItem(MODAL_KEY) === 'yes');
  const [printable, setPrintable] = useState<boolean>(sessionStorage.getItem(PRINTABLE_KEY) === 'yes');
  const filteredHelp = helpGuidanceData.filter((items) => items.id === helpId);
  const helpItems = filteredHelp[0].listedItems;

  const onToggleModal = (evt: MouseEvent<HTMLAnchorElement>) => {
    evt.preventDefault();
    setModal((prev) => {
      sessionStorage.setItem(MODAL_KEY, prev ? 'no' : 'yes');
      return !prev;
    });
  };

  const onTogglePrintable = (evt: MouseEvent<HTMLAnchorElement>) => {
    evt.preventDefault();
    setPrintable((prev) => {
      sessionStorage.setItem(PRINTABLE_KEY, prev ? 'no' : 'yes');
      return !prev;
    });
    setTimeout(() => {
      document.location.reload();
    }, 0);
  };

  return (
    <>
      <h3 className="help-title">
        <span>HELP / GUIDANCE</span>
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
          type="button"
          onClick={onClose}
        >
          <Icons.Close />
        </button>
      </h3>
      <h5>Log Book</h5>
      <ul>
        {helpItems.map((item) => <li key={item}>{item}</li>)}
        <li>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <Link to="#" onClick={onToggleModal}>
            {modal ? 'Display forms inline' : 'Make forms modal'}
          </Link>
        </li>
        <li>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <Link to="#" onClick={onTogglePrintable}>
            {printable ? 'Prevent printing' : 'Enable printing'}
          </Link>
        </li>
      </ul>
    </>
  );
};

export default HelpGuidance;
