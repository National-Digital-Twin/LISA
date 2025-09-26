// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

// Global imports
import { MouseEvent, useState } from 'react';
import { Link } from 'react-router-dom';

// Local imports
import { IconButton } from '@mui/material';
import { MODAL_KEY, PRINTABLE_KEY } from '../utils/constants';
import helpGuidanceData from './helpGuidanceData.json';
import { Icons } from '../utils';

interface PropsHelp {
  helpId: string;
  onClose: () => void;
}

const HelpGuidance = ({ helpId, onClose }: PropsHelp) => {
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
        <IconButton onClick={onClose}>
          <Icons.Close />
        </IconButton>
      </h3>
      <h5>Log Book</h5>
      <ul>
        {helpItems.map((item) => <li key={item}>{item}</li>)}
        <li>
          <Link to="#" onClick={onToggleModal}>
            {modal ? 'Display forms inline' : 'Make forms modal'}
          </Link>
        </li>
        <li>
          <Link to="#" onClick={onTogglePrintable}>
            {printable ? 'Prevent printing' : 'Enable printing'}
          </Link>
        </li>
      </ul>
    </>
  );
};

export default HelpGuidance;
