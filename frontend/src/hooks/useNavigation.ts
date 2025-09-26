import { useLocation } from 'react-router-dom';
import { useResponsive } from './useResponsiveHook';

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
  const { isMobile } = useResponsive();

  const isActive = (path: string) => pathname === path;

  const filteredItems = NAVIGATION_ITEMS.filter(
    (item) => !(isMobile && item.label === 'Form Templates')
  );

  const handleLink = () => {
    document.documentElement.scrollTo(0, 0);
  };

  return {
    navigationItems: filteredItems,
    isActive,
    handleLink
  };
};
