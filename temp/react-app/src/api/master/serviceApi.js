// src/api/master/serviceApi.js

import apiClient from '../../utils/apiClient';

/**
 * 서비스 마스터 관련 API
 */
export const serviceApi = {
  /**
   * 서비스 목록 조회
   * @returns {Promise} 서비스 목록
   */
  getAll: () => {
    return apiClient.get('/master/services');
  },

  /**
   * 서비스 상세 조회
   * @param {number} serviceId - 서비스 ID
   * @returns {Promise} 서비스 상세 정보
   */
  getById: (serviceId) => {
    return apiClient.get(`/master/services/${serviceId}`);
  },

  /**
   * 활성화된 서비스 목록 조회
   * @returns {Promise} 활성 서비스 목록
   */
  getActive: () => {
    return apiClient.get('/master/services?isActive=true');
  },

  /**
   * 카테고리별 서비스 조회
   * @param {string} category - 서비스 카테고리
   * @returns {Promise} 서비스 목록
   */
  getByCategory: (category) => {
    return apiClient.get(`/master/services?category=${category}`);
  },
};