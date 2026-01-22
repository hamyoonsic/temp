// react-test/src/components/AppHeader.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { AUTH_BASE, CLIENT_ID } from "../auth/authConfig";
import { clearSession, getUserMe } from "../auth/session";
import { useAdmin } from '../contexts/AdminContext';
import "./AppHeader.css";

export default function AppHeader() {
  const me = getUserMe();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  //  AdminContext에서 관리자 상태 가져오기
  const { isAdmin, isDelegatedAdmin } = useAdmin();

  const displayName = me?.userKoNm || me?.userNm || me?.userId || "";
  const deptName = me?.deptNm || "";
  const userId = me?.userId || "";

  const onLogout = async () => {
    clearSession();

    if (userId) {
      const url =
        `${AUTH_BASE}/oauth2/logout/${encodeURIComponent(userId)}` +
        `?client_id=${encodeURIComponent(CLIENT_ID)}`;

      try {
        await fetch(url, { method: "GET", credentials: "include", redirect: "manual" });
      } catch (e) {
        console.warn("SSO logout call failed:", e);
      }
    }

    window.location.replace("/login");
  };

  // 글로벌 메뉴 항목
  const menuItems = [
    {
      path: '/notices/new',
      label: '공지 등록',
      icon: ''
    },
    {
      path: '/notices/history',
      label: '공지 발송 History',
      icon: ''
    },
    {
      path: '/notices/approval',
      label: '공지 발송 결재',
      icon: ''
    },
    {
      path: '/NoticeDashboard',
      label: 'Dashboards',
      icon: ''
    }
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <header className="app-header">
      <div className="header-container">
        {/* 좌측: 시스템명 */}
        <div className="header-left">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div className="system-info">
            <h1 className="system-title">공지관리 시스템</h1>
            <span className="system-badge">v2026.1.0</span>
          </div>
        </div>

        {/* 중앙: 네비게이션 메뉴 (데스크톱) */}
        <nav className="header-nav">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`nav-button ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </button>
          ))}
        </nav>

        {/* 우측: 사용자 정보 & 로그아웃 */}
        <div className="header-right">
          {/* 사용자 정보 */}
          <div className="user-info">
            <div className="user-avatar">
              {displayName.charAt(0) || "U"}
            </div>
            <div className="user-details">
              <div className="user-name-row">
                <span className="user-name">{displayName}</span>
                {/* 관리자 배지 - AdminContext에서 가져온 상태 사용 */}
                {isAdmin && (
                  <span className="admin-badge-small" title={isDelegatedAdmin ? '대리 관리자' : '관리자'}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {isDelegatedAdmin ? '대리' : '관리자'}
                  </span>
                )}
              </div>
              {deptName && <span className="user-dept">{deptName}</span>}
            </div>
          </div>

          {/* 로그아웃 버튼 */}
          <button type="button" onClick={onLogout} className="logout-button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>로그아웃</span>
          </button>

          {/* 모바일 햄버거 버튼 */}
          <button 
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                navigate(item.path);
                setMobileMenuOpen(false);
              }}
              className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="mobile-nav-icon">{item.icon}</span>
              <span className="mobile-nav-label">{item.label}</span>
              {item.badge && <span className="mobile-nav-badge">{item.badge}</span>}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
