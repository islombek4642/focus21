/**
 * Tab Navigation Configuration
 * Defines vector icon mapping and route titles for all 5 tabs
 */

import { ROUTES } from '../constants/routes.ts';

export interface TabNavItem {
  route: string;
  labelKey: string;
  icon: string;
}

export const TAB_NAV_ITEMS: TabNavItem[] = [
  { route: ROUTES.FOCUS, labelKey: 'tabs.focus', icon: 'target' },
  { route: ROUTES.GOALS, labelKey: 'tabs.goals', icon: 'compass' },
  { route: ROUTES.PLANNER, labelKey: 'tabs.planner', icon: 'calendar' },
  { route: ROUTES.AUDIT, labelKey: 'tabs.audit', icon: 'bar-chart-2' },
  { route: ROUTES.BALANCE, labelKey: 'tabs.balance', icon: 'activity' },
];

export function getTabIconName(route: string, focused: boolean): string {
  switch (route) {
    case ROUTES.FOCUS:
      return 'target';
    case ROUTES.GOALS:
      return 'compass';
    case ROUTES.PLANNER:
      return 'calendar';
    case ROUTES.AUDIT:
      return 'bar-chart-2';
    case ROUTES.BALANCE:
      return 'activity';
    default:
      return 'circle';
  }
}
