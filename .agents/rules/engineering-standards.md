---
description: Mandatory modular architecture, no hardcoding, i18n multi-language (uz, ru, en), SoC and DRY standards for all agents
---

# Mandatory Engineering Standards

Before writing or modifying any code in this project, every agent MUST adhere to these rules:

1. **Modular Architecture:**
   - Every domain feature (`focus`, `goals`, `planner`, `audit`, `balance`) must be isolated with its own components, hooks, and types.
   - Decoupled modules communicating only through shared stores and typed contracts.

2. **No Hardcoding & Constants First:**
   - Zero raw magic numbers, magic strings, or inline configurations.
   - All timers (e.g. 90min Chunks), colors, routes, Pareto ratios, and layout metrics must live in dedicated `constants/` files.

3. **Multi-language Localization (i18n):**
   - Three languages supported: Uzbek (`uz`), Russian (`ru`), English (`en`).
   - All strings, headers, mantras, and 21 principles must reside in dedicated locale files (`locales/uz.json`, `locales/ru.json`, `locales/en.json`).
   - Never use raw UI strings in components; always use translation keys via `t('key')`.

4. **Separation of Concerns (SoC):**
   - Strict layer separation: UI (Presentation) vs Hooks/Services (Business Logic) vs Store (State & Storage) vs Locales & Constants.

5. **DRY (Don't Repeat Yourself):**
   - Reusable UI elements in `components/common/`, shared calculations and helpers in `utils/`.

6. **Design Fidelity:**
   - Strict adherence to Auros dark terminal design tokens in `DESIGN.md`. No generic UI slop.

7. **No Emojis & Dedicated Icon Libraries Only:**
   - Emojis and stickers are strictly prohibited in the UI.
   - Use only dedicated professional vector icon libraries (e.g. `@expo/vector-icons`, `lucide-react-native`, `feather`, `material-community-icons`).
   - All icons must be thin-stroke, monochrome, and harmonized with Auros tokens.
