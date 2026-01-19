// react-test/src/routes/RequireAuth.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAccessToken, getUserMe, setReturnUrl, clearSession } from "../auth/session";

export default function RequireAuth() {
  const location = useLocation();
  const token = getAccessToken();
  const me = getUserMe();

  // 토큰/유저 정보 둘 다 없으면 인증 안 된 상태
  if (!token || !me) {
    clearSession();
    setReturnUrl(location.pathname + location.search);
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
