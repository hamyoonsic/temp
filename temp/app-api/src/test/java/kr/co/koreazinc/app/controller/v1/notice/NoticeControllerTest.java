package kr.co.koreazinc.app.controller.v1.notice;

import static org.mockito.Mockito.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import kr.co.koreazinc.app.service.notice.NoticeResendService;
import kr.co.koreazinc.app.service.notice.NoticeService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(properties = "spring.profiles.active=test")
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class NoticeControllerTest {

    @MockBean private NoticeService noticeService;
    @MockBean private NoticeResendService noticeResendService;

    @Autowired private MockMvc mockMvc;

    @Test
    void createNotice_returns_200() throws Exception {
        String body = """
            {
              "title": "t1",
              "content": "c1"
            }
            """;

        when(noticeService.createNotice(any(), any())).thenReturn(1L);

        mockMvc.perform(post("/v1/api/notices")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
            .andExpect(status().isOk());
    }
}
