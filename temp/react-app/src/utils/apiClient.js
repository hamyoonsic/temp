// temp/react-app/src/utils/apiClient.js

import { API_ENDPOINT } from '../config/apiConfig';
import { getAccessToken, clearSession } from '../auth/session';

/**
 * API 클라이언트 유틸리티
 */

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    //  1. Authorization 토큰 자동 추가
    const token = getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    //  2. X-User-Id, X-User-Name 헤더 자동 추가
    try {
      // userData 또는 user_me에서 사용자 정보 가져오기
      const userDataStr = sessionStorage.getItem('userData') || sessionStorage.getItem('user_me');
      
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        
        // X-User-Id (영문/숫자만 있으므로 그대로 추가)
        if (userData.userId) {
          headers['X-User-Id'] = userData.userId;
        }
        
        //  X-User-Name (한글 포함 가능 → Base64 인코딩)
        if (userData.userNm || userData.userKoNm) {
          const userName = userData.userNm || userData.userKoNm;
          // Base64 인코딩하여 한글 문제 해결
          headers['X-User-Name'] = btoa(unescape(encodeURIComponent(userName)));
        }
      }
    } catch (error) {
      console.warn('사용자 정보 헤더 추가 실패:', error);
      // 에러가 나도 요청은 계속 진행
    }

    return headers;
  }

  /**
   * 응답 처리 통합 & text 변수 정리
   */
   async handleResponse(response) {
    // 401 Unauthorized
    if (response.status === 401) {
      console.warn(' 인증 실패 (401) - 로그인 페이지로 이동');
      clearSession();
      window.location.replace('/login');
      throw new Error('인증이 필요합니다.');
    }

    // 400 Bad Request - 토큰 만료 확인
    if (response.status === 400) {
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          const errorMessage = errorData.message || JSON.stringify(errorData);

          if (
            errorMessage.includes('expired') ||
            errorMessage.includes('Token has expired') ||
            errorMessage.includes('만료')
          ) {
            console.warn(' 토큰 만료 (400) - 로그인 페이지로 이동');
            clearSession();
            window.location.replace('/login');
            throw new Error('토큰이 만료되었습니다.');
          }

          throw new Error(errorMessage);
        } catch (parseError) {
          if (
            parseError.message.includes('만료') ||
            parseError.message.includes('로그인')
          ) {
            throw parseError;
          }
          throw new Error('잘못된 요청입니다.');
        }
      }
      throw new Error('잘못된 요청입니다.');
    }

    // 403 Forbidden
    if (response.status === 403) {
      throw new Error('접근 권한이 없습니다.');
    }

    // 404 Not Found
    if (response.status === 404) {
      throw new Error('요청한 리소스를 찾을 수 없습니다.');
    }

    // 500번대 서버 오류
    if (response.status >= 500) {
      throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }

    //  여기서부터 "성공 or 기타 2xx/3xx" 처리
    if (response.ok) {
      // 204 No Content - 응답 본문 없음
      if (response.status === 204) {
        return { success: true, data: null };
      }

      const contentType = response.headers.get('content-type') || '';
      const text = await response.text();   // ⬅️ 여기서 실제 응답 본문 읽기

      // HTML이 오면 즉시 에러로 처리 (Spring Security, 라우팅 설정 오류 가능성)
      if (text.trim().startsWith('<')) {
        console.error('서버가 HTML을 반환했습니다. 응답 일부:', text.substring(0, 200));
        throw new Error(
          '서버가 JSON 대신 HTML을 반환했습니다. API_BASE_URL, 프록시, 시큐리티(로그인 리다이렉트) 설정을 확인하세요.'
        );
      }

      // JSON이면 파싱
      if (
        contentType.includes('application/json') ||
        text.trim().startsWith('{') ||
        text.trim().startsWith('[')
      ) {
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error('JSON 파싱 실패, 원본 응답:', text);
          throw new Error('응답 JSON 파싱 중 오류가 발생했습니다.');
        }
      }

      // 그 외 형식이면 raw text를 감싸서 반환 (필요시 디버그용)
      return {
        success: true,
        data: text,
      };
    }

    // 여기까지 왔다는 건 ok도 아니고 위에서 따로 처리도 안 한 상태
    throw new Error(`요청 실패: ${response.status} ${response.statusText}`);
  }

  async get(path, options = {}) {
    const url = `${this.baseURL}${path}`;
    const headers = this.getHeaders(options.headers);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error(' GET 요청 실패:', url, error);
      throw error;
    }
  }

  async post(path, data = null, options = {}) {
    const url = `${this.baseURL}${path}`;
    const headers = this.getHeaders(options.headers);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: data ? JSON.stringify(data) : null,
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error(' POST 요청 실패:', url, error);
      throw error;
    }
  }

  async put(path, data = null, options = {}) {
    const url = `${this.baseURL}${path}`;
    const headers = this.getHeaders(options.headers);

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: data ? JSON.stringify(data) : null,
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error(' PUT 요청 실패:', url, error);
      throw error;
    }
  }

  async delete(path, options = {}) {
    const url = `${this.baseURL}${path}`;
    const headers = this.getHeaders(options.headers);

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers,
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error(' DELETE 요청 실패:', url, error);
      throw error;
    }
  }
}

const apiClient = new ApiClient(API_ENDPOINT);

export default apiClient;