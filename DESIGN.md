# Focus 21 — Executive Design System
> Professional Anti-Slop Design Language for Brian Tracy 21 Principles Mobile App
> Built from scratch via `ui-taste` (Uizze Image-to-UI specification)

---

## 1. Design Thesis & Identity

- **Name:** Obsidian Executive
- **Authority:** Built 1:1 against the approved mobile UI target image.
- **Theme:** Strict Dark (`#0D0E11` deep matte obsidian).
- **Core Philosophy:** Shaxsiy intizom va vaqt boshqaruvi — bu jiddiy, o'ta aniq va ortiqcha bezaklardan xoli bo'lgan ishchi muhit. Generik AI shablonlari, yorqin neon bezaklar, multik elementlar va smayliklar butunlay yo'q. Har bir piksel va rang ma'lum bir maqsadga (Focus, Single Handling, Pareto 80/20) xizmat qiladi.

---

## 2. Design Tokens — Colors

| Role | Name | Hex Value | Description |
|---|---|---|---|
| **Canvas Background** | Obsidian Matte | `#0D0E11` | Asosiy qora fon. Ko'zni toliqtirmaydi va chuqur diqqatni ta'minlaydi. |
| **Card Surface** | Charcoal Slate | `#16181D` | Vazifalar, taymer va maqsad panellari. Nozik 1px chegara bilan. |
| **Border / Stroke** | Subtle Hairline | `rgba(255, 255, 255, 0.08)` | 1px yupqa ajratuvchi chiziqlar. |
| **Primary Accent** | Amber Gold | `#E5A93C` | Chunks of Time aylanma taymeri va "DO IT NOW" asosiy harakat tugmasi. |
| **Accent Hover/Press** | Amber Deep | `#C98E2A` | Tugma bosilgandagi holat. |
| **Status / Pareto** | Emerald Sage | `#10B981` | 80/20 Pareto indikatori va yakunlangan ishlar. |
| **Status Background** | Emerald Tint | `rgba(16, 185, 129, 0.12)` | Pareto va A-1 nishonlari foni. |
| **Text Primary** | Pure White | `#FFFFFF` | Sarlavhalar, raqamlar va taymer hisoblagichi. |
| **Text Secondary** | Muted Silver | `#8F94A0` | Tavsiflar, ikkinchi darajali vazifalar va vaqt yozuvlari. |
| **Text Tertiary** | Dark Slate | `#555A65` | Bo'lim sarlavhalari teglari (uppercase tracking). |

---

## 3. Typography System

- **Primary Font Family:** System Sans-Serif (`Inter`, `San Francisco Pro`, `Roboto`).
- **Rules:**
  - Katta hisoblagich va taymerlar: `font-weight: 700`, tabular raqamlar (`tabular-nums`).
  - Sarlavhalar: `font-weight: 600`, ozgina manfiy letter-spacing (`-0.02em`).
  - Bo'lim teglari (Labels): `font-size: 11px`, `text-transform: uppercase`, `letter-spacing: 0.08em`, `font-weight: 600`.
  - Body text: `font-size: 14px`, `line-height: 1.4`, `color: #C5C8D0`.

---

## 4. Iconography & Visual Assets

- **Emojis & Stickers:** Qat'iyan taqiqlangan (`0` emoji).
- **Icon Library:** `@expo/vector-icons` (Feather / Ionicons / Lucide).
- **Icon Style:** Yupqa vektor chiziqlar (`stroke-width: 1.5px`), monoxrom (`#8F94A0` nofaol, `#E5A93C` yoki `#FFFFFF` faol).
- **Navigation Tabs:**
  1. `Focus`: `target` / `circle`
  2. `Goals`: `flag` / `compass`
  3. `Planner`: `calendar` / `list`
  4. `Audit`: `bar-chart-2` / `clock`
  5. `Balance`: `scale` / `sliders`

---

## 5. Key UI Components

### 1. 90-Minute Chunks of Time Ring
- Markazda nozik (`stroke-width: 4px`) aylanma progress indikatori.
- Boshlang'ich holat: to'liq Amber Gold `#E5A93C`, vaqt o'tishi bilan silliq kamayadi.
- Ichida katta vaqt raqamlari: `01:24:18` (`font-size: 38px`, `font-weight: 700`).

### 2. "DO IT NOW" Action Pill
- O'lchami: balandligi `48px`, to'liq yumaloqlangan burchaklar (`border-radius: 24px`).
- Foni: `#E5A93C` (Amber Gold), matn qora `#0D0E11` qalin harflar bilan.
- Bosilganda: Native haptik tebranish va taymerni ishga tushirish.

### 3. [A-1] Single Handling Hero Card
- Foni `#16181D`, burchaklari `14px`, nozik chegara.
- Yuqori o'ng burchakda Pareto 80/20 nishoni (`#10B981` yozuvi bilan).
- Katta sarlavha: `[A-1] Asosiy vazifa nomi`.
- Tavsif: `Single Handling: 100% tugatmaguncha to'xtamaslik`.

---

## 6. Layout & Spacing (8pt Grid)

- **Base Grid:** `4px` / `8px` / `16px` / `24px`.
- **Horizontal Screen Padding:** `16px`.
- **Card Padding:** `16px` - `20px`.
- **Gap between elements:** `12px` - `16px`.
