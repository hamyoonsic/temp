package kr.co.koreazinc.app.controller.v1.notice;

import kr.co.koreazinc.app.dto.notice.ApiResponse;
import kr.co.koreazinc.temp.model.entity.notice.CorporationMaster;
import kr.co.koreazinc.temp.model.entity.notice.OrganizationMaster;
import kr.co.koreazinc.temp.model.entity.notice.ServiceMaster;
import kr.co.koreazinc.temp.repository.notice.CorporationMasterRepository;
import kr.co.koreazinc.temp.repository.notice.OrganizationMasterRepository;
import kr.co.koreazinc.temp.repository.notice.ServiceMasterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 마스터 데이터 Controller (법인/조직/서비스)
 * 위치: temp/app-api/src/main/java/kr/co/koreazinc/app/controller/v1/notice/MasterDataController.java
 */
@Slf4j
@RestController
@RequestMapping("/v1/api/master")
@RequiredArgsConstructor
public class MasterDataController {
    
    private final CorporationMasterRepository corporationMasterRepository;
    private final OrganizationMasterRepository organizationMasterRepository;
    private final ServiceMasterRepository serviceMasterRepository;
    
    /**
     * 법인 목록 조회
     * GET /v1/api/master/corporations
     */
    @GetMapping("/corporations")
    public ApiResponse<List<CorporationMaster>> getCorporations() {
        log.info("GET /v1/api/master/corporations - 법인 목록 조회");
        
        List<CorporationMaster> corporations = corporationMasterRepository
                .findByIsActiveTrueOrderByDisplayOrder();
        
        return ApiResponse.success(corporations);
    }
    
    /**
     * 조직/부서 목록 조회
     * GET /v1/api/master/organizations
     */
    @GetMapping("/organizations")
    public ApiResponse<List<OrganizationMaster>> getOrganizations(
            @RequestParam(required = false) Long corpId) {
        
        log.info("GET /v1/api/master/organizations - 조직 목록 조회 (corpId: {})", corpId);
        
        List<OrganizationMaster> organizations;
        
        if (corpId != null) {
            organizations = organizationMasterRepository
                    .findByCorpIdAndIsActiveTrueOrderByDisplayOrder(corpId);
        } else {
            organizations = organizationMasterRepository
                    .findByIsActiveTrueOrderByDisplayOrder();
        }
        
        return ApiResponse.success(organizations);
    }
    
    /**
     * 서비스 목록 조회
     * GET /v1/api/master/services
     */
    @GetMapping("/services")
    public ApiResponse<List<ServiceMaster>> getServices(
            @RequestParam(required = false) String category) {
        
        log.info("GET /v1/api/master/services - 서비스 목록 조회 (category: {})", category);
        
        List<ServiceMaster> services;
        
        if (category != null && !category.isEmpty()) {
            services = serviceMasterRepository
                    .findByServiceCategoryAndIsActiveTrueOrderByDisplayOrder(category);
        } else {
            services = serviceMasterRepository
                    .findByIsActiveTrueOrderByDisplayOrder();
        }
        
        return ApiResponse.success(services);
    }
}
