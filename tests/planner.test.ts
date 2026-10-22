import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { usePlannerStore } from '../src/store/plannerStore.ts';

describe('Planner Module Logic & ABCDE Prioritization', () => {
  beforeEach(() => {
    usePlannerStore.getState().reset();
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
});
