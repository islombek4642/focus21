# Focus 21 (Executive OS) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a modular, 100% offline-first React Native + Expo Android application covering all 21 Brian Tracy time management principles across 5 dedicated tabs with strict Obsidian Executive design, i18n (uz, ru, en), no hardcoding, zero emojis, and DRY/SoC architecture.

**Architecture:** Domain-driven modular architecture with 5 feature modules (`focus`, `goals`, `planner`, `audit`, `balance`), centralized `constants/`, multi-language `locales/` (`uz`, `ru`, `en`), `store/` via Zustand + AsyncStorage, and strict separation of UI components, hooks, and services.

**Tech Stack:** React Native, Expo, TypeScript, Zustand, AsyncStorage, `@expo/vector-icons`, `expo-haptics`, `expo-file-system`, `expo-sharing`.

**Spec:** [docs/superpowers/specs/2026-10-22-brian-tracy-executive-os-design.md](file:///d:/nomsiz%20loyiha/docs/superpowers/specs/2026-10-22-brian-tracy-executive-os-design.md)  
**Design Reference:** [DESIGN.md](file:///d:/nomsiz%20loyiha/DESIGN.md)  
**Engineering Standards:** [AGENTS.md](file:///d:/nomsiz%20loyiha/AGENTS.md)

---

## Global Constraints

- **No Hardcoding:** Zero magic numbers or strings; all constants reside in `src/constants/` and all text strings in `src/locales/`.
- **Zero Emojis & Stickers:** Strictly prohibited in UI; use only thin monochrome vector icons (`@expo/vector-icons`).
- **3-Language i18n:** Every single UI string and Brian Tracy principle text must be available in Uzbek (`uz`), Russian (`ru`), and English (`en`).
- **100% Offline-First:** No compulsory network calls, accounts, or logins; all data persists locally via AsyncStorage with JSON export/import.
- **Design System Fidelity:** Strictly adhere to Obsidian Executive tokens (`#0D0E11` canvas, `#16181D` card, `#E5A93C` amber gold accent, `#10B981` emerald status, `#FFFFFF` text).

---

## Review Focus

1. **Timer background drift:** When app goes to background during a 90-minute Chunks session, calculate elapsed background timestamp delta upon return rather than relying on paused `setInterval`.
2. **First-launch empty states:** When user has no tasks, goals, or time logs, render executive empty states with actionable buttons rather than blank surfaces.
3. **Locale hot-switching:** Switching language between `uz`, `ru`, and `en` must update all active views and 21 principles texts instantly without app restart.
4. **Corrupt backup recovery:** Importing an invalid or malformed JSON file must fail safely with an alert without corrupting local state.
5. **Pareto 80/20 sorting integrity:** If tasks are added without priority, auto-categorize to default and maintain strict A1 > A2 > B > C ranking.

---

## File Structure Map

```
src/
├── constants/
│   ├── theme.ts          # Color tokens, spacing, typography from DESIGN.md
│   ├── timer.ts          # 90min Chunks, intervals, default configs
│   ├── routes.ts         # Navigation route names
│   └── principles.ts     # Metadata for all 21 Brian Tracy principles
├── locales/
│   ├── uz.json           # Uzbek translations (complete)
│   ├── ru.json           # Russian translations (complete)
│   └── en.json           # English translations (complete)
├── services/
│   ├── i18n.ts           # Lightweight localization engine with t('key')
│   ├── backup.ts         # JSON export/import service
│   └── haptics.ts        # Haptic feedback wrapper
├── store/
│   ├── index.ts          # Root store aggregator
│   ├── focusStore.ts     # Chunks timer & A-1 task state
│   ├── goalsStore.ts     # 3 Spheres & 3 Golden Questions
│   ├── plannerStore.ts   # ABCDE task list & Pareto calculation
│   ├── auditStore.ts     # Time log, TRAF inbox, hourly rate
│   ├── balanceStore.ts   # Wheel of Life & Saying No log
│   └── settingsStore.ts  # Locale selection (uz/ru/en)
├── components/
│   ├── common/           # Button, Card, Header, Icon, Modal, EmptyState
│   └── layout/           # ScreenContainer, TabBar
├── modules/
│   ├── focus/            # TimerRing, HeroTaskCard, MantraBanner
│   ├── goals/            # SphereCard, GoldenQuestionsModal, KRAList
│   ├── planner/          # ABCDELabel, TaskItem, EveningRitualModal
│   ├── audit/            # TimeLogChart, TRAFSwipeCard, HourlyRateCalc
│   └── balance/          # WheelOfLifeRadar, FamilyTimeCounter, SayingNoList
└── navigation/
    └── RootNavigator.tsx # 5-Tab Bottom Navigator
```

---

## Tasks

### Task 1: Project Initialization & Core Scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `app.json`, `App.tsx`, `babel.config.js`
- Test: `tests/scaffold.test.ts`

**Interfaces:**
- Produces: Base working Expo application runnable via `npx expo start` with TypeScript configured.

- [ ] **Step 1: Write scaffold sanity test**
Verify project configuration imports React Native and Expo cleanly without missing dependencies.

- [ ] **Step 2: Run test to verify it fails**
Run: `npm test` or `npx jest tests/scaffold.test.ts`
Expected: FAIL (no dependencies installed yet).

- [ ] **Step 3: Scaffold project files and dependencies**
Install `expo`, `react-native`, `typescript`, `@types/react`, `zustand`, `@react-native-async-storage/async-storage`, `@react-navigation/native`, `@react-navigation/bottom-tabs`, `@expo/vector-icons`, `expo-haptics`, `expo-file-system`, `expo-sharing`.

- [ ] **Step 4: Verify test passes and TypeScript compiles**
Run: `npx tsc --noEmit`
Expected: PASS with 0 errors.

- [ ] **Step 5: Commit**
```bash
git add .
git commit -m "chore: scaffold react native expo project with typescript"
```

---

### Task 2: Design Tokens & Constants System

**Files:**
- Create: `src/constants/theme.ts`
- Create: `src/constants/timer.ts`
- Create: `src/constants/routes.ts`
- Create: `src/constants/principles.ts`
- Test: `tests/constants.test.ts`

**Interfaces:**
- Produces: `THEME`, `TIMER_CONFIG`, `ROUTES`, `PRINCIPLES_METADATA` constants.
- Consumes: Specifications from [DESIGN.md](file:///d:/nomsiz%20loyiha/DESIGN.md).

- [ ] **Step 1: Write test for theme tokens and timer constants**
Assert `THEME.colors.canvas === '#0D0E11'`, `THEME.colors.card === '#16181D'`, `THEME.colors.accent === '#E5A93C'`, and `TIMER_CONFIG.DEFAULT_CHUNK_MINUTES === 90`.

- [ ] **Step 2: Run test to verify it fails**
Expected: FAIL with "module not found".

- [ ] **Step 3: Implement `theme.ts`, `timer.ts`, `routes.ts`, and `principles.ts`**
Define all color tokens, spacing scales (4, 8, 16, 24, 32), timer defaults (90 mins Chunks, 15 mins Lombardi), route enum (`FOCUS`, `GOALS`, `PLANNER`, `AUDIT`, `BALANCE`), and 21 principles IDs.

- [ ] **Step 4: Run test to verify it passes**
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/constants/ tests/constants.test.ts
git commit -m "feat(constants): define theme tokens and system constants"
```

---

### Task 3: Localization (i18n) Engine & Multi-Language Data

**Files:**
- Create: `src/locales/uz.json`
- Create: `src/locales/ru.json`
- Create: `src/locales/en.json`
- Create: `src/services/i18n.ts`
- Test: `tests/i18n.test.ts`

**Interfaces:**
- Produces: `t(key: string, params?: Record<string, string>): string`, `setLanguage(lang: 'uz' | 'ru' | 'en'): void`, `getLanguage(): string`.

- [ ] **Step 1: Write test for i18n key parity across uz, ru, en**
Verify that every key in `uz.json` also exists in `ru.json` and `en.json` without missing translations, and that `t()` translates correctly.

- [ ] **Step 2: Run test to verify it fails**
Expected: FAIL with "i18n module not found".

- [ ] **Step 3: Implement localization files and i18n service**
Populate comprehensive translations for all 21 principles, tabs, actions, and mantras ("Do It Now!", "Single Handling", "Pareto 80/20", "TRAF", "Lombardi Time").

- [ ] **Step 4: Run test to verify it passes**
Expected: PASS with 100% key match across all 3 languages.

- [ ] **Step 5: Commit**
```bash
git add src/locales/ src/services/i18n.ts tests/i18n.test.ts
git commit -m "feat(i18n): implement 3-language localization engine and dictionaries"
```

---

### Task 4: State Management & Offline Persistence Store

**Files:**
- Create: `src/store/focusStore.ts`
- Create: `src/store/goalsStore.ts`
- Create: `src/store/plannerStore.ts`
- Create: `src/store/auditStore.ts`
- Create: `src/store/balanceStore.ts`
- Create: `src/store/settingsStore.ts`
- Create: `src/services/backup.ts`
- Test: `tests/store.test.ts`

**Interfaces:**
- Produces: Zustand hooks with AsyncStorage persistence for each domain module.
- Produces: `exportBackup(): Promise<string>`, `importBackup(jsonString: string): Promise<boolean>`.

- [ ] **Step 1: Write store unit tests**
Test task addition, A1 promotion, timer start/stop, Pareto ratio calculation, and backup export/import validation.

- [ ] **Step 2: Run test to verify it fails**
Expected: FAIL.

- [ ] **Step 3: Implement Zustand stores with AsyncStorage persist middleware**
Implement typed stores with state immutability, backup schema validation, and recovery handling.

- [ ] **Step 4: Run test to verify it passes**
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/store/ src/services/backup.ts tests/store.test.ts
git commit -m "feat(store): implement zustand offline-first stores and backup engine"
```

---

### Task 5: Common Reusable Components & Navigation Shell

**Files:**
- Create: `src/components/common/ScreenContainer.tsx`
- Create: `src/components/common/ExecutiveCard.tsx`
- Create: `src/components/common/ExecutiveButton.tsx`
- Create: `src/components/common/VectorIcon.tsx`
- Create: `src/components/common/Badge.tsx`
- Create: `src/navigation/RootNavigator.tsx`
- Test: `tests/navigation.test.ts`

**Interfaces:**
- Produces: Reusable UI library adhering to Obsidian Executive tokens and 0-emoji rule.
- Produces: 5-Tab navigator (`Focus`, `Goals`, `Planner`, `Audit`, `Balance`).

- [ ] **Step 1: Write test for icon wrapper and tab navigation**
Verify that `VectorIcon` renders without emojis and returns valid vector elements, and tabs mount all 5 routes.

- [ ] **Step 2: Run test to verify it fails**
Expected: FAIL.

- [ ] **Step 3: Implement common components and RootNavigator**
Use `@expo/vector-icons` (Feather/Ionicons), apply `#0D0E11` background, `#16181D` card styling, and `#E5A93C` active tint.

- [ ] **Step 4: Run test to verify it passes**
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/components/common/ src/navigation/ tests/navigation.test.ts
git commit -m "feat(ui): implement executive common components and 5-tab navigation"
```

---

### Task 6: Focus Module (Tab 1: Chunks Timer & Single Handling)

**Files:**
- Create: `src/modules/focus/FocusScreen.tsx`
- Create: `src/modules/focus/TimerRing.tsx`
- Create: `src/modules/focus/HeroTaskCard.tsx`
- Create: `src/modules/focus/useFocusTimer.ts`
- Test: `tests/focus.test.ts`

**Interfaces:**
- Produces: Complete Focus tab with 90-min Chunks of Time timer, background timestamp compensation, "DO IT NOW" haptics, and [A-1] Hero Card.

- [ ] **Step 1: Write focus timer test**
Test countdown logic, background elapsed time calculation, and timer completion event.

- [ ] **Step 2: Run test to verify it fails**
Expected: FAIL.

- [ ] **Step 3: Implement FocusScreen and TimerRing**
Render thin amber progress ring (`#E5A93C`), large tabular timer digits (`01:24:18`), "DO IT NOW" pill button, and [A-1] Hero Card.

- [ ] **Step 4: Run test to verify it passes**
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/modules/focus/ tests/focus.test.ts
git commit -m "feat(focus): implement chunks timer ring and single handling hero card"
```

---

### Task 7: Goals Module (Tab 2: 3 Spheres & 3 Golden Questions)

**Files:**
- Create: `src/modules/goals/GoalsScreen.tsx`
- Create: `src/modules/goals/SphereCard.tsx`
- Create: `src/modules/goals/GoldenQuestionsModal.tsx`
- Create: `src/modules/goals/KRACard.tsx`
- Test: `tests/goals.test.ts`

**Interfaces:**
- Produces: Goals tab handling 3 Spheres (Family, Career/Financial, Self-development), 3 Golden Questions modal, and Key Result Areas ("Why am I on the payroll?").

- [ ] **Step 1: Write goals unit test**
Test goal creation across 3 spheres and 3 Golden Questions answer saving.

- [ ] **Step 2: Run test to verify it fails**
Expected: FAIL.

- [ ] **Step 3: Implement GoalsScreen and components**
Build UI with executive cards, progress trackers, and KRA list.

- [ ] **Step 4: Run test to verify it passes**
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/modules/goals/ tests/goals.test.ts
git commit -m "feat(goals): implement 3 spheres and golden questions module"
```

---

### Task 8: Planner Module (Tab 3: ABCDE Matrix & Evening Ritual)

**Files:**
- Create: `src/modules/planner/PlannerScreen.tsx`
- Create: `src/modules/planner/ABCDETaskItem.tsx`
- Create: `src/modules/planner/ParetoSummary.tsx`
- Create: `src/modules/planner/EveningRitualModal.tsx`
- Test: `tests/planner.test.ts`

**Interfaces:**
- Produces: Planner tab with ABCDE tagging, A1-A5 priority sorting, 80/20 Pareto highlight (top 20% high-payoff tasks), and Evening Ritual mode.

- [ ] **Step 1: Write planner logic test**
Test ABCDE sorting (A1 before A2, A before B, etc.) and Pareto 80/20 task identification.

- [ ] **Step 2: Run test to verify it fails**
Expected: FAIL.

- [ ] **Step 3: Implement PlannerScreen and EveningRitualModal**
Build intuitive task sorting, priority badge picker, and evening planning wizard.

- [ ] **Step 4: Run test to verify it passes**
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/modules/planner/ tests/planner.test.ts
git commit -m "feat(planner): implement abcde sorting and evening ritual wizard"
```

---

### Task 9: Audit Module (Tab 4: Time Log & TRAF Triage)

**Files:**
- Create: `src/modules/audit/AuditScreen.tsx`
- Create: `src/modules/audit/TimeLogList.tsx`
- Create: `src/modules/audit/TRAFInbox.tsx`
- Create: `src/modules/audit/HourlyRateCalculator.tsx`
- Test: `tests/audit.test.ts`

**Interfaces:**
- Produces: Audit tab with minute-by-minute Time Log tracker, TRAF inbox (Toss, Refer, Action, File), and hourly rate delegation calculator.

- [ ] **Step 1: Write audit and TRAF tests**
Test time logging by minute increments and TRAF action dispatching (Toss = delete, Refer = delegate, Action = add to planner, File = archive).

- [ ] **Step 2: Run test to verify it fails**
Expected: FAIL.

- [ ] **Step 3: Implement AuditScreen, TRAFInbox, and HourlyRateCalculator**
Build interactive triage cards, hourly value math, and Lombardi Time reminder toggle.

- [ ] **Step 4: Run test to verify it passes**
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/modules/audit/ tests/audit.test.ts
git commit -m "feat(audit): implement time log, traf triage, and delegation calculator"
```

---

### Task 10: Balance Module (Tab 5: Wheel of Life & Saying No Journal)

**Files:**
- Create: `src/modules/balance/BalanceScreen.tsx`
- Create: `src/modules/balance/WheelOfLifeRadar.tsx`
- Create: `src/modules/balance/FamilyTimeTracker.tsx`
- Create: `src/modules/balance/SayingNoJournal.tsx`
- Test: `tests/balance.test.ts`

**Interfaces:**
- Produces: Balance tab featuring Wheel of Life radar scoring, daily family communication timer, and "Saying No" boundary journal.

- [ ] **Step 1: Write balance module tests**
Test Wheel of Life score aggregation and Saying No log persistence.

- [ ] **Step 2: Run test to verify it fails**
Expected: FAIL.

- [ ] **Step 3: Implement BalanceScreen, WheelOfLifeRadar, and SayingNoJournal**
Build SVG or canvas radar chart, quality-of-life checklist, and saying-no script suggestions.

- [ ] **Step 4: Run test to verify it passes**
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/modules/balance/ tests/balance.test.ts
git commit -m "feat(balance): implement wheel of life radar and saying no journal"
```

---

### Task 11: End-to-End Verification, Settings & APK Readiness

**Files:**
- Create: `src/screens/SettingsModal.tsx`
- Modify: `app.json` (configure Android package `com.focus21.executive`, icons, splash)
- Test: `tests/e2e-readiness.test.ts`

**Interfaces:**
- Produces: Language selector (`uz`/`ru`/`en`), JSON backup export/import button, and verified APK build readiness.

- [ ] **Step 1: Write comprehensive 21 principles checklist verification test**
Ensure each of the 21 principles has a functional presence and translation key in the project.

- [ ] **Step 2: Run verification test**
Run: `npm test`
Expected: ALL TESTS PASS.

- [ ] **Step 3: Configure Android app build settings**
Configure `app.json` with package name, deep link schemes, permissions, and dark mode theme lock.

- [ ] **Step 4: Run TypeScript build check**
Run: `npx tsc --noEmit`
Expected: 0 errors.

- [ ] **Step 5: Commit**
```bash
git add app.json src/screens/SettingsModal.tsx tests/
git commit -m "chore: complete 21 principles verification and android build configuration"
```
