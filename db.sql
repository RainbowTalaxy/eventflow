create database eventflow character set utf8;
use eventflow;

create table account (
    u_name nchar(20) primary key,
    u_pwd char(20) not null
);

create table team (
    t_id bigint(10) primary key auto_increment,
    t_name nchar(20) not null,
    founder nchar(20) references user(u_name)
);

create table invitation (
    t_id bigint(10) references team(t_id),
    u_name nchar(20) references user(u_name),
    primary key(t_id, u_name)
);

create table member (
    u_name nchar(20) references user(u_name),
    t_id bigint(10) references team(t_id),
    primary key(u_name, t_id)
);

create table flow (
    f_id bigint(10) primary key auto_increment,
    t_id bigint(10) references team(t_id),
    completed text not null,
    current nchar(20) references user(u_name),
    inqueue text not null,
    f_type tinyint(1),
    f_state tinyint(1)
);