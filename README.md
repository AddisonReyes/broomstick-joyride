# Broomstick Joyride

This repository contains the game frontend and the leaderboard backend for Broomstick Joyride.

## Apps

- `game/`: browser game built with Vite, TypeScript, and Kaplay.
- `backend/`: leaderboard API built with Express, TypeScript, and MongoDB.

## Requirements

- Node.js `20.19+` or `22.12+` is recommended for the game toolchain used by Vite 7.
- MongoDB is required to run the backend locally.

## Repo Map

- `game/src/main.ts`: game bootstrap, asset loading, and scene registration.
- `game/src/scenes/game.ts`: main gameplay scene and obstacle creation.
- `game/src/scenes/gameplay.ts`: difficulty scaling, spawn patterns, and vertical band placement helpers.
- `game/src/scenes/leaderboard.ts`: leaderboard scene UI and pagination.
- `game/src/services/leaderboard.ts`: leaderboard API client and response normalization.
- `backend/src/index.ts`: API entrypoint and route registration.
- `backend/src/models/entry.ts`: Mongoose leaderboard schema.
- `backend/docker-compose.yaml`: local backend stack.

## Run The Game

```sh
cd game
npm install
npm run dev
```

Build the game:

```sh
cd game
npm run build
```

Package the game:

```sh
cd game
npm run zip
```

## Run The Backend

```sh
cd backend
npm install
npm run build
npm run start
```

Environment variables:

- `MONGO_URL` is required.
- `PORT` is optional and defaults to `3000`.
- `ALLOWED_ORIGINS` or `ALLOWED_CORS` can be used to configure CORS.

## Local Integration Notes

- The game reads a cached username from browser `localStorage` on boot. If one exists, it opens the main menu directly; otherwise it starts in the username scene from `game/src/main.ts`.
- The frontend leaderboard client points to the deployed Railway backend by default in `game/src/config.ts`.
- If you want the game to use your local backend, update `game/src/config.ts` to your local API URL.
