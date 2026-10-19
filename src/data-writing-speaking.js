/* ===== Writing: enunciados de práctica (originales) ===== */
const WRITING = [
  { id: 'w1', part: 1, kind: 'email', register: 'informal', min: 50, title: 'Invitación de cumpleaños',
    brief: 'Your friend Alex has invited you to a birthday party next Saturday. Write an email to Alex.',
    points: ['thank Alex for the invitation', 'say whether you can come and why', 'offer to bring something'] },
  { id: 'w2', part: 1, kind: 'email', register: 'informal', min: 50, title: 'Un amigo viene a tu ciudad',
    brief: 'Your English-speaking friend Kim is coming to visit your city. Write an email to Kim.',
    points: ['say when you can meet', 'explain what you plan to do together', 'tell Kim what clothes to bring'] },
  { id: 'w3', part: 1, kind: 'email', register: 'formal', min: 50, title: 'Auriculares defectuosos',
    brief: 'You bought a pair of headphones online, but they do not work. Write an email to the shop.',
    points: ['say what you bought and when', 'explain what the problem is', 'say what you want the shop to do'] },
  { id: 'w4', part: 1, kind: 'email', register: 'formal', min: 50, title: 'Curso de idiomas',
    brief: 'You want to join a language course at a local school. Write an email to the school.',
    points: ['say which course you are interested in', 'describe your level', 'ask about the price and the start date'] },
  { id: 'w5', part: 1, kind: 'email', register: 'informal', min: 50, title: 'Nuevo trabajo',
    brief: 'You have started a new job. Write an email to a friend.',
    points: ['say what the job is', 'explain what you like about it', 'invite your friend to meet at the weekend'] },
  { id: 'w6', part: 1, kind: 'email', register: 'formal', min: 50, title: 'No puedes ir a una cita',
    brief: 'You cannot attend an appointment with your manager next Tuesday. Write an email to your manager.',
    points: ['say that you cannot come and explain why', 'suggest another day', 'apologise for the inconvenience'] },
  { id: 'w7', part: 2, kind: 'email', register: 'formal', min: 180, title: 'Centro sin coches',
    brief: 'Your town council is thinking of closing the city centre to cars. Write an email to the council giving your opinion.',
    points: ['what advantages it would bring', 'what problems it might cause', 'what you suggest'] },
  { id: 'w8', part: 2, kind: 'article', register: 'neutral', min: 180, title: 'Aprender idiomas hoy',
    brief: 'You see this announcement in an English-language magazine: "Is learning a language still essential today? Write an article giving your views."',
    points: ['why people learn languages', 'what the best way to learn is', 'whether apps can replace teachers'] },
  { id: 'w9', part: 2, kind: 'report', register: 'formal', min: 180, title: 'Mejorar la zona de estudio',
    brief: 'Your school wants to improve its study area. Write a report for the director.',
    points: ['what is wrong at the moment', 'what should be improved', 'roughly how much it might cost'] },
  { id: 'w10', part: 2, kind: 'email', register: 'informal', min: 180, title: 'Estudiar en el extranjero',
    brief: 'Your friend wants advice about studying abroad. Write an email to your friend.',
    points: ['the advantages', 'the difficulties', 'your advice'] },
  { id: 'w11', part: 2, kind: 'email', register: 'formal', min: 180, title: 'Clases de inglés en la empresa',
    brief: 'Your company wants to offer free English classes. Write an email to the Human Resources department.',
    points: ['why the classes would be useful', 'when they should take place', 'what you would like to learn'] },
  { id: 'w12', part: 2, kind: 'article', register: 'neutral', min: 180, title: 'Redes sociales',
    brief: 'Write an article for a student magazine called "Social media: friend or enemy?"',
    points: ['how social media helps people', 'what the dangers are', 'your recommendation'] }
];

