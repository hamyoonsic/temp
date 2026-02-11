package kr.co.koreazinc.spring.http.util;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import jakarta.servlet.RequestDispatcher;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = kr.co.koreazinc.spring.ApplicationContextHolder.class)
class ErrorResponseTest {

    @Test
    void errorId_is_generated_when_missing() {
        Map<String, Object> attrs = new HashMap<>();
        attrs.put(RequestDispatcher.ERROR_STATUS_CODE, HttpStatus.INTERNAL_SERVER_ERROR.value());
        attrs.put(RequestDispatcher.ERROR_REQUEST_URI, "/api/test");

        ErrorResponse resp = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .path("/api/test")
            .exception(attrs, new RuntimeException("boom"))
            .build();

        assertNotNull(resp.getErrorId(), "errorId should be generated when missing in attributes");
        assertNull(resp.getTrace(), "trace must be null by default");
    }

    @Test
    void trace_included_when_showTrace_true() {
        Map<String, Object> attrs = new HashMap<>();
        attrs.put(RequestDispatcher.ERROR_STATUS_CODE, HttpStatus.INTERNAL_SERVER_ERROR.value());
        attrs.put(RequestDispatcher.ERROR_REQUEST_URI, "/api/test");
        attrs.put("showTrace", Boolean.TRUE);

        ErrorResponse resp = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .path("/api/test")
            .exception(attrs, new RuntimeException("boom"))
            .build();

        assertNotNull(resp.getTrace(), "trace must be present when showTrace attribute is true");
    }
}
