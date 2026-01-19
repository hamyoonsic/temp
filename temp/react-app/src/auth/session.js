// react-test/src/auth/session.js
import { STORAGE_KEYS } from "./authConfig";

export function setAccessToken(token) {
  sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
}

export function getAccessToken() {
  return sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

export function clearSession() {
  sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.USER_ME);
  sessionStorage.removeItem(STORAGE_KEYS.RETURN_URL);
}

export function setUserMe(me) {
  sessionStorage.setItem(STORAGE_KEYS.USER_ME, JSON.stringify(me));
}

export function getUserMe() {
  const raw = sessionStorage.getItem(STORAGE_KEYS.USER_ME);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setReturnUrl(url) {
  sessionStorage.setItem(STORAGE_KEYS.RETURN_URL, url);
}

export function popReturnUrl(fallback = "/NoticeDashboard") {
  const url = sessionStorage.getItem(STORAGE_KEYS.RETURN_URL) || fallback;
  sessionStorage.removeItem(STORAGE_KEYS.RETURN_URL);
  return url;
}
