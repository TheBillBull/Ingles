/* ===== Textos de lectura (originales) ===== */
const PASSAGES = [
  {
    id: 'p1', title: 'Aviso de la comunidad', level: 'B1', type: 'mc',
    tip: 'Pregunta 1 = objetivo del texto. Mira el verbo principal: ¿informa, pide, se queja?',
    text: [
      'To all residents',
      'Last Saturday, some of you may have noticed that the lift was out of order. The problem was caused by a power cut, which also affected the lights in the car park. The building manager has now checked everything, and the lift is working again.',
      'However, because of repairs to the roof, the entrance on the north side will be closed from Monday to Thursday next week, so please use the main door. We are sorry for any trouble.',
      'If you find any further problems, do not call the manager directly. Instead, leave a note in the box by the post room before noon, and we will deal with it the next day.',
      'The Residents\' Committee'
    ],
    qs: [
      { q: 'What is the main purpose of the message?', opts: ['to complain about the building manager', 'to give residents information about recent and planned problems', 'to ask residents to help with repairs', 'to announce a residents\' meeting'], ans: 1, why: 'Informa de un problema pasado (ascensor) y de uno futuro (entrada cerrada). No se queja, no pide ayuda y no convoca ninguna reunión.' },
      { q: 'What caused the problem with the lift?', opts: ['work on the roof', 'a power cut', 'a broken door', 'a shortage of staff'], ans: 1, why: '*The problem was caused by a power cut*. Las obras del tejado afectan a la entrada, no al ascensor.' },
      { q: 'What should residents do next week?', opts: ['use the north entrance', 'avoid the car park', 'use the main door', 'call the manager'], ans: 2, why: '*The entrance on the north side will be closed… please use the main door*.' },
      { q: 'How should residents report a new problem?', opts: ['by phoning the manager', 'by emailing the committee', 'by leaving a note before noon', 'by visiting the post room after lunch'], ans: 2, why: '*Do not call the manager directly. Instead, leave a note… before noon*.' }
    ]
  },
  {
    id: 'p2', title: 'Por qué recordamos las canciones', level: 'B2', type: 'mc',
    tip: 'Cada pregunta sigue el orden del texto. Busca la frase exacta y descarta las opciones que cambian el sentido.',
    text: [
      'Most of us can sing along to a song we have not heard for years, yet we struggle to remember what we read in a book last month. Researchers believe this is because music gives the brain a structure to hold on to. Rhythm and rhyme break information into small, predictable pieces, and the melody acts like a path that leads us from one line to the next.',
      'That is why many teachers use songs to help young children learn the alphabet or the days of the week. However, the effect is not limited to children. In one study, adults who learned a short text set to music remembered far more of it a week later than those who simply read it aloud.',
      'The scientists do not suggest that we should sing our way through every exam, but they do think that a little rhythm can make studying more effective.'
    ],
    qs: [
      { q: 'What does the writer say about songs?', opts: ['They are easier to remember than most written texts.', 'They are only useful for children.', 'They are harder to learn than poems.', 'They need to be heard often to be remembered.'], ans: 0, why: 'Podemos cantar una canción que no oímos hace años, pero nos cuesta recordar lo leído. D es lo contrario.' },
      { q: 'According to the text, what does the melody help us do?', opts: ['choose which song to sing', 'move from one line to the next', 'hear the rhyme more clearly', 'learn new words faster'], ans: 1, why: '*The melody acts like a path that leads us from one line to the next*.' },
      { q: 'What did the study show?', opts: ['Adults prefer reading aloud.', 'Adults remembered more when the text had music.', 'Children learn faster than adults.', 'Reading aloud is useless.'], ans: 1, why: 'Los adultos que aprendieron el texto con música recordaron *far more* una semana después. Leer en voz alta no es "inútil", solo menos eficaz.' },
      { q: 'What do the scientists suggest at the end?', opts: ['Students should sing in exams.', 'A little rhythm could improve studying.', 'Teachers should stop using songs.', 'Music is bad for memory.'], ans: 1, why: '*They do think that a little rhythm can make studying more effective*. Y dicen expresamente que NO hay que cantar en los exámenes.' }
    ]
  },
  {
    id: 'p3', title: 'Cómo dejar de procrastinar', level: 'B2–C1', type: 'gapped',
    tip: 'Mira las palabras que enlazan: *This, That is why, Once you…, People who…*. Sobran 2 frases.',
    text: [
      'We all put things off from time to time. Psychologists say that this is not usually about laziness; rather, it is about managing uncomfortable feelings. When a task seems boring or difficult, we choose something more pleasant instead. {1} Unfortunately, the relief does not last long, and the task is still waiting for us.',
      'One way to break the habit is to make the first step very small. {2} Once you have started, it is much easier to carry on.',
      'It also helps to remove distractions. Researchers found that people who left their phones in another room finished tasks faster than those who kept them on the desk. {3} That is why, before you start work, it is best to put your phone somewhere you cannot see it.',
      'Finally, do not be too hard on yourself. {4} People who forgive themselves for putting things off are less likely to do it again next time.'
    ],
    sentences: {
      A: "For example, instead of 'writing the report', you might simply open the document and type the title.",
      B: 'The reason is that even a silent phone can pull our attention away.',
      C: 'This gives us a feeling of relief straight away.',
      D: 'Studies suggest that guilt actually makes the problem worse.',
      E: 'Most people are surprised to learn how many hours they spend online each day.',
      F: 'A few years ago, many companies introduced longer working hours.'
    },
    gaps: [
      { n: 1, ans: 'C', why: '*This* = elegir algo más agradable. Y la frase siguiente habla de *the relief* (alivio): C lo introduce.' },
      { n: 2, ans: 'A', why: 'Tras "dar un primer paso muy pequeño", A da un ejemplo; después, *Once you have started* continúa con empezar.' },
      { n: 3, ans: 'B', why: 'Explica la razón del experimento del móvil. Después, *That is why…* solo enlaza con una razón.' },
      { n: 4, ans: 'D', why: 'Tras "no seas duro contigo", D explica por qué (la culpa empeora el problema); luego, quienes se perdonan repiten menos.' }
    ]
  }
];

