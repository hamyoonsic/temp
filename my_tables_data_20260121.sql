--
-- PostgreSQL database dump
--

\restrict D5zwdQsQF9NoQugIgBy33ZOaJptm7W5uVf92E8NkUv8AqvqqlqXANCLNf3MLRIG

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: admin_delegation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_delegation (delegation_id, delegator_user_id, delegator_user_nm, delegate_user_id, delegate_user_nm, start_date, end_date, reason, is_active, created_at, created_by, updated_at, updated_by) FROM stdin;
1	hamyoonsic	함윤식	park001	박경민	2026-01-21 09:00:00	2026-01-31 18:00:00	출장으로 인한 임시 권한 위임	t	2026-01-21 09:58:37.721198	hamyoonsic	2026-01-21 09:58:37.721198	hamyoonsic
\.


--
-- Data for Name: audit_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_log (log_id, log_type, action, target_type, target_id, user_id, user_name, ip_address, description, old_value, new_value, result, error_message, created_at) FROM stdin;
1	ADMIN_DELEGATION	CREATE	DELEGATION	1	hamyoonsic	함윤식	192.168.1.100	관리자 권한 위임: 함윤식 → 박경민 (2026-01-21 ~ 2026-01-31)	\N	\N	SUCCESS	\N	2026-01-21 09:58:47.614025
2	NOTICE_APPROVAL	APPROVE	NOTICE	1	park001	박경민	192.168.1.101	공지 ID 1번 승인 처리 (대리 관리자)	\N	\N	SUCCESS	\N	2026-01-21 09:58:47.614025
\.


--
-- Data for Name: corporation_master; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.corporation_master (corp_id, corp_code, corp_name, parent_corp_id, business_number, is_active, display_order, created_at, updated_at) FROM stdin;
1	KZ	고려아연	\N	123-45-67890	t	1	2026-01-12 14:40:12.59047	2026-01-12 14:40:12.59047
2	KZGT	케이지그린텍	1	123-45-67891	t	2	2026-01-12 14:40:12.59047	2026-01-12 14:40:12.59047
3	YP	영풍	\N	123-45-67892	t	3	2026-01-12 14:40:12.59047	2026-01-12 14:40:12.59047
4	KZMS	고려아연메탈서플라이	1	123-45-67893	t	4	2026-01-12 14:40:12.59047	2026-01-12 14:40:12.59047
\.


--
-- Data for Name: service_master; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.service_master (service_id, service_code, service_name, service_category, owner_org_unit_id, contact_info, is_active, display_order, created_at, updated_at) FROM stdin;
1	ERP	고려아연 ERP	업무시스템	ITH3	02-1234-5678	t	1	2026-01-12 14:40:12.59047	2026-01-12 14:40:12.59047
2	GROUPWARE	KZ 이음	업무시스템	ITH3	02-1234-5679	t	2	2026-01-12 14:40:12.59047	2026-01-12 14:40:12.59047
3	MAIL	Outlook 메일	인프라	ITH1	02-1234-5680	t	3	2026-01-12 14:40:12.59047	2026-01-12 14:40:12.59047
4	VPN	VPN 시스템	보안	ITH2	02-1234-5681	t	4	2026-01-12 14:40:12.59047	2026-01-12 14:40:12.59047
5	ACCOUNTING	고려아연 연결회계	업무시스템	ITH1	02-1234-5682	t	5	2026-01-12 14:40:12.59047	2026-01-12 14:40:12.59047
6	HR	인사급여 시스템	업무시스템	ITH3	02-1234-5683	t	6	2026-01-12 14:40:12.59047	2026-01-12 14:40:12.59047
\.


