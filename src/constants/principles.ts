/**
 * Brian Tracy 21 Principles Registry
 */

export interface PrincipleMetadata {
  id: number;
  key: string;
  tab: 'Focus' | 'Goals' | 'Planner' | 'Audit' | 'Balance';
  icon: string;
}

export const BRIAN_TRACY_PRINCIPLES: PrincipleMetadata[] = [
  { id: 1, key: 'goals', tab: 'Goals', icon: 'flag' },
  { id: 2, key: 'organizedPlans', tab: 'Planner', icon: 'list' },
  { id: 3, key: 'analysis', tab: 'Planner', icon: 'check-square' },
  { id: 4, key: 'priorities', tab: 'Planner', icon: 'pie-chart' },
  { id: 5, key: 'concentration', tab: 'Focus', icon: 'target' },
  { id: 6, key: 'deadlinesRewards', tab: 'Focus', icon: 'award' },
  { id: 7, key: 'timeLog', tab: 'Audit', icon: 'clock' },
  { id: 8, key: 'procrastination', tab: 'Focus', icon: 'zap' },
  { id: 9, key: 'delegation', tab: 'Audit', icon: 'share-2' },
  { id: 10, key: 'meetings', tab: 'Audit', icon: 'users' },
  { id: 11, key: 'interruptions', tab: 'Focus', icon: 'shield' },
  { id: 12, key: 'keyResultAreas', tab: 'Goals', icon: 'compass' },
  { id: 13, key: 'batchingTasks', tab: 'Planner', icon: 'layers' },
  { id: 14, key: 'neatness', tab: 'Audit', icon: 'inbox' },
  { id: 15, key: 'chunksOfTime', tab: 'Focus', icon: 'watch' },
  { id: 16, key: 'transitionTime', tab: 'Audit', icon: 'headphones' },
  { id: 17, key: 'telephone', tab: 'Focus', icon: 'phone-off' },
  { id: 18, key: 'punctuality', tab: 'Audit', icon: 'calendar' },
  { id: 19, key: 'workSimplification', tab: 'Goals', icon: 'scissors' },
  { id: 20, key: 'sayingNo', tab: 'Balance', icon: 'slash' },
  { id: 21, key: 'balance', tab: 'Balance', icon: 'activity' },
];
