/**
 * Navigation Routes Constants
 */

export const ROUTES = {
  FOCUS: 'Focus',
  GOALS: 'Goals',
  PLANNER: 'Planner',
  AUDIT: 'Audit',
  BALANCE: 'Balance',
  SETTINGS: 'Settings',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RouteName = (typeof ROUTES)[RouteKey];
