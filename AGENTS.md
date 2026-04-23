# AGENTS.md

## Project Overview

This repository contains two related apps:

- `game/`: a browser game built with Vite and Kaplay.
- `services/leaderboard/`: an Express + TypeScript + MongoDB leaderboard API.

Keep changes scoped to the part of the repo you are working in, and preserve the existing gameplay and API behavior unless the task explicitly requires a behavior change.

## Repo Map

- `game/src/main.js`: game bootstrap, asset loading, and scene registration.
- `game/src/scenes/`: gameplay and menu scenes.
- `game/src/utils.js`: shared helpers for UI, formatting, and leaderboard requests.
- `services/leaderboard/src/index.ts`: API entrypoint and route definitions.
- `services/leaderboard/src/models/entry.ts`: Mongoose schema and model.
- `services/docker-compose.yaml`: local container setup for the leaderboard service.

## Run Commands

Game:

```sh
cd game
npm install
npm run dev
```

Game production build:

```sh
cd game
npm run build
```

Leaderboard service:

```sh
cd services/leaderboard
npm install
npm run build
npm run start
```

The leaderboard service expects `MONGO_URL` to be set. `PORT` is optional and defaults to `3000`.

## Working Agreements

- Read the surrounding code before editing so new changes match the local style and flow.
- Make the smallest change that fully solves the task.
- Avoid unrelated refactors unless they are necessary to safely complete the work.
- Do not silently change game balance, API contracts, storage shape, or scene navigation.
- When behavior changes, update any nearby comments or docs that would otherwise become misleading.

## Code Readability Rules

Write code for the next human first. Favor clarity over cleverness.

- Use descriptive names for variables, functions, and temporary values.
- Keep functions focused on a single job.
- Prefer straightforward control flow over compact but hard-to-scan expressions.
- Extract repeated logic into small helpers when it improves readability.
- Keep related logic grouped together in a predictable order.
- Avoid deeply nested conditionals when an early return or small helper would read better.
- Use comments sparingly and only when they add context that the code itself cannot express.
- Remove dead code, stale TODOs, and commented-out blocks when touching an area, unless they are intentionally preserved for an active task.

## Clean Structure Expectations

- In the game code, separate scene setup, input handling, rendering/UI setup, and update logic into clear sections or helper functions when files start growing.
- In shared utilities, keep pure formatting helpers separate from side-effecting network helpers when practical.
- In the API, keep request parsing, validation, database operations, and response shaping easy to follow.
- Prefer explicit constants for important values such as timings, dimensions, scores, limits, and route-level defaults.
- If a file becomes hard to scan, split it into small helpers rather than adding more inline branching.

## JavaScript And TypeScript Guidance

- Prefer `const` by default, and only use `let` when reassignment is needed.
- Avoid single-letter identifiers except for short-lived loop indexes where the meaning is obvious.
- Keep object and parameter names consistent across scenes, helpers, and API payloads.
- Validate assumptions near boundaries such as HTTP requests, environment variables, and remote API responses.
- In TypeScript files, prefer explicit types where they improve comprehension, especially around request data and database shapes.

## Verification

Before finishing:

- Run the narrowest relevant build, lint, or verification command available.
- If you cannot run verification, say so clearly and explain why.
- Mention any assumptions that materially affected the implementation.

## Notes For Future Agents

- The current game bootstrap starts directly in the game scene with a hardcoded username in `game/src/main.js`; do not assume the menu flow is the active entry path.
- The leaderboard client currently talks to a deployed Railway endpoint from `game/src/utils.js`.
- There may be generated output under `services/leaderboard/dist/`; prefer editing source files under `src/`.
