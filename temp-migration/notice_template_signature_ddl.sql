-- Notice templates & signatures
create table if not exists notice_template (
  template_id bigserial primary key,
  user_id varchar(50) not null,
  name varchar(200) not null,
  content text not null,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

create index if not exists idx_notice_template_user on notice_template (user_id);
create index if not exists idx_notice_template_user_updated on notice_template (user_id, updated_at desc);

create table if not exists notice_signature (
  signature_id bigserial primary key,
  user_id varchar(50) not null,
  name varchar(200) not null,
  content text not null,
  is_default boolean not null default false,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

create index if not exists idx_notice_signature_user on notice_signature (user_id);
create index if not exists idx_notice_signature_user_updated on notice_signature (user_id, updated_at desc);

create table if not exists notice_signature_image (
  image_id bigserial primary key,
  user_id varchar(50) not null,
  file_name varchar(200) not null,
  file_original_name varchar(300),
  file_path varchar(500) not null,
  file_size bigint,
  file_type varchar(100),
  created_at timestamp not null default now()
);

create index if not exists idx_notice_signature_image_user on notice_signature_image (user_id);
create index if not exists idx_notice_signature_image_user_created on notice_signature_image (user_id, created_at desc);
