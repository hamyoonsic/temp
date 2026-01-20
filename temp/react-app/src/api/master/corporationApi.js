// src/api/master/corporationApi.js

import apiClient from '../../utils/apiClient';

/**
 * 법인 마스터 관련 API
 */
export const corporationApi = {
  /**
   * 법인 목록 조회
   * @returns {Promise} 법인 목록
   */
  getAll: () => {
    return apiClient.get('/master/corporations');
  },

  /**
   * 법인 상세 조회
   * @param {number} corpId - 법인 ID
   * @returns {Promise} 법인 상세 정보
   */
  getById: (corpId) => {
    return apiClient.get(`/master/corporations/${corpId}`);
  },

  /**
   * 활성화된 법인 목록 조회
   * @returns {Promise} 활성 법인 목록
   */
  getActive: () => {
    return apiClient.get('/master/corporations?isActive=true');
  },
};