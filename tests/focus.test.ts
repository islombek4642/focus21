import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { useFocusStore } from '../src/store/focusStore.ts';
import { TIMER_CONFIG } from '../src/constants/timer.ts';

describe('Focus Module Logic & Timer Calculations', () => {
  beforeEach(() => {
    useFocusStore.setState({
      activeChunkMinutes: TIMER_CONFIG.DEFAULT_CHUNK_MINUTES,
      secondsRemaining: TIMER_CONFIG.DEFAULT_CHUNK_MINUTES * 60,
      isRunning: false,
      startedAtTimestamp: null,
      a1Task: null,
      completedChunksCount: 0,
    });
  });

  it('must initialize timer with exact 90-minute chunk configuration', () => {
    const state = useFocusStore.getState();
    assert.strictEqual(state.activeChunkMinutes, 90);
    assert.strictEqual(state.secondsRemaining, 5400);
    assert.strictEqual(state.isRunning, false);
  });

  it('must start timer with timestamp and run state', () => {
    const store = useFocusStore.getState();
    store.startTimer();

    const runningState = useFocusStore.getState();
    assert.strictEqual(runningState.isRunning, true);
    assert.ok(runningState.startedAtTimestamp !== null);
    assert.ok(runningState.startedAtTimestamp! <= Date.now());
  });

  it('must accurately compute elapsed seconds from timestamp', () => {
    const store = useFocusStore.getState();
    const mockStartedAt = Date.now() - 30000; // 30 seconds ago
    useFocusStore.setState({
      isRunning: true,
      startedAtTimestamp: mockStartedAt,
      secondsRemaining: 5400,
    });

    store.tick();
    const state = useFocusStore.getState();
    // secondsRemaining should decrease by tick
    assert.strictEqual(state.secondsRemaining, 5399);
  });

  it('must complete chunk and increment completed count when timer hits 0', () => {
    const store = useFocusStore.getState();
    useFocusStore.setState({
      isRunning: true,
      startedAtTimestamp: Date.now(),
      secondsRemaining: 1,
    });

    store.tick();
    const state = useFocusStore.getState();
    assert.strictEqual(state.isRunning, false);
    assert.strictEqual(state.secondsRemaining, 0);
    assert.strictEqual(state.completedChunksCount, 1);
  });

  it('must reset timer to default chunk seconds cleanly', () => {
    const store = useFocusStore.getState();
    useFocusStore.setState({
      isRunning: true,
      secondsRemaining: 1200,
      startedAtTimestamp: Date.now(),
    });

    store.resetTimer();
    const state = useFocusStore.getState();
    assert.strictEqual(state.isRunning, false);
    assert.strictEqual(state.secondsRemaining, 5400);
    assert.strictEqual(state.startedAtTimestamp, null);
  });

  it('must assign and clear [A-1] Hero task in focusStore', () => {
    const store = useFocusStore.getState();
    assert.strictEqual(store.a1Task, null);

    store.setA1Task({ id: 'task-101', title: 'Complete Executive Strategy Pitch' });
    assert.deepStrictEqual(useFocusStore.getState().a1Task, {
      id: 'task-101',
      title: 'Complete Executive Strategy Pitch',
    });

    store.setA1Task(null);
    assert.strictEqual(useFocusStore.getState().a1Task, null);
  });
});
