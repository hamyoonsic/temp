// src/api/notice/signatureApi.js

import apiClient from '../../utils/apiClient';

export const signatureApi = {
  getList: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/notices/signatures?${queryString}` : '/notices/signatures';
    return apiClient.get(url);
  },
  getDefault: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/notices/signatures/default?${queryString}` : '/notices/signatures/default';
    return apiClient.get(url);
  },
  create: (data) => apiClient.post('/notices/signatures', data),
  update: (signatureId, data) => apiClient.put(`/notices/signatures/${signatureId}`, data),
  delete: (signatureId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/notices/signatures/${signatureId}?${queryString}` : `/notices/signatures/${signatureId}`;
    return apiClient.delete(url);
  }
};
