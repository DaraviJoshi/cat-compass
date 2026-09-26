# CAT Compass

A responsive CAT 2026 preparation tracker: 65 daily plans, linked Cracku material, 12 full mocks, 2 optional mocks, 8 sectionals, protected breaks, mock analysis and a sourced strategy guide.

## Use

Open the GitHub Pages site. Choose a date, follow the linked tasks, and check them off. In **Mock lab**, log correct/wrong MCQ/wrong TITA counts, analysis minutes and the next changes to make. **Copy review summary** produces a report for discussing a revised plan.

Progress stays in browser localStorage. There is no login, analytics, backend or automatic device sync. Export a JSON backup weekly and before clearing browser data. Import on another device to merge results. Imported task/note values take precedence on matching keys; mock records merge by ID and update timestamp. The public repository contains no user scores, phone number, academic profile or paid course PDFs.

## Run locally

Requires Node.js for tests, and Python 3 or any static server for preview.

```sh
npm test
npm start
```

Open http://127.0.0.1:4173. No package installation or build step is needed. Deploy the repository root with GitHub Pages; `.nojekyll` enables direct static hosting.

## Update the plan

- `plan.js`: dated tasks, stable IDs, links, mock schedule and plan version.
- `content.js`: strategy, research citations and resource shelf.
- `core.js`: score calculation, validation, progress and backup merge.
- `app.js`: UI and local persistence.
- `style.css`: responsive layout.

Keep existing task IDs and the `cat-compass-progress-v1` storage key when revising future days. Never commit exported progress files. Increase the plan version/date when changing study content. New source deployments do not intentionally clear local progress.

## Evidence and limits

The strategy distinguishes historical paper observations, coaching-reported score benchmarks, and proposed training targets. Recent paper sizes are reference values, not a guarantee of the 2026 format. No raw-score-to-percentile predictor or admission guarantee is supplied. Sources are linked in the site. Cracku lesson links require the learner's own account; no paid content is redistributed.

## Verification

`npm test` checks schedule continuity, unique IDs, study budgets, mock review coverage, TITA scoring, score arithmetic, validation, backup merge, optional-mock substitution and safe text rendering. Browser checks cover task/note persistence, mock entry/edit/reload, strategy calculations and responsive layout.
