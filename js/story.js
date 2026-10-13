// The Moonlit Evening Mystery — story data (part 1: prologue..ch4)
// companion files: js/story.js is split in two parts for maintainability.

window.CLUES = {
  footprints: { name: "Wet footprints", ru: "Мокрые следы", img: "assets/OBJ_footprints.png", note: "Size 38, near the window" },
  glass: { name: "Broken glass", ru: "Осколки", img: "assets/OBJ_broken_glass.png", note: "The thief was in a hurry" },
  thread: { name: "Red thread", ru: "Красная нитка", img: "assets/OBJ_red_thread.png", note: "Caught on the frame nail" },
  window: { name: "Open window", ru: "Открытое окно", img: null, note: "It was closed before the storm" },
  receipt: { name: "Spice shop receipt", ru: "Чек из магазина специй", img: "assets/OBJ_receipt.png", note: "22:20 — alibi for Antonio" },
  testimony: { name: "Tim's testimony", ru: "Показания Тима", img: "assets/OBJ_hat_box.png", note: "A woman in a red coat with a hat box" },
  hatbox: { name: "Hat box with the painting", ru: "Коробка с картиной", img: "assets/OBJ_hat_box.png", note: "Found in the luggage room" }
};

window.SUSPECTS = [
  { name: "Mrs. Wilkinson", ru: "Миссис Уилкинсон", img: "assets/CH_wilkinson.png", note: "Guest, room 312. Red coat." },
  { name: "Antonio", ru: "Антонио", img: "assets/CH_antonio.png", note: "Chef. Red apron." },
  { name: "Tim", ru: "Тим", img: "assets/CH_tim.png", note: "Bellboy. Saw something." }
];

