// temp/react-app/src/contexts/AdminContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { adminUsersApi } from '../api/admin/adminUsersApi';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDelegatedAdmin, setIsDelegatedAdmin] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * 관리자 권한 체크
   */
  const checkAdminPermission = useCallback(async () => {
    try {
      setLoading(true);

      // localStorage에서 사용자 정보 확인
      const userDataStr = localStorage.getItem('userData') || localStorage.getItem('user_me');

      if (!userDataStr) {
        setIsAdmin(false);
        setIsDelegatedAdmin(false);
        setUserInfo(null);
        return;
      }

      const userData = JSON.parse(userDataStr);
      setUserInfo(userData);

      const userId = userData.userId;
      if (!userId) {
        setIsAdmin(false);
        setIsDelegatedAdmin(false);
        return;
      }

      const permissionResult = await adminUsersApi.checkAdminPermission(userId);
      const hasPermission = Boolean(permissionResult?.data);

      setIsAdmin(hasPermission);
      setIsDelegatedAdmin(false);
    } catch (error) {
      console.error('관리자 권한 확인 실패:', error);
      setIsAdmin(false);
      setIsDelegatedAdmin(false);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 권한 갱신 (위임 생성/삭제 후 호출)
   */
  const refreshPermission = useCallback(async () => {
    console.log('🔄 권한 갱신 시작...');
    await checkAdminPermission();
    console.log(' 권한 갱신 완료');
  }, [checkAdminPermission]);

  // 초기 로드
  useEffect(() => {
    checkAdminPermission();
  }, [checkAdminPermission]);

  const value = {
    isAdmin,
    isDelegatedAdmin,
    userInfo,
    loading,
    refreshPermission,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
