package kr.co.koreazinc.app.dto.notice;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoticeTemplateDto {
    private Long templateId;
    private String userId;
    private String name;
    private String content;
}
