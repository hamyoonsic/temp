// react-test/src/pages/AutoLogin.jsx
import { useEffect, useMemo, useState } from "react";
import { buildLoginUrl } from "../auth/authConfig";
import { getAccessToken, getUserMe } from "../auth/session";

export default function AutoLogin() {
  const [msg] = useState("통합인증(SSO) 로그인 화면으로 이동 중…");

  const loginUrl = useMemo(() => buildLoginUrl({ prompt: "none" }), []);

  useEffect(() => {
    const token = getAccessToken();
    const me = getUserMe();

    // 이미 로그인된 세션이면 바로 대시보드
    if (token && me) {
      window.location.replace("/NoticeDashboard");
      return;
    }

    // 아니면 PPT 흐름대로 /oauth2/login으로 즉시 이동 :contentReference[oaicite:8]{index=8}
    window.location.replace(loginUrl);
  }, [loginUrl]);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI" }}>
      <h2>{msg}</h2>
      <p style={{ color: "#555" }}>잠시만 기다려 주세요.</p>
    </div>
  );
}
