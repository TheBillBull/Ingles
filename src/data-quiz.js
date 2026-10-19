/* ===== Banco de preguntas (Use of English / Reading). Preguntas originales, no son del examen. ===== */
const TOPICS = {
  tiempos: 'Tiempos verbales',
  condicionales: 'Condicionales',
  prep: 'Preposiciones',
  phrasal: 'Phrasal verbs',
  colocaciones: 'Colocaciones',
  conectores: 'Conectores',
  patrones: 'Verb patterns (-ing / to)',
  relativos: 'Relativos y pasiva',
  falsos: 'Falsos amigos',
  errores: 'Errores típicos',
  vocab: 'Vocabulario'
};
const QUIZ = [];
let _qn = 0;
const mc = (topic, level, q, opts, ans, why) => QUIZ.push({ id: 'q' + (++_qn), type: 'mc', topic, level, q, opts, ans, why });
const gp = (topic, level, q, answers, why) => QUIZ.push({ id: 'q' + (++_qn), type: 'gap', topic, level, q, answers, why });
const WHICH = 'Which sentence is correct?';

/* --- Tiempos verbales --- */
mc('tiempos', 'B1', 'I ____ in Madrid since 2019.', ['live', 'have lived', 'am living', 'lived'], 1, 'Con *since* + momento de inicio se usa present perfect: *have lived*.');
mc('tiempos', 'B1', 'When we arrived, the film ____.', ['had already started', 'already starts', 'was already start', 'has already started'], 0, 'Acción anterior a otra acción pasada: past perfect (*had started*).');
mc('tiempos', 'B1', 'Look at those black clouds! It ____ rain.', ['is going to', 'rains', 'rained', 'has rained'], 0, 'Hay evidencia en el presente, así que se usa *going to*.');
mc('tiempos', 'B1', 'She ____ TV when the phone rang.', ['watched', 'was watching', 'has watched', 'is watching'], 1, 'Acción en curso interrumpida por otra: past continuous.');
gp('tiempos', 'B1', "I haven't seen Tom ____ last Monday.", ['since'], '*Since* + momento de inicio. Con una duración se usa *for*.');
gp('tiempos', 'B1', 'We have known each other ____ ten years.', ['for'], '*For* + duración. Con un momento concreto se usa *since*.');
mc('tiempos', 'B2', 'By the time we reached the station, the train ____.', ['left', 'had left', 'has left', 'was leaving'], 1, 'Acción anterior a otro momento pasado: past perfect (*had left*).');
mc('tiempos', 'B1', 'Have you ever ____ sushi?', ['ate', 'eaten', 'eat', 'eating'], 1, 'Present perfect: *have* + participio (*eaten*).');
mc('tiempos', 'B2', 'Yesterday she said she ____ very tired.', ['is', 'was', 'has been', 'will be'], 1, 'Estilo indirecto: el verbo retrocede un tiempo (*is* pasa a *was*).');
mc('tiempos', 'A2', 'At the moment, my brother ____ a shower.', ['has', 'is having', 'have', 'having'], 1, 'Acción en curso ahora: present continuous (*is having*).');
mc('tiempos', 'A2', 'I ____ to the gym every Monday and Thursday.', ['go', 'am going', 'have gone', 'went'], 0, 'Rutina habitual: present simple.');
mc('tiempos', 'B2', "I'm exhausted. I ____ since six o'clock this morning.", ['work', 'am working', 'have been working', 'worked'], 2, 'Acción que empezó en el pasado y sigue, con *since*: present perfect continuous.');

