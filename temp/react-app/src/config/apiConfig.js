// src/config/apiConfig.js

/**
 * API 설정 중앙 관리
 * - API 버전 변경 시 이 파일만 수정하면 전체 프로젝트에 반영됩니다
 */

// API 버전 (v1, v2, v3 등)
export const API_VERSION = 'v1';

// API Base URL (빈 문자열로 설정 - vite proxy 사용)
export const API_BASE_URL = '';

// 전체 API 엔드포인트 (버전 포함)
export const API_ENDPOINT = `/${API_VERSION}/api`;

// 개발 환경 확인
export const IS_DEV = import.meta.env.DEV;

// 설정 정보 출력 (개발 환경에서만)
if (IS_DEV) {
  console.log(' API Configuration:', {
    version: API_VERSION,
    baseUrl: API_BASE_URL,
    endpoint: API_ENDPOINT,
    fullPath: `현재 도메인${API_ENDPOINT}`,
  });
}