//NoticeDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NoticeDashboard.css";
import { dashboardApi, noticeApi, organizationApi } from '../api';

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

export default function NoticeDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [currentUserId, setCurrentUserId] = useState('');
  const [showListModal, setShowListModal] = useState(false);
  const [modalNotices, setModalNotices] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  
  const [viewMode, setViewMode] = useState('monthly');
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [selectedMaintenanceNotice, setSelectedMaintenanceNotice] = useState(null);
  const [showDayListModal, setShowDayListModal] = useState(false);
  const [dayListEvents, setDayListEvents] = useState([]);
  const [dayListTitle, setDayListTitle] = useState('');
  const [returnToDayList, setReturnToDayList] = useState(false);
  
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
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId) {
      setCurrentUserId(storedUserId);
    }
    
    loadDashboardData();
  }, [navigate]);

  useEffect(() => {
    loadCalendarData();
  }, [currentDate]);

  //  모달 스크롤 제어 - 컴포넌트 안에 있어야 함!
  useEffect(() => {
    if (showDetailModal || showCompletionModal || showDayListModal) {
      openModal();
    } else {
      closeModal();
    }
    return () => closeModal();
  }, [showDetailModal, showCompletionModal, showDayListModal]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const statsData = await dashboardApi.getStats();
      if (statsData?.success && statsData.data && typeof statsData.data === 'object') {
        setStats(statsData.data);
      } else {
        setStats({
          pendingApprovalCount: 0,
          scheduledSendCount: 0,
          failedSendCount: 0,
          completedSendCount: 0
        });
      }

        const noticesData = await noticeApi.getList({ page: 0, size: 100 });
        if (noticesData.success) {
          const allNotices = noticesData.data.data || noticesData.data;
          const approvedNotices = Array.isArray(allNotices) 
            ? allNotices.filter(n => 
              n.noticeStatus === 'APPROVED' || 
              n.noticeStatus === 'SENT' ||
              n.noticeStatus === 'FAILED'
            ).slice(0, 10)
          : [];
        setRecentNotices(approvedNotices);
        calculateTypeStats(approvedNotices);
      }

      const scheduleData = await noticeApi.getList({ status: 'APPROVED', page: 0, size: 5 });
      if (scheduleData.success) {
        const scheduleList = scheduleData.data.data || scheduleData.data;
        setSchedules(Array.isArray(scheduleList) ? scheduleList : []);
      }
      
      await calculateDeptStatsWithAllDepts();

    } catch (error) {
      console.error('대시보드 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCalendarData = async () => {
    try {
      const data = await noticeApi.getList({ page: 0, size: 1000 });
      
      if (data.success) {
        const notices = data.data.data || data.data;
        const eventsByDate = {};
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const allowedStatuses = new Set(['APPROVED', 'SENT', 'FAILED']);

        (Array.isArray(notices) ? notices : [])
          .filter((notice) => allowedStatuses.has(notice.noticeStatus))
          .forEach((notice) => {
          const baseDate = notice.publishStartAt || notice.createdAt;
          if (!baseDate) return;
          const date = new Date(baseDate);
          if (date.getFullYear() != currentYear || date.getMonth() != currentMonth) {
            return;
          }

          const day = date.getDate();
          const dateKey = formatDateKey(date);
          if (!eventsByDate[dateKey]) {
            eventsByDate[dateKey] = { day, dateKey, events: [] };
          }

          eventsByDate[dateKey].events.push({
            noticeId: notice.noticeId,
            title: notice.title,
            dept: notice.senderOrgUnitName || '-',
            senderDept: notice.senderOrgUnitName || '-',
            senderUser: notice.createdBy || '-',
            noticeType: notice.noticeType || '-',
            level: notice.noticeLevel,
            color: getPriorityColor(notice.noticeLevel),
            dateKey
          });
        });

        setCalendarEvents(Object.values(eventsByDate).sort((a, b) => a.day - b.day));
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

  const calculateDeptStatsWithAllDepts = async () => {
    try {
      const orgsData = await organizationApi.getAll();
      
      if (!orgsData.success) {
        console.error('조직 목록 조회 실패');
        return;
      }
      
      const allOrgs = orgsData.data || [];
      const noticesData = await noticeApi.getList({ page: 0, size: 1000 });
      
      if (!noticesData.success) {
        console.error('?? ?? ?? ??');
        return;
      }
      
      const allNotices = noticesData.data.data || noticesData.data || [];
      const approvedNotices = allNotices.filter(n => 
        n.noticeStatus === 'APPROVED' || 
        n.noticeStatus === 'SENT' ||
        n.noticeStatus === 'FAILED'
      );
      
      const deptCounts = {};
      const orgIdToName = {};
      const orgKeyToId = new Map();
      allOrgs.forEach(org => {
        const orgId = org.orgUnitId;
        deptCounts[orgId] = 0;
        orgIdToName[orgId] = org.orgUnitName;
        if (orgId !== null && orgId !== undefined) {
          orgKeyToId.set(String(orgId), orgId);
        }
        if (org.orgUnitCode) {
          orgKeyToId.set(String(org.orgUnitCode), orgId);
        }
        if (org.orgUnitName) {
          orgKeyToId.set(String(org.orgUnitName), orgId);
        }
      });
      
      approvedNotices.forEach(notice => {
        if (notice.targets && Array.isArray(notice.targets)) {
          notice.targets.forEach(target => {
            if (target.targetType === 'ORG_UNIT') {
              const candidates = [target.targetKey, target.targetName]
                .filter((value) => value !== null && value !== undefined)
                .map((value) => String(value).trim())
                .filter((value) => value.length > 0);
              for (const key of candidates) {
                const orgUnitId = orgKeyToId.get(key);
                if (orgUnitId !== undefined && Object.prototype.hasOwnProperty.call(deptCounts, orgUnitId)) {
                  deptCounts[orgUnitId]++;
                  break;
                }
              }
            }
          });
        }
      });
      
      const stats = Object.entries(deptCounts)
        .map(([orgUnitId, count]) => ({
          dept: orgIdToName[orgUnitId] || '-',
          count
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 14);
      
      setDeptStats(stats);
    } catch (error) {
      console.error('부서 통계 로드 실패:', error);
    }
  };

  const getPriorityColor = (level) => {
    const colors = {
      'L3': '#EF4444',
      'L2': '#F59E0B',
      'L1': '#06B6D4'
    };
    return colors[level] || '#10B981';
  };

  const getNoticeIcon = (level) => {
    return level === 'L3' ? '🚨' : '';
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
    const inferredCorp = corps || (
      depts && depts.includes('/')
        ? depts.split('/')[0].trim()
        : ''
    );
    return {
      corps: inferredCorp || '-',
      depts: depts || '-'
    };
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

  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

  const handleStatClick = (status) => {
    const statusNotices = recentNotices.filter(n => n.noticeStatus === status);
    setModalNotices(statusNotices);
    setModalTitle(`${getStatusText(status)} 목록`);
    setShowListModal(true);
  };

  const handleEventClick = async (event) => {
    try {
      const result = await noticeApi.getById(event.noticeId);
      
      if (result.success) {
        setSelectedNotice(result.data);
        
        if (result.data.isMaintenance && 
            result.data.noticeStatus === 'SENT' && 
            !result.data.isCompleted) {
          setSelectedMaintenanceNotice(result.data);
          setShowCompletionModal(true);
        } else {
          setShowDetailModal(true);
        }
      }
    } catch (error) {
      console.error('공지 상세 조회 실패:', error);
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

  const openDayListModal = (date, events) => {
    if (!events || events.length === 0) return;
    setReturnToDayList(false);
    setDayListEvents(events);
    setDayListTitle(formatDate(date.toISOString()));
    setShowDayListModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    if (returnToDayList) {
      setReturnToDayList(false);
      setShowDayListModal(true);
    }
  };

  const getEventsForDate = (date) => {
    const dateKey = formatDateKey(date);
    const dayEntry = calendarEvents.find((entry) => entry.dateKey === dateKey);
    return dayEntry ? dayEntry.events : [];
  };

  const renderWeeklyView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const weekDates = [...Array(7)].map((_, idx) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + idx);
      return date;
    });

    return (
      <div className="weekly-view">
        <div className="week-grid">
          {weekDates.map((date, idx) => {
            const events = getEventsForDate(date);
            const isSunday = idx == 0;
            const isSaturday = idx == 6;

            return (
              <div key={formatDateKey(date)} className="week-day-column">
                <div className="week-day-header">
                  <div className={`week-day-name ${isSunday ? 'sunday' : isSaturday ? 'saturday' : ''}`}>
                    {['일', '월', '화', '수', '목', '금', '토'][idx]}
                  </div>
                  <div className="week-day-number">{date.getDate()}</div>
                </div>
                <div className="week-events-container">
                  {events.length === 0 ? (
                    <div className="empty-message">일정 없음</div>
                  ) : (
                    events.map((event, eventIdx) => (
                      <div
                        key={`${event.noticeId}-${eventIdx}`}
                        className="week-event-item"
                        style={{ borderLeftColor: event.color }}
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="week-event-title">{event.title}</div>
                        <div className="week-event-dept">{event.dept}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDailyView = () => {
    const events = getEventsForDate(currentDate);

    return (
      <div className="daily-view">
        <div className="daily-header">
          <h3>{formatDate(currentDate.toISOString())}</h3>
        </div>
        <div className="daily-events-list">
          {events.length === 0 ? (
            <div className="empty-message">일정 없음</div>
          ) : (
            events.map((event, idx) => (
              <div
                key={`${event.noticeId}-${idx}`}
                className="daily-event-card"
                onClick={() => handleEventClick(event)}
              >
                <div className="daily-event-header">
                  <div className="daily-event-indicator" style={{ background: event.color }}></div>
                  <div className="daily-event-info">
                    <h4>{event.title}</h4>
                    <div className="daily-event-dept">{event.dept}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const handleRegisterCompletion = () => {
    navigate('/notices/new', { 
      state: { 
        isCompletion: true,
        originalNotice: selectedMaintenanceNotice 
      } 
    });
    setShowCompletionModal(false);
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

  const openDetailModal = async (noticeId) => {
    try {
      const result = await noticeApi.getById(noticeId);
      
      if (result.success) {
        setSelectedNotice(result.data);
        setShowDetailModal(true);
      }
    } catch (error) {
      console.error('공지 상세 조회 실패:', error);
    }
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

        {/*  수정: 캘린더 - 뷰 모드 선택 추가 */}
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

          {/*  뷰 모드에 따라 다른 캘린더 렌더링 */}
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
                const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNum);
                
                return (
                  <div
                    key={idx}
                    className="calendar-day"
                    onClick={() => openDayListModal(dayDate, eventDay ? eventDay.events : [])}
                  >
                    <div className="day-number">{dayNum}</div>
                    {eventDay && eventDay.events.slice(0, 2).map((event, eventIdx) => (
                      <div 
                        key={eventIdx}
                        className="event-badge" 
                        style={{ background: event.color }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (showDayListModal) {
                            setReturnToDayList(true);
                            setShowDayListModal(false);
                          } else {
                            setReturnToDayList(false);
                          }
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
                schedules.map((schedule, idx) => {
                  const scheduleIcon = getNoticeIcon(schedule.noticeLevel);
                  return (
                  <div
                    key={idx}
                    className="schedule-item clickable"
                    onClick={() => handleEventClick(schedule)}
                  >
                    {scheduleIcon && (
                      <div
                        className="schedule-icon"
                        style={{ background: getNoticeIconBg(schedule.noticeLevel) }}
                      >
                        {scheduleIcon}
                      </div>
                    )}
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
                )})
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
              recentNotices.map((notice, idx) => {
                const noticeIcon = getNoticeIcon(notice.noticeLevel);
                return (
                <div 
                  key={idx} 
                  className="notice-item" 
                  style={{
                    background: getNoticeIconBg(notice.noticeLevel),
                    borderColor: getNoticeBorderColor(notice.noticeLevel)
                  }}
                  onClick={() => openDetailModal(notice.noticeId)}
                >
                  {noticeIcon && <div className="notice-icon">{noticeIcon}</div>}
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
              )})
            )}
          </div>
          <div className="recent-actions">
            <button
              className="btn-more"
              onClick={() => navigate('/notices/history', { state: { status: 'APPROVED' } })}
            >
              더보기
            </button>
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
                const heightPercent = (dept.count / maxCount) * 100;
                const minHeightPx = dept.count > 0 ? 18 : 0;
                return (
                  <div key={idx} className="bar-item">
                    <div 
                      className="bar-column" 
                      style={{ height: `${heightPercent}%`, minHeight: `${minHeightPx}px` }}
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

        {/*  추가: 완료 공지 등록 모달 */}
        {showCompletionModal && selectedMaintenanceNotice && (
          <div className="modal-overlay" onClick={() => setShowCompletionModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3> 시스템 점검 완료 공지</h3>
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
            <div
              className="modal-content dashboard-detail-modal"
              style={{ maxWidth: '900px', width: '92vw' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>공지 상세 정보</h3>
                <button onClick={closeDetailModal}>×</button>
              </div>
              
              <div className="modal-body">
                <div className="detail-section">
                  <h4>발송 상태</h4>
                  <div className="status-info-row">
                    <span className="status-badge-large" style={{ borderColor: getStatusColor(selectedNotice.noticeStatus), color: getStatusColor(selectedNotice.noticeStatus) }}>
                      {getStatusText(selectedNotice.noticeStatus)}
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
                    <span className="detail-value">{getReceiverInfo(selectedNotice.targets).corps}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">공지유형</span>
                    <span className="detail-value">{selectedNotice.noticeType || '-'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">수신부서</span>
                    <span className="detail-value">{getReceiverInfo(selectedNotice.targets).depts}</span>
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
                    <div className="detail-value content-box" dangerouslySetInnerHTML={{ __html: selectedNotice.content }} />
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
              </div>
              
              <div className="modal-footer">
                <button onClick={closeDetailModal}>닫기</button>
              </div>
            </div>
          </div>
        )}

        {showDayListModal && (
          <div className="modal-overlay" onClick={() => setShowDayListModal(false)}>
            <div className="modal-content calendar-day-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{dayListTitle} 공지 목록</h3>
                <button onClick={() => setShowDayListModal(false)}>×</button>
              </div>
              <div className="modal-body">
                {dayListEvents.length === 0 ? (
                  <div className="empty-message">해당 날짜에 공지가 없습니다.</div>
                ) : (
                  <div className="calendar-day-list">
                    {dayListEvents.map((event, idx) => (
                      <button
                        key={`${event.noticeId}-${idx}`}
                        className="calendar-day-item"
                        onClick={() => {
                          setReturnToDayList(true);
                          setShowDayListModal(false);
                          handleEventClick(event);
                        }}
                      >
                        <span className="calendar-day-item-title">{event.title}</span>
                        <span className="calendar-day-item-meta">
                          {event.senderDept} · {event.senderUser} · {event.noticeType}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button onClick={() => setShowDayListModal(false)}>닫기</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