--
-- Data for Name: notice_base; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notice_base (notice_id, title, content, notice_level, notice_status, affected_service_id, sender_org_unit_id, sender_org_unit_name, publish_start_at, publish_end_at, is_maintenance, is_completed, completed_at, mail_subject, created_at, created_by, updated_at, updated_by, parent_notice_id, calendar_register, calendar_event_at, sender_email) FROM stdin;
1	고려아연 ERP 시스템 점검 안내	고려아연 ERP 시스템 점검으로 인하여 22일(수) 18:00시 부터 시스템 사용이 불가합니다.\r\n업무에 참고하여 주시기 바랍니다.\r\n\r\n문의 : 서린정보기술 ITH3팀 박경민 수석 (2656)	L2	APPROVED	1	ITH3	서린정보기술 ITH3팀	2025-10-22 08:00:00	2025-10-22 19:00:00	t	f	\N	[점검] 고려아연 ERP 시스템 점검 안내	2026-01-12 14:40:12.59047	park001	2026-01-12 14:40:12.59047	park001	\N	f	\N	\N
2	윈도우 보안 패치 작업 안내	윈도우 보안 패치 적용을 위해 전사 PC 재부팅이 필요합니다.\r\n금일 18:00 이후 자동 재부팅 예정이오니 작업 중인 파일은 미리 저장해주시기 바랍니다.\r\n\r\n문의 : 서린정보기술 ITH3팀 전종하 책임 (2657)	L1	SENT	\N	ITH3	서린정보기술 ITH3팀	2025-10-15 08:00:00	2025-10-15 19:00:00	f	t	\N	[보안] 윈도우 보안 패치 작업 안내	2026-01-12 14:40:12.59047	jeon001	2026-01-12 14:40:12.59047	jeon001	\N	f	\N	\N
3	고려아연 연결회계 시스템 장애 발생 안내	고려아연 연결회계 시스템에 장애가 발생하여 현재 접속이 불가합니다.\r\n복구 작업 진행 중이며, 완료 시 별도 안내드리겠습니다.\r\n\r\n문의 : 서린정보기술 ITH1팀 신호용 책임 (2655)	L3	COMPLETED	5	ITH1	서린정보기술 ITH1팀	2025-10-10 14:30:00	2025-10-10 16:00:00	t	t	2025-10-10 15:45:00	[긴급장애] 고려아연 연결회계 시스템 장애 발생	2026-01-12 14:40:12.59047	shin001	2026-01-12 14:40:12.59047	shin001	\N	f	\N	\N
4	테스트 공지	<p>테스트 내용</p>	L2	REJECTED	1	park001	서린정보기술 ITH3팀	2026-01-14 11:25:06.203301	\N	t	f	\N	테스트 메일 제목	2026-01-14 11:25:06.203301	park001	2026-01-14 11:25:38.021578	admin001	\N	f	\N	\N
6	보안 관련 긴급 공지	<p>보안 관련 긴급 공지 입니다.</p><p>&nbsp;</p><p>점검 전까지 서비스 이용 불가능 합니다.</p>	L3	APPROVED	1	park001	서린정보기술 ITH3팀	2026-01-22 08:30:00	\N	t	f	\N	보안 관련 긴급 공지	2026-01-16 14:31:28.480052	park001	2026-01-21 08:39:45.128665	admin	\N	f	\N	\N
7	공지관리 시스템 테스트 메일 발송 안내	<p>공지관리 시스템 테스트 메일 발송입니다.</p>	L2	APPROVED	1	\N	IT개발팀	2026-01-21 08:30:00	\N	f	f	\N	공지관리 시스템 테스트 메일 발송 안내	2026-01-21 17:41:33.210343	hamyoonsic	2026-01-21 17:41:54.56807	admin	\N	f	\N	\N
5	2월 15일 긴급 서버 점검	<p>2월 15일 긴급 서버 점검 안내 입니다.</p>	L2	SENT	1	park001	서린정보기술 ITH3팀	2026-01-16 08:30:00	\N	t	f	\N	2월 15일 긴급 서버 점검	2026-01-15 15:34:29.027067	park001	2026-01-21 18:02:00.995095	admin001	\N	f	\N	\N
8	공지관리 시스템 테스트 메일 발송 안내	<p>공지관리 시스템 테스트 메일 발송 안내</p>	L2	APPROVED	1	\N	IT개발팀	2026-01-21 08:30:00	\N	t	f	\N	공지관리 시스템 테스트 메일 발송 안내	2026-01-21 18:03:33.569609	hamyoonsic	2026-01-21 18:05:35.24486	admin	\N	f	\N	\N
9	원료팀 ERP 서버점검 공지	<p>원료가 부족합니다. 점검합니다.</p>	L2	SENT	1	\N	IT개발팀	2026-01-21 08:30:00	\N	t	f	\N	원료팀 ERP 서버점검 공지	2026-01-21 18:17:14.413218	hamyoonsic	2026-01-21 18:17:51.464187	admin	\N	f	\N	hamyoonsic@koreazinc.co.kr
\.


