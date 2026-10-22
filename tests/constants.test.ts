import { describe, it } from 'node:test';
import assert from 'node:assert';
import { THEME } from '../src/constants/theme.ts';
import { TIMER_CONFIG } from '../src/constants/timer.ts';
import { ROUTES } from '../src/constants/routes.ts';
import { BRIAN_TRACY_PRINCIPLES } from '../src/constants/principles.ts';

describe('Design Tokens & Constants System', () => {
  it('must contain accurate Obsidian Executive color tokens', () => {
    assert.strictEqual(THEME.colors.canvas, '#0D0E11');
    assert.strictEqual(THEME.colors.card, '#16181D');
    assert.strictEqual(THEME.colors.accent, '#E5A93C');
    assert.strictEqual(THEME.colors.success, '#10B981');
    assert.strictEqual(THEME.colors.textPrimary, '#FFFFFF');
    assert.strictEqual(THEME.colors.textSecondary, '#8F94A0');
  });

  it('must define correct timer configurations', () => {
    assert.strictEqual(TIMER_CONFIG.DEFAULT_CHUNK_MINUTES, 90);
    assert.strictEqual(TIMER_CONFIG.LOMBARDI_TIME_MINUTES, 15);
    assert.strictEqual(TIMER_CONFIG.DEFAULT_CHUNK_SECONDS, 90 * 60);
  });

  it('must define all 5 navigation routes', () => {
    assert.strictEqual(ROUTES.FOCUS, 'Focus');
    assert.strictEqual(ROUTES.GOALS, 'Goals');
    assert.strictEqual(ROUTES.PLANNER, 'Planner');
    assert.strictEqual(ROUTES.AUDIT, 'Audit');
    assert.strictEqual(ROUTES.BALANCE, 'Balance');
  });

  it('must register exactly 21 Brian Tracy principles', () => {
    assert.strictEqual(BRIAN_TRACY_PRINCIPLES.length, 21);
    assert.strictEqual(BRIAN_TRACY_PRINCIPLES[0].id, 1);
    assert.strictEqual(BRIAN_TRACY_PRINCIPLES[20].id, 21);
  });
});
