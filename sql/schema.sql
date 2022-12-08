drop table if exists users;

create table users (
  user_id int primary key autoincrement,
  email text not null,
  access_token text
);