/* --- Condicionales --- */
mc('condicionales', 'B1', "If it ____ tomorrow, we'll stay at home.", ['will rain', 'rains', 'rained', 'would rain'], 1, 'Primer condicional: *if* + presente, *will* + infinitivo. Tras *if* no se usa *will*.');
mc('condicionales', 'B2', 'If I had more money, I ____ a bigger flat.', ['will rent', 'would rent', 'rented', 'would have rented'], 1, 'Segundo condicional: *if* + pasado, *would* + infinitivo.');
mc('condicionales', 'B2', 'If she had studied harder, she ____ the exam.', ['would pass', 'would have passed', 'will pass', 'passed'], 1, 'Tercer condicional (pasado irreal): *if* + past perfect, *would have* + participio.');
mc('condicionales', 'B2', 'I wish I ____ more free time.', ['have', 'had', 'would have', 'will have'], 1, '*Wish* + pasado para deseos sobre el presente.');
mc('condicionales', 'B2', '____ you leave now, you will miss the bus.', ['If', 'Unless', 'When', 'Although'], 1, '*Unless* = *if not* (a menos que). Se usa con presente.');
gp('condicionales', 'B2', 'If I ____ (know) about the party, I would have gone.', ['had known'], 'Tercer condicional: *if* + past perfect (*had known*).');
mc('condicionales', 'B1', 'What would you do if you ____ the lottery?', ['win', 'won', 'will win', 'would win'], 1, 'Segundo condicional: *if* + pasado simple.');
mc('condicionales', 'C1', '____ I known the truth, I would have said something.', ['If', 'Had', 'Were', 'Should'], 1, 'Inversión del tercer condicional: *Had I known* = *If I had known*.');
mc('condicionales', 'C1', 'If I ____ that job last year, I would be earning more now.', ['took', 'had taken', 'would take', 'have taken'], 1, 'Condicional mixto: *if* + past perfect (pasado) y *would* + infinitivo (presente).');

/* --- Preposiciones --- */
gp('prep', 'B1', "I'm looking forward ____ meeting you.", ['to'], '*Look forward to* + -ing. Aquí *to* es preposición.');
gp('prep', 'B1', 'It depends ____ the weather.', ['on'], '*Depend on*, no *of*.');
gp('prep', 'B1', "She's very good ____ languages.", ['at'], '*Good at* + sustantivo o -ing.');
gp('prep', 'B1', 'We arrived ____ the airport at six.', ['at'], '*Arrive at* un lugar concreto; *arrive in* una ciudad o un país.');
gp('prep', 'B1', "He's married ____ a doctor.", ['to'], '*Married to*, no *with*.');
gp('prep', 'A2', "I'll see you ____ Monday.", ['on'], '*On* + días.');
gp('prep', 'B1', "She's interested ____ photography.", ['in'], '*Interested in*.');
gp('prep', 'B1', "I'm afraid ____ spiders.", ['of'], '*Afraid of*.');
gp('prep', 'B1', 'Thanks for waiting ____ me.', ['for'], '*Wait for*.');
gp('prep', 'B2', "He's responsible ____ the project.", ['for'], '*Responsible for*.');
gp('prep', 'B1', "She's very proud ____ her daughter.", ['of'], '*Proud of*.');
gp('prep', 'A2', 'The meeting starts ____ 9 a.m.', ['at'], '*At* + horas.');
gp('prep', 'A2', 'I was born ____ 1998.', ['in'], '*In* + años, meses y estaciones.');

/* --- Phrasal verbs --- */
gp('phrasal', 'B1', "Don't give ____! You can do it.", ['up'], '*Give up* = rendirse.');
gp('phrasal', 'B1', 'We ran ____ milk, so I went to the shop.', ['out of'], '*Run out of* = quedarse sin.');
gp('phrasal', 'B1', 'She wants to take ____ yoga this autumn.', ['up'], '*Take up* = empezar una afición.');
gp('phrasal', 'B1', "Can you look ____ my cat while I'm away?", ['after'], '*Look after* = cuidar.');
gp('phrasal', 'B1', 'The meeting was put ____ until next week.', ['off'], '*Put off* = aplazar.');
gp('phrasal', 'B2', 'He came ____ with a brilliant idea.', ['up'], '*Come up with* = idear. El hueco es *up*; *with* ya está escrito.');
gp('phrasal', 'B2', "It's hard to get ____ with my neighbours: we never agree.", ['on', 'along'], '*Get on / get along with* = llevarse bien con.');
mc('phrasal', 'B2', '"It turned out that he was right." What does *turned out* mean?', ['he turned around', 'it finally proved to be the case', 'he went outside', 'he got angry'], 1, '*Turn out* = resultar, acabar siendo.');
gp('phrasal', 'B2', 'The concert was called ____ because of the storm.', ['off'], '*Call off* = cancelar.');
gp('phrasal', 'B2', 'I need to fill ____ this form before Friday.', ['in', 'out'], '*Fill in / fill out* = rellenar un formulario.');
gp('phrasal', 'B2', 'She is slowly getting ____ a bad cold.', ['over'], '*Get over* = recuperarse de.');

