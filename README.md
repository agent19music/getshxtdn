# GSD (Get Stuff Done)

A feature-complete, secure React Native mobile task management app built with Expo 56 and a Node.js/Express backend. Built for the Spearhead frontend assessment.

> **Product name:** The assessment brief permits a custom product identity ("build a feature-complete, secure React Native mobile application") without mandating a specific name. I chose **GSD** to give the project a distinct brand, design system (Mavuno), and personality rather than shipping a generic "Todo App."

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Backend Additions](#backend-additions)
- [Architecture & Trade-offs](#architecture--trade-offs)
- [Features](#features)
- [Project Structure](#project-structure)

---

## Prerequisites

- **Node.js** >= 18
- **npm** or **yarn**
- **Expo CLI** (`npx expo`)
- **Android Studio** (Android emulator) or **Xcode** (iOS simulator)
- **Expo Go** app on a physical device (optional)

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/agent19music/taskify.git
cd taskify
```

### 2. Backend

```bash
cd taskify-apis
cp .env.example .env        # fill in your secrets
npm install
npm run dev                  # starts on http://localhost:3000
```

The SQLite database is auto-created on first run. No external DB setup needed.

### 3. Mobile Client

```bash
cd taskify-client
cp .env.example .env        # set your Google Client ID + API host
npm install
npx expo start
```

Press `a` for Android emulator or `i` for iOS simulator.

---

## Environment Variables

### Backend (`taskify-apis/.env`)

```env
PORT=3000
NODE_ENV=development
JWT_ACCESS_SECRET=change-me-access-secret-min-32-chars
JWT_REFRESH_SECRET=change-me-refresh-secret-min-32-chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
DATABASE_PATH=./data/taskify.db
GOOGLE_CLIENT_ID=
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=
AUTOSEND_API_KEY=
AUTOSEND_FROM_EMAIL=noreply@yourdomain.com
AUTOSEND_FROM_NAME=GSD
```

### Client (`taskify-client/.env`)

```env
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-google-web-client-id
EXPO_PUBLIC_API_HOST=192.168.1.x
```

`EXPO_PUBLIC_API_HOST` is optional. Defaults to `10.0.2.2` on Android emulator, `localhost` on iOS simulator.

---

## Backend Additions

The assessment provided a base Express API. I extended it with the following routes and features:

### Added Routes

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/auth/refresh` | Token rotation — accepts a refresh token, revokes the old one, issues a new access + refresh pair |
| POST | `/api/user/email-digest` | Sends the user an HTML email summarizing all their pending tasks via Autosend |
| POST | `/api/user/avatar` | Upload a profile picture (5MB max, images only) stored in Cloudflare R2 |

### Added Auth Infrastructure

- **Refresh tokens table** (`refresh_tokens`) with SHA-256 hashed storage, expiry tracking, and revocation timestamps
- **Token version** column on `users` — incremented on logout to instantly invalidate all outstanding access tokens without waiting for expiry
- **Token rotation** on refresh — the old refresh token is revoked on every use, preventing replay attacks
- **Rate limiting** — 20 requests/15min on auth endpoints, 300/15min globally

### Email Digest

The digest endpoint queries all incomplete tasks for the authenticated user, renders them into an HTML email template (`src/templates/digest.html`), and sends via the Autosend transactional email API. Task titles and descriptions are HTML-escaped to prevent injection.

---

## Architecture & Trade-offs

### State Management: Context API

I chose **React Context + custom hooks** over Redux Toolkit or Zustand. Rationale:

- The app has two clear state domains: auth and tasks. Each maps cleanly to a single context provider with no cross-domain dependencies.
- No middleware, selectors, or boilerplate — `useAuth()` and `useTasks()` expose the full API surface.
- Task mutations (CRUD, pin/unpin, offline queue drain) are co-located in `useTasks()`, keeping the data flow traceable without action files or reducers.
- For an app of this scope, Context avoids the indirection tax of a state library while remaining easy to refactor if complexity grows.

### Token Security

JWTs are stored in `expo-secure-store` (Keychain on iOS, EncryptedSharedPreferences on Android). The API layer (`services/api.ts`) intercepts 401 responses and transparently refreshes the access token before retrying the failed request — the UI never sees token expiry.

### Offline Resilience

- **Cache:** Tasks are persisted to AsyncStorage per user on every mutation. On app launch without connectivity, cached tasks are loaded immediately.
- **Queue:** Create, update, and delete operations performed offline are queued in AsyncStorage. When connectivity is restored (detected via `@react-native-community/netinfo`), the queue drains sequentially, mapping temporary IDs to server-assigned IDs.
- **Trade-off:** The queue drains best-effort — if a queued operation fails (e.g., a task was deleted server-side by another session), it is silently skipped rather than surfacing a conflict resolution UI.

### Navigation

File-based routing via Expo Router. Auth guard in the root layout redirects based on authentication state. The app uses two route groups:
- `(auth)` — login, register, hero screen
- `(app)/(tabs)` — task dashboard, profile

### Design System

The Mavuno design system (`constants/theme.ts`) provides typed tokens for colors (light/dark), spacing (8px grid), typography (Manrope), radii, and shadows. All components use `StyleSheet.create` — no style libraries.

---

## Features

### Core (Assessment Requirements)

- **Authentication** — Email/password login and registration with client-side validation (regex, empty field checks)
- **Google OAuth** — Native sign-in via `@react-native-google-signin/google-signin`, verified server-side with `google-auth-library`
- **Task Dashboard** — Segmented view (Pending / Completed) with a scrollable FlatList
- **Task CRUD** — Create and edit via modal (title, description, due date). Inline swipe actions for complete/delete with auto-execute on full swipe.
- **Swipe Gestures** — Partial swipe reveals action buttons; full swipe past threshold auto-executes the action (complete or delete)
- **Drag to Pin** — Long-press the grip handle and drag to the pin zone to pin important tasks to the top
- **Profile** — View/edit name, email, avatar. Password change with current password verification.
- **Delete Account** — Confirmation dialog, consumes the backend purge route, wipes local state
- **Logout** — Revokes tokens server-side, clears secure storage, resets navigation to login

### Bonus Features

- **Smart Reminders** — Assign due dates to tasks. Local push notifications fire 30 minutes before and at the due time via `expo-notifications`.
- **Email Digest** — One-tap trigger sends a styled HTML email summary of all pending tasks to the user's email via Autosend.
- **Offline Resilience** — Browse cached tasks offline, queue mutations locally, auto-sync on reconnect with an offline status banner.

### Polish

- Light/dark theme with system preference detection
- Loading skeletons, empty states, error fallbacks with retry
- Haptic feedback on gestures (drag, swipe, complete, pin)
- Toast notifications for all user actions
- Safe area handling for notches and home indicators

---

## Project Structure

```
taskify/
├── taskify-apis/                 # Express backend
│   ├── src/
│   │   ├── controllers/          # Route handlers (auth, tasks, user)
│   │   ├── middleware/           # JWT auth, error handler
│   │   ├── routes/               # Route definitions
│   │   ├── templates/            # Email HTML templates
│   │   ├── utils/                # Password hashing, social auth verification
│   │   ├── config/               # Environment config
│   │   └── db/                   # SQLite connection & migrations
│   └── sql/migrations/           # Schema definitions
│
├── taskify-client/               # React Native (Expo 56)
│   ├── src/
│   │   ├── app/                  # Expo Router screens
│   │   │   ├── (auth)/           # Login, register, hero
│   │   │   └── (app)/(tabs)/     # Dashboard, profile
│   │   ├── components/           # UI components (tasks, ui primitives)
│   │   ├── contexts/             # AuthContext, ThemeContext
│   │   ├── hooks/                # useTasks, useTheme
│   │   ├── services/             # API client, offline queue, notifications, secure storage
│   │   ├── constants/            # Design tokens (theme, config)
│   │   └── types/                # TypeScript definitions
│   └── app.json                  # Expo config
└── README.md
```
