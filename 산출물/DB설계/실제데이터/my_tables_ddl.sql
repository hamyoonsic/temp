-- =====================================================
-- 1. 마스터 테이블들
-- =====================================================

CREATE TABLE public.corporation_master (
    corp_id           bigint NOT NULL,
    corp_code         varchar(50)  NOT NULL,
    corp_name         varchar(100) NOT NULL,
    parent_corp_id    bigint,
    business_number   varchar(20),
    is_active         boolean      NOT NULL,
    display_order     integer      NOT NULL,
    created_at        timestamp    NOT NULL,
    updated_at        timestamp    NOT NULL
);
COMMENT ON TABLE  public.corporation_master IS '법인 마스터';
COMMENT ON COLUMN public.corporation_master.corp_id         IS '법인 고유 식별자(PK)';
COMMENT ON COLUMN public.corporation_master.corp_code       IS '법인 코드';
COMMENT ON COLUMN public.corporation_master.corp_name       IS '법인명';
COMMENT ON COLUMN public.corporation_master.parent_corp_id  IS '상위 법인 ID (그룹사 구조)';
COMMENT ON COLUMN public.corporation_master.business_number IS '사업자등록번호';
COMMENT ON COLUMN public.corporation_master.is_active       IS '활성 여부';
COMMENT ON COLUMN public.corporation_master.display_order   IS '정렬 순서';

CREATE TABLE public.organization_master (
    org_unit_id        bigint NOT NULL,
    org_unit_code      varchar(50)  NOT NULL,
    org_unit_name      varchar(100) NOT NULL,
    corp_id            bigint       NOT NULL,
    parent_org_unit_id bigint,
    org_level          integer      NOT NULL,
    is_active          boolean      NOT NULL,
    display_order      integer      NOT NULL,
    created_at         timestamp    NOT NULL,
    updated_at         timestamp    NOT NULL
);
COMMENT ON TABLE  public.organization_master IS '조직/부서 마스터';
COMMENT ON COLUMN public.organization_master.org_unit_id        IS '조직 고유 식별자(PK)';
COMMENT ON COLUMN public.organization_master.org_unit_code      IS '조직 코드';
COMMENT ON COLUMN public.organization_master.org_unit_name      IS '조직명/부서명';
COMMENT ON COLUMN public.organization_master.corp_id            IS '소속 법인 ID(FK)';
COMMENT ON COLUMN public.organization_master.parent_org_unit_id IS '상위 조직 ID (계층 구조)';
COMMENT ON COLUMN public.organization_master.org_level          IS '조직 레벨 (1:본부, 2:팀, 3:파트)';
COMMENT ON COLUMN public.organization_master.is_active          IS '활성 여부';
COMMENT ON COLUMN public.organization_master.display_order      IS '정렬 순서';

CREATE TABLE public.service_master (
    service_id        bigint NOT NULL,
    service_code      varchar(50)  NOT NULL,
    service_name      varchar(100) NOT NULL,
    service_category  varchar(50),
    owner_org_unit_id varchar(50),
    contact_info      varchar(200),
    is_active         boolean      NOT NULL,
    display_order     integer      NOT NULL,
    created_at        timestamp    NOT NULL,
    updated_at        timestamp    NOT NULL
);
COMMENT ON TABLE  public.service_master IS '서비스 마스터 (ERP, 그룹웨어 등)';
COMMENT ON COLUMN public.service_master.service_id        IS '서비스 고유 식별자(PK)';
COMMENT ON COLUMN public.service_master.service_code      IS '서비스 코드 (예: ERP, GROUPWARE)';
COMMENT ON COLUMN public.service_master.service_name      IS '서비스명 (예: 고려아연 ERP)';
COMMENT ON COLUMN public.service_master.service_category  IS '서비스 카테고리 (업무시스템/인프라/보안)';
COMMENT ON COLUMN public.service_master.owner_org_unit_id IS '담당 부서 ID';
COMMENT ON COLUMN public.service_master.contact_info      IS '서비스 담당자 연락처';
COMMENT ON COLUMN public.service_master.is_active         IS '활성 여부';
COMMENT ON COLUMN public.service_master.display_order     IS '정렬 순서';

