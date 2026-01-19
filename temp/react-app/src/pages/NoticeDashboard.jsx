//NoticeDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NoticeDashboard.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export default function NoticeDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showListModal, setShowListModal] = useState(false);
  const [modalNotices, setModalNotices] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  
  // ✅ 추가: 뷰 모드 및 완료 공지 관련 상태
  const [viewMode, setViewMode] = useState('monthly'); // 'monthly', 'weekly', 'daily'
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [selectedMaintenanceNotice, setSelectedMaintenanceNotice] = useState(null);
  
  // 실제 DB 데이터
  const [stats, setStats] = useState({
    pendingApprovalCount: 0,
    scheduledSendCount: 0,
    failedSendCount: 0,
    completedSendCount: 0
  });
  const [recentNotices, setRecentNotices] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [typeStats, setTypeStats] = useState([]);
  const [deptStats, setDeptStats] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    if (!token) navigate("/login", { replace: true });
    
    loadDashboardData();
  }, [navigate]);

  useEffect(() => {
    loadCalendarData();
  }, [currentDate]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // ✅ 토큰 가져오기
      const token = sessionStorage.getItem('access_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      // 1. 통계 데이터
      const statsRes = await fetch(`${BASE_URL}/api/dashboard/stats`, { headers });
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.data);
      }

      // 2. 최근 공지 목록 (승인된 공지만 - APPROVED, SENT, COMPLETED)
      const noticesRes = await fetch(`${BASE_URL}/api/notices?page=0&size=100`, { headers });
      const noticesData = await noticesRes.json();
      if (noticesData.success) {
        const allNotices = noticesData.data.data || noticesData.data;
        // 승인된 공지만 필터링 (PENDING, REJECTED 제외)
        const approvedNotices = Array.isArray(allNotices) 
          ? allNotices.filter(n => 
              n.noticeStatus === 'APPROVED' || 
              n.noticeStatus === 'SENT' || 
              n.noticeStatus === 'COMPLETED'
            ).slice(0, 10)
          : [];
        setRecentNotices(approvedNotices);
        
        // 3. 공지 유형 통계 (승인된 공지만)
        calculateTypeStats(approvedNotices);
      }

      // 4. 시스템 점검 일정 (APPROVED 상태의 공지)
      const scheduleRes = await fetch(`${BASE_URL}/api/notices?status=APPROVED&page=0&size=5`, { headers });
      const scheduleData = await scheduleRes.json();
      if (scheduleData.success) {
        const scheduleList = scheduleData.data.data || scheduleData.data;
        setSchedules(Array.isArray(scheduleList) ? scheduleList : []);
      }
      
      // 5. 부서별 통계 (전체 부서 기준 - 승인된 공지만)
      await calculateDeptStatsWithAllDepts();

    } catch (error) {
      console.error('대시보드 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCalendarData = async () => {
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      console.log('📅 캘린더 조회 요청:', { year, month });
      
      // ✅ 토큰 가져오기
      const token = sessionStorage.getItem('access_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      // 전체 공지 조회 후 프론트에서 필터링
      const res = await fetch(`${BASE_URL}/api/notices?page=0&size=1000`, { headers });
      const data = await res.json();
      
      if (data.success) {
        const notices = data.data.data || data.data;
        
        // 현재 월의 공지 + 승인된 공지만 필터링
        const filteredNotices = notices.filter(notice => {
          if (!notice.publishStartAt) return false;
          
          // 승인 상태 체크
          const isApproved = notice.noticeStatus === 'APPROVED' || 
                            notice.noticeStatus === 'SENT' || 
                            notice.noticeStatus === 'COMPLETED';
          if (!isApproved) return false;
          
          // 날짜 체크
          const noticeDate = new Date(notice.publishStartAt);
          return noticeDate.getFullYear() === year && 
                 noticeDate.getMonth() + 1 === month;
        });
        
        console.log('📊 필터링된 공지:', filteredNotices.length, '건');
        
        // 날짜별로 이벤트 그룹화
        const eventsByDay = {};
        filteredNotices.forEach(notice => {
          const noticeDate = new Date(notice.publishStartAt);
          const day = noticeDate.getDate();
          
          if (!eventsByDay[day]) {
            eventsByDay[day] = [];
          }
          
          eventsByDay[day].push({
            noticeId: notice.noticeId,
            title: notice.title.length > 20 ? notice.title.substring(0, 20) + '...' : notice.title,
            fullTitle: notice.title,
            dept: notice.senderOrgUnitName || 'ITH팀',
            color: getPriorityColor(notice.noticeLevel),
            isMaintenance: notice.isMaintenance,
            noticeStatus: notice.noticeStatus,
            isCompleted: notice.isCompleted,
            ...notice
          });
        });
        
        setCalendarEvents(Object.entries(eventsByDay).map(([day, events]) => ({
          day: parseInt(day),
          events
        })));
      }
    } catch (error) {
      console.error('캘린더 데이터 로드 실패:', error);
    }
  };

  const calculateTypeStats = (notices) => {
    const typeCounts = {};
    let total = 0;
    
    notices.forEach(notice => {
      const type = notice.isMaintenance ? '시스템 점검 안내' : '일반 공지';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
      total++;
    });

    const stats = Object.entries(typeCounts).map(([type, count], idx) => ({
      type,
      count,
      color: ['#10B981', '#6366F1', '#EF4444', '#F59E0B'][idx % 4],
      percentage: total > 0 ? ((count / total) * 100).toFixed(1) : 0
    }));

    setTypeStats(stats);
  };

  const calculateDeptStats = (notices) => {
    const deptCounts = {};
    
    notices.forEach(notice => {
      const dept = notice.senderOrgUnitName || '미분류';
      deptCounts[dept] = (deptCounts[dept] || 0) + 1;
    });

    const stats = Object.entries(deptCounts)
      .map(([dept, count]) => ({ dept, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 9);

    setDeptStats(stats);
  };

  // ✅ 추가: 전체 부서 기준 통계
  const calculateDeptStatsWithAllDepts = async () => {
    try {
      // ✅ 토큰 가져오기
      const token = sessionStorage.getItem('access_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      // 1. 전체 부서 목록 조회
      const orgsRes = await fetch(`${BASE_URL}/api/organizations`, { headers });
      const orgsData = await orgsRes.json();
      
      if (!orgsData.success) {
        console.error('부서 목록 조회 실패');
        return;
      }
      
      const allOrgs = orgsData.data || [];
      
      // 2. 전체 공지 조회 (승인된 공지만)
      const noticesRes = await fetch(`${BASE_URL}/api/notices?page=0&size=1000`, { headers });
      const noticesData = await noticesRes.json();
      
      if (!noticesData.success) {
        console.error('공지 목록 조회 실패');
        return;
      }
      
      const allNotices = noticesData.data.data || noticesData.data || [];
      
      // 승인된 공지만 필터링
      const approvedNotices = allNotices.filter(n => 
        n.noticeStatus === 'APPROVED' || 
        n.noticeStatus === 'SENT' || 
        n.noticeStatus === 'COMPLETED'
      );
      
      // 3. 각 부서별 공지 수신 카운트
      const deptCounts = {};
      
      // 모든 부서를 0으로 초기화
      allOrgs.forEach(org => {
        deptCounts[org.orgUnitName] = 0;
      });
      
      // 공지의 targets를 분석하여 부서별 카운트
      approvedNotices.forEach(notice => {
        if (notice.targets && Array.isArray(notice.targets)) {
          notice.targets.forEach(target => {
            // ORG_UNIT 타입인 경우에만 카운트
            if (target.targetType === 'ORG_UNIT' && target.targetName) {
              if (deptCounts.hasOwnProperty(target.targetName)) {
                deptCounts[target.targetName]++;
              }
            }
          });
        }
      });
      
      // 4. 상위 14개 부서만 표시 (데이터에 부서가 14개)
      const stats = Object.entries(deptCounts)
        .map(([dept, count]) => ({ dept, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 14);
      
      setDeptStats(stats);
      
      console.log('📊 부서별 통계 (승인된 공지만):', stats);
      
    } catch (error) {
      console.error('부서별 통계 계산 실패:', error);
    }
  };

  const getPriorityColor = (level) => {
    const colors = {
      'L3': '#EF4444', // 긴급 - 빨강
      'L2': '#F59E0B', // 중간 - 주황
      'L1': '#06B6D4'  // 낮음 - 파랑
    };
    return colors[level] || '#10B981';
  };

  const getNoticeIcon = (level) => {
    return level === 'L3' ? '🚨' : '📧';
  };

  const getNoticeIconBg = (level) => {
    const colors = {
      'L3': '#fee2e2',
      'L2': '#fef3c7',
      'L1': '#dbeafe'
    };
    return colors[level] || '#d1fae5';
  };

  const getNoticeBorderColor = (level) => {
    const colors = {
      'L3': '#fca5a5',
      'L2': '#fcd34d',
      'L1': '#93c5fd'
    };
    return colors[level] || '#6ee7b7';
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': '#f59e0b',
      'APPROVED': '#06b6d4',
      'SENT': '#10b981',
      'FAILED': '#ef4444',
      'REJECTED': '#ef4444'
    };
    return colors[status] || '#f59e0b';
  };

  const getStatusText = (status) => {
    const texts = {
      'PENDING': '승인대기',
      'APPROVED': '발송예정',
      'SENT': '발송완료',
      'FAILED': '발송실패',
      'REJECTED': '반려됨'
    };
    return texts[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  const changeMonth = (delta) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  const changeWeek = (delta) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (delta * 7));
    setCurrentDate(newDate);
  };

  const changeDay = (delta) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + delta);
    setCurrentDate(newDate);
  };

  const getMonthDisplay = () => {
    const year = currentDate.getFullYear().toString().slice(-2);
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    return `${year}.${month}`;
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month, 1).getDay();
  };

  // 통계카드 클릭 핸들러
  const handleStatClick = (status) => {
    const statusNotices = recentNotices.filter(n => n.noticeStatus === status);
    setModalNotices(statusNotices);
    setModalTitle(`${getStatusText(status)} 목록`);
    setShowListModal(true);
  };

  // ✅ 수정: 이벤트 클릭 핸들러 - 시스템 점검이면 완료 공지 등록 옵션 제공
  const handleEventClick = async (event) => {
    const response = await fetch(`${BASE_URL}/api/notices/${event.noticeId}`);
    const result = await response.json();
    if (result.success) {
      setSelectedNotice(result.data);
      
      // 시스템 점검 공지이고 발송완료 상태이고 완료공지가 아직 없으면
      if (result.data.isMaintenance && 
          result.data.noticeStatus === 'SENT' && 
          !result.data.isCompleted) {
        setSelectedMaintenanceNotice(result.data);
        setShowCompletionModal(true);
      } else {
        setShowDetailModal(true);
      }
    }
  };

  // ✅ 추가: 완료 공지 등록 핸들러
  const handleRegisterCompletion = () => {
    navigate('/notices/new', { 
      state: { 
        isCompletion: true,
        originalNotice: selectedMaintenanceNotice 
      } 
    });
    setShowCompletionModal(false);
  };

  // 상세 모달
  const openDetailModal = async (noticeId) => {
    const response = await fetch(`${BASE_URL}/api/notices/${noticeId}`);
    const result = await response.json();
    if (result.success) {
      setSelectedNotice(result.data);
      setShowDetailModal(true);
    }
  };

  // ✅ 추가: 주간 뷰 렌더링
  const renderWeeklyView = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);
    
    return (
      <div className="weekly-view">
        <div className="week-grid">
          {[...Array(7)].map((_, idx) => {
            const date = new Date(startOfWeek);
            date.setDate(date.getDate() + idx);
            const dayNum = date.getDate();
            const eventDay = calendarEvents.find(e => e.day === dayNum);
            
            return (
              <div key={idx} className="week-day-column">
                <div className="week-day-header">
                  <div className={`week-day-name ${idx === 0 ? 'sunday' : idx === 6 ? 'saturday' : ''}`}>
                    {['일', '월', '화', '수', '목', '금', '토'][idx]}
                  </div>
                  <div className="week-day-number">{dayNum}</div>
                </div>
                <div className="week-events-container">
                  {eventDay && eventDay.events.map((event, eventIdx) => (
                    <div 
                      key={eventIdx}
                      className="week-event-item" 
                      style={{ borderLeftColor: event.color }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event);
                      }}
                    >
                      <div className="week-event-title">{event.fullTitle}</div>
                      <div className="week-event-dept">{event.dept}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ✅ 추가: 일간 뷰 렌더링
  const renderDailyView = () => {
    const dayNum = currentDate.getDate();
    const eventDay = calendarEvents.find(e => e.day === dayNum);
    
    return (
      <div className="daily-view">
        <div className="daily-header">
          <h3>{currentDate.toLocaleDateString('ko-KR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
          })}</h3>
        </div>
        <div className="daily-events-list">
          {eventDay && eventDay.events.length > 0 ? (
            eventDay.events.map((event, idx) => (
              <div 
                key={idx}
                className="daily-event-card"
                onClick={() => handleEventClick(event)}
              >
                <div className="daily-event-header">
                  <div 
                    className="daily-event-indicator" 
                    style={{ background: event.color }}
                  ></div>
                  <div className="daily-event-info">
                    <h4>{event.fullTitle}</h4>
                    <span className="daily-event-dept">{event.dept}</span>
                  </div>
                  <span 
                    className="daily-event-status"
                    style={{ color: getStatusColor(event.noticeStatus) }}
                  >
                    {getStatusText(event.noticeStatus)}
                  </span>
                </div>
                {event.isMaintenance && (
                  <div className="daily-event-maintenance-badge">
                    🔧 시스템 점검
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="empty-message">이 날짜에 등록된 공지가 없습니다</div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <main className="dashboard-main-full">
        <h1 className="page-title">공지 발송 Dashboard</h1>

        {/* 상태 카드 */}
        <div className="stats-grid">
          <div 
            className="stat-card" 
            onClick={() => handleStatClick('PENDING')}
            style={{ cursor: 'pointer' }}
          >
            <div className="stat-label">결재 대기</div>
            <div className="stat-value">{stats.pendingApprovalCount}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">발송 예정</div>
            <div className="stat-value">
              {stats.scheduledSendCount}
              <span className="stat-unit">건</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">발송 실패</div>
            <div className="stat-value">
              {stats.failedSendCount}
              <span className="stat-unit">건</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">발송 완료</div>
            <div className="stat-value">
              {stats.completedSendCount}
              <span className="stat-unit">건</span>
            </div>
          </div>
        </div>

        {/* ✅ 수정: 캘린더 - 뷰 모드 선택 추가 */}
        <div className="calendar-card">
          <div className="calendar-header">
            <div className="calendar-nav">
              <button 
                className="nav-btn" 
                onClick={() => {
                  if (viewMode === 'monthly') changeMonth(-1);
                  else if (viewMode === 'weekly') changeWeek(-1);
                  else changeDay(-1);
                }}
              >‹</button>
              <span className="current-date">
                {viewMode === 'monthly' && getMonthDisplay()}
                {viewMode === 'weekly' && `${getMonthDisplay()} 주간`}
                {viewMode === 'daily' && formatDate(currentDate.toISOString())}
              </span>
              <button 
                className="nav-btn" 
                onClick={() => {
                  if (viewMode === 'monthly') changeMonth(1);
                  else if (viewMode === 'weekly') changeWeek(1);
                  else changeDay(1);
                }}
              >›</button>
            </div>
            <div className="view-mode-selector">
              <button 
                className={`view-mode-btn ${viewMode === 'monthly' ? 'active' : ''}`}
                onClick={() => setViewMode('monthly')}
              >
                월간
              </button>
              <button 
                className={`view-mode-btn ${viewMode === 'weekly' ? 'active' : ''}`}
                onClick={() => setViewMode('weekly')}
              >
                주간
              </button>
              <button 
                className={`view-mode-btn ${viewMode === 'daily' ? 'active' : ''}`}
                onClick={() => setViewMode('daily')}
              >
                일간
              </button>
            </div>
          </div>

          {/* ✅ 뷰 모드에 따라 다른 캘린더 렌더링 */}
          {viewMode === 'monthly' && (
            <div className="calendar-grid">
              {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
                <div key={idx} className={`day-header ${idx === 0 ? 'sunday' : idx === 6 ? 'saturday' : ''}`}>
                  {day}
                </div>
              ))}
              
              {[...Array(getFirstDayOfMonth())].map((_, idx) => (
                <div key={`empty-${idx}`} className="empty-cell"></div>
              ))}
              
              {[...Array(getDaysInMonth())].map((_, idx) => {
                const dayNum = idx + 1;
                const eventDay = calendarEvents.find(e => e.day === dayNum);
                
                return (
                  <div key={idx} className="calendar-day">
                    <div className="day-number">{dayNum}</div>
                    {eventDay && eventDay.events.slice(0, 2).map((event, eventIdx) => (
                      <div 
                        key={eventIdx}
                        className="event-badge" 
                        style={{ background: event.color }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event);
                        }}
                      >
                        <div className="event-title">{event.title}</div>
                        <div className="event-dept">{event.dept}</div>
                      </div>
                    ))}
                    {eventDay && eventDay.events.length > 2 && (
                      <div className="event-more">+{eventDay.events.length - 2}</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {viewMode === 'weekly' && renderWeeklyView()}
          {viewMode === 'daily' && renderDailyView()}

          <div className="calendar-legend">
            {[
              { label: '긴급', color: '#EF4444' },
              { label: '중간', color: '#F59E0B' },
              { label: '낮음', color: '#06B6D4' },
              { label: '완료', color: '#10B981' }
            ].map((item, idx) => (
              <div key={idx} className="legend-item">
                <div className="legend-color" style={{ background: item.color }}></div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 2컬럼 */}
        <div className="two-column-grid">
          {/* 시스템 점검 일정 */}
          <div className="content-card">
            <h3 className="card-title">시스템 점검 일정</h3>
            <div className="schedule-list">
              {schedules.length === 0 ? (
                <div className="empty-message">예정된 점검이 없습니다</div>
              ) : (
                schedules.map((schedule, idx) => (
                  <div key={idx} className="schedule-item">
                    <div className="schedule-icon" style={{ 
                      background: getNoticeIconBg(schedule.noticeLevel) 
                    }}>
                      {getNoticeIcon(schedule.noticeLevel)}
                    </div>
                    <div className="schedule-content">
                      <div className="schedule-header">
                        <div className="schedule-title">{schedule.title}</div>
                        <span className="schedule-status" style={{ 
                          color: getStatusColor(schedule.noticeStatus) 
                        }}>
                          {getStatusText(schedule.noticeStatus)}
                        </span>
                      </div>
                      <div className="schedule-date">{formatDate(schedule.createdAt)}</div>
                      <div className="schedule-details">
                        <div className="schedule-type">
                          <span>{schedule.isMaintenance ? '시스템 점검' : '일반 공지'}</span>
                          <span className="schedule-dept">{schedule.senderOrgUnitName}</span>
                        </div>
                        <div className="schedule-time">
                          시작일시: {formatDateTime(schedule.publishStartAt)} 
                          {schedule.publishEndAt && ` | 종료일시: ${formatDateTime(schedule.publishEndAt)}`}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 공지 유형 통계 */}
          <div className="content-card">
            <h3 className="card-title">공지 유형 통계</h3>
            
            <div className="chart-container">
              <svg viewBox="0 0 200 200" className="donut-chart">
                {typeStats.map((stat, idx) => {
                  const total = typeStats.reduce((sum, s) => sum + s.count, 0);
                  const startAngle = typeStats.slice(0, idx).reduce((sum, s) => 
                    sum + (s.count / total) * 440, 0);
                  const strokeDasharray = `${(stat.count / total) * 440} 440`;
                  const strokeDashoffset = -startAngle;
                  
                  return (
                    <circle 
                      key={idx}
                      cx="100" 
                      cy="100" 
                      r="70" 
                      fill="none" 
                      stroke={stat.color} 
                      strokeWidth="35" 
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                    />
                  );
                })}
              </svg>
              <div className="chart-center">
                <div className="chart-total">
                  {typeStats.reduce((sum, s) => sum + s.count, 0)}건
                </div>
                <div className="chart-label">전체</div>
              </div>
            </div>

            <div className="stats-list">
              {typeStats.map((stat, idx) => (
                <div key={idx} className="stats-item">
                  <div className="stats-info">
                    <div className="stats-dot" style={{ background: stat.color }}></div>
                    <span className="stats-type">{stat.type}</span>
                  </div>
                  <div className="stats-count-wrapper">
                    <span className="stats-count">{stat.count} 건</span>
                    <span className="stats-percentage">({stat.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 최근 공지 목록 */}
        <div className="content-card">
          <h3 className="card-title">최근 공지 목록</h3>
          <div className="notices-list">
            {recentNotices.length === 0 ? (
              <div className="empty-message">최근 공지가 없습니다</div>
            ) : (
              recentNotices.map((notice, idx) => (
                <div 
                  key={idx} 
                  className="notice-item" 
                  style={{
                    background: getNoticeIconBg(notice.noticeLevel),
                    borderColor: getNoticeBorderColor(notice.noticeLevel)
                  }}
                  onClick={() => openDetailModal(notice.noticeId)}
                >
                  <div className="notice-icon">{getNoticeIcon(notice.noticeLevel)}</div>
                  <div className="notice-content">
                    <div className="notice-grid">
                      <div className="notice-title">{notice.title}</div>
                      <div className="notice-dept">{notice.senderOrgUnitName}</div>
                      <div className="notice-sender">{notice.createdBy}</div>
                      <div className="notice-type">
                        {notice.isMaintenance ? '시스템 점검 안내' : '일반 공지'}
                      </div>
                      <div className="notice-receivers">
                        {notice.affectedService?.serviceName || '전체'}
                      </div>
                    </div>
                    <div className="notice-date">{formatDate(notice.createdAt)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 부서 별 공지 수신 현황 */}
        <div className="content-card">
          <h3 className="card-title">부서 별 공지 수신 현황</h3>
          <div className="bar-chart">
            {deptStats.length === 0 ? (
              <div className="empty-message">통계 데이터가 없습니다</div>
            ) : (
              deptStats.map((dept, idx) => {
                const maxCount = Math.max(...deptStats.map(d => d.count), 1);
                return (
                  <div key={idx} className="bar-item">
                    <div 
                      className="bar-column" 
                      style={{ height: `${(dept.count / maxCount) * 100}%` }}
                    >
                      <span className="bar-value">{dept.count}</span>
                    </div>
                    <div className="bar-label">{dept.dept}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ✅ 추가: 완료 공지 등록 모달 */}
        {showCompletionModal && selectedMaintenanceNotice && (
          <div className="modal-overlay" onClick={() => setShowCompletionModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>🔧 시스템 점검 완료 공지</h3>
                <button onClick={() => setShowCompletionModal(false)}>×</button>
              </div>
              
              <div className="modal-body">
                <p style={{ marginBottom: '16px', color: '#64748b' }}>
                  "{selectedMaintenanceNotice.title}" 점검에 대한 완료 공지를 등록하시겠습니까?
                </p>
                
                <div className="detail-section">
                  <h4>원본 점검 공지 정보</h4>
                  <div className="detail-item">
                    <span className="detail-label">제목</span>
                    <span className="detail-value">{selectedMaintenanceNotice.title}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">시작일시</span>
                    <span className="detail-value">
                      {formatDateTime(selectedMaintenanceNotice.publishStartAt)}
                    </span>
                  </div>
                  {selectedMaintenanceNotice.publishEndAt && (
                    <div className="detail-item">
                      <span className="detail-label">종료일시</span>
                      <span className="detail-value">
                        {formatDateTime(selectedMaintenanceNotice.publishEndAt)}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="completion-modal-actions">
                  <button 
                    className="completion-btn completion-btn-primary"
                    onClick={handleRegisterCompletion}
                  >
                    완료 공지 등록하기
                  </button>
                  <button 
                    className="completion-btn completion-btn-secondary"
                    onClick={() => {
                      setShowCompletionModal(false);
                      setShowDetailModal(true);
                    }}
                  >
                    상세 정보만 보기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 상세 모달 */}
        {showDetailModal && selectedNotice && (
          <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>공지 상세 정보</h3>
                <button onClick={() => setShowDetailModal(false)}>×</button>
              </div>
              
              <div className="modal-body">
                <div className="detail-section">
                  <h4>기본 정보</h4>
                  <div className="detail-item">
                    <span className="detail-label">제목</span>
                    <span className="detail-value">{selectedNotice.title}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">중요도</span>
                    <span className="detail-value">{selectedNotice.noticeLevel}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">상태</span>
                    <span className="detail-value" style={{ color: getStatusColor(selectedNotice.noticeStatus) }}>
                      {getStatusText(selectedNotice.noticeStatus)}
                    </span>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>공지 내용</h4>
                  <div dangerouslySetInnerHTML={{ __html: selectedNotice.content }} />
                </div>
                
                {selectedNotice.targets && selectedNotice.targets.length > 0 && (
                  <div className="detail-section">
                    <h4>수신 대상</h4>
                    {selectedNotice.targets.map((target, idx) => (
                      <div key={idx} className="target-item">
                        <span>{target.targetType === 'CORP' ? '법인' : '부서'}</span>
                        <span>{target.targetName}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="modal-footer">
                <button onClick={() => setShowDetailModal(false)}>닫기</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}