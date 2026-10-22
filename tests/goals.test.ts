import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { useGoalsStore } from '../src/store/goalsStore.ts';

describe('Goals Module Logic & Spheres', () => {
  beforeEach(() => {
    useGoalsStore.getState().reset();
  });

  it('must manage goals across the 3 fundamental Tracy spheres', () => {
    const store = useGoalsStore.getState();
    assert.strictEqual(store.goals.length, 0);

    store.addGoal('family', 'Spend weekend uninterrupted with kids');
    store.addGoal('business', 'Double annual enterprise MRR');
    store.addGoal('self', 'Read 21 personal development books this year');

    const state = useGoalsStore.getState();
    assert.strictEqual(state.goals.length, 3);

    const familyGoals = state.goals.filter((g) => g.sphere === 'family');
    const businessGoals = state.goals.filter((g) => g.sphere === 'business');
    const selfGoals = state.goals.filter((g) => g.sphere === 'self');

    assert.strictEqual(familyGoals.length, 1);
    assert.strictEqual(familyGoals[0].title, 'Spend weekend uninterrupted with kids');
    assert.strictEqual(businessGoals.length, 1);
    assert.strictEqual(selfGoals.length, 1);
  });

  it('must persist answers to Tracy 3 Golden Questions', () => {
    const store = useGoalsStore.getState();

    store.setGoldenQuestionAnswer('q1Lottery', 'Provide financial security for family and build an academy');
    store.setGoldenQuestionAnswer('q2SixMonths', 'Spend every single day with loved ones and write my legacy');
    store.setGoldenQuestionAnswer('q3NoFailure', 'Build the premier executive productivity operating system');

    const state = useGoalsStore.getState();
    assert.strictEqual(
      state.goldenQuestions.q1Lottery,
      'Provide financial security for family and build an academy'
    );
    assert.strictEqual(
      state.goldenQuestions.q2SixMonths,
      'Spend every single day with loved ones and write my legacy'
    );
    assert.strictEqual(
      state.goldenQuestions.q3NoFailure,
      'Build the premier executive productivity operating system'
    );
  });

  it('must toggle goal completion state cleanly', () => {
    const store = useGoalsStore.getState();
    store.addGoal('business', 'Launch V1 to beta users');
    const goalId = useGoalsStore.getState().goals[0].id;

    assert.strictEqual(useGoalsStore.getState().goals[0].completed, false);
    store.toggleGoal(goalId);
    assert.strictEqual(useGoalsStore.getState().goals[0].completed, true);
  });
});
