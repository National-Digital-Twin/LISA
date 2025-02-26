// Global imports
import { MouseEvent, ReactNode, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Box, AppBar, Toolbar, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

// Local imports
import NavButt from '../assets/images/button-nav.svg';
import LogoHeader from '../assets/images/logo.svg';
import LogoCorp from '../assets/images/NDTP_Gemini_Logo.svg';
// eslint-disable-next-line import/no-relative-packages
import { User } from '../../../common/User';
import { useAuth, useIncidents, useOutsideClick } from '../hooks';
import { Format, Icons } from '../utils';
import HelpGuidance from './HelpGuidance';
import NotificationsBanner from './NotificationsBanner';

type MenuItemType = { to: string; className?: string; content: ReactNode };

const HOME_ITEM = {
  to: '/',
  className: 'logo-link',
  content: (
    <div>
      <img style={{ width: 50 }} className="logo-header corp" src={LogoCorp} alt="Main Logo" />
      <img
        className="logo-header lisa"
        src={LogoHeader}
        alt="Local Incident Services Application"
      />
    </div>
  )
};

const ALL_INCIDENTS_ITEM = { to: '/', content: 'INCIDENTS' };

const ACTIVE_INCIDENT_ITEMS: Array<MenuItemType> = [
  { to: 'incident', content: 'OVERVIEW' },
  { to: 'logbook', content: 'LOG' },
  { to: 'location', content: 'LOCATION' },
  { to: 'files', content: 'FILES' }
  // { to: 'riskassessment', content: 'RISK ASSESSMENT' },
  // { to: 'hazards', content: 'HAZARDS' },
  // { to: 'handover', content: 'HANDOVER' }
];

interface Props {
  helpVisible?: boolean;
}

const Header = ({ helpVisible = false }: Props) => {
  const { pathname } = useLocation();
  const { incidentId } = useParams();
  const { user } = useAuth();
  const { incidents } = useIncidents();
  const [isHelpVisible, setIsHelpVisible] = useState<boolean>(helpVisible);

  const helpContainerRef = useOutsideClick<HTMLDivElement>(() => {
    setIsHelpVisible(false);
  });

  const handleHelpToggle = () => {
    setIsHelpVisible((prev) => !prev);
  };
  const [navHidden, setNavHidden] = useState<boolean>(true);

  const incident = incidents?.find((inc) => inc.id === incidentId);
  let items: Array<MenuItemType> = [HOME_ITEM];
  if (incident) {
    items = [
      HOME_ITEM,
      ...ACTIVE_INCIDENT_ITEMS.map((i) => ({ ...i, to: `${i.to}/${incidentId}` }))
    ];
  }

  const handleNavbutt = () => {
    setNavHidden(!navHidden);
  };

  const handleLink = () => {
    setNavHidden(true);
    document.documentElement.scrollTo(0, 0);
  };

  const signOut = (evt: MouseEvent<HTMLAnchorElement>) => {
    evt.preventDefault();
    user.logout();
  };

  return (
    <Box component="header">
      <AppBar
        position="static"
        sx={{ height: 60, backgroundColor: 'secondary.main', border: 'none' }}
      >
        <Toolbar
          variant="dense"
          sx={{ display: 'flex', paddingX: '1rem', flexDirection: 'row' }}
          disableGutters
        >
          <span className="nav-menu-butt">
            <button onMouseDown={handleNavbutt} type="button">
              <img src={NavButt} alt="Menu" />
            </button>
          </span>

          <Box component="nav" className={`nav-menu-links${navHidden ? ' nav-hidden-small' : ''}`}>
            <ul>
              {items.map((item: MenuItemType) => (
                <li
                  key={item.to}
                  className={`${item.className ?? ''} ${pathname.includes(item.to) ? 'selected' : ''}`}
                >
                  <Link className={item.className} onClick={handleLink} to={item.to}>
                    {item.content}
                  </Link>
                </li>
              ))}
            </ul>
            {incident && (
              <ul className="right non-incident">
                <li>
                  <Link onClick={handleLink} to={ALL_INCIDENTS_ITEM.to}>
                    {ALL_INCIDENTS_ITEM.content}
                  </Link>
                </li>
              </ul>
            )}
          </Box>
          <div className="header-user">
            <div className="header-user-name">
              {Format.user(user.current as User)}
              <Link className="sign-out" onClick={signOut} to="logout">
                Sign out
              </Link>
            </div>
            <Icons.Person />
          </div>
          <IconButton type="button" onClick={handleHelpToggle} disableFocusRipple disableRipple>
            <SettingsIcon fontSize="large" sx={{ color: 'text.secondary' }} />
          </IconButton>
          {isHelpVisible && (
            <div ref={helpContainerRef} className="help-guidance-container">
              <HelpGuidance helpId="Log Book" onClose={() => setIsHelpVisible(false)} />
            </div>
          )}
        </Toolbar>
      </AppBar>
      <NotificationsBanner />
    </Box>
  );
};

export default Header;
