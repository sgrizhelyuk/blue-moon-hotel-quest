# Картинки для игры «Тайна отеля „Голубая луна“» — список и промпты

Версия 0.1. Все промпты на английском (нейросети понимают их лучше). К каждому промпту **спереди добавляй STYLE**, сзади — **NEGATIVE**.

## Общий стиль (добавлять ко всем промптам)

STYLE:
```
2D cartoon adventure game art, cozy detective story mood, clean vector shapes with soft shading, warm golden lamp light against cool blue night palette, storybook atmosphere, detailed but uncluttered, consistent character design across the series, no text
```

NEGATIVE:
```
text, letters, captions, watermark, signature, logo, photorealistic, 3d render, harsh shadows, deformed hands, extra fingers, extra limbs
```

Параметры:
- Фоны локаций: 1920x1080 (16:9), без персонажей (кроме титульного экрана).
- Персонажи: 1024x1024, PNG, прозрачный фон, портрет по пояс (waist-up), по центру.
- Иконки и предметы: 512x512, PNG, прозрачный фон.
- Генерировать в большем разрешении и уменьшать при необходимости.

Советы для консистентности:
- Играться от одного seed и одного style reference для всех картинок.
- Персонажей генерировать как «expression sheet» (сетка 2x2: нейтральное, радостное, обеспокоенное, злое лицо), потом нарезать. Эмоции добавлять через img2img от нейтрального портрета.
- Текст на картинках нейросети пишут с ошибками — все надписи добавлять кодом поверх картинки.
- Палитра для единства: тёмно-синий #1B2A4A, золотой #D9A441, кремовый #F3E9D2, кирпично-красный #A63A3A.

Теги: [MVP] — нужно для первой версии; [опц.] — можно позже.

---

## A. Экраны и элементы интерфейса (UI)

- **UI_title** [MVP] — титульный экран.
  Prompt: `night view of a cozy art-deco hotel facade with a glowing crescent-moon emblem above the entrance, rain, full moon in the sky, warm lit windows, a young detective silhouette with a trench coat walking to the doors, mysterious but inviting`
- **UI_logo_emblem** [MVP] — эмблема игры (для шапки меню).
  Prompt: `round golden detective badge with a crescent moon and a magnifying glass inside, art-deco style, centered emblem on a dark navy background, clean and iconic`
- **UI_case_map** [MVP] — экран выбора глав / «карта дела».
  Prompt: `detective desk top view: city map, photos of suspects, red thread connecting pins, magnifying glass, cup of coffee, open notebook, warm lamp light`
- **UI_dialogue_frame** [MVP] — рамка диалогового окна.
  Prompt: `empty visual novel dialogue box, beige paper texture with subtle grain, rounded corners, thin golden art-deco border, small magnifying glass icon in the corner, empty inner area, UI asset, transparent outside`
- **UI_name_plate** [MVP] — плашка с именем персонажа.
  Prompt: `small empty name plate banner, dark navy with thin golden border, game UI asset, empty center`
- **UI_choice_button** [MVP] — кнопка варианта ответа.
  Prompt: `empty rounded menu button, light beige paper with soft shadow, thin gold border, game UI asset`
- **UI_notebook** [MVP] — экран «Блокнот детектива».
  Prompt: `open detective notebook, two pages, worn leather cover, pinned notes, empty slots for clues and small photos, magnifying glass on the page, warm lamp light`
- **UI_feedback_icons** [MVP] — иконки «верно/неверно».
  Prompt: `set of two game icons: a green round badge with a white check mark and a red round badge with a white cross, glossy cartoon style, transparent background`
- **UI_owl_hint** [MVP] — кнопка подсказки (сова).
  Prompt: `round UI button with a cute cartoon owl detective face, tiny deerstalker hat, big friendly eyes, gold ring around the button, transparent background`
- **UI_magnifier_cursor** [MVP] — курсор-лупа для поиска улик.
  Prompt: `cartoon magnifying glass cursor with a golden handle and a slight shine, game UI asset, transparent background`
- **UI_progress** [MVP] — прогресс глав.
  Prompt: `horizontal game progress bar, art-deco style, five star slots and a small magnifying glass marker, navy and gold, transparent background`
- **UI_buttons_set** [MVP] — набор системных кнопок.
  Prompt: `set of round game UI buttons: house (home), gear (settings), sound on, sound off, question mark (help), back arrow, navy circles with gold icons, cartoon style, transparent background`
- **UI_translate_button** [MVP] — кнопка перевода.
  Prompt: `round UI button with a small globe and a speech bubble icon, navy and gold, cartoon game style, transparent background`
- **UI_badge_case_closed** [MVP] — значок «Дело закрыто».
  Prompt: `golden game achievement badge shaped like a detective shield with a crescent moon and a small ribbon, shiny cartoon style`