/* --- Colocaciones --- */
mc('colocaciones', 'B1', 'I need to ____ a decision soon.', ['do', 'make', 'take', 'have'], 1, '*Make a decision*. Igual que *make a mistake* o *make an effort*.');
mc('colocaciones', 'B1', 'She always ____ her best in exams.', ['makes', 'does', 'takes', 'keeps'], 1, '*Do your best*.');
mc('colocaciones', 'B1', 'Please ____ attention to the instructions.', ['make', 'pay', 'put', 'do'], 1, '*Pay attention*.');
mc('colocaciones', 'B1', "Let's ____ in touch after the course.", ['keep', 'hold', 'make', 'put'], 0, '*Keep in touch* = mantener el contacto.');
mc('colocaciones', 'B2', 'He ____ a big risk when he invested all his savings.', ['did', 'made', 'took', 'had'], 2, '*Take a risk*.');
mc('colocaciones', 'B1', "I'd like to ____ a complaint about the service.", ['do', 'make', 'tell', 'say'], 1, '*Make a complaint*.');
mc('colocaciones', 'B2', 'The team must ____ the deadline.', ['meet', 'catch', 'touch', 'arrive'], 0, '*Meet a deadline* = cumplir un plazo.');
mc('colocaciones', 'B2', 'After a long discussion, they finally ____ a conclusion.', ['arrived', 'reached', 'made', 'took'], 1, '*Reach a conclusion*. (*Arrive* necesitaría *at*.)');
mc('colocaciones', 'B1', 'I caught a bad ____ last week and stayed in bed.', ['cold', 'illness', 'health', 'hospital'], 0, '*Catch a cold*.');
mc('colocaciones', 'B2', 'She has ____ great progress since September.', ['done', 'made', 'taken', 'got'], 1, '*Make progress*.');
mc('colocaciones', 'B2', 'He ____ a promise and told everyone the secret.', ['broke', 'cracked', 'failed', 'lost'], 0, '*Break a promise*.');

/* --- Conectores --- */
mc('conectores', 'B1', '____ it was raining, we went for a walk.', ['Although', 'Despite', 'However', 'Because'], 0, '*Although* + sujeto + verbo. *Despite* va con sustantivo o -ing.');
mc('conectores', 'B1', '____ the rain, we went for a walk.', ['Although', 'Despite', 'However', 'Because'], 1, '*Despite* + sustantivo (*the rain*).');
mc('conectores', 'B1', 'I was very tired. ____, I finished the report.', ['Because', 'Although', 'However', 'Despite'], 2, '*However* abre una frase nueva con contraste.');
mc('conectores', 'B2', 'The trains were cancelled; ____, we took a taxi.', ['although', 'despite', 'therefore', 'however'], 2, '*Therefore* = por lo tanto (resultado).');
mc('conectores', 'B2', 'She loves sport, ____ her brother prefers reading.', ['whereas', 'because', 'unless', 'despite'], 0, '*Whereas* = mientras que (contraste entre dos cosas).');
mc('conectores', 'B1', "I'll call you ____ I arrive.", ['unless', 'although', 'as soon as', 'despite'], 2, '*As soon as* = en cuanto.');
mc('conectores', 'B1', "You can't enter ____ you have a ticket.", ['unless', 'because', 'despite', 'whereas'], 0, '*Unless* = a menos que.');
mc('conectores', 'B1', 'He stayed at home ____ he was ill.', ['although', 'because', 'despite', 'however'], 1, '*Because* introduce la causa.');
mc('conectores', 'B2', 'The hotel was cheap. ____, it was clean and comfortable.', ['Moreover', 'Although', 'Unless', 'Despite'], 0, '*Moreover* = además (añade una idea).');
mc('conectores', 'B2', '____ his lack of experience, he got the job.', ['Despite', 'Although', 'Whereas', 'Unless'], 0, '*Despite* + sustantivo (*his lack of experience*).');

