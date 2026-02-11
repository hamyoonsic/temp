package kr.co.koreazinc.app.integration;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import kr.co.koreazinc.temp.model.entity.notice.NoticeBase;
import kr.co.koreazinc.temp.model.entity.notice.NoticeDeliveryLog;
import kr.co.koreazinc.temp.model.entity.notice.NoticeRecipient;
import kr.co.koreazinc.temp.model.entity.notice.UserMaster;
import kr.co.koreazinc.temp.repository.notice.NoticeBaseRepository;
import kr.co.koreazinc.temp.repository.notice.NoticeDeliveryLogRepository;
import kr.co.koreazinc.temp.repository.notice.NoticeRecipientRepository;
import kr.co.koreazinc.temp.repository.notice.NoticeSendPlanRepository;
import kr.co.koreazinc.temp.repository.notice.NoticeTargetRepository;
import kr.co.koreazinc.temp.repository.notice.UserMasterRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

@SpringBootTest(properties = "spring.profiles.active=test")
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class NoticeApiIntegrationTest {

    @Autowired private MockMvc mockMvc;

    @Autowired private NoticeBaseRepository noticeBaseRepository;
    @Autowired private NoticeTargetRepository noticeTargetRepository;
    @Autowired private NoticeSendPlanRepository noticeSendPlanRepository;
    @Autowired private NoticeDeliveryLogRepository noticeDeliveryLogRepository;
    @Autowired private NoticeRecipientRepository noticeRecipientRepository;
    @Autowired private UserMasterRepository userMasterRepository;

    @BeforeEach
    void clean() {
        noticeRecipientRepository.deleteAll();
        noticeDeliveryLogRepository.deleteAll();
        noticeSendPlanRepository.deleteAll();
        noticeTargetRepository.deleteAll();
        noticeBaseRepository.deleteAll();
        userMasterRepository.deleteAll();
    }

    @Test
    void create_approve_send_flow() throws Exception {
        UserMaster user = UserMaster.builder()
            .userId("user1")
            .userKoNm("User")
            .email("user1@test.local")
            .isActive(true)
            .build();
        userMasterRepository.save(user);

        String body = """
            {
              "title": "notice-title",
              "content": "notice-content",
              "noticeLevel": "L1",
              "createdBy": "user1",
              "targets": [
                {"targetType":"USER","targetKey":"user1","targetName":"User One"}
              ],
              "sendPlan": {
                "sendMode": "IMMEDIATE",
                "allowBundle": false
              }
            }
            """;

        String response = mockMvc.perform(post("/v1/api/notices")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andReturn()
            .getResponse()
            .getContentAsString();

        Number noticeIdValue = JsonPath.read(response, "$.data.noticeId");
        Long noticeId = noticeIdValue.longValue();

        mockMvc.perform(post("/v1/api/notices/" + noticeId + "/approve")
                .header("X-User-Id", "approver"))
            .andExpect(status().isOk());

        NoticeBase notice = noticeBaseRepository.findById(noticeId).orElseThrow();
        assertEquals("SENT", notice.getNoticeStatus());

        List<NoticeRecipient> recipients = noticeRecipientRepository.findByNoticeIdOrderByCreatedAtAsc(noticeId);
        assertFalse(recipients.isEmpty());

        List<NoticeDeliveryLog> logs = noticeDeliveryLogRepository.findByNoticeIdOrderByDeliveryIdDesc(noticeId);
        assertFalse(logs.isEmpty());
    }
}
