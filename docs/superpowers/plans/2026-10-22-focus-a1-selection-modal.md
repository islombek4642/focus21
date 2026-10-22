# Focus A-1 Task Selection Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

This plan implements an executive modal allowing users to select or create their **[A-1] Single Handling Hero Task** directly from the Focus screen when tapping on the "No Task Selected" card or "Change A-1" button.

---

## Proposed Changes

### 1. Localization Keys
Add translation keys to `src/locales/uz.json`, `src/locales/ru.json`, and `src/locales/en.json` (strictly zero emojis, 100% key parity):
- `focus.selectA1ModalTitle`
- `focus.createNewA1`
- `focus.createNewA1Placeholder`
- `focus.addAndSelect`
- `focus.plannerTasksTitle`
- `focus.noPlannerTasks`
- `focus.activeBadge`

### 2. UI Component: `SelectA1TaskModal.tsx`
Create `src/modules/focus/SelectA1TaskModal.tsx`:
- Modal overlay with Obsidian Executive dark styling (`#05080A`, card `#0B0F14`, border `#1A232E`, accent `#D97706`).
- Quick input box to create and select a new [A-1] task directly.
- Scrollable list of pending tasks from `plannerStore`, prioritized:
  - `A` priority tasks highlighted with Amber badge.
  - `B`, `C` tasks listed below.
  - Active [A-1] task marked with an active indicator.
- Tapping any task selects it as [A-1] and closes modal.

### 3. Connect to `FocusScreen.tsx`
- Add `selectModalVisible` state in `FocusScreen.tsx`.
- Pass `onSelectTask={() => setSelectModalVisible(true)}` to `HeroTaskCard`.
- Pass `handleSelectA1Task` callback to update both `focusStore` and `plannerStore` (if newly created).

### 4. Verification & Testing
- Unit test in `tests/focus.test.ts` for A-1 assignment logic.
- Run `npm test` to verify all 42+ tests pass (including zero-emoji rule).
- Run `npx tsc --noEmit` to verify type safety.

---

## Tasks

- [ ] **Task 1: Add localization keys with 100% parity across `uz`, `ru`, `en`**
- [ ] **Task 2: Write failing unit test for A-1 selection and task creation**
- [ ] **Task 3: Implement `SelectA1TaskModal.tsx` component**
- [ ] **Task 4: Connect `SelectA1TaskModal` to `FocusScreen.tsx`**
- [ ] **Task 5: Run verification tests and commit**
