// src/api/admin/adminDelegationApi.js

import apiClient from '../../utils/apiClient';

/**
 * 관리자 권한 위임 API
 */
export const adminDelegationApi = {
  /**
   * 권한 위임 생성
   * @param {Object} delegationData - 위임 정보
   * @returns {Promise} 생성된 위임 정보
   */
  createDelegation: (delegationData) => {
    return apiClient.post('/admin/delegations', delegationData);
  },

  /**
   * 내 위임 목록 조회
   * @returns {Promise} 위임 목록
   */
  getMyDelegations: () => {
    return apiClient.get('/admin/delegations/my');
  },

  /**
   * 받은 위임 목록 조회
   * @returns {Promise} 받은 위임 목록
   */
  getReceivedDelegations: () => {
    return apiClient.get('/admin/delegations/received');
  },

  /**
   * 현재 유효한 위임 조회
   * @returns {Promise} 현재 유효한 위임 정보
   */
  getCurrentDelegation: () => {
    return apiClient.get('/admin/delegations/current');
  },

  /**
   * 위임 비활성화
   * @param {number} delegationId - 위임 ID
   * @returns {Promise} 비활성화 결과
   */
  deactivateDelegation: (delegationId) => {
    return apiClient.delete(`/admin/delegations/${delegationId}`);
  },
};
