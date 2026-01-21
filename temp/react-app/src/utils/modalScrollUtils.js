// src/utils/modalScrollUtils.js
// 개선된 모달 스크롤 제어 - 스크롤 위치 완벽 유지

/**
 * 모달 열기 - 현재 스크롤 위치 완벽하게 유지
 */
export const openModal = () => {
  // 1. 현재 스크롤 위치 즉시 저장
  const scrollY = window.scrollY;
  const scrollX = window.scrollX;
  
  // 2. 스크롤바 너비 계산 (레이아웃 shift 방지)
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  
  // 3. body 고정 + 스크롤 위치 유지
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = `-${scrollX}px`;
  document.body.style.right = '0';
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';
  
  // 4. 스크롤바 사라짐으로 인한 레이아웃 shift 방지
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }
  
  // 5. 스크롤 위치 저장 (복원용)
  document.body.setAttribute('data-scroll-y', scrollY.toString());
  document.body.setAttribute('data-scroll-x', scrollX.toString());
  document.body.setAttribute('data-scrollbar-width', scrollbarWidth.toString());
};

/**
 * 모달 닫기 - 스크롤 위치 정확히 복원
 */
export const closeModal = () => {
  // 1. 저장된 스크롤 위치 가져오기
  const scrollY = parseInt(document.body.getAttribute('data-scroll-y') || '0');
  const scrollX = parseInt(document.body.getAttribute('data-scroll-x') || '0');
  
  // 2. body 스타일 초기화
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
  
  // 3. 스크롤 위치 복원 (requestAnimationFrame으로 확실하게)
  requestAnimationFrame(() => {
    window.scrollTo(scrollX, scrollY);
  });
  
  // 4. data attribute 제거
  document.body.removeAttribute('data-scroll-y');
  document.body.removeAttribute('data-scroll-x');
  document.body.removeAttribute('data-scrollbar-width');
};

/**
 * React Hook - 단일 모달 제어
 */
export const useModalScroll = (isOpen) => {
  React.useEffect(() => {
    if (isOpen) {
      openModal();
    } else {
      closeModal();
    }
    
    return () => {
      closeModal();
    };
  }, [isOpen]);
};

/**
 * React Hook - 여러 모달 제어
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