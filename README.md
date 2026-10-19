# Guiri Pass

PWA de práctica para el Cambridge English Skills Test (General). Funciona en el móvil, se instala como app y, tras la primera carga, también sin conexión.

Incluye:

- **Quiz** de gramática y vocabulario (123 preguntas con explicación), simulacro express de 20 preguntas cronometrado y 3 textos de lectura (comprensión y frases en huecos).
- **Listening**: 8 audios con guion original que la app lee en voz alta con las voces del dispositivo; preguntas de opción múltiple, emparejar 5 hablantes y rellenar huecos.
- **Writing**: 12 enunciados (Parte 1 y 2), cronómetro, banco de frases y corrector que cuenta palabras, conectores y estructuras B2 y detecta errores típicos de hispanohablantes.
- **Speaking**: 31 preguntas y fotos, temporizador y análisis (palabras por minuto, muletillas, razón y ejemplo) o grabación de voz.
- **Flashcards** con repaso espaciado (126 tarjetas).
- **Pasaporte guiri**: 5 sellos que se consiguen practicando.

Las preguntas y los textos son originales, para practicar; no son del examen oficial.

## Usarla en el móvil

1. Abre `https://thebillbull.github.io/Ingles/` en Chrome (Android) o Safari (iOS). Se publica desde la rama `gh-pages`, que contiene el contenido de `docs/`.
2. Menú del navegador → **Instalar app** / **Añadir a pantalla de inicio**.

Para probarla en local basta con abrir `docs/index.html` en el navegador (o `npx serve docs`).

Para publicar cambios: edita `src/`, ejecuta `node build.js`, haz commit y lanza `./deploy.sh`.

## Notas

- El progreso se guarda solo en el dispositivo (`localStorage`).
- La voz del Listening y el reconocimiento de voz del Speaking dependen del navegador: Chrome en Android es lo que mejor funciona. Si el navegador no transcribe, el Speaking graba tu audio para que te escuches.
- Sin voces en inglés instaladas, el Listening muestra la transcripción tras contestar.

## Desarrollo

El código fuente está en `src/` y se compila a un único `docs/index.html`:

```
node build.js
```

| Archivo | Contenido |
| --- | --- |
| `src/data-quiz.js` | Banco de preguntas |
| `src/data-reading-listening.js` | Textos de lectura y guiones de Listening |
| `src/data-writing-speaking.js` | Enunciados, frases y reglas del corrector |
| `src/data-cards.js` | Flashcards, plan y chuleta |
| `src/app.js` | Lógica y pantallas |
| `docs/manifest.webmanifest`, `docs/sw.js`, `docs/icons/` | Parte PWA |

La guía de estudio en PDF está en `guia-examen-ingles.pdf`.
