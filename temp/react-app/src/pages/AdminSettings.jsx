// src/pages/AdminSettings.jsx
import React, { useState, useEffect } from 'react';
import { adminDelegationApi, adminUsersApi } from '../api';
import './AdminSettings.css';

/**
 * 관리자 설정 페이지
 * - 권한 위임 관리
 * - 시스템 설정 (추후 확장)
 */
const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('delegation');
  const [loading, setLoading] = useState(false);
  
  // 권한 위임 관련 상태
  const [myDelegations, setMyDelegations] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [formData, setFormData] = useState({
    delegateUserId: '',
    delegateUserNm: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  useEffect(() => {
    if (activeTab === 'delegation') {
      loadDelegationData();
    }
  }, [activeTab]);

  const loadDelegationData = async () => {
    try {
      setLoading(true);
      
      // 관리자 목록 로드
      const admins = await adminUsersApi.getAdminUsers();
      setAdminUsers(admins.data || []);
      
      // 내 위임 목록 로드
      const delegations = await adminDelegationApi.getMyDelegations();
      setMyDelegations(delegations.data || []);
      
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.delegateUserId || !formData.startDate || !formData.endDate) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      alert('종료일은 시작일보다 이후여야 합니다.');
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        ...formData,
        startDate: formData.startDate.length === 16 ? `${formData.startDate}:00` : formData.startDate,
        endDate: formData.endDate.length === 16 ? `${formData.endDate}:00` : formData.endDate,
      };

      await adminDelegationApi.createDelegation(requestData);
      alert('권한 위임이 생성되었습니다.');
      
      // 폼 초기화 및 목록 새로고침
      setFormData({
        delegateUserId: '',
        delegateUserNm: '',
        startDate: '',
        endDate: '',
        reason: '',
      });
      loadDelegationData();
      
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
      loadDelegationData();
    } catch (error) {
      console.error('비활성화 실패:', error);
      alert('비활성화 중 오류가 발생했습니다.');
    }
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '-';
    return new Date(dateTimeStr).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="admin-settings-page">
      <div className="admin-settings-container">
        <div className="page-header">
          <h1 className="page-title">⚙️ 관리자 설정</h1>
          <p className="page-description">시스템 관리 및 권한 설정</p>
        </div>

        {/* 탭 메뉴 */}
        <div className="tab-menu">
          <button
            className={`tab-button ${activeTab === 'delegation' ? 'active' : ''}`}
            onClick={() => setActiveTab('delegation')}
          >
            👥 권한 위임 관리
          </button>
          <button
            className={`tab-button ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            📅 발송 시간 설정
          </button>
          <button
            className={`tab-button ${activeTab === 'system' ? 'active' : ''}`}
            onClick={() => setActiveTab('system')}
          >
             시스템 설정
          </button>
        </div>

        {/* 권한 위임 탭 */}
        {activeTab === 'delegation' && (
          <div className="tab-content">
            <div className="settings-section">
              <h3>권한 위임 생성</h3>
              <form className="delegation-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-field">
                    <label>대리자 선택 *</label>
                    <select
                      value={formData.delegateUserId}
                      onChange={handleDelegateChange}
                      required
                    >
                      <option value="">선택하세요</option>
                      {adminUsers.map(user => (
                        <option key={user.userId} value={user.userId}>
                          {user.userKoNm} ({user.userId})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label>시작일시 *</label>
                    <input
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label>종료일시 *</label>
                    <input
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field full-width">
                    <label>사유</label>
                    <textarea
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      placeholder="권한 위임 사유를 입력하세요"
                      rows={3}
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? '생성 중...' : '권한 위임 생성'}
                </button>
              </form>
            </div>

            <div className="settings-section">
              <h3>내 권한 위임 목록</h3>
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
        )}

        {/* 발송 시간 설정 탭 */}
        {activeTab === 'schedule' && (
          <div className="tab-content">
            <div className="settings-section">
              <h3>정기 발송 시간대 설정</h3>
              <div className="schedule-info">
                <div className="schedule-item">
                  <div className="schedule-icon">🌅</div>
                  <div className="schedule-details">
                    <h4>오전 정기발송</h4>
                    <p className="schedule-time">09:00 (KST)</p>
                    <p className="schedule-desc">오전 업무 시작 시간에 발송됩니다</p>
                  </div>
                </div>

                <div className="schedule-item">
                  <div className="schedule-icon">☀️</div>
                  <div className="schedule-details">
                    <h4>오후 정기발송 1</h4>
                    <p className="schedule-time">13:00 (KST)</p>
                    <p className="schedule-desc">점심 이후 업무 시작 시간에 발송됩니다</p>
                  </div>
                </div>

                <div className="schedule-item">
                  <div className="schedule-icon">🌆</div>
                  <div className="schedule-details">
                    <h4>오후 정기발송 2</h4>
                    <p className="schedule-time">17:00 (KST)</p>
                    <p className="schedule-desc">업무 종료 전 발송됩니다</p>
                  </div>
                </div>
              </div>

              <div className="info-box">
                <p>💡 <strong>정기 발송 안내</strong></p>
                <ul>
                  <li>같은 시간대에 발송 예정인 공지들은 자동으로 묶음 발송됩니다</li>
                  <li>묶음 발송으로 수신자의 메일함이 깔끔하게 유지됩니다</li>
                  <li>발송 시간대는 시스템 설정으로만 변경 가능합니다</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 시스템 설정 탭 */}
        {activeTab === 'system' && (
          <div className="tab-content">
            <div className="settings-section">
              <h3>시스템 설정</h3>
              <p className="coming-soon">🚧 준비 중입니다</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;