- **UI_diploma** [опц.] — диплом в финале.
  Prompt: `vintage detective diploma certificate, ornate gold frame, warm paper texture, empty center for text, small magnifying glass and moon emblems in the corners`

---

## B. Улики и предметы (иконки)

- **OBJ_empty_frame** [MVP] — пустая рама (улика).
  Prompt: `empty golden picture frame hanging on a nail, a torn red woolen thread caught on the nail, slightly tilted, game clue icon, transparent background`
- **OBJ_broken_glass** [MVP] — осколки.
  Prompt: `broken glass shards on a small dark wooden surface, game clue icon, transparent background`
- **OBJ_footprints** [MVP] — мокрые следы.
  Prompt: `two wet muddy footprints on stone floor, game clue icon, transparent background`
- **OBJ_red_thread** [MVP] — красная нитка.
  Prompt: `small red woolen thread snippet curled on a light surface, game clue icon, transparent background`
- **OBJ_hat_box** [MVP] — коробка для шляп.
  Prompt: `large vintage round hat box, dusty pink and cream stripes, lid slightly open with a soft golden glow coming from inside, game clue icon, transparent background`
- **OBJ_painting** [MVP] — картина «Луна над Темзой».
  Prompt: `classic oil painting in an ornate golden frame: full moon over a dark river with a bridge silhouette, moonlit ripples on the water, romantic night scene`
- **OBJ_receipt** [MVP] — чек из магазина специй.
  Prompt: `crumpled paper receipt from a spice shop with a small cinnamon stick next to it, warm light, no readable text, game clue icon, transparent background`
- **OBJ_testimony** [MVP] — иконка «показания».
  Prompt: `speech bubble icon with a small magnifying glass inside, navy and gold, cartoon game icon, transparent background`
- **OBJ_red_coat** [MVP] — красное пальто.
  Prompt: `elegant long red wool coat on a hanger, a small loose thread on the collar, game clue icon, transparent background`
- **OBJ_open_window** [опц.] — открытое окно (дубль для блокнота).
  Prompt: `old hotel window open at night, rain outside, blue night light coming in, game clue icon, transparent background`

---

## C. Фоны локаций

- **BG_prologue** [MVP] — пролог, звонок из Скотленд-Ярда.
  Prompt: `evening office desk at Scotland Yard: an old rotary phone ringing, case files, desk lamp, rain on the window, moody blue tones, no characters`
- **BG_taxi** [MVP] — глава 1, такси.
  Prompt: `view from inside a classic London black cab at night: rain on the windshield, blurred city lights, a red phone booth on the corner, dark leather seats and dashboard, cozy warm interior`
- **BG_hotel_exterior** [MVP] — отель снаружи (титул и переходы).
  Prompt: `art-deco hotel facade at night in the rain, glowing crescent-moon emblem above the entrance, wet street with warm reflections, lit windows, inviting`
- **BG_reception** [MVP] — глава 2, ресепшн.
  Prompt: `cozy hotel reception hall: wooden desk with a brass bell, key rack with keys, small potted plants, warm lamps, art-deco details, no characters`
- **BG_office** [MVP] — глава 3, кабинет владельца.
  Prompt: `hotel owner's office: dark wooden desk, leather armchair, fireplace with gentle fire, bookshelves, an empty spot on the wall where a painting is missing, warm but worried mood, no characters`
- **BG_lobby_crime** [MVP] — глава 4, лобби — место преступления.
  Prompt: `grand art-deco hotel lobby in the evening: empty golden picture frame on the wall, broken glass on the floor, wet muddy footprints leading to an open window, big chandelier, blue night light through the window, no characters`
- **BG_restaurant** [MVP] — глава 5, ресторан.
  Prompt: `cozy hotel restaurant in the evening: small round tables with white cloth, candles, menu stands, big windows with rain, warm golden light, art-deco, no characters`
- **BG_kitchen** [MVP] — глава 5, кухня.
  Prompt: `hotel kitchen: hanging copper pots and herbs, big wooden table with flour, a half-decorated chocolate cake, a red apron on a hook, warm light, light steam, cozy mess, no characters`
- **BG_corridor** [MVP] — глава 6, коридор.
  Prompt: `hotel corridor with doors numbered 310 to 314, dark red carpet with golden pattern, wall sconce lamps, slightly dramatic shadows, art-deco, no characters`
- **BG_luggage_room** [MVP] — глава 7, багажная комната.
  Prompt: `hotel luggage room: old suitcases, stacked round hat boxes, wooden shelves, a dim hanging lamp, dust in the air, mysterious cozy mood, no characters`
