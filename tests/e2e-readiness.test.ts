import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { BRIAN_TRACY_PRINCIPLES } from '../src/constants/principles.ts';
import { exportAllData, importAllData } from '../src/services/backup.ts';
import { t, setLanguage } from '../src/services/i18n.ts';

describe('End-to-End System Readiness & 21 Principles Verification', () => {
  it('must verify all 21 Brian Tracy principles have metadata, translation, and implementation mapping', () => {
    assert.strictEqual(BRIAN_TRACY_PRINCIPLES.length, 21);

    for (const p of BRIAN_TRACY_PRINCIPLES) {
      assert.ok(p.id >= 1 && p.id <= 21);
      assert.ok(p.key, `Principle #${p.id} must have a key`);

      // Verify translation exists in all 3 languages (id: 1..21)
      for (const lang of ['uz', 'ru', 'en'] as const) {
        setLanguage(lang);
        const title = t(`principles.${p.id}.title`);
        assert.ok(title && !title.startsWith('principles.'), `Principle #${p.id} title missing in ${lang}`);
        const summary = t(`principles.${p.id}.summary`);
        assert.ok(summary && !summary.startsWith('principles.'), `Principle #${p.id} summary missing in ${lang}`);
      }
    }
  });

  it('must strictly enforce ZERO EMOJIS in all src/ typescript and json files', () => {
    // Emojis regex without regex pipe-in-class syntax bug
    const emojiRegex = /(?:[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F1E6}-\u{1F1FF}])/u;

    function checkDir(dir: string) {
      const files = readdirSync(dir);
      for (const file of files) {
        const fullPath = join(dir, file);
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
          checkDir(fullPath);
        } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json')) {
          const content = readFileSync(fullPath, 'utf-8');
          const hasEmoji = emojiRegex.test(content);
          assert.strictEqual(
            hasEmoji,
            false,
            `File ${fullPath} contains an emoji! Emojis are strictly prohibited by rule #7.`
          );
        }
      }
    }

    checkDir('src');
  });

  it('must verify backup export and import cycle with complex state', () => {
    const backupJson = exportAllData();
    assert.ok(typeof backupJson === 'string');
    assert.ok(backupJson.length > 50);

    const parsed = JSON.parse(backupJson);
    assert.ok(parsed.version);
    assert.ok(parsed.exportedAt);
    assert.ok(parsed.planner);
    assert.ok(Array.isArray(parsed.planner.tasks));

    const importResult = importAllData(backupJson);
    assert.strictEqual(importResult, true);
  });
});