/* --- Verb patterns --- */
gp('patrones', 'B2', 'She succeeded ____ finding a job in Dublin.', ['in'], '*Succeed in* + -ing.');
gp('patrones', 'B1', 'Tim managed ____ finish the ride.', ['to'], '*Manage to* + infinitivo.');
mc('patrones', 'B1', 'I enjoy ____ in the sea.', ['swim', 'to swim', 'swimming', 'swam'], 2, '*Enjoy* + -ing.');
mc('patrones', 'B1', 'He suggested ____ to the cinema.', ['go', 'to go', 'going', 'went'], 2, '*Suggest* + -ing.');
mc('patrones', 'B2', 'I forgot ____ the door, so anyone could come in.', ['to lock', 'locking', 'lock', 'locked'], 0, '*Forget to do* = olvidar hacer algo.');
mc('patrones', 'B1', 'I look forward to ____ you next week.', ['see', 'seeing', 'to see', 'saw'], 1, '*Look forward to* + -ing (aquí *to* es una preposición).');
mc('patrones', 'B1', 'She decided ____ the job.', ['to take', 'taking', 'take', 'took'], 0, '*Decide* + *to* + infinitivo.');
mc('patrones', 'B2', 'I clearly remember ____ the door, so someone else must have opened it.', ['to lock', 'locking', 'lock', 'locked'], 1, '*Remember doing* = recordar haber hecho algo.');
mc('patrones', 'B2', 'He refused ____ me the answer.', ['to give', 'giving', 'give', 'gave'], 0, '*Refuse* + *to* + infinitivo.');

/* --- Relativos y pasiva --- */
mc('relativos', 'B1', 'The woman ____ lives next door is a doctor.', ['who', 'which', 'whose', 'where'], 0, '*Who* para personas.');
mc('relativos', 'B1', 'This is the village ____ I was born.', ['who', 'which', 'where', 'whose'], 2, '*Where* para lugares.');
mc('relativos', 'B2', 'The man ____ car was stolen called the police.', ['who', 'which', 'whose', 'where'], 2, '*Whose* indica posesión.');
mc('relativos', 'B1', 'English ____ in many countries.', ['speaks', 'is spoken', 'is speaking', 'spoke'], 1, 'Pasiva en presente: *is spoken*.');
mc('relativos', 'B2', 'The report ____ by the manager yesterday.', ['wrote', 'was written', 'is written', 'has written'], 1, 'Pasiva en pasado: *was written*.');
mc('relativos', 'B2', 'My bike ____ last night.', ['stole', 'was stolen', 'has stolen', 'is stolen'], 1, 'Pasiva en pasado: *was stolen*.');
mc('relativos', 'B2', 'The windows ____ every week.', ['clean', 'are cleaned', 'cleaned', 'are cleaning'], 1, 'Pasiva en presente: *are cleaned*.');
mc('relativos', 'B2', 'The book ____ I bought yesterday is excellent.', ['who', 'which', 'where', 'whose'], 1, '*Which* para cosas.');
mc('relativos', 'C1', "The new law, ____ was passed last month, affects everyone.", ['that', 'which', 'what', 'who'], 1, 'Oración de relativo entre comas: *which* (con *that* no se usan comas).');