window.STORY = {
  scenes: [
    {
      id: "prologue",
      chapter: "Prologue",
      title: "A Call from Scotland Yard",
      objective: "Answer Inspector Jones and go to the Moonlit Evening Hotel.",
      objectiveRu: "Ответь инспектору Джонсу и отправляйся в отель.",
      bg: "assets/BG_prologue.png",
      cast: {},
      items: [
        { t: "Rain hits the window of your office. The phone rings.", ru: "Дождь стучит в окно кабинета. Звонит телефон." },
        { sp: "Alex", t: "Hello?", ru: "Алло?" },
        { sp: "Jones", t: "Alex? It's Inspector Jones.", ru: "Алекс? Это инспектор Джонс.", hint: "Jones is your boss. Listen carefully to his questions." },
        { sp: "Jones", t: "The Moonlit Evening Hotel called us. Someone stole a painting.", ru: "Из отеля «Лунный вечер» позвонили. Кто-то украл картину." },
        { sp: "Alex", t: "Stole? A painting, sir?", ru: "Украл? Картину, сэр?" },
        { sp: "Jones", t: "The \"Moon over the Thames\". It is the owner's family treasure.", ru: "«Луна над Темзой». Это семейная реликвия владельца." },
        { sp: "Alex", t: "When did it happen?", ru: "Когда это случилось?", hint: "Past Simple question: When did + subject + verb?" },
        { sp: "Jones", t: "Tonight. Between 9:45 and 10:15 p.m.", ru: "Сегодня вечером. Между 21:45 и 22:15." },
        { sp: "Alex", t: "And who is on the case, sir?", ru: "И кто ведёт дело, сэр?" },
        { sp: "Jones", t: "You are, Alex. Your first real case. Take a taxi.", ru: "Ты, Алекс. Твоё первое настоящее дело. Возьми такси." },
        {
          prompt: { sp: "Alex", t: "How do you answer your boss?", ru: "Как ты ответишь начальнику?" },
          opts: [
            { t: "Yes, sir. I'm on my way.", ru: "Да, сэр. Я уже в пути.", ok: true, fb: "Polite and professional. Well done!" },
            { t: "I go now to the hotel, sir.", ru: "Я иду сейчас в отель, сэр.", fb: "Grammar: use Present Continuous for an action in progress: I'm on my way. 'I go now' is not English." },
            { t: "Okay, I will be there soon, bye.", ru: "Окей, скоро буду, пока.", fb: "Too casual for your boss. Say: Yes, sir. Thank you." }
          ]
        },
        { sp: "Alex", t: "Yes, sir. I'm on my way.", ru: "Да, сэр. Я уже в пути." },
        { sp: "Jones", t: "Wait. Be careful tonight. The storm is very bad.", ru: "Подожди. Будь осторожен. Гроза очень сильная." },
        { sp: "Alex", t: "I understand, sir. Thank you.", ru: "Я понял, сэр. Спасибо." },
        {
          task: {
            kind: "tf", title: "True or False?", ru: "Верно или неверно?",
            stmts: [
              { t: "Alex must go to the hotel.", ru: "Алекс должен поехать в отель.", a: true },
              { t: "The painting disappeared in the morning.", ru: "Картина исчезла утром.", a: false },
              { t: "It is Alex's first real case.", ru: "Это первое настоящее дело Алекса.", a: true }
            ]
          }
        },
        { vocab: { words: [["steal", "красть"], ["painting", "картина"], ["treasure", "сокровище"], ["happen", "случаться"], ["case", "дело"], ["careful", "осторожный"]] } }
      ]
    },

    {
      id: "ch1",
      chapter: "Chapter 1",
      title: "Taxi: Welcome to London",
      objective: "Talk to the driver. Ask about the strange night.",
      objectiveRu: "Поговори с водителем. Расспроси о странной ночи.",
      bg: "assets/BG_taxi.png",
      cast: { Alex: { img: "assets/CH_alex.png", side: "left" } },
      items: [
        { t: "A classic black cab. Rain on the windows. The city lights float by.", ru: "Классическое чёрное такси. Дождь по стёклам. Городские огни плывут мимо." },
        { sp: "Dave", t: "Evening! Where to?", ru: "Добрый вечер! Куда едем?" },
        { sp: "Alex", t: "To the Moonlit Evening Hotel, please.", ru: "В отель «Лунный вечер», пожалуйста." },
        {
          prompt: { sp: "Dave", t: "First time in London?", ru: "Первый раз в Лондоне?" },
          opts: [
            { t: "Yes, it's my first time.", ru: "Да, это мой первый раз.", ok: true },
            { t: "Yes, my first time it is here in London.", ru: "Да, мой первый раз это здесь в Лондоне.", fb: "Word order matters: 'It is my first time here in London'. No extra 'my first time it is'." },
            { t: "Yes, I am first time in this city.", ru: "Да, я первый раз в этом городе.", fb: "We say 'It is my first time' — not 'I am first time'." }
          ]
        },
        { sp: "Alex", t: "Yes, it's my first time.", ru: "Да, это мой первый раз." },
        { sp: "Dave", t: "Oh, welcome! How was your flight?", ru: "О, добро пожаловать! Как прошёл перелёт?" },
        {
          prompt: { sp: "Alex", t: "You answer:", ru: "Ты отвечаешь:" },
          opts: [
            { t: "It was long but fine.", ru: "Долгий, но нормальный.", ok: true },
            { t: "It is long, but I like it very much.", ru: "Он долгий, но мне очень нравится.", fb: "The flight is finished. Use Past Simple: It was long." },
            { t: "It were long and a little boring.", ru: "Он были долгий и немного скучный.", fb: "With 'it' we use 'was', not 'were'." }
          ]
        },
        { sp: "Alex", t: "It was long but fine.", ru: "Долгий, но нормальный." },
        { sp: "Dave", t: "Strange night yesterday...", ru: "Странная вчера была ночь..." },
        { sp: "Alex", t: "Strange? Why?", ru: "Странная? Почему?" },
        { sp: "Dave", t: "I saw a woman in a hurry. Near the hotel's back door.", ru: "Я видел женщину, она спешила. У задней двери отеля." },
        { sp: "Dave", t: "She had a big box.", ru: "У неё была большая коробка." },
        { sp: "Alex", t: "A big box? What did she look like?", ru: "Большая коробка? Как она выглядела?", hint: "What did she look like? — standard question about appearance." },
        { sp: "Dave", t: "A dark red coat. Long, like autumn leaves.", ru: "Тёмно-красное пальто. Длинное, как осенние листья." },
        { sp: "Alex", t: "What time was that?", ru: "В какое время это было?" },
        { sp: "Dave", t: "About ten. And rain, rain, rain.", ru: "Около десяти. И дождь, дождь, дождь." },
        { sp: "Alex", t: "Thank you, Dave. That's important.", ru: "Спасибо, Дэйв. Это важно." },
        { sp: "Dave", t: "Here we are. The Moonlit Evening. That's £12, please.", ru: "Приехали. «Лунный вечер». С вас 12 фунтов." },
        { sp: "Alex", t: "Here you are.", ru: "Вот, пожалуйста." },
        { sp: "Dave", t: "Thank you. Have a good evening!", ru: "Спасибо. Хорошего вечера!" },
        { sp: "Alex", t: "You too. And thank you for the story.", ru: "И вам. И спасибо за рассказ." },
        {
          task: {
            kind: "order", title: "Put the words in order", ru: "Расставь слова по порядку",
            words: ["flight", "was", "your", "how", "?"],
            answer: "how was your flight ?"
          }
        },
        {
          task: {
            kind: "tf", title: "True or False?", ru: "Верно или неверно?",
            stmts: [
              { t: "Dave saw a woman with a big box.", ru: "Дэйв видел женщину с большой коробкой.", a: true },
              { t: "The woman was in a blue coat.", ru: "На женщине было синее пальто.", a: false }
            ]
          }
        },
        { note: { clue: "testimony", title: "Notebook hint", ru: "Заметка в блокнот" } },
        { vocab: { words: [["hurry", "спешить"], ["look like", "выглядеть"], ["flight", "перелёт"], ["near", "рядом"], ["back door", "задняя дверь"]] } }
      ]
    },

    {
      id: "ch2",
      chapter: "Chapter 2",
      title: "Reception: Meeting Emma",
      objective: "Introduce yourself politely at the reception desk.",
      objectiveRu: "Вежливо представься на ресепшене.",
      bg: "assets/BG_reception.png",
      cast: { Alex: { img: "assets/CH_alex.png", side: "left" }, Emma: { img: "assets/CH_emma.png", side: "right" } },
      items: [
        { t: "The hotel lobby smells of wood, tea and rain.", ru: "В холле отеля пахнет деревом, чаем и дождём." },
        { sp: "Emma", t: "Good evening! Welcome to the Moonlit Evening Hotel.", ru: "Добрый вечер! Добро пожаловать в отель «Лунный вечер»." },
        { sp: "Emma", t: "Do you have a reservation?", ru: "У вас есть бронь?" },
        {
          prompt: { sp: "Alex", t: "You answer:", ru: "Ты отвечаешь:" },
          opts: [
            { t: "Good evening. I'm Alex from Scotland Yard. Mr. Grant is expecting me.", ru: "Добрый вечер. Я Алекс из Скотленд-Ярда. Мистер Грант меня ждёт.", ok: true, fb: "Clear and polite. Perfect." },
            { t: "Good evening. I am Alex, and I want to see Mr. Grant quickly, please.", ru: "Добрый вечер. Я Алекс, и я хочу увидеть мистера Гранта быстро, пожалуйста.", fb: "'I want ... quickly' sounds demanding. Try: Mr. Grant is expecting me." },
            { t: "Hello. Me Alex from Scotland Yard. The boss Grant waits for me.", ru: "Привет. Я Алекс из Скотленд-Ярда. Босс Грант ждёт меня.", fb: "Full sentences: I am Alex... And not 'boss' — say 'Mr. Grant is expecting me'." }
          ]
        },
        { sp: "Emma", t: "Oh! The detective! Mr. Grant is in his office. Please, follow me.", ru: "О! Детектив! Мистер Грант в своём кабинете. Пожалуйста, за мной." },
        { sp: "Alex", t: "Could you show me the lobby first, please?", ru: "Не могли бы вы сначала показать мне холл?" },
        { sp: "Emma", t: "Of course. This way.", ru: "Конечно. Сюда." },
        { sp: "Emma", t: "This is our famous lobby. And... oh.", ru: "Это наш знаменитый холл. И... ох." },
        { sp: "Alex", t: "What's wrong?", ru: "Что случилось?" },
        { sp: "Emma", t: "This is the wall. The painting was here.", ru: "Это та стена. Здесь висела картина." },
        { sp: "Emma", t: "Please, be careful on the wet floor.", ru: "Пожалуйста, осторожно, пол мокрый." },
        { sp: "Alex", t: "Wet floor? Why?", ru: "Мокрый пол? Почему?" },
        { sp: "Emma", t: "The storm. And one of the windows is open...", ru: "Гроза. И одно из окон открыто..." },
        { sp: "Alex", t: "Interesting...", ru: "Интересно..." },
        {
          task: {
            kind: "order", title: "Put the words in order", ru: "Расставь слова по порядку",
            words: ["could", "show", "you", "me", "the lobby", "please", "?"],
            answer: "could you show me the lobby please ?"
          }
        },
        { vocab: { words: [["reservation", "бронь"], ["reception", "ресепшн"], ["lobby", "холл"], ["floor", "пол"], ["follow", "следовать"], ["expect", "ждать"]] } }
      ]
    },

    {
      id: "ch3",
      chapter: "Chapter 3",
      title: "Mr. Grant's Office",
      objective: "Ask about the time and place of the theft.",
      objectiveRu: "Расспроси о времени и месте кражи.",
      bg: "assets/BG_office.png",
      cast: { Alex: { img: "assets/CH_alex.png", side: "left" }, Grant: { img: "assets/CH_grant.png", side: "right" } },
      items: [
        { t: "A warm fireplace. And one empty spot on the wall.", ru: "Тёплый камин. И одно пустое место на стене." },
        { sp: "Grant", t: "My painting! My grandfather's painting!", ru: "Моя картина! Картина моего деда!" },
        { sp: "Alex", t: "Please, calm down, Mr. Grant. We will find it.", ru: "Пожалуйста, успокойтесь, мистер Грант. Мы её найдём." },
        { sp: "Grant", t: "It was the \"Moon over the Thames\". The treasure of my family.", ru: "Это была «Луна над Темзой». Сокровище нашей семьи." },
        { sp: "Alex", t: "When did it disappear?", ru: "Когда она исчезла?", hint: "Past Simple question: When did it disappear?" },
        { sp: "Grant", t: "Yesterday evening. Between 9:45 and 10:15 p.m.", ru: "Вчера вечером. Между 21:45 и 22:15." },
        { sp: "Alex", t: "Where was the painting?", ru: "Где висела картина?" },
        { sp: "Grant", t: "In the lobby. On the wall near the window.", ru: "В холле. На стене у окна." },
        { sp: "Alex", t: "Who was in the hotel last night?", ru: "Кто был в отеле вчера ночью?" },
        { sp: "Grant", t: "All the guests and the staff. Let me think... six people.", ru: "Все гости и персонал. Дайте подумать... шесть человек." },
        { sp: "Alex", t: "Did you hear anything?", ru: "Вы что-нибудь слышали?" },
        { sp: "Grant", t: "Nothing. The storm was very, very loud.", ru: "Ничего. Гроза была очень громкой." },
        { sp: "Alex", t: "Don't worry, Mr. Grant. I'll find your painting.", ru: "Не волнуйтесь, мистер Грант. Я найду вашу картину." },
        { sp: "Grant", t: "Emma will help you. You can go everywhere in the hotel.", ru: "Эмма вам поможет. Вы можете пройти в любое место отеля." },
        { sp: "Grant", t: "But Alex... before the police arrive. Please.", ru: "Но, Алекс... до приезда полиции. Пожалуйста." },
        {
          task: {
            kind: "order", title: "Make a question", ru: "Составь вопрос",
            words: ["what", "did", "you", "see", "?"],
            answer: "what did you see ?"
          }
        },
        {
          task: {
            kind: "quiz", title: "Choose the correct question", ru: "Выбери правильный вопрос",
            q: "Which question is correct?", ru: "Какой вопрос построен правильно?",
            opts: ["When did it happen?", "When it did happen?", "When happened it?"], a: 0,
            why: "In Past Simple questions: question word + did + subject + verb."
          }
        },
        {
          task: {
            kind: "quiz", title: "Prepositions of time", ru: "Предлоги времени",
            q: "The painting disappeared ___ ten o'clock.", ru: "Картина исчезла ___ десять часов.",
            opts: ["at", "on", "in"], a: 0,
            why: "With clock times we use 'at': at ten o'clock."
          }
        },
        { vocab: { words: [["thief", "вор"], ["disappear", "исчезать"], ["happen", "случаться"], ["grandfather", "дед"], ["guest", "гость"], ["staff", "персонал"]] } }
      ]
    },

    {
      id: "ch4",
      chapter: "Chapter 4",
      title: "The Lobby: Crime Scene",
      objective: "Find the clues in the lobby with your magnifying glass.",
      objectiveRu: "Найди улики в холле с помощью лупы.",
      bg: "assets/BG_lobby_crime.png",
      cast: { Alex: { img: "assets/CH_alex.png", side: "left" }, Emma: { img: "assets/CH_emma.png", side: "right" } },
      items: [
        { sp: "Emma", t: "This is the lobby. The painting was here, on this wall.", ru: "Это холл. Картина была здесь, на этой стене." },
        { sp: "Alex", t: "The frame is empty as a shell... and the glass is broken.", ru: "Рама пуста, как ракушка... а стекло разбито." },
        { clearChars: true },
        { sp: "Watson", t: "Hoo-hoo! Don't be afraid!", ru: "Уху-ху! Не бойтесь!", cast: { Watson: { img: "assets/CH_watson_owl.png", side: "center" } } },
        { sp: "Watson", t: "I am Watson. A detective owl. A very serious owl.", ru: "Я Уотсон. Сова-детектив. Очень серьёзная сова." },
        { sp: "Watson", t: "Move the magnifying glass over the picture. Click when you see a clue!", ru: "Двигай лупу по картинке. Кликай, когда увидишь улику!" },
        { sp: "Watson", t: "And if you need help — click on me. I love grammar. Hoo!", ru: "А если нужна помощь — кликни по мне. Я люблю грамматику. Уху!" },
        {
          clues: {
            hotspots: [
              { id: "window", x: 0.015, y: 0.05, w: 0.09, h: 0.5 },
              { id: "thread", x: 0.35, y: 0.34, w: 0.1, h: 0.28 },
              { id: "footprints", x: 0.25, y: 0.76, w: 0.16, h: 0.16 },
              { id: "glass", x: 0.76, y: 0.72, w: 0.14, h: 0.16 }
            ],
            duds: [
              { x: 0.47, y: 0.6, w: 0.14, h: 0.18, msg: "Just the old sofa. Nobody is hiding here.", ru: "Просто старый диван. Здесь никто не прячется." },
              { x: 0.12, y: 0.44, w: 0.08, h: 0.16, msg: "A lamp. It is warm, but it tells us nothing.", ru: "Лампа. Тёплая, но ничего не расскажет." }
            ]
          }
        },
        { sp: "Emma", t: "Who was in the hotel last night?", ru: "Кто был в отеле вчера ночью?" },
        { sp: "Emma", t: "Mrs. Wilkinson in room 312, the chef Antonio, the bellboy Tim...", ru: "Миссис Уилкинсон из 312, шеф-повар Антонио, посыльный Тим..." },
        { sp: "Alex", t: "Thank you, Emma. This is a good start.", ru: "Спасибо, Эмма. Это хорошее начало." },
        { sp: "Emma", t: "Oh, and the window. It was closed before the storm. Now it is open.", ru: "Ах да, и окно. До грозы оно было закрыто. Теперь оно открыто." },
        {
          task: {
            kind: "quiz", title: "Prepositions of place", ru: "Предлоги места",
            q: "The glass is ___ the floor.", ru: "Стекло ___ полу.",
            opts: ["on", "at", "in"], a: 0,
            why: "On the floor — на поверхности пола."
          }
        },
        {
          task: {
            kind: "quiz", title: "Prepositions of place", ru: "Предлоги места",
            q: "The thread is ___ the frame.", ru: "Нитка ___ раме.",
            opts: ["near", "on", "at"], a: 0,
            why: "Near the frame — рядом с рамой. (On the frame — на самой раме, тоже возможно!)"
          }
        },
        {
          task: {
            kind: "quiz", title: "Prepositions of place", ru: "Предлоги места",
            q: "The window is ___ the wall.", ru: "Окно ___ стене.",
            opts: ["in", "on", "at"], a: 0,
            why: "A window is in the wall — часть стены."
          }
        },
        { vocab: { words: [["frame", "рама"], ["glass", "стекло"], ["footprint", "след"], ["thread", "нитка"], ["floor", "пол"], ["wall", "стена"], ["window", "окно"]] } }
      ]
    },

    {
      id: "ch5",
      chapter: "Chapter 5",
      title: "Restaurant and Kitchen: Antonio",
      objective: "Order your dinner and check the chef's alibi.",
      objectiveRu: "Закажи ужин и проверь алиби шеф-повара.",
      bg: "assets/BG_restaurant.png",
      cast: { Alex: { img: "assets/CH_alex.png", side: "left" }, Antonio: { img: "assets/CH_antonio.png", side: "right" } },
      items: [
        { t: "Candles, white tablecloths, rain on the tall windows. The restaurant is almost empty.", ru: "Свечи, белые скатерти, дождь в высоких окнах. Ресторан почти пуст." },
        { sp: "Antonio", t: "Good evening! Welcome! Are you ready to order?", ru: "Добрый вечер! Добро пожаловать! Готовы сделать заказ?" },
        {
          prompt: { sp: "Alex", t: "You order:", ru: "Ты делаешь заказ:" },
          opts: [
            { t: "Could I have the tomato soup and grilled chicken, please?", ru: "Можно мне томатный суп и курицу на гриле, пожалуйста?", ok: true, fb: "Polite request in a restaurant. Excellent!" },
            { t: "I would like a soup with tomato and chicken, very fast please.", ru: "Я хотел бы суп с томатом и курицей, очень быстро, пожалуйста.", fb: "Almost polite, but 'very fast please' is not — and it is 'tomato soup'. Use: Could I have..., please?" },
            { t: "Give me tomato soup and some chicken, I am in a hurry.", ru: "Дайте томатный суп и курицу, я спешу.", fb: "Too direct. Start with Could I have...? and add 'please'." }
          ]
        },
        { sp: "Alex", t: "Could I have the tomato soup and grilled chicken, please?", ru: "Можно мне томатный суп и курицу на гриле, пожалуйста?" },
        { sp: "Antonio", t: "Good choice! And to drink?", ru: "Отличный выбор! А из напитков?" },
        { sp: "Alex", t: "Some tea, please.", ru: "Чай, пожалуйста." },
        {
          prompt: { sp: "Alex", t: "Ask about coffee:", ru: "Спроси про кофе:" },
          opts: [
            { t: "Do you have any coffee?", ru: "У вас есть кофе?", ok: true },
            { t: "Do you have some coffee for me?", ru: "У вас есть немного кофе для меня?", fb: "In questions we usually use 'any': Do you have any coffee? ('some' is for statements and offers)." }
          ]
        },
        { sp: "Alex", t: "Do you have any coffee?", ru: "У вас есть кофе?" },
        { sp: "Antonio", t: "You are the detective, yes? People say I am a suspect! Ha!", ru: "Вы же детектив, да? Говорят, я подозреваемый! Ха!" },
        { sp: "Alex", t: "And what do you say?", ru: "А что говорите вы?" },
        { sp: "Antonio", t: "I say: I was in the kitchen all evening. I was cooking!", ru: "Я говорю: я был на кухне весь вечер. Я готовил!" },
        { sp: "Alex", t: "What were you doing at ten o'clock?", ru: "Что вы делали в десять часов?", hint: "Past Continuous: What were you doing at...? — что происходило в момент X." },
        { sp: "Antonio", t: "At ten? I was baking a cake. For Mr. Grant. It was a surprise!", ru: "В десять? Я пёк торт. Для мистера Гранта. Это был сюрприз!" },
        { sp: "Alex", t: "A cake for the owner? Can I see the kitchen?", ru: "Торт для владельца? Можно посмотреть кухню?" },
        { sp: "Antonio", t: "Of course! This way, detective.", ru: "Конечно! Сюда, детектив." },
        { bg: "assets/BG_kitchen.png" },
        { t: "Warm steam, copper pots, the smell of chocolate.", ru: "Тёплый пар, медные кастрюли, запах шоколада." },
        { sp: "Antonio", t: "Look! A chocolate cake. Still warm, still shy. Ha!", ru: "Смотрите! Шоколадный торт. Ещё тёплый, ещё стесняется. Ха!" },
        { sp: "Alex", t: "Chef... your shoes are wet.", ru: "Шеф... у вас мокрые ботинки." },
        { sp: "Antonio", t: "I went to the garden for basil! Fresh basil! The rain...", ru: "Я ходил в сад за базиликом! Свежий базилик! А дождь..." },
        { sp: "Antonio", t: "I know, I know. It looks bad. But look at this!", ru: "Знаю, знаю. Выглядит плохо. Но посмотрите!" },
        { note: { clue: "receipt", title: "Clue found: the receipt", ru: "Улика: чек" } },
        { sp: "Antonio", t: "A receipt from the spice shop. Cinnamon. At 22:20.", ru: "Чек из магазина специй. Корица. В 22:20." },
        { sp: "Alex", t: "Cinnamon? For the cake?", ru: "Корица? Для торта?" },
        { sp: "Antonio", t: "For the cake. The best in London!", ru: "Для торта. Лучший в Лондоне!" },
        { sp: "Alex", t: "22:20... The theft was at ten. Maybe he is telling the truth.", ru: "22:20... Кража была в десять. Может, он говорит правду." },
        { sp: "Alex", t: "Thank you, chef. You were very helpful.", ru: "Спасибо, шеф. Вы очень помогли." },
        { sp: "Antonio", t: "Buona fortuna, detective! Good luck!", ru: "Удачи, детектив! Buona fortuna!" },
        {
          task: {
            kind: "quiz", title: "Past Continuous", ru: "Past Continuous",
            q: "What ___ you ___ at ten o'clock? — I was cooking.", ru: "Что вы ___ в десять часов? — Я готовил.",
            opts: ["were / doing", "was / doing", "were / do"], a: 0,
            why: "With 'you' we use were: What were you doing? The action was in progress at ten."
          }
        },
        {
          task: {
            kind: "tf", title: "True or False?", ru: "Верно или неверно?",
            stmts: [
              { t: "Antonio has an alibi: the receipt from the spice shop at 22:20.", ru: "У Антонио алиби: чек из магазина специй в 22:20.", a: true },
              { t: "Antonio's shoes are wet because of the garden and the rain.", ru: "Ботинки Антонио мокрые из-за сада и дождя.", a: true },
              { t: "Antonio stole the painting.", ru: "Антонио украл картину.", a: false }
            ]
          }
        },
        { vocab: { words: [["menu", "меню"], ["order", "заказывать"], ["soup", "суп"], ["dessert", "десерт"], ["bill", "счёт"], ["bake", "печь"], ["apron", "фартук"], ["receipt", "чек"]] } }
      ]
    },

    {
      id: "ch6",
      chapter: "Chapter 6",
      title: "Corridor: Mrs. Wilkinson",
      objective: "Ask Mrs. Wilkinson about last night. Watch her coat.",
      objectiveRu: "Расспроси миссис Уилкинсон. Смотри на её пальто.",
      bg: "assets/BG_corridor.png",
      cast: { Alex: { img: "assets/CH_alex.png", side: "left" }, Wilkinson: { img: "assets/CH_wilkinson.png", side: "right" } },
      items: [
        { t: "Room 312. Red carpet, golden lamps, deep shadows.", ru: "Номер 312. Красный ковёр, золотые лампы, глубокие тени." },
        { sp: "Wilkinson", t: "Young man. I am very busy. What do you want?", ru: "Молодой человек. Я очень занята. Что вам нужно?" },
        {
          prompt: { sp: "Alex", t: "You answer:", ru: "Ты отвечаешь:" },
          opts: [
            { t: "Excuse me, Mrs. Wilkinson. Could I ask you a few questions?", ru: "Простите, миссис Уилкинсон. Можно задать вам несколько вопросов?", ok: true, fb: "Polite and calm. Exactly right." },
            { t: "Excuse me, madam, you must answer my questions right now.", ru: "Простите, мадам, вы должны ответить на мои вопросы прямо сейчас.", fb: "'You must answer' is an order. Ask politely: Could I ask you a few questions?" },
            { t: "Hello. I need to ask you some questions, and it is very important.", ru: "Здравствуйте. Мне нужно задать вам вопросы, и это очень важно.", fb: "Less demanding, but still pushy. 'Could I ask you...?' is the polite formula." }
          ]
        },
        { sp: "Alex", t: "Excuse me, Mrs. Wilkinson. Could I ask you a few questions?", ru: "Простите, миссис Уилкинсон. Можно задать вам несколько вопросов?" },
        { sp: "Wilkinson", t: "A few. Not more.", ru: "Несколько. Не больше." },
        { sp: "Alex", t: "Where were you at ten o'clock last night?", ru: "Где вы были вчера в десять часов?" },
        { sp: "Wilkinson", t: "I was in my room. I was taking a bath.", ru: "Я была в своём номере. Принимала ванну." },
        { sp: "Wilkinson", t: "I saw nothing. I heard nothing. Good night.", ru: "Я ничего не видела. Ничего не слышала. Доброй ночи." },
        { sp: "Alex", t: "Beautiful coat, by the way. From Paris?", ru: "Красивое пальто, кстати. Из Парижа?" },
        { sp: "Wilkinson", t: "Yes. A gift to myself.", ru: "Да. Подарок самой себе." },
        { sp: "Alex", t: "The collar... is something wrong with it?", ru: "Воротник... с ним что-то не так?" },
        { sp: "Wilkinson", t: "Nothing is wrong. Good night, young man!", ru: "Всё в порядке. Доброй ночи, молодой человек!" },
        { sp: "Alex", t: "A loose thread on the collar... like on the frame.", ru: "Оторванная нитка на воротнике... как на раме." },
        { sp: "Wilkinson", t: "Are you still here?", ru: "Вы всё ещё здесь?" },
        { sp: "Alex", t: "I am going, Mrs. Wilkinson. Thank you for your time.", ru: "Я ухожу, миссис Уилкинсон. Спасибо за ваше время." },
        {
          task: {
            kind: "tf", title: "True or False? (according to her words)", ru: "Верно или неверно? (по её словам)",
            stmts: [
              { t: "Wilkinson was in her room at ten.", ru: "Уилкинсон была в номере в десять.", a: true },
              { t: "She was taking a bath.", ru: "Она принимала ванну.", a: true },
              { t: "She heard the storm.", ru: "Она слышала грозу.", a: false }
            ]
          }
        },
        {
          task: {
            kind: "quiz", title: "Describe her clothes", ru: "Опиши её одежду",
            q: "What is she wearing?", ru: "Во что она одета?",
            opts: [
              "She is wearing a red coat, a silk scarf and black shoes.",
              "She wear red coat and scarf.",
              "She is wear red coat, silk scarf and black shoes."
            ], a: 0,
            why: "Present Continuous: She is wearing... (is + verb-ing)."
          }
        },
        {
          task: {
            kind: "quiz", title: "Past Continuous", ru: "Past Continuous",
            q: "What was she doing at ten?", ru: "Что она делала в десять?",
            opts: ["She was taking a bath.", "She did take a bath.", "She takes a bath."], a: 0,
            why: "The action was in progress at ten o'clock: was + verb-ing."
          }
        },
        { vocab: { words: [["coat", "пальто"], ["scarf", "шарф"], ["gloves", "перчатки"], ["bath", "ванна"], ["busy", "занятой"], ["nothing", "ничего"]] } }
      ]
    },

    {
      id: "ch7",
      chapter: "Chapter 7",
      title: "Luggage Room: Tim",
      objective: "Make Tim feel safe. Find the hat box.",
      objectiveRu: "Успокой Тима. Найди шляпную коробку.",
      bg: "assets/BG_corridor.png",
      cast: { Alex: { img: "assets/CH_alex.png", side: "left" }, Tim: { img: "assets/CH_tim.png", side: "right" } },
      items: [
        { t: "The young bellboy almost drops a suitcase when he sees you.", ru: "Юный посыльный чуть не роняет чемодан, увидев тебя." },
        { sp: "Tim", t: "Oh! Good evening, sir... I mean, detective, sir!", ru: "О! Добрый вечер, сэр... то есть, детектив, сэр!" },
        { sp: "Alex", t: "Don't worry, Tim. I just want to talk.", ru: "Не волнуйся, Тим. Я просто хочу поговорить." },
        { sp: "Tim", t: "If I tell you something... I'll lose my job.", ru: "Если я вам что-то скажу... я потеряю работу." },
        {
          prompt: { sp: "Alex", t: "You answer:", ru: "Ты отвечаешь:" },
          opts: [
            { t: "Take your time. You're not in trouble. I'll help you.", ru: "Не спеши. Ты не в беде. Я тебе помогу.", ok: true, fb: "Kind and supportive. Tim will trust you." },
            { t: "Come on, Tim, tell me everything now. It will be better for you.", ru: "Давай, Тим, рассказывай всё сейчас. Для тебя же лучше.", fb: "This sounds like pressure. Try: Take your time. I'll help you." },
            { t: "Don't be afraid, but I need your story quickly. My job is important.", ru: "Не бойся, но мне нужен твой рассказ быстро. Моя работа важна.", fb: "Tim is scared. Put his feelings first: You're not in trouble. I'll help you." }
          ]
        },
        { sp: "Alex", t: "Take your time. You're not in trouble. I'll help you.", ru: "Не спеши. Ты не в беде. Я тебе помогу." },
        { sp: "Tim", t: "Promise?", ru: "Обещаете?" },
        { sp: "Alex", t: "Promise.", ru: "Обещаю." },
        { sp: "Tim", t: "At ten o'clock I was carrying a suitcase.", ru: "В десять часов я нёс чемодан." },
        { sp: "Tim", t: "And I saw a woman. Near the stairs.", ru: "И я увидел женщину. У лестницы." },
        { sp: "Alex", t: "Can you describe her?", ru: "Можешь её описать?" },
        { sp: "Tim", t: "A red coat. A long red coat. And a big hat box.", ru: "Красное пальто. Длинное красное пальто. И большая шляпная коробка." },
        { sp: "Alex", t: "A hat box? For hats?", ru: "Шляпная коробка? Для шляп?" },
        { sp: "Tim", t: "Yes. So big and round. With pink stripes.", ru: "Да. Большая и круглая. С розовыми полосками." },
        { sp: "Alex", t: "Where did she go?", ru: "Куда она пошла?" },
        { sp: "Tim", t: "To the garden door. She was in a hurry.", ru: "К двери в сад. Она спешила." },
        { sp: "Alex", t: "Thank you, Tim. You are very brave.", ru: "Спасибо, Тим. Ты очень храбрый." },
        { sp: "Tim", t: "There is one more thing... There is a hat box in the luggage room.", ru: "Есть ещё кое-что... В багажной комнате есть шляпная коробка." },
        { sp: "Alex", t: "Show me. Please.", ru: "Покажи. Пожалуйста." },
        { clearChars: true, bg: "assets/BG_luggage_room.png" },
        { t: "Old suitcases, wooden shelves, dust in the light of a hanging lamp.", ru: "Старые чемоданы, деревянные полки, пыль в свете лампы." },
        {
          clues: {
            hotspots: [
              { id: "hatbox", x: 0.78, y: 0.68, w: 0.18, h: 0.26 }
            ],
            duds: [
              { x: 0.02, y: 0.6, w: 0.18, h: 0.32, msg: "An old brown suitcase. Heavy and dusty.", ru: "Старый коричневый чемодан. Тяжёлый и пыльный." },
              { x: 0.26, y: 0.12, w: 0.22, h: 0.5, msg: "Shelves full of suitcases. Just luggage.", ru: "Полки, полные чемоданов. Просто багаж." },
              { x: 0.46, y: 0.6, w: 0.18, h: 0.3, msg: "A big travel trunk. Locked. Not our box.", ru: "Большой дорожный сундук. Заперт. Не наша коробка." }
            ]
          }
        },
        { sp: "Alex", t: "This box... the painting! It's here!", ru: "Эта коробка... картина! Она здесь!" },
        { sp: "Alex", t: "Tim, you are a real hero.", ru: "Тим, ты настоящий герой." },
        { sp: "Tim", t: "Oh... thank you, detective!", ru: "О... спасибо, детектив!" },
        {
          task: {
            kind: "order", title: "Put the events in order", ru: "Расставь события по порядку",
            words: ["Tim was carrying a suitcase.", "He saw a woman in a red coat.", "She went to the garden door.", "Alex found the hat box."],
            answer: "Tim was carrying a suitcase. | He saw a woman in a red coat. | She went to the garden door. | Alex found the hat box."
          }
        },
        {
          task: {
            kind: "tf", title: "True or False?", ru: "Верно или неверно?",
            stmts: [
              { t: "Tim saw a man with a suitcase.", ru: "Тим видел мужчину с чемоданом.", a: false },
              { t: "The woman had a big hat box.", ru: "У женщины была большая шляпная коробка.", a: true }
            ]
          }
        },
        { vocab: { words: [["suitcase", "чемодан"], ["stairs", "лестница"], ["carry", "нести"], ["scared", "испуганный"], ["brave", "храбрый"], ["promise", "обещание"], ["hat box", "шляпная коробка"]] } }
      ]
    },

    {
      id: "ch8",
      chapter: "Chapter 8",
      title: "The Reveal",
      objective: "Name the thief and prove it with three clues.",
      objectiveRu: "Назови вора и докажи это тремя уликами.",
      bg: "assets/BG_lobby_crime.png",
      cast: { Alex: { img: "assets/CH_alex.png", side: "left" }, Wilkinson: { img: "assets/CH_wilkinson.png", side: "right" } },
      items: [
        { t: "Everyone is in the lobby. The storm is over. It is time for the truth.", ru: "Все собрались в холле. Гроза закончилась. Пришло время правды." },
        { sp: "Alex", t: "Everyone, please. I know who took the painting.", ru: "Все, пожалуйста. Я знаю, кто взял картину." },
        { sp: "Emma", t: "Was it the chef? His apron is red!", ru: "Это шеф-повар? Его фартук красный!" },
        { sp: "Antonio", t: "What? No, no, no!", ru: "Что? Нет, нет, нет!" },
        { sp: "Alex", t: "No, the apron is a false clue. Antonio has an alibi: the receipt at 22:20.", ru: "Нет, фартук — ложный след. У Антонио алиби: чек в 22:20." },
        { sp: "Grant", t: "Then who? Who took my painting?", ru: "Тогда кто? Кто взял мою картину?" },
        {
          prompt: { sp: "Alex", t: "Who took the painting?", ru: "Кто взял картину?" },
          opts: [
            { t: "Mrs. Wilkinson.", ru: "Миссис Уилкинсон.", ok: true, fb: "True. Now prove it." },
            { t: "Antonio.", ru: "Антонио.", fb: "Check your notebook: who was in red? Who 'was taking a bath' at ten? Try again." },
            { t: "Tim.", ru: "Тим.", fb: "Tim is the witness, not the thief. Check the notebook again." }
          ]
        },
        { sp: "Alex", t: "Mr. Grant, your painting was stolen by... Mrs. Wilkinson.", ru: "Мистер Грант, вашу картину украла... миссис Уилкинсон." },
        { sp: "Wilkinson", t: "Me? Ridiculous.", ru: "Я? Смешно." },
        { sp: "Alex", t: "You were wearing a red coat. Tim saw you near the stairs.", ru: "На вас было красное пальто. Тим видел вас у лестницы." },
        { sp: "Wilkinson", t: "Many women have red coats.", ru: "У многих женщин есть красные пальто." },
        { sp: "Alex", t: "Yes. But only one coat has a loose thread on the collar.", ru: "Да. Но только на одном пальто оторвана нитка на воротнике." },
        { sp: "Alex", t: "And the same red thread is on the empty frame.", ru: "И та же красная нитка — на пустой раме." },
        { sp: "Wilkinson", t: "...Go on, young man.", ru: "...Продолжайте, молодой человек." },
        { sp: "Alex", t: "You hid the painting in your hat box. The box is in the luggage room now.", ru: "Вы спрятали картину в шляпную коробку. Коробка сейчас в багажной комнате." },
        { sp: "Wilkinson", t: "(silence)", ru: "(молчание)" },
        { sp: "Alex", t: "Why, Mrs. Wilkinson?", ru: "Почему, миссис Уилкинсон?" },
        {
          task: {
            kind: "multi", title: "Choose three clues that prove her guilt", ru: "Выбери три улики, доказывающие её вину",
            opts: [
              "Tim's testimony",
              "The red thread",
              "The hat box with the painting",
              "Antonio's receipt (alibi)",
              "The storm outside"
            ],
            a: [0, 1, 2],
            why: "Strong proof = witness + physical clue + hidden object. The receipt is Antonio's alibi, and the storm only explains the noise."
          }
        },
        { sp: "Wilkinson", t: "You are right. It was me.", ru: "Вы правы. Это была я." },
        { sp: "Wilkinson", t: "This painting was my grandmother's. Many years ago my family lost it.", ru: "Эта картина принадлежала моей бабушке. Много лет назад семья её потеряла." },
        { sp: "Wilkinson", t: "I wanted to bring it home.", ru: "Я хотела вернуть её домой." },
        { sp: "Grant", t: "I understand your feelings, Mrs. Wilkinson.", ru: "Я понимаю ваши чувства, миссис Уилкинсон." },
        { sp: "Grant", t: "But it doesn't belong to you. The police will decide.", ru: "Но она не принадлежит вам. Решать будет полиция." },
        { sp: "Wilkinson", t: "You are right. I am sorry, Mr. Grant.", ru: "Вы правы. Простите меня, мистер Грант." },
        { sp: "Grant", t: "Detective... thank you. My family thanks you.", ru: "Детектив... спасибо. Моя семья благодарит вас." },
        { sp: "Wilkinson", t: "Your bellboy... Tim. Will he lose his job? He is a good boy.", ru: "Ваш посыльный... Тим. Он потеряет работу? Он хороший мальчик." },
        { sp: "Alex", t: "No. He is a hero. And you, Mrs. Wilkinson... thank you for the truth.", ru: "Нет. Он герой. А вам, миссис Уилкинсон... спасибо за правду." },
        {
          task: {
            kind: "order", title: "Tell the story (Past Simple)", ru: "Расскажи историю (Past Simple)",
            words: ["She took the painting at ten o'clock.", "She was wearing a red coat.", "She hid it in a hat box.", "Tim saw her near the stairs."],
            answer: "She took the painting at ten o'clock. | She was wearing a red coat. | She hid it in a hat box. | Tim saw her near the stairs."
          }
        },
        { vocab: { words: [["suspect", "подозреваемый"], ["guilty", "виновный"], ["proof", "доказательство"], ["alibi", "алиби"], ["hide", "прятать"], ["belong", "принадлежать"]] } }
      ]
    },

    {
      id: "epilogue",
      chapter: "Epilogue",
      title: "Case Closed",
      objective: "Enjoy the morning. You solved the case!",
      objectiveRu: "Наслаждайся утром. Дело раскрыто!",
      bg: "assets/BG_epilogue.png",
      cast: { Watson: { img: "assets/CH_watson_owl.png", side: "center" } },
      items: [
        { t: "Morning. Sunlight. Tea and the smell of chocolate cake.", ru: "Утро. Солнечный свет. Чай и запах шоколадного торта." },
        { sp: "Jones", t: "Alex? Good job. The painting is home.", ru: "Алекс? Отличная работа. Картина дома.", hint: "A phone call from your boss. The case is closed!" },
        { sp: "Alex", t: "Thank you, sir.", ru: "Спасибо, сэр." },
        { sp: "Jones", t: "New case tomorrow, detective.", ru: "Завтра новое дело, детектив." },
        { sp: "Alex", t: "I'm ready, sir.", ru: "Я готов, сэр." },
        { sp: "Emma", t: "Tea, detective?", ru: "Чай, детектив?" },
        { sp: "Alex", t: "Yes, please. With milk.", ru: "Да, пожалуйста. С молоком." },
        { sp: "Antonio", t: "And my chocolate cake! For the hero!", ru: "И мой шоколадный торт! Для героя!" },
        { sp: "Alex", t: "Smells wonderful, chef.", ru: "Пахнет чудесно, шеф." },
        { sp: "Tim", t: "Thank you, Alex. For everything.", ru: "Спасибо, Алекс. За всё." },
        { sp: "Alex", t: "Good luck, Tim. You are brave. Work hard.", ru: "Удачи, Тим. Ты храбрый. Работай усердно." },
        { sp: "Grant", t: "The \"Moon over the Thames\" is back home. You are welcome at the Moonlit Evening any time.", ru: "«Луна над Темзой» снова дома. Добро пожаловать в «Лунный вечер» в любое время." },
        { sp: "Alex", t: "It was nice to meet you all.", ru: "Было приятно со всеми познакомиться." },
        { sp: "Watson", t: "Hoo-hoo! Case closed! You are a real detective now.", ru: "Уху-ху! Дело закрыто! Теперь ты настоящий детектив." },
        { sp: "Watson", t: "But tomorrow... a new mystery! See you next time!", ru: "Но завтра... новая тайна! До встречи!" },
        { end: true }
      ]
    }
  ]
};