package kr.co.koreazinc.spring.http;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import jakarta.servlet.http.HttpServletRequest;

import org.junit.jupiter.api.Test;

import java.util.Collections;

class RequestWrapperTest {

    @Test
    void added_header_is_visible() {
        HttpServletRequest req = mock(HttpServletRequest.class);
        when(req.getHeaderNames()).thenReturn(Collections.emptyEnumeration());
        when(req.getHeaders(anyString())).thenReturn(Collections.emptyEnumeration());
        RequestWrapper wrapper = new RequestWrapper(req);

        wrapper.addHeader("X-Test", "v1");

        assertEquals("v1", wrapper.getHeader("X-Test"));
        assertTrue(wrapper.getHeaderNames().hasMoreElements());
    }
}