const PHRASES = {
  informal: {
    'Empezar': ['Hi Sam,', 'Hello Sam,', 'Dear Sam,'],
    'Motivo': ["I'm writing to tell you…", 'Thanks so much for…', 'I just wanted to say…'],
    'Opinión': ['I reckon…', 'I think…', "If you ask me,"],
    'Contraste': ['But', 'Still,', 'Even so,'],
    'Sugerir': ['How about…?', "Why don't we…?", 'It would be great if…'],
    'Cerrar': ['Let me know!', 'Write back soon!', 'Take care,', 'Best wishes,']
  },
  formal: {
    'Empezar': ['Dear Sir or Madam,', 'Dear Mr Harris,', 'Dear Ms Taylor,'],
    'Motivo': ['I am writing to ask about…', 'I am writing regarding…', 'I am writing to complain about…'],
    'Opinión': ['In my opinion,', 'I would argue that', 'It seems to me that'],
    'Añadir': ['In addition,', 'Moreover,', 'Furthermore,'],
    'Contraste': ['However,', 'Nevertheless,', 'On the other hand,', 'Although', 'Despite'],
    'Resultado': ['Therefore,', 'As a result,', 'Consequently,'],
    'Sugerir': ['I would recommend…', 'It would be a good idea to…'],
    'Pedir': ['I would be grateful if you could…', 'Could you please…?'],
    'Cerrar': ['I look forward to hearing from you.', 'Yours sincerely,', 'Yours faithfully,', 'Kind regards,']
  }
};

/* Conectores que se buscan en el texto (para contar variedad) */
const LINKERS = ['however', 'although', 'though', 'even though', 'whereas', 'despite', 'in spite of', 'nevertheless', 'on the other hand', 'moreover', 'furthermore', 'in addition', 'besides', 'therefore', 'as a result', 'consequently', 'for example', 'for instance', 'such as', 'first of all', 'finally', 'in conclusion', 'to sum up', 'because', 'since', 'so that', 'unless', 'as long as', 'while', 'in my opinion', 'firstly', 'secondly', 'also'];

