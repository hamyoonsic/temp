// src/api/notice/approvalApi.js

import apiClient from '../../utils/apiClient';

/**
 * 공지 승인 관련 API
 */
export const approvalApi = {
  /**
   * 승인 대기 목록 조회
   */
  getPendingList: (params = {}) => {
    const queryString = new URLSearchParams({ ...params, status: 'PENDING' }).toString();
    return apiClient.get(`/notices?${queryString}`);
  },

  /**
   * 공지 승인
   */
  approve: (noticeId) => {
    return apiClient.post(`/notices/${noticeId}/approve`);
  },

  /**
   * 공지 반려
   */
  reject: (noticeId, reason) => {
    return apiClient.post(`/notices/${noticeId}/reject?reason=${encodeURIComponent(reason)}`);
  },

  /**
   * 공지 요청 취소 (승인 전)
   */
  cancel: (noticeId) => {
    return apiClient.post(`/notices/${noticeId}/cancel`);
  },

  /**
   * 승인 이력 조회
   */
  getHistory: (noticeId) => {
    return apiClient.get(`/notices/${noticeId}/approval-history`);
  },
};
