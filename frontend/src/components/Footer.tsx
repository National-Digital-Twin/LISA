// SPDX-License-Identifier: Apache-2.0
// © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
// and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

import { Link } from 'react-router-dom';
import LogoHeaderInverted from '../assets/images/logo-inverted.svg';
import { Icons } from '../utils';

const Footer = () => (
  <footer>
    <div className="footer-logo">
      <img
        className="logo-header"
        src={LogoHeaderInverted}
        alt="Local Incident Services Application"
      />
    </div>
    <div className="feedback">
      <Link to="mailto:ndtp@businessandtrade.gov.uk?subject=LISA Feedback">
        <Icons.Email />
        Send us feedback
      </Link>
    </div>
    <div className="footer-irc">Local Incident Services Application</div>
  </footer>
);

export default Footer;
