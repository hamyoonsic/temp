// api/notices.js
import http from './http';

export const noticeApi = {
  // 공지 등록
  createNotice: (data) => http.post('/api/notices', data),
  
  // 공지 목록 조회 (History용)
  getNotices: (params) => http.get('/api/notices', { params }),
  
  // 공지 상세 조회
  getNotice: (id) => http.get(`/api/notices/${id}`),
  
  // 공지 수정
  updateNotice: (id, data) => http.put(`/api/notices/${id}`, data),
  
  // 공지 삭제
  deleteNotice: (id) => http.delete(`/api/notices/${id}`),
  
  // 승인 대기 목록 조회
  getApprovalList: (params) => http.get('/api/notices/approval/pending', { params }),
  
  // 공지 승인
  approveNotice: (id) => http.post(`/api/notices/${id}/approve`),
  
  // 공지 반려
  rejectNotice: (id, reason) => http.post(`/api/notices/${id}/reject`, null, {
    params: { reason }
  }),
  
  // 발송 이력 조회
  getNoticeHistory: (params) => http.get('/api/notices/history', { params }),
  
  // 공지 재발송
  retryNotice: (id) => http.post(`/api/notices/${id}/retry`),
  
  // 공지 유형 목록
  getNoticeTypes: () => http.get('/api/notices/types'),
  
  // 서비스 목록
  getServices: () => http.get('/api/services'),
  
  // 법인 목록
  getCorporations: () => http.get('/api/corporations'),
  
  // 조직/부서 목록
  getOrganizations: (corpId) => {
    const params = corpId ? { corpId } : {};
    return http.get('/api/organizations', { params });
  }
};