# Telugu Ashtottaralu — Claude Code Instructions

## Project

This is a Telugu devotional Progressive Web App (PWA).

The app is hosted on GitHub Pages.

The project should remain:
- GitHub Pages only
- Static
- Client-side
- Offline capable
- No backend
- No Vercel
- No Netlify
- No server-side API unless explicitly requested

## Main application

The active application is:

lightversion/

Important files:

- lightversion/index.html
  Main HTML structure.

- lightversion/app.js
  Application logic and rendering.

- lightversion/data.js
  Devotional content and deity data.

- lightversion/styles.css
  Application styling.

- lightversion/service-worker.js
  PWA caching and offline support.

- lightversion/manifest.json
  PWA manifest.

## Existing functionality

The app contains devotional content for multiple deities.

Existing content can include:
- Ashtottaram
- Stotrams
- Chalisa
- Dandakam
- Talam
- Prayer verses
- Other devotional text

The existing data structure must be preserved unless a change is specifically required.

## Important content rule

When adding devotional content:

- Preserve Telugu Unicode exactly.
- Do not transliterate Telugu unless requested.
- Do not modify existing devotional text.
- Do not change punctuation unnecessarily.
- Do not duplicate existing prayers.
- Use the existing data structure whenever possible.

For verse-based content use:

"type": "verses"

Example:

{
  "label": "ప్రార్థనా శ్లోకాలు",
  "type": "verses",
  "verses": [
    {
      "title": "వక్రతుండ శ్లోకం",
      "lines": [
        "వక్రతుండ మహాకాయ సూర్యకోటి సమప్రభ ।",
        "నిర్విఘ్నం కురు మే దేవ సర్వకార్యేషు సర్వదా ॥"
      ]
    }
  ]
}

For long prose/story content use:

"type": "text"

Do not convert long stories into verse objects.

## PWA rules

The application must continue to work offline.

When adding new static files:
- Check whether service-worker.js needs to cache them.
- Do not unnecessarily add large files to the initial app shell.
- When changing cached application files, update CACHE_NAME if necessary.
- Do not remove existing cached assets without a reason.

## Panchang

The long-term Panchang implementation should be client-side.

Do not introduce a Panchang API unless explicitly requested.

Preferred architecture:

PWA
→ browser-side astronomical calculations
→ Panchang calculation
→ Telugu UI

No API key should ever be placed in frontend JavaScript.


## Editing rules

IMPORTANT:

- Inspect only files relevant to the requested task.
- Do not scan the entire repository for a small change.
- Do not rewrite complete files when a small edit is sufficient.
- Prefer targeted patches.
- Do not modify unrelated files.
- Reuse existing functions/components.
- Do not introduce dependencies unless necessary.
- Do not refactor unrelated code.

## Token efficiency

Keep context small.

For a data-only change:
- Inspect only the relevant data file.
- Do not inspect app.js unless the requested data type is unsupported.

For a CSS-only change:
- Inspect only styles.css and the relevant HTML.

For a service-worker issue:
- Inspect service-worker.js and only the relevant referenced files.

For a rendering issue:
- Inspect app.js and the relevant HTML/data structure.

Do not print complete large files in the response.

Do not repeat unchanged code.

## Before editing

For every task:

1. Identify the minimum files required.
2. Read only those files.
3. Find the existing pattern to follow.
4. Make the smallest possible change.
5. Check for syntax errors if applicable.
6. Report the changed files.

## Git rules

Do not automatically commit or push changes unless explicitly requested.

When asked to commit:
- Create a concise commit message.
- Include only files related to the task.

## Response after coding

After completing a task, respond briefly:

Changed:
- file1
- file2

What changed:
- short description

Validation:
- syntax check / test performed

Do not paste the entire modified files unless explicitly requested.