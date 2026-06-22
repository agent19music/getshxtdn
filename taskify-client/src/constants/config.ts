import { Platform } from 'react-native';

// Android AVD emulator: 10.0.2.2
// Physical device / Genymotion: your machine's LAN IP (e.g. 192.168.1.x)
const ANDROID_HOST = process.env.EXPO_PUBLIC_API_HOST ?? '10.0.2.2';
const IOS_HOST = process.env.EXPO_PUBLIC_API_HOST ?? 'localhost';

const hostname = Platform.select({
  android: ANDROID_HOST,
  default: IOS_HOST,
});

// If the hostname looks like a production domain name (e.g. contains api.gsd.uzskicorp.agency), use https and no port
const isProduction = hostname.includes('.') && !hostname.endsWith('.local') && !hostname.match(/^\d+\.\d+\.\d+\.\d+$/);

export const API_BASE_URL = isProduction 
  ? `https://${hostname}` 
  : `http://${hostname}:3000`;

export const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';
