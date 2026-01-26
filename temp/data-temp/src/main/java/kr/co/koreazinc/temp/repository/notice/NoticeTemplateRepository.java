package kr.co.koreazinc.temp.repository.notice;

import kr.co.koreazinc.temp.model.entity.notice.NoticeTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoticeTemplateRepository extends JpaRepository<NoticeTemplate, Long> {
    List<NoticeTemplate> findByUserIdOrderByUpdatedAtDesc(String userId);
}
