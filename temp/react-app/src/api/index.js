// src/api/index.js

/**
 * 모든 API를 한 곳에서 export
 * 사용 예시:
 * import { noticeApi, corporationApi } from '@/api';
 * 또는
 * import * as api from '@/api';
 */

// 마스터 데이터 API
export { corporationApi } from './master/corporationApi';
export { organizationApi } from './master/organizationApi';
export { serviceApi } from './master/serviceApi';

// 공지 관련 API
export { noticeApi } from './notice/noticeApi';
export { approvalApi } from './notice/approvalApi';
export { dashboardApi } from './notice/dashboardApi';
export { templateApi } from './notice/templateApi';
export { signatureApi } from './notice/signatureApi';

// 관리자 API
export { adminDelegationApi } from './admin/adminDelegationApi';
export { adminUsersApi } from './admin/adminUsersApi';
