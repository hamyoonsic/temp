// src/api/notice/approvalApi.js

import apiClient from '../../utils/apiClient';

/**
 * 공지 승인 관련 API
 */
export const approvalApi = {
  /**
   * 승인 대기 목록 조회
   * @param {Object} params - 조회 파라미터
   * @returns {Promise} 승인 대기 목록
   */
  getPendingList: (params = {}) => {
    const queryString = new URLSearchParams({ ...params, status: 'PENDING' }).toString();
    return apiClient.get(`/notices?${queryString}`);
  },

  /**
   * 공지 승인
   * @param {number} noticeId - 공지 ID
   * @returns {Promise} 승인 결과
   */
  approve: (noticeId) => {
    return apiClient.post(`/notices/${noticeId}/approve`);
  },

  /**
   * 공지 반려
   * @param {number} noticeId - 공지 ID
   * @param {string} reason - 반려 사유
   * @returns {Promise} 반려 결과
   */
  reject: (noticeId, reason) => {
    return apiClient.post(`/notices/${noticeId}/reject`, { reason });
  },

  /**
   * 승인 이력 조회
   * @param {number} noticeId - 공지 ID
   * @returns {Promise} 승인 이력
   */
  getHistory: (noticeId) => {
    return apiClient.get(`/notices/${noticeId}/approval-history`);
  },
};