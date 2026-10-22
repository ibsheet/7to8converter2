# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

There is no build, lint or test tooling. The site is plain static HTML/JS.

- Run locally: open `index.html`, or serve the repo root (e.g. `python -m http.server`). Monaco Editor and SweetAlert2 load from the jsDelivr CDN, so network access is required.
- Verify converter changes by pasting IBSheet7 code into the UI.

## What this is

A client-only tool that converts IBSheet7 code to IBSheet8 code in the browser. It used to be a Next.js/React app and was converted to plain HTML/JS. There is no backend and no bundler. Pushing to `main` publishes the repo root to GitHub Pages via [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml).

## Architecture

Scripts are classic (non-module) `<script>` tags, loaded in order from [index.html](index.html). Each converter file is wrapped in an IIFE with `'use strict'` and exposes its entry points on `window`. Do not add `import`/`export`.

- [js/app.js](js/app.js) is all UI behavior. It creates four Monaco editors (init legacy/converted, event legacy/converted), tab switching, font size, maximize/copy buttons and the draggable splitter. The Convert button calls `convert7to8(...)` on the Initialize tab and `convertEvent(...)` on the Events tab. Editing the legacy init code re-runs `findSheetId` to refill the SHEET ID / Initialize variable / EL inputs.
- [js/ibsheet7to8Convert.js](js/ibsheet7to8Convert.js) converts init code. `findSheetId` extracts the sheet id, init object name and container element by string-searching the legacy code. It supports `IBS_InitSheet`, `with(...)` and a Namdong Power (남동발전)-specific `setDefaultSheetConfig`. It shows a SweetAlert error and throws if no sheet id is found. `convert7to8` then builds the IBSheet8 options. The file defines stub versions of legacy globals (`IBS_InitSheet`, `createIBSheet2`, `$`) and runs the user's code through `myEval`, so the legacy init object is evaluated to produce the converted output. Keep these stubs in sync when handling new legacy calls.
- [js/convertEvent.js](js/convertEvent.js) converts event handlers. `eventSpliter` splits the source on `function `, keeps only `<sheetId>_<EventName>` functions whose name is in the `EVENTS` list, and `paramMapper` maps IBSheet7 event params to IBSheet8 ones. Supporting a new event means adding it to `EVENTS` and to the mapping logic.
- [js/sample.js](js/sample.js) holds the sample code shown on first load.

Conversion is string-based (indexOf/substring/regex), not AST-based, and it depends on the input's formatting. Expect to handle that fragility when extending it.

Code comments and UI text are in Korean. Match that.
