import { describe, it } from 'node:test';
import assert from 'node:assert';
import { t, setLanguage, getLanguage, getAvailableLanguages } from '../src/services/i18n.ts';
import uz from '../src/locales/uz.json' with { type: 'json' };
import ru from '../src/locales/ru.json' with { type: 'json' };
import en from '../src/locales/en.json' with { type: 'json' };

function getAllKeys(obj: Record<string, any>, prefix = ''): string[] {
  let keys: string[] = [];
  for (const k of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      keys = keys.concat(getAllKeys(obj[k], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys.sort();
}

describe('Localization (i18n) Engine', () => {
  it('must support uz, ru, and en languages', () => {
    const languages = getAvailableLanguages();
    assert.deepStrictEqual(languages, ['uz', 'ru', 'en']);
  });

  it('must have exact parity of translation keys across all 3 languages', () => {
    const uzKeys = getAllKeys(uz);
    const ruKeys = getAllKeys(ru);
    const enKeys = getAllKeys(en);

    assert.strictEqual(uzKeys.length > 50, true, 'Must have at least 50 translation keys');
    assert.deepStrictEqual(uzKeys, enKeys, 'uz and en keys must match exactly');
    assert.deepStrictEqual(uzKeys, ruKeys, 'uz and ru keys must match exactly');
  });

  it('must translate keys correctly when switching languages', () => {
    setLanguage('uz');
    assert.strictEqual(getLanguage(), 'uz');
    assert.strictEqual(t('focus.doItNow'), 'HOZIR BAJARING');

    setLanguage('ru');
    assert.strictEqual(getLanguage(), 'ru');
    assert.strictEqual(t('focus.doItNow'), 'СДЕЛАЙ ЭТО СЕЙЧАС');

    setLanguage('en');
    assert.strictEqual(getLanguage(), 'en');
    assert.strictEqual(t('focus.doItNow'), 'DO IT NOW');
  });

  it('must translate all 21 principles in each language', () => {
    for (let i = 1; i <= 21; i++) {
      setLanguage('uz');
      const uzTitle = t(`principles.${i}.title`);
      assert.ok(uzTitle && !uzTitle.startsWith('principles.'), `uz title for principle ${i} must exist`);

      setLanguage('ru');
      const ruTitle = t(`principles.${i}.title`);
      assert.ok(ruTitle && !ruTitle.startsWith('principles.'), `ru title for principle ${i} must exist`);

      setLanguage('en');
      const enTitle = t(`principles.${i}.title`);
      assert.ok(enTitle && !enTitle.startsWith('principles.'), `en title for principle ${i} must exist`);
    }
  });

  it('must handle interpolation params correctly', () => {
    setLanguage('en');
    assert.strictEqual(
      t('focus.timeRemaining', { time: '01:24:18' }),
      '01:24:18 remaining'
    );
  });

  it('must return defaultValue when key does not exist in dictionaries', () => {
    assert.strictEqual(
      t('non.existent.key', { defaultValue: 'Executive Default' }),
      'Executive Default'
    );
    assert.strictEqual(
      t('non.existent.keyWithParam', { defaultValue: 'Hello {name}', name: 'Brian' }),
      'Hello Brian'
    );
  });

  it('must contain all active UI keys in uz, ru, and en dictionaries', () => {
    const requiredKeys = [
      'focus.subtitle',
      'focus.reset',
      'focus.singleHandlingTag',
      'common.paretoBadge',
      'focus.noTaskTitle',
      'focus.noTaskSubtitle',
      'focus.idleStatus',
      'focus.chunksLabel',
      'focus.runningStatus',
      'focus.singleHandlingRule',
      'focus.markComplete',
      'focus.switchTask',
      'goals.goldenQuestionsBannerTitle',
      'planner.paretoTag',
      'audit.hourlyRateTitle',
      'balance.wheelTitle',
    ];

    for (const key of requiredKeys) {
      for (const lang of ['uz', 'ru', 'en'] as const) {
        setLanguage(lang);
        const translated = t(key);
        assert.notStrictEqual(
          translated,
          key,
          `Key "${key}" must have a real translation in "${lang}"`
        );
      }
    }
  });
});
