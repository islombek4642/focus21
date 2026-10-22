# Brian Tracy 21 Principles — Executive OS (Android)
## Design Document

> **Status:** Draft  
> **Date:** 2026-10-22  
> **Platform:** Android (React Native + Expo, TypeScript)  
> **Design Theme:** Auros Dark Abyssal Executive ([DESIGN.md](file:///d:/nomsiz%20loyiha/DESIGN.md))  
> **Storage:** 100% Offline-First Local Storage (Zustand + AsyncStorage / SQLite)

---

## 1. Intent & The Why

Brian Tracy tomonidan taqdim etilgan 21 ta Time Management qoidasi shunchaki "vazifalar ro'yxati" emas, balki shaxsiy intizom, diqqatni jamlash, o'z qadrini bilish va yuqori natijalarga erishishning mukammal tizimidir.

Bugungi kunda mavjud bo'lgan ko'pgina to-do va mahsuldorlik ilovalari quyidagi sabablarga ko'ra samarasiz:
1. Ular faqat vazifalar sonini oshirishga undaydi, lekin qaysi vazifa kelajakka eng katta ta'sir ko'rsatishini (Pareto 80/20 va Futurity) tahlil qilmaydi.
2. Ular insonni bitta ishga diqqatni to'liq jamlashga (Single Handling va Chunks of Time) majburlamaydi.
3. Ular ish bilan oilaviy hayot va salomatlik muvozanatini (Life Balance) hisobga olmaydi.

**Ushbu loyihaning maqsadi:**  
Brian Tracy'ning 21 ta qonun-qoidasini o'zida mujassamlashtirgan, ish stoli va kundalik hayotda eng yuqori darajadagi intizomni ushlab turuvchi, premium va monoxrom estetikaga ega **Executive Android App** yaratish.

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals:
- Brian Tracy'ning ma'ruzasidagi barcha 21 qonun-qoidani 5 ta mantiqiy tabga qat'iy va tushunarli tarzda taqsimlash.
- **Focus:** 60–90 daqiqalik chuqur ishlash taymeri (*Chunks of Time*), har bir chalg'ish xavfida "Do It Now!" vibratsiyasi va audio eslatmasi.
- **Goals:** 3 ta soha (Oila/Shaxsiy, Karyera/Moliya, Rivojlanish) bo'yicha 1–5 yillik yozma maqsadlar va 3 ta oltin savol.
- **Planner:** Kechki rejalashtirish rejimi (*Evening Ritual*), ABCDE (A1, A2, A3) ustuvorlik tartibi va 80/20 Pareto filtri.
- **Audit:** Daqiqabay Time Log, TRAF saralash qutisi (Toss, Refer, Action, File) va soatlik ish haqi stavkasi asosidagi delegatsiya kalkulyatori.
- **Balance:** Wheel of Life (Hayot g'ildiragi radari), har kungi oila/yaqinlar vaqti va "Yo'q" deyish (*Saying No*) jurnali.
- 100% Offline-first maxfiylik va 0ms kechikish bilan ishlash.
- JSON formatida zaxira nusxasini eksport va import qilish.

### Non-Goals:
- Jamoaviy boshqaruv, korporativ chatlar yoki Jira/Trello integratsiyalari (bu shaxsiy executive vosita).
- Foydalanuvchidan majburiy ro'yxatdan o'tish yoki doimiy internet ulanishini talab qilish.

### Anti-Goals:
- **Zero AI Slop & No Emojis:** Bema'ni rang-barang multik ikonkalari, stikerlar va har qanday smaylik/emoji'lar mutlaqo taqiqlanadi. Faqat maxsus professional vektorli ikonka kutubxonalari (`@expo/vector-icons`, `lucide-react-native`, `feather`) va [DESIGN.md](file:///d:/nomsiz%20loyiha/DESIGN.md) faylida belgilanganidek chuqur qorong'u, jiddiy, professional terminal estetikasi qo'llaniladi.
- Foydalanuvchini har 5 daqiqada bezovta qiladigan spam bildirishnomalar yo'q.

---

## 3. Architecture & 5-Tab Mapping (All 21 Principles)

| Tab | Qoidalar | Asosiy Vazifasi va Imkoniyatlari |
|---|---|---|
| **1. Focus** | #5 Concentration (Single Handling)<br>#6 Deadlines & Rewards<br>#8 Procrastination ("Do It Now!")<br>#11 Interruptions<br>#15 Chunks of Time<br>#17 Telephone | **Bugungi A-1 Vazifa kartochkasi.** 60–90 min chuqur ishlash taymeri. Bitta vazifani 100% tugatmaguncha boshqasiga o'tmaslik intizomi. "Do It Now!" haptik bosimi. Vazifa yakunlanganda kichik mukofot bildirishnomasi. |
| **2. Goals** | #1 Goals (Written & Specific)<br>#1 (3 Golden Questions)<br>#12 Key Result Areas (KRA)<br>#19 Work Simplification | **1–5 yillik maqsadlar xaritasi.** 3 ta yo'nalish: Oila/Shaxsiy, Karyera/Moliya, Rivojlanish. 3 ta oltin savol: $1M yutsa nima qiladi? 6 oy umr qolsa kim bilan o'tkazadi? Mag'lubiyatsiz buyuk orzu nima? KRA ("Why am I on the payroll?"). |
| **3. Planner** | #2 Organized Plans of Action<br>#3 Analysis (Written List)<br>#4 Priorities (Pareto 80/20)<br>#8 Salami Slicing<br>#13 Batching Tasks | **ABCDE Rejalashtiruvchi.** Kechki rejalashtirish rejimi (ong osti kechasi ishlashi uchun). Vazifalarni A1, A2, A3 qilib saralash. 80/20 Pareto filtri orqali 2 ta eng muhim ishni ajratish. Katta ishlarni tilimlarga bo'lish (Salami slicing). O'xshash vazifalarni to'plash (Batching). |
| **4. Audit** | #7 Time Log (Tracking minutes)<br>#9 Delegation (Hourly rate)<br>#10 Meetings (Agenda & Cost)<br>#14 Neatness (TRAF System)<br>#18 Punctuality (Lombardi Time) | **Vaqt va Resurslar Taftishi.** Daqiqabay Time Log. Shaxsiy soatlik stavka kalkulyatori ($50k/yil = $25/soat; arzon ishlarni delegatsiya qilish). TRAF filtri: Toss, Refer, Action, File. Lombardi Time: Uchrashuvlarga 15 daqiqa oldin borish eslatmasi. |
| **5. Balance** | #20 Saying "No"<br>#21 Balance (Wheel of Life) | **Hayot Muvozanati.** Wheel of Life (Ish, Salomatlik, Yaqinlar bilan munosabatlar). Har kungi oila va farzandlar bilan suhbat hisoblagichi. "Yo'q deyish" jurnali (keraksiz majburiyatlarni xushmuomalalik bilan rad etish). |

---

## 4. Visual Design Language (Obsidian Executive System)

[DESIGN.md](file:///d:/nomsiz%20loyiha/DESIGN.md) faylida `ui-taste` orqali 0 dan yaratilgan yangi tizimga 100% asoslanadi:

- **Canvas Background:** `--color-canvas` (`#0D0E11`) — Chuqur mat qora, chalg'itmaydigan shaxsiy ish joyi.
- **Card Surface:** `--color-surface` (`#16181D`) — To'q grafit kartochka panellari, nozik 1px chegara (`rgba(255,255,255,0.08)`) bilan.
- **Primary Accent:** `--color-accent` (`#E5A93C`) — Amber Gold (Chunks taymer aylanmasi va "DO IT NOW" asosiy pill tugmasi).
- **Status & Pareto:** `--color-success` (`#10B981`) — Pareto 80/20 nishonlari va yakunlangan ishlar ko'rsatkichi.
- **Text:** Pure White (`#FFFFFF`) sarlavhalar va hisoblagichlar uchun; Muted Silver (`#8F94A0`) ikkilamchi matnlar uchun.
- **No Emojis:** 0 ta emoji, faqat yupqa (1.5px) vektorli piktogrammalar (`@expo/vector-icons`).

---

## 5. Technology Stack & Implementation Details

- **Framework:** React Native + Expo (TypeScript).
- **Architecture:** Modular Architecture (Domain-driven modules: `focus`, `goals`, `planner`, `audit`, `balance`).
- **Engineering Principles:**
  - **No Hardcoding:** Barcha sonlar, taymer parametrlari va marshrutlar `constants/` papkasida aniqlanadi.
  - **Multi-language (i18n):** O'zbek (`uz`), Rus (`ru`) va Ingliz (`en`) tillari alohida `locales/` JSON fayllarida.
  - **Separation of Concerns (SoC):** UI (Presentation), Hooks (Business Logic), Store (State) va Locales/Constants qat'iy ajratilgan.
  - **DRY:** Umumiy komponentlar va yordamchi funksiyalar `components/common/` va `utils/` papkalarida.
- **Navigation:** `@react-navigation/bottom-tabs` (5 ta tab: Focus, Goals, Planner, Audit, Balance).
- **State Management:** `zustand` (yengil, tezkor, oson sinov qilinadigan).
- **Persistence:** `@react-native-async-storage/async-storage` (100% offline, xavfsiz).
- **Haptics & Sound:** `expo-haptics` va `expo-av` ("Do It Now!" va Chunks taymeri signallari).
- **Icons:** `@expo/vector-icons` (Feather / Ionicons — minimalist va nozik chiziqlar).
- **Export/Import:** JSON fayl shaklida barcha ma'lumotlarni zaxiralash (`expo-file-system`, `expo-sharing`).

---

## 6. Verification & Quality Gates

1. **21 Principles Coverage:** Har bir tabdagi qoidalar [21.txt](file:///d:/nomsiz%20loyiha/21.txt) va [transcript.txt](file:///d:/nomsiz%20loyiha/transcript.txt) bilan to'liq solishtiriladi.
2. **Offline Integrity:** Internet o'chirilgan holatda barcha 5 ta tab va saqlash funksiyalari to'liq ishlashi shart.
3. **Design Taste Gate:** UI [DESIGN.md](file:///d:/nomsiz%20loyiha/DESIGN.md) tokenlariga to'liq mos kelishi, shablon AI ko'rinishidan holi bo'lishi kerak.
