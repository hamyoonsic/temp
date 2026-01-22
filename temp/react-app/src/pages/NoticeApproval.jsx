// react-app/src/pages/NoticeApproval.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NoticeApproval.css';
import { approvalApi, noticeApi } from '../api';
import { useAdmin } from '../contexts/AdminContext';
import AdminDelegationModal from '../components/AdminDelegationModal';

//  모달 스크롤 제어 함수
const openModal = () => {
  const scrollY = window.scrollY;
  const scrollX = window.scrollX;
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = `-${scrollX}px`;
  document.body.style.right = '0';
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';
  if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
  document.body.setAttribute('data-scroll-y', scrollY.toString());
  document.body.setAttribute('data-scroll-x', scrollX.toString());
};

const closeModal = () => {
  const scrollYAttr = document.body.getAttribute('data-scroll-y');
  const scrollXAttr = document.body.getAttribute('data-scroll-x');
  if (scrollYAttr === null || scrollXAttr === null) {
    return;
  }
  const scrollY = parseInt(scrollYAttr || '0');
  const scrollX = parseInt(scrollXAttr || '0');
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
  requestAnimationFrame(() => window.scrollTo(scrollX, scrollY));
  document.body.removeAttribute('data-scroll-y');
  document.body.removeAttribute('data-scroll-x');
};

const NoticeApproval = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [approvalList, setApprovalList] = useState([]);
  const [showDelegationModal, setShowDelegationModal] = useState(false);
  
  //  AdminContext에서 관리자 상태 가져오기
  const { isAdmin, isDelegatedAdmin, userInfo } = useAdmin();
  
  const [filters, setFilters] = useState({
    status: 'PENDING',
    searchTerm: ''
  });

  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadApprovalList();
  }, []);

  //  모달 스크롤 제어 - 컴포넌트 안에 있어야 함!
  useEffect(() => {
    if (showDetailModal || showDelegationModal) {
      openModal();
    } else {
      closeModal();
    }
    return () => closeModal();
  }, [showDetailModal, showDelegationModal]);

  const loadApprovalList = async () => {
    setLoading(true);
    try {
      const result = await approvalApi.getPendingList({ page: 0, size: 100 });
      
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
    if (!isAdmin) {
      alert('승인 권한이 없습니다. (HR150138 권한 필요)');
      return;
    }

    if (!window.confirm('이 공지를 승인하시겠습니까?')) return;

    try {
      await approvalApi.approve(noticeId);
      alert('공지가 승인되었습니다.');
      loadApprovalList();
    } catch (error) {
      console.error('승인 실패:', error);
      alert('승인 처리 중 오류가 발생했습니다.');
    }
  };

  const handleReject = async (noticeId) => {
    if (!isAdmin) {
      alert('반려 권한이 없습니다. (HR150138 권한 필요)');
      return;
    }

    const reason = prompt('반려 사유를 입력하세요:');
    if (!reason) return;

    try {
      await approvalApi.reject(noticeId, reason);
      alert('공지가 반려되었습니다.');
      loadApprovalList();
    } catch (error) {
      console.error('반려 실패:', error);
      alert('반려 처리 중 오류가 발생했습니다.');
    }
  };

  const openDetailModal = async (noticeId) => {
    try {
      const result = await noticeApi.getById(noticeId);
      
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

  if (loading) {
    return (
      <div className="notice-approval-page">
        <div className="notice-approval-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>데이터 로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notice-approval-page">
      <div className="notice-approval-container">
        <div className="page-header">
          <div className="header-left">
            <h1 className="page-title">공지 발송 결재</h1>
            <p className="page-description">공지 발송 승인 요청 목록을 확인하고 결재를 진행합니다</p>
          </div>
          
          <div className="header-right">
            {/*  로그인 정보 없음 경고 */}
            {!userInfo && (
              <div className="error-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>로그인 정보 없음</span>
              </div>
            )}
            
            {/*  관리자 위임 버튼 - HR150138 권한자만 표시 */}
            {userInfo && userInfo.job?.[0]?.ttlCd === 'HR150138' && (
              <div 
                className="admin-badge clickable"
                onClick={() => setShowDelegationModal(true)}
                title="관리자 권한 위임 설정"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>관리자 위임</span>
              </div>
            )}
          </div>
        </div>

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
                  <th>공지ID</th>
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
                        <div className="action-buttons">
                          {/*  승인 버튼 - 권한에 따라 활성화/비활성화 */}
                          <button 
                            className={`btn-approve ${!isAdmin ? 'disabled' : ''}`}
                            onClick={() => handleApprove(item.noticeId)}
                            disabled={!isAdmin}
                            title={!isAdmin ? '승인 권한이 없습니다 (HR150138 권한 필요)' : ''}
                          >
                            승인
                          </button>
                          {/*  반려 버튼 - 권한에 따라 활성화/비활성화 */}
                          <button 
                            className={`btn-reject ${!isAdmin ? 'disabled' : ''}`}
                            onClick={() => handleReject(item.noticeId)}
                            disabled={!isAdmin}
                            title={!isAdmin ? '반려 권한이 없습니다 (HR150138 권한 필요)' : ''}
                          >
                            반려
                          </button>
                        </div>
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
                  <div className="detail-value content-box" dangerouslySetInnerHTML={{__html: selectedNotice.content}}></div>
                </div>
              </div>

              {selectedNotice.noticeStatus === 'REJECTED' && selectedNotice.rejectReason && (
                <div className="detail-section">
                  <h4>반려 사유</h4>
                  <div className="detail-item full-width">
                    <span className="detail-label">사유</span>
                    <div className="detail-value">{selectedNotice.rejectReason}</div>
                  </div>
                </div>
              )}

              {selectedNotice.targets && selectedNotice.targets.length > 0 && (
                <div className="detail-section">
                  <h4>수신 대상</h4>
                  <div className="targets-list">
                    {selectedNotice.targets.map((target, index) => (
                      <div key={index} className="target-item">
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

      {/*  권한 위임 모달 */}
      {userInfo && (
        <AdminDelegationModal
          isOpen={showDelegationModal}
          onClose={() => setShowDelegationModal(false)}
          currentUserId={userInfo.userId}
          currentUserName={userInfo.userNm}
        />
      )}
    </div>
  );
};

export default NoticeApproval;
