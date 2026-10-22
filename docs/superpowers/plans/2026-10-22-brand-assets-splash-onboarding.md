# Brand Assets, Splash Screen, Onboarding & Daily Principle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a luxury Obsidian Executive brand identity for "Focus 21", configure standard Expo app icons/splash assets, implement an in-app cold-start splash transition, build an onboarding walkthrough with settings re-trigger, and integrate an executive "Daily Brian Tracy Principle" hero insight card.

**Architecture:** 
1. Assets generation and `app.json` configuration for Android adaptive icons and splash.
2. `settingsStore` persistence for `hasSeenOnboarding` state.
3. Presentational `OnboardingModal` with 3 executive slides and 3-language i18n support.
4. `DailyPrincipleCard` module calculating daily Tracy principle (`dayOfYear % 21`) with clean vector icons and expandable card.
5. Zero emojis, Auros Dark / Obsidian Executive design tokens, 100% test coverage with key parity.

**Tech Stack:** React Native, Expo, Zustand, TypeScript, Node test runner (`node --test`).

**Spec:** Direct user request for brand logo/banner, splash screen, onboarding, and daily principle experience.

## Global Constraints
- Strictly ZERO EMOJIS in any TypeScript, TSX, or JSON files (enforced by automated test suite).
- 3-language parity (`uz`, `ru`, `en`) across all new text keys.
- Colors must strictly follow `THEME.colors` from `src/constants/theme.ts`.
- Clean Separation of Concerns: store for state, components for presentation, locales for copy.

## Review Focus
1. Brand icon assets must be valid PNGs with transparent or `#0D0E11` background suitable for Expo bundler.
2. Onboarding must only show once on first launch unless manually triggered from Settings.
3. Daily Principle calculation must never produce `undefined` index (`0 <= index < 21`).
4. Keyboard layout and existing screen container insets must remain unaffected.
5. `app.json` must pass JSON schema validation and `npm test` project verification.

---

### Task 1: Generate Brand Assets & Configure `app.json`

**Files:**
- Create: `assets/icon.png`, `assets/adaptive-icon.png`, `assets/splash.png`, `assets/favicon.png`
- Modify: `app.json`
- Test: `tests/project.test.ts`

**Interfaces:**
- Consumes: `THEME.colors.canvas` (`#0D0E11`), `THEME.colors.accent` (`#E5A93C`)
- Produces: Valid icon & splash references in `app.json`

- [ ] **Step 1: Write failing project test asserting icon and splash fields in `app.json`**
```ts
// in tests/project.test.ts
it('must contain valid icon and splash configuration in app.json', () => { ... });
```
- [ ] **Step 2: Run test to verify it fails**
Run: `npm test`
Expected: FAIL due to missing `icon` or `splash.image` in `app.json`.
- [ ] **Step 3: Generate executive brand assets and place in `assets/`**
Generate Obsidian Executive logo artwork (minimalist gold geometric monogram on dark canvas) and export into `assets/icon.png`, `assets/adaptive-icon.png`, `assets/splash.png`.
- [ ] **Step 4: Update `app.json` with icon, adaptiveIcon, and splash paths**
- [ ] **Step 5: Run test to verify it passes**
Run: `npm test`
Expected: PASS
- [ ] **Step 6: Commit**
`git add assets/ app.json tests/project.test.ts ; git commit -m "feat(branding): add executive brand assets and configure app.json"`

---

### Task 2: State & Localization for Onboarding and Daily Principle

**Files:**
- Modify: `src/store/settingsStore.ts`
- Modify: `src/locales/uz.json`, `src/locales/ru.json`, `src/locales/en.json`
- Test: `tests/i18n.test.ts`, `tests/stores.test.ts`

**Interfaces:**
- Consumes: Zustand store pattern
- Produces: `hasSeenOnboarding: boolean`, `setHasSeenOnboarding: (seen: boolean) => void`, `showOnboarding: boolean`, `setShowOnboarding: (show: boolean) => void`

- [ ] **Step 1: Write test for onboarding state persistence and daily principle logic**
- [ ] **Step 2: Run test to verify it fails**
Run: `npm test`
- [ ] **Step 3: Extend `settingsStore.ts` with onboarding state flags**
- [ ] **Step 4: Add translation keys for onboarding slides and daily principle in `uz.json`, `ru.json`, and `en.json`**
- [ ] **Step 5: Run tests to verify all 43+ tests pass including key parity**
Run: `npm test`
- [ ] **Step 6: Commit**
`git add src/store/settingsStore.ts src/locales/ tests/ ; git commit -m "feat(store): add onboarding store flags and i18n keys"`

---

### Task 3: Build Executive Onboarding Walkthrough Modal

**Files:**
- Create: `src/components/common/OnboardingModal.tsx`
- Modify: `src/modules/settings/SettingsModal.tsx` (add button to review onboarding)
- Modify: `App.tsx` (mount `OnboardingModal` when needed)
- Test: `tests/components.test.ts`

**Interfaces:**
- Consumes: `useSettingsStore`, `useTranslation`, `VectorIcon`
- Produces: Interactive 3-slide onboarding modal with slide indicator, next/finish buttons, and smooth close.

- [ ] **Step 1: Implement `OnboardingModal.tsx` with 3 executive slides**
  - Slide 1: 90-Daqiqalik Chunks of Time (Principle #16)
  - Slide 2: ABCDE va Pareto 80/20 Qoidasi (Principle #3 & #5)
  - Slide 3: TRAF va Hayot Balansi (Principle #11 & #19)
- [ ] **Step 2: Connect `OnboardingModal` to `App.tsx` conditionally on first launch**
- [ ] **Step 3: Add "Qo'llanmani ko'rish" (View Guide) trigger inside `SettingsModal.tsx`**
- [ ] **Step 4: Typecheck and test**
Run: `npx tsc --noEmit && npm test`
- [ ] **Step 5: Commit**
`git add src/components/common/OnboardingModal.tsx src/modules/settings/SettingsModal.tsx App.tsx ; git commit -m "feat(ui): add executive onboarding walkthrough modal"`

---

### Task 4: Build Daily Brian Tracy Principle Card for Hero Screen

**Files:**
- Create: `src/components/common/DailyPrincipleCard.tsx`
- Modify: `src/modules/focus/FocusScreen.tsx`
- Test: `tests/principles.test.ts`

**Interfaces:**
- Consumes: `BRIAN_TRACY_PRINCIPLES` from `src/constants/principles.ts`, `useTranslation`
- Produces: Daily principle card displaying day's principle number, title, quote, and expandable tip.

- [ ] **Step 1: Write test verifying day-of-year principle calculation produces valid index**
- [ ] **Step 2: Implement `DailyPrincipleCard.tsx`**
- [ ] **Step 3: Embed `DailyPrincipleCard` cleanly into `FocusScreen.tsx` above or below hero controls**
- [ ] **Step 4: Typecheck and run tests**
Run: `npx tsc --noEmit && npm test`
- [ ] **Step 5: Commit**
`git add src/components/common/DailyPrincipleCard.tsx src/modules/focus/FocusScreen.tsx tests/ ; git commit -m "feat(focus): integrate daily Brian Tracy principle card"`

---

### Task 5: Final Visual Verification & Integration Polish

**Files:**
- Verification: All modified screens and components
- Run: `npm test`, `npx tsc --noEmit`
- [ ] **Step 1: Run comprehensive test suite**
- [ ] **Step 2: Verify zero emojis in all codebase files**
- [ ] **Step 3: Verify git tree clean and commit final polish**
