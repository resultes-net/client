# Guidance for agents working on `client`

For the overall ResulTES architecture, read the org-wide guide first:
https://github.com/resultes-net/issues/blob/main/AGENTS.md. This file only adds what's specific to this repo.

## Environment
- SvelteKit app, managed with `npm` (`npm run dev` starts the dev server on http://localhost:5173).
- The TypeScript models are generated from the `openapi-schema` submodule into `src/lib/openapi/generated/`. To pick up
  server API changes: move the `openapi-schema` submodule to the new commit, then run `npm run api:gen-model`. Never edit
  generated files by hand.
- Translations live in `src/lib/i18n`.
- `npx svelte-check` isn't clean on `main`: to check a change, compare the error count before and after it.

## Parameters and KPIs
- The project phase (`pre-design`/`design`, `src/lib/components/parameters/phase.ts`) is UI-only. Design-only fields are
  hidden in pre-design but keep their values.
- The KPIs come from the post-processing's scalar outputs, the variation's `results/output.json`, read by
  `create[T|P|B]tesKpis.ts` and shown in `TabbedKpisTables.svelte`. Compute KPIs in the post-processing (`systems`), not here.

## Weather data
Simulations reference weather data by `weather_data_id` (entries of `GET /weather-data`; shared entries have `user_id`
`null`, users can upload TM2 files via `POST /weather-data`, single entries come from `GET /weather-data/{id}`). Helpers
for fetching, uploading and display names (shared entries get translated names keyed by their ID) live in
`src/lib/weatherData.ts`.
