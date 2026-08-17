# JuegoBalanzas

React Native 0.73.6 app (RN CLI template, `react` 18, TS 5.0). A "Balancing Scales" game: players place colored minerals on a scale and guess their weights.

## Commands

- `npm start` — Metro bundler (must run first)
- `npm run android` / `npm run ios` — run on emulator/simulator
- `npm test` — Jest, `preset: 'react-native'`
- `npm run lint` — ESLint (`@react-native` config)

## Verified broken state (pre-existing, not your regression)

- `npm test` fails: `__tests__/App.test.tsx:7` imports `'../App.1'`, which doesn't exist; should be `'../App'`. Do not assume test green == good.
- `npm run lint` fails: ESLint 8.57.0 can't find `@humanwhocodes/config-array` in `node_modules`. A `npm ci` may fix; otherwise lint is unusable.

## Structure & conventions

- Entry: `index.js` → `App.tsx`. `App.tsx` (TypeScript) switches screens via local state (`currentScreen`); **react-navigation is installed but not used**.
- All gameplay lives in `src/components/*` as plain `.js` (no TS), with shared styles in `src/css/styles.js`.
- `BalancingScales.js` owns all game state: `remainingMinerals` (5 colors × 2), `mainScale` = `[[left], [right]]`, weights 1–30 g, per-color log via a single `mensajes` string.
- Every source file starts with `/* eslint-disable prettier/prettier */` and often extra disables (`no-shadow`, `quotes`, `no-unused-vars`, `react-hooks/exhaustive-deps`) — match this rather than cleaning it up.
- Inline styles and `StyleSheet.create` are both used; Prettier is single-quote, no bracket spacing.
- Component prop contracts are inconsistent: `BalancingScales` renders `<MineralColorModal visible=... />` but the modal reads `isVisible`. Don't assume props line up between caller and callee.
- Deps `mongoose`, `react-native-draggable`, `@react-navigation/*`, `react-native-gesture-handler` are installed but unused in `src` — don't assume they're wired up.