CREATE TABLE public.user_master (
    user_id      varchar(50)  NOT NULL,
    user_ko_nm   varchar(100) NOT NULL,
    user_en_nm   varchar(100),
    email        varchar(150),
    org_unit_id  bigint,
    corp_id      bigint,
    "position"   varchar(50),
    is_active    boolean      NOT NULL,
    last_login_at timestamp,
    created_at   timestamp    NOT NULL,
    updated_at   timestamp    NOT NULL
);
COMMENT ON TABLE  public.user_master IS '사용자 마스터 (SSO 연동)';
COMMENT ON COLUMN public.user_master.user_id      IS '사용자 ID (PK, SSO 연동)';
COMMENT ON COLUMN public.user_master.user_ko_nm   IS '한글 이름';
COMMENT ON COLUMN public.user_master.user_en_nm   IS '영문 이름';
COMMENT ON COLUMN public.user_master.email        IS '이메일 주소';
COMMENT ON COLUMN public.user_master.org_unit_id  IS '소속 부서 ID(FK)';
COMMENT ON COLUMN public.user_master.corp_id      IS '소속 법인 ID(FK)';
COMMENT ON COLUMN public.user_master."position"   IS '직급';
COMMENT ON COLUMN public.user_master.is_active    IS '활성 여부';
COMMENT ON COLUMN public.user_master.last_login_at IS '마지막 로그인 일시';

-- =====================================================
-- 2. 공지 도메인 테이블들
-- =====================================================

CREATE TABLE public.notice_base (
    notice_id          bigint       NOT NULL,
    title              varchar(200) NOT NULL,
    content            text         NOT NULL,
    notice_level       varchar(10)  NOT NULL,
    notice_status      varchar(30)  NOT NULL,
    affected_service_id bigint,
    sender_org_unit_id   varchar(50),
    sender_org_unit_name varchar(100),
    publish_start_at   timestamp,
    publish_end_at     timestamp,
    is_maintenance     boolean      NOT NULL,
    is_completed       boolean      NOT NULL,
    completed_at       timestamp,
    mail_subject       varchar(300),
    created_at         timestamp    NOT NULL,
    created_by         varchar(50)  NOT NULL,
    updated_at         timestamp    NOT NULL,
    updated_by         varchar(50)  NOT NULL,
    CONSTRAINT notice_level_check CHECK (
      notice_level IN ('L1', 'L2', 'L3')
    )
);
COMMENT ON TABLE  public.notice_base IS '공지 기본 정보';
COMMENT ON COLUMN public.notice_base.notice_id          IS '공지 고유 식별자(PK)';
COMMENT ON COLUMN public.notice_base.title              IS '공지 제목';
COMMENT ON COLUMN public.notice_base.content            IS '공지 상세 내용';
COMMENT ON COLUMN public.notice_base.notice_level       IS '공지 중요도(ENUM: L1 일반, L2 중요, L3 긴급)';
COMMENT ON COLUMN public.notice_base.notice_status      IS '공지 상태(DRAFT, PENDING, APPROVED, SENT, FAILED, COMPLETED)';
COMMENT ON COLUMN public.notice_base.affected_service_id IS '영향받는 서비스 ID(FK) - v1.4 추가';
COMMENT ON COLUMN public.notice_base.sender_org_unit_id   IS '발신 부서 ID';
COMMENT ON COLUMN public.notice_base.sender_org_unit_name IS '발신 부서명';
COMMENT ON COLUMN public.notice_base.publish_start_at   IS '게시 시작 일시';
COMMENT ON COLUMN public.notice_base.publish_end_at     IS '게시 종료 일시';
COMMENT ON COLUMN public.notice_base.is_maintenance     IS '점검/장애 공지 여부';
COMMENT ON COLUMN public.notice_base.is_completed       IS '완료 처리 여부';
COMMENT ON COLUMN public.notice_base.completed_at       IS '완료 처리 일시';
COMMENT ON COLUMN public.notice_base.mail_subject       IS '메일 및 캘린더 일정 제목';
COMMENT ON COLUMN public.notice_base.created_at         IS '등록 일시';
COMMENT ON COLUMN public.notice_base.created_by         IS '등록자';
COMMENT ON COLUMN public.notice_base.updated_at         IS '수정 일시';
COMMENT ON COLUMN public.notice_base.updated_by         IS '수정자';