--
-- Data for Name: notice_approval; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notice_approval (approval_id, notice_id, approval_status, approver_user_id, approver_name, requested_at, decided_at, reject_reason) FROM stdin;
\.


--
-- Data for Name: notice_attachment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notice_attachment (attachment_id, notice_id, file_name, file_original_name, file_path, file_size, file_type, uploaded_by, uploaded_at) FROM stdin;
\.


--
-- Data for Name: notice_calendar_event; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notice_calendar_event (calendar_event_id, notice_id, resource_mailbox, provider_event_id, created_at) FROM stdin;
\.


--
-- Data for Name: notice_delivery_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notice_delivery_log (delivery_id, notice_id, channel, delivery_status, sent_at, attempt_count, last_error, provider_message_id, idempotency_key) FROM stdin;
1	5	OUTLOOK_MAIL	SENT	2026-01-21 18:02:00.829894	1	\N	\N	notice_5_202601211802
2	8	OUTLOOK_MAIL	FAILED	\N	1	발신자 이메일을 찾을 수 없습니다	\N	notice_8_202601211805
3	9	OUTLOOK_MAIL	SENT	2026-01-21 18:17:51.363339	1	\N	\N	notice_9_202601211817
\.


--
-- Data for Name: organization_master; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.organization_master (org_unit_id, org_unit_code, org_unit_name, corp_id, parent_org_unit_id, org_level, is_active, display_order, created_at, updated_at) FROM stdin;
1	ITH1	서린정보기술 ITH1팀	1	\N	2	t	1	2026-01-12 14:40:12.59047	2026-01-12 14:40:12.59047
2	ITH2	서린정보기술 ITH2팀	1	\N	2	t	2	2026-01-12 14:40:12.59047	2026-01-12 14:40:12.59047
3	ITH3	서린정보기술 ITH3팀	1	\N	2	t	3	2026-01-12 14:40:12.59047	2026-01-12 14:40:12.59047
4	PURCHASE01	구매전략 1팀	1	\N	2	t	4	2026-01-12 14:40:12.59047	2026-01-12 14:40:12.59047
5	PURCHASE02	구매전략 2팀	1	\N	2	t	5	2026-01-12 14:40:12.59047	2026-01-12 14:40:12.59047
6	PURCHASE03	구매전략 3팀	1	\N	2	t	6	2026-01-12 14:40:12.59047	2026-01-12 14:40:12.59047
7	RAW01	원료 1팀	1	\N	2	t	7	2026-01-12 14:40:12.59047	2026-01-12 14:40:12.59047
8	RAW02	원료 2팀	1	\N	2	t	8	2026-01-12 14:40:12.59047	2026-01-12 14:40:12.59047
9	RAW03	원료 3팀	1	\N	2	t	9	2026-01-12 14:40:12.59047	2026-01-12 14:40:12.59047
10	SALES_ZINC	아연영업팀	1	\N	2	t	10	2026-01-12 14:40:12.59047	2026-01-12 14:40:12.59047
11	SALES_LEAD	연영업팀	1	\N	2	t	11	2026-01-12 14:40:12.59047	2026-01-12 14:40:12.59047
12	SALES_PRECIOUS	귀금속영업팀	1	\N	2	t	12	2026-01-12 14:40:12.59047	2026-01-12 14:40:12.59047
13	KZ_HQ	고려아연_본사	1	\N	2	t	13	2026-01-12 14:40:12.59047	2026-01-12 14:40:12.59047
14	KZ_ONSAN	고려아연_온산	1	\N	2	t	14	2026-01-12 14:40:12.59047	2026-01-12 14:40:12.59047
\.


