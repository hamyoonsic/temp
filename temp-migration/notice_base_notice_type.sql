ALTER TABLE public.notice_base
  ADD COLUMN IF NOT EXISTS notice_type varchar(50);

COMMENT ON COLUMN public.notice_base.notice_type IS '공지 유형';
