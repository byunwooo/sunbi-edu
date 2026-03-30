# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"선비칼국수 (Seonbi Kalguksu)" education app built with Expo (React Native). Currently at the blank template stage (Expo SDK 54).

## Commands

- `npm start` or `expo start` — start the Expo dev server
- `npm run android` — start on Android emulator/device
- `npm run ios` — start on iOS simulator/device
- `npm run web` — start in web browser
- Install dependencies: `npm install` (no lock file yet; `node_modules/` is gitignored)

## Architecture

- **Entry point:** `index.js` registers the root component via `registerRootComponent`
- **Root component:** `App.js` — single component, this is where app development begins
- **Assets:** `assets/` contains app icons (`icon.png`, `adaptive-icon.png`, `favicon.png`) and splash screen (`splash-icon.png`)
- **Config:** `app.json` holds Expo project configuration

## Tech Stack

- Expo SDK 54 (managed workflow)
- React 19.1 / React Native 0.81
- JavaScript (no TypeScript configured)
