// src/api/notice/dashboardApi.js

import apiClient from '../../utils/apiClient';

/**
 * 대시보드 관련 API
 */
export const dashboardApi = {
  /**
   * 대시보드 통계 조회
   */
  getStats: () => {
    return apiClient.get('/notices/dashboard/stats');
  },

  /**
   * 최근 공지 목록 조회
   */
  getRecentNotices: (limit = 10) => {
    return apiClient.get(`/notices?page=0&size=${limit}&sort=createdAt,DESC`);
  },

  /**
   * 월별 캘린더 데이터 조회
   * ⚠️ 백엔드 미구현 - 프론트에서 전체 공지 조회 후 필터링
   */
  getCalendar: (year, month) => {
    return apiClient.get('/notices?page=0&size=1000');
  },

  /**
   * 부서별 통계 조회
   * ⚠️ 백엔드 미구현 - 프론트에서 계산
   */
  getDeptStats: () => {
    return apiClient.get('/notices?page=0&size=1000');
  },

  /**
   * 공지 유형별 통계 조회
   * ⚠️ 백엔드 미구현 - 프론트에서 계산
   */
  getTypeStats: () => {
    return apiClient.get('/notices?page=0&size=1000');
  },
};