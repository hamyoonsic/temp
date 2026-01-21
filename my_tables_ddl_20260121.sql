--
-- PostgreSQL database dump
--

\restrict s9BAF5tmy9DubZw26hqoNMRvBF745c8lTrMPC6slyq9djk6bR0J8gSkuZJNnCuD

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_delegation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_delegation (
    delegation_id bigint NOT NULL,
    delegator_user_id character varying(50) NOT NULL,
    delegator_user_nm character varying(100) NOT NULL,
    delegate_user_id character varying(50) NOT NULL,
    delegate_user_nm character varying(100) NOT NULL,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL,
    reason character varying(500),
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by character varying(50) NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by character varying(50) NOT NULL,
    CONSTRAINT check_delegation_dates CHECK ((end_date > start_date))
);


ALTER TABLE public.admin_delegation OWNER TO postgres;

--
-- Name: TABLE admin_delegation; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.admin_delegation IS '관리자 권한 위임 정보';


--
-- Name: COLUMN admin_delegation.delegation_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.admin_delegation.delegation_id IS '위임 고유 식별자(PK)';


--
-- Name: COLUMN admin_delegation.delegator_user_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.admin_delegation.delegator_user_id IS '위임자 사용자 ID (원래 관리자)';


--
-- Name: COLUMN admin_delegation.delegator_user_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.admin_delegation.delegator_user_nm IS '위임자 이름';


--
-- Name: COLUMN admin_delegation.delegate_user_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.admin_delegation.delegate_user_id IS '대리자 사용자 ID (권한을 받는 사람)';


--
-- Name: COLUMN admin_delegation.delegate_user_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.admin_delegation.delegate_user_nm IS '대리자 이름';


--
-- Name: COLUMN admin_delegation.start_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.admin_delegation.start_date IS '위임 시작 일시';


--
-- Name: COLUMN admin_delegation.end_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.admin_delegation.end_date IS '위임 종료 일시';


--
-- Name: COLUMN admin_delegation.reason; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.admin_delegation.reason IS '위임 사유';


--
-- Name: COLUMN admin_delegation.is_active; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.admin_delegation.is_active IS '활성 여부 (수동 비활성화 가능)';


--
-- Name: COLUMN admin_delegation.created_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.admin_delegation.created_at IS '등록 일시';


--
-- Name: COLUMN admin_delegation.created_by; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.admin_delegation.created_by IS '등록자';


--
-- Name: COLUMN admin_delegation.updated_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.admin_delegation.updated_at IS '수정 일시';


--
-- Name: COLUMN admin_delegation.updated_by; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.admin_delegation.updated_by IS '수정자';


--
-- Name: admin_delegation_delegation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admin_delegation_delegation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.admin_delegation_delegation_id_seq OWNER TO postgres;

--
-- Name: admin_delegation_delegation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admin_delegation_delegation_id_seq OWNED BY public.admin_delegation.delegation_id;


--
-- Name: audit_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_log (
    log_id bigint NOT NULL,
    log_type character varying(50) NOT NULL,
    action character varying(100) NOT NULL,
    target_type character varying(50),
    target_id character varying(100),
    user_id character varying(50) NOT NULL,
    user_name character varying(100) NOT NULL,
    ip_address character varying(45),
    description text,
    old_value text,
    new_value text,
    result character varying(20) NOT NULL,
    error_message text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT check_audit_result CHECK (((result)::text = ANY ((ARRAY['SUCCESS'::character varying, 'FAILURE'::character varying])::text[])))
);


ALTER TABLE public.audit_log OWNER TO postgres;

--
-- Name: TABLE audit_log; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.audit_log IS '시스템 감사 로그';


--
-- Name: COLUMN audit_log.log_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.audit_log.log_id IS '로그 고유 식별자(PK)';


--
-- Name: COLUMN audit_log.log_type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.audit_log.log_type IS '로그 유형 (ADMIN_DELEGATION, NOTICE_APPROVAL, LOGIN, etc)';


--
-- Name: COLUMN audit_log.action; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.audit_log.action IS '수행 작업 (CREATE, UPDATE, DELETE, APPROVE, REJECT, etc)';


--
-- Name: COLUMN audit_log.target_type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.audit_log.target_type IS '대상 타입 (NOTICE, USER, DELEGATION, etc)';


--
-- Name: COLUMN audit_log.target_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.audit_log.target_id IS '대상 식별자';


--
-- Name: COLUMN audit_log.user_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.audit_log.user_id IS '작업 수행자 ID';


--
-- Name: COLUMN audit_log.user_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.audit_log.user_name IS '작업 수행자 이름';


--
-- Name: COLUMN audit_log.ip_address; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.audit_log.ip_address IS '접속 IP 주소';


--
-- Name: COLUMN audit_log.description; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.audit_log.description IS '작업 설명';


--
-- Name: COLUMN audit_log.old_value; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.audit_log.old_value IS '변경 전 값 (JSON)';


--
-- Name: COLUMN audit_log.new_value; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.audit_log.new_value IS '변경 후 값 (JSON)';


--
-- Name: COLUMN audit_log.result; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.audit_log.result IS '작업 결과 (SUCCESS, FAILURE)';


