// src/api/notice/dashboardApi.js

import apiClient from '../../utils/apiClient';

/**
 * 대시보드 관련 API
 */
export const dashboardApi = {
  /**
   * 대시보드 통계 조회
   * @returns {Promise} 통계 데이터
   */
  getStats: () => {
    return apiClient.get('/notices/dashboard/stats');
  },

  /**
   * 최근 공지 목록 조회
   * @param {number} limit - 조회 개수
   * @returns {Promise} 최근 공지 목록
   */
  getRecentNotices: (limit = 10) => {
    return apiClient.get(`/notices?page=0&size=${limit}&sort=createdAt,DESC`);
  },

  /**
   * 월별 캘린더 데이터 조회
   * ⚠️ 백엔드 미구현 - 프론트에서 전체 공지 조회 후 필터링
   * @param {number} year - 연도
   * @param {number} month - 월
   * @returns {Promise} 캘린더 데이터
   */
  getCalendar: (year, month) => {
    // 백엔드에 캘린더 API가 없으므로 전체 공지를 조회
    return apiClient.get('/notices?page=0&size=1000');
  },

  /**
   * 부서별 통계 조회
   * ⚠️ 백엔드 미구현 - 프론트에서 계산
   * @returns {Promise} 부서별 통계
   */
  getDeptStats: () => {
    // 백엔드에 부서별 통계 API가 없으므로 전체 공지를 조회
    return apiClient.get('/notices?page=0&size=1000');
  },

  /**
   * 공지 유형별 통계 조회
   * ⚠️ 백엔드 미구현 - 프론트에서 계산
   * @returns {Promise} 유형별 통계
   */
  getTypeStats: () => {
    // 백엔드에 유형별 통계 API가 없으므로 전체 공지를 조회
    return apiClient.get('/notices?page=0&size=1000');
  },
};