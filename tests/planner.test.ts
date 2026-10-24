import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { usePlannerStore, getRecommendedPriority } from '../src/store/plannerStore.ts';
import { useFocusStore } from '../src/store/focusStore.ts';

describe('Planner Module Logic & ABCDE Prioritization', () => {
  beforeEach(() => {
    usePlannerStore.getState().reset();
    useFocusStore.getState().reset();
  });

  it('must correctly prioritize tasks in ABCDE order (A before B, A1 before A2)', () => {
    const store = usePlannerStore.getState();

    store.addTask({ id: 'task-c', title: 'Coffee chat', priority: 'C' });
    store.addTask({ id: 'task-a2', title: 'Prepare board slides', priority: 'A', priorityRank: 2 });
    store.addTask({ id: 'task-b1', title: 'Reply to non-critical emails', priority: 'B', priorityRank: 1 });
    store.addTask({ id: 'task-a1', title: 'Finalize quarterly financial audit', priority: 'A', priorityRank: 1 });
    store.addTask({ id: 'task-d', title: 'Expense receipt scanning', priority: 'D' });
    store.addTask({ id: 'task-e', title: 'Old newsletter archive review', priority: 'E' });

    const state = usePlannerStore.getState();
    assert.strictEqual(state.tasks.length, 6);

    // Let's test sorted tasks order
    const priorityWeights: Record<string, number> = { A: 1, B: 2, C: 3, D: 4, E: 5 };
    const sorted = [...state.tasks].sort((x, y) => {
      const wA = priorityWeights[x.priority || 'C'] || 3;
      const wB = priorityWeights[y.priority || 'C'] || 3;
      if (wA !== wB) return wA - wB;
      return (x.priorityRank || 99) - (y.priorityRank || 99);
    });

    assert.strictEqual(sorted[0].id, 'task-a1');
    assert.strictEqual(sorted[1].id, 'task-a2');
    assert.strictEqual(sorted[2].id, 'task-b1');
    assert.strictEqual(sorted[3].id, 'task-c');
    assert.strictEqual(sorted[4].id, 'task-d');
    assert.strictEqual(sorted[5].id, 'task-e');
  });

  it('must isolate top 20% Pareto high-payoff tasks accurately', () => {
    const store = usePlannerStore.getState();

    // Add 10 tasks (A1, A2, B1..B5, C1..C3)
    store.addTask({ id: '1', title: 'T1', priority: 'A', priorityRank: 1 });
    store.addTask({ id: '2', title: 'T2', priority: 'A', priorityRank: 2 });
    for (let i = 3; i <= 7; i++) {
      store.addTask({ id: `${i}`, title: `T${i}`, priority: 'B', priorityRank: i });
    }
    for (let i = 8; i <= 10; i++) {
      store.addTask({ id: `${i}`, title: `T${i}`, priority: 'C' });
    }

    const pareto = usePlannerStore.getState().getParetoTasks();
    // 20% of 10 tasks = 2 tasks
    assert.strictEqual(pareto.length, 2);
    assert.strictEqual(pareto[0].id, '1');
    assert.strictEqual(pareto[1].id, '2');
  });

  it('must toggle task completion and filter pending tasks', () => {
    const store = usePlannerStore.getState();
    store.addTask({ id: 't1', title: 'Task One', priority: 'A' });

    assert.strictEqual(usePlannerStore.getState().tasks[0].completed, false);
    store.toggleTask('t1');
    assert.strictEqual(usePlannerStore.getState().tasks[0].completed, true);
  });

  it('must recommend priorities following Smart Auto-Cascade (A up to 3, then B up to 4, then C)', () => {
    const store = usePlannerStore.getState();

    // 0 tasks -> A
    assert.strictEqual(getRecommendedPriority(store.tasks), 'A');

    // 1 task -> A
    store.addTask({ id: '1', title: 'A1', priority: 'A' });
    assert.strictEqual(getRecommendedPriority(usePlannerStore.getState().tasks), 'A');

    // 2 tasks -> A
    store.addTask({ id: '2', title: 'A2', priority: 'A' });
    assert.strictEqual(getRecommendedPriority(usePlannerStore.getState().tasks), 'A');

    // 3 tasks (A maxed at 3) -> B
    store.addTask({ id: '3', title: 'A3', priority: 'A' });
    assert.strictEqual(getRecommendedPriority(usePlannerStore.getState().tasks), 'B');

    // B tasks added up to 4 -> B
    store.addTask({ id: '4', title: 'B1', priority: 'B' });
    store.addTask({ id: '5', title: 'B2', priority: 'B' });
    store.addTask({ id: '6', title: 'B3', priority: 'B' });
    assert.strictEqual(getRecommendedPriority(usePlannerStore.getState().tasks), 'B');

    // 4th B task added -> C
    store.addTask({ id: '7', title: 'B4', priority: 'B' });
    assert.strictEqual(getRecommendedPriority(usePlannerStore.getState().tasks), 'C');
  });

  it('must synchronize with focusStore when a selected A1 task is deleted or completed', () => {
    const planner = usePlannerStore.getState();

    planner.addTask({ id: 'task-1', title: 'Big Frog A1', priority: 'A', priorityRank: 1 });
    planner.addTask({ id: 'task-2', title: 'Secondary Frog A2', priority: 'A', priorityRank: 2 });

    useFocusStore.getState().setA1Task({ id: 'task-1', title: 'Big Frog A1' });
    assert.strictEqual(useFocusStore.getState().a1Task?.id, 'task-1');

    // Delete task-1 -> focusStore should auto-advance to task-2
    planner.deleteTask('task-1');
    assert.strictEqual(useFocusStore.getState().a1Task?.id, 'task-2');

    // Complete task-2 -> focusStore should clear to null
    planner.toggleTask('task-2');
    assert.strictEqual(useFocusStore.getState().a1Task, null);
  });

  it('must automatically re-index tasks sequentially when A-1 is deleted (A2 becomes A1, A3 becomes A2)', () => {
    const planner = usePlannerStore.getState();

    planner.addTask({ id: 'task-a1', title: 'Task 1', priority: 'A', priorityRank: 1 });
    planner.addTask({ id: 'task-a2', title: 'Task 2', priority: 'A', priorityRank: 2 });
    planner.addTask({ id: 'task-a3', title: 'Task 3', priority: 'A', priorityRank: 3 });
    planner.addTask({ id: 'task-b1', title: 'Task B1', priority: 'B', priorityRank: 1 });
    planner.addTask({ id: 'task-b2', title: 'Task B2', priority: 'B', priorityRank: 2 });

    // Delete A1 -> A2 becomes A1, A3 becomes A2
    planner.deleteTask('task-a1');

    const tasks = usePlannerStore.getState().tasks;
    const aTasks = tasks.filter((t) => t.priority === 'A');
    assert.strictEqual(aTasks.length, 2);
    assert.strictEqual(aTasks[0].id, 'task-a2');
    assert.strictEqual(aTasks[0].priorityRank, 1); // Promoted to A-1!
    assert.strictEqual(aTasks[1].id, 'task-a3');
    assert.strictEqual(aTasks[1].priorityRank, 2); // Promoted to A-2!

    // Delete B1 -> B2 becomes B1
    planner.deleteTask('task-b1');
    const bTasks = usePlannerStore.getState().tasks.filter((t) => t.priority === 'B');
    assert.strictEqual(bTasks.length, 1);
    assert.strictEqual(bTasks[0].id, 'task-b2');
    assert.strictEqual(bTasks[0].priorityRank, 1); // Promoted to B-1!
  });
});