- **BG_garden** [MVP] — глава 7, задний сад после дождя.
  Prompt: `hotel back garden at night after rain: wet stone path with footprints, green bushes, a back door with warm light, wooden fence, deep blue night sky, no characters`
- **BG_lobby_happy** [MVP] — глава 8 и финал, лобби утром.
  Prompt: `the same art-deco hotel lobby in the morning: the moon painting is back on the wall, sunlight through tall windows, warm and peaceful mood, no characters`
- **BG_epilogue** [опц.] — эпилог, столик в ресторане.
  Prompt: `restaurant table in the morning light: cups of tea, a chocolate cake with one slice cut, plates, cozy celebration mood, blurred hotel interior behind, no characters`

---

## D. Персонажи (портреты по пояс, PNG, прозрачный фон)

Для каждого: генерировать как expression sheet — 4 эмоции в сетке 2x2 (same character, same design), нейтральная первой.

- **CH_alex** [MVP] — Алекс, игрок. Эмоции: нейтральный, думает, улыбается.
  Prompt: `waist-up portrait of a young detective, 25 years old, short dark hair, light beige trench coat over a sweater, blue scarf, small notebook in hand, friendly smart expression`
- **CH_emma** [MVP] — Эмма, администратор. Эмоции: приветливая, деловая, обеспокоенная.
  Prompt: `waist-up portrait of a friendly hotel receptionist woman, 28 years old, brown hair in a neat bun, navy hotel uniform with golden buttons and a small golden badge, warm smile`
- **CH_grant** [MVP] — мистер Грант, владелец. Эмоции: взволнован, надеется, гордая улыбка.
  Prompt: `waist-up portrait of a hotel owner man, 55 years old, grey hair and a neat grey mustache, burgundy three-piece suit with a pocket watch chain, kind anxious eyes`
- **CH_wilkinson** [MVP] — миссис Уилкинсон. Эмоции: спокойная, раздражённая, удивлённая, виноватая.
  Prompt: `waist-up portrait of an elegant aristocratic lady, 52 years old, silver hair in a perfect updo, long deep red wool coat, pearl necklace, silk scarf, cold calm expression`
- **CH_antonio** [MVP] — Антонио, шеф-повар. Эмоции: радостный, нервный, смеётся.
  Prompt: `waist-up portrait of a cheerful italian chef, 41 years old, black mustache, white chef hat, red apron over a white uniform, a bit of flour on his cheek, big smile`
- **CH_tim** [MVP] — Тим, посыльный. Эмоции: застенчивый, испуганный, облегчение.
  Prompt: `waist-up portrait of a shy teenage hotel bellboy, 16 years old, freckles, navy uniform with golden buttons, holding his cap in both hands, nervous smile`
- **CH_watson_owl** [MVP] — сова Уотсон, маскот и подсказчик. Эмоции: радостная, думает, «объясняет» (в очках).
  Prompt: `cute cartoon owl detective mascot, fluffy brown and cream feathers, tiny deerstalker hat, big round friendly eyes, small magnifying glass under one wing, sitting pose`
- **CH_jones** [опц.] — инспектор Джонс (пролог и эпилог).
  Prompt: `waist-up portrait of a senior police inspector, 50 years old, grey coat and hat, strict but kind face, holding a telephone receiver`
- **CH_dave** [опц.] — водитель такси Дейв (глава 1).
  Prompt: `waist-up portrait of a friendly london taxi driver, 55 years old, flat cap, plaid shirt, rain jacket, warm grin`

---

## E. Сцены-иллюстрации (для катсцен и финала)

- **SC_final_group** [MVP] — финальная сцена «Дело закрыто».
  Prompt: `group illustration in a warm hotel lobby: a young detective, a receptionist, a hotel owner, a chef, a shy bellboy and a cute owl mascot celebrating together, the moon painting back on the wall, warm light, cartoon style`
- **SC_clue_board** [опц.] — катсцена в главе 8 «сборка обвинения».
  Prompt: `detective standing in front of a clue board with pinned photos and notes: red thread, hat box, footprints, suspects, dramatic warm light, cartoon style`
- **SC_chapter_cards** [опц.] — 8 мини-иллюстраций между главами.
  Prompt-шаблон: `chapter card illustration, 2D cartoon style: [scene of the chapter], cinematic composition, no text`

---

## Порядок генерации (рекомендуемый)

1. STYLE-тест: 3–4 фона (taxi, lobby crime, reception) — подобрать seed и стиль.
2. Персонажи-скетчи: alex, emma, wilkinson, antonio, tim, watson — по выражению лиц и стилю.
3. Эмоции персонажей (img2img от нейтральных портретов).
4. UI-набор: рамки, кнопки, иконки, блокнот.
5. Улики-иконки.
6. Остальные фоны и катсцены.
