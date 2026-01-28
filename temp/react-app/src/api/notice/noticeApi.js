// src/api/notice/noticeApi.js

import apiClient from '../../utils/apiClient';

/**
 * 공지 관련 API
 */
export const noticeApi = {
  /**
   * 공지 등록
   */
  create: (data) => {
    return apiClient.post('/notices', data);
  },

  /**
   * 공지 목록 조회
   */
  getList: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/notices?${queryString}` : '/notices';
    return apiClient.get(url);
  },

  /**
   * 공지 상세 조회
   */
  getById: (noticeId) => {
    return apiClient.get(`/notices/${noticeId}`);
  },

  getCompletion: (noticeId) => {
    return apiClient.get(`/notices/${noticeId}/completion`);
  },

  /**
   * 공지 수정
   */
  update: (noticeId, data) => {
    return apiClient.put(`/notices/${noticeId}`, data);
  },

  /**
   * 공지 삭제
   */
  delete: (noticeId) => {
    return apiClient.delete(`/notices/${noticeId}`);
  },

  /**
   * 공지 재발송
   */
  retry: (noticeId) => {
    return apiClient.post(`/notices/${noticeId}/retry`);
  },

  /**
   * 캘린더 재생성
   */
  retryCalendar: (noticeId) => {
    return apiClient.post(`/notices/${noticeId}/calendar/retry`);
  },
  
  /**
   * 첨부파일 업로드 (단일)
   */
  uploadAttachment: (noticeId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`/notices/${noticeId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  /**
   * 첨부파일 업로드 (여러 개)
   */
  uploadAttachments: (noticeId, formData) => {
    return apiClient.post(`/notices/${noticeId}/attachments/bulk`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  /**
   * 첨부파일 목록 조회
   */
  getAttachments: (noticeId) => {
    return apiClient.get(`/notices/${noticeId}/attachments`);
  },
  
  /**
   * 첨부파일 다운로드
   */
  downloadAttachment: (attachmentId) => {
    return apiClient.get(`/notices/attachments/${attachmentId}/download`, {
      responseType: 'blob'
    });
  },
  
  /**
   * 첨부파일 삭제
   */
  deleteAttachment: (attachmentId) => {
    return apiClient.delete(`/notices/attachments/${attachmentId}`);
  },
  
  /**
   * 재발송 통계
   */
  getResendStatistics: (params) => {
    return apiClient.get('/notices/resend-statistics', { params });
  },
  
  /**
   * 재발송 가능 여부
   */
  canResend: (noticeId) => {
    return apiClient.get(`/notices/${noticeId}/can-resend`);
  }
};
