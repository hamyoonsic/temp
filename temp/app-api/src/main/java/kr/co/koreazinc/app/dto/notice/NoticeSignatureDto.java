package kr.co.koreazinc.app.dto.notice;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoticeSignatureDto {
    private Long signatureId;
    private String userId;
    private String name;
    private String content;
    private Boolean isDefault;
}
