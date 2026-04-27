# Broomstick Joyride Game

Frontend game built with Vite, TypeScript, and Kaplay.

## Requirements

- Node.js `20.19+` or `22.12+` is recommended for the Vite 7 toolchain in this folder.

## Folder Structure

- `src/main.ts`: bootstraps Kaplay, loads assets, and registers scenes.
- `src/scenes/game.ts`: main gameplay scene.
- `src/scenes/gameplay.ts`: spawn patterns, difficulty scaling, and vertical obstacle placement helpers.
- `src/scenes/menu.ts`, `src/scenes/user.ts`, `src/scenes/lose.ts`, `src/scenes/leaderboard.ts`: non-gameplay scenes.
- `src/ui/arcane.ts`: shared UI palette and arcane-styled components.
- `src/services/leaderboard.ts`: leaderboard API client.
- `src/constants.ts`: gameplay, viewport, and UI constants.
- `dist/`: production build output.

## Development

```sh
npm install
npm run dev
```

Vite will start the development server and print the local URL in the terminal.

## Production Build

```sh
npm run build
```

Build output is written to `dist/`.

## Packaging

```sh
npm run zip
```

This creates `dist/game.zip`.

## Leaderboard Notes

- The game reads a cached username from browser `localStorage` on boot. If one exists, it opens the main menu directly; otherwise it starts in the username scene from `src/main.ts`.
- The leaderboard client uses the deployed backend URL defined in `src/config.ts`.
- During frontend development, mock leaderboard entries are appended in `src/services/leaderboard.ts`.
