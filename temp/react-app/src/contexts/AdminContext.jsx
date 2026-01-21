// temp/react-app/src/contexts/AdminContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { adminDelegationApi } from '../api/admin/adminDelegationApi';

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
      
      // sessionStorage에서 사용자 정보 가져오기
      const userDataStr = sessionStorage.getItem('userData') || sessionStorage.getItem('user_me');
      
      if (!userDataStr) {
        setIsAdmin(false);
        setIsDelegatedAdmin(false);
        setUserInfo(null);
        return;
      }

      const userData = JSON.parse(userDataStr);
      setUserInfo(userData);

      // 1. 원래 관리자 권한 체크 (ttlCd === HR150138)
      const ttlCd = userData.job?.[0]?.ttlCd;
      const hasOriginalAdmin = ttlCd === 'HR150138';
      
      setIsAdmin(hasOriginalAdmin);

      // 2. 대리 관리자 권한 체크
      if (!hasOriginalAdmin) {
        try {
          const delegationResult = await adminDelegationApi.getCurrentDelegation();
          if (delegationResult.success && delegationResult.data) {
            console.log('✅ 대리 관리자 권한 발견:', delegationResult.data);
            setIsDelegatedAdmin(true);
            setIsAdmin(true);
          } else {
            setIsDelegatedAdmin(false);
          }
        } catch (error) {
          console.log('ℹ️ 대리 관리자 권한 없음');
          setIsDelegatedAdmin(false);
        }
      } else {
        setIsDelegatedAdmin(false);
      }
    } catch (error) {
      console.error('❌ 관리자 권한 체크 실패:', error);
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
    console.log('✅ 권한 갱신 완료');
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