# Guidance for agents working on `client`

For the overall ResulTES architecture, read the org-wide guide first:
https://github.com/resultes-net/issues/blob/main/AGENTS.md. This file only adds what's specific to this repo.

## Environment
- SvelteKit app, managed with `npm` (`npm run dev` starts the dev server on http://localhost:5173).
- The TypeScript models are generated from the `openapi-schema` submodule into `src/lib/openapi/generated/`. To pick up
  server API changes: move the `openapi-schema` submodule to the new commit, then run `npm run api:gen-model`. Never edit
  generated files by hand.
- Translations live in `src/lib/i18n`.
- For integration tests or screenshots, install the browser once with `npm run playwright:install` (Chromium, matching
  the Playwright version in `package-lock.json`, into `~/.cache/ms-playwright`). In CI, use
  `npx playwright install --with-deps chromium` instead, which also installs the system libraries (needs root or sudo).
- To use the UI against dev (e.g. for screenshots), log in as `resultes-test-user`. Its password is in
  `$RESULTES_TEST_USER_PASSWORD` (set in the user's shell profile, never committed).
  For screenshots, `.env.development` proxies the API to dev through
  `kubectl port-forward -n server service/external-server 8080:80`. With Playwright:
  1. Wait for `networkidle` before filling in the login form. Otherwise the form submits before the page is hydrated, and
     the browser just reloads `/login`.
  2. Click the parameter tabs via their `label` (e.g. `label:has(input[value="financial"])`): the `input` is hidden.
     The parameters and the KPI tables both have a "financial" tab, so that selector matches both: `.last()` is the
     KPI table's.
- `npx svelte-check` isn't clean on `main`: to check a change, compare the error count before and after it.
- Run Prettier only on the Svelte/TS files you change. The i18n JSON files aren't Prettier-formatted: don't reformat them.
  Some TS files aren't Prettier-formatted either: if a file you change wasn't clean before, reformat it in a separate
  commit, not together with the change.

## Parameters and KPIs
- The project phase (`pre-design`/`design`, `src/lib/components/parameters/phase.ts`) is UI-only. Design-only fields are
  hidden in pre-design but keep their values.
- The KPIs come from the post-processing's scalar outputs, the variation's `results/output.json`, read by
  `create[T|P|B]tesKpis.ts` and shown in `TabbedKpisTables.svelte`. Compute KPIs in the post-processing (`systems`), not here.
- Show numbers on the results page (KPIs and parameters tables) with `formatNumber` from `src/lib/formatNumber.ts` and
  `$locale` (thousands separators in the user's language), not with `toFixed`. Show costs with `formatMoney` (k€/M€).

### Output versions
`output.json` has a version, `OutputsVersion` (written by `systems`' `common/process/outputs.py`, one for all three
systems), so that old results can be told from new ones.
- The `create*Kpis` functions decide by `OutputsVersion` (in `createFinancialKpis.ts` so far); missing means version 0.
- Renames, unit changes and restructuring: write a migration function per version step (`vN → vN+1`) and chain them, so
  that only the newest type and component exist. These can stay forever.
- New quantities can't be migrated (KPIs are computed in `systems`, and old outputs lack the inputs): keep a type and a
  component per version (e.g. `LegacyFinancialKpis` and `FinancialKpisRowsLegacy.svelte` for version 0), removable after
  the period in https://github.com/resultes-net/issues/issues/50.

## Weather data
Simulations reference weather data by `weather_data_id` (entries of `GET /weather-data`; shared entries have `user_id`
`null`, users can upload TM2 files via `POST /weather-data`, single entries come from `GET /weather-data/{id}`). Helpers
for fetching, uploading and display names (shared entries get translated names keyed by their ID) live in
`src/lib/weatherData.ts`.

## Layout
- Check layout changes in German as well as in English. Flex items are sized at least to their content's min-content
  width, and a text's min-content width is its longest word. German labels are often single words (e.g.
  "Fernwärmenetz"), so a German tab row can make its column, or the whole page, wider than the window, while the
  English one wraps in theory and lets the column shrink.
