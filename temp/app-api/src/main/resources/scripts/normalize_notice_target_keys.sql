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