/* Errores típicos de hispanohablantes: [regex, consejo] */
const LINT_RULES = [
  [/\bI (?:have|am having) (\d+) years?\b/i, 'La edad va con *to be*: "I am 25 (years old)".'],
  [/\bpeople is\b/i, '*People* es plural: "people are".'],
  [/\binformations\b|\badvices\b|\bfurnitures\b|\bnews are\b|\binformation are\b|\ban? advice\b|\ban? information\b/i, '*Information, advice, news, furniture* no se cuentan: sin plural ni *a/an* ("a piece of advice").'],
  [/\b(?:he|she|it) don'?t\b/i, 'Con he/she/it: "doesn\'t".'],
  [/\bI(?: a|')?m agree\b|\bI am agree\b/i, '"I agree" (agree es verbo, no lleva *am*).'],
  [/\bdepend(?:s|ed)? (?:of|from|in)\b/i, '"depend on".'],
  [/\bin (?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i, 'Con días: "on Monday".'],
  [/\b(?:make|makes|making|made) (?:the |my |your |his |her |our |their )?homework\b/i, '"do homework" (make para decisiones, errores, planes…).'],
  [/\bsince (?:\d+|two|three|four|five|six|seven|eight|nine|ten|a few|several) (?:years?|months?|weeks?|days?|hours?)\b/i, 'Con una duración se usa *for* ("for three years"); *since* va con un momento ("since 2020").'],
  [/(?:^|[.!?]\s+)is (?:raining|snowing|late|important|difficult|necessary|possible)\b/i, 'El inglés exige sujeto: "It is raining / It is important…".'],
  [/\b(?:explain|say) me\b/i, '"explain (it) to me" / "tell me" (say y explain llevan *to*).'],
  [/\bmore (?:better|bigger|taller|easier|cheaper|worse|smaller|older|faster)\b/i, 'Comparativo corto: sin *more* ("better", "bigger").'],
  [/\b(?:can|could|must|should|will|would|might) to\b/i, 'Los modales no llevan *to* ("I can go", "you should study").'],
  [/\b(?:interestings|importants|beautifuls|goods|bigs|newes)\b/i, 'Los adjetivos no tienen plural.'],
  [/\bthe life is\b/i, 'Hablando en general sin artículo: "Life is…".'],
  [/\bI like very much\b|\bI love very much\b/i, '"I like it very much" (hace falta el objeto).'],
  [/\bdiscuss(?:ed|es|ing)? about\b/i, '*Discuss* no lleva preposición.'],
  [/\bmarried with\b/i, '"married to".'],
  [/\bgo(?:es|ing)? to home\b|\bwent to home\b/i, '"go home" (sin *to*).'],
  [/\bI(?:'m| am) (?:interesting|boring|exciting|tiring) (?:in|about|of)\b/i, 'Cómo te sientes: *-ed* ("interested", "bored"). Lo que provoca el sentimiento: *-ing*.'],
  [/\bmy friend and me (?:went|go|are|were|have|had)\b|\bme and my (?:friend|brother|sister|mum|dad) (?:went|go|are|were|have|had)\b/i, 'Como sujeto: "My friend and I…".'],
  [/\bmuch (?:people|friends|books|things|students|cars)\b/i, 'Con contables: *many* ("many people").'],
  [/\bi\b(?=[\s,.;!?])/, 'El pronombre *I* siempre va en mayúscula.']
];

/* ===== Speaking ===== */
const SPEAK_TIPS = 'Estructura R-R-E: Respuesta + Razón + Ejemplo. Si te quedas en blanco: "Well, let me think…" y sigue.';
const SPEAKING = [
  { id: 's1', cat: 'Personal', q: 'Tell me about your family.' },
  { id: 's2', cat: 'Personal', q: 'What do you do for a living, or what are you studying?' },
  { id: 's3', cat: 'Personal', q: 'Describe your hometown. What do you like about it?' },
  { id: 's4', cat: 'Personal', q: 'What do you usually do in your free time?' },
  { id: 's5', cat: 'Personal', q: "What's your daily routine like?" },
  { id: 's6', cat: 'Personal', q: 'Tell me about your best friend.' },
  { id: 's7', cat: 'Personal', q: 'What kind of food do you like, and why?' },
  { id: 's8', cat: 'Personal', q: 'Why are you learning English?' },
  { id: 's9', cat: 'Personal', q: 'What are your plans for the next year?' },
  { id: 's10', cat: 'Pasado', q: 'Tell me about a memorable holiday.' },
  { id: 's11', cat: 'Pasado', q: 'Describe a time when you helped someone.' },
  { id: 's12', cat: 'Pasado', q: 'Tell me about a difficult exam or challenge you had.' },
  { id: 's13', cat: 'Pasado', q: 'What did you do last weekend?' },
  { id: 's14', cat: 'Pasado', q: 'Tell me about a gift you will never forget.' },
  { id: 's15', cat: 'Opinión', q: 'Is social media good or bad for young people? Why?' },
  { id: 's16', cat: 'Opinión', q: 'Should everyone learn a second language at school?' },
  { id: 's17', cat: 'Opinión', q: 'Is it better to live in a city or in the countryside?' },
  { id: 's18', cat: 'Opinión', q: 'Does technology make our lives easier?' },
  { id: 's19', cat: 'Opinión', q: 'Is working from home better than working in an office?' },
  { id: 's20', cat: 'Opinión', q: 'What can ordinary people do to protect the environment?' },
  { id: 's21', cat: 'Opinión', q: 'Do you think people read less nowadays? Why?' },
  { id: 's22', cat: 'Hipotético', q: 'What would you do if you won a lot of money?' },
  { id: 's23', cat: 'Hipotético', q: 'If you could live anywhere in the world, where would you live?' },
  { id: 's24', cat: 'Hipotético', q: 'If you could change one thing about your town, what would it be?' },
  { id: 's25', cat: 'Hipotético', q: 'Imagine you could meet any famous person. Who would you choose and why?' },
  { id: 's26', cat: 'Foto', scene: '🏖️ 🏄 🌴 ☀️ 👨‍👩‍👧', q: 'Describe this picture: a family on a beach.' },
  { id: 's27', cat: 'Foto', scene: '🍽️ 👩‍🍳 🍷 🕯️ 👫', q: 'Describe this picture: two people having dinner in a restaurant.' },
  { id: 's28', cat: 'Foto', scene: '💻 ☕ 📋 👩‍💼 🪟', q: 'Describe this picture: a woman working in an office.' },
  { id: 's29', cat: 'Foto', scene: '🛒 🥕 🍎 🧺 👵', q: 'Describe this picture: an older woman shopping at a market.' },
  { id: 's30', cat: 'Foto', scene: '📚 🏫 ✏️ 🧑‍🏫 👧', q: 'Describe this picture: a teacher and students in a classroom.' },
  { id: 's31', cat: 'Foto', scene: '🌳 🧺 🥪 🐕 👨‍👩‍👦', q: 'Describe this picture: a family having a picnic in a park.' }
];
const FILLERS = ['um', 'uh', 'er', 'erm', 'like', 'you know', 'basically', 'actually'];
const SPEAK_PHRASES = [
  ['Ganar tiempo', ['Well, let me think…', "That's a good question.", 'To be honest,']],
  ['No sé la palabra', ["It's a kind of…", "It's something you use to…", "I can't remember the word, but it's like…"]],
  ['Opinión', ['In my opinion,', 'I tend to think that…', "As far as I'm concerned,"]],
  ['Foto', ['This photo shows…', 'In the foreground / background…', 'It looks as if…', 'They might be…']],
  ['Corregirte', ['I mean…', 'Sorry, what I meant was…']]
];
