//App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import SSORedirect from "./pages/SSORedirect";
import NoticeDashboard from "./pages/NoticeDashboard";
import NoticeRegistration from './pages/NoticeRegistration';
import NoticeApproval from './pages/NoticeApproval';
import NoticeHistory from './pages/NoticeHistory';
import AppLayout from "./layouts/AppLayout";
import RequireAuth from "./routes/RequireAuth";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 로그인/콜백은 헤더 없이 */}
      <Route path="/login" element={<Login />} />
      <Route path="/sso-redirect" element={<SSORedirect />} />

      {/* 보호 영역(헤더 포함) */}
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path="/NoticeDashboard" element={<NoticeDashboard />} />
          <Route path="/notices/new" element={<NoticeRegistration />} />
          <Route path="/notices/edit/:id" element={<NoticeRegistration />} />
          <Route path="/notices/approval" element={<NoticeApproval />} />
          <Route path="/notices/history" element={<NoticeHistory />} />
        </Route>
      </Route>

      <Route path="*" element={<div style={{ padding: 24 }}>404</div>} />
    </Routes>
  );
}