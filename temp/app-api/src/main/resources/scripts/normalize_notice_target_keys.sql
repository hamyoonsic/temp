-- Normalize notice_target.target_key to numeric IDs.
-- CORP: target_key = corp_id
-- ORG_UNIT: target_key = org_unit_id

UPDATE notice_target nt
SET target_key = cm.corp_id::text
FROM corporation_master cm
WHERE nt.target_type = 'CORP'
  AND nt.target_key = cm.corp_code;

UPDATE notice_target nt
SET target_key = om.org_unit_id::text
FROM organization_master om
WHERE nt.target_type = 'ORG_UNIT'
  AND nt.target_key = om.org_unit_code;

UPDATE notice_target nt
SET target_name = cm.corp_name || ' / ' || om.org_unit_name
FROM organization_master om
JOIN corporation_master cm
  ON om.corp_id = cm.corp_id
WHERE nt.target_type = 'ORG_UNIT'
  AND nt.target_key = om.org_unit_id::text;

 
 
 
 
 
 
 -- notice_template
CREATE TABLE notice_template (
  template_id BIGSERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  name VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notice_template_user
  ON notice_template (user_id);

-- notice_signature
CREATE TABLE notice_signature (
  signature_id BIGSERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  name VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notice_signature_user
  ON notice_signature (user_id);

CREATE INDEX idx_notice_signature_user_default
  ON notice_signature (user_id, is_default);

-- updated_at 자동 갱신용 트리거 (PostgreSQL)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_notice_template_updated_at
BEFORE UPDATE ON notice_template
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_notice_signature_updated_at
BEFORE UPDATE ON notice_signature
FOR EACH ROW EXECUTE FUNCTION set_updated_at();


select * from user_master um ;

select * from organization_master om ;

select * 
from notice_base 

select * from notice_send_plan nsp ;


ALTER TABLE public.notice_base
  ADD COLUMN IF NOT EXISTS notice_type varchar(50);

COMMENT ON COLUMN public.notice_base.notice_type IS '공지 유형';
