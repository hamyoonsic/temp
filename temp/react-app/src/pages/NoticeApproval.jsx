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
  const [activeTab, setActiveTab] = useState('PENDING');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  
  //  AdminContext에서 관리자 상태 가져오기
  const { isAdmin, isDelegatedAdmin, userInfo } = useAdmin();
  
  const [filters, setFilters] = useState({
    status: 'PENDING',
    searchTerm: ''
  });

  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setCurrentUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    setCurrentPage(0);
    loadApprovalList(activeTab, 0);
  }, [activeTab, currentUserId, isAdmin]);

  useEffect(() => {
    setCurrentPage(0);
    loadApprovalList(activeTab, 0);
  }, [pageSize]);

  //  모달 스크롤 제어 - 컴포넌트 안에 있어야 함!
  useEffect(() => {
    if (showDetailModal || showDelegationModal) {
      openModal();
    } else {
      closeModal();
    }
    return () => closeModal();
  }, [showDetailModal, showDelegationModal]);

  const loadApprovalList = async (tab = activeTab, page = currentPage) => {
    setLoading(true);
    try {
      if (tab === 'PENDING') {
        const params = {
          page,
          size: pageSize,
          sort: 'createdAt,DESC'
        };
        if (filters.searchTerm) {
          params.search = filters.searchTerm;
        }
        if (!isAdmin && currentUserId) {
          params.createdBy = currentUserId;
        }
        const result = await approvalApi.getPendingList(params);
        if (result.success && result.data) {
          const payload = result.data;
          const notices = Array.isArray(payload)
            ? payload
            : Array.isArray(payload.data) ? payload.data : [];
          setApprovalList(notices);
          setCurrentPage(payload.currentPage ?? page);
          setTotalPages(payload.totalPages ?? 1);
          setTotalElements(payload.totalElements ?? notices.length);
          setPageSize(payload.pageSize ?? pageSize);
        } else {
          setApprovalList([]);
          setTotalPages(1);
          setTotalElements(0);
        }
      } else if (tab === 'MY_DECISIONS') {
        const params = {
          status: 'APPROVED,REJECTED,SENT',
          page,
          size: pageSize,
          sort: 'updatedAt,DESC'
        };
        if (currentUserId) {
          params.updatedBy = currentUserId;
        }
        if (filters.searchTerm) {
          params.search = filters.searchTerm;
        }
        const result = await noticeApi.getList(params);
        if (result.success && result.data) {
          const payload = result.data;
          const notices = Array.isArray(payload)
            ? payload
            : Array.isArray(payload.data) ? payload.data : [];
          setApprovalList(notices);
          setCurrentPage(payload.currentPage ?? page);
          setTotalPages(payload.totalPages ?? 1);
          setTotalElements(payload.totalElements ?? notices.length);
          setPageSize(payload.pageSize ?? pageSize);
        } else {
          setApprovalList([]);
          setTotalPages(1);
          setTotalElements(0);
        }
      }
    } catch (error) {
      console.error('승인 목록 로드 실패:', error);
      setApprovalList([]);
      setTotalPages(1);
      setTotalElements(0);
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
      if (selectedNotice && selectedNotice.noticeId === noticeId) {
        setSelectedNotice(prev => prev ? { ...prev, noticeStatus: 'APPROVED' } : prev);
      }
      loadApprovalList();
    } catch (error) {
      console.error('승인 실패:', error);
      alert('승인 처리 중 오류가 발생했습니다.');
    }
  };

  const handleCalendarRetry = async (noticeId) => {
    if (!window.confirm('캘린더를 재생성하시겠습니까?')) return;
    setLoading(true);
    try {
      await noticeApi.retryCalendar(noticeId);
      alert('캘린더 재생성 요청이 완료되었습니다.');
    } catch (error) {
      console.error('캘린더 재생성 실패:', error);
      alert('캘린더 재생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
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
      if (selectedNotice && selectedNotice.noticeId === noticeId) {
        setSelectedNotice(prev => prev ? { ...prev, noticeStatus: 'REJECTED' } : prev);
      }
      loadApprovalList();
    } catch (error) {
      console.error('반려 실패:', error);
      alert('반려 처리 중 오류가 발생했습니다.');
    }
  };

  const handleCancel = async (noticeId) => {
    if (!window.confirm('승인 전 공지 요청을 취소하시겠습니까?')) return;

    try {
      await approvalApi.cancel(noticeId);
      alert('공지 요청이 취소되었습니다.');
      if (selectedNotice && selectedNotice.noticeId === noticeId) {
        setSelectedNotice(prev => prev ? { ...prev, noticeStatus: 'CANCELLED' } : prev);
      }
      loadApprovalList();
    } catch (error) {
      console.error('취소 실패:', error);
      alert('취소 처리 중 오류가 발생했습니다.');
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

  const openCompletionDetail = async (noticeId) => {
    try {
      const result = await noticeApi.getCompletion(noticeId);
      if (result.success && result.data) {
        setSelectedNotice(result.data);
        setShowDetailModal(true);
      } else {
        alert('완료 공지가 없습니다.');
      }
    } catch (error) {
      console.error('완료 공지 조회 실패:', error);
      alert('완료 공지를 불러오지 못했습니다.');
    }
  };

  const openOriginalDetail = async (noticeId) => {
    try {
      const result = await noticeApi.getById(noticeId);
      if (result.success && result.data) {
        setSelectedNotice(result.data);
        setShowDetailModal(true);
      }
    } catch (error) {
      console.error('원본 공지 조회 실패:', error);
      alert('원본 공지를 불러오지 못했습니다.');
    }
  };

  const handleSearch = () => {
    setCurrentPage(0);
    loadApprovalList(activeTab, 0);
  };

  const changePage = async (page) => {
    if (page < 0 || page >= totalPages) return;
    const scrollY = window.scrollY;
    setCurrentPage(page);
    await loadApprovalList(activeTab, page);
    window.scrollTo({ top: scrollY });
  };

  const getVisiblePages = () => {
    const maxButtons = 5;
    const pages = [];
    let start = Math.max(0, currentPage - Math.floor(maxButtons / 2));
    let end = Math.min(totalPages - 1, start + maxButtons - 1);
    if (end - start + 1 < maxButtons) {
      start = Math.max(0, end - maxButtons + 1);
    }
    for (let i = start; i <= end; i += 1) {
      pages.push(i);
    }
    return pages;
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '-';
    const date = new Date(dateTimeStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      'DRAFT': { text: '작성중', class: 'draft', color: '#64748b' },
      'PENDING': { text: '승인대기', class: 'pending', color: '#f59e0b' },
      'APPROVED': { text: '승인완료', class: 'approved', color: '#3b82f6' },
      'SENT': { text: '발송완료', class: 'completed', color: '#10b981' },
      'FAILED': { text: '발송실패', class: 'failed', color: '#ef4444' },
      'REJECTED': { text: '발송반려', class: 'rejected', color: '#dc2626' },
      'CANCELLED': { text: '취소됨', class: 'cancelled', color: '#64748b' }
    };
    return statusMap[status] || { text: status, class: 'default', color: '#94a3b8' };
  };

  const getReceiverInfo = (targets) => {
    if (!targets || targets.length === 0) return { corps: '-', depts: '-' };
    const corpTargets = targets.filter(t => t.targetType === 'CORP');
    const orgTargets = targets.filter(t => t.targetType === 'ORG_UNIT');

    const corpNames = Array.from(new Set(
      corpTargets
        .map(t => t.targetName)
        .filter(name => name && name.trim().length > 0)
        .map(name => name.trim())
    ));

    const orgCorpNames = Array.from(new Set(
      orgTargets
        .map(t => t.targetName)
        .filter(name => name && name.includes('/'))
        .map(name => name.split('/')[0].trim())
        .filter(name => name.length > 0)
    ));

    const corpNameForDept = corpNames.length === 1 ? corpNames[0] : '';

    const depts = orgTargets
      .map(t => t.targetName || '')
      .map(name => name.trim())
      .filter(name => name.length > 0)
      .map(name => {
        if (name.includes('/')) {
          return name.replace(/\s*\/\s*/g, '_');
        }
        if (corpNameForDept) {
          return `${corpNameForDept}_${name}`;
        }
        return name;
      })
      .join(', ');

    const inferredCorp = corpNames.join(', ')
      || orgCorpNames.join(', ')
      || '-';
    return {
      corps: inferredCorp,
      depts: depts || '전체'
    };
  };

  const detailReceiverInfo = selectedNotice
    ? getReceiverInfo(selectedNotice.targets)
    : { corps: '-', depts: '-' };

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
          <div className="tab-row">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'PENDING' ? 'active' : ''}`}
              onClick={() => setActiveTab('PENDING')}
            >
              승인 요청
            </button>
            {isAdmin && (
              <button
                type="button"
                className={`tab-btn ${activeTab === 'MY_DECISIONS' ? 'active' : ''}`}
                onClick={() => setActiveTab('MY_DECISIONS')}
              >
                승인/반려 목록
              </button>
            )}
          </div>
          <div className="filter-row">
            <div className="filter-group flex-grow">
              <label>검색어</label>
              <input 
                type="text"
                value={filters.searchTerm}
                onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="filter-input"
                placeholder="공지 제목으로 검색"
              />
            </div>
            <div className="filter-group">
              <label>Page size</label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
                className="filter-select"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <button 
              onClick={handleSearch}
              className="btn-refresh"
            >
              🔄 새로고침
            </button>
          </div>
        </div>

        {/* 승인 요청 목록 테이블 */}
        <div className="approval-list-section">
          <div className="section-header-row">
            <h2 className="section-title">
              {activeTab === 'PENDING' ? '공지발송 승인 요청 목록' : '승인/반려 목록'}
            </h2>
            <div className="section-header-actions">
              <span className="record-count">{totalElements}건</span>
              {totalPages > 1 && (
                <div className="pagination pagination-compact">
                  <button
                    className="page-btn"
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 0}
                  >
                    이전
                  </button>
                  {getVisiblePages().map(page => (
                    <button
                      key={page}
                      className={`page-btn ${page === currentPage ? 'active' : ''}`}
                      onClick={() => changePage(page)}
                    >
                      {page + 1}
                    </button>
                  ))}
                  <button
                    className="page-btn"
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage + 1 >= totalPages}
                  >
                    다음
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="table-wrapper">
            <table className="approval-table">
              <thead>
                <tr>
                  <th>공지ID</th>
                  <th>수신법인</th>
                  <th>수신부서</th>
                  <th>공지제목</th>
                  <th>중요도</th>
                  <th>발신부서</th>
                  <th>작성자</th>
                  <th>등록일시</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {approvalList.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="no-data">
                      승인 요청 건이 없습니다.
                    </td>
                  </tr>
                ) : (
                  approvalList.map((item) => (
                    <tr key={item.noticeId}>
                      <td className="text-center">{item.noticeId}</td>
                      <td>{getReceiverInfo(item.targets).corps}</td>
                      <td>{getReceiverInfo(item.targets).depts}</td>
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
                      <td>{item.createdByName || item.createdBy}</td>
                      <td>{formatDateTime(item.createdAt)}</td>
                      <td>
                        {activeTab === 'PENDING' ? (
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
                        ) : (
                          <span
                            className={`status-badge status-${getStatusInfo(item.noticeStatus).class}`}
                            style={{
                              borderColor: getStatusInfo(item.noticeStatus).color,
                              color: getStatusInfo(item.noticeStatus).color
                            }}
                          >
                            {getStatusInfo(item.noticeStatus).text}
                          </span>
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
                <h4>발송 상태</h4>
                <div className="status-info-row">
                  <span className={`status-badge-large status-${getStatusInfo(selectedNotice.noticeStatus).class}`}>
                    {getStatusInfo(selectedNotice.noticeStatus).text}
                  </span>
                  <span className={`priority-badge priority-${selectedNotice.noticeLevel}`}>
                    중요도 {selectedNotice.noticeLevel === 'L3' ? '긴급' : selectedNotice.noticeLevel === 'L2' ? '중간' : '낮음'}
                  </span>
                  {(selectedNotice.isMaintenance ||
                    (selectedNotice.calendarRegister && selectedNotice.noticeStatus === 'SENT')) && (
                    <div className="status-info-actions">
                      {selectedNotice.calendarRegister && selectedNotice.noticeStatus === 'SENT' && (
                        <button
                          type="button"
                          className="btn btn-cancel"
                          onClick={() => handleCalendarRetry(selectedNotice.noticeId)}
                        >
                          캘린더 재생성
                        </button>
                      )}
                      {selectedNotice.isMaintenance && (
                        selectedNotice.isCompleted ? (
                          <button
                            type="button"
                            className="btn btn-cancel"
                            onClick={() => openCompletionDetail(selectedNotice.noticeId)}
                          >
                            완료 공지 보기
                          </button>
                        ) : (
                          (selectedNotice.noticeStatus === 'APPROVED' &&
                          currentUserId && selectedNotice.createdBy === currentUserId) && (
                            <button
                              type="button"
                              className="btn btn-submit"
                              onClick={() => navigate('/notices/new', { state: { isCompletion: true, originalNotice: selectedNotice } })}
                            >
                              완료 공지 등록
                            </button>
                          )
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="detail-section">
                <h4>기본 정보</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">수신법인</span>
                    <span className="detail-value">{detailReceiverInfo.corps}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">공지유형</span>
                    <span className="detail-value">{selectedNotice.noticeType || '-'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">수신부서</span>
                    <span className="detail-value">{detailReceiverInfo.depts}</span>
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

              {selectedNotice.parentNoticeId && (
                <div className="detail-section">
                  <h4>원본 공지</h4>
                  <div className="detail-item full-width">
                    <button
                      type="button"
                      className="btn btn-cancel"
                      onClick={() => openOriginalDetail(selectedNotice.parentNoticeId)}
                    >
                      원본 공지 보기
                    </button>
                  </div>
                </div>
              )}

              <div className="detail-section">
                <h4>발송 정보</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">게시 시작일시</span>
                    <span className="detail-value">{formatDateTime(selectedNotice.publishStartAt)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">작성자</span>
                    <span className="detail-value">{selectedNotice.createdByName || selectedNotice.createdBy}</span>
                  </div>
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
            </div>
            
            <div className="modal-footer">
              {selectedNotice.noticeStatus === 'PENDING' ? (
                <>
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
                  {currentUserId && selectedNotice.createdBy === currentUserId && (
                    <button
                      className="btn btn-edit"
                      onClick={() => navigate(`/notices/edit/${selectedNotice.noticeId}`)}
                    >
                      수정하기
                    </button>
                  )}
                  {currentUserId && selectedNotice.createdBy === currentUserId && (
                    <button
                      className="btn btn-cancel"
                      onClick={() => handleCancel(selectedNotice.noticeId)}
                    >
                      취소하기
                    </button>
                  )}
                </>
              ) : (
                <button className="btn btn-close" onClick={() => setShowDetailModal(false)}>
                  닫기
                </button>
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
