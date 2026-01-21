package kr.co.koreazinc.app.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 관리자 사용자 정보 DTO
 * 위치: temp/app-api/src/main/java/kr/co/koreazinc/app/dto/admin/AdminUserDto.java
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserDto {
    private String userId;
    private String userKoNm;
    private String userEnNm;
    private String email;
    private String deptCd;
    private String deptNm;
    private String coCd;
    private String coNm;
    private String ttlCd;
    private String ttlNm;
    private String posCd;
    private String posNm;
    private Boolean isCurrentUser;  // 현재 로그인한 사용자 여부
}