// src/api/master/organizationApi.js

import apiClient from '../../utils/apiClient';

/**
 * 조직/부서 마스터 관련 API
 */
export const organizationApi = {
  /**
   * 조직 목록 조회
   * @param {number} corpId - 법인 ID (선택)
   * @returns {Promise} 조직 목록
   */
  getAll: (corpId = null) => {
    const url = corpId 
      ? `/master/organizations?corpId=${corpId}` 
      : '/master/organizations';
    return apiClient.get(url);
  },

  /**
   * 조직 상세 조회
   * @param {number} orgUnitId - 조직 ID
   * @returns {Promise} 조직 상세 정보
   */
  getById: (orgUnitId) => {
    return apiClient.get(`/master/organizations/${orgUnitId}`);
  },

  /**
   * 법인별 조직 목록 조회
   * @param {number} corpId - 법인 ID
   * @returns {Promise} 조직 목록
   */
  getByCorporation: (corpId) => {
    return apiClient.get(`/master/organizations?corpId=${corpId}`);
  },

  /**
   * 활성화된 조직 목록 조회
   * @param {number} corpId - 법인 ID (선택)
   * @returns {Promise} 활성 조직 목록
   */
  getActive: (corpId = null) => {
    const url = corpId
      ? `/master/organizations?isActive=true&corpId=${corpId}`
      : '/master/organizations?isActive=true';
    return apiClient.get(url);
  },
};