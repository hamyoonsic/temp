// NoticeApproval.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NoticeApproval.css';
import { approvalApi, noticeApi } from '../api';

const NoticeApproval = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [approvalList, setApprovalList] = useState([]);
  const [corporations, setCorporations] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [filters, setFilters] = useState({
    status: 'PENDING',
    corpId: '',
    orgUnitId: '',
    searchTerm: ''
  });

  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    checkAdminPermission();
    loadApprovalList();
  }, []);

  // 모달 오픈 시 바디 스크롤 방지
  useEffect(() => {
    if (showDetailModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [showDetailModal]);

  const checkAdminPermission = () => {
    try {
      // 1차: userData에서 확인
      const userDataStr = sessionStorage.getItem('userData');
      
      // 2차: user_me에서 확인 (SSORedirect에서 저장)
      const userMeStr = sessionStorage.getItem('user_me');
      
      let userData = null;
      
      if (userDataStr) {
        userData = JSON.parse(userDataStr);
      } else if (userMeStr) {
        userData = JSON.parse(userMeStr);
      } else {
        console.error('로그인 정보 없음 - sessionStorage:', {
          userData: userDataStr,
          user_me: userMeStr,
          allKeys: Object.keys(sessionStorage)
        });
        alert('로그인 정보를 찾을 수 없습니다.');
        navigate('/login');
        return;
      }
      
      console.log('관리자 권한 체크 - 사용자 정보:', userData);
      
      // license 배열에서 VIEW-ADMIN 권한 확인
      const hasAdminLicense = userData.license?.some(
        lic => lic.appId === 'VIEW-ADMIN' || lic.licCd === 'ADMIN'
      );
      
      setIsAdmin(hasAdminLicense);
      
      if (!hasAdminLicense) {
        alert('관리자 권한이 없습니다. 공지 등록 화면으로 이동합니다.');
        navigate('/notices/new');
      }
    } catch (error) {
      console.error('권한 확인 실패:', error);
      setIsAdmin(false);
      alert('권한 확인 중 오류가 발생했습니다.');
      navigate('/login');
    }
  };

  const loadApprovalList = async () => {
    setLoading(true);
    try {
      const result = await approvalApi.getPendingList({ page: 0, size: 100 });  // ✅ 변경
      
      if (result.success) {
        const notices = result.data.data || result.data;
        setApprovalList(Array.isArray(notices) ? notices : []);
      }
    } catch (error) {
      console.error('승인 목록 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (noticeId) => {
    if (!window.confirm('이 공지를 승인하시겠습니까?')) return;

    try {
      await approvalApi.approve(noticeId);  // ✅ 변경
      alert('공지가 승인되었습니다.');
      loadApprovalList();
    } catch (error) {
      console.error('승인 실패:', error);
      alert('승인 처리 중 오류가 발생했습니다.');
    }
  };

  const handleReject = async (noticeId) => {
    const reason = prompt('반려 사유를 입력하세요:');
    if (!reason) return;

    try {
      await approvalApi.reject(noticeId, reason);  // ✅ 변경
      alert('공지가 반려되었습니다.');
      loadApprovalList();
    } catch (error) {
      console.error('반려 실패:', error);
      alert('반려 처리 중 오류가 발생했습니다.');
    }
  };

  const openDetailModal = async (noticeId) => {
    try {
      const result = await noticeApi.getById(noticeId);  // ✅ 변경
      
      if (result.success && result.data) {
        setSelectedNotice(result.data);
        setShowDetailModal(true);
      }
    } catch (error) {
      console.error('공지 상세 조회 실패:', error);
      alert('공지 상세 정보를 불러오는데 실패했습니다.');
    }
  };

  const filteredList = approvalList.filter(item => {
    if (filters.searchTerm && !item.title.includes(filters.searchTerm)) {
      return false;
    }
    return true;
  });

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '-';
    const date = new Date(dateTimeStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="notice-approval-page">
      <div className="notice-approval-container">
        <div className="page-header">
          <div className="header-left">
            <h1 className="page-title">공지 발송 결재</h1>
            <p className="page-description">공지 발송 승인 요청 목록을 확인하고 결재를 진행합니다</p>
          </div>
          {isAdmin && (
            <div className="admin-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              관리자 권한
            </div>
          )}
        </div>

        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner">
              <div className="spinner-circle"></div>
              <div className="loading-text">로딩 중...</div>
            </div>
          </div>
        )}

        {/* 필터 영역 */}
        <div className="filter-section">
          <div className="filter-row">
            <div className="filter-group flex-grow">
              <label>검색어</label>
              <input 
                type="text"
                value={filters.searchTerm}
                onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                className="filter-input"
                placeholder="공지 제목으로 검색"
              />
            </div>
            <button 
              onClick={loadApprovalList}
              className="btn-refresh"
            >
              🔄 새로고침
            </button>
          </div>
        </div>

        {/* 승인 요청 목록 테이블 */}
        <div className="approval-list-section">
          <div className="section-header-row">
            <h2 className="section-title">공지발송 승인 요청 목록</h2>
            <span className="record-count">{filteredList.length}건</span>
          </div>
          
          <div className="table-wrapper">
            <table className="approval-table">
              <thead>
                <tr>
                  <th>수신법인</th>
                  <th>수신부서</th>
                  <th>공지제목</th>
                  <th>중요도</th>
                  <th>발신부서</th>
                  <th>작성자</th>
                  <th>등록일시</th>
                  <th>액션</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-data">
                      승인 요청 건이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredList.map((item) => (
                    <tr key={item.noticeId}>
                      <td className="text-center">{item.noticeId}</td>
                      <td>
                        <button 
                          className="title-link"
                          onClick={() => openDetailModal(item.noticeId)}
                        >
                          {item.title}
                        </button>
                      </td>
                      <td className="text-center">
                        <span className={`priority-badge priority-${item.noticeLevel}`}>
                          {item.noticeLevel === 'L3' ? '긴급' : item.noticeLevel === 'L2' ? '중간' : '낮음'}
                        </span>
                      </td>
                      <td>{item.senderOrgUnitName || '-'}</td>
                      <td>{item.createdBy}</td>
                      <td>{formatDateTime(item.createdAt)}</td>
                      <td>
                        {isAdmin && (
                          <div className="action-buttons">
                            <button 
                              className="btn-approve"
                              onClick={() => handleApprove(item.noticeId)}
                            >
                              승인
                            </button>
                            <button 
                              className="btn-reject"
                              onClick={() => handleReject(item.noticeId)}
                            >
                              반려
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 상세보기 모달 */}
      {showDetailModal && selectedNotice && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content approval-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>공지 상세 정보</h3>
              <button onClick={() => setShowDetailModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="detail-section">
                <h4>기본 정보</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">공지ID</span>
                    <span className="detail-value">{selectedNotice.noticeId}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">중요도</span>
                    <span className="detail-value">
                      <span className={`priority-badge priority-${selectedNotice.noticeLevel}`}>
                        {selectedNotice.noticeLevel === 'L3' ? '긴급' : selectedNotice.noticeLevel === 'L2' ? '중간' : '낮음'}
                      </span>
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">발신부서</span>
                    <span className="detail-value">{selectedNotice.senderOrgUnitName || '-'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">점검/장애 여부</span>
                    <span className="detail-value">{selectedNotice.isMaintenance ? '예' : '아니오'}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>발송 설정</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">게시 시작일시</span>
                    <span className="detail-value">{formatDateTime(selectedNotice.publishStartAt)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">작성자</span>
                    <span className="detail-value">{selectedNotice.createdBy}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>공지 내용</h4>
                <div className="detail-item full-width">
                  <span className="detail-label">공지제목</span>
                  <div className="detail-value">{selectedNotice.title}</div>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">공지내용</span>
                  <div className="detail-value content-box" dangerouslySetInnerHTML={{ __html: selectedNotice.content }} />
                </div>
                {selectedNotice.tags && selectedNotice.tags.length > 0 && (
                  <div className="detail-item full-width">
                    <span className="detail-label">해시태그</span>
                    <div className="detail-value">
                      <div className="tags-display">
                        {selectedNotice.tags.map((tag, idx) => (
                          <span key={idx} className="tag-item">{tag.tagValue}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {selectedNotice.targets && selectedNotice.targets.length > 0 && (
                <div className="detail-section">
                  <h4>수신 대상</h4>
                  <div className="targets-list">
                    {selectedNotice.targets.map((target, idx) => (
                      <div key={idx} className="target-item">
                        <span className="target-type">{target.targetType === 'CORP' ? '법인' : '부서'}</span>
                        <span className="target-name">{target.targetName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              {isAdmin && (
                <>
                  <button 
                    className="btn btn-reject"
                    onClick={() => handleReject(selectedNotice.noticeId)}
                  >
                    반려하기
                  </button>
                  <button 
                    className="btn btn-approve"
                    onClick={() => handleApprove(selectedNotice.noticeId)}
                  >
                    승인하기
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeApproval;