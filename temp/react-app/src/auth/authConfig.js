// react-test/src/auth/authConfig.js

export const AUTH_BASE = "https://auth-dev.koreazinc.co.kr";
export const CLIENT_ID = "79983b8b-d229-4da3-b615-3cc4d23372b5";

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  USER_ME: "user_me",
  RETURN_URL: "return_url",
};

export function getRedirectUri() {
  // 고정 redirect_uri (허용된 단 하나의 URL과 100% 일치시키기)
  const fixed = import.meta?.env?.VITE_SSO_REDIRECT_URI;
  if (fixed) return fixed;

  // fallback (혹시 env 설정 누락됐을 때만)
  return `${window.location.origin}/sso-redirect`;
}

export function buildLoginUrl({ promptLogin = false, prompt } = {}) {
  const redirectUri = getRedirectUri();
  const qs = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    redirect_uri: redirectUri,
  });

  if (prompt) {
    qs.set("prompt", prompt);
  } else if (promptLogin) {
    qs.set("prompt", "login");
  }
  return `${AUTH_BASE}/oauth2/login?${qs.toString()}`;
}

export function buildLogoutUrl(userId, redirectUri) {
  const qs = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: redirectUri,
  });

  return `${AUTH_BASE}/oauth2/logout/${encodeURIComponent(userId)}?${qs.toString()}`;
}
