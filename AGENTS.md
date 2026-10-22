# Agent Rules & Engineering Standards

Ushbu qoidalar har qanday agent uchun **majburiy** hisoblanadi. Kod yozish, yangi funksiya qo'shish yoki loyihani o'zgartirishdan oldin ushbu ko'rsatmalarga 100% amal qilinishi shart.

---

## 1. Modular Architecture (Modulli Arxitektura)
- Loyiha kelajakda kengaytirish (scalability) va oson qo'llab-quvvatlash uchun qat'iy modulli arxitekturada qurilishi kerak.
- Har bir funksional modul (masalan: `focus`, `goals`, `planner`, `audit`, `balance`) o'zining UI komponentlari, mantiqi (hooks/services) va turlariga (types) ega bo'lishi shart.
- Modullar bir-biriga to'g'ridan-to'g'ri qattiq bog'lanmasligi (loose coupling), faqat umumiy store va interfeyslar orqali muloqot qilishi lozim.

---

## 2. No Hardcoding & Constants First (Hardcode Taqiqlanadi)
- Kod ichida ixtiyoriy matnlar, raqamlar, konfiguratsiya qiymatlari yoki ID'larni to'g'ridan-to'g'ri (hardcode) yozish **qat'iyan man etiladi**.
- Barcha o'lchamlar, taymer vaqtlari (masalan, 90 daqiqalik Chunks of Time), rang tokenlari, marshrut nomlari va konfiguratsiyalar markazlashtirilgan `constants/` papkasidagi fayllarda aniqlanadi.
- Math/hisob-kitob koeffitsientlari (masalan, Pareto 80/20 nisbati) alohida nomlangan constant sifatida saqlanadi.

---

## 3. Localization & Multi-language (Ko'p Tillilik — i18n)
- Ilova 3 ta tilda to'laqonli ishlashi shart:
  - 🇺🇿 **O'zbekcha (`uz`)**
  - 🇷🇺 **Русский (`ru`)**
  - 🇬🇧 **English (`en`)**
- Barcha matnlar, sarlavhalar, xabarnomalar va Brian Tracy'ning 21 ta qoidasi har bir til uchun alohida lokalizatsiya fayllariga (`locales/uz.json`, `locales/ru.json`, `locales/en.json`) ajratiladi.
- UI komponentlarida matnlar faqat tarjima kalitlari orqali (masalan: `t('focus.doItNow')`) chaqiriladi. Kod ichida birorta ham ochiq matn (raw string) bo'lishi mumkin emas.

---

## 4. Separation of Concerns — SoC (Mas'uliyatlarni Qat'iy Ajratish)
Har bir qatlam faqat o'z vazifasini bajaradi:
1. **UI Components (Presentational):** Faqat vizual interfeys va foydalanuvchi harakatlarini qabul qiladi. Hech qanday og'ir biznes-mantiq yoki to'g'ridan-to'g'ri saqlash operatsiyalarini o'z ichiga olmaydi.
2. **Business Logic (Hooks / Services):** Barcha hisob-kitoblar, taymer mantiqi, saralash algoritmlari maxsus custom hook yoki servis funksiyalariga olinadi.
3. **State Management (Store):** Zustand / Storage faqat ma'lumotlarni saqlash va yangilashga javob beradi.
4. **Theme & Tokens:** Dizayn qiymatlari faqat [DESIGN.md](file:///d:/nomsiz%20loyiha/DESIGN.md) tokenlari orqali boshqariladi.

---

## 5. DRY — Don't Repeat Yourself (Kodni Takrorlamaslik)
- Bir xil yoki o'xshash mantiq, hisob-kitob yoki UI elementini qayta yozish taqiqlanadi.
- Umumiy tugmalar, kartochkalar, taymer indikatorlari, modallar va formatlovchi funksiyalar (utility functions) `components/common/` yoki `utils/` papkasiga umumiy qilib chiqariladi.

---

## 6. Anti-Slop Visual Quality Gate
- [DESIGN.md](file:///d:/nomsiz%20loyiha/DESIGN.md) talablariga muvofiq, loyihada generik AI shablonlari bo'lmasligi kerak.
- Faqat Auros Dark palitrasi (`#012624` Liquid Abyss, `#003734` Liquid Kelp, bioluminessent gradientlar va Matter tipografiyasi) qo'llaniladi.

---

## 7. No Emojis & Professional Icons Only (Emoji va Stikerlar Qat'iyan Taqiqlanadi)
- Ilovada har qanday **emoji (smayliklar)** yoki stikerlardan foydalanish **qat'iyan man etiladi**.
- Barcha vizual belgilar faqat maxsus professional vektorli ikonka kutubxonalari orqali amalga oshiriladi (masalan: `@expo/vector-icons`, `lucide-react-native`, `feather`, `material-community-icons`).
- Ikonkalar monoxrom, yupqa (stroke-width: 1.5–2px) va Auros dizayn tizimi ranglariga mos bo'lishi shart.
