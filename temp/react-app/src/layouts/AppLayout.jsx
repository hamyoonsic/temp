import { useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import { getAccessToken, isAccessTokenValid } from "../auth/session";

export default function AppLayout() {
  const location = useLocation();
  const token = getAccessToken();
  if (!isAccessTokenValid(token)) return <Navigate to="/login" replace />;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, location.search]);

  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FA" }}>
      <AppHeader />
      <div style={{ paddingTop: 56 }}>
        <Outlet />
      </div>
    </div>
  );
}
