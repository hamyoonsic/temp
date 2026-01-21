package kr.co.koreazinc.temp.repository.notice;

import kr.co.koreazinc.temp.model.entity.notice.NoticeAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 공지 첨부파일 Repository
 * 위치: temp/data-temp/src/main/java/kr/co/koreazinc/temp/repository/notice/NoticeAttachmentRepository.java
 */
@Repository
public interface NoticeAttachmentRepository extends JpaRepository<NoticeAttachment, Long> {
    
    /**
     * 공지 ID로 첨부파일 목록 조회
     */
    List<NoticeAttachment> findByNoticeIdOrderByUploadedAtAsc(Long noticeId);
    
    /**
     * 공지 ID로 첨부파일 삭제
     */
    void deleteByNoticeId(Long noticeId);
}