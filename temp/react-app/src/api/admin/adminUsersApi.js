// src/api/admin/adminUsersApi.js

import apiClient from '../../utils/apiClient';

/**
 * 관리자 사용자 API
 */
export const adminUsersApi = {
  /**
   * 관리자 권한자 목록 조회
   * @param {string} ttlCd - 직책 코드 (예: HR150138)
   * @returns {Promise} 관리자 권한자 목록
   */
  getAdminUsers: (ttlCd = 'HR150138') => {
    return apiClient.get(`/admin/users?ttlCd=${ttlCd}`);
  },

  /**
   * 관리자 권한 확인
   * @param {string} userId - 사용자 ID
   * @returns {Promise} 권한 여부
   */
  checkAdminPermission: (userId) => {
    return apiClient.get(`/admin/users/${userId}/permission`);
  },
};