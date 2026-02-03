// react-test/src/pages/Login.jsx
import { useMemo, useState } from "react";
import { buildLoginUrl } from "../auth/authConfig";
import { getAccessToken } from "../auth/session";
import "./Login.css";

export default function Login() {
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [copiedField, setCopiedField] = useState("");
  const envLabel = useMemo(() => {
    const mode = import.meta?.env?.MODE;
    if (!mode) return "DEV";
    return mode.toUpperCase();
  }, []);

  const onMicrosoftLogin = () => {
    const authUrl = buildLoginUrl();
    window.location.replace(authUrl);
  };

  const onSupportClick = (event) => {
    event.preventDefault();
    setIsSupportOpen(true);
  };

  const copyText = async (field, value) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const el = document.createElement("textarea");
        el.value = value;
        el.setAttribute("readonly", "");
        el.style.position = "absolute";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      setCopiedField(field);
      setTimeout(() => setCopiedField(""), 1500);
    } catch {
      setCopiedField(field);
      setTimeout(() => setCopiedField(""), 1500);
    }
  };

  // 이미 로그인 상태면 대시보드로
  const token = getAccessToken();
  if (token) {
    window.location.replace("/NoticeDashboard");
    return null;
  }

  return (
    <div className="login-page">
      {/* 배경 그라데이션 */}
      <div className="login-background">
        <div className="gradient-shape shape-1"></div>
        <div className="gradient-shape shape-2"></div>
      </div>

      {/* 환경 배지 */}
      <div className="env-badge">{envLabel}</div>

      {/* 메인 컨테이너 */}
      <div className="login-container">
        {/* 로고 & 타이틀 */}
        <div className="login-header">
          <div className="logo">
            <svg viewBox="0 0 48 48" fill="none">
              <rect x="8" y="8" width="32" height="32" rx="6" stroke="currentColor" strokeWidth="3"/>
              <path d="M18 24L22 28L30 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="title">공지관리 시스템</h1>
          <p className="subtitle">조직의 모든 공지사항을 통합 관리하세요</p>
        </div>

        {/* 로그인 카드 */}
        <div className="login-card">
          <button
            type="button"
            onClick={onMicrosoftLogin}
            className="login-button"
          >
            <svg className="ms-icon" viewBox="0 0 23 23">
              <rect width="11" height="11" fill="#F25022" />
              <rect x="12" width="11" height="11" fill="#7FBA00" />
              <rect y="12" width="11" height="11" fill="#00A4EF" />
              <rect x="12" y="12" width="11" height="11" fill="#FFB900" />
            </svg>
            <div className="button-content">
              <span className="button-title">Microsoft 계정으로 로그인</span>
              <span className="button-desc">회사 계정으로 안전하게 로그인하세요</span>
            </div>
            <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>

          <div className="help-text">
            로그인에 문제가 있으신가요?{" "}
            <a href="#support" onClick={onSupportClick}>
              고객지원
            </a>
          </div>
        </div>

        {/* 정보 섹션 */}
        <div className="info-section">
          <div className="info-item">
            <span className="info-label">Developed by</span>
            <span className="info-value">서린정보기술</span>
          </div>
          <div className="info-divider"></div>
          <div className="info-item">
            <span className="info-label">Version</span>
            <span className="info-value">2026.1.0</span>
          </div>
        </div>

        {/* 푸터 */}
        <div className="login-footer">
          <div className="footer-links">
            <a href="#privacy">개인정보처리방침</a>
            <span>•</span>
            <a href="#terms">이용약관</a>
          </div>
          <p className="copyright">© 2026 서린정보기술. All rights reserved.</p>
        </div>
      </div>

      {isSupportOpen && (
        <div
          className="support-modal-backdrop"
          onClick={() => setIsSupportOpen(false)}
        >
          <div
            className="support-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="support-title"
          >
            <div className="support-modal-header">
              <h2 id="support-title">고객지원</h2>
              <button
                type="button"
                className="support-close"
                onClick={() => setIsSupportOpen(false)}
                aria-label="닫기"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M6 6l12 12M18 6l-12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <div className="support-modal-body">
              <div className="support-item">
                <span className="support-label">이메일</span>
                <div className="support-row">
                  <span className="support-value">hamyoonsic@sorin.co.kr</span>
                  <div className="support-actions">
                    <a
                      className="support-link"
                      href="mailto:hamyoonsic@sorin.co.kr"
                    >
                      메일보내기
                    </a>
                    <button
                      type="button"
                      className="support-copy"
                      onClick={() =>
                        copyText("email", "hamyoonsic@sorin.co.kr")
                      }
                    >
                      복사
                    </button>
                  </div>
                </div>
                {copiedField === "email" && (
                  <span className="support-copied">복사됨</span>
                )}
              </div>
              <div className="support-item">
                <span className="support-label">전화</span>
                <div className="support-row">
                  <span className="support-value">02-6947-2694</span>
                  <div className="support-actions">
                    <button
                      type="button"
                      className="support-copy"
                      onClick={() => copyText("phone", "02-6947-2694")}
                    >
                      복사
                    </button>
                  </div>
                </div>
                {copiedField === "phone" && (
                  <span className="support-copied">복사됨</span>
                )}
              </div>
            </div>
            <div className="support-modal-footer">
              <button
                type="button"
                className="support-confirm"
                onClick={() => setIsSupportOpen(false)}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
