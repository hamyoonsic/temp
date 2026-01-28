// NoticeRegistration.jsx - 완료 공지 등록 기능 추가
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './NoticeRegistration.css';

import { corporationApi, organizationApi, serviceApi, noticeApi, templateApi, signatureApi } from '../api';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import NoticeEditor from '../editor/NoticeEditor';

// 개선된 모달 스크롤 제어 (스크롤 위치 완벽 유지)
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
  
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }
  
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
  
  requestAnimationFrame(() => {
    window.scrollTo(scrollX, scrollY);
  });
  
  document.body.removeAttribute('data-scroll-y');
  document.body.removeAttribute('data-scroll-x');
};

const NoticeRegistration = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  
  const [services, setServices] = useState([]);
  const [corporations, setCorporations] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [allOrganizations, setAllOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [selectedCorpIds, setSelectedCorpIds] = useState([]);
  const [selectedOrgIds, setSelectedOrgIds] = useState([]);
  
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showCorpModal, setShowCorpModal] = useState(false);
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [sendToCorpAll, setSendToCorpAll] = useState(false);

  // 완료 공지 관련 상태
  const [isCompletionNotice, setIsCompletionNotice] = useState(false);
  const [originalNotice, setOriginalNotice] = useState(null);

  const [userInfo, setUserInfo] = useState({
    userId: '',
    orgUnitName: '서린정보기술',
    userName: '-'
  });

  const editorRef = useRef(null);
  const templateEditorRef = useRef(null);
  const signatureEditorRef = useRef(null);
  const signatureFileInputRef = useRef(null);

  const [templates, setTemplates] = useState([]);
  const [signatures, setSignatures] = useState([]);
  const [defaultSignature, setDefaultSignature] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [templateDraft, setTemplateDraft] = useState({ templateId: null, name: '', content: '' });
  const [signatureDraft, setSignatureDraft] = useState({ signatureId: null, name: '', content: '', isDefault: false });
  const [showCompletionSelectModal, setShowCompletionSelectModal] = useState(false);
  const [completionCandidates, setCompletionCandidates] = useState([]);
  const completionNoticeType = '시스템 정상화안내';

  const [formData, setFormData] = useState({
    noticeType: '시스템 점검안내',
    priority: 'L2',
    affectedServices: [],
    senderDept: '',
    receiverCompanies: [],
    receiverDepts: [],
    noticeTitle: '',
    noticeContent: '',
    sendDate: new Date().toISOString().split('T')[0],
    sendTimeType: '오전 정기발송 시간',
    sendTime: '08:30',
    outlookSchedule: '등록안함',
    outlookDate: new Date().toISOString().split('T')[0],
    outlookTime: '17:30',
    tags: []
  });

  const hasSignatureInContent = /notice-signature/.test(formData.noticeContent || '');

  const [tagInput, setTagInput] = useState('');
  const todayDate = new Date().toISOString().split('T')[0];
  const nowTime = new Date().toTimeString().slice(0, 5);
  const maxDate = '2099-12-31';

  const isValidDateInput = (value) => {
    if (!value) return true;
    return /^\d{4}-\d{2}-\d{2}$/.test(value);
  };

  const handleDateInputChange = (field, value) => {
    if (!isValidDateInput(value)) {
      return;
    }
    handleInputChange(field, value);
  };

  const handleTimeInputChange = (field, value, dateValue) => {
    if (!value) {
      handleInputChange(field, value);
      return;
    }
    if (dateValue === todayDate && value < nowTime) {
      return;
    }
    if (field === 'sendTime' && formData.sendTimeType !== '시간 직접 선택') {
      handleInputChange('sendTimeType', '시간 직접 선택');
    }
    handleInputChange(field, value);
  };

  //  모달 스크롤 제어

  const resetTemplateDraft = () => {
    setTemplateDraft({ templateId: null, name: '', content: '' });
    if (templateEditorRef.current) {
      templateEditorRef.current.setData('');
    }
  };

  const resetSignatureDraft = () => {
    setSignatureDraft({ signatureId: null, name: '', content: '', isDefault: false });
    if (signatureEditorRef.current) {
      signatureEditorRef.current.setData('');
    }
  };

  const startEditTemplate = (template) => {
    if (!template) return;
    const next = {
      templateId: template.templateId ?? null,
      name: template.name || '',
      content: template.content || ''
    };
    setTemplateDraft(next);
    if (templateEditorRef.current) {
      templateEditorRef.current.setData(next.content || '');
    }
  };

  const startEditSignature = (signature) => {
    if (!signature) return;
    const next = {
      signatureId: signature.signatureId ?? null,
      name: signature.name || '',
      content: signature.content || '',
      isDefault: Boolean(signature.isDefault)
    };
    setSignatureDraft(next);
    if (signatureEditorRef.current) {
      signatureEditorRef.current.setData(next.content || '');
    }
  };

  const resolveAbsoluteUrl = (url) => {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    const base = window.location.origin;
    if (url.startsWith('/')) {
      return `${base}${url}`;
    }
    return `${base}/${url}`;
  };

  const handleSignatureImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const response = await signatureApi.uploadImage(file, { userId: userInfo.userId });
      const payload = response?.data?.data || response?.data || response;
      const url = resolveAbsoluteUrl(payload?.url);
      if (!url) {
        throw new Error('image url missing');
      }
      const editor = signatureEditorRef.current;
      const current = editor ? editor.getData() : signatureDraft.content || '';
      const imageHtml = `<p><img src="${url}" alt="signature-image" /></p>`;
      const nextContent = `${current}${imageHtml}`;
      setSignatureDraft(prev => ({ ...prev, content: nextContent }));
      if (editor) {
        editor.setData(nextContent);
      }
    } catch (error) {
      console.error('서명 이미지 업로드 실패:', error);
      alert('서명 이미지 업로드에 실패했습니다.');
    } finally {
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const loadTemplates = async (userId) => {
    if (!userId) return;
    try {
      const response = await templateApi.getList({ userId });
      setTemplates(response.data?.data || response.data || []);
    } catch (error) {
      console.error('??? ?? ??:', error);
    }
  };

  const loadSignatures = async (userId) => {
    if (!userId) return;
    try {
      const response = await signatureApi.getList({ userId });
      const list = response.data?.data || response.data || [];
      setSignatures(list);
      const defaultItem = list.find(item => item.isDefault);
      setDefaultSignature(defaultItem || null);
    } catch (error) {
      console.error('?? ?? ??:', error);
    }
  };

  const applyTemplate = (template) => {
    if (!template) return;
    setFormData(prev => ({
      ...prev,
      noticeContent: template.content || ''
    }));
    if (editorRef.current) {
      editorRef.current.setData(template.content || '');
    }
    setShowTemplateModal(false);
  };

  const applySignatureToEditor = (signature) => {
    if (!signature) return;
    const hasSignature = /notice-signature/.test(formData.noticeContent || '');
    if (hasSignature) {
      setSignaturePreview(signature);
      return;
    }
    const nextContent = appendSignature(formData.noticeContent, signature);
    setFormData(prev => ({
      ...prev,
      noticeContent: nextContent
    }));
    if (editorRef.current) {
      editorRef.current.setData(nextContent);
    }
    setSignaturePreview(signature);
  };

  const loadCompletionCandidates = async () => {
    try {
      const result = await noticeApi.getList({ page: 0, size: 200, sort: 'createdAt,DESC' });
      if (result.success && result.data) {
        const list = result.data.data || result.data || [];
        const filtered = (Array.isArray(list) ? list : []).filter(notice =>
          notice.isMaintenance &&
          !notice.isCompleted &&
          ['APPROVED', 'SENT', 'FAILED'].includes(notice.noticeStatus) &&
          (!userInfo.userId || notice.createdBy === userInfo.userId)
        );
        setCompletionCandidates(filtered);
      } else {
        setCompletionCandidates([]);
      }
    } catch (error) {
      console.error('완료 공지 대상 조회 실패:', error);
      setCompletionCandidates([]);
    }
  };

  const saveTemplate = async () => {
    if (!templateDraft.name.trim()) return;
    const payload = {
      userId: userInfo.userId,
      name: templateDraft.name.trim(),
      content: templateDraft.content || ''
    };
    try {
      if (templateDraft.templateId) {
        await templateApi.update(templateDraft.templateId, payload);
      } else {
        await templateApi.create(payload);
      }
      await loadTemplates(userInfo.userId);
      resetTemplateDraft();
    } catch (error) {
      console.error('??? ?? ??:', error);
    }
  };

  const saveSignature = async () => {
    if (!signatureDraft.name.trim()) return;
    const payload = {
      userId: userInfo.userId,
      name: signatureDraft.name.trim(),
      content: signatureDraft.content || '',
      isDefault: signatureDraft.isDefault
    };
    try {
      if (signatureDraft.signatureId) {
        await signatureApi.update(signatureDraft.signatureId, payload);
      } else {
        await signatureApi.create(payload);
      }
      await loadSignatures(userInfo.userId);
      resetSignatureDraft();
    } catch (error) {
      console.error('?? ?? ??:', error);
    }
  };

  const removeTemplate = async (templateId) => {
    try {
      await templateApi.delete(templateId, { userId: userInfo.userId });
      await loadTemplates(userInfo.userId);
      if (Number(templateDraft.templateId) === Number(templateId)) {
        resetTemplateDraft();
      }
    } catch (error) {
      console.error('??? ?? ??:', error);
    }
  };

  const removeSignature = async (signatureId) => {
    try {
      await signatureApi.delete(signatureId, { userId: userInfo.userId });
      await loadSignatures(userInfo.userId);
      if (Number(signatureDraft.signatureId) === Number(signatureId)) {
        resetSignatureDraft();
      }
    } catch (error) {
      console.error('?? ?? ??:', error);
    }
  };

  const appendSignature = (content, signature) => {
    if (!signature || !signature.content) return content || '';
    let next = content || '';
    next = next.replace(/<div class="notice-signature"[\s\S]*?<\/div>/gi, '');
    const spacer = '<p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>';
    const block = `<div class="notice-signature" data-signature-id="${signature.signatureId || ''}">${spacer}${signature.content}</div>`;
    return next + block;
  };

  const setDefaultSignatureById = async (signature) => {
    if (!signature) return;
    try {
      await signatureApi.update(signature.signatureId, {
        userId: userInfo.userId,
        name: signature.name,
        content: signature.content,
        isDefault: true
      });
      await loadSignatures(userInfo.userId);
    } catch (error) {
      console.error('?? ?? ?? ??:', error);
    }
  };

  useEffect(() => {
    const isAnyModalOpen = showServiceModal || showCorpModal || showOrgModal || showTemplateModal || showSignatureModal || showCompletionSelectModal;

    if (isAnyModalOpen) {
      openModal();
    } else {
      closeModal();
    }

    return () => {
      closeModal();
    };
  }, [showServiceModal, showCorpModal, showOrgModal, showTemplateModal, showSignatureModal, showCompletionSelectModal]);


  useEffect(() => {
    loadMasterData();
    loadUserInfo();
    
    //  완료 공지 등록 모드인지 확인
    if (location.state?.isCompletion && location.state?.originalNotice) {
      setIsCompletionNotice(true);
      setOriginalNotice(location.state.originalNotice);
      initializeCompletionForm(location.state.originalNotice);
    }
  }, [location.state]);

  useEffect(() => {
    if (!userInfo.userId) return;
    loadTemplates(userInfo.userId);
    loadSignatures(userInfo.userId);
  }, [userInfo.userId]);

  useEffect(() => {
    if (!defaultSignature || !editorRef.current) return;
    const current = editorRef.current.getData();
    if (/notice-signature/.test(current || '')) {
      return;
    }
    const nextContent = appendSignature(current, defaultSignature);
    editorRef.current.setData(nextContent);
    handleInputChange("noticeContent", nextContent);
    setSignaturePreview(defaultSignature);
  }, [defaultSignature]);

  useEffect(() => {
    if (formData.receiverCompanies.length === 0) {
      setSendToCorpAll(false);
    }
  }, [formData.receiverCompanies.length]);

  //  완료 공지 폼 초기화
  const initializeCompletionForm = async (original) => {
    console.log(' 완료 공지 초기화:', original);
    
    // 제목: "[완료] 원본 제목"
    const completionTitle = `[완료] ${original.title}`;
    
    // 공지 유형: "시스템 정상화안내"로 고정
    const completionType = completionNoticeType;
    
    // 서비스 자동 선택
    if (original.affectedService) {
      setSelectedServiceIds([original.affectedService.serviceId]);
    }
    
    // 수신 대상 자동 선택 (원본 공지의 targets 사용)
    if (original.targets && original.targets.length > 0) {
      const corpIds = original.targets
        .filter(t => t.targetType === 'CORP')
        .map(t => parseInt(t.targetKey));
      
      const orgIds = original.targets
        .filter(t => t.targetType === 'ORG_UNIT')
        .map(t => parseInt(t.targetKey));
      
      setSelectedCorpIds(corpIds);
      setSelectedOrgIds(orgIds);
    }
    
    setFormData(prev => ({
      ...prev,
      noticeType: completionType,
      noticeTitle: completionTitle,
      priority: original.noticeLevel || 'L2',
      affectedServices: original.affectedService ? [{
        serviceId: original.affectedService.serviceId,
        serviceName: original.affectedService.serviceName
      }] : [],
      // 내용은 비워둠 (사용자가 직접 작성)
      noticeContent: ''
    }));
  };

  const loadUserInfo = () => {
    try {
      console.log('🔍 사용자 정보 로드 시작...');
      console.log('sessionStorage 확인:', {
        hasUserData: !!sessionStorage.getItem('userData'),
        hasUserMe: !!sessionStorage.getItem('user_me'),
        hasUserOrgName: !!sessionStorage.getItem('userOrgName'),
        hasUserName: !!sessionStorage.getItem('userName'),
        hasUserId: !!sessionStorage.getItem('userId')
      });
      
      // 1. 우선순위: sessionStorage에서 직접 저장된 값
      const storedOrgName = sessionStorage.getItem('userOrgName');
      const storedUserName = sessionStorage.getItem('userName');
      const storedUserId = sessionStorage.getItem('userId');
      
      if (storedOrgName && storedUserName && storedUserId) {
        console.log(' sessionStorage에서 직접 로드:', {
          userId: storedUserId,
          orgUnitName: storedOrgName,
          userName: storedUserName
        });
        
        setUserInfo({
          userId: storedUserId,
          orgUnitName: storedOrgName,
          userName: storedUserName
        });
        
        setFormData(prev => ({
          ...prev,
          senderDept: storedOrgName
        }));
        return;
      }
      
      // 2. userData에서 추출
      let userDataStr = sessionStorage.getItem('userData');
      if (!userDataStr) {
        userDataStr = sessionStorage.getItem('user_me');
      }
      
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        console.log('📦 userData 파싱:', userData);
        
        // deptNm 우선, 없으면 job 배열에서 추출
        let orgName = userData.deptNm || '서린정보기술';
        
        if (!userData.deptNm && userData.job && userData.job.length > 0) {
          const baseJob = userData.job.find(j => j.bassYn === 'Y') || userData.job[0];
          orgName = baseJob.deptNm || baseJob.orgUnitName || '서린정보기술';
        }
        
        const userName = userData.userKoNm || userData.userName || '-';
        const userId = userData.userId || 'unknown';
        
        console.log(' 최종 사용자 정보:', {
          userId,
          orgUnitName: orgName,
          userName
        });
        
        setUserInfo({
          userId,
          orgUnitName: orgName,
          userName
        });
        
        setFormData(prev => ({
          ...prev,
          senderDept: orgName
        }));
      } else {
        console.warn(' 사용자 정보 없음 - 기본값 사용');
      }
    } catch (error) {
      console.error(' 사용자 정보 로드 실패:', error);
    }
  };

  const loadMasterData = async () => {
  setLoading(true);
  try {
    const [corpData, orgData, serviceData] = await Promise.all([
      corporationApi.getAll(),    //  변경
      organizationApi.getAll(),   //  변경
      serviceApi.getAll()         //  변경
    ]);

    if (corpData.success) {
      setCorporations(corpData.data || []);
    }
    
    if (orgData.success) {
      setOrganizations(orgData.data || []);
      setAllOrganizations(orgData.data || []);
    }
    
    if (serviceData.success) {
      setServices(serviceData.data || []);
    }
  } catch (error) {
    console.error('마스터 데이터 로드 실패:', error);
  } finally {
    setLoading(false);  //  추가: 로딩 상태 해제
  }
};

  // 마스터 데이터 로드 완료 후 targets 복원
  useEffect(() => {
    if (isCompletionNotice && originalNotice && 
        corporations.length > 0 && allOrganizations.length > 0) {
      restoreTargets();
    }
  }, [corporations, allOrganizations]);

  const restoreTargets = () => {
    if (!originalNotice.targets || originalNotice.targets.length === 0) return;
    
    // 법인 복원
    const corpTargets = originalNotice.targets.filter(t => t.targetType === 'CORP');
    if (corpTargets.length > 0) {
      const corpIds = corpTargets.map(t => parseInt(t.targetKey));
      updateReceiverCompanies(corpIds);
      filterOrganizationsByCorps(corpIds);
    }
    
    // 조직 복원
    const orgTargets = originalNotice.targets.filter(t => t.targetType === 'ORG_UNIT');
    if (orgTargets.length > 0) {
      const orgIds = orgTargets.map(t => parseInt(t.targetKey));
      updateReceiverDepts(orgIds);
    }
  };

  const filterOrganizationsByCorps = (corpIds) => {
    if (corpIds.length === 0) {
      setOrganizations(allOrganizations);
    } else {
      const filtered = allOrganizations.filter(org => 
        corpIds.includes(org.corpId)
      );
      setOrganizations(filtered);
      
      const validOrgIds = filtered.map(o => o.orgUnitId);
      const filteredOrgIds = selectedOrgIds.filter(id => validOrgIds.includes(id));
      if (filteredOrgIds.length !== selectedOrgIds.length) {
        setSelectedOrgIds(filteredOrgIds);
        updateReceiverDepts(filteredOrgIds);
      }
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceToggle = (service) => {
    const isSelected = selectedServiceIds.includes(service.serviceId);
    let newSelectedIds;
    
    if (isSelected) {
      newSelectedIds = selectedServiceIds.filter(id => id !== service.serviceId);
    } else {
      newSelectedIds = [...selectedServiceIds, service.serviceId];
    }
    
    setSelectedServiceIds(newSelectedIds);
    updateAffectedServices(newSelectedIds);
  };

  const updateAffectedServices = (serviceIds) => {
    const selectedServices = services.filter(s => serviceIds.includes(s.serviceId));
    setFormData(prev => ({
      ...prev,
      affectedServices: selectedServices.map(s => ({
        serviceId: s.serviceId,
        serviceName: s.serviceName
      }))
    }));
  };

  const handleCorpToggle = (corp) => {
    const isSelected = selectedCorpIds.includes(corp.corpId);
    let newSelectedIds;
    
    if (isSelected) {
      newSelectedIds = selectedCorpIds.filter(id => id !== corp.corpId);
    } else {
      newSelectedIds = [...selectedCorpIds, corp.corpId];
    }
    
    setSelectedCorpIds(newSelectedIds);
    updateReceiverCompanies(newSelectedIds);
    filterOrganizationsByCorps(newSelectedIds);
  };

  const updateReceiverCompanies = (corpIds) => {
    const selectedCorps = corporations.filter(c => corpIds.includes(c.corpId));
    setFormData(prev => ({
      ...prev,
      receiverCompanies: selectedCorps.map(c => ({
        corpId: c.corpId,
        corpName: c.corpName
      }))
    }));
  };

  const handleOrgToggle = (org) => {
    const isSelected = selectedOrgIds.includes(org.orgUnitId);
    let newSelectedIds;
    
    if (isSelected) {
      newSelectedIds = selectedOrgIds.filter(id => id !== org.orgUnitId);
    } else {
      newSelectedIds = [...selectedOrgIds, org.orgUnitId];
    }
    
    setSelectedOrgIds(newSelectedIds);
    updateReceiverDepts(newSelectedIds);
  };

  const updateReceiverDepts = (orgIds) => {
    const selectedOrgs = allOrganizations.filter(o => orgIds.includes(o.orgUnitId));
    setFormData(prev => ({
      ...prev,
      receiverDepts: selectedOrgs.map(o => ({
        orgUnitId: o.orgUnitId,
        orgUnitName: o.orgUnitName,
        corpName: o.corpName
      }))
    }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    } else if (e.key === 'Backspace' && tagInput === '' && formData.tags.length > 0) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        tags: prev.tags.slice(0, -1)
      }));
    }
  };

  const handleRemoveTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '-';
    const date = new Date(dateTimeStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const handleNoticeTypeChange = (value) => {
    if (value === completionNoticeType && !isCompletionNotice) {
      loadCompletionCandidates();
      setShowCompletionSelectModal(true);
      return;
    }
    handleInputChange('noticeType', value);
  };

  const exitCompletionMode = () => {
    setIsCompletionNotice(false);
    setOriginalNotice(null);
    setFormData(prev => ({
      ...prev,
      noticeType: prev.noticeType === completionNoticeType ? '시스템 점검안내' : prev.noticeType,
      noticeTitle: prev.noticeTitle.replace(/^\[완료\]\s*/i, '')
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // 유효성 검증
  if (!formData.noticeTitle.trim()) {
    alert('제목을 입력하세요.');
    return;
  }

  if (isCompletionNotice && !originalNotice) {
    alert('완료 공지의 원본 공지를 선택하세요.');
    return;
  }

  if (isCompletionNotice && originalNotice && originalNotice.isCompleted) {
    alert('이미 완료 공지가 등록된 공지입니다.');
    return;
  }
  
  if (!formData.noticeContent.trim()) {
    alert('내용을 입력하세요.');
    return;
  }
  
  if (formData.affectedServices.length === 0) {
    alert('영향받는 서비스를 선택하세요.');
    return;
  }
  
  if (formData.receiverCompanies.length === 0 && formData.receiverDepts.length === 0) {
    alert('수신 대상(법인 또는 부서)을 선택하세요.');
    return;
  }

  setLoading(true);
  try {
    console.log('📤 현재 사용자 정보:', userInfo);
    
    const isMaintenance = isCompletionNotice 
      ? false 
      : (formData.noticeType.includes('점검') || formData.noticeType.includes('장애'));
    
    const userDataStr = sessionStorage.getItem('userData') || sessionStorage.getItem('user_me');
    const userEmail = userDataStr ? JSON.parse(userDataStr).email : null;

    const hasDeptTargets = formData.receiverDepts.length > 0;
    const shouldSendToCorps = !hasDeptTargets || sendToCorpAll;
    const corpTargets = shouldSendToCorps
      ? formData.receiverCompanies.map(c => ({
          targetType: 'CORP',
          targetKey: c.corpId.toString(),
          targetName: c.corpName
        }))
      : [];
    const deptTargets = formData.receiverDepts.map(d => ({
      targetType: 'ORG_UNIT',
      targetKey: d.orgUnitId.toString(),
      targetName: d.orgUnitName
    }));

    const requestData = {
      title: formData.noticeTitle,
      content: formData.noticeContent,
      noticeType: formData.noticeType,
      noticeLevel: formData.priority,
      affectedServiceId: formData.affectedServices[0]?.serviceId || null,
      publishStartAt: `${formData.sendDate}T${formData.sendTime}:00`,
      publishEndAt: null,
      isMaintenance: isMaintenance,
      mailSubject: formData.noticeTitle,
      senderOrgUnitName: userInfo.orgUnitName,
      senderEmail: userEmail,
      createdBy: userInfo.userId,
      parentNoticeId: isCompletionNotice ? originalNotice.noticeId : null,
      
      targets: [...corpTargets, ...deptTargets],
      tags: formData.tags,
      sendPlan: {
        sendMode: formData.sendTimeType === '즉시 발송' ? 'IMMEDIATE' : 'SCHEDULED',
        scheduledSendAt: `${formData.sendDate}T${formData.sendTime}:00`,
        allowBundle: formData.sendTimeType !== '즉시 발송'
      },
      outlookCalendar: formData.outlookSchedule === '등록함' ? {
        register: true,
        eventDate: `${formData.outlookDate}T${formData.outlookTime}:00`
      } : null
    };

    console.log(' 공지 등록 요청:', requestData);

    const result = await noticeApi.create(requestData);
  
    console.log(' 등록 성공:', result);
    navigate('/notices/history');
    
  } catch (error) {
    console.error('공지 등록 실패:', error);
    alert('공지 등록 중 오류가 발생했습니다.');
  } finally {
    setLoading(false);
  }
};

  const handleCancel = () => {
    if (window.confirm('작성 중인 내용이 삭제됩니다. 취소하시겠습니까?')) {
      navigate(-1);
    }
  };

  if (loading) {
    return (
      <div className="notice-registration-page">
        <div className="notice-registration-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>데이터 로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notice-registration-page">
      <div className="notice-registration-container">
        <div className="page-header">
          <div>
            <h1 className="page-title">
              {isCompletionNotice ? ' 점검 완료 공지 등록' : '공지 등록'}
            </h1>
            <p className="page-description">
              {isCompletionNotice 
                ? `"${originalNotice?.title}" 점검에 대한 완료 공지를 작성합니다`
                : '새로운 공지를 작성하고 발송 설정을 진행합니다'}
            </p>
          </div>
          {!isCompletionNotice ? (
            <div className="page-header-actions">
              <button
                type="button"
                className="btn btn-cancel"
                onClick={() => {
                  loadCompletionCandidates();
                  setShowCompletionSelectModal(true);
                }}
              >
                완료 공지 등록
              </button>
            </div>
          ) : (
            <div className="page-header-actions">
              <button
                type="button"
                className="btn btn-cancel"
                onClick={() => {
                  loadCompletionCandidates();
                  setShowCompletionSelectModal(true);
                }}
              >
                완료 공지 변경
              </button>
              <button
                type="button"
                className="btn btn-cancel"
                onClick={exitCompletionMode}
              >
                일반 공지로 전환
              </button>
            </div>
          )}
        </div>

        {/*  완료 공지 안내 배너 */}
        {isCompletionNotice && originalNotice && (
          <div className="completion-notice-banner">
            <div className="banner-icon"></div>
            <div className="banner-content">
              <h4>완료 공지 자동 설정</h4>
              <ul>
                <li>제목: "[완료] {originalNotice.title}"</li>
                <li>공지유형: 시스템 정상화안내</li>
                <li>영향받는 서비스: {originalNotice.affectedService?.serviceName || '미설정'}</li>
                <li>수신 대상: 원본 공지와 동일하게 설정됨</li>
              </ul>
              <p className="banner-hint">💡 완료 내용만 작성하시면 됩니다!</p>
            </div>
          </div>
        )}

        {showCompletionSelectModal && (
          <div className="modal-overlay" onClick={() => setShowCompletionSelectModal(false)}>
            <div className="modal-content modal-wide" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>완료 공지 대상 선택</h3>
                <button onClick={() => setShowCompletionSelectModal(false)}>×</button>
              </div>
              <div className="modal-body">
                {completionCandidates.length === 0 ? (
                  <div className="empty-message">선택 가능한 점검 공지가 없습니다.</div>
                ) : (
                  <div className="selection-list">
                    {completionCandidates.map((notice) => (
                      <div
                        key={notice.noticeId}
                        className="selection-item"
                        onClick={() => {
                          setIsCompletionNotice(true);
                          setOriginalNotice(notice);
                          initializeCompletionForm(notice);
                          setShowCompletionSelectModal(false);
                        }}
                      >
                        <div className="selection-name">{notice.title}</div>
                        <div className="selection-corp">{notice.senderOrgUnitName || '-'}</div>
                        <div className="selection-code">{formatDateTime(notice.publishStartAt || notice.createdAt)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-cancel" onClick={() => setShowCompletionSelectModal(false)}>닫기</button>
              </div>
            </div>
          </div>
        )}

        <form className="notice-form" onSubmit={handleSubmit}>
          <div className="form-sections">
            {/* 기본 정보 섹션 */}
            <div className="form-section">
              <div className="section-header">
                <h2 className="section-title">기본 정보</h2>
                <span className="section-badge">필수</span>
              </div>
              
              <div className="section-content">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      공지유형 <span className="required">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={formData.noticeType}
                      onChange={(e) => handleNoticeTypeChange(e.target.value)}
                      disabled={isCompletionNotice}
                    >
                      <option value="일반공지">일반공지</option>
                      <option value="시스템 점검안내">시스템 점검안내</option>
                      <option value="시스템 장애안내">시스템 장애안내</option>
                      <option value={completionNoticeType}>{completionNoticeType}</option>
                      <option value="보안 공지">보안 공지</option>
                      <option value="인프라 공지">인프라 공지</option>
                    </select>
                    {isCompletionNotice && (
                      <p className="form-hint">
                         완료 공지는 "시스템 정상화안내"로 고정됩니다
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      중요도 <span className="required">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={formData.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                    >
                      <option value="L1">낮음 (L1)</option>
                      <option value="L2">중간 (L2)</option>
                      <option value="L3">긴급 (L3)</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">영향을 받는 서비스 <span className="required">*</span></label>
                    <div 
                      className="input-with-icon" 
                      onClick={() => !isCompletionNotice && setShowServiceModal(true)}
                      style={{ cursor: isCompletionNotice ? 'not-allowed' : 'pointer' }}
                    >
                      <input
                        type="text"
                        className={`form-input ${isCompletionNotice ? 'disabled' : ''}`}
                        value="클릭하여 서비스 선택"
                        readOnly
                        placeholder="서비스를 선택하세요"
                        disabled={isCompletionNotice}
                      />
                      <span className="input-icon">🔍</span>
                    </div>
                    
                    {/* 선택된 서비스 표시 */}
                    {formData.affectedServices.length > 0 && (
                      <div className="selected-items-display">
                        {formData.affectedServices.map((service, index) => (
                          <div key={index} className="selected-tag">
                            <span>{service.serviceName}</span>
                            {!isCompletionNotice && (
                              <button
                                type="button"
                                className="selected-tag-remove"
                                onClick={() => {
                                  const newIds = selectedServiceIds.filter(id => id !== service.serviceId);
                                  setSelectedServiceIds(newIds);
                                  updateAffectedServices(newIds);
                                }}
                              >×</button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">
                      발신부서 <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input disabled"
                      value={formData.senderDept}
                      disabled
                    />
                    <p className="form-hint">
                      💡 {userInfo.userName} ({userInfo.userId})님의 부서 정보가 자동으로 설정됩니다
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 수신 대상 섹션 */}
            <div className="form-section">
              <div className="section-header">
                <h2 className="section-title">수신 대상</h2>
                <span className="section-badge">필수</span>
              </div>
              
              <div className="section-content">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      수신법인 <span className="required">*</span>
                    </label>
                    <div 
                      className="input-with-icon" 
                      onClick={() => setShowCorpModal(true)}
                      style={{ cursor: 'pointer' }}
                    >
                      <input
                        type="text"
                        className="form-input"
                        value="클릭하여 법인 선택"
                        readOnly
                        placeholder="법인을 선택하세요"
                      />
                      <span className="input-icon">🔍</span>
                    </div>
                    
                    {/* 선택된 법인 표시 */}
                    {formData.receiverCompanies.length > 0 && (
                      <div className="selected-items-display">
                        {formData.receiverCompanies.map((company, index) => (
                          <div key={index} className="selected-tag">
                            <span>{company.corpName}</span>
                            <button
                              type="button"
                              className="selected-tag-remove"
                              onClick={() => {
                                const newIds = selectedCorpIds.filter(id => id !== company.corpId);
                                setSelectedCorpIds(newIds);
                                updateReceiverCompanies(newIds);
                                filterOrganizationsByCorps(newIds);
                              }}
                            >×</button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="corp-send-toggle">
                      <label className="toggle-label">
                        <input
                          type="checkbox"
                          checked={sendToCorpAll}
                          onChange={(e) => setSendToCorpAll(e.target.checked)}
                          disabled={formData.receiverCompanies.length === 0}
                        />
                        법인 전체로 발송
                      </label>
                      <p className="form-hint">
                        부서를 선택하면 기본적으로 부서만 발송됩니다. 법인 전체 발송이 필요하면 체크하세요.
                      </p>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">수신부서</label>
                    <div 
                      className="input-with-icon" 
                      onClick={() => setShowOrgModal(true)}
                      style={{ cursor: 'pointer' }}
                    >
                      <input
                        type="text"
                        className="form-input"
                        value="클릭하여 부서 선택"
                        readOnly
                        placeholder="부서를 선택하세요"
                      />
                      <span className="input-icon">🔍</span>
                    </div>
                    
                    {/* 선택된 부서 표시 */}
                    {formData.receiverDepts.length > 0 && (
                      <div className="selected-items-display">
                        {formData.receiverDepts.map((dept, index) => (
                          <div key={index} className="selected-tag">
                            <span>{dept.orgUnitName}</span>
                            <button
                              type="button"
                              className="selected-tag-remove"
                              onClick={() => {
                                const newIds = selectedOrgIds.filter(id => id !== dept.orgUnitId);
                                setSelectedOrgIds(newIds);
                                updateReceiverDepts(newIds);
                              }}
                            >×</button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {selectedCorpIds.length > 0 && (
                      <p className="form-hint filter-active">
                        🔍 선택한 법인의 부서만 표시됩니다
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 공지 내용 섹션 */}
            <div className="form-section">
              <div className="section-header">
                <h2 className="section-title">공지 내용</h2>
                <span className="section-badge">필수</span>
              </div>
              
              <div className="section-content">
                <div className="form-group full-width">
                  <label className="form-label">
                    공지제목 <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-input ${isCompletionNotice ? 'completion-title' : ''}`}
                    value={formData.noticeTitle}
                    onChange={(e) => handleInputChange('noticeTitle', e.target.value)}
                    placeholder="공지 제목을 입력하세요"
                    readOnly={isCompletionNotice}
                  />
                  {isCompletionNotice && (
                    <p className="form-hint">
                       완료 공지 제목은 "[완료] 원본 제목" 형식으로 자동 설정됩니다
                    </p>
                  )}
                </div>

                <div className="form-group full-width">
                  <label className="form-label">
                    공지내용 <span className="required">*</span>
                  </label>
                  <CKEditor
                    editor={NoticeEditor}
                    data={formData.noticeContent}
                    onReady={(editor) => {
                      editorRef.current = editor;
                      if (defaultSignature) {
                        const current = editor.getData();
                        if (!/notice-signature/.test(current || '')) {
                          const nextContent = appendSignature(current, defaultSignature);
                          editor.setData(nextContent);
                          handleInputChange("noticeContent", nextContent);
                          setSignaturePreview(defaultSignature);
                        }
                      }
                      editor.on('openTemplateManager', () => {
                        resetTemplateDraft();
                        setShowTemplateModal(true);
                      });
                      editor.on('openSignatureManager', () => {
                        resetSignatureDraft();
                        setShowSignatureModal(true);
                      });
                    }}
                    onChange={(event, editor) => handleInputChange("noticeContent", editor.getData())}
                  />
                  {isCompletionNotice && (
                    <p className="form-hint" style={{ marginTop: '12px' }}>
                      💡 점검 완료에 대한 내용을 작성해주세요 (예: 정상화 시간, 영향 범위, 감사 인사 등)
                    </p>
                  )}
                </div>

                {signaturePreview && hasSignatureInContent && (
                  <div className="signature-preview">
                    <div className="signature-preview-header">
                      <span>현재 서명: {signaturePreview.name}</span>
                      <button
                        type="button"
                        className="btn btn-cancel"
                        onClick={() => setSignaturePreview(null)}
                      >
                        닫기
                      </button>
                    </div>
                    <div
                      className="signature-preview-body"
                      dangerouslySetInnerHTML={{ __html: signaturePreview.content }}
                    />
                  </div>
                )}

                <div className="form-group full-width">
                  <label className="form-label">해시태그 (선택)</label>
                  <div className="tag-input-container">
                    {formData.tags.map((tag, index) => (
                      <div key={index} className="tag">
                        <span className="tag-text">{tag}</span>
                        <button
                          type="button"
                          className="tag-remove"
                          onClick={() => handleRemoveTag(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <input
                      type="text"
                      className="tag-input"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder="태그 입력 후 Enter (백스페이스로 삭제)"
                    />
                  </div>
                  <p className="form-hint">
                    💡 Enter로 추가, 백스페이스로 마지막 태그 삭제
                  </p>
                </div>
              </div>
            </div>

            {/* 발송 설정 섹션 */}
            <div className="form-section">
              <div className="section-header">
                <h2 className="section-title">발송 설정</h2>
                <span className="section-badge">필수</span>
              </div>
              
              <div className="section-content">
                <div className="form-group full-width">
                  <label className="form-label">
                    발송일시 <span className="required">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type="date"
                      className="form-input"
                      value={formData.sendDate}
                      min={todayDate}
                      max={maxDate}
                      onChange={(e) => handleDateInputChange('sendDate', e.target.value)}
                      disabled={formData.sendTimeType === '즉시 발송'}
                    />
                    <select
                      className="form-select"
                      value={formData.sendTimeType}
                      onChange={(e) => handleInputChange('sendTimeType', e.target.value)}
                    >
                      <option value="오전 정기발송 시간">오전 정기발송 시간</option>
                      <option value="오후 정기발송 시간">오후 정기발송 시간</option>
                      <option value="시간 직접 선택">시간 직접 선택</option>
                      <option value="즉시 발송">즉시 발송</option>
                    </select>
                    <input
                      type="time"
                      className="form-input"
                      value={formData.sendTime}
                      min={formData.sendDate === todayDate ? nowTime : undefined}
                      onChange={(e) => handleTimeInputChange('sendTime', e.target.value, formData.sendDate)}
                      disabled={formData.sendTimeType !== '시간 직접 선택' || formData.sendTimeType === '즉시 발송'}
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">아웃룩 일정등록 (선택)</label>
                  <div className="input-group">
                    <select
                      className="form-select"
                      value={formData.outlookSchedule}
                      onChange={(e) => handleInputChange('outlookSchedule', e.target.value)}
                    >
                      <option value="등록안함">등록안함</option>
                      <option value="등록함">등록함</option>
                    </select>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.outlookDate}
                      min={todayDate}
                      max={maxDate}
                      onChange={(e) => handleDateInputChange('outlookDate', e.target.value)}
                      disabled={formData.outlookSchedule === '등록안함'}
                    />
                    <input
                      type="time"
                      className="form-input"
                      value={formData.outlookTime}
                      min={formData.outlookDate === todayDate ? nowTime : undefined}
                      onChange={(e) => handleTimeInputChange('outlookTime', e.target.value, formData.outlookDate)}
                      disabled={formData.outlookSchedule === '등록안함'}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-cancel" onClick={handleCancel} disabled={loading}>
              취소
            </button>
            <button type="submit" className="btn btn-submit" disabled={loading}>
              {loading ? '처리 중...' : isCompletionNotice ? '완료 공지 등록' : '등록'}
            </button>
          </div>
        </form>
      </div>

      {/* 서비스 모달 */}
      {showServiceModal && !isCompletionNotice && (
        <div className="modal-overlay" onClick={() => setShowServiceModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>서비스 선택</h3>
              <button onClick={() => setShowServiceModal(false)}>×</button>
            </div>
            <div className="modal-body modal-body-wide">
              <div className="selection-list">
                {services.map(service => (
                  <div
                    key={service.serviceId}
                    className={`selection-item ${selectedServiceIds.includes(service.serviceId) ? 'selected' : ''}`}
                    onClick={() => handleServiceToggle(service)}
                  >
                    <input type="checkbox" checked={selectedServiceIds.includes(service.serviceId)} readOnly />
                    <div className="selection-name">{service.serviceName}</div>
                    <div className="selection-category">{service.serviceCategory}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowServiceModal(false)} className="btn btn-submit">
                확인 ({selectedServiceIds.length}개)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 법인 모달 */}
      {showCorpModal && (
        <div className="modal-overlay" onClick={() => setShowCorpModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>법인 선택</h3>
              <button onClick={() => setShowCorpModal(false)}>×</button>
            </div>
            <div className="modal-body modal-body-wide">
              <div className="selection-list">
                {corporations.map(corp => (
                  <div
                    key={corp.corpId}
                    className={`selection-item ${selectedCorpIds.includes(corp.corpId) ? 'selected' : ''}`}
                    onClick={() => handleCorpToggle(corp)}
                  >
                    <input type="checkbox" checked={selectedCorpIds.includes(corp.corpId)} readOnly />
                    <div className="selection-name">{corp.corpName}</div>
                    <div className="selection-code">{corp.corpCode}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowCorpModal(false)} className="btn btn-submit">
                확인 ({selectedCorpIds.length}개)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 조직 모달 */}
      {showOrgModal && (
        <div className="modal-overlay" onClick={() => setShowOrgModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>부서 선택</h3>
              <button onClick={() => setShowOrgModal(false)}>×</button>
            </div>
            <div className="modal-body modal-body-wide">
              {selectedCorpIds.length > 0 && (
                <div className="filter-info">
                  🔍 선택한 법인의 부서만 표시됩니다 ({organizations.length}개)
                </div>
              )}
              <div className="selection-list">
                {organizations.map(org => (
                  <div
                    key={org.orgUnitId}
                    className={`selection-item ${selectedOrgIds.includes(org.orgUnitId) ? 'selected' : ''}`}
                    onClick={() => handleOrgToggle(org)}
                  >
                    <input type="checkbox" checked={selectedOrgIds.includes(org.orgUnitId)} readOnly />
                    <div className="selection-name">{org.orgUnitName}</div>
                    <div className="selection-corp">{org.corpName}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowOrgModal(false)} className="btn btn-submit">
                확인 ({selectedOrgIds.length}개)
              </button>
            </div>
          </div>
        </div>
      )}

      {showTemplateModal && (
        <div className="modal-overlay" onClick={() => setShowTemplateModal(false)}>
          <div className="modal-content modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>템플릿 관리</h3>
              <button onClick={() => setShowTemplateModal(false)}>×</button>
            </div>
            <div className="modal-body modal-body-wide">
              <div className="template-manager">
                <div className="template-list">
                  <div className="template-list-header">
                    <span>저장된 템플릿</span>
                    <button type="button" className="btn btn-cancel" onClick={resetTemplateDraft}>새 템플릿</button>
                  </div>
                  {templates.length === 0 && (
                    <p className="empty-message">저장된 템플릿이 없습니다.</p>
                  )}
                  {templates.map((template) => (
                    <div key={template.templateId} className="template-item">
                      <div className="template-name">{template.name}</div>
                      <div className="template-actions">
                        <button type="button" onClick={() => applyTemplate(template)}>사용</button>
                        <button type="button" onClick={() => startEditTemplate(template)}>수정</button>
                        <button type="button" onClick={() => removeTemplate(template.templateId)}>삭제</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="template-editor">
                  <label className="form-label">템플릿 이름</label>
                  <input
                    type="text"
                    className="form-input"
                    value={templateDraft.name}
                    onChange={(e) => setTemplateDraft(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="템플릿 이름을 입력하세요"
                  />
                  <label className="form-label">템플릿 내용</label>
                  <div className="template-editor-body">
                    <CKEditor
                      editor={NoticeEditor}
                      data={templateDraft.content}
                      onReady={(editor) => {
                        templateEditorRef.current = editor;
                        if (templateDraft.content) {
                          editor.setData(templateDraft.content);
                        }
                      }}
                      onChange={(event, editor) => setTemplateDraft(prev => ({ ...prev, content: editor.getData() }))}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-cancel" onClick={() => setShowTemplateModal(false)}>닫기</button>
              <button type="button" className="btn btn-submit" onClick={saveTemplate}>저장</button>
            </div>
          </div>
        </div>
      )}

      {showSignatureModal && (
        <div className="modal-overlay" onClick={() => setShowSignatureModal(false)}>
          <div className="modal-content modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>서명 관리</h3>
              <button onClick={() => setShowSignatureModal(false)}>×</button>
            </div>
            <div className="modal-body modal-body-wide">
              <div className="template-manager">
                <div className="template-list">
                  <div className="template-list-header">
                    <span>저장된 서명</span>
                    <button type="button" className="btn btn-cancel" onClick={resetSignatureDraft}>새 서명</button>
                  </div>
                  {signatures.length === 0 && (
                    <p className="empty-message">저장된 서명이 없습니다.</p>
                  )}
                  {signatures.map((signature) => (
                    <div key={signature.signatureId} className="template-item">
                      <div className="template-name">{signature.name}</div>
                      <div className="template-actions">
                        <button type="button" onClick={() => applySignatureToEditor(signature)}>삽입</button>
                        <button type="button" onClick={() => setDefaultSignatureById(signature)}>{signature.isDefault ? '기본' : '기본설정'}</button>
                        <button type="button" onClick={() => startEditSignature(signature)}>수정</button>
                        <button type="button" onClick={() => removeSignature(signature.signatureId)}>삭제</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="template-editor">
                  <label className="form-label">서명 이름</label>
                  <input
                    type="text"
                    className="form-input"
                    value={signatureDraft.name}
                    onChange={(e) => setSignatureDraft(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="서명 이름을 입력하세요"
                  />
                  <label className="form-label">서명 내용</label>
                  <div className="template-editor-body">
                    <CKEditor
                      editor={NoticeEditor}
                      data={signatureDraft.content}
                      onReady={(editor) => {
                        signatureEditorRef.current = editor;
                        if (signatureDraft.content) {
                          editor.setData(signatureDraft.content);
                        }
                      }}
                      onChange={(event, editor) => setSignatureDraft(prev => ({ ...prev, content: editor.getData() }))}
                    />
                  </div>
                  <div className="signature-upload-row">
                    <input
                      ref={signatureFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleSignatureImageUpload}
                    />
                    <button
                      type="button"
                      className="btn btn-cancel"
                      onClick={() => signatureFileInputRef.current?.click()}
                    >
                      이미지 업로드
                    </button>
                    <span className="signature-upload-hint">서명용 이미지(PNG/JPG)를 업로드하면 본문에 추가됩니다.</span>
                  </div>
                  <label className="signature-default-toggle">
                    <input
                      type="checkbox"
                      checked={signatureDraft.isDefault}
                      onChange={(e) => setSignatureDraft(prev => ({ ...prev, isDefault: e.target.checked }))}
                    />
                    기본 서명으로 설정
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-cancel" onClick={() => setShowSignatureModal(false)}>닫기</button>
              <button type="button" className="btn btn-submit" onClick={saveSignature}>저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeRegistration;
