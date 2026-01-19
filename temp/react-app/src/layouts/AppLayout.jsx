import { Outlet, Navigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";

export default function AppLayout() {
  const token = sessionStorage.getItem("access_token");
  if (!token) return <Navigate to="/login" replace />;

  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FA" }}>
      <AppHeader />
      <div style={{ paddingTop: 56 }}>
        <Outlet />
      </div>
    </div>
  );
}
