package kr.co.koreazinc.temp.repository.notice;

import kr.co.koreazinc.temp.model.entity.notice.NoticeSignature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface NoticeSignatureRepository extends JpaRepository<NoticeSignature, Long> {
    List<NoticeSignature> findByUserIdOrderByUpdatedAtDesc(String userId);

    Optional<NoticeSignature> findByUserIdAndIsDefaultTrue(String userId);

    @Modifying
    @Query("update NoticeSignature s set s.isDefault = false where s.userId = :userId")
    int clearDefaultByUserId(@Param("userId") String userId);
}
