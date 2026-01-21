// src/utils/modalUtils.js
// 모달 스크롤 제어 유틸리티 - 모든 화면 공통

/**
 * 모달 열기 - 배경 스크롤 차단
 */
export const openModal = () => {
  // 현재 스크롤 위치 저장
  const scrollY = window.scrollY;
  
  // body 고정
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.overflow = 'hidden';
  
  // 클래스 추가 (CSS 적용용)
  document.body.classList.add('modal-open');
  
  // 스크롤 위치 저장 (data attribute)
  document.body.setAttribute('data-scroll-y', scrollY.toString());
};

/**
 * 모달 닫기 - 배경 스크롤 복원
 */
export const closeModal = () => {
  // 저장된 스크롤 위치 가져오기
  const scrollY = parseInt(document.body.getAttribute('data-scroll-y') || '0');
  
  // body 스타일 초기화
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.overflow = '';
  
  // 클래스 제거
  document.body.classList.remove('modal-open');
  
  // 스크롤 위치 복원
  window.scrollTo(0, scrollY);
  
  // data attribute 제거
  document.body.removeAttribute('data-scroll-y');
};

/**
 * React Hook - 모달 스크롤 제어
 * @param {boolean} isOpen - 모달 열림 여부
 */
export const useModalScroll = (isOpen) => {
  React.useEffect(() => {
    if (isOpen) {
      openModal();
    } else {
      closeModal();
    }
    
    // 클린업
    return () => {
      closeModal();
    };
  }, [isOpen]);
};

/**
 * 여러 모달 관리 Hook
 * @param {...boolean} modalStates - 모달 상태들
 */
export const useMultiModalScroll = (...modalStates) => {
  React.useEffect(() => {
    const isAnyModalOpen = modalStates.some(state => state);
    
    if (isAnyModalOpen) {
      openModal();
    } else {
      closeModal();
    }
    
    return () => {
      closeModal();
    };
  }, modalStates);
};