/* --- Falsos amigos --- */
mc('falsos', 'B1', '"Actually, I don\'t like coffee." ¿Qué significa *actually*?', ['actualmente', 'de hecho', 'antiguamente', 'rápidamente'], 1, '*Actually* = de hecho. "Actualmente" es *currently*.');
mc('falsos', 'B1', "I'm going to the ____ to borrow a book.", ['library', 'bookshop', 'stationery', 'school'], 0, '*Library* = biblioteca. Librería = *bookshop*.');
mc('falsos', 'B2', 'She felt very ____ when she fell in front of everyone.', ['embarrassed', 'pregnant', 'sensitive', 'sensible'], 0, '*Embarrassed* = avergonzada. Embarazada = *pregnant*.');
mc('falsos', 'B2', 'He ____ to be ill, but he was fine.', ['intended', 'pretended', 'expected', 'attended'], 1, '*Pretend* = fingir. Pretender = *intend*.');
mc('falsos', 'B2', "He cries at sad films; he's very ____.", ['sensible', 'sensitive', 'sensational', 'senseless'], 1, '*Sensitive* = sensible (emocionalmente). *Sensible* = sensato.');
mc('falsos', 'B2', 'After a long wait, the bus ____ arrived.', ['actually', 'currently', 'eventually', 'possibly'], 2, '*Eventually* = finalmente.');
mc('falsos', 'B2', "I'm ____ studying for my exam, so I can't talk.", ['actually', 'currently', 'eventually', 'finally'], 1, '*Currently* = actualmente, ahora mismo.');
mc('falsos', 'B2', 'I need to ____ the meeting on Friday.', ['assist', 'attend', 'pretend', 'intend'], 1, '*Attend* = asistir a. *Assist* = ayudar.');
mc('falsos', 'B2', "I didn't ____ I had lost my keys until I got home.", ['realize', 'carry out', 'achieve', 'happen'], 0, '*Realize* = darse cuenta. Realizar = *carry out*.');

/* --- Errores típicos de hispanohablantes --- */
mc('errores', 'A2', WHICH, ['I have 25 years.', 'I am 25 years old.', 'I have 25 years old.', 'I am having 25 years.'], 1, 'La edad va con *to be*: *I am 25 (years old)*.');
mc('errores', 'B1', WHICH, ['People is friendly here.', 'People are friendly here.', 'People are friendlies here.', 'The people is friendly here.'], 1, '*People* es plural: *are*.');
mc('errores', 'B1', WHICH, ["She don't like coffee.", "She doesn't likes coffee.", "She doesn't like coffee.", 'She not like coffee.'], 2, 'Con *he/she/it*: *doesn\'t* + verbo sin -s.');
mc('errores', 'B1', WHICH, ['I am agree with you.', 'I agree with you.', 'I am agreeing to you.', 'I agree you.'], 1, '*Agree* es un verbo: no lleva *to be*.');
mc('errores', 'B1', WHICH, ['It depends of the price.', 'It depends from the price.', 'It depends on the price.', 'It depends in the price.'], 2, '*Depend on*.');
mc('errores', 'B1', WHICH, ['I made my homework.', 'I did my homework.', 'I did my homeworks.', 'I make my homework.'], 1, '*Do homework*. *Homework* no tiene plural.');
mc('errores', 'B1', WHICH, ['I live here since 2018.', 'I have lived here since 2018.', 'I am living here since 2018.', 'I lived here since 2018.'], 1, 'Con *since* se usa present perfect.');
mc('errores', 'A2', WHICH, ['Is raining.', 'It raining.', "It's raining.", 'Raining is.'], 2, 'El inglés necesita sujeto: *It\'s raining*.');
mc('errores', 'B1', WHICH, ['Can you explain me the problem?', 'Can you explain the problem to me?', 'Can you explain for me the problem?', 'Can you explain me about the problem?'], 1, '*Explain something to somebody*.');
mc('errores', 'B1', WHICH, ['The information are useful.', 'The informations are useful.', 'The information is useful.', 'The information it is useful.'], 2, '*Information* no se cuenta: singular, *is*.');
mc('errores', 'A2', WHICH, ['She is more tall than me.', 'She is taller than me.', 'She is more taller than me.', 'She is tall than me.'], 1, 'Adjetivo corto + *-er than*.');
mc('errores', 'B1', WHICH, ['I like very much this film.', 'I like this film very much.', 'I very like this film.', 'I like this film very.'], 1, '*Very much* va después del objeto.');
mc('errores', 'A2', WHICH, ['I went to home.', 'I went home.', 'I went at home.', 'I went in home.'], 1, '*Go home* sin preposición.');
mc('errores', 'B1', WHICH, ['Me and my friend went to the cinema.', 'My friend and me went to the cinema.', 'My friend and I went to the cinema.', 'I and my friend went to the cinema.'], 2, 'Como sujeto: *My friend and I*.');
mc('errores', 'B1', WHICH, ['You should to study more.', 'You should study more.', 'You should studying more.', 'You should studies more.'], 1, 'Los modales (*should, can, must*) no llevan *to*.');
mc('errores', 'B1', WHICH, ['I am interested on music.', 'I am interested in music.', 'I am interesting in music.', 'I am interested of music.'], 1, '*Interested in*. *Interesting* describe lo que provoca interés.');
mc('errores', 'B1', WHICH, ['The life is hard.', 'Life is hard.', 'A life is hard.', 'Lives is hard.'], 1, 'Sin artículo cuando se habla en general.');
mc('errores', 'B2', WHICH, ['We discussed about the problem.', 'We discussed the problem.', 'We discussed of the problem.', 'We discussed on the problem.'], 1, '*Discuss* no lleva preposición.');
mc('errores', 'B2', WHICH, ['He is married with a teacher.', 'He is married to a teacher.', 'He is married at a teacher.', 'He is married for a teacher.'], 1, '*Married to*.');
mc('errores', 'B2', WHICH, ['The film was very boring and I was bored.', 'The film was very bored and I was boring.', 'The film was very boring and I was boring.', 'The film was very bored and I was bored.'], 0, '*-ing* describe la cosa (*boring*); *-ed* describe cómo te sientes (*bored*).');

