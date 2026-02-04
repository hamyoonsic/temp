// react-test/src/routes/RequireAuth.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import {
  clearSession,
  getAccessToken,
  isAccessTokenValid,
  setReturnUrl,
} from "../auth/session";

export default function RequireAuth() {
  const location = useLocation();
  const token = getAccessToken();
  if (!isAccessTokenValid(token)) {
    clearSession();
    setReturnUrl(location.pathname + location.search);
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
