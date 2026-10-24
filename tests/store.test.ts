import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { usePlannerStore } from '../src/store/plannerStore.ts';
import { useFocusStore } from '../src/store/focusStore.ts';
import { useGoalsStore } from '../src/store/goalsStore.ts';
import { useAuditStore } from '../src/store/auditStore.ts';
import { useBalanceStore } from '../src/store/balanceStore.ts';
import { useSettingsStore } from '../src/store/settingsStore.ts';
import { exportAllData, importAllData } from '../src/services/backup.ts';

describe('Zustand Offline-First Stores & Backup', () => {
  beforeEach(() => {
    usePlannerStore.getState().reset();
    useFocusStore.getState().reset();
    useGoalsStore.getState().reset();
    useAuditStore.getState().reset();
    useBalanceStore.getState().reset();
  });

  it('plannerStore: must add tasks and calculate Pareto 80/20 top 20%', () => {
    const store = usePlannerStore.getState();
    // Add 10 tasks
    for (let i = 1; i <= 10; i++) {
      store.addTask({
        id: `task-${i}`,
        title: `Task ${i}`,
        priority: i <= 2 ? 'A' : i <= 5 ? 'B' : 'C',
        priorityRank: i <= 2 ? i : undefined,
      });
    }

    const state = usePlannerStore.getState();
    assert.strictEqual(state.tasks.length, 10);
    // Pareto: 20% of 10 tasks = 2 tasks
    const paretoTasks = state.getParetoTasks();
    assert.strictEqual(paretoTasks.length, 2);
    assert.strictEqual(paretoTasks[0].priority, 'A');
    assert.strictEqual(paretoTasks[0].priorityRank, 1);
  });

  it('focusStore: must manage 90-min Chunks timer and A1 task assignment', () => {
    const store = useFocusStore.getState();
    assert.strictEqual(store.remainingSeconds, 90 * 60);
    assert.strictEqual(store.isRunning, false);

    store.startTimer();
    assert.strictEqual(useFocusStore.getState().isRunning, true);

    store.tick(60); // 1 minute passed
    assert.strictEqual(useFocusStore.getState().remainingSeconds, 90 * 60 - 60);

    store.setA1Task({ id: 'task-1', title: 'Complete Strategic Plan' });
    assert.strictEqual(useFocusStore.getState().a1Task?.title, 'Complete Strategic Plan');
  });

  it('goalsStore: must manage 3 spheres and 3 golden questions', () => {
    const store = useGoalsStore.getState();
    store.addGoal('family', 'Spend 1 hour of undivided attention with family daily');
    store.addGoal('business', 'Launch Focus 21 product');
    store.addGoal('self', 'Read 1 hour every morning');

    const state = useGoalsStore.getState();
    assert.strictEqual(state.goals.length, 3);

    store.setGoldenQuestionAnswer('q1Lottery', 'Invest in education and build software');
    assert.strictEqual(
      useGoalsStore.getState().goldenQuestions.q1Lottery,
      'Invest in education and build software'
    );
  });

  it('auditStore: must handle TRAF inbox (Toss, Refer, Action, File)', () => {
    const store = useAuditStore.getState();
    store.addTrafItem('Random Newsletter', 'toss');
    store.addTrafItem('Design Mockup', 'action');

    const state = useAuditStore.getState();
    assert.strictEqual(state.trafItems.length, 2);
    assert.strictEqual(state.trafItems[0].category, 'action');
    assert.strictEqual(state.trafItems[1].category, 'toss');
  });

  it('backup: must export all data to JSON and import safely', () => {
    usePlannerStore.getState().addTask({ id: 't-1', title: 'Goal Task', priority: 'A', priorityRank: 1 });
    useGoalsStore.getState().addGoal('business', 'Scale to 10k users');

    const exported = exportAllData();
    assert.ok(exported.includes('Goal Task'));
    assert.ok(exported.includes('Scale to 10k users'));

    // Reset stores
    usePlannerStore.getState().reset();
    useGoalsStore.getState().reset();
    assert.strictEqual(usePlannerStore.getState().tasks.length, 0);

    // Import back
    const success = importAllData(exported);
    assert.strictEqual(success, true);
    assert.strictEqual(usePlannerStore.getState().tasks.length, 1);
    assert.strictEqual(usePlannerStore.getState().tasks[0].title, 'Goal Task');
  });

  it('backup: must reject invalid JSON without crashing', () => {
    const result = importAllData('{ invalid json ]');
    assert.strictEqual(result, false);
  });

  it('settingsStore: must manage onboarding seen and open state', async () => {
    const { useSettingsStore } = await import('../src/store/settingsStore.ts');
    const store = useSettingsStore.getState();
    assert.strictEqual(typeof store.hasSeenOnboarding, 'boolean');
    assert.strictEqual(typeof store.isOnboardingOpen, 'boolean');

    store.setHasSeenOnboarding(true);
    assert.strictEqual(useSettingsStore.getState().hasSeenOnboarding, true);

    store.setOnboardingOpen(true);
    assert.strictEqual(useSettingsStore.getState().isOnboardingOpen, true);
    store.setOnboardingOpen(false);
    assert.strictEqual(useSettingsStore.getState().isOnboardingOpen, false);
  });

  it('storage: must persist and hydrate state without errors', async () => {
    const { persistAppState, hydrateAppState } = await import('../src/services/storage.ts');
    usePlannerStore.getState().addTask({ id: 'task-persisted', title: 'Persisted Plan', priority: 'A', priorityRank: 1 });
    useSettingsStore.getState().setHasSeenOnboarding(true);

    await persistAppState();

    // Clear planner
    usePlannerStore.getState().reset();
    assert.strictEqual(usePlannerStore.getState().tasks.length, 0);

    // Hydrate back
    const hydrated = await hydrateAppState();
    assert.strictEqual(hydrated, true);
    assert.strictEqual(usePlannerStore.getState().tasks.length, 1);
    assert.strictEqual(usePlannerStore.getState().tasks[0].id, 'task-persisted');
    assert.strictEqual(useSettingsStore.getState().hasSeenOnboarding, true);
  });
});
