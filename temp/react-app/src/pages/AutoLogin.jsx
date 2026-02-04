// react-test/src/pages/AutoLogin.jsx
import { Navigate } from "react-router-dom";

export default function AutoLogin() {
  return <Navigate to="/login" replace />;
}
