package kr.co.koreazinc.app.service.notice;

import kr.co.koreazinc.app.dto.notice.NoticeRegistrationDto;
import kr.co.koreazinc.app.dto.notice.NoticeResponseDto;
import kr.co.koreazinc.temp.model.entity.notice.*;
import kr.co.koreazinc.temp.repository.notice.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Predicate;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 공지 관리 Service
 * 위치: temp/app-api/src/main/java/kr/co/koreazinc/app/service/notice/NoticeService.java
 * 
 *  수정 내역:
 * - DashboardStats DTO 필드명을 프론트엔드와 일치하도록 변경
 * - pendingCount → pendingApprovalCount
 * - approvedCount → scheduledSendCount
 * - sentCount → completedSendCount
 * - failedCount → failedSendCount
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NoticeService {
    
    private final NoticeBaseRepository noticeBaseRepository;
    private final NoticeTargetRepository noticeTargetRepository;
    private final ServiceMasterRepository serviceMasterRepository;
    private final OrganizationMasterRepository organizationMasterRepository;
    private final CorporationMasterRepository corporationMasterRepository;
    private final NoticeSendPlanRepository noticeSendPlanRepository;
    private final NoticeMailService noticeMailService;
    private final OutlookCalendarService outlookCalendarService;

    
    /**
     * 공지 등록
     */
    @Transactional
    public Long createNotice(NoticeRegistrationDto dto, String userId) {
        log.info("Creating notice: {} by {}", dto.getTitle(), userId);
        
        // 1. NoticeBase 생성
        NoticeBase.NoticeBaseBuilder noticeBuilder = NoticeBase.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .noticeLevel(dto.getNoticeLevel())
                .noticeStatus("PENDING")  // ?????? ?????: ????? ?????
                .affectedServiceId(dto.getAffectedServiceId())
                .senderOrgUnitId(dto.getSenderOrgUnitId())
                .senderOrgUnitName(dto.getSenderOrgUnitName())
                .senderEmail(dto.getSenderEmail())
                .publishStartAt(dto.getPublishStartAt())
                .publishEndAt(dto.getPublishEndAt())
                .isMaintenance(dto.getIsMaintenance() != null ? dto.getIsMaintenance() : false)
                .isCompleted(false)
                .mailSubject(dto.getMailSubject())
                .createdBy(userId)
                .updatedBy(userId);

        if (dto.getOutlookCalendar() != null && Boolean.TRUE.equals(dto.getOutlookCalendar().getRegister())) {
            noticeBuilder.calendarRegister(true);
            noticeBuilder.calendarEventAt(dto.getOutlookCalendar().getEventDate());
        }

        NoticeBase notice = noticeBuilder.build();
        
        NoticeBase savedNotice = noticeBaseRepository.save(notice);
        
        // 2. 대상 저장
        if (dto.getTargets() != null && !dto.getTargets().isEmpty()) {
            List<NoticeTarget> targets = dto.getTargets().stream()
                    .map(targetDto -> {
                        String normalizedKey = normalizeTargetKey(
                                targetDto.getTargetType(),
                                targetDto.getTargetKey()
                        );
                        String normalizedName = targetDto.getTargetName();
                        if (normalizedName == null || normalizedName.isBlank()) {
                            normalizedName = resolveTargetName(
                                    targetDto.getTargetType(),
                                    normalizedKey
                            );
                        }

                        return NoticeTarget.builder()
                                .noticeId(savedNotice.getNoticeId())
                                .targetType(targetDto.getTargetType())
                                .targetKey(normalizedKey)
                                .targetName(normalizedName)
                                .build();
                    })
                    .collect(Collectors.toList());
            
            noticeTargetRepository.saveAll(targets);
        }

        // 3. ?????? ?????? ????
        if (dto.getSendPlan() != null) {
            NoticeRegistrationDto.SendPlanDto sendPlanDto = dto.getSendPlan();
            String sendMode = sendPlanDto.getSendMode() != null
                    ? sendPlanDto.getSendMode()
                    : NoticeSendPlan.SendMode.SCHEDULED;

            LocalDateTime scheduledAt = sendPlanDto.getScheduledSendAt();
            if (NoticeSendPlan.SendMode.IMMEDIATE.equals(sendMode)) {
                scheduledAt = LocalDateTime.now();
            }

            String bundleKey = null;
            if (scheduledAt != null && Boolean.TRUE.equals(sendPlanDto.getAllowBundle())) {
                bundleKey = scheduledAt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd-HH:mm"));
            }

            NoticeSendPlan sendPlan = NoticeSendPlan.builder()
                    .noticeId(savedNotice.getNoticeId())
                    .sendMode(sendMode)
                    .scheduledSendAt(scheduledAt)
                    .allowBundle(sendPlanDto.getAllowBundle() != null ? sendPlanDto.getAllowBundle() : true)
                    .bundleKey(bundleKey)
                    .build();

            noticeSendPlanRepository.save(sendPlan);
        }
        
        log.info("Notice created successfully. ID: {}", savedNotice.getNoticeId());
        return savedNotice.getNoticeId();
    }
    
    /**
     * 공지 목록 조회 (필터링)
     */
    @Transactional(readOnly = true)
    public Page<NoticeResponseDto> getNotices(
            String status,
            NoticeBase.NoticeLevel noticeLevel,
            Long serviceId,
            Long corpId,
            LocalDate startDate,
            LocalDate endDate,
            String search,
            Pageable pageable) {
        
        List<Long> corpNoticeIds = null;
        if (corpId != null) {
            List<String> corpTargetKeys = new ArrayList<>();
            corpTargetKeys.add(String.valueOf(corpId));

            List<String> orgTargetKeys = new ArrayList<>();

            List<OrganizationMaster> orgs =
                organizationMasterRepository.findByCorpIdAndIsActiveTrueOrderByDisplayOrder(corpId);
            for (OrganizationMaster org : orgs) {
                if (org.getOrgUnitId() != null) {
                    orgTargetKeys.add(String.valueOf(org.getOrgUnitId()));
                }
                if (org.getOrgUnitCode() != null && !org.getOrgUnitCode().isBlank()) {
                    orgTargetKeys.add(org.getOrgUnitCode());
                }
            }

            if (!corpTargetKeys.isEmpty() || !orgTargetKeys.isEmpty()) {
                Set<Long> noticeIdSet = new HashSet<>();
                List<NoticeTarget> corpTargets =
                    noticeTargetRepository.findByTargetTypeAndTargetKeyIn("CORP", corpTargetKeys);
                for (NoticeTarget target : corpTargets) {
                    noticeIdSet.add(target.getNoticeId());
                }

                if (!orgTargetKeys.isEmpty()) {
                    List<NoticeTarget> orgTargets =
                        noticeTargetRepository.findByTargetTypeAndTargetKeyIn("ORG_UNIT", orgTargetKeys);
                    for (NoticeTarget target : orgTargets) {
                        noticeIdSet.add(target.getNoticeId());
                    }
                }

                if (noticeIdSet.isEmpty()) {
                    return Page.empty(pageable);
                }
                corpNoticeIds = new ArrayList<>(noticeIdSet);
            }
        }

        final List<Long> corpNoticeIdsFinal = corpNoticeIds;
        Specification<NoticeBase> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            // 상태 필터
            if (status != null && !status.isEmpty()) {
                predicates.add(cb.equal(root.get("noticeStatus"), status));
            }
            
            // 중요도 필터
            if (noticeLevel != null) {
                predicates.add(cb.equal(root.get("noticeLevel"), noticeLevel));
            }
            
            // 서비스 필터
            if (corpNoticeIdsFinal != null) {
                predicates.add(root.get("noticeId").in(corpNoticeIdsFinal));
            }

            if (serviceId != null) {
                predicates.add(cb.equal(root.get("affectedServiceId"), serviceId));
            }
            
            // 날짜 범위 필터
            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(
                    root.get("createdAt"), 
                    startDate.atStartOfDay()
                ));
            }
            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(
                    root.get("createdAt"), 
                    endDate.atTime(23, 59, 59)
                ));
            }
            
            // 검색어 필터 (제목)
            if (search != null && !search.trim().isEmpty()) {
                predicates.add(cb.like(
                    cb.lower(root.get("title")), 
                    "%" + search.toLowerCase() + "%"
                ));
            }
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        
        Page<NoticeBase> noticePage = noticeBaseRepository.findAll(spec, pageable);
        List<NoticeBase> notices = noticePage.getContent();
        if (notices.isEmpty()) {
            return noticePage.map(this::convertToResponseDto);
        }

        List<Long> noticeIds = notices.stream()
                .map(NoticeBase::getNoticeId)
                .collect(Collectors.toList());

        Map<Long, List<NoticeResponseDto.TargetDto>> targetsByNoticeId = new HashMap<>();
        List<NoticeTarget> targets = noticeTargetRepository.findByNoticeIdIn(noticeIds);
        for (NoticeTarget target : targets) {
            NoticeResponseDto.TargetDto targetDto = NoticeResponseDto.TargetDto.builder()
                    .targetId(target.getTargetId())
                    .targetType(target.getTargetType())
                    .targetKey(target.getTargetKey())
                    .targetName(target.getTargetName())
                    .build();
            targetsByNoticeId
                    .computeIfAbsent(target.getNoticeId(), key -> new ArrayList<>())
                    .add(targetDto);
        }

        return noticePage.map(notice -> {
            NoticeResponseDto dto = convertToResponseDto(notice);
            List<NoticeResponseDto.TargetDto> noticeTargets =
                    targetsByNoticeId.getOrDefault(notice.getNoticeId(), new ArrayList<>());
            dto.setTargets(noticeTargets);
            return dto;
        });
    }
    
    /**
     * 공지 상세 조회
     */
    @Transactional(readOnly = true)
    public NoticeResponseDto getNoticeDetail(Long noticeId) {
        NoticeBase notice = noticeBaseRepository.findById(noticeId)
                .orElseThrow(() -> new RuntimeException("공지를 찾을 수 없습니다. ID: " + noticeId));
        
        return convertToResponseDtoWithDetails(notice);
    }

    /**
     * 공지 승인
     */
    @Transactional
    public void approveNotice(Long noticeId, String approver) {
        log.info("Approving notice: {} by {}", noticeId, approver);
        
        NoticeBase notice = noticeBaseRepository.findById(noticeId)
                .orElseThrow(() -> new RuntimeException("공지를 찾을 수 없습니다. ID: " + noticeId));
        
        // 승인 대기 상태인지 확인
        if (!"PENDING".equals(notice.getNoticeStatus())) {
            throw new RuntimeException("승인 대기 상태의 공지만 승인할 수 있습니다.");
        }
        
        // 상태를 APPROVED로 변경
        notice.setNoticeStatus("APPROVED");
        notice.setUpdatedBy(approver);
        
        noticeBaseRepository.save(notice);

        
        noticeSendPlanRepository.findByNoticeId(noticeId).ifPresent(plan -> {
            if (NoticeSendPlan.SendMode.IMMEDIATE.equals(plan.getSendMode())) {
                noticeMailService.sendNoticeEmail(noticeId);
                noticeSendPlanRepository.delete(plan);
            }
        });

        
        // if (Boolean.TRUE.equals(notice.getCalendarRegister()) && notice.getCalendarEventAt() != null) {
        //     LocalDateTime eventStartAt = notice.getCalendarEventAt();
        //     LocalDateTime eventEndAt = eventStartAt.plusHours(1);
        //     outlookCalendarService.createCalendarEvent(noticeId, eventStartAt, eventEndAt);
        // }

        log.info("Notice approved successfully. ID: {}", noticeId);
    }
    
    /**
     * 공지 반려
     */
    @Transactional
    public void rejectNotice(Long noticeId, String reason, String rejector) {
        log.info("Rejecting notice: {} by {} - reason: {}", noticeId, rejector, reason);
        
        NoticeBase notice = noticeBaseRepository.findById(noticeId)
                .orElseThrow(() -> new RuntimeException("공지를 찾을 수 없습니다. ID: " + noticeId));
        
        // 승인 대기 상태인지 확인
        if (!"PENDING".equals(notice.getNoticeStatus())) {
            throw new RuntimeException("승인 대기 상태의 공지만 반려할 수 있습니다.");
        }
        
        // 상태를 REJECTED로 변경
        notice.setNoticeStatus("REJECTED");
        notice.setRejectReason(reason);
        notice.setUpdatedBy(rejector);
        
        noticeBaseRepository.save(notice);
        
        log.info("Notice rejected successfully. ID: {}", noticeId);
    }
    
    /**
     * Entity -> DTO 변환 (기본)
     */
    private NoticeResponseDto convertToResponseDto(NoticeBase notice) {
        NoticeResponseDto.NoticeResponseDtoBuilder builder = NoticeResponseDto.builder()
                .noticeId(notice.getNoticeId())
                .title(notice.getTitle())
                .content(notice.getContent())
                .noticeLevel(notice.getNoticeLevel())
                .noticeStatus(notice.getNoticeStatus())
                .affectedServiceId(notice.getAffectedServiceId())
                .senderOrgUnitId(notice.getSenderOrgUnitId())
                .senderOrgUnitName(notice.getSenderOrgUnitName())
                .publishStartAt(notice.getPublishStartAt())
                .publishEndAt(notice.getPublishEndAt())
                .isMaintenance(notice.getIsMaintenance())
                .isCompleted(notice.getIsCompleted())
                .completedAt(notice.getCompletedAt())
                .mailSubject(notice.getMailSubject())
                .rejectReason(notice.getRejectReason())
                .createdAt(notice.getCreatedAt())
                .createdBy(notice.getCreatedBy())
                .updatedAt(notice.getUpdatedAt())
                .updatedBy(notice.getUpdatedBy())
                .parentNoticeId(notice.getParentNoticeId());
        
        // 서비스 정보 추가
        if (notice.getAffectedServiceId() != null) {
            serviceMasterRepository.findById(notice.getAffectedServiceId())
                    .ifPresent(service -> builder.affectedService(
                            NoticeResponseDto.ServiceDto.builder()
                                    .serviceId(service.getServiceId())
                                    .serviceCode(service.getServiceCode())
                                    .serviceName(service.getServiceName())
                                    .serviceCategory(service.getServiceCategory())
                                    .build()
                    ));
        }
        
        return builder.build();
    }
    
    /**
     * Entity -> DTO 변환 (상세 - 대상/태그 포함)
     */
    private NoticeResponseDto convertToResponseDtoWithDetails(NoticeBase notice) {
        NoticeResponseDto dto = convertToResponseDto(notice);
        
        // 대상 정보 추가
        List<NoticeTarget> targets = noticeTargetRepository.findByNoticeId(notice.getNoticeId());
        dto.setTargets(targets.stream()
                .map(target -> {
                    String targetName = target.getTargetName();
                    if ("ORG_UNIT".equals(target.getTargetType())
                            && target.getTargetKey() != null) {
                        targetName = resolveTargetName(
                                target.getTargetType(),
                                target.getTargetKey()
                        );
                    } else if ((targetName == null || targetName.isBlank())
                            && target.getTargetKey() != null) {
                        targetName = resolveTargetName(
                                target.getTargetType(),
                                target.getTargetKey()
                        );
                    }

                    return NoticeResponseDto.TargetDto.builder()
                            .targetId(target.getTargetId())
                            .targetType(target.getTargetType())
                            .targetKey(target.getTargetKey())
                            .targetName(targetName)
                            .build();
                })
                .collect(Collectors.toList()));
        
        return dto;
    }

    private String normalizeTargetKey(String targetType, String targetKey) {
        if (targetType == null || targetKey == null || targetKey.isBlank()) {
            return targetKey;
        }

        try {
            Long.parseLong(targetKey);
            return targetKey;
        } catch (NumberFormatException ignored) {
            // keep going for code lookups
        }

        if ("CORP".equals(targetType)) {
            return corporationMasterRepository.findByCorpCode(targetKey)
                    .map(CorporationMaster::getCorpId)
                    .map(String::valueOf)
                    .orElse(targetKey);
        }

        if ("ORG_UNIT".equals(targetType)) {
            return organizationMasterRepository.findByOrgUnitCode(targetKey)
                    .map(OrganizationMaster::getOrgUnitId)
                    .map(String::valueOf)
                    .orElse(targetKey);
        }

        return targetKey;
    }

    private String resolveTargetName(String targetType, String targetKey) {
        if (targetType == null || targetKey == null || targetKey.isBlank()) {
            return null;
        }

        if ("CORP".equals(targetType)) {
            try {
                Long corpId = Long.parseLong(targetKey);
                return corporationMasterRepository.findById(corpId)
                        .map(CorporationMaster::getCorpName)
                        .orElse(null);
            } catch (NumberFormatException ignored) {
                return corporationMasterRepository.findByCorpCode(targetKey)
                        .map(CorporationMaster::getCorpName)
                        .orElse(null);
            }
        }

        if ("ORG_UNIT".equals(targetType)) {
            OrganizationMaster org = null;
            try {
                Long orgUnitId = Long.parseLong(targetKey);
                org = organizationMasterRepository.findById(orgUnitId).orElse(null);
            } catch (NumberFormatException ignored) {
                org = organizationMasterRepository.findByOrgUnitCode(targetKey).orElse(null);
            }

            if (org == null) {
                return null;
            }

            String orgName = org.getOrgUnitName();
            String corpName = corporationMasterRepository.findById(org.getCorpId())
                    .map(CorporationMaster::getCorpName)
                    .orElse(null);
            return corpName != null ? corpName + " / " + orgName : orgName;
        }

        return null;
    }
    
    /**
     *  수정: 대시보드용 통계 조회 - 프론트엔드 필드명과 일치
     */
    @Transactional(readOnly = true)
    public DashboardStats getDashboardStats() {
        // null 안전 처리 추가
        Long pendingCount = noticeBaseRepository.countByNoticeStatus("PENDING");
        Long approvedCount = noticeBaseRepository.countByNoticeStatus("APPROVED");
        Long sentCount = noticeBaseRepository.countByNoticeStatus("SENT");
        Long failedCount = noticeBaseRepository.countByNoticeStatus("FAILED");
        
        return DashboardStats.builder()
                .pendingApprovalCount(pendingCount != null ? pendingCount : 0L)
                .scheduledSendCount(approvedCount != null ? approvedCount : 0L)
                .completedSendCount(sentCount != null ? sentCount : 0L)
                .failedSendCount(failedCount != null ? failedCount : 0L)
                .build();
    }
    
    /**
     *  수정: 대시보드 통계 DTO - 프론트엔드와 일치하는 필드명
     */
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class DashboardStats {
        private Long pendingApprovalCount;  // PENDING 상태 (승인 대기)
        private Long scheduledSendCount;    // APPROVED 상태 (발송 예정)
        private Long completedSendCount;    // SENT 상태 (발송 완료)
        private Long failedSendCount;       // FAILED 상태 (발송 실패)
    }
}