--
-- Data for Name: user_master; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_master (user_id, user_ko_nm, user_en_nm, email, org_unit_id, corp_id, "position", is_active, last_login_at, created_at, updated_at) FROM stdin;
park001	박경민	Park Kyung-min	park.km@company.com	3	1	수석	t	\N	2026-01-12 14:40:12.59047	2026-01-12 14:40:12.59047
shin001	신호용	Shin Ho-yong	shin.hy@company.com	1	1	책임	t	\N	2026-01-12 14:40:12.59047	2026-01-12 14:40:12.59047
jeon001	전종하	Jeon Jong-ha	jeon.jh@company.com	3	1	책임	t	\N	2026-01-12 14:40:12.59047	2026-01-12 14:40:12.59047
an001	안소희	An So-hee	an.sh@company.com	3	1	책임	t	\N	2026-01-12 14:40:12.59047	2026-01-12 14:40:12.59047
kim001	김철수	Kim Chul-su	kim.cs@company.com	4	1	과장	t	\N	2026-01-12 14:40:12.59047	2026-01-12 14:40:12.59047
lee001	이영희	Lee Young-hee	lee.yh@company.com	5	1	대리	t	\N	2026-01-12 14:40:12.59047	2026-01-12 14:40:12.59047
hong001	홍길동	Hong Gil-dong	hong.gd@company.com	10	1	차장	t	\N	2026-01-12 14:40:12.59047	2026-01-12 14:40:12.59047
choi001	최민준	Choi Min-jun	choi.mj@company.com	11	1	과장	t	\N	2026-01-12 14:40:12.59047	2026-01-12 14:40:12.59047
hamyoonsic	함윤식	KaiHam	hamyoonsic@sorin.co.kr	7	1	선임	t	\N	2026-01-12 14:40:12.59047	2026-01-12 14:40:12.59047
\.


--
-- Data for Name: notice_recipient; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notice_recipient (recipient_id, notice_id, user_id, sent_at, read_at, is_read, created_at) FROM stdin;
1	1	kim001	2025-10-22 08:30:00	\N	t	2026-01-12 14:40:12.59047
2	1	lee001	2025-10-22 08:30:00	\N	f	2026-01-12 14:40:12.59047
3	1	hong001	2025-10-22 08:30:00	\N	t	2026-01-12 14:40:12.59047
4	2	park001	2025-10-15 08:30:00	2025-10-15 09:15:00	t	2026-01-12 14:40:12.59047
5	2	shin001	2025-10-15 08:30:00	2025-10-15 08:45:00	t	2026-01-12 14:40:12.59047
6	2	jeon001	2025-10-15 08:30:00	2025-10-15 10:20:00	t	2026-01-12 14:40:12.59047
7	2	kim001	2025-10-15 08:30:00	\N	f	2026-01-12 14:40:12.59047
8	5	lee001	2026-01-21 18:02:00.83589	\N	f	2026-01-21 18:02:00.91985
9	5	shin001	2026-01-21 18:02:00.83589	\N	f	2026-01-21 18:02:00.941428
10	5	hong001	2026-01-21 18:02:00.83589	\N	f	2026-01-21 18:02:00.950457
11	5	park001	2026-01-21 18:02:00.83589	\N	f	2026-01-21 18:02:00.955452
12	5	jeon001	2026-01-21 18:02:00.83589	\N	f	2026-01-21 18:02:00.962006
13	5	kim001	2026-01-21 18:02:00.83589	\N	f	2026-01-21 18:02:00.969006
14	5	choi001	2026-01-21 18:02:00.83589	\N	f	2026-01-21 18:02:00.974518
15	5	an001	2026-01-21 18:02:00.83589	\N	f	2026-01-21 18:02:00.980559
16	9	lee001	2026-01-21 18:17:51.364341	\N	f	2026-01-21 18:17:51.414693
17	9	hamyoonsic	2026-01-21 18:17:51.364341	\N	f	2026-01-21 18:17:51.419691
18	9	shin001	2026-01-21 18:17:51.364341	\N	f	2026-01-21 18:17:51.425242
19	9	hong001	2026-01-21 18:17:51.364341	\N	f	2026-01-21 18:17:51.42824
20	9	park001	2026-01-21 18:17:51.364341	\N	f	2026-01-21 18:17:51.431255
21	9	jeon001	2026-01-21 18:17:51.364341	\N	f	2026-01-21 18:17:51.435244
22	9	kim001	2026-01-21 18:17:51.364341	\N	f	2026-01-21 18:17:51.437755
23	9	choi001	2026-01-21 18:17:51.364341	\N	f	2026-01-21 18:17:51.443626
24	9	an001	2026-01-21 18:17:51.364341	\N	f	2026-01-21 18:17:51.446641
\.


