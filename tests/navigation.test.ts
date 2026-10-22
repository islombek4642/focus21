import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getTabIconName, TAB_NAV_ITEMS } from '../src/navigation/navConfig.ts';
import { ROUTES } from '../src/constants/routes.ts';

describe('Navigation & Common Component Contracts', () => {
  it('must define exactly 5 primary tabs with valid vector icon names', () => {
    assert.strictEqual(TAB_NAV_ITEMS.length, 5);
    const routes = TAB_NAV_ITEMS.map((t) => t.route);
    assert.deepStrictEqual(routes, [
      ROUTES.FOCUS,
      ROUTES.GOALS,
      ROUTES.PLANNER,
      ROUTES.AUDIT,
      ROUTES.BALANCE,
    ]);

    for (const item of TAB_NAV_ITEMS) {
      assert.ok(item.icon, `Item ${item.route} must have a vector icon defined`);
      assert.strictEqual(typeof item.icon, 'string');
      // Must not be an emoji
      assert.strictEqual(/^[\x00-\x7F]*$/.test(item.icon), true, 'Icon name must be ascii (no emoji)');
    }
  });

  it('must return correct active vs inactive icon configurations', () => {
    const focusIcon = getTabIconName(ROUTES.FOCUS, true);
    assert.strictEqual(focusIcon, 'target');

    const goalsIcon = getTabIconName(ROUTES.GOALS, false);
    assert.strictEqual(goalsIcon, 'compass');
  });
});
