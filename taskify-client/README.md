# gsd — client

React Native (Expo) app for gsd.

## Setup

1. Install dependencies
   ```bash
   npm install
   ```

2. Copy the env file and fill in your values
   ```bash
   cp .env.example .env
   ```

3. Set `EXPO_PUBLIC_API_HOST` to your machine's local IP or hostname (see below)

## Running

```bash
npx expo start          # Expo Go / dev client
npx expo run:android    # build + run on Android
npx expo run:ios        # build + run on iOS
```

## API host setup

The app connects to your local API server via `EXPO_PUBLIC_API_HOST` in `.env`.

**Temporary (changes every network switch):**
```bash
ip route get 1 | awk '{print $7; exit}'   # get your current local IP
```
Then set `EXPO_PUBLIC_API_HOST=<that-ip>` in `.env`.

**Permanent fix — use your hostname instead of IP:**
```bash
hostname   # e.g. "uzski-machine"
```
Set `EXPO_PUBLIC_API_HOST=<hostname>.local` — this works across network switches via mDNS.
If mDNS isn't working: `sudo apt install avahi-daemon && sudo systemctl enable --now avahi-daemon`

## Environment variables

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_API_HOST` | Local IP or hostname of the API server (no protocol, no port) |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | Google OAuth web client ID |