--
-- Data for Name: notice_send_plan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notice_send_plan (send_plan_id, notice_id, send_mode, scheduled_send_at, bundle_key, allow_bundle) FROM stdin;
2	6	SCHEDULED	2026-01-22 08:30:00	\N	t
\.


--
-- Data for Name: notice_tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notice_tag (tag_id, notice_id, tag_value) FROM stdin;
1	1	인프라 작업
2	1	ERP
3	2	보안패치
4	2	전사공지
5	3	긴급장애
6	3	회계시스템
7	5	서비스점검
8	6	긴급
\.


--
-- Data for Name: notice_target; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notice_target (target_id, notice_id, target_type, target_key, target_name) FROM stdin;
1	1	CORP	KZ	고려아연
2	1	ORG_UNIT	KZ_HQ	고려아연_본사
3	1	ORG_UNIT	KZ_ONSAN	고려아연_온산
4	2	CORP	KZ	고려아연
5	2	CORP	KZGT	케이지그린텍
6	3	ORG_UNIT	PURCHASE01	구매전략 1팀
7	3	ORG_UNIT	PURCHASE02	구매전략 2팀
8	3	ORG_UNIT	RAW01	원료 1팀
9	5	CORP	1	고려아연
10	5	ORG_UNIT	2	서린정보기술 ITH2팀
11	6	CORP	1	고려아연
12	6	ORG_UNIT	7	원료 1팀
13	6	ORG_UNIT	8	원료 2팀
14	6	ORG_UNIT	9	원료 3팀
15	7	CORP	1	고려아연
16	7	ORG_UNIT	10	아연영업팀
17	8	CORP	1	고려아연
18	8	ORG_UNIT	1	서린정보기술 ITH1팀
19	9	CORP	1	고려아연
20	9	ORG_UNIT	7	원료 1팀
\.


--
-- Name: admin_delegation_delegation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admin_delegation_delegation_id_seq', 1, true);


--
-- Name: audit_log_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audit_log_log_id_seq', 2, true);


--
-- Name: corporation_master_corp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.corporation_master_corp_id_seq', 4, true);


--
-- Name: notice_approval_approval_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notice_approval_approval_id_seq', 1, false);


--
-- Name: notice_attachment_attachment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notice_attachment_attachment_id_seq', 1, false);


--
-- Name: notice_base_notice_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notice_base_notice_id_seq', 9, true);


--
-- Name: notice_calendar_event_calendar_event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notice_calendar_event_calendar_event_id_seq', 1, false);


--
-- Name: notice_delivery_log_delivery_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notice_delivery_log_delivery_id_seq', 3, true);


--
-- Name: notice_recipient_recipient_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notice_recipient_recipient_id_seq', 24, true);


--
-- Name: notice_send_plan_send_plan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notice_send_plan_send_plan_id_seq', 4, true);


--
-- Name: notice_tag_tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notice_tag_tag_id_seq', 8, true);


--
-- Name: notice_target_target_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notice_target_target_id_seq', 20, true);


--
-- Name: organization_master_org_unit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.organization_master_org_unit_id_seq', 14, true);


--
-- Name: service_master_service_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.service_master_service_id_seq', 6, true);


--
-- PostgreSQL database dump complete
--

\unrestrict D5zwdQsQF9NoQugIgBy33ZOaJptm7W5uVf92E8NkUv8AqvqqlqXANCLNf3MLRIG

