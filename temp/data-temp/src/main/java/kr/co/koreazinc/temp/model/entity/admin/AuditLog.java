package kr.co.koreazinc.temp.model.entity.admin;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * 감사 로그 엔티티
 * 위치: temp/data-temp/src/main/java/kr/co/koreazinc/temp/model/entity/admin/AuditLog.java
 */
@Entity
@Table(name = "audit_log")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long logId;
    
    @Column(name = "log_type", nullable = false, length = 50)
    private String logType;
    
    @Column(name = "action", nullable = false, length = 100)
    private String action;
    
    @Column(name = "target_type", length = 50)
    private String targetType;
    
    @Column(name = "target_id", length = 100)
    private String targetId;
    
    @Column(name = "user_id", nullable = false, length = 50)
    private String userId;
    
    @Column(name = "user_name", nullable = false, length = 100)
    private String userName;
    
    @Column(name = "ip_address", length = 45)
    private String ipAddress;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "old_value", columnDefinition = "TEXT")
    private String oldValue;
    
    @Column(name = "new_value", columnDefinition = "TEXT")
    private String newValue;
    
    @Column(name = "result", nullable = false, length = 20)
    private String result;  // SUCCESS, FAILURE
    
    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    /**
     * 로그 타입 상수
     */
    public static class LogType {
        public static final String ADMIN_DELEGATION = "ADMIN_DELEGATION";
        public static final String NOTICE_APPROVAL = "NOTICE_APPROVAL";
        public static final String NOTICE_CREATE = "NOTICE_CREATE";
        public static final String NOTICE_UPDATE = "NOTICE_UPDATE";
        public static final String NOTICE_DELETE = "NOTICE_DELETE";
        public static final String LOGIN = "LOGIN";
        public static final String LOGOUT = "LOGOUT";
    }
    
    /**
     * 액션 상수
     */
    public static class Action {
        public static final String CREATE = "CREATE";
        public static final String UPDATE = "UPDATE";
        public static final String DELETE = "DELETE";
        public static final String APPROVE = "APPROVE";
        public static final String REJECT = "REJECT";
        public static final String LOGIN = "LOGIN";
        public static final String LOGOUT = "LOGOUT";
    }
    
    /**
     * 결과 상수
     */
    public static class Result {
        public static final String SUCCESS = "SUCCESS";
        public static final String FAILURE = "FAILURE";
    }
}