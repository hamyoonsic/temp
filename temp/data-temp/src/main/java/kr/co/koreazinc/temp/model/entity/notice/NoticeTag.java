package kr.co.koreazinc.temp.model.entity.notice;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 공지 태그 엔티티 (해시태그)
 * 위치: temp/data-temp/src/main/java/kr/co/koreazinc/temp/model/entity/notice/NoticeTag.java
 */
@Entity
@Table(name = "notice_tag")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoticeTag {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tag_id")
    private Long tagId;
    
    @Column(name = "notice_id", nullable = false)
    private Long noticeId;
    
    @Column(name = "tag_value", nullable = false, length = 50)
    private String tagValue;
}
