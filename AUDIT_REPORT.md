# Focus 21 — Keng Qamrovli Texnik, Arxitekturaviy va Dizayn Auditi Hisoboti

> **Holat:** Kod bazasi to'liq o'rganib chiqildi. Birorta ham loyiha kodi o'zgartirilmadi (Faqat audit va tahlil).
> **Sana:** 2026-10-23
> **Qamrov:** Loyihaning barcha TypeScript/TSX modullari, do'konlari (stores), navigatsiya, i18n lokalizatsiyasi, doimiy qiymatlari (constants), dizayn tizimi, testlari va Brian Tracy'ning 21 ta tamoyiliga muvofiqligi.

---

## MUNDARIJA
1. [Kritik Ishga Tushish va Test Qulashi Muammolari (Build & Runtime Blockers)](#1-kritik-ishga-tushish-va-test-qulashi-muammolari)
2. [Brian Tracy 21 Tamoyili Raqamlari va Joylashuvidagi Tizimli Xatolar](#2-brian-tracy-21-tamoyili-raqamlari-va-joylashuvidagi-tizimli-xatolar)
3. [Arxitektura va AGENTS.md / DESIGN.md Qoidalari Buzilishi](#3-arxitektura-va-agentsmd--designmd-qoidalari-buzilishi)
4. [Biznes-Mantiq va Hisob-Kitob Xatolari (Logic & Calculation Bugs)](#4-biznes-mantiq-va-hisob-kitob-xatolari)
5. [UI/UX va Mobil Interfeys Kamchiliklari](#5-uiux-va-mobil-interfeys-kamchiliklari)
6. [Kod Sifati, Eskirgan API'lar va TypeScript Ogohlantirishlari](#6-kod-sifati-eskirgan-apilar-va-typescript-ogohlantirishlari)
7. [Tavsiya Etiladigan Tuzatishlar Yo'l Xaritasi (Roadmap)](#7-tavsiya-etiladigan-tuzatishlar-yol-xaritasi)

---

## 1. Kritik Ishga Tushish va Test Qulashi Muammolari

### 1.1. `node_modules` Mavjud Emas va Paketlar O'rnatilmagan
- **Joylashuvi:** Loyiha ildizi (`c:\focus21\node_modules` yo'q)
- **Muammo:** Loyihada `npm install` qilinmagan. Natijada foydalanuvchi `npm start` yoki `expo start` qilganda:
  ```
  'expo' is not recognized as an internal or external command, operable program or batch file.
  ```
  `npm test` ishga tushirilganda esa `react` topilmasdan 3 ta asosiy test suite qulamoqda:
  ```
  Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'react' imported from C:\focus21\src\services\i18n.ts
  ✖ tests\e2e-readiness.test.ts
  ✖ tests\i18n.test.ts
  ✖ tests\store.test.ts (settingsStore)
  ```
- **Xavf darajasi:** 🔴 KRITIK (Loyiha umuman ishga tushmaydi).

### 1.2. `package.json` da `"type": "module"` Ziddiyati
- **Joylashuvi:** [package.json:12](file:///c:/focus21/package.json#L12)
- **Muammo:** `"type": "module"` Expo va Metro Bundler muhitida CommonJS / ESM to'qnashuvlarini keltirib chiqaradi. Metro `metro.config.js` yoki Expo `AppEntry.js` fayllarini o'qiyotganda `ERR_UNKNOWN_FILE_EXTENSION` yoki `module is not defined in ES module scope` xatolarini beradi.
- **Xavf darajasi:** 🔴 KRITIK.

### 1.3. Importlarda To'g'ridan-to'g'ri Fayl Kengaytmalari (`.ts` / `.tsx`) Ko'rsatilgan
- **Joylashuvi:** Deyarli barcha fayllarda, jumladan:
  - [App.tsx:6-12](file:///c:/focus21/App.tsx#L6-L12)
  - [FocusScreen.tsx:3-15](file:///c:/focus21/src/modules/focus/FocusScreen.tsx#L3-L15)
  - [PlannerScreen.tsx:3-11](file:///c:/focus21/src/modules/planner/PlannerScreen.tsx#L3-L11)
  - [RootNavigator.tsx:4-14](file:///c:/focus21/src/navigation/RootNavigator.tsx#L4-L14)
- **Muammo:** Masalan `import { THEME } from './src/constants/theme.ts'`. Garchi `tsconfig.json` da `"allowImportingTsExtensions": true` yoqilgan bo'lsa-da, React Native Metro Bundler runtime vaqtida `.ts`/`.tsx` kengaytmasini ko'rsa `Unable to resolve module ...` xatosi bilan qulaydi. React Native da importlar kengaytmasiz yozilishi shart (`./src/constants/theme`).
- **Xavf darajasi:** 🔴 KRITIK.

### 1.4. ESM Import Attributes Sintaksisi (`with { type: 'json' }`)
- **Joylashuvi:** [src/services/i18n.ts:7-9](file:///c:/focus21/src/services/i18n.ts#L7-L9)
  ```ts
  import uz from '../locales/uz.json' with { type: 'json' };
  import ru from '../locales/ru.json' with { type: 'json' };
  import en from '../locales/en.json' with { type: 'json' };
  ```
- **Muammo:** `with { type: 'json' }` — bu Node 22+ ning eksperimental import attribute sintaksisi bo'lib, React Native ning Babel / Hermes / Metro parserlari buni tushunmaydi va `SyntaxError: Unexpected token with` beradi.
- **Xavf darajasi:** 🔴 KRITIK.

---

## 2. Brian Tracy 21 Tamoyili Raqamlari va Joylashuvidagi Tizimli Xatolar

Loyiha hujjatlaridagi [21.txt](file:///c:/focus21/21.txt) va markaziy ro'yxat [src/constants/principles.ts](file:///c:/focus21/src/constants/principles.ts) dagi tartib bilan UI komponentlarida hardcode qilingan raqamlar o'rtasida 10 dan ortiq qo'pol tafovut mavjud:

| # | Komponent & Qator | UI dagi Yozuv | Aslida Brian Tracy Tamoyili | Haqiqiy Raqam |
|---|---|---|---|---|
| 1 | [HeroTaskCard.tsx:26](file:///c:/focus21/src/modules/focus/HeroTaskCard.tsx#L26) | `SINGLE HANDLING (#21)` | Single Handling / Concentration | **Principle #5** (21 emas, 21 bu Balance) |
| 2 | [KRACard.tsx:37](file:///c:/focus21/src/modules/goals/KRACard.tsx#L37) | `Principle #14: "Why am I on the payroll?"` | Key Result Areas (KRAs) | **Principle #12** (14 emas, 14 bu Neatness) |
| 3 | [HourlyRateCalculator.tsx:33](file:///c:/focus21/src/modules/audit/HourlyRateCalculator.tsx#L33) | `Principle #12: Annual Income ÷ 2,000 Hours` | Delegation & Hourly Rate | **Principle #9** (12 emas, 12 bu KRAs) |
| 4 | [TRAFInbox.tsx:74](file:///c:/focus21/src/modules/audit/TRAFInbox.tsx#L74) | `Principle #11: Toss, Refer, Action, File` | Neatness & Office Triage | **Principle #14** (11 emas, 11 bu Interruptions) |
| 5 | [TimeLogList.tsx:48](file:///c:/focus21/src/modules/audit/TimeLogList.tsx#L48) | `Principle #6: Track Your Time` | Time Log | **Principle #7** (6 emas, 6 bu Deadlines) |
| 6 | [TimeLogList.tsx:140](file:///c:/focus21/src/modules/audit/TimeLogList.tsx#L140) | `Lombardi Time (Principle #15)` | Punctuality & Attention | **Principle #18** (15 emas, 15 bu Chunks of Time) |
| 7 | [ABCDETaskItem.tsx:160](file:///c:/focus21/src/modules/planner/ABCDETaskItem.tsx#L160) | `SALAMI SLICING (PRINCIPLE #18)` | Work Simplification / Organizing Plans | **Principle #19** yoki **#2** (#18 bu Punctuality) |
| 8 | [WheelOfLifeRadar.tsx:42](file:///c:/focus21/src/modules/balance/WheelOfLifeRadar.tsx#L42) | `Wheel of Life (Principle #19)` | Balance & Quality of Life | **Principle #21** (19 emas, 19 bu Work Simplification) |
| 9 | [SayingNoJournal.tsx:41](file:///c:/focus21/src/modules/balance/SayingNoJournal.tsx#L41) | `Learn to Say NO (Principle #10)` | The Magic Word "No" | **Principle #20** (10 emas, 10 bu Meetings) |
| 10 | [ParetoSummary.tsx:30](file:///c:/focus21/src/modules/planner/ParetoSummary.tsx#L30) | `PARETO 80/20 PRINCIPLE (#3)` | Priorities (80/20 Rule) | **Principle #4** (#3 bu Analysis / Written List) |
| 11 | [GoldenQuestionsModal.tsx:62](file:///c:/focus21/src/modules/goals/GoldenQuestionsModal.tsx#L62) | `Brian Tracy Principle #4: Instant Clarifiers` | Goals & Written Direction | **Principle #1** (#4 bu Priorities) |
| 12 | [GoalsScreen.tsx:62](file:///c:/focus21/src/modules/goals/GoalsScreen.tsx#L62) | Subtitle: `Principles #2, #4 & #14` | Goals ekranida #1 va #12 mavjud | Chalkash subtitle |
| 13 | [PlannerScreen.tsx:87](file:///c:/focus21/src/modules/planner/PlannerScreen.tsx#L87) | Subtitle: `Principles #1, #3 & #5` | Plannerda #2, #3, #4, #13 bor | Chalkash subtitle (#1 Goalsda, #5 Focusda) |
| 14 | [AuditScreen.tsx:46](file:///c:/focus21/src/modules/audit/AuditScreen.tsx#L46) | Subtitle: `Principles #6, #11, #12 & #15` | Auditda #7, #9, #14, #18 bor | Chalkash subtitle |
| 15 | [BalanceScreen.tsx:44](file:///c:/focus21/src/modules/balance/BalanceScreen.tsx#L44) | Subtitle: `Principles #10, #19 & #20` | Balance da #20 va #21 bor | Chalkash subtitle (#10 Meetings, #19 Simplification) |

---

## 3. Arxitektura va AGENTS.md / DESIGN.md Qoidalari Buzilishi

### 3.1. AGENTS.md va DESIGN.md O'rtasidagi Asosiy Dizayn Ziddiyati
- [AGENTS.md:52-54](file:///c:/focus21/AGENTS.md#L52-L54) da qat'iy talab qilingan:
  > *"Faqat Auros Dark palitrasi (`#012624` Liquid Abyss, `#003734` Liquid Kelp, bioluminessent gradientlar va Matter tipografiyasi) qo'llaniladi."*
- Biroq [DESIGN.md:9-12](file:///c:/focus21/DESIGN.md#L9-L12) da butunlay boshqa palitra tanlangan:
  > *"Obsidian Executive: Strict Dark (`#0D0E11` deep matte obsidian), Card Surface (`#16181D`), Primary Accent Amber Gold (`#E5A93C`), Emerald Sage (`#10B981`)"*
- Loyiha kodlari hozirda `DESIGN.md` (Obsidian) bo'yicha yozilgan, ammo `AGENTS.md` (Auros Dark) qoidasi bilan 100% ziddiyatda.

### 3.2. Qattiq Hardcode Qilingan Ranglar (No Hardcoding Qoidasi Buzilgan)
[AGENTS.md:14-18](file:///c:/focus21/AGENTS.md#L14-L18) qoidasiga ko'ra ranglar faqat `THEME` tokenlari orqali boshqarilishi shart. Amalda esa barcha komponentlarda bevosita hex ranglar yozib ketilgan:
- `#261F10` — [FocusScreen.tsx:163](file:///c:/focus21/src/modules/focus/FocusScreen.tsx#L163), [PlannerScreen.tsx:225](file:///c:/focus21/src/modules/planner/PlannerScreen.tsx#L225), [HourlyRateCalculator.tsx:149](file:///c:/focus21/src/modules/audit/HourlyRateCalculator.tsx#L149), [TRAFInbox.tsx:49](file:///c:/focus21/src/modules/audit/TRAFInbox.tsx#L49)
- `#1E222A` — [ExecutiveButton.tsx:114](file:///c:/focus21/src/components/common/ExecutiveButton.tsx#L114), [SphereCard.tsx:153](file:///c:/focus21/src/modules/goals/SphereCard.tsx#L153), [TimeLogList.tsx:218](file:///c:/focus21/src/modules/audit/TimeLogList.tsx#L218)
- `#111317` — [SettingsModal.tsx:274](file:///c:/focus21/src/components/SettingsModal.tsx#L274), [GoldenQuestionsModal.tsx:205](file:///c:/focus21/src/modules/goals/GoldenQuestionsModal.tsx#L205), [WheelOfLifeRadar.tsx:162](file:///c:/focus21/src/modules/balance/WheelOfLifeRadar.tsx#L162)
- `#1B1E26`, `#14223A`, `#2A1010`, `#2B1A0A`, `#2A1018`, `#F43F5E`, `#60A5FA` — [ABCDETaskItem.tsx](file:///c:/focus21/src/modules/planner/ABCDETaskItem.tsx), [FamilyTimeTracker.tsx](file:///c:/focus21/src/modules/balance/FamilyTimeTracker.tsx), [Badge.tsx](file:///c:/focus21/src/components/common/Badge.tsx).
Har qanday mavzuni o'zgartirish yoki tokenlashtirish imkonsiz holatda.

### 3.3. Qattiq Hardcode Qilingan Matnlar (i18n Qoidasi Buzilgan)
Lokalizatsiya tizimi mavjud bo'lishiga qaramay, qator joylarda matnlar to'g'ridan-to'g'ri raw string sifatida qoldirilgan:
- [ExecutiveSplashScreen.tsx:69-76](file:///c:/focus21/src/components/common/ExecutiveSplashScreen.tsx#L69-L76): `"FOCUS 21"`, `"EXECUTIVE OS"`, `"Brian Tracy 21 Principles"`, `"HIGH-PERFORMANCE TIME MANAGEMENT"`.
- [SettingsModal.tsx:201-204](file:///c:/focus21/src/components/SettingsModal.tsx#L201-L204): `"Obsidian Executive OS"`, `"Built strictly according to Brian Tracy's 21 Time Management Principles. 100% offline, zero emojis, pure focus."`.
- [DailyPrincipleCard.tsx:89](file:///c:/focus21/src/components/common/DailyPrincipleCard.tsx#L89): `"Brian Tracy 21 Principles"`.
- [WheelOfLifeRadar.tsx:21-26](file:///c:/focus21/src/modules/balance/WheelOfLifeRadar.tsx#L21-L26): Ustun nomlari (`"Family"`, `"Career"`, `"Health"`, `"Finance"`, `"Growth"`, `"Rest"`) tarjima kalitlarisiz to'g'ridan-to'g'ri inglizcha hardcode qilingan.

### 3.4. Zustand O'rnatilgan, Ammo Ishlatilmagan (Arxitektura Anomaliyasi)
- `package.json` da `"zustand": "^4.5.2"` ko'rsatilgan.
- Biroq barcha do'konlar ([focusStore.ts](file:///c:/focus21/src/store/focusStore.ts), [plannerStore.ts](file:///c:/focus21/src/store/plannerStore.ts), [goalsStore.ts](file:///c:/focus21/src/store/goalsStore.ts), [auditStore.ts](file:///c:/focus21/src/store/auditStore.ts), [balanceStore.ts](file:///c:/focus21/src/store/balanceStore.ts), [settingsStore.ts](file:///c:/focus21/src/store/settingsStore.ts)) qo'lda yozilgan `class FocusStore { ... }` orqali yaratilgan.
- Oqibatda, `usePlannerStore` yoki `useFocusStore` nomiga qaramay, React hook emas, oddiy singleton obyekt hisoblanadi. Komponentlar reaktiv yangilanishi uchun har bir komponentda qo'lda `useState` va `useEffect(() => store.subscribe(...))` yozishga majbur bo'lingan.

### 3.5. Offline-First Qoidasi To'liq Bajarilmagan (Persistence Yo'q)
- `package.json` da `@react-native-async-storage/async-storage` mavjud.
- Ammo bitta ham store'da ma'lumotlar xotiraga (AsyncStorage) saqlanmaydi! Ilova yopilib qayta ochilganda, foydalanuvchining barcha kiritgan vazifalari, maqsadlari, auditi va sozlamalari butunlay yo'qoladi.

---

## 4. Biznes-Mantiq va Hisob-Kitob Xatolari

### 4.1. Taymerning Fonga O'tib Qaytishdagi Qayta Sakrashi (Reset Bug)
- **Joylashuvi:** [src/modules/focus/useFocusTimer.ts:34-40](file:///c:/focus21/src/modules/focus/useFocusTimer.ts#L34-L40)
  ```ts
  if (nextAppState === 'active' && storeState.isRunning && storeState.startedAtTimestamp) {
    const elapsedSec = Math.floor((Date.now() - storeState.startedAtTimestamp) / 1000);
    if (elapsedSec > 0) {
      const expectedRemaining = Math.max(0, storeState.totalSeconds - elapsedSec);
      useFocusStore.setState({ remainingSeconds: expectedRemaining });
    }
  }
  ```
- **Muammo:** `storeState.totalSeconds - elapsedSec` formulasi noto'g'ri! Agar taymer masalan 40 daqiqa ishlagandan keyin to'xtatilib (pause), yana ishga tushirilgan bo'lsa va ilova fonga (background) o'tsa: ilova qayta ochilganda `totalSeconds` (90 min) dan so'nggi bir necha soniya ayirilib, taymer yana 89 minutga sakrab qaytib ketadi! Qolgan vaqt (`remainingSeconds`) inobatga olinmagan.
- **Xavf darajasi:** 🔴 YUQORI.

### 4.2. Backup Qayta Tiklashda Ma'lumotlarning Yo'qotilishi (Data Loss)
- **Joylashuvi:** [src/services/backup.ts:63-95](file:///c:/focus21/src/services/backup.ts#L63-L95)
- **Muammo:** `exportAllData()` funksiyasida `balance` ma'lumotlari (`wheelScores`, `familyMinutesToday`, `refusals`) va `audit.timeLogs` JSON fayliga to'liq eksport qilinadi. Biroq `importAllData()` funksiyasida `balance` va `timeLogs` ni qayta tiklash mantiqi umuman yozilmagan (tashlab ketilgan)!
- **Xavf darajasi:** 🔴 YUQORI (Foydalanuvchi zaxira nusxasini tiklaganda ma'lumotlar tiklanmaydi).

### 4.3. Pareto 80/20 Hisoblash Algoritmidagi Mantiqiy Xato
- **Joylashuvi:** [src/store/plannerStore.ts:70-76](file:///c:/focus21/src/store/plannerStore.ts#L70-L76)
  ```ts
  getParetoTasks: () => {
    const allTasks = [...this.state.tasks].sort(this.sortTasks);
    if (allTasks.length === 0) return [];
    const count = Math.max(1, Math.ceil(allTasks.length * 0.2));
    return allTasks.slice(0, count);
  }
  ```
- **Muammo:** Bajarilgan (`task.completed === true`) topshiriqlar filtrlanmagan! Agar eng yuqori 2 ta A topshiriq bajarilsa, Pareto doimo o'sha bajarilgan topshiriqlarni ko'rsataveradi. Navbatdagi bajarilishi kerak bo'lgan vazifalar Pareto hisobiga kirmay qoladi.

### 4.4. FocusScreen da Vazifa Yakunlanganda Bo'sh Qolib Ketish
- **Joylashuvi:** [src/modules/focus/FocusScreen.tsx:61-67](file:///c:/focus21/src/modules/focus/FocusScreen.tsx#L61-L67)
- **Muammo:** Foydalanuvchi "Mark Finished" qilganda `activeTask` null qilinadi. Lekin Plannerdagi navbatdagi eng muhim topshiriqni avtomatik ravishda yangi A-1 qilib tanlash mantiqi ishlamaydi, chunki tanlash faqat boshlang'ich mountdagi `useEffect` ga bog'langan.

---

## 5. UI/UX va Mobil Interfeys Kamchiliklari

### 5.1. Soxta Nusxalash Illyuziyasi (Clipboard Copy Illusion)
- **Joylashuvi:** [src/components/SettingsModal.tsx:40-45](file:///c:/focus21/src/components/SettingsModal.tsx#L40-L45)
- **Muammo:**
  ```ts
  const handleExport = () => {
    const json = exportAllData();
    setImportText(json);
    setShowImportBox(true);
    setBackupCopied(true);
  };
  ```
  Foydalanuvchi "Export" tugmasini bosganda, tizim `setBackupCopied(true)` qiladi, ammo qurilmaning buferiga (`Clipboard`) hech narsa ko'chirilmaydi! `expo-clipboard` chaqirilmagan. Foydalanuvchi boshqa joyga paste qilmoqchi bo'lganda bo'sh qoladi.

### 5.2. Modallarda `KeyboardAvoidingView` Yo'qligi (Klaviatura To'sib Qo'yishi)
- **Joylashuvi:**
  - [SelectA1TaskModal.tsx](file:///c:/focus21/src/modules/focus/SelectA1TaskModal.tsx)
  - [EveningRitualModal.tsx](file:///c:/focus21/src/modules/planner/EveningRitualModal.tsx)
  - [GoldenQuestionsModal.tsx](file:///c:/focus21/src/modules/goals/GoldenQuestionsModal.tsx)
  - [SettingsModal.tsx](file:///c:/focus21/src/components/SettingsModal.tsx)
- **Muammo:** Foydalanuvchi `TextInput` ga bosib klaviaturani ochganda, pastki kiritish maydonlari va "Saqlash" / "Bajarildi" tugmalari klaviatura ostida ko'rinmay qoladi.

### 5.3. TimerRing Progress Indikatorining Mavjud Emasligi (DESIGN.md ga Zid)
- **Joylashuvi:** [src/modules/focus/TimerRing.tsx:21-22](file:///c:/focus21/src/modules/focus/TimerRing.tsx#L21-L22)
- **Muammo:** [DESIGN.md:60-63](file:///c:/focus21/DESIGN.md#L60-L63) da *"Markazda nozik aylanma progress indikatori... vaqt o'tishi bilan silliq kamayadi"* deb belgilangan. Amalda esa SVG aylanma progressi yo'q, oddiy statik ramkali View doirasi chizilgan. Vaqt o'tishi bilan kamayuvchi progress halqasi yo'q.

### 5.4. WheelOfLifeRadar Radar Emas
- **Joylashuvi:** [src/modules/balance/WheelOfLifeRadar.tsx](file:///c:/focus21/src/modules/balance/WheelOfLifeRadar.tsx)
- **Muammo:** Komponent nomi va konsepsiyasi "Radar" (o'rgimchak to'ri diagrammasi) deb atalgan, biroq ekranda 6 ta oddiy to'rtburchak kartochka va progress chiziqchalari joylashtirilgan.

### 5.5. TabBar Belgisining `focused` Holati E'tiborsiz Qoldirilgan
- **Joylashuvi:** [src/navigation/navConfig.ts:22-37](file:///c:/focus21/src/navigation/navConfig.ts#L22-L37)
- **Muammo:** `getTabIconName(route: string, focused: boolean)` funksiyasida `focused` parametri qabul qilingan, ammo funksiya ichida umuman ishlatilmagan. Tab faol yoki nofaol bo'lishidan qat'i nazar bir xil belgi qaytadi.

---

## 6. Kod Sifati, Eskirgan API'lar va TypeScript Ogohlantirishlari

### 6.1. Eskirgan `String.prototype.substr()` Metodi
- **Joylashuvi:**
  - [src/store/goalsStore.ts:61](file:///c:/focus21/src/store/goalsStore.ts#L61)
  - [src/store/auditStore.ts:66](file:///c:/focus21/src/store/auditStore.ts#L66)
  - [src/modules/planner/PlannerScreen.tsx:34](file:///c:/focus21/src/modules/planner/PlannerScreen.tsx#L34)
  - [src/modules/focus/SelectA1TaskModal.tsx:67](file:///c:/focus21/src/modules/focus/SelectA1TaskModal.tsx#L67)
- **Muammo:** `Math.random().toString(36).substr(2, 4)` da ishlatilgan `substr()` JavaScript spetsifikatsiyasida eskirgan (deprecated). O'rniga `slice(2, 6)` yoki `substring()` ishlatilishi lozim.

### 6.2. `DailyPrincipleCard.tsx` da Noto'g'ri Tipografik Hajm
- **Joylashuvi:** [src/components/common/DailyPrincipleCard.tsx:195](file:///c:/focus21/src/components/common/DailyPrincipleCard.tsx#L195)
- **Muammo:** `fontSize: 12.5` yozilgan. React Native da kasr sonli shrift o'lchamlari turli ekran piksellari (DPI) da noaniq yoki xira render bo'lishiga olib keladi (butun son: `12` yoki `13` bo'lishi kerak).

### 6.3. `HourlyRateCalculator.tsx` da Butun Son Bo'lmagan Qiymatlarni Noto'g'ri Yaxlitlash
- **Joylashuvi:** [src/store/auditStore.ts:99, 104](file:///c:/focus21/src/store/auditStore.ts#L99)
- **Muammo:** `Math.round(amount / 2000)` faqat butun soatlik qiymat hosil qiladi. Masalan $45,000 daromad uchun $22.5 o'rniga $23 chiqaradi.

---

## 7. Tavsiya Etiladigan Tuzatishlar Yo'l Xaritasi (Roadmap)

Kelgusida kodni to'g'rilashga ruxsat berilganda quyidagi tartibda amalga oshirish tavsiya etiladi:

1. **Paketlar va Muhit (Environment & Bundler):**
   - `node_modules` ni `npm install` orqali tiklash.
   - `package.json` dan `"type": "module"` ni olib tashlash.
   - Importlardagi `.ts` va `.tsx` kengaytmalarini tozalash.
   - `i18n.ts` dagi `with { type: 'json' }` sintaksisini standart JSON importga o'tkazish.

2. **Brian Tracy 21 Tamoyili Integratsiyasi:**
   - 10 ta komponentdagi noto'g'ri tamoyil raqamlari va hardcode matnlarni [principles.ts](file:///c:/focus21/src/constants/principles.ts) va i18n kalitlari bilan to'liq moslashtirish.

3. **Mantiq va Do'konlar (Stores & Persistence):**
   - `useFocusTimer.ts` dagi fondan qaytgandagi sakrash formulasini to'g'rilash.
   - `backup.ts` dagi `importAllData` ga Balance va TimeLog tiklanishini qo'shish.
   - Store'larga `AsyncStorage` persistence qo'shish.
   - `plannerStore` dagi `getParetoTasks` ga `!task.completed` filtrini kiritish.

4. **UI va Dizayn Tizimi (Anti-Slop):**
   - Barcha bevosita hex ranglarni `THEME` tokenlariga ko'chirish.
   - Modallarga `KeyboardAvoidingView` qo'shish.
   - `TimerRing` ga SVG asosidagi haqiqiy aylanma kamayish progress indikatorini qo'shish.
   - Clipboard nusxalashni real ishlaydigan qilish.

---
*Hisobot to'liq yakunlandi. Hech qanday loyiha kodi o'zgartirilmadi.*
