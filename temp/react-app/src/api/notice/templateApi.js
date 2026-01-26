// src/api/notice/templateApi.js

import apiClient from '../../utils/apiClient';

export const templateApi = {
  getList: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/notices/templates?${queryString}` : '/notices/templates';
    return apiClient.get(url);
  },
  create: (data) => apiClient.post('/notices/templates', data),
  update: (templateId, data) => apiClient.put(`/notices/templates/${templateId}`, data),
  delete: (templateId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/notices/templates/${templateId}?${queryString}` : `/notices/templates/${templateId}`;
    return apiClient.delete(url);
  }
};
