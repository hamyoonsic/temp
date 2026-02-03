// react-test/src/pages/SSORedirect.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AUTH_BASE, CLIENT_ID, getRedirectUri } from "../auth/authConfig";
import { setAccessToken, setUserMe, clearSession, popReturnUrl } from "../auth/session";

export default function SSORedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  const [message, setMessage] = useState("인증 결과 처리 중…");
  const [detail, setDetail] = useState("잠시만 기다려 주세요.");

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(location.search);

      const code = params.get("code");
      const error = params.get("error");
      const errorDesc = params.get("error_description");

      if (error) {
        clearSession();
        // setMessage, setDetail 제거하고 바로 에러 표시
        alert(`SSO 오류: ${error}${errorDesc ? ` (${errorDesc})` : ""}`);
        navigate("/login", { replace: true });
        return;
      }

      if (!code) {
        navigate("/login", { replace: true });
        return;
      }

      const REDIRECT_URI = getRedirectUri();

      try {
        // 1) token 교환
        const tokenRes = await fetch(`${AUTH_BASE}/v2/oauth/token`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: CLIENT_ID,
            redirect_uri: REDIRECT_URI,
            code,
          }),
        });

        if (!tokenRes.ok) {
          const t = await safeReadText(tokenRes);
          throw new Error(`token 요청 실패 (${tokenRes.status}) ${t}`);
        }

        const tokenJson = await tokenRes.json();
        const accessToken = tokenJson.access_token;
        if (!accessToken) throw new Error("token 응답에 access_token이 없습니다.");

        setAccessToken(accessToken);

        // 2) 사용자 조회
        //setMessage("사용자 정보 조회 중…");
        //setDetail("접속 사용자 정보를 확인하는 중입니다.");

        const meRes = await fetch(`${AUTH_BASE}/v2/user/me`, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!meRes.ok) {
          const t = await safeReadText(meRes);
          throw new Error(`me 조회 실패 (${meRes.status}) ${t}`);
        }

        const meJson = await meRes.json();

        // 3) 기본 직무 정보 추출
        const baseJob =
          meJson?.job?.find((j) => j?.bassYn === "Y") || meJson?.job?.[0] || null;

        const safeMe = {
          userId: meJson?.userId || "",
          userNm: meJson?.userNm || "",
          userKoNm: meJson?.userKoNm || "",
          email: meJson?.email || "",
          deptNm: baseJob?.deptNm || "",
          coNm: baseJob?.coNm || "",
          empNo: baseJob?.empNo || "",
          posNm: baseJob?.posNm || "",
          rankNm: baseJob?.rankNm || "",
          license: (meJson?.license || []).map((l) => ({
            appId: l?.appId || "",
            licCd: l?.licCd || "",
            licNm: l?.licNm || "",
          })),
        };

        setUserMe(safeMe);

        // 4) localStorage에 사용자 정보 저장
        if (safeMe.deptNm) {
          localStorage.setItem('userOrgName', safeMe.deptNm);
          localStorage.setItem('userName', safeMe.userKoNm || safeMe.userNm);
          localStorage.setItem('userId', safeMe.userId);
        }
        
        // 5) NoticeApproval용 userData도 저장 (원본 meJson 사용)
        localStorage.setItem('userData', JSON.stringify({
          userId: meJson?.userId || "",
          userKoNm: meJson?.userKoNm || "",
          email: meJson?.email || "",
          job: meJson?.job || [],
          license: meJson?.license || []
        }));
        
        console.log('SSORedirect - localStorage 저장 완료:', {
          userOrgName: safeMe.deptNm,
          userName: safeMe.userKoNm || safeMe.userNm,
          userId: safeMe.userId,
          hasUserData: !!localStorage.getItem('userData'),
          hasUserMe: !!localStorage.getItem('user_me')
        });

        // 6) 성공 → 원래 가려던 URL 또는 대시보드
        //setMessage("로그인 성공");
        //setDetail("이동합니다.");

        const target = popReturnUrl("/NoticeDashboard");
        navigate(target, { replace: true });
      } catch (e) {
        console.error(e);
        clearSession();
        alert("로그인 처리 중 오류가 발생했습니다.");
        navigate("/login", { replace: true });
      }
    };

    run();
  }, [location.search, navigate]);

  return null;
}

async function safeReadText(res) {
  try {
    return await res.text();
  } catch {
    return "";
  }
}
