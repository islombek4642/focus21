import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { useAuditStore } from '../src/store/auditStore.ts';

describe('Audit Module Logic & TRAF Triage Engine', () => {
  beforeEach(() => {
    useAuditStore.getState().reset();
  });

  it('must manage TRAF items across Toss, Refer, Action, File', () => {
    const store = useAuditStore.getState();

    store.addTrafItem('Marketing junk email', 'toss');
    store.addTrafItem('Drafting quarterly legal summary', 'refer');
    store.addTrafItem('Review product roadmap draft', 'action');
    store.addTrafItem('Tax clearance certificate 2025', 'file');

    const state = useAuditStore.getState();
    assert.strictEqual(state.trafItems.length, 4);

    const tossItems = state.trafItems.filter((i) => i.category === 'toss');
    const referItems = state.trafItems.filter((i) => i.category === 'refer');
    const actionItems = state.trafItems.filter((i) => i.category === 'action');
    const fileItems = state.trafItems.filter((i) => i.category === 'file');

    assert.strictEqual(tossItems.length, 1);
    assert.strictEqual(referItems.length, 1);
    assert.strictEqual(actionItems.length, 1);
    assert.strictEqual(fileItems.length, 1);
  });

  it('must calculate executive hourly rate correctly (Annual Income / 2000 hours)', () => {
    const store = useAuditStore.getState();

    // If target annual income is $200,000, hourly rate is $200,000 / 2000 = $100/hr
    store.setTargetAnnualIncome(200000);
    const hourly = store.getHourlyRate();
    assert.strictEqual(hourly, 100);

    // If target annual income is $500,000, hourly rate is $250/hr
    store.setTargetAnnualIncome(500000);
    assert.strictEqual(store.getHourlyRate(), 250);
  });

  it('must log real-time audit entries with duration and activity category', () => {
    const store = useAuditStore.getState();

    store.addTimeLog({
      id: 'log-1',
      activity: 'Deep Focus Coding',
      category: 'focus',
      durationMinutes: 90,
      timestamp: Date.now(),
    });

    store.addTimeLog({
      id: 'log-2',
      activity: 'Executive Sync',
      category: 'meeting',
      durationMinutes: 30,
      timestamp: Date.now(),
    });

    const state = useAuditStore.getState();
    assert.strictEqual(state.timeLogs.length, 2);
    const log1 = state.timeLogs.find((l) => l.id === 'log-1');
    const log2 = state.timeLogs.find((l) => l.id === 'log-2');
    assert.strictEqual(log1?.durationMinutes, 90);
    assert.strictEqual(log2?.durationMinutes, 30);
  });
});
