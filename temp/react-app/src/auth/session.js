// react-test/src/auth/session.js
import { STORAGE_KEYS } from "./authConfig";

export function setAccessToken(token) {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
}

export function getAccessToken() {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_ME);
  localStorage.removeItem(STORAGE_KEYS.RETURN_URL);
  localStorage.removeItem("userData");
  localStorage.removeItem("userOrgName");
  localStorage.removeItem("userName");
  localStorage.removeItem("userId");
}

export function setUserMe(me) {
  localStorage.setItem(STORAGE_KEYS.USER_ME, JSON.stringify(me));
}

export function getUserMe() {
  const raw = localStorage.getItem(STORAGE_KEYS.USER_ME);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setReturnUrl(url) {
  localStorage.setItem(STORAGE_KEYS.RETURN_URL, url);
}

export function popReturnUrl(fallback = "/NoticeDashboard") {
  const url = localStorage.getItem(STORAGE_KEYS.RETURN_URL) || fallback;
  localStorage.removeItem(STORAGE_KEYS.RETURN_URL);
  return url;
}