--
-- Name: COLUMN audit_log.error_message; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.audit_log.error_message IS '에러 메시지 (실패 시)';


--
-- Name: COLUMN audit_log.created_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.audit_log.created_at IS '로그 생성 일시';


--
-- Name: audit_log_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audit_log_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.audit_log_log_id_seq OWNER TO postgres;

--
-- Name: audit_log_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audit_log_log_id_seq OWNED BY public.audit_log.log_id;


--
-- Name: corporation_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.corporation_master (
    corp_id bigint NOT NULL,
    corp_code character varying(50) NOT NULL,
    corp_name character varying(100) NOT NULL,
    parent_corp_id bigint,
    business_number character varying(20),
    is_active boolean DEFAULT true NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.corporation_master OWNER TO postgres;

--
-- Name: TABLE corporation_master; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.corporation_master IS '법인 마스터';


--
-- Name: COLUMN corporation_master.corp_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.corporation_master.corp_id IS '법인 고유 식별자(PK)';


--
-- Name: COLUMN corporation_master.corp_code; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.corporation_master.corp_code IS '법인 코드';


--
-- Name: COLUMN corporation_master.corp_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.corporation_master.corp_name IS '법인명';


--
-- Name: COLUMN corporation_master.parent_corp_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.corporation_master.parent_corp_id IS '상위 법인 ID (그룹사 구조)';


--
-- Name: COLUMN corporation_master.business_number; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.corporation_master.business_number IS '사업자등록번호';


--
-- Name: COLUMN corporation_master.is_active; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.corporation_master.is_active IS '활성 여부';


--
-- Name: COLUMN corporation_master.display_order; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.corporation_master.display_order IS '정렬 순서';


--
-- Name: corporation_master_corp_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.corporation_master_corp_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.corporation_master_corp_id_seq OWNER TO postgres;

--
-- Name: corporation_master_corp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.corporation_master_corp_id_seq OWNED BY public.corporation_master.corp_id;


--
-- Name: notice_approval; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notice_approval (
    approval_id bigint NOT NULL,
    notice_id bigint NOT NULL,
    approval_status character varying(20) NOT NULL,
    approver_user_id character varying(50),
    approver_name character varying(100),
    requested_at timestamp without time zone DEFAULT now() NOT NULL,
    decided_at timestamp without time zone,
    reject_reason character varying(500)
);


ALTER TABLE public.notice_approval OWNER TO postgres;

--
-- Name: TABLE notice_approval; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.notice_approval IS '공지 승인 정보';


--
-- Name: COLUMN notice_approval.approval_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_approval.approval_id IS '승인 고유 식별자(PK)';


--
-- Name: COLUMN notice_approval.notice_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_approval.notice_id IS '승인 대상 공지 ID(FK, 공지 1건당 0~1건)';


--
-- Name: COLUMN notice_approval.approval_status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_approval.approval_status IS '승인 상태(PENDING, APPROVED, REJECTED)';


--
-- Name: COLUMN notice_approval.approver_user_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_approval.approver_user_id IS '승인자 사용자 ID';


--
-- Name: COLUMN notice_approval.approver_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_approval.approver_name IS '승인자 이름';


--
-- Name: COLUMN notice_approval.requested_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_approval.requested_at IS '승인 요청 일시';


--
-- Name: COLUMN notice_approval.decided_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_approval.decided_at IS '승인/반려 처리 일시';


--
-- Name: COLUMN notice_approval.reject_reason; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_approval.reject_reason IS '반려 사유';


--
-- Name: notice_approval_approval_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notice_approval_approval_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notice_approval_approval_id_seq OWNER TO postgres;

--
-- Name: notice_approval_approval_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notice_approval_approval_id_seq OWNED BY public.notice_approval.approval_id;


--
-- Name: notice_attachment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notice_attachment (
    attachment_id bigint NOT NULL,
    notice_id bigint NOT NULL,
    file_name character varying(255) NOT NULL,
    size_bytes bigint NOT NULL,
    storage_key character varying(300) NOT NULL
);


ALTER TABLE public.notice_attachment OWNER TO postgres;

--
-- Name: TABLE notice_attachment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.notice_attachment IS '공지 첨부 파일 메타데이터';


--
-- Name: COLUMN notice_attachment.attachment_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_attachment.attachment_id IS '첨부 파일 고유 식별자(PK)';


--
-- Name: COLUMN notice_attachment.notice_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_attachment.notice_id IS '공지 ID(FK)';


--
-- Name: COLUMN notice_attachment.file_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_attachment.file_name IS '파일명';


--
-- Name: COLUMN notice_attachment.size_bytes; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_attachment.size_bytes IS '파일 크기(Byte)';


--
-- Name: COLUMN notice_attachment.storage_key; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_attachment.storage_key IS '저장소 경로/키';


--
-- Name: notice_attachment_attachment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notice_attachment_attachment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notice_attachment_attachment_id_seq OWNER TO postgres;

--
-- Name: notice_attachment_attachment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notice_attachment_attachment_id_seq OWNED BY public.notice_attachment.attachment_id;


--
-- Name: notice_base; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notice_base (
    notice_id bigint NOT NULL,
    title character varying(200) NOT NULL,
    content text NOT NULL,
    notice_level character varying(10) NOT NULL,
    notice_status character varying(30) NOT NULL,
    affected_service_id bigint,
    sender_org_unit_id character varying(50),
    sender_org_unit_name character varying(100),
    publish_start_at timestamp without time zone,
    publish_end_at timestamp without time zone,
    is_maintenance boolean DEFAULT false NOT NULL,
    is_completed boolean DEFAULT false NOT NULL,
    completed_at timestamp without time zone,
    mail_subject character varying(300),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    created_by character varying(50) NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_by character varying(50) NOT NULL,
    parent_notice_id bigint,
    CONSTRAINT notice_level_check CHECK (((notice_level)::text = ANY ((ARRAY['L1'::character varying, 'L2'::character varying, 'L3'::character varying])::text[])))
);


ALTER TABLE public.notice_base OWNER TO postgres;

--
-- Name: TABLE notice_base; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.notice_base IS '공지 기본 정보';


--
-- Name: COLUMN notice_base.notice_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_base.notice_id IS '공지 고유 식별자(PK)';


--
-- Name: COLUMN notice_base.title; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_base.title IS '공지 제목';


--
-- Name: COLUMN notice_base.content; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_base.content IS '공지 상세 내용';


--
-- Name: COLUMN notice_base.notice_level; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_base.notice_level IS '공지 중요도(ENUM: L1 일반, L2 중요, L3 긴급)';


--
-- Name: COLUMN notice_base.notice_status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_base.notice_status IS '공지 상태(DRAFT, PENDING, APPROVED, SENT, FAILED, COMPLETED)';


--
-- Name: COLUMN notice_base.affected_service_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_base.affected_service_id IS '영향받는 서비스 ID(FK) - v1.4 추가';


--
-- Name: COLUMN notice_base.sender_org_unit_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_base.sender_org_unit_id IS '발신 부서 ID';


--
-- Name: COLUMN notice_base.sender_org_unit_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_base.sender_org_unit_name IS '발신 부서명';


--
-- Name: COLUMN notice_base.publish_start_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_base.publish_start_at IS '게시 시작 일시';


--
-- Name: COLUMN notice_base.publish_end_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_base.publish_end_at IS '게시 종료 일시';


--
-- Name: COLUMN notice_base.is_maintenance; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_base.is_maintenance IS '점검/장애 공지 여부';


--
-- Name: COLUMN notice_base.is_completed; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_base.is_completed IS '완료 처리 여부';


--
-- Name: COLUMN notice_base.completed_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_base.completed_at IS '완료 처리 일시';


--
-- Name: COLUMN notice_base.mail_subject; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_base.mail_subject IS '메일 및 캘린더 일정 제목';


--
-- Name: COLUMN notice_base.created_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_base.created_at IS '등록 일시';


--
-- Name: COLUMN notice_base.created_by; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_base.created_by IS '등록자';


--
-- Name: COLUMN notice_base.updated_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_base.updated_at IS '수정 일시';


--
-- Name: COLUMN notice_base.updated_by; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_base.updated_by IS '수정자';


--
-- Name: COLUMN notice_base.parent_notice_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_base.parent_notice_id IS '원본 공지 ID (완료 공지인 경우 원본 점검 공지를 참조)';


--
-- Name: notice_base_notice_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notice_base_notice_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notice_base_notice_id_seq OWNER TO postgres;

--
-- Name: notice_base_notice_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notice_base_notice_id_seq OWNED BY public.notice_base.notice_id;


--
-- Name: notice_calendar_event; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notice_calendar_event (
    calendar_event_id bigint NOT NULL,
    notice_id bigint NOT NULL,
    resource_mailbox character varying(120) NOT NULL,
    provider_event_id character varying(120) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.notice_calendar_event OWNER TO postgres;

--
-- Name: TABLE notice_calendar_event; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.notice_calendar_event IS '공지 캘린더 일정 연계';


--
-- Name: COLUMN notice_calendar_event.calendar_event_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_calendar_event.calendar_event_id IS '캘린더 이벤트 고유 식별자(PK)';


--
-- Name: COLUMN notice_calendar_event.notice_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_calendar_event.notice_id IS '연계 대상 공지 ID(FK)';


--
-- Name: COLUMN notice_calendar_event.resource_mailbox; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_calendar_event.resource_mailbox IS '공지 자원 메일 주소';


--
-- Name: COLUMN notice_calendar_event.provider_event_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_calendar_event.provider_event_id IS '외부 캘린더 이벤트 ID';


--
-- Name: COLUMN notice_calendar_event.created_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_calendar_event.created_at IS '캘린더 등록 일시';


--
-- Name: notice_calendar_event_calendar_event_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notice_calendar_event_calendar_event_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notice_calendar_event_calendar_event_id_seq OWNER TO postgres;

--
-- Name: notice_calendar_event_calendar_event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notice_calendar_event_calendar_event_id_seq OWNED BY public.notice_calendar_event.calendar_event_id;


--
-- Name: notice_delivery_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notice_delivery_log (
    delivery_id bigint NOT NULL,
    notice_id bigint NOT NULL,
    channel character varying(30) DEFAULT 'OUTLOOK_MAIL'::character varying NOT NULL,
    delivery_status character varying(20) NOT NULL,
    sent_at timestamp without time zone,
    attempt_count integer DEFAULT 0 NOT NULL,
    last_error text,
    provider_message_id character varying(120),
    idempotency_key character varying(80)
);


ALTER TABLE public.notice_delivery_log OWNER TO postgres;

--
-- Name: TABLE notice_delivery_log; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.notice_delivery_log IS '공지 발송 이력';


--
-- Name: COLUMN notice_delivery_log.delivery_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_delivery_log.delivery_id IS '발송 이력 고유 식별자(PK)';


--
-- Name: COLUMN notice_delivery_log.notice_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_delivery_log.notice_id IS '발송 대상 공지 ID(FK)';


--
-- Name: COLUMN notice_delivery_log.channel; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_delivery_log.channel IS '발송 채널(기본 OUTLOOK_MAIL)';


--
-- Name: COLUMN notice_delivery_log.delivery_status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_delivery_log.delivery_status IS '발송 상태(READY, SENT, FAILED)';


--
-- Name: COLUMN notice_delivery_log.sent_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_delivery_log.sent_at IS '발송 완료 일시';


--
-- Name: COLUMN notice_delivery_log.attempt_count; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_delivery_log.attempt_count IS '발송 시도 횟수';


--
-- Name: COLUMN notice_delivery_log.last_error; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_delivery_log.last_error IS '최종 오류 내용';


--
-- Name: COLUMN notice_delivery_log.provider_message_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_delivery_log.provider_message_id IS '외부 발송 시스템 메시지 ID';


--
-- Name: COLUMN notice_delivery_log.idempotency_key; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_delivery_log.idempotency_key IS '중복 발송 방지 키';


--
-- Name: notice_delivery_log_delivery_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notice_delivery_log_delivery_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notice_delivery_log_delivery_id_seq OWNER TO postgres;

--
-- Name: notice_delivery_log_delivery_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notice_delivery_log_delivery_id_seq OWNED BY public.notice_delivery_log.delivery_id;


--
-- Name: notice_recipient; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notice_recipient (
    recipient_id bigint NOT NULL,
    notice_id bigint NOT NULL,
    user_id character varying(50) NOT NULL,
    sent_at timestamp without time zone,
    read_at timestamp without time zone,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.notice_recipient OWNER TO postgres;

--
-- Name: TABLE notice_recipient; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.notice_recipient IS '공지 개별 수신자 추적';


--
-- Name: COLUMN notice_recipient.recipient_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_recipient.recipient_id IS '수신자 고유 식별자(PK)';


--
-- Name: COLUMN notice_recipient.notice_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_recipient.notice_id IS '공지 ID(FK)';


--
-- Name: COLUMN notice_recipient.user_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_recipient.user_id IS '수신 사용자 ID(FK)';


--
-- Name: COLUMN notice_recipient.sent_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_recipient.sent_at IS '발송 일시';


--
-- Name: COLUMN notice_recipient.read_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_recipient.read_at IS '읽은 일시 (선택)';


--
-- Name: COLUMN notice_recipient.is_read; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_recipient.is_read IS '읽음 여부';


--
-- Name: notice_recipient_recipient_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notice_recipient_recipient_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notice_recipient_recipient_id_seq OWNER TO postgres;

--
-- Name: notice_recipient_recipient_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notice_recipient_recipient_id_seq OWNED BY public.notice_recipient.recipient_id;


--
-- Name: notice_send_plan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notice_send_plan (
    send_plan_id bigint NOT NULL,
    notice_id bigint NOT NULL,
    send_mode character varying(20) NOT NULL,
    scheduled_send_at timestamp without time zone,
    bundle_key character varying(80),
    allow_bundle boolean DEFAULT true NOT NULL
);


ALTER TABLE public.notice_send_plan OWNER TO postgres;

--
-- Name: TABLE notice_send_plan; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.notice_send_plan IS '공지 발송 계획';


--
-- Name: COLUMN notice_send_plan.send_plan_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_send_plan.send_plan_id IS '발송 계획 고유 식별자(PK)';


--
-- Name: COLUMN notice_send_plan.notice_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_send_plan.notice_id IS '발송 대상 공지 ID(FK, 공지 1건당 0~1건)';


--
-- Name: COLUMN notice_send_plan.send_mode; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_send_plan.send_mode IS '발송 방식(IMMEDIATE:즉시, SCHEDULED:예약)';


--
-- Name: COLUMN notice_send_plan.scheduled_send_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_send_plan.scheduled_send_at IS '예약 발송 일시';


--
-- Name: COLUMN notice_send_plan.bundle_key; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_send_plan.bundle_key IS '묶음 발송 기준 키';


--
-- Name: COLUMN notice_send_plan.allow_bundle; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_send_plan.allow_bundle IS '묶음 발송 허용 여부';


--
-- Name: notice_send_plan_send_plan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notice_send_plan_send_plan_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notice_send_plan_send_plan_id_seq OWNER TO postgres;

--
-- Name: notice_send_plan_send_plan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notice_send_plan_send_plan_id_seq OWNED BY public.notice_send_plan.send_plan_id;


--
-- Name: notice_tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notice_tag (
    tag_id bigint NOT NULL,
    notice_id bigint NOT NULL,
    tag_value character varying(50) NOT NULL
);


ALTER TABLE public.notice_tag OWNER TO postgres;

--
-- Name: TABLE notice_tag; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.notice_tag IS '공지 해시태그';


--
-- Name: COLUMN notice_tag.tag_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_tag.tag_id IS '태그 고유 식별자(PK)';


--
-- Name: COLUMN notice_tag.notice_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_tag.notice_id IS '공지 ID(FK)';


--
-- Name: COLUMN notice_tag.tag_value; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_tag.tag_value IS '해시태그 값';


--
-- Name: notice_tag_tag_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notice_tag_tag_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notice_tag_tag_id_seq OWNER TO postgres;

--
-- Name: notice_tag_tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notice_tag_tag_id_seq OWNED BY public.notice_tag.tag_id;


--
-- Name: notice_target; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notice_target (
    target_id bigint NOT NULL,
    notice_id bigint NOT NULL,
    target_type character varying(20) NOT NULL,
    target_key character varying(80) NOT NULL,
    target_name character varying(200)
);


ALTER TABLE public.notice_target OWNER TO postgres;

--
-- Name: TABLE notice_target; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.notice_target IS '공지 수신 대상';


--
-- Name: COLUMN notice_target.target_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_target.target_id IS '수신 대상 고유 식별자(PK)';


--
-- Name: COLUMN notice_target.notice_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_target.notice_id IS '공지 ID(FK)';


--
-- Name: COLUMN notice_target.target_type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_target.target_type IS '대상 유형(CORP/ORG_UNIT/USER/SERVICE)';


--
-- Name: COLUMN notice_target.target_key; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_target.target_key IS '대상 식별 키';


--
-- Name: COLUMN notice_target.target_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.notice_target.target_name IS '대상 표시명';


--
-- Name: notice_target_target_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notice_target_target_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notice_target_target_id_seq OWNER TO postgres;

--
-- Name: notice_target_target_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notice_target_target_id_seq OWNED BY public.notice_target.target_id;


--
-- Name: organization_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organization_master (
    org_unit_id bigint NOT NULL,
    org_unit_code character varying(50) NOT NULL,
    org_unit_name character varying(100) NOT NULL,
    corp_id bigint NOT NULL,
    parent_org_unit_id bigint,
    org_level integer DEFAULT 1 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.organization_master OWNER TO postgres;

--
-- Name: TABLE organization_master; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.organization_master IS '조직/부서 마스터';


--
-- Name: COLUMN organization_master.org_unit_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.organization_master.org_unit_id IS '조직 고유 식별자(PK)';


--
-- Name: COLUMN organization_master.org_unit_code; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.organization_master.org_unit_code IS '조직 코드';


--
-- Name: COLUMN organization_master.org_unit_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.organization_master.org_unit_name IS '조직명/부서명';


--
-- Name: COLUMN organization_master.corp_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.organization_master.corp_id IS '소속 법인 ID(FK)';


--
-- Name: COLUMN organization_master.parent_org_unit_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.organization_master.parent_org_unit_id IS '상위 조직 ID (계층 구조)';


--
-- Name: COLUMN organization_master.org_level; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.organization_master.org_level IS '조직 레벨 (1:본부, 2:팀, 3:파트)';


--
-- Name: COLUMN organization_master.is_active; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.organization_master.is_active IS '활성 여부';


--
-- Name: COLUMN organization_master.display_order; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.organization_master.display_order IS '정렬 순서';


--
-- Name: organization_master_org_unit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.organization_master_org_unit_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.organization_master_org_unit_id_seq OWNER TO postgres;

--
-- Name: organization_master_org_unit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.organization_master_org_unit_id_seq OWNED BY public.organization_master.org_unit_id;


--
-- Name: service_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.service_master (
    service_id bigint NOT NULL,
    service_code character varying(50) NOT NULL,
    service_name character varying(100) NOT NULL,
    service_category character varying(50),
    owner_org_unit_id character varying(50),
    contact_info character varying(200),
    is_active boolean DEFAULT true NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.service_master OWNER TO postgres;

--
-- Name: TABLE service_master; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.service_master IS '서비스 마스터 (ERP, 그룹웨어 등)';


--
-- Name: COLUMN service_master.service_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.service_master.service_id IS '서비스 고유 식별자(PK)';


--
-- Name: COLUMN service_master.service_code; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.service_master.service_code IS '서비스 코드 (예: ERP, GROUPWARE)';


--
-- Name: COLUMN service_master.service_name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.service_master.service_name IS '서비스명 (예: 고려아연 ERP)';


--
-- Name: COLUMN service_master.service_category; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.service_master.service_category IS '서비스 카테고리 (업무시스템/인프라/보안)';


--
-- Name: COLUMN service_master.owner_org_unit_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.service_master.owner_org_unit_id IS '담당 부서 ID';


--
-- Name: COLUMN service_master.contact_info; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.service_master.contact_info IS '서비스 담당자 연락처';


--
-- Name: COLUMN service_master.is_active; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.service_master.is_active IS '활성 여부';


--
-- Name: COLUMN service_master.display_order; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.service_master.display_order IS '정렬 순서';


--
-- Name: service_master_service_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.service_master_service_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.service_master_service_id_seq OWNER TO postgres;

--
-- Name: service_master_service_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.service_master_service_id_seq OWNED BY public.service_master.service_id;


--
-- Name: user_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_master (
    user_id character varying(50) NOT NULL,
    user_ko_nm character varying(100) NOT NULL,
    user_en_nm character varying(100),
    email character varying(150),
    org_unit_id bigint,
    corp_id bigint,
    "position" character varying(50),
    is_active boolean DEFAULT true NOT NULL,
    last_login_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_master OWNER TO postgres;

--
-- Name: TABLE user_master; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.user_master IS '사용자 마스터 (SSO 연동)';


--
-- Name: COLUMN user_master.user_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.user_master.user_id IS '사용자 ID (PK, SSO 연동)';


--
-- Name: COLUMN user_master.user_ko_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.user_master.user_ko_nm IS '한글 이름';


--
-- Name: COLUMN user_master.user_en_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.user_master.user_en_nm IS '영문 이름';


--
-- Name: COLUMN user_master.email; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.user_master.email IS '이메일 주소';


--
-- Name: COLUMN user_master.org_unit_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.user_master.org_unit_id IS '소속 부서 ID(FK)';


--
-- Name: COLUMN user_master.corp_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.user_master.corp_id IS '소속 법인 ID(FK)';


--
-- Name: COLUMN user_master."position"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.user_master."position" IS '직급';


--
-- Name: COLUMN user_master.is_active; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.user_master.is_active IS '활성 여부';


--
-- Name: COLUMN user_master.last_login_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.user_master.last_login_at IS '마지막 로그인 일시';


--
-- Name: admin_delegation delegation_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_delegation ALTER COLUMN delegation_id SET DEFAULT nextval('public.admin_delegation_delegation_id_seq'::regclass);


--
-- Name: audit_log log_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_log ALTER COLUMN log_id SET DEFAULT nextval('public.audit_log_log_id_seq'::regclass);


--
-- Name: corporation_master corp_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.corporation_master ALTER COLUMN corp_id SET DEFAULT nextval('public.corporation_master_corp_id_seq'::regclass);


--
-- Name: notice_approval approval_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notice_approval ALTER COLUMN approval_id SET DEFAULT nextval('public.notice_approval_approval_id_seq'::regclass);


--
-- Name: notice_attachment attachment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notice_attachment ALTER COLUMN attachment_id SET DEFAULT nextval('public.notice_attachment_attachment_id_seq'::regclass);


--
-- Name: notice_base notice_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notice_base ALTER COLUMN notice_id SET DEFAULT nextval('public.notice_base_notice_id_seq'::regclass);


--
-- Name: notice_calendar_event calendar_event_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notice_calendar_event ALTER COLUMN calendar_event_id SET DEFAULT nextval('public.notice_calendar_event_calendar_event_id_seq'::regclass);


--
-- Name: notice_delivery_log delivery_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notice_delivery_log ALTER COLUMN delivery_id SET DEFAULT nextval('public.notice_delivery_log_delivery_id_seq'::regclass);


--
-- Name: notice_recipient recipient_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notice_recipient ALTER COLUMN recipient_id SET DEFAULT nextval('public.notice_recipient_recipient_id_seq'::regclass);


--
-- Name: notice_send_plan send_plan_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notice_send_plan ALTER COLUMN send_plan_id SET DEFAULT nextval('public.notice_send_plan_send_plan_id_seq'::regclass);


--
-- Name: notice_tag tag_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notice_tag ALTER COLUMN tag_id SET DEFAULT nextval('public.notice_tag_tag_id_seq'::regclass);


--
-- Name: notice_target target_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notice_target ALTER COLUMN target_id SET DEFAULT nextval('public.notice_target_target_id_seq'::regclass);


--
-- Name: organization_master org_unit_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization_master ALTER COLUMN org_unit_id SET DEFAULT nextval('public.organization_master_org_unit_id_seq'::regclass);


--
-- Name: service_master service_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_master ALTER COLUMN service_id SET DEFAULT nextval('public.service_master_service_id_seq'::regclass);


--
-- Name: admin_delegation admin_delegation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_delegation
    ADD CONSTRAINT admin_delegation_pkey PRIMARY KEY (delegation_id);


--
-- Name: audit_log audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_pkey PRIMARY KEY (log_id);


--
-- Name: corporation_master corporation_master_corp_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.corporation_master
    ADD CONSTRAINT corporation_master_corp_code_key UNIQUE (corp_code);


--
-- Name: corporation_master corporation_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.corporation_master
    ADD CONSTRAINT corporation_master_pkey PRIMARY KEY (corp_id);


--
-- Name: notice_approval notice_approval_notice_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notice_approval
    ADD CONSTRAINT notice_approval_notice_id_key UNIQUE (notice_id);


--
-- Name: notice_approval notice_approval_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notice_approval
    ADD CONSTRAINT notice_approval_pkey PRIMARY KEY (approval_id);


--
-- Name: notice_attachment notice_attachment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notice_attachment
    ADD CONSTRAINT notice_attachment_pkey PRIMARY KEY (attachment_id);


--
-- Name: notice_base notice_base_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notice_base
    ADD CONSTRAINT notice_base_pkey PRIMARY KEY (notice_id);


--
-- Name: notice_calendar_event notice_calendar_event_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notice_calendar_event
    ADD CONSTRAINT notice_calendar_event_pkey PRIMARY KEY (calendar_event_id);


--
-- Name: notice_delivery_log notice_delivery_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notice_delivery_log
    ADD CONSTRAINT notice_delivery_log_pkey PRIMARY KEY (delivery_id);


--
-- Name: notice_recipient notice_recipient_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notice_recipient
    ADD CONSTRAINT notice_recipient_pkey PRIMARY KEY (recipient_id);


--
-- Name: notice_send_plan notice_send_plan_notice_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notice_send_plan
    ADD CONSTRAINT notice_send_plan_notice_id_key UNIQUE (notice_id);


--
-- Name: notice_send_plan notice_send_plan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notice_send_plan
    ADD CONSTRAINT notice_send_plan_pkey PRIMARY KEY (send_plan_id);


--
-- Name: notice_tag notice_tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notice_tag
    ADD CONSTRAINT notice_tag_pkey PRIMARY KEY (tag_id);


--
-- Name: notice_target notice_target_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notice_target
    ADD CONSTRAINT notice_target_pkey PRIMARY KEY (target_id);


--
-- Name: organization_master organization_master_org_unit_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization_master
    ADD CONSTRAINT organization_master_org_unit_code_key UNIQUE (org_unit_code);


--
-- Name: organization_master organization_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization_master
    ADD CONSTRAINT organization_master_pkey PRIMARY KEY (org_unit_id);


--
-- Name: service_master service_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_master
    ADD CONSTRAINT service_master_pkey PRIMARY KEY (service_id);


--
-- Name: service_master service_master_service_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_master
    ADD CONSTRAINT service_master_service_code_key UNIQUE (service_code);


--
-- Name: user_master user_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_master
    ADD CONSTRAINT user_master_pkey PRIMARY KEY (user_id);


--
-- Name: idx_admin_delegation_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admin_delegation_active ON public.admin_delegation USING btree (is_active, end_date) WHERE (is_active = true);


--
-- Name: idx_admin_delegation_delegate; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admin_delegation_delegate ON public.admin_delegation USING btree (delegate_user_id);


--
-- Name: idx_admin_delegation_delegator; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admin_delegation_delegator ON public.admin_delegation USING btree (delegator_user_id);


--
-- Name: idx_audit_log_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_log_created ON public.audit_log USING btree (created_at DESC);


--
-- Name: idx_audit_log_target; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_log_target ON public.audit_log USING btree (target_type, target_id);


--
-- Name: idx_audit_log_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_log_type ON public.audit_log USING btree (log_type);


--
-- Name: idx_audit_log_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_log_user ON public.audit_log USING btree (user_id);


--
-- Name: idx_corp_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_corp_active ON public.corporation_master USING btree (is_active, display_order);


--
-- Name: idx_notice_attachment_notice_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notice_attachment_notice_id ON public.notice_attachment USING btree (notice_id);


--
-- Name: idx_notice_base_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notice_base_created_at ON public.notice_base USING btree (created_at DESC);


--
-- Name: idx_notice_base_level; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notice_base_level ON public.notice_base USING btree (notice_level);


--
-- Name: idx_notice_base_maint_completed; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notice_base_maint_completed ON public.notice_base USING btree (is_maintenance, is_completed);


--
-- Name: idx_notice_base_publish_range; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notice_base_publish_range ON public.notice_base USING btree (publish_start_at, publish_end_at);


--
-- Name: idx_notice_base_sender_org; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notice_base_sender_org ON public.notice_base USING btree (sender_org_unit_id);


--
-- Name: idx_notice_base_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notice_base_status ON public.notice_base USING btree (notice_status);


--
-- Name: idx_notice_calendar_event_notice_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notice_calendar_event_notice_id ON public.notice_calendar_event USING btree (notice_id);


--
-- Name: idx_notice_delivery_log_notice_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notice_delivery_log_notice_id ON public.notice_delivery_log USING btree (notice_id);


--
-- Name: idx_notice_parent; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notice_parent ON public.notice_base USING btree (parent_notice_id) WHERE (parent_notice_id IS NOT NULL);


--
-- Name: idx_notice_service; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notice_service ON public.notice_base USING btree (affected_service_id);


--
-- Name: idx_notice_tag_notice_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notice_tag_notice_id ON public.notice_tag USING btree (notice_id);


--
-- Name: idx_notice_tag_value; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notice_tag_value ON public.notice_tag USING btree (tag_value);


--
-- Name: idx_notice_target_notice_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notice_target_notice_id ON public.notice_target USING btree (notice_id);


--
-- Name: idx_notice_target_type_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notice_target_type_key ON public.notice_target USING btree (target_type, target_key);


--
-- Name: idx_org_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_org_active ON public.organization_master USING btree (is_active, corp_id, display_order);


--
-- Name: idx_org_corp; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_org_corp ON public.organization_master USING btree (corp_id);


--
-- Name: idx_org_parent; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_org_parent ON public.organization_master USING btree (parent_org_unit_id);


--
-- Name: idx_recipient_notice; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_recipient_notice ON public.notice_recipient USING btree (notice_id);


--
-- Name: idx_recipient_read; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_recipient_read ON public.notice_recipient USING btree (is_read);


--
-- Name: idx_recipient_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_recipient_user ON public.notice_recipient USING btree (user_id);


--
-- Name: idx_service_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_service_active ON public.service_master USING btree (is_active, display_order);


--
-- Name: idx_user_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_active ON public.user_master USING btree (is_active);


--
-- Name: idx_user_corp; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_corp ON public.user_master USING btree (corp_id);


--
-- Name: idx_user_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_email ON public.user_master USING btree (email);


--
-- Name: idx_user_org; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_org ON public.user_master USING btree (org_unit_id);


--
-- Name: uq_notice_delivery_idempotency; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_notice_delivery_idempotency ON public.notice_delivery_log USING btree (channel, idempotency_key);


--
-- Name: corporation_master fk_corp_parent; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.corporation_master
    ADD CONSTRAINT fk_corp_parent FOREIGN KEY (parent_corp_id) REFERENCES public.corporation_master(corp_id) ON DELETE SET NULL;


--
-- Name: notice_approval fk_notice_approval; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notice_approval
    ADD CONSTRAINT fk_notice_approval FOREIGN KEY (notice_id) REFERENCES public.notice_base(notice_id) ON DELETE CASCADE;


--
-- Name: notice_attachment fk_notice_attachment; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notice_attachment
    ADD CONSTRAINT fk_notice_attachment FOREIGN KEY (notice_id) REFERENCES public.notice_base(notice_id) ON DELETE CASCADE;


--
-- Name: notice_calendar_event fk_notice_calendar_event; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notice_calendar_event
    ADD CONSTRAINT fk_notice_calendar_event FOREIGN KEY (notice_id) REFERENCES public.notice_base(notice_id) ON DELETE CASCADE;


--
-- Name: notice_delivery_log fk_notice_delivery; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notice_delivery_log
    ADD CONSTRAINT fk_notice_delivery FOREIGN KEY (notice_id) REFERENCES public.notice_base(notice_id) ON DELETE CASCADE;


--
-- Name: notice_base fk_notice_parent; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notice_base
    ADD CONSTRAINT fk_notice_parent FOREIGN KEY (parent_notice_id) REFERENCES public.notice_base(notice_id) ON DELETE SET NULL;


--
-- Name: notice_send_plan fk_notice_send_plan; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notice_send_plan
    ADD CONSTRAINT fk_notice_send_plan FOREIGN KEY (notice_id) REFERENCES public.notice_base(notice_id) ON DELETE CASCADE;


--
-- Name: notice_base fk_notice_service; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notice_base
    ADD CONSTRAINT fk_notice_service FOREIGN KEY (affected_service_id) REFERENCES public.service_master(service_id) ON DELETE SET NULL;


--
-- Name: notice_tag fk_notice_tag; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notice_tag
    ADD CONSTRAINT fk_notice_tag FOREIGN KEY (notice_id) REFERENCES public.notice_base(notice_id) ON DELETE CASCADE;


--
-- Name: notice_target fk_notice_target; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notice_target
    ADD CONSTRAINT fk_notice_target FOREIGN KEY (notice_id) REFERENCES public.notice_base(notice_id) ON DELETE CASCADE;


--
-- Name: organization_master fk_org_corp; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization_master
    ADD CONSTRAINT fk_org_corp FOREIGN KEY (corp_id) REFERENCES public.corporation_master(corp_id) ON DELETE RESTRICT;


--
-- Name: organization_master fk_org_parent; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization_master
    ADD CONSTRAINT fk_org_parent FOREIGN KEY (parent_org_unit_id) REFERENCES public.organization_master(org_unit_id) ON DELETE SET NULL;


--
-- Name: notice_recipient fk_recipient_notice; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notice_recipient
    ADD CONSTRAINT fk_recipient_notice FOREIGN KEY (notice_id) REFERENCES public.notice_base(notice_id) ON DELETE CASCADE;


--
-- Name: notice_recipient fk_recipient_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notice_recipient
    ADD CONSTRAINT fk_recipient_user FOREIGN KEY (user_id) REFERENCES public.user_master(user_id) ON DELETE CASCADE;


--
-- Name: user_master fk_user_corp; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_master
    ADD CONSTRAINT fk_user_corp FOREIGN KEY (corp_id) REFERENCES public.corporation_master(corp_id) ON DELETE SET NULL;


--
-- Name: user_master fk_user_org; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_master
    ADD CONSTRAINT fk_user_org FOREIGN KEY (org_unit_id) REFERENCES public.organization_master(org_unit_id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict s9BAF5tmy9DubZw26hqoNMRvBF745c8lTrMPC6slyq9djk6bR0J8gSkuZJNnCuD