/* ===== Listening (guiones originales; la app los lee con la voz del dispositivo) ===== */
const LISTENING = [
  {
    id: 'l1', title: '¿Cómo van al centro?', level: 'A2', kind: 'dialogue', speakers: ['F', 'M'],
    lines: [
      { s: 1, t: 'Shall we go into town by bus, or shall we take your car?' },
      { s: 0, t: "The car's at the garage until Friday, I'm afraid." },
      { s: 1, t: 'Okay. The train is quicker than the bus, but the station is a long walk from here.' },
      { s: 0, t: "True. Let's just take the bus. It stops right outside my flat." }
    ],
    qs: [
      { type: 'mc', q: 'How will they go to town?', opts: ['by car', 'by train', 'by bus'], ans: 2, why: 'El coche está en el taller; el tren queda lejos; el autobús para en la puerta. Se descartan dos y se elige el tercero.' }
    ]
  },
  {
    id: 'l2', title: 'El restaurante italiano', level: 'B1', kind: 'dialogue', speakers: ['F', 'M'],
    lines: [
      { s: 0, t: 'So, what did you think of the new Italian place?' },
      { s: 1, t: 'The pasta was fantastic, but I thought it was a bit expensive.' },
      { s: 0, t: "I agree about the food. Best I've had in ages. And the waiters were lovely, though I didn't think the prices were too bad." },
      { s: 1, t: 'Maybe. Anyway, we should go again.' }
    ],
    qs: [
      { type: 'mc', q: 'What did they both like about the restaurant?', opts: ['the prices', 'the food', 'the service'], ans: 1, why: 'Pregunta con *both*: los dos alaban la comida. Los precios solo le parecen bien a ella; el servicio solo lo menciona ella.' }
    ]
  },
  {
    id: 'l3', title: 'Daniel y su panadería', level: 'B2', kind: 'monologue', speakers: ['M'],
    lines: [
      { s: 0, t: "Honestly, when I opened the bakery five years ago, I thought it would fail within a year. I'd always wanted to be a chef, but my parents persuaded me to study accountancy first, which I'm now quite glad about, because I understand the business side. I chose this street because it's quiet, though a friend told me that a busier area would be better. I didn't listen, and I'm pleased I didn't. Now I'm surprised by how many regular customers I have." }
    ],
    qs: [
      { type: 'mc', q: 'How did Daniel feel when he opened the bakery?', opts: ['confident it would succeed', 'worried it would not last', 'excited about hiring staff'], ans: 1, why: '*I thought it would fail within a year*: temía que no durara.' },
      { type: 'mc', q: 'Why did he study accountancy?', opts: ['His parents persuaded him.', 'He wanted to run a business.', 'He could not become a chef.'], ans: 0, why: '*I\'d always wanted to be a chef, but my parents persuaded me*.' },
      { type: 'mc', q: 'Why did he choose that street?', opts: ['A friend recommended it.', 'It was a busy area.', 'It was quiet.'], ans: 2, why: '*I chose this street because it\'s quiet*. El amigo recomendó una zona más concurrida, y no le hizo caso.' },
      { type: 'mc', q: 'How does he feel about his customers now?', opts: ['disappointed', 'surprised', 'annoyed'], ans: 1, why: '*I\'m surprised by how many regular customers I have*.' }
    ]
  },
  {
    id: 'l4', title: 'Acampar: dos amigos', level: 'B2', kind: 'dialogue', speakers: ['F', 'M'],
    lines: [
      { s: 0, t: 'Did you go camping this summer?' },
      { s: 1, t: 'Yes, in the mountains. It was wonderful, but honestly, packing the tent and planning the food took forever.' },
      { s: 0, t: 'I know! I used to love camping as a kid, but now it feels like a lot of work.' },
      { s: 1, t: 'Same here. But the quiet was worth it.' }
    ],
    qs: [
      { type: 'mc', q: 'What do they both say about camping nowadays?', opts: ['It takes a lot of preparation.', 'It is cheaper than staying in hotels.', 'It is better for children.'], ans: 0, why: 'Él: *packing the tent and planning the food took forever*. Ella: *it feels like a lot of work*. Los dos hablan del esfuerzo.' },
      { type: 'mc', q: 'How does the man feel about the trip overall?', opts: ["It wasn't worth the effort.", 'It was worth it for the quiet.', 'It was too noisy.'], ans: 1, why: '*The quiet was worth it*.' }
    ]
  },
  {
    id: 'l5', title: 'Cinco hablantes: transporte público', level: 'B2–C1', kind: 'extracts', speakers: ['F', 'M', 'F', 'M', 'F'],
    lines: [
      { s: 0, label: 'Speaker 1', t: "I've been commuting for ten years and I can count on one hand the times my train hasn't turned up. It isn't the cheapest, and it's often crowded, but I know exactly when I'll arrive, and that's all that matters to me." },
      { s: 1, label: 'Speaker 2', t: "I sold my car last year. I know buses aren't glamorous, but when I think of all the pollution cars create, I feel better taking the tram. If more people did it, the air in the city would be much cleaner." },
      { s: 2, label: 'Speaker 3', t: "I work late shifts, so I'm often out after midnight. What I appreciate is that the stations are well lit and there's always staff around. I've never felt uncomfortable, even on my own." },
      { s: 3, label: 'Speaker 4', t: "When my cousins visited from Japan, they found their way around without any help. The signs are in several languages and the map is really clear, so even people who don't speak the language can manage." },
      { s: 4, label: 'Speaker 5', t: "Honestly, the trains are slow and a bit old, and sometimes they're late. But with the monthly pass I pay less than I used to spend on petrol in a week, so I can't complain." }
    ],
    qs: [
      {
        type: 'match', q: 'What does each speaker value most about public transport in their city?',
        opts: ['It is cheap.', 'It is reliable.', 'The vehicles and stations are clean.', 'It is fast.', 'It is safe at night.', 'It connects the suburbs to the centre.', 'It is good for the environment.', 'It is easy for tourists to use.'],
        ans: ['B', 'G', 'E', 'H', 'A'],
        why: [
          'Cuenta las veces que el tren no ha llegado (casi ninguna) y dice *I know exactly when I\'ll arrive*: fiabilidad. Admite que es caro y va lleno.',
          'Vendió el coche por la contaminación: *the pollution cars create*. Habla de aire limpio, no de vehículos limpios.',
          'Trabaja de noche y valora *well lit… staff around… never felt uncomfortable*.',
          'Sus primos encontraron el camino solos: carteles en varios idiomas y mapa claro.',
          'Dice que es lento y viejo, pero *I pay less than I used to spend on petrol*: el precio.'
        ]
      }
    ]
  },
  {
    id: 'l6', title: 'Carrera benéfica (rellenar huecos)', level: 'B1', kind: 'monologue', speakers: ['F'],
    lines: [
      { s: 0, t: 'Hello everyone, and welcome to the City Charity Run. This year we are raising money for the local hospital. The run starts at nine o\'clock in the central park, so please arrive by half past eight to collect your number. There are two routes: a short one of three kilometres for families, and a longer one of ten kilometres. Everyone who finishes will receive a free medal. Please remember to wear comfortable shoes, because some parts of the route are quite steep. Water will be available at the finish line. Finally, a big thank you to our sponsor, a local supermarket, which has paid for all the T-shirts.' }
    ],
    qs: [
      { type: 'gap', q: 'The money raised is for the local ____.', answers: ['hospital'], why: '*Raising money for the local hospital*.' },
      { type: 'gap', q: 'Runners should arrive by ____ to collect their number.', answers: ['half past eight', 'half past 8', '8.30', '8:30', 'eight thirty', '830'], why: '*Arrive by half past eight*. La carrera empieza a las nueve.' },
      { type: 'gap', q: 'The longer route is ____ kilometres.', answers: ['ten', '10'], why: '*A longer one of ten kilometres*. La corta tiene tres.' },
      { type: 'gap', q: 'Everyone who finishes will receive a free ____.', answers: ['medal'], why: '*A free medal*.' },
      { type: 'gap', q: 'The T-shirts were paid for by a local ____.', answers: ['supermarket'], why: '*Our sponsor, a local supermarket, has paid for all the T-shirts*.' }
    ]
  },
  {
    id: 'l7', title: 'Empezar en el gimnasio', level: 'B2', kind: 'monologue', speakers: ['F'],
    lines: [
      { s: 0, t: "I started going to the gym eight months ago because my doctor told me I needed more exercise. At first I hated it. I felt everyone was staring at me. But then I joined a beginners' class and met people in the same situation. Now I go three times a week, and what I enjoy most isn't the exercise itself, it's the friendships I've made." }
    ],
    qs: [
      { type: 'mc', q: 'Why did she start going to the gym?', opts: ['A friend invited her.', 'Her doctor advised it.', 'She wanted to lose weight.'], ans: 1, why: '*My doctor told me I needed more exercise*.' },
      { type: 'mc', q: 'How did she feel at first?', opts: ['self-conscious', 'bored', 'exhausted'], ans: 0, why: '*I felt everyone was staring at me*: se sentía observada, incómoda.' },
      { type: 'mc', q: 'What does she enjoy most now?', opts: ['the classes', 'the friendships', 'the exercise'], ans: 1, why: '*What I enjoy most isn\'t the exercise itself, it\'s the friendships*. Truco: "no es X, es Y" indica que la respuesta es Y.' }
    ]
  },
  {
    id: 'l8', title: 'Teletrabajo: dos compañeros', level: 'C1', kind: 'dialogue', speakers: ['F', 'M'],
    lines: [
      { s: 0, t: "I'm in favour of working from home, but honestly, I'm not convinced two days a week is enough." },
      { s: 1, t: "Really? I'd be happy with one. I find I miss the office when I'm at home for too long." },
      { s: 0, t: 'I suppose it depends on the person. I get much more done without interruptions.' },
      { s: 1, t: "Fair enough. Though I think the team benefits when we're all in the same room." }
    ],
    qs: [
      { type: 'mc', q: "What is the woman's opinion of the proposal?", opts: ['Two days is too many.', 'Two days is not enough.', "Working from home doesn't suit her."], ans: 1, why: '*I\'m not convinced two days a week is enough*.' },
      { type: 'mc', q: 'What does the man think?', opts: ['One day would be enough.', 'He prefers working at home.', "Team spirit isn't important."], ans: 0, why: '*I\'d be happy with one*. Echa de menos la oficina y cree que el equipo gana estando junto.' },
      { type: 'mc', q: 'Why does the woman like working at home?', opts: ['She has a better computer.', 'She is interrupted less.', 'She saves money on travel.'], ans: 1, why: '*I get much more done without interruptions*.' }
    ]
  }
];
