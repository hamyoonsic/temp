// react-app/src/components/AdminDelegationModal.jsx
import React, { useState, useEffect } from 'react';
import { adminDelegationApi } from '../api/admin/adminDelegationApi';
import { adminUsersApi } from '../api/admin/adminUsersApi';
import { useAdmin } from '../contexts/AdminContext';
import './AdminDelegationModal.css';

const AdminDelegationModal = ({ isOpen, onClose, currentUserId, currentUserName }) => {
  const nowDateTime = new Date().toISOString().slice(0, 16);
  const maxDateTime = '2099-12-31T23:59';

  const isValidDateTimeInput = (value) => {
    if (!value) return true;
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value);
  };

  const { refreshPermission } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [adminUsers, setAdminUsers] = useState([]);
  const [myDelegations, setMyDelegations] = useState([]);
  
  const [formData, setFormData] = useState({
    delegateUserId: '',
    delegateUserNm: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  useEffect(() => {
    if (isOpen) {
      loadAdminUsers();
      loadMyDelegations();
      initializeDefaultDates();
    }
  }, [isOpen]);

  const initializeDefaultDates = () => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}T09:00`;
    };

    setFormData(prev => ({
      ...prev,
      startDate: formatDate(today),
      endDate: formatDate(nextWeek),
    }));
  };

  const loadAdminUsers = async () => {
    try {
      const result = await adminUsersApi.getAdminUsers('HR150138');
      if (result.success) {
        // 현재 사용자 제외
        const filteredUsers = result.data.filter(user => user.userId !== currentUserId);
        setAdminUsers(filteredUsers);
      }
    } catch (error) {
      console.error('관리자 목록 로드 실패:', error);
      alert('관리자 목록을 불러오는데 실패했습니다.');
    }
  };

  const loadMyDelegations = async () => {
    try {
      const result = await adminDelegationApi.getMyDelegations();
      if (result.success) {
        setMyDelegations(result.data || []);
      }
    } catch (error) {
      console.error('위임 목록 로드 실패:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.delegateUserId) {
      alert('대리 관리자를 선택해주세요.');
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      alert('위임 기간을 입력해주세요.');
      return;
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      alert('종료일은 시작일보다 이후여야 합니다.');
      return;
    }

    setLoading(true);
    try {
      // 날짜 형식 변환: "2026-01-21T09:00" → "2026-01-21T09:00:00"
      const requestData = {
        ...formData,
        startDate: formData.startDate.length === 16 ? `${formData.startDate}:00` : formData.startDate,
        endDate: formData.endDate.length === 16 ? `${formData.endDate}:00` : formData.endDate,
      };

      await adminDelegationApi.createDelegation(requestData);
      alert('권한 위임이 생성되었습니다.');
      
      // ✅ 위임 목록 갱신
      loadMyDelegations();
      
      // ✅ 전역 권한 상태 갱신 (헤더 배지 즉시 업데이트)
      await refreshPermission();
      
      resetForm();
    } catch (error) {
      console.error('권한 위임 생성 실패:', error);
      alert(error.response?.data?.message || '권한 위임 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelegateChange = (e) => {
    const selectedUserId = e.target.value;
    const selectedUser = adminUsers.find(user => user.userId === selectedUserId);
    
    setFormData({
      ...formData,
      delegateUserId: selectedUserId,
      delegateUserNm: selectedUser ? selectedUser.userKoNm : '',
    });
  };

  const handleDeactivate = async (delegationId) => {
    if (!window.confirm('이 권한 위임을 비활성화하시겠습니까?')) return;

    try {
      await adminDelegationApi.deactivateDelegation(delegationId);
      alert('권한 위임이 비활성화되었습니다.');
      
      // ✅ 위임 목록 갱신
      loadMyDelegations();
      
      // ✅ 전역 권한 상태 갱신 (헤더 배지 즉시 업데이트)
      await refreshPermission();
    } catch (error) {
      console.error('비활성화 실패:', error);
      alert('비활성화 중 오류가 발생했습니다.');
    }
  };

  const resetForm = () => {
    setFormData({
      delegateUserId: '',
      delegateUserNm: '',
      startDate: '',
      endDate: '',
      reason: '',
    });
    initializeDefaultDates();
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '-';
    const date = new Date(dateTimeStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content delegation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>관리자 권한 위임 설정</h3>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* 현재 관리자 정보 */}
          <div className="current-admin-info">
            <div className="info-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>현재 관리자: {currentUserName} ({currentUserId})</span>
            </div>
          </div>

          {/* 권한 위임 생성 폼 */}
          <div className="delegation-form-section">
            <h4>새 권한 위임 생성</h4>
            <form onSubmit={handleSubmit} className="delegation-form">
              <div className="form-group">
                <label className="form-label">
                  대리 관리자 선택 <span className="required">*</span>
                </label>
                <select
                  className="form-select"
                  value={formData.delegateUserId}
                  onChange={handleDelegateChange}
                  required
                >
                  <option value="">선택하세요</option>
                  {adminUsers.map(user => (
                    <option key={user.userId} value={user.userId}>
                      {user.userKoNm} ({user.userId}) - {user.deptNm}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    시작 일시 <span className="required">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={formData.startDate}
                    min={nowDateTime}
                    max={maxDateTime}
                    onChange={(e) => {
                      const nextValue = e.target.value;
                      if (!isValidDateTimeInput(nextValue)) {
                        return;
                      }
                      if (nextValue && nextValue < nowDateTime) {
                        return;
                      }
                      setFormData({...formData, startDate: nextValue});
                    }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    종료 일시 <span className="required">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={formData.endDate}
                    min={formData.startDate || nowDateTime}
                    max={maxDateTime}
                    onChange={(e) => {
                      const nextValue = e.target.value;
                      if (!isValidDateTimeInput(nextValue)) {
                        return;
                      }
                      const minValue = formData.startDate || nowDateTime;
                      if (nextValue && nextValue < minValue) {
                        return;
                      }
                      setFormData({...formData, endDate: nextValue});
                    }}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">위임 사유</label>
                <textarea
                  className="form-textarea"
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  placeholder="위임 사유를 입력하세요 (선택사항)"
                  rows="3"
                />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? '생성 중...' : '권한 위임 생성'}
              </button>
            </form>
          </div>

          {/* 내 위임 목록 */}
          <div className="delegation-list-section">
            <h4>내 권한 위임 목록</h4>
            {myDelegations.length === 0 ? (
              <p className="no-data">위임 내역이 없습니다.</p>
            ) : (
              <div className="delegation-table-wrapper">
                <table className="delegation-table">
                  <thead>
                    <tr>
                      <th>대리자</th>
                      <th>시작일</th>
                      <th>종료일</th>
                      <th>사유</th>
                      <th>상태</th>
                      <th>액션</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myDelegations.map(delegation => (
                      <tr key={delegation.delegationId}>
                        <td>{delegation.delegateUserNm}</td>
                        <td>{formatDateTime(delegation.startDate)}</td>
                        <td>{formatDateTime(delegation.endDate)}</td>
                        <td className="reason-cell">{delegation.reason || '-'}</td>
                        <td>
                          {delegation.isCurrentlyValid ? (
                            <span className="status-badge active">활성</span>
                          ) : delegation.isActive ? (
                            <span className="status-badge scheduled">예정</span>
                          ) : (
                            <span className="status-badge inactive">비활성</span>
                          )}
                        </td>
                        <td>
                          {delegation.isActive && (
                            <button
                              className="btn-deactivate"
                              onClick={() => handleDeactivate(delegation.delegationId)}
                            >
                              비활성화
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDelegationModal;
