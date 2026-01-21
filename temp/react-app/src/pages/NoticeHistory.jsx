// NoticeHistory.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { noticeApi, corporationApi } from '../api';
import './NoticeHistory.css';

// ✅ 모달 스크롤 제어 함수
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

const NoticeHistory = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [corporations, setCorporations] = useState([]);

  const defaultStatus = location.state?.status || '';
  const [filters, setFilters] = useState({
    corpId: '',
    status: defaultStatus,
    startDate: '',
    endDate: '',
    searchTerm: ''
  });

  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const maxDate = '2099-12-31';

  useEffect(() => {
    loadCorporations();
    loadHistoryList(filters);
  }, []);

  // ✅ 모달 스크롤 제어 - 컴포넌트 안에 있어야 함!
  useEffect(() => {
    if (showDetailModal) {
      openModal();
    } else {
      closeModal();
    }
    return () => closeModal();
  }, [showDetailModal]);

  const formatDateInput = (value) => {
    if (!value) return '';
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 8) {
      return `${numbers.substring(0, 4)}-${numbers.substring(4, 6)}-${numbers.substring(6, 8)}`;
    }
    if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return value;
    }
    return value;
  };

  const isValidDateInput = (value) => {
    if (!value) return true;
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
  };

  const handleDateFilterChange = (field, value) => {
    if (!isValidDateInput(value)) {
      return;
    }
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    if (value) {
      setTimeout(() => loadHistoryList(newFilters), 100);
    }
  };

  const loadCorporations = async () => {
    try {
      const result = await corporationApi.getAll();
      if (result.success) {
        setCorporations(result.data || []);
      }
    } catch (error) {
      console.error('법인 목록 로드 실패:', error);
    }
  };

  const loadHistoryList = async (currentFilters = filters) => {
    try {
      const params = {
        sort: 'createdAt,DESC'
      };
      
      if (currentFilters.corpId) params.corpId = currentFilters.corpId;
      if (currentFilters.status) params.status = currentFilters.status;
      if (currentFilters.startDate) params.startDate = formatDateInput(currentFilters.startDate);
      if (currentFilters.endDate) params.endDate = formatDateInput(currentFilters.endDate);
      if (currentFilters.searchTerm) params.search = currentFilters.searchTerm;
      
      const result = await noticeApi.getList(params);
      
      if (result.success && result.data) {
        const notices = result.data.data || result.data;
        setHistoryList(Array.isArray(notices) ? notices : []);
      } else {
        console.error('데이터 로드 실패:', result);
        setHistoryList([]);
      }
    } catch (error) {
      console.error('발송 이력 로드 실패:', error);
      setHistoryList([]);
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

  const getStatusInfo = (status) => {
    const statusMap = {
      'DRAFT': { text: '작성중', class: 'draft', color: '#64748b' },
      'PENDING': { text: '승인대기', class: 'pending', color: '#f59e0b' },
      'APPROVED': { text: '승인완료', class: 'approved', color: '#3b82f6' },
      'SENT': { text: '발송완료', class: 'completed', color: '#10b981' },
      'FAILED': { text: '발송실패', class: 'failed', color: '#ef4444' },
      'REJECTED': { text: '발송반려', class: 'rejected', color: '#dc2626' },
      'COMPLETED': { text: '완료', class: 'done', color: '#059669' }
    };
    return statusMap[status] || { text: status, class: 'default', color: '#94a3b8' };
  };

  const handleRetry = async (noticeId) => {
    if (!window.confirm('이 공지를 재발송하시겠습니까?')) return;

    setLoading(true);
    try {
      await noticeApi.retry(noticeId);
      alert('재발송 요청이 완료되었습니다.');
      loadHistoryList(filters);
    } catch (error) {
      console.error('재발송 실패:', error);
      alert('재발송 요청 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadHistoryList(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      corpId: '',
      status: defaultStatus,
      startDate: '',
      endDate: '',
      searchTerm: ''
    };
    setFilters(resetFilters);
    setTimeout(() => loadHistoryList(resetFilters), 50);
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '-';
    const date = new Date(dateTimeStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const getReceiverInfo = (targets) => {
    if (!targets || targets.length === 0) return { corps: '-', depts: '-' };
    
    const corps = targets
      .filter(t => t.targetType === 'CORP')
      .map(t => t.targetName)
      .join(', ');
    
    const depts = targets
      .filter(t => t.targetType === 'ORG_UNIT')
      .map(t => t.targetName)
      .join(', ');
    
    return {
      corps: corps || '-',
      depts: depts || '-'
    };
  };

  if (loading) {
    return (
      <div className="notice-history-page">
        <div className="notice-history-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>데이터 로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notice-history-page">
      <div className="notice-history-container">
        <div className="page-header">
          <h1 className="page-title">공지 발송 History</h1>
          <p className="page-description">공지 발송 이력을 조회하고 관리합니다</p>
        </div>

        <div className="filter-section">
          <div className="filter-row">
            <div className="filter-group">
              <label>법인</label>
              <select 
                value={filters.corpId}
                onChange={(e) => {
                  const newFilters = {...filters, corpId: e.target.value};
                  setFilters(newFilters);
                  setTimeout(() => loadHistoryList(newFilters), 100);
                }}
                className="filter-select"
              >
                <option value="">전체</option>
                {corporations.map(corp => (
                  <option key={corp.corpId} value={corp.corpId}>
                    {corp.corpName}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>승인 상태</label>
              <select
                value={filters.status}
                onChange={(e) => {
                  const newFilters = { ...filters, status: e.target.value };
                  setFilters(newFilters);
                  setTimeout(() => loadHistoryList(newFilters), 100);
                }}
                className="filter-select"
              >
                <option value="">전체</option>
                <option value="PENDING">승인 대기</option>
                <option value="APPROVED">승인 완료</option>
                <option value="SENT">발송 완료</option>
                <option value="FAILED">발송 실패</option>
                <option value="REJECTED">발송 반려</option>
                <option value="COMPLETED">완료</option>
              </select>
            </div>

            <div className="filter-group">
              <label>검색기간</label>
              <div className="date-range">
                <input 
                  type="date"
                  value={filters.startDate}
                  max={maxDate}
                  onChange={(e) => handleDateFilterChange('startDate', e.target.value)}
                  className="filter-input"
                  placeholder="???"
                />
                <span>~</span>
                <input 
                  type="date"
                  value={filters.endDate}
                  max={maxDate}
                  onChange={(e) => handleDateFilterChange('endDate', e.target.value)}
                  className="filter-input"
                  placeholder="???"
                />
              </div>
            </div>

            <div className="filter-group flex-grow">
              <label>검색어</label>
              <input 
                type="text"
                value={filters.searchTerm}
                onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="filter-input"
                placeholder="공지 제목으로 검색"
              />
            </div>
            
            <div className="filter-actions">
              <button onClick={handleSearch} className="btn-search">
                🔍 검색
              </button>
              <button onClick={handleReset} className="btn-reset">
                🔄 초기화
              </button>
            </div>
          </div>
        </div>

        <div className="history-list-section">
          <div className="section-header-row">
            <h2 className="section-title">공지 발송 로그</h2>
            <span className="record-count">{historyList.length}건</span>
          </div>
          
          <div className="table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>수신법인</th>
                  <th>수신부서</th>
                  <th>공지제목</th>
                  <th>중요도</th>
                  <th>발신부서</th>
                  <th>작성자</th>
                  <th>등록일시</th>
                  <th>발송상태</th>
                  <th>액션</th>
                </tr>
              </thead>
              <tbody>
                {historyList.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="no-data">
                      발송 이력이 없습니다.
                    </td>
                  </tr>
                ) : (
                  historyList.map((item) => {
                    const statusInfo = getStatusInfo(item.noticeStatus);
                    const receiverInfo = getReceiverInfo(item.targets);
                    
                    return (
                      <tr key={item.noticeId}>
                        <td>{receiverInfo.corps}</td>
                        <td>{receiverInfo.depts}</td>
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
                          <span 
                            className={`status-badge status-${statusInfo.class}`}
                            style={{ background: `${statusInfo.color}15`, color: statusInfo.color, borderColor: statusInfo.color }}
                          >
                            {statusInfo.text}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-detail"
                              onClick={() => openDetailModal(item.noticeId)}
                            >
                              상세
                            </button>
                            {item.noticeStatus === 'FAILED' && (
                              <button 
                                className="btn-retry"
                                onClick={() => handleRetry(item.noticeId)}
                              >
                                재발송
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showDetailModal && selectedNotice && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content history-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>공지 발송 상세 정보</h3>
              <button onClick={() => setShowDetailModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="detail-section">
                <h4>발송 상태</h4>
                <div className="status-info-box">
                  <div className="status-info-item">
                    <span className="status-info-label">발송상태</span>
                    <span className={`status-badge-large status-${getStatusInfo(selectedNotice.noticeStatus).class}`}>
                      {getStatusInfo(selectedNotice.noticeStatus).text}
                    </span>
                  </div>
                </div>
              </div>

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
                <h4>발송 정보</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">게시 시작일시</span>
                    <span className="detail-value">{formatDateTime(selectedNotice.publishStartAt)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">등록일시</span>
                    <span className="detail-value">{formatDateTime(selectedNotice.createdAt)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">작성자</span>
                    <span className="detail-value">{selectedNotice.createdBy}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">수정일시</span>
                    <span className="detail-value">{formatDateTime(selectedNotice.updatedAt)}</span>
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
              {selectedNotice.noticeStatus === 'FAILED' && (
                <button 
                  className="btn btn-retry"
                  onClick={() => {
                    handleRetry(selectedNotice.noticeId);
                    setShowDetailModal(false);
                  }}
                >
                  재발송
                </button>
              )}
              <button 
                className="btn btn-close"
                onClick={() => setShowDetailModal(false)}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeHistory;
