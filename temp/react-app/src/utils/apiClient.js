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

    const token = getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * ✅ 수정: 응답 처리 개선 - null 방지
   */
  async handleResponse(response) {
    // 401 Unauthorized
    if (response.status === 401) {
      console.warn('🔒 인증 실패 (401) - 로그인 페이지로 이동');
      clearSession();
      window.location.replace('/login');
      throw new Error('인증이 필요합니다.');
    }

    // 400 Bad Request - 토큰 만료 확인
    if (response.status === 400) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json();
          const errorMessage = errorData.message || JSON.stringify(errorData);
          
          if (errorMessage.includes('expired') || 
              errorMessage.includes('Token has expired') ||
              errorMessage.includes('만료')) {
            console.warn('🔒 토큰 만료 (400) - 로그인 페이지로 이동');
            clearSession();
            window.location.replace('/login');
            throw new Error('토큰이 만료되었습니다.');
          }
          
          throw new Error(errorMessage);
        } catch (parseError) {
          if (parseError.message.includes('만료') || parseError.message.includes('로그인')) {
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

    // ✅ 수정: 성공 응답 처리 개선
    if (response.ok) {
      // 204 No Content - 응답 본문 없음
      if (response.status === 204) {
        return { success: true, data: null };
      }

      const contentType = response.headers.get('content-type');
      
      // JSON 응답
      if (contentType && contentType.includes('application/json')) {
        try {
          return await response.json();
        } catch (error) {
          console.error('JSON 파싱 실패:', error);
          // JSON 파싱 실패 시에도 성공으로 처리
          return { success: true, data: null };
        }
      }
      
      // ✅ Content-Type이 없어도 JSON 파싱 시도
      try {
        const text = await response.text();
        if (text) {
          return JSON.parse(text);
        }
        // 빈 응답
        return { success: true, data: null };
      } catch (error) {
        console.error('응답 처리 실패:', error);
        // 파싱 실패 시에도 성공으로 처리
        return { success: true, data: null };
      }
    }

    // 기타 오류
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
      console.error('❌ GET 요청 실패:', url, error);
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
      console.error('❌ POST 요청 실패:', url, error);
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
      console.error('❌ PUT 요청 실패:', url, error);
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
      console.error('❌ DELETE 요청 실패:', url, error);
      throw error;
    }
  }
}

const apiClient = new ApiClient(API_ENDPOINT);

export default apiClient;