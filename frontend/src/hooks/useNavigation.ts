import { useLocation } from 'react-router-dom';

export interface NavigationItem {
  to: string;
  label: string;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { to: '/', label: 'Home' },
  { to: '/incidents', label: 'Incidents' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/forms', label: 'Form Templates' }
];

export const useNavigation = () => {
  const { pathname } = useLocation();

  const isActive = (path: string) => pathname === path;

  const handleLink = () => {
    document.documentElement.scrollTo(0, 0);
  };

  return {
    navigationItems: NAVIGATION_ITEMS,
    isActive,
    handleLink
  };
};
