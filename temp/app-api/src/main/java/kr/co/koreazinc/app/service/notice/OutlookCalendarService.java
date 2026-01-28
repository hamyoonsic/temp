
package kr.co.koreazinc.app.service.notice;

import kr.co.koreazinc.app.configuration.MailTestProperty;
import kr.co.koreazinc.spring.security.property.OAuth2Property;
import kr.co.koreazinc.spring.utility.OAuthUtils;
import kr.co.koreazinc.temp.model.entity.notice.*;
import kr.co.koreazinc.temp.repository.notice.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Outlook calendar integration service (test mode supported).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OutlookCalendarService {

    private final NoticeBaseRepository noticeBaseRepository;
    private final NoticeCalendarEventRepository calendarEventRepository;
    private final UserMasterRepository userMasterRepository;
    private final NoticeRecipientRepository noticeRecipientRepository;

    private final OAuth2Property oauth2Property;
    private final MailTestProperty mailTestProperty;

    private static final String GRAPH_API_BASE = "https://graph.microsoft.com/v1.0";
    private static final String NOTICE_CALENDAR_NAME = "NoticeCalendar";
    private static final int PROVIDER_EVENT_ID_MAX = 120;

    /**
     * Create outlook calendar event.
     */
    @Transactional
    public String createCalendarEvent(Long noticeId, LocalDateTime eventStartAt, LocalDateTime eventEndAt) {
        log.info("Outlook calendar event create: noticeId={}", noticeId);

        try {
            NoticeBase notice = noticeBaseRepository.findById(noticeId)
                .orElseThrow(() -> new RuntimeException("Notice not found: " + noticeId));

            List<String> attendeeEmails = getAttendeeEmails(noticeId);
            if (attendeeEmails.isEmpty()) {
                log.warn("No attendees for calendar event: noticeId={}", noticeId);
                return null;
            }

            String token = null;
            if (!mailTestProperty.getCalendarTestMode()) {
                OAuth2Property.Credential microsoftCredential = oauth2Property.getCredential("microsoft");
                token = OAuthUtils.issuedToken(
                    microsoftCredential.getTokenUrl(),
                    microsoftCredential.getClientId(),
                    microsoftCredential.getClientSecret(),
                    microsoftCredential.getScope()
                );
            }

            String lastEventId = null;
            for (String mailboxEmail : attendeeEmails) {
                if (calendarEventRepository.findByNoticeIdAndResourceMailbox(noticeId, mailboxEmail).isPresent()) {
                    continue;
                }

                Map<String, Object> eventBody = buildEventRequestBody(notice, eventStartAt, eventEndAt, List.of());
                String eventId;

                if (mailTestProperty.getCalendarTestMode()) {
                    logCalendarEventForTest(notice, eventStartAt, eventEndAt, List.of(mailboxEmail), mailboxEmail, eventBody);
                    eventId = "TEST_EVENT_" + UUID.randomUUID();
                } else {
                    String calendarId = getOrCreateNoticeCalendarId(mailboxEmail, token);
                    Map<String, Object> response = WebClient.builder()
                        .baseUrl(GRAPH_API_BASE)
                        .build()
                        .post()
                        .uri("/users/" + mailboxEmail + "/calendars/" + calendarId + "/events")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(eventBody)
                        .retrieve()
                        .bodyToMono(Map.class)
                        .block();

                    eventId = response != null ? (String) response.get("id") : null;
                    log.info("Calendar event created: mailbox={}", mailboxEmail);
                }

                NoticeCalendarEvent calendarEvent = NoticeCalendarEvent.builder()
                    .noticeId(noticeId)
                    .eventSubject(notice.getTitle())
                    .eventBody(notice.getContent())
                    .eventStartAt(eventStartAt)
                    .eventEndAt(eventEndAt)
                    .attendees(String.join(";", attendeeEmails))
                    .resourceMailbox(mailboxEmail)
                    .providerEventId(truncateProviderEventId(eventId))
                    .build();

                calendarEventRepository.save(calendarEvent);
                lastEventId = eventId;
            }

            return lastEventId;

        } catch (Exception e) {
            log.warn("Outlook calendar event create failed: noticeId={}, error={}", noticeId, e.getMessage(), e);
            return null;
        }
    }

    @SuppressWarnings("unchecked")
    private String getOrCreateNoticeCalendarId(String mailboxEmail, String token) {
        Map<String, Object> response = WebClient.builder()
            .baseUrl(GRAPH_API_BASE)
            .build()
            .get()
            .uri(uriBuilder -> uriBuilder
                .path("/users/{mailbox}/calendars")
                .queryParam("$filter", "name eq '" + NOTICE_CALENDAR_NAME + "'")
                .build(mailboxEmail))
            .header("Authorization", "Bearer " + token)
            .retrieve()
            .bodyToMono(Map.class)
            .block();

        if (response != null) {
            Object value = response.get("value");
            if (value instanceof List<?> calendars && !calendars.isEmpty()) {
                Object first = calendars.get(0);
                if (first instanceof Map<?, ?> calendar) {
                    Object id = calendar.get("id");
                    if (id != null) {
                        return String.valueOf(id);
                    }
                }
            }
        }

        Map<String, Object> calendarBody = new HashMap<>();
        calendarBody.put("name", NOTICE_CALENDAR_NAME);

        Map<String, Object> created = WebClient.builder()
            .baseUrl(GRAPH_API_BASE)
            .build()
            .post()
            .uri("/users/" + mailboxEmail + "/calendars")
            .header("Authorization", "Bearer " + token)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(calendarBody)
            .retrieve()
            .bodyToMono(Map.class)
            .block();

        if (created == null || created.get("id") == null) {
            throw new RuntimeException("Calendar create failed for mailbox: " + mailboxEmail);
        }

        return String.valueOf(created.get("id"));
    }

    private void logCalendarEventForTest(
            NoticeBase notice,
            LocalDateTime startAt,
            LocalDateTime endAt,
            List<String> attendeeEmails,
            String senderEmail,
            Map<String, Object> eventBody) {

        log.info("[CALENDAR TEST] NoticeId={}, subject={}, sender={}, attendees={}",
            notice.getNoticeId(), notice.getTitle(), senderEmail, attendeeEmails.size());
        log.info("[CALENDAR TEST] Start={}, End={}", formatDateTime(startAt), formatDateTime(endAt));
    }

    private Map<String, Object> buildEventRequestBody(
            NoticeBase notice,
            LocalDateTime startAt,
            LocalDateTime endAt,
            List<String> attendeeEmails) {

        Map<String, Object> event = new HashMap<>();
        event.put("subject", notice.getTitle());

        Map<String, Object> body = new HashMap<>();
        body.put("contentType", "HTML");
        body.put("content", buildEventHtmlContent(notice));
        event.put("body", body);

        Map<String, Object> start = new HashMap<>();
        start.put("dateTime", formatDateTime(startAt));
        start.put("timeZone", "Asia/Seoul");
        event.put("start", start);

        Map<String, Object> end = new HashMap<>();
        end.put("dateTime", formatDateTime(endAt));
        end.put("timeZone", "Asia/Seoul");
        event.put("end", end);

        event.put("attendees", buildAttendees(attendeeEmails));
        event.put("isReminderOn", true);
        event.put("reminderMinutesBeforeStart", 15);

        return event;
    }

    private List<Map<String, Object>> buildAttendees(List<String> attendeeEmails) {
        return attendeeEmails.stream()
            .map(email -> {
                Map<String, Object> attendee = new HashMap<>();
                Map<String, Object> emailAddress = new HashMap<>();
                emailAddress.put("address", email);
                attendee.put("emailAddress", emailAddress);
                attendee.put("type", "required");
                return attendee;
            })
            .collect(Collectors.toList());
    }

    private String buildEventHtmlContent(NoticeBase notice) {
        StringBuilder html = new StringBuilder();
        html.append("<html><body>");
        html.append("<h3>").append(escapeHtml(notice.getTitle())).append("</h3>");
        html.append("<div>");
        html.append(notice.getContent().replace("\n", "<br>"));
        html.append("</div>");
        html.append("</body></html>");
        return html.toString();
    }

    private List<String> getAttendeeEmails(Long noticeId) {
        List<NoticeRecipient> recipients = noticeRecipientRepository.findByNoticeIdOrderByCreatedAtAsc(noticeId);
        Set<String> emails = recipients.stream()
            .map(NoticeRecipient::getUserId)
            .map(this::getUserEmail)
            .filter(Objects::nonNull)
            .filter(email -> !email.isBlank())
            .collect(Collectors.toCollection(LinkedHashSet::new));

        log.info("Calendar attendees resolved (mail recipients): noticeId={}, count={}", noticeId, emails.size());
        return new ArrayList<>(emails);
    }

    private String getUserEmail(String userId) {
        return userMasterRepository.findById(userId)
            .map(UserMaster::getEmail)
            .orElse(null);
    }

    private Set<String> extractEmails(List<UserMaster> users) {
        return users.stream()
            .map(UserMaster::getEmail)
            .filter(Objects::nonNull)
            .filter(email -> !email.isBlank())
            .collect(Collectors.toSet());
    }

    private String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;")
                   .replace("<", "&lt;")
                   .replace(">", "&gt;")
                   .replace("\"", "&quot;")
                   .replace("'", "&#x27;");
    }

    private String formatDateTime(LocalDateTime dateTime) {
        return dateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
    }

    private String truncateProviderEventId(String eventId) {
        if (eventId == null) return null;
        if (eventId.length() <= PROVIDER_EVENT_ID_MAX) return eventId;
        return eventId.substring(0, PROVIDER_EVENT_ID_MAX);
    }
}