CREATE TABLE public.notice_approval (
    approval_id      bigint       NOT NULL,
    notice_id        bigint       NOT NULL,
    approval_status  varchar(20)  NOT NULL,
    approver_user_id varchar(50),
    approver_name    varchar(100),
    requested_at     timestamp    NOT NULL,
    decided_at       timestamp,
    reject_reason    varchar(500)
);
COMMENT ON TABLE  public.notice_approval IS '공지 승인 정보';

CREATE TABLE public.notice_send_plan (
    send_plan_id      bigint      NOT NULL,
    notice_id         bigint      NOT NULL,
    send_mode         varchar(20) NOT NULL,
    scheduled_send_at timestamp,
    bundle_key        varchar(80),
    allow_bundle      boolean     NOT NULL
);
COMMENT ON TABLE public.notice_send_plan IS '공지 발송 계획';

CREATE TABLE public.notice_delivery_log (
    delivery_id        bigint       NOT NULL,
    notice_id          bigint       NOT NULL,
    channel            varchar(30)  NOT NULL,
    delivery_status    varchar(20)  NOT NULL,
    sent_at            timestamp,
    attempt_count      integer      NOT NULL,
    last_error         text,
    provider_message_id varchar(120),
    idempotency_key    varchar(80)
);
COMMENT ON TABLE public.notice_delivery_log IS '공지 발송 이력';

CREATE TABLE public.notice_attachment (
    attachment_id bigint        NOT NULL,
    notice_id     bigint        NOT NULL,
    file_name     varchar(255)  NOT NULL,
    size_bytes    bigint        NOT NULL,
    storage_key   varchar(300)  NOT NULL
);
COMMENT ON TABLE public.notice_attachment IS '공지 첨부 파일 메타데이터';

CREATE TABLE public.notice_calendar_event (
    calendar_event_id bigint       NOT NULL,
    notice_id         bigint       NOT NULL,
    resource_mailbox  varchar(120) NOT NULL,
    provider_event_id varchar(120) NOT NULL,
    created_at        timestamp    NOT NULL
);
COMMENT ON TABLE public.notice_calendar_event IS '공지 캘린더 일정 연계';

CREATE TABLE public.notice_target (
    target_id   bigint       NOT NULL,
    notice_id   bigint       NOT NULL,
    target_type varchar(20)  NOT NULL,
    target_key  varchar(80)  NOT NULL,
    target_name varchar(200)
);
COMMENT ON TABLE public.notice_target IS '공지 수신 대상';

CREATE TABLE public.notice_tag (
    tag_id    bigint      NOT NULL,
    notice_id bigint      NOT NULL,
    tag_value varchar(50) NOT NULL
);
COMMENT ON TABLE public.notice_tag IS '공지 해시태그';

CREATE TABLE public.notice_recipient (
    recipient_id bigint     NOT NULL,
    notice_id    bigint     NOT NULL,
    user_id      varchar(50) NOT NULL,
    sent_at      timestamp,
    read_at      timestamp,
    is_read      boolean    NOT NULL,
    created_at   timestamp  NOT NULL
);
COMMENT ON TABLE public.notice_recipient IS '공지 개별 수신자 추적';

-- =====================================================
-- 3. PK / UNIQUE / FK 관계만 정리
-- =====================================================

ALTER TABLE public.corporation_master
  ADD CONSTRAINT corporation_master_pkey PRIMARY KEY (corp_id),
  ADD CONSTRAINT corporation_master_corp_code_key UNIQUE (corp_code);

ALTER TABLE public.organization_master
  ADD CONSTRAINT organization_master_pkey PRIMARY KEY (org_unit_id),
  ADD CONSTRAINT organization_master_org_unit_code_key UNIQUE (org_unit_code);

ALTER TABLE public.service_master
  ADD CONSTRAINT service_master_pkey PRIMARY KEY (service_id),
  ADD CONSTRAINT service_master_service_code_key UNIQUE (service_code);

ALTER TABLE public.user_master
  ADD CONSTRAINT user_master_pkey PRIMARY KEY (user_id);

ALTER TABLE public.notice_base
  ADD CONSTRAINT notice_base_pkey PRIMARY KEY (notice_id);

