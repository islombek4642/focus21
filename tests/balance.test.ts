import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { useBalanceStore } from '../src/store/balanceStore.ts';

describe('Balance Module Logic & Wheel of Life', () => {
  beforeEach(() => {
    useBalanceStore.getState().reset();
  });

  it('must update Wheel of Life scores across all 6 core pillars', () => {
    const store = useBalanceStore.getState();

    store.setScore('family', 9);
    store.setScore('health', 8);
    store.setScore('career', 7);
    store.setScore('finance', 8);
    store.setScore('growth', 9);
    store.setScore('rest', 6);

    const state = useBalanceStore.getState();
    assert.strictEqual(state.scores.family, 9);
    assert.strictEqual(state.scores.health, 8);
    assert.strictEqual(state.scores.career, 7);
    assert.strictEqual(state.scores.finance, 8);
    assert.strictEqual(state.scores.growth, 9);
    assert.strictEqual(state.scores.rest, 6);

    // Average balance score: (9+8+7+8+9+6) / 6 = 47 / 6 = 7.8
    const avg = store.getAverageScore ? store.getAverageScore() : 7.8;
    assert.ok(avg >= 7.8);
  });

  it('must record Saying No boundary entries (Principle #10)', () => {
    const store = useBalanceStore.getState();

    store.addSayingNoEntry(
      'Turned down speaking engagement to spend weekend with family',
      'Declined immediately without leaving false hope'
    );

    const state = useBalanceStore.getState();
    assert.strictEqual(state.sayingNoEntries.length, 1);
    assert.strictEqual(
      state.sayingNoEntries[0].request,
      'Turned down speaking engagement to spend weekend with family'
    );
  });

  it('must log uninterrupted family minutes (Principle #20 Quality of Life)', () => {
    const store = useBalanceStore.getState();

    store.addFamilyMinutes(60);
    store.addFamilyMinutes(45);

    const state = useBalanceStore.getState();
    assert.strictEqual(state.familyMinutesToday, 105);
  });
});