/* --- Vocabulario --- */
mc('vocab', 'B1', 'We need to ____ with this problem quickly.', ['deal', 'solve', 'do', 'fix'], 0, '*Deal with* = ocuparse de.');
mc('vocab', 'B1', 'She has a great ____ for languages.', ['talent', 'habit', 'hobby', 'fashion'], 0, '*A talent for* = talento para.');
mc('vocab', 'B1', 'The film was so ____ that I fell asleep.', ['boring', 'bored', 'bore', 'bores'], 0, 'Describe la película: *boring*.');
mc('vocab', 'B1', 'She is very ____ about her exam results.', ['worried', 'worrying', 'worry', 'worries'], 0, '*Worried about* = preocupada por.');
mc('vocab', 'B1', 'We stayed at a small hotel ____ the beach.', ['near', 'between', 'during', 'since'], 0, '*Near* = cerca de.');
mc('vocab', 'B2', 'She ____ to finish the report before the deadline.', ['managed', 'succeeded', 'achieved', 'reached'], 0, '*Manage to* + infinitivo.');
mc('vocab', 'B2', 'The company is going to ____ fifty new employees.', ['hire', 'rent', 'lend', 'borrow'], 0, '*Hire* = contratar.');
mc('vocab', 'B2', 'His speech was very ____; everyone listened carefully.', ['convincing', 'convinced', 'convince', 'convinces'], 0, '*Convincing* = convincente.');
mc('vocab', 'C1', "The company's profits ____ by 15% last year.", ['raised', 'rose', 'arose', 'lifted'], 1, '*Rise* (sin complemento) = aumentar. *Raise* necesita complemento.');
mc('vocab', 'C1', 'There has been a ____ increase in house prices.', ['sharp', 'sharpen', 'sharply', 'sharpness'], 0, '*Sharp increase*: adjetivo + sustantivo.');