ALTER TABLE public.notice_approval
  ADD CONSTRAINT notice_approval_pkey PRIMARY KEY (approval_id),
  ADD CONSTRAINT notice_approval_notice_id_key UNIQUE (notice_id);

ALTER TABLE public.notice_send_plan
  ADD CONSTRAINT notice_send_plan_pkey PRIMARY KEY (send_plan_id),
  ADD CONSTRAINT notice_send_plan_notice_id_key UNIQUE (notice_id);

ALTER TABLE public.notice_attachment
  ADD CONSTRAINT notice_attachment_pkey PRIMARY KEY (attachment_id);

ALTER TABLE public.notice_calendar_event
  ADD CONSTRAINT notice_calendar_event_pkey PRIMARY KEY (calendar_event_id);

ALTER TABLE public.notice_delivery_log
  ADD CONSTRAINT notice_delivery_log_pkey PRIMARY KEY (delivery_id);

ALTER TABLE public.notice_target
  ADD CONSTRAINT notice_target_pkey PRIMARY KEY (target_id);

ALTER TABLE public.notice_tag
  ADD CONSTRAINT notice_tag_pkey PRIMARY KEY (tag_id);

ALTER TABLE public.notice_recipient
  ADD CONSTRAINT notice_recipient_pkey PRIMARY KEY (recipient_id);

-- FK 관계
ALTER TABLE public.corporation_master
  ADD CONSTRAINT fk_corp_parent
  FOREIGN KEY (parent_corp_id) REFERENCES public.corporation_master(corp_id) ON DELETE SET NULL;

ALTER TABLE public.organization_master
  ADD CONSTRAINT fk_org_corp   FOREIGN KEY (corp_id)            REFERENCES public.corporation_master(corp_id) ON DELETE RESTRICT,
  ADD CONSTRAINT fk_org_parent FOREIGN KEY (parent_org_unit_id) REFERENCES public.organization_master(org_unit_id) ON DELETE SET NULL;

ALTER TABLE public.user_master
  ADD CONSTRAINT fk_user_corp FOREIGN KEY (corp_id)     REFERENCES public.corporation_master(corp_id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_user_org  FOREIGN KEY (org_unit_id) REFERENCES public.organization_master(org_unit_id) ON DELETE SET NULL;

ALTER TABLE public.notice_base
  ADD CONSTRAINT fk_notice_service
  FOREIGN KEY (affected_service_id) REFERENCES public.service_master(service_id) ON DELETE SET NULL;

ALTER TABLE public.notice_approval
  ADD CONSTRAINT fk_notice_approval
  FOREIGN KEY (notice_id) REFERENCES public.notice_base(notice_id) ON DELETE CASCADE;

ALTER TABLE public.notice_send_plan
  ADD CONSTRAINT fk_notice_send_plan
  FOREIGN KEY (notice_id) REFERENCES public.notice_base(notice_id) ON DELETE CASCADE;

ALTER TABLE public.notice_attachment
  ADD CONSTRAINT fk_notice_attachment
  FOREIGN KEY (notice_id) REFERENCES public.notice_base(notice_id) ON DELETE CASCADE;

ALTER TABLE public.notice_calendar_event
  ADD CONSTRAINT fk_notice_calendar_event
  FOREIGN KEY (notice_id) REFERENCES public.notice_base(notice_id) ON DELETE CASCADE;

ALTER TABLE public.notice_delivery_log
  ADD CONSTRAINT fk_notice_delivery
  FOREIGN KEY (notice_id) REFERENCES public.notice_base(notice_id) ON DELETE CASCADE;

ALTER TABLE public.notice_tag
  ADD CONSTRAINT fk_notice_tag
  FOREIGN KEY (notice_id) REFERENCES public.notice_base(notice_id) ON DELETE CASCADE;

ALTER TABLE public.notice_target
  ADD CONSTRAINT fk_notice_target
  FOREIGN KEY (notice_id) REFERENCES public.notice_base(notice_id) ON DELETE CASCADE;

ALTER TABLE public.notice_recipient
  ADD CONSTRAINT fk_recipient_notice FOREIGN KEY (notice_id) REFERENCES public.notice_base(notice_id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_recipient_user   FOREIGN KEY (user_id)   REFERENCES public.user_master(user_id) ON DELETE CASCADE;
