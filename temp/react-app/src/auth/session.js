// react-test/src/auth/session.js
import { STORAGE_KEYS } from "./authConfig";

export function setAccessToken(token) {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
}

export function getAccessToken() {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

function decodeJwtPayload(token) {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "===".slice((base64.length + 3) % 4);
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isAccessTokenValid(token, { leewaySeconds = 30 } = {}) {
  if (!token) return false;
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return false;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp > now + leewaySeconds;
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
