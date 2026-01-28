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
  },
  uploadImage: (file, params = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    return apiClient.post('/notices/signatures/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};
