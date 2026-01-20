// src/api/notice/noticeApi.js

import apiClient from '../../utils/apiClient';

/**
 * 공지 관련 API
 */
export const noticeApi = {
  /**
   * 공지 등록
   * @param {Object} data - 공지 데이터
   * @returns {Promise} 등록된 공지 정보
   */
  create: (data) => {
    return apiClient.post('/notices', data);
  },

  /**
   * 공지 목록 조회
   * @param {Object} params - 조회 파라미터 (page, size, status, corpId 등)
   * @returns {Promise} 공지 목록
   */
  getList: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/notices?${queryString}` : '/notices';
    return apiClient.get(url);
  },

  /**
   * 공지 상세 조회
   * @param {number} noticeId - 공지 ID
   * @returns {Promise} 공지 상세 정보
   */
  getById: (noticeId) => {
    return apiClient.get(`/notices/${noticeId}`);
  },

  /**
   * 공지 수정
   * @param {number} noticeId - 공지 ID
   * @param {Object} data - 수정할 데이터
   * @returns {Promise} 수정된 공지 정보
   */
  update: (noticeId, data) => {
    return apiClient.put(`/notices/${noticeId}`, data);
  },

  /**
   * 공지 삭제
   * @param {number} noticeId - 공지 ID
   * @returns {Promise} 삭제 결과
   */
  delete: (noticeId) => {
    return apiClient.delete(`/notices/${noticeId}`);
  },

  /**
   * 공지 재발송
   * @param {number} noticeId - 공지 ID
   * @returns {Promise} 재발송 결과
   */
  retry: (noticeId) => {
    return apiClient.post(`/notices/${noticeId}/retry`);
